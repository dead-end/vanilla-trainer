import { adminLogout } from '../lib/admin';
import { STYLES } from '../lib/ui/stylesheets';
import { $, tmplClone } from '../lib/utils';

export class Navigation extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#tmpl-navigation');
  navItems: HTMLElement;

  constructor() {
    super();

    this.attachShadow({ mode: 'open' }).adoptedStyleSheets = STYLES;

    const tmpl = tmplClone(Navigation.TMPL);

    this.navItems = $<HTMLElement>('#nav-items', tmpl);
    $('#logout', tmpl).onclick = this.doLogout;

    this.shadowRoot?.appendChild(tmpl);

    document.addEventListener('login', this.onLogin.bind(this));
    document.addEventListener('logout', this.onLogout.bind(this));
  }

  onLogin() {
    if (this.navItems) {
      this.navItems.style.visibility = 'visible';
    }
  }

  onLogout() {
    if (this.navItems) {
      this.navItems.style.visibility = 'hidden';
    }
  }

  doLogout() {
    adminLogout();
  }
}
