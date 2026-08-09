import { createFragment } from '../../lib/html/createFragment';
import { html } from '../../lib/html/html';
import { STYLES } from '../../lib/ui/stylesheets';
import { $ } from '../../lib/utils/query';

const COMP_FRAG = createFragment(/* html */ html`
  <div class="is-column is-gap-small">
    <label class="is-small is-text-bold" for="default-id">Default Label</label>
    <slot></slot>
    <p class="is-error is-small" id="error"></p>
  </div>
`);

/**
 * The class implements a wrapper around an input field. It provides a label.
 * So it needs the id of the input field and the label text as fixed
 * attributes.
 * In case of an validation error it uses a dynamic attribute with the error
 * message.
 */
export class UiField extends HTMLElement {
  static observedAttributes = ['data-error'];

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.adoptedStyleSheets = STYLES;
    shadow.appendChild(COMP_FRAG.cloneNode(true));
  }

  connectedCallback() {
    if (this.shadowRoot !== null) {
      const id = this.getAttribute('data-id') || 'no-id';
      const label = $<HTMLLabelElement>('label', this.shadowRoot);
      label.htmlFor = id;
      label.textContent = this.getAttribute('data-label') || 'no-label';
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
