import { $, tmplClone } from '../../lib/utils';

export class UiInput extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#tmpl-ui-input');
  initialized = false;

  static formAssociated = true;
   _internals: ElementInternals;
  inputElem: HTMLInputElement | undefined;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    this._internals = this.attachInternals();
    
  }

  connectedCallback() {
    if (!this.initialized) {
      const tmpl = tmplClone(UiInput.TMPL);

      const labelElem = $<HTMLLabelElement>('label', tmpl);
     this.inputElem = $<HTMLInputElement>('input', tmpl);
      const errElem = $<HTMLParagraphElement>('p', tmpl);

      const id = this.getAttribute('data-id') || 'no-id';

      labelElem.htmlFor = id;
      this.inputElem.id = id;
      this.setAttribute('name', id)
   // this._internals.name = id
      errElem.setAttribute('data-error', id);

      labelElem.textContent = this.getAttribute('data-label') || 'no-label';
      this.inputElem.type = this.getAttribute('data-type') || 'text';

     // this.appendChild(tmpl);
     this.shadowRoot?.appendChild(tmpl)
      this.initialized = true;

      this._internals.setFormValue(this.inputElem.value);
      this.inputElem.addEventListener("input", () => this.handleInput());
    }
  }

  private handleInput() {
    if (this.inputElem) {
      console.log('new data:', this.inputElem.value)
      this._internals.setFormValue(this.inputElem.value);
    }
    
  }
}
