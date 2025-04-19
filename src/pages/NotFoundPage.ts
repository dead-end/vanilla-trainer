import { $, tmplClone } from '../lib/utils';

export class NotFoundPage extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#page-not-found');

  connectedCallback() {
    if (!this.hasChildNodes()) {
      const tmpl = tmplClone(NotFoundPage.TMPL);
      this.appendChild(tmpl);
    }
  }
}
