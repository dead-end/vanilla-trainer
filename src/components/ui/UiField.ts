import { STYLES } from '../../lib/ui/stylesheets';
import { $ } from '../../lib/utils/query';
import { tmplClone } from '../../lib/utils/tmpl';

export class UiField extends HTMLElement {
  static observedAttributes = ['data-error'];
  static TMPL = $<HTMLTemplateElement>('#tmpl-ui-field');

  connectedCallback() {
    if (!this.shadowRoot) {
      const id = this.getAttribute('data-id') || 'no-id';

      const tmpl = tmplClone(UiField.TMPL);
      const label = $<HTMLLabelElement>('label', tmpl);
      label.htmlFor = id;
      label.textContent = this.getAttribute('data-label') || 'no-label';

      const shadow = this.attachShadow({ mode: 'open' });
      shadow.adoptedStyleSheets = STYLES;
      shadow.appendChild(tmpl);
    }
  }

  attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
    if (this.shadowRoot) {
      if (name === 'data-error') {
        $<HTMLElement>('#error', this.shadowRoot).textContent = newValue;
      }
    }
  }
}
