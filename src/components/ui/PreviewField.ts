import { createFragment } from '../../lib/html/createFragment';
import { html } from '../../lib/html/html';
import { mdToHtml } from '../../lib/markdown';
import { STYLES } from '../../lib/ui/stylesheets';
import { $ } from '../../lib/utils/query';

export class PreviewField extends HTMLElement {
  connectedCallback() {
    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: 'open' });
      shadow.adoptedStyleSheets = STYLES;
      shadow.appendChild(this.renderComponent());
    }
  }

  renderComponent() {
    const str = /* html */ html`
      <div class="is-grid-2">
        <slot></slot>
        <div
          id="preview"
          class="is-border is-shadow is-padding-input is-multiline"
        ></div>
      </div>
    `;

    const frag = createFragment(str);

    const id = this.getAttribute('data-id') || 'no-id';
    const input = $<HTMLTextAreaElement>(`#${id}`);
    const preview = $<HTMLElement>('#preview', frag);

    input.oninput = () => {
      console.log('input');
      preview.innerHTML = mdToHtml(input.value);
    };

    return frag;
  }
}
