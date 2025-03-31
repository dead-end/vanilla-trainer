import { adminIsLogin, adminLogin, adminLogout } from '../lib/admin';
import { $, tmplClone, tmplCreate } from '../lib/utils';

export class AdminPage extends HTMLElement {
  /*
  static TMPL = tmplCreate(`
<page-layout label="Admin">
  <p>This is the admin page</p>
</page-layout>
`);
*/
  static TMPL = $<HTMLTemplateElement>('#admin-page');
  button: HTMLButtonElement | undefined;
  status: HTMLElement | undefined;

  constructor() {
    super();
  }

  connectedCallback() {

    if (!this.button && !this.status) {
      const tmpl = tmplClone(AdminPage.TMPL);

      this.status = $<HTMLElement>('#status', tmpl);
      this.button = $<HTMLButtonElement>('#login', tmpl);
      this.button.onclick = this.handleButton.bind(this);
  
      this.handleLoginStatus(adminIsLogin());
      this.appendChild(tmpl);
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
    if (this.button && this.status) {
      this.status.textContent = `Login: ${isLogin}`;
      this.button.textContent = isLogin ? 'Logout' : 'login';
    }
  }
}
