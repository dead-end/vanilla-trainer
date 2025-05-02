import { adminLogin } from '../lib/admin';
import { fieldErrorExists, fieldErrorReset } from '../lib/ui/field';
import { $, tmplClone } from '../lib/utils';
import { fieldGet, fieldRequired } from '../lib/ui/field';
import { githubConfigGet } from '../lib/model/githubConfig';

export class AdminPage extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#admin-page');

  connectedCallback() {
    if (!this.hasChildNodes()) {
      const tmpl = tmplClone(AdminPage.TMPL);
      $<HTMLFormElement>('form', tmpl).onsubmit = this.handleSubmit.bind(this);

      this.appendChild(tmpl);

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
    const admin = await githubConfigGet();
    $<HTMLInputElement>('#user').value = admin.user;
    $<HTMLInputElement>('#repo').value = admin.repo;
    $<HTMLInputElement>('#token').value = admin.token;
  }

  onLogout() {
    this.getAdmin();
  }
}
