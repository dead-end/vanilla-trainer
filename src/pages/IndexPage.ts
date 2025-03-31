import { tmplClone, tmplCreate } from '../lib/utils';

export class IndexPage extends HTMLElement {
  static TMPL = tmplCreate(`
<page-layout label="Home">
  <p>Welcome to the Vanilla Trainer</p>
</page-layout>
`);

  initialized = false;
  constructor() {
    super();
  }

  connectedCallback() {
    if (!this.initialized) {
      const tmpl = tmplClone(IndexPage.TMPL);
      this.appendChild(tmpl);
      this.initialized = true
    }
  }
}
