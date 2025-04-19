import { adminLogout } from '../lib/admin';
import { STYLES } from '../lib/ui/stylesheets';
import { $, tmplClone } from '../lib/utils';

export class Navigation extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#tmpl-navigation');

  connectedCallback() {
    if (!this.shadowRoot) {
      const tmpl = tmplClone(Navigation.TMPL);
      $<HTMLElement>('#logout', tmpl).onclick = this.doLogout;

      const shadow = this.attachShadow({ mode: 'open' });
      shadow.adoptedStyleSheets = STYLES;
      shadow.appendChild(tmpl);

      document.addEventListener('login', this.onLogin.bind(this));
      document.addEventListener('logout', this.onLogout.bind(this));
    }
  }

  onLogin() {
    if (this.shadowRoot) {
      $<HTMLElement>('#nav-items', this.shadowRoot).style.visibility =
        'visible';
    }
  }

  onLogout() {
    if (this.shadowRoot) {
      $<HTMLElement>('#nav-items', this.shadowRoot).style.visibility = 'hidden';
    }
  }

  doLogout() {
    adminLogout();
  }
}
