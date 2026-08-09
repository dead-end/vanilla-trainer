import { createFragment } from '../../lib/html/createFragment';
import { html } from '../../lib/html/html';
import { mdToHtml } from '../../lib/markdown';
import { STYLES } from '../../lib/ui/stylesheets';
import { $ } from '../../lib/utils/query';

const COMP_FRAG = createFragment(/* html */ html`
  <div class="is-grid-2">
    <slot></slot>
    <div
      id="preview"
      class="is-border is-shadow is-padding-input is-multiline"
    ></div>
  </div>
`);

/**
 * The class implements the preview field, which contains the content of a
 * corresponding input field, where the md is replaced with html.
 *
 * The id is the id of the corresponding input field.
 */
export class PreviewField extends HTMLElement {
  id: string;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.adoptedStyleSheets = STYLES;
    shadow.appendChild(COMP_FRAG.cloneNode(true));

    this.id = this.getAttribute('data-id') || 'no-id';
  }

  connectedCallback() {
    if (this.shadowRoot !== null) {
      const input = $<HTMLTextAreaElement>(`#${this.id}`);
      const preview = $<HTMLElement>('#preview', this.shadowRoot);

      input.oninput = () => {
        console.log('input');
        preview.innerHTML = mdToHtml(input.value);
      };
    }
  }

  disconnectedCallback() {
    if (this.shadowRoot !== null) {
      $<HTMLTextAreaElement>(`#${this.id}`).oninput = null;
    }
  }
}
