import { STYLES } from '../lib/ui/stylesheets';
import { $ } from '../lib/utils/query';
import { tmplClone } from '../lib/utils/tmpl';

export class ErrorMsg extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#tmpl-error');

  connectedCallback() {
    if (!this.shadowRoot) {
      const tmpl = tmplClone(ErrorMsg.TMPL);
      $<HTMLElement>('#error-btn', tmpl).onclick = this.onOk.bind(this);

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
