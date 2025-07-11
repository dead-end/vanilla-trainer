import { adminLogin } from '../../lib/admin';
import { fieldErrorExists, fieldErrorReset } from '../../lib/ui/field';
import { $ } from '../../lib/utils/query';
import { tmplClone } from '../../lib/utils/tmpl';
import { fieldGet, fieldRequired } from '../../lib/ui/field';
import { githubConfigGet } from '../../lib/model/githubConfig';

// TODO: move to admin folder and rename to ConfigPage

export class AdminPage extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#admin-page');

  connectedCallback() {
    if (!this.hasChildNodes()) {
      const tmpl = tmplClone(AdminPage.TMPL);
      $<HTMLFormElement>('form', tmpl).onsubmit = this.handleSubmit.bind(this);

      $<HTMLButtonElement>('#admin-edit', tmpl).onclick =
        this.onEdit.bind(this);

      this.appendChild(tmpl);

      document.addEventListener('logout', this.onLogout.bind(this));
    }

    this.getAdmin();
    this.setEdit(false);
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
        this.setEdit(false);
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

  onEdit() {
    this.setEdit(true);
  }

  setEdit(edit: boolean) {
    $<HTMLInputElement>('#user').disabled = !edit;
    $<HTMLInputElement>('#repo').disabled = !edit;
    $<HTMLInputElement>('#token').disabled = !edit;

    $<HTMLButtonElement>('#admin-edit').disabled = edit;
    $<HTMLButtonElement>('#admin-save').disabled = !edit;
  }

  onLogout() {
    this.getAdmin();
  }
}
