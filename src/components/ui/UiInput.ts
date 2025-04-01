import { $, tmplClone, tmplCreate } from '../../lib/utils';

export class UiInput extends HTMLElement {
  static TMPL = tmplCreate(`
    <div>
      <label class="field-label" for="default-id">Default Label</label>
      <input class="input-text" id="default-id" type="text" />
      <p class="field-error" data-error="default-id"></p>
    </div>
`);

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
