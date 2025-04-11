import { $, tmplClone } from '../lib/utils';

export class PageHeader extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#tmpl-page-header');
  init = false;

  constructor() {
    super();
  }

  connectedCallback() {
    if (!this.init) {
      const tmpl = tmplClone(PageHeader.TMPL);
      $('[data-id="title"]', tmpl).textContent =
        this.getAttribute('data-title') || 'No-title';
      this.appendChild(tmpl);
      this.init = true;
    }
  }
}
