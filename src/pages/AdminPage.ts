import { adminGet, adminLogin } from '../lib/admin';
import { errorExists, errorReset, errorSet } from '../lib/error';
import { $, tmplClone } from '../lib/utils';

export class AdminPage extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#page-admin');

  _form: HTMLFormElement | undefined;
  _user: HTMLInputElement | undefined;
  _repo: HTMLInputElement | undefined;
  _token: HTMLInputElement | undefined;

  constructor() {
    super();
  }

  connectedCallback() {
    if (!this._form) {
      const tmpl = tmplClone(AdminPage.TMPL);

      this._form = $<HTMLFormElement>('form', tmpl);
      this._form.onsubmit = this.handleSubmit.bind(this);

      this.appendChild(tmpl);

      this._user = $<HTMLInputElement>('#user', this._form);
      this._repo = $<HTMLInputElement>('#repo', this._form);
      this._token = $<HTMLInputElement>('#token', this._form);

      document.addEventListener('logout', this.onLogout.bind(this));

      this.getAdmin();
    }
  }

  handleSubmit(e: SubmitEvent) {
    e.preventDefault();

    if (!this._user || !this._repo || !this._token) {
      throw new Error('Not initialized!');
    }

    errorReset(this);

    if (!this._user.value) {
      errorSet(this, 'user', 'Please enter a value!');
    }
    if (!this._repo.value) {
      errorSet(this, 'repo', 'Please enter a value!');
    }
    if (!this._token.value) {
      errorSet(this, 'token', 'Please enter a value!');
    }

    if (!errorExists(this)) {
      adminLogin(this._user.value, this._repo.value, this._token.value);
    }
  }

  async getAdmin() {
    if (!this._user || !this._repo || !this._token) {
      throw new Error('Not initialized!');
    }

    const admin = await adminGet();
    this._user.value = admin.user;
    this._repo.value = admin.repo;
    this._token.value = admin.token;
  }

  onLogout() {
    this.getAdmin();
  }
}
