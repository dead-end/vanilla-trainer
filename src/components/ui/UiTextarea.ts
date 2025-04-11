import { $, tmplClone } from '../../lib/utils';

export class UiTextarea extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#tmpl-ui-textarea');
  initialized = false;

  constructor() {
    super();
  }

  connectedCallback() {
    if (!this.initialized) {
      const tmpl = tmplClone(UiTextarea.TMPL);

      const labelElem = $<HTMLLabelElement>('label', tmpl);
      const areaElem = $<HTMLInputElement>('textarea', tmpl);
      const errElem = $<HTMLParagraphElement>('p', tmpl);

      const id = this.getAttribute('data-id') || 'no-id';

      labelElem.htmlFor = id;
      areaElem.id = id;
      errElem.setAttribute('data-error', id);

      labelElem.textContent = this.getAttribute('data-label') || 'no-label';

      this.appendChild(tmpl);
      this.initialized = true;
    }
  }
}
