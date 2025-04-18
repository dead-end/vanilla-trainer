import { $, tmplClone } from '../lib/utils';

export class ErrorMsg extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#tmpl-error');

  _error: HTMLElement;

  constructor() {
    super();

    const tmpl = tmplClone(ErrorMsg.TMPL);
    this._error = $('#error-msg', tmpl);
    $('#error-btn', tmpl).onclick = this.onOk.bind(this);

    this.shadowRoot?.appendChild(tmpl);

    document.addEventListener('error-msg', this.onError.bind(this));

    this.style.display = 'none';
  }

  onError(e: Event) {
    const detail = (e as CustomEvent).detail;
    this._error.textContent = detail;
    this.style.display = 'block';
  }

  onOk() {
    this._error.textContent = '';
    this.style.display = 'none';
  }
}
