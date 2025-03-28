import { $, tmplCreate, tmplClone } from '../lib/utils';

export class Table extends HTMLElement {
  static tableTmpl = tmplCreate(`
<table>
    <thead>
        <tr>
            <th>Id</th>
            <th>Value</th>
        </tr>
    </thead>
    <tbody></tbody>
</table>
<button>Update</button>
`);

  static rowTmpl = tmplCreate(`
<tr>
    <td data-id></td>
    <td data-value></td>
</tr>
`);

  tBody: Element;

  constructor() {
    super();

    this.appendChild(tmplClone(Table.tableTmpl));

    this.tBody = $('tbody', this);

    $<HTMLButtonElement>('button', this).onclick = (() => {
      const me = this;
      return () => me.render();
    })();
  }

  connectedCallback() {
    this.render();
    console.log('Custom element added to page.');
  }

  render() {
    const date = new Date();
    const datas = [
      {
        id: '1',
        value: 'value-1 ' + date.toISOString(),
      },
      {
        id: '2',
        value: 'value-3 ' + date.toISOString(),
      },
      {
        id: '3',
        value: 'value-3' + date.toISOString(),
      },
    ];

    const rows: Node[] = datas.map((data) => {
      const tmpl = tmplClone(Table.rowTmpl);
      $('[data-id]', tmpl).textContent = data.id;
      $('[data-value]', tmpl).textContent = data.value;
      return tmpl;
    });

    this.tBody.replaceChildren(...rows);
  }
}
