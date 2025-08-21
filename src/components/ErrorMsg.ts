import { createFragment } from '../lib/html/createFragment';
import { html } from '../lib/html/html';
import { STYLES } from '../lib/ui/stylesheets';
import { $ } from '../lib/utils/query';

export class ErrorMsg extends HTMLElement {
  connectedCallback() {
    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: 'open' });
      shadow.adoptedStyleSheets = STYLES;
      shadow.appendChild(this.renderComponent());

      this.style.display = 'none';
    }
  }

  renderComponent() {
    const str = /* html */ html`
      <div class="is-column is-gap is-border is-padding">
        <div class="is-error is-text-bold is-text-larg">Error</div>
        <p id="error-msg"></p>
        <div class="is-row is-gap">
          <button id="error-btn" class="btn" type="button">Ok</button>
        </div>
      </div>
    `;
    const frag = createFragment(str);

    $<HTMLElement>('#error-btn', frag).onclick = this.onOk.bind(this);

    document.addEventListener('error-msg', this.onError.bind(this));

    return frag;
  }

  onError(e: Event) {
    if (this.shadowRoot) {
      const detail = (e as CustomEvent).detail;
      $('#error-msg', this.shadowRoot).textContent = detail;
      this.style.display = 'block';
    }
  }

  onOk() {
    if (this.shadowRoot) {
      $('#error-msg', this.shadowRoot).textContent = '';
      this.style.display = 'none';
    }
  }
}
