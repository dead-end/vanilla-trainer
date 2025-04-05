import { $, tmplClone } from '../../lib/utils';

export class UiInput extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#tmpl-ui-input');
  initialized = false;

  constructor() {
    super();
  }

  connectedCallback() {
    if (!this.initialized) {
      const tmpl = tmplClone(UiInput.TMPL);

      const labelElem = $<HTMLLabelElement>('label', tmpl);
      const inputElem = $<HTMLInputElement>('input', tmpl);
      const errElem = $<HTMLParagraphElement>('p', tmpl);

      const id = this.getAttribute('data-id') || 'no-id';

      labelElem.htmlFor = id;
      inputElem.id = id;
      errElem.setAttribute('data-error', id);

      labelElem.textContent = this.getAttribute('data-label') || 'no-label';
      inputElem.type = this.getAttribute('data-type') || 'text';

      this.appendChild(tmpl);
      this.initialized = true;
    }
  }
}
