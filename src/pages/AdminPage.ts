import { adminGet, adminLogin } from '../lib/admin';
import { fieldErrorExists, fieldErrorReset } from '../lib/ui/fieldError';
import { STYLES } from '../lib/ui/stylesheets';
import { $, tmplClone } from '../lib/utils';
import { fieldGet, fieldRequired } from '../lib/ui/field';

export class AdminPage extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#page-admin');

  connectedCallback() {
    if (!this.shadowRoot) {
      const tmpl = tmplClone(AdminPage.TMPL);
      $<HTMLFormElement>('form', tmpl).onsubmit = this.handleSubmit.bind(this);

      const shadow = this.attachShadow({ mode: 'open' });
      shadow.adoptedStyleSheets = STYLES;
      shadow.appendChild(tmpl);

      document.addEventListener('logout', this.onLogout.bind(this));
    }

    this.getAdmin();
  }

  handleSubmit(e: SubmitEvent) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;

    const formData = new FormData(form);
    const user = fieldGet(formData, 'user');
    const repo = fieldGet(formData, 'repo');
    const token = fieldGet(formData, 'token');

    fieldErrorReset(form);

    fieldRequired(form, user);
    fieldRequired(form, repo);
    fieldRequired(form, token);

    const button = $<HTMLButtonElement>('button', form);

    if (!fieldErrorExists(form)) {
      button.disabled = true;

      adminLogin(user.value, repo.value, token.value).finally(() => {
        button.disabled = false;
      });
    }
  }

  async getAdmin() {
    if (this.shadowRoot) {
      const admin = await adminGet();
      $<HTMLInputElement>('#user', this.shadowRoot).value = admin.user;
      $<HTMLInputElement>('#repo', this.shadowRoot).value = admin.repo;
      $<HTMLInputElement>('#token', this.shadowRoot).value = admin.token;
    }
  }

  onLogout() {
    this.getAdmin();
  }
}
