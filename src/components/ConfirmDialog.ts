import { createFragment } from '../lib/html/createFragment';
import { html } from '../lib/html/html';
import { STYLES } from '../lib/ui/stylesheets';
import { $ } from '../lib/utils/query';

// TODO: use dialog tag
export class ConfirmDialog extends HTMLElement {
  fct: (() => Promise<void>) | undefined;

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
      <style>
        .popup {
          position: fixed;
          z-index: 1;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.4);
        }

        .popup-content {
          margin: auto;
          max-width: 25rem;
          background: var(--color-bg);
          color: var(--color-fg);
          margin-top: 10%;
          padding: 1.8rem;
        }

        .title {
          border-bottom: var(--border-size) solid var(--border-color);
          padding-bottom: 0.8rem;
        }
      </style>

      <div class="popup">
        <div class="popup-content is-column is-gap is-border">
          <div id="dialog-title" class="title is-text-bold is-text-large">
            title
          </div>
          <p id="dialog-msg">Message</p>
          <div class="is-row is-gap">
            <button id="btn-cancel" class="btn" type="button">Cancel</button>
            <button id="btn-ok" class="btn" type="button">Ok</button>
          </div>
        </div>
      </div>
    `;

    const frag = createFragment(str);

    $<HTMLElement>('#btn-cancel', frag).onclick = this.onCancel.bind(this);
    $<HTMLElement>('#btn-ok', frag).onclick = this.onOk.bind(this);

    return frag;
  }

  onCancel() {
    if (this.shadowRoot) {
      this.style.display = 'none';
    }
  }

  async onOk() {
    if (this.shadowRoot && this.fct) {
      const btn = $<HTMLButtonElement>('#btn-ok', this.shadowRoot);
      btn.disabled = true;
      this.fct().finally(() => {
        this.style.display = 'none';
        btn.disabled = false;
      });
    }
  }

  activate(title: string, msg: string, fct: () => Promise<void>) {
    if (this.shadowRoot) {
      $<HTMLElement>('#dialog-title', this.shadowRoot).textContent = title;
      $<HTMLElement>('#dialog-msg', this.shadowRoot).textContent = msg;
      this.style.display = 'block';
      this.fct = fct;
    }
  }
}
