import { adminGet, adminLogin } from '../lib/admin';
import { errorExists, errorReset, errorSet } from '../lib/error';
import { $, tmplClone } from '../lib/utils';

export class AdminPage extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#page-admin');

  form: HTMLFormElement | undefined;

  constructor() {
    super();
  }

  connectedCallback() {
    if (!this.form) {
      const tmpl = tmplClone(AdminPage.TMPL);
      this.form = $<HTMLFormElement>('form', tmpl);
      this.form.onsubmit = this.handleSubmit.bind(this);
      this.appendChild(tmpl);

      document.addEventListener('logout', this.onLogout.bind(this));
    }

    this.getAdmin();
  }

  handleSubmit(e: SubmitEvent) {
    e.preventDefault();

    errorReset(this);

    const user = $<HTMLInputElement>('#user', this.form).value;
    const repo = $<HTMLInputElement>('#repo', this.form).value;
    const token = $<HTMLInputElement>('#token', this.form).value;

    console.log('url', user, 'repo', repo, 'token', token);
    if (!user) {
      errorSet(this, 'user', 'Not-defined!');
    }
    if (!repo) {
      errorSet(this, 'repo', 'Not-defined!');
    }
    if (!token) {
      errorSet(this, 'token', 'Not-defined!');
    }

    if (!errorExists(this)) {
      adminLogin(user, repo, token);
    }
  }

  getAdmin() {
    const admin = adminGet();
    $<HTMLInputElement>('#user', this.form).value = admin.user;
    $<HTMLInputElement>('#repo', this.form).value = admin.repo;
    $<HTMLInputElement>('#token', this.form).value = admin.token;
  }

  onLogout() {
    this.getAdmin();
  }
}
