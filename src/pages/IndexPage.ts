import { $, tmplClone } from '../lib/utils';

export class IndexPage extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#page-index');
  initialized = false;
  constructor() {
    super();
  }

  connectedCallback() {
    if (!this.initialized) {
      const tmpl = tmplClone(IndexPage.TMPL);
      this.appendChild(tmpl);
      this.initialized = true;
    }
  }
}
