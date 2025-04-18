import { STYLES } from '../../lib/ui/stylesheets';
import { $, tmplClone } from '../../lib/utils';

export class UiField extends HTMLElement {
  static observedAttributes = ['data-error'];
  static TMPL = $<HTMLTemplateElement>('#tmpl-ui-field');

  private _error: HTMLElement;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).adoptedStyleSheets = STYLES;

    const tmpl = tmplClone(UiField.TMPL);

    const id = this.getAttribute('data-id') || 'no-id';

    const label = $<HTMLLabelElement>('label', tmpl);
    label.htmlFor = id;
    label.textContent = this.getAttribute('data-label') || 'no-label';

    this._error = $<HTMLElement>('#error', tmpl);

    this.shadowRoot?.appendChild(tmpl);
  }

  attributeChangedCallback(_name: string, _oldValue: string, newValue: string) {
    if (_name === 'data-error') {
      this._error.textContent = newValue;
    }
  }
}
