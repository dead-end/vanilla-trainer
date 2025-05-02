import { STYLES } from '../lib/ui/stylesheets';
import { $, tmplClone } from '../lib/utils';

export class InfoTable extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#tmpl-info-table');
  static TMPL_ROW = $<HTMLTemplateElement>('#tmpl-info-row');

  connectedCallback() {
    if (!this.shadowRoot) {
      const tmpl = tmplClone(InfoTable.TMPL);

      const shadow = this.attachShadow({ mode: 'open' });
      shadow.adoptedStyleSheets = STYLES;
      shadow.appendChild(tmpl);
    }
  }

  update(data: { key: string; value: string }[]) {
    if (this.shadowRoot) {
      const arr: DocumentFragment[] = [];

      data.forEach((d) => {
        const tmpl = tmplClone(InfoTable.TMPL_ROW);
        $<HTMLElement>('[data-id="key"]', tmpl).textContent = d.key;
        $<HTMLElement>('[data-id="value"]', tmpl).textContent = d.value;
        arr.push(tmpl);
      });

      $<HTMLElement>('table', this.shadowRoot).replaceChildren(...arr);
    }
  }
}
