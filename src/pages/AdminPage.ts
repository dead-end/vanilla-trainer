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
  static TMPL = $<HTMLTemplateElement>('#admin');
  button: HTMLButtonElement;
  status: HTMLElement;

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });
    const tmpl = tmplClone(AdminPage.TMPL);

    this.status = $<HTMLElement>('#status', tmpl);
    this.button = $<HTMLButtonElement>('#login', tmpl);
    this.button.onclick = this.handleButton.bind(this);

    this.handleLoginStatus(adminIsLogin());

    shadow.appendChild(tmpl);
  }

  handleButton(e: Event) {
    const isLogin = adminIsLogin();
    if (isLogin) {
      adminLogout();
    } else {
      adminLogin('url', 'token');
    }

    this.handleLoginStatus(!isLogin);
  }

  handleLoginStatus(isLogin: boolean) {
    this.status.textContent = `Login: ${isLogin}`;
    this.button.textContent = isLogin ? 'Logout' : 'login';
  }
}
