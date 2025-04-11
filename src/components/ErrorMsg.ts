import { $, tmplClone } from '../lib/utils';

export class ErrorMsg extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#tmpl-error');

  _error: HTMLElement | undefined;

  constructor() {
    super();
  }

  connectedCallback() {
    if (!this._error) {
      const tmpl = tmplClone(ErrorMsg.TMPL);
      this._error = $('#error-msg', tmpl);

      this.appendChild(tmpl);

      document.addEventListener('error-msg', this.onError.bind(this));
      $('#error-btn', this).onclick = this.onOk.bind(this);

      this.style.display = 'none';
    }
  }

  onError(e: Event) {
    console.log('on error');
    if (!this._error) {
      return;
    }
    const detail = (e as CustomEvent).detail;
    this._error.textContent = detail;
    this.style.display = 'block';
  }

  onOk() {
    if (!this._error) {
      return;
    }
    this._error.textContent = '';
    this.style.display = 'none';
  }
}
