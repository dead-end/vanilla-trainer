import { adminLogout } from '../lib/admin';
import { $, tmplClone } from '../lib/utils';

export class Navigation extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#tmpl-navigation');
  nav: HTMLElement | undefined;

  constructor() {
    super();
  }

  connectedCallback() {
    if (!this.nav) {
      const tmpl = tmplClone(Navigation.TMPL);
      this.nav = $<HTMLElement>('nav', tmpl);
      $('#logout', tmpl).onclick = this.doLogout;
      this.appendChild(tmpl);

      document.addEventListener('login', this.onLogin.bind(this));
      document.addEventListener('logout', this.onLogout.bind(this));

      console.log('navigation connected!', this.nav);
    }
  }

  onLogin() {
    if (this.nav) {
      this.nav.style.display = 'block';
    }
  }

  onLogout() {
    if (this.nav) {
      this.nav.style.display = 'none';
    }
  }

  doLogout() {
    adminLogout();
  }
}
