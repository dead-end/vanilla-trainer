import { adminLogout } from '../lib/admin';
import { createFragment } from '../lib/html/createFragment';
import { html } from '../lib/html/html';
import { hashHome } from '../lib/location/hash';
import { STYLES } from '../lib/ui/stylesheets';
import { $ } from '../lib/utils/query';

const COMP_FRAG = createFragment(/* html */ html`
  <style>
    nav {
      box-shadow: var(--shadow);
    }

    .nav {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      background-color: var(--color-primary);

      border-top-left-radius: var(--border-radius);
      border-top-right-radius: var(--border-radius);

      padding-top: 1rem;
      padding-bottom: 1rem;

      margin-bottom: var(--gap);
    }
  </style>

  <nav>
    <div class="nav is-padding-x">
      <div class="is-text-reverse">
        <span class="is-larger-sm is-text-bold is-text-larger"
          >Vanilla Trainer</span
        >
        <span class="is-smaller-sm is-text-bold is-text-larger">VT</span>
      </div>
      <div id="nav-items" class="is-row is-gap-action">
        <a href="#/">
          <ui-icons class="reverse" data-icon="home"></ui-icons>
        </a>
        <a href="#/books">
          <ui-icons class="reverse" data-icon="book"></ui-icons>
        </a>
        <a href="#/cache/list">
          <ui-icons class="reverse" data-icon="cache"></ui-icons>
        </a>
        <a href="#/search">
          <ui-icons class="reverse" data-icon="search"></ui-icons>
        </a>
        <a href="#/admin">
          <ui-icons class="reverse" data-icon="admin"></ui-icons>
        </a>
        <a href="#/admin" id="logout">
          <ui-icons class="reverse" data-icon="logout"></ui-icons>
        </a>
      </div>
    </div>
  </nav>
`);

/**
 * The class renders the navigation, which is dependent of the login status.
 * Changes of the login status are provided by a custom event.
 *
 * The redirect to the home page after a logout ensures that the current login
 * data is reset when you do a logout on the config page with the login data.
 */
export class Navigation extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.adoptedStyleSheets = STYLES;
    shadow.appendChild(COMP_FRAG.cloneNode(true));
  }

  connectedCallback() {
    if (this.shadowRoot !== null) {
      $<HTMLElement>('#logout', this.shadowRoot).onclick = this.doLogout;
      document.addEventListener('login', this.onLogin);
      document.addEventListener('logout', this.onLogout);
    }
  }

  disconnectedCallback() {
    if (this.shadowRoot !== null) {
      $<HTMLElement>('#logout', this.shadowRoot).onclick = null;
      document.removeEventListener('login', this.onLogin);
      document.removeEventListener('logout', this.onLogout);
    }
  }

  onLogin = () => {
    if (this.shadowRoot) {
      $<HTMLElement>('#nav-items', this.shadowRoot).style.visibility =
        'visible';
    }
  };

  onLogout = () => {
    if (this.shadowRoot) {
      $<HTMLElement>('#nav-items', this.shadowRoot).style.visibility = 'hidden';
      window.location.hash = hashHome();
    }
  };

  doLogout() {
    adminLogout();
  }
}
