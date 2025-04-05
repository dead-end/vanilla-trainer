import { $, tmplClone } from '../lib/utils';

export class NotFoundPage extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#page-not-found');

  initialized = false;
  constructor() {
    super();
  }

  connectedCallback() {
    if (!this.initialized) {
      const tmpl = tmplClone(NotFoundPage.TMPL);
      this.appendChild(tmpl);
      this.initialized = true;
    }
  }
}
