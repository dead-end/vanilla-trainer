import { STYLES } from '../lib/ui/stylesheets';
import { $ } from '../lib/utils/query';
import { tmplClone } from '../lib/utils/tmpl';

export class ConfirmDialog extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#tmpl-confirm-dialog');
  fct: (() => Promise<void>) | undefined;

  connectedCallback() {
    if (!this.shadowRoot) {
      const tmpl = tmplClone(ConfirmDialog.TMPL);

      const shadow = this.attachShadow({ mode: 'open' });
      shadow.adoptedStyleSheets = STYLES;
      shadow.appendChild(tmpl);

      $<HTMLElement>('#btn-cancel', shadow).onclick = this.onCancel.bind(this);
      $<HTMLElement>('#btn-ok', shadow).onclick = this.onOk.bind(this);

      this.style.display = 'none';
    }
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
