import { tmplClone, tmplCreate } from '../lib/utils';

export class AdminPage extends HTMLElement {
  static TMPL = tmplCreate(`
<page-layout label="Admin">
  <p>This is the admin page</p>
</page-layout>
`);

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });
    const tmpl = tmplClone(AdminPage.TMPL);
    shadow.appendChild(tmpl);
  }
}
