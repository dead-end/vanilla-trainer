import { adminIsLogin, adminLogin, adminLogout } from '../lib/admin';
import { errorReset, errorSet } from '../lib/error';
import { $, tmplClone } from '../lib/utils';

export class AdminPage extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#admin-page');

  form: HTMLFormElement | undefined;

  constructor() {
    super();
    console.log('AdminPage created.');
  }

  connectedCallback() {
    if (!this.form) {
      const tmpl = tmplClone(AdminPage.TMPL);

      $<HTMLButtonElement>('#login', tmpl).onclick =
        this.handleButton.bind(this);

      this.form = $<HTMLFormElement>('form', tmpl);
      this.form.onsubmit = this.handleSubmit.bind(this);
      this.appendChild(tmpl);
      this.handleLoginStatus(adminIsLogin());
      console.log('AdminPage initialized.');
    }
  }

  handleSubmit(e: SubmitEvent) {
    e.preventDefault();

    errorReset(this)

    const user = $<HTMLInputElement>('#user', this.form).value;
    const repo = $<HTMLInputElement>('#repo', this.form).value;
    const token = $<HTMLInputElement>('#token', this.form).value;
    console.log('url', user, 'repo', repo, 'token', token);
    if (!user) {
      errorSet(this, 'user', 'Not-defined!')
    }
    if (!repo) {
      errorSet(this, 'repo', 'Not-defined!')
    }
    if (!token) {
      errorSet(this, 'token', 'Not-defined!')
    }
  }

  handleButton() {
    const isLogin = adminIsLogin();
    if (isLogin) {
      adminLogout();
    } else {
      adminLogin('url', 'token');
    }

    this.handleLoginStatus(!isLogin);
  }

  handleLoginStatus(isLogin: boolean) {
    $('#status', this).textContent = `Login: ${isLogin}`;
    $('#login', this).textContent = isLogin ? 'Logout' : 'login';
  }
}
