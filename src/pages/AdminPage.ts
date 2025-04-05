import { adminGet, adminLogin } from '../lib/admin';
import { errorExists, errorReset, errorSet } from '../lib/error';
import { $, tmplClone } from '../lib/utils';

export class AdminPage extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#page-admin');

  form: HTMLFormElement | undefined;
  user: HTMLInputElement | undefined;
  repo: HTMLInputElement | undefined;
  token: HTMLInputElement | undefined;

  constructor() {
    super();
  }

  connectedCallback() {
    if (!this.form) {
      const tmpl = tmplClone(AdminPage.TMPL);

      this.form = $<HTMLFormElement>('form', tmpl);
      this.form.onsubmit = this.handleSubmit.bind(this);

      this.appendChild(tmpl);

      this.user = $<HTMLInputElement>('#user', this.form);
      this.repo = $<HTMLInputElement>('#repo', this.form);
      this.token = $<HTMLInputElement>('#token', this.form);

      document.addEventListener('logout', this.onLogout.bind(this));
    }

    this.getAdmin();
  }

  handleSubmit(e: SubmitEvent) {
    e.preventDefault();

    if (!this.user || !this.repo || !this.token) {
      throw new Error('Not initialized!');
    }

    errorReset(this);

    if (!this.user.value) {
      errorSet(this, 'user', 'Please enter a value!');
    }
    if (!this.repo.value) {
      errorSet(this, 'repo', 'Please enter a value!');
    }
    if (!this.token.value) {
      errorSet(this, 'token', 'Please enter a value!');
    }

    if (!errorExists(this)) {
      adminLogin(this.user.value, this.repo.value, this.token.value);
    }
  }

  getAdmin() {
    if (!this.user || !this.repo || !this.token) {
      throw new Error('Not initialized!');
    }

    const admin = adminGet();
    this.user.value = admin.user;
    this.repo.value = admin.repo;
    this.token.value = admin.token;
  }

  onLogout() {
    this.getAdmin();
  }
}
