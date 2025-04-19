import { STYLES } from '../lib/ui/stylesheets';
import { $, tmplClone } from '../lib/utils';

export class ErrorMsg extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#tmpl-error');

  connectedCallback() {
    if (!this.shadowRoot) {
      const tmpl = tmplClone(ErrorMsg.TMPL);
      $('#error-btn', tmpl).onclick = this.onOk.bind(this);

      const shadow = this.attachShadow({ mode: 'open' });
      shadow.adoptedStyleSheets = STYLES;
      shadow.appendChild(tmpl);

      document.addEventListener('error-msg', this.onError.bind(this));
      this.style.display = 'none';
    }
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
