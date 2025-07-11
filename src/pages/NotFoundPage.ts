import { $ } from '../lib/utils/query';
import { tmplClone } from '../lib/utils/tmpl';

export class NotFoundPage extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#not-found-page');

  connectedCallback() {
    if (!this.hasChildNodes()) {
      const tmpl = tmplClone(NotFoundPage.TMPL);
      this.appendChild(tmpl);
    }
  }
}
