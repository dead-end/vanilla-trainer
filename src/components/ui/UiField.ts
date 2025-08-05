import { createFragment } from '../../lib/html/createFragment';
import { html } from '../../lib/html/html';
import { STYLES } from '../../lib/ui/stylesheets';
import { $ } from '../../lib/utils/query';

export class UiField extends HTMLElement {
  static observedAttributes = ['data-error'];

  connectedCallback() {
    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: 'open' });
      shadow.adoptedStyleSheets = STYLES;
      shadow.appendChild(this.renderComponent());
    }
  }

  attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
    if (this.shadowRoot) {
      if (name === 'data-error') {
        $<HTMLElement>('#error', this.shadowRoot).textContent = newValue;
      }
    }
  }

  renderComponent() {
    const str = /* html */ html`
      <div class="is-column is-gap-small">
        <label class="is-small is-text-bold" for="default-id"
          >Default Label</label
        >
        <slot></slot>
        <p class="is-error is-small" id="error"></p>
      </div>
    `;

    const frag = createFragment(str);

    const id = this.getAttribute('data-id') || 'no-id';
    const label = $<HTMLLabelElement>('label', frag);
    label.htmlFor = id;
    label.textContent = this.getAttribute('data-label') || 'no-label';

    return frag;
  }
}
