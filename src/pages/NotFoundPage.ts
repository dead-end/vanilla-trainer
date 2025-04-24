import { $, tmplClone } from '../lib/utils';

export class NotFoundPage extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#not-found-page');

  connectedCallback() {
    if (!this.hasChildNodes()) {
      const tmpl = tmplClone(NotFoundPage.TMPL);
      this.appendChild(tmpl);
    }
  }
}
