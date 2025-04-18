import { adminGet, adminLogin } from '../lib/admin';
import { fieldErrorExists, fieldErrorReset } from '../lib/ui/fieldError';
import { STYLES } from '../lib/ui/stylesheets';
import { $, tmplClone } from '../lib/utils';
import { fieldRequired } from '../lib/ui/validate';

export class AdminPage extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#page-admin');

  _form: HTMLFormElement;
  _user: HTMLInputElement;
  _repo: HTMLInputElement;
  _token: HTMLInputElement;

  constructor() {
    super();

    this.attachShadow({ mode: 'open' }).adoptedStyleSheets = STYLES;

    const tmpl = tmplClone(AdminPage.TMPL);

    this._form = $<HTMLFormElement>('form', tmpl);
    this._user = $<HTMLInputElement>('#user', this._form);
    this._repo = $<HTMLInputElement>('#repo', this._form);
    this._token = $<HTMLInputElement>('#token', this._form);

    this._form.onsubmit = this.handleSubmit.bind(this);
    document.addEventListener('logout', this.onLogout.bind(this));

    this.shadowRoot?.appendChild(tmpl);
  }

  connectedCallback() {
    this.getAdmin();
  }

  handleSubmit(e: SubmitEvent) {
    e.preventDefault();

    fieldErrorReset(this._form);

    fieldRequired(this._form, 'user', this._user.value);
    fieldRequired(this._form, 'repo', this._repo.value);
    fieldRequired(this._form, 'token', this._token.value);

    if (!fieldErrorExists(this._form)) {
      adminLogin(this._user.value, this._repo.value, this._token.value);
    }
  }

  async getAdmin() {
    const admin = await adminGet();
    this._user.value = admin.user;
    this._repo.value = admin.repo;
    this._token.value = admin.token;
  }

  onLogout() {
    this.getAdmin();
  }
}
