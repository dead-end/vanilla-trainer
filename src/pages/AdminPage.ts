import { adminIsLogin, adminLogin, adminLogout } from '../lib/admin';
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

    const url = $<HTMLInputElement>('#url', this.form).value;
    const token = $<HTMLInputElement>('#token', this.form).value;
    console.log('url', url, 'token', token);
    if (!url) {
      $('p[data-for="url"]', this.form).textContent = 'not defined';
    }
    if (!token) {
      $('p[data-for="token"]', this.form).textContent = 'not defined';
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
