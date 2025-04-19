import { $, tmplClone } from '../lib/utils';

export class IndexPage extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#page-index');

  connectedCallback() {
    if (!this.hasChildNodes()) {
      const tmpl = tmplClone(IndexPage.TMPL);
      this.appendChild(tmpl);
    }
  }
}
