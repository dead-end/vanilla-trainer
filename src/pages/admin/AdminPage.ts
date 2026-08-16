import { adminLogin } from '../../lib/admin';
import { fieldErrorExists, fieldErrorReset } from '../../lib/ui/field';
import { $ } from '../../lib/utils/query';
import { fieldGet, fieldRequired } from '../../lib/ui/field';
import { githubConfigGet } from '../../lib/model/githubConfig';
import { createFragment } from '../../lib/html/createFragment';
import { html } from '../../lib/html/html';

// TODO: move to admin folder and rename to ConfigPage

const PAGE_FRAG = createFragment(/* html */ html`
  <div class="is-column is-gap">
    <div class="page-title">Administration</div>
    <form class="is-column is-gap">
      <ui-field data-id="user" data-label="Github User">
        <input id="user" name="user" type="text" />
      </ui-field>

      <ui-field data-id="repo" data-label="Github Repository">
        <input id="repo" name="repo" type="text" />
      </ui-field>

      <ui-field data-id="token" data-label="Token">
        <input id="token" name="token" type="password" />
      </ui-field>
      <div class="is-row is-gap">
        <button id="admin-edit" class="btn" type="button">Edit</button>
        <button id="admin-save" class="btn" type="submit">Save</button>
      </div>
    </form>
  </div>
`);

export class AdminPage extends HTMLElement {
  connectedCallback() {
    if (!this.hasChildNodes()) {
      const frag = PAGE_FRAG.cloneNode(true) as DocumentFragment;

      $<HTMLFormElement>('form', frag).onsubmit = this.handleSubmit;
      $<HTMLButtonElement>('#admin-edit', frag).onclick = this.onEdit;

      this.appendChild(frag);

      document.addEventListener('logout', this.onLogout);
    }

    this.getAdmin();
    this.setEdit(false);
  }

  disconnectedCallback() {
    if (this.hasChildNodes()) {
      document.removeEventListener('logout', this.onLogout);
    }
  }

  async getAdmin() {
    const admin = await githubConfigGet();
    $<HTMLInputElement>('#user').value = admin.user;
    $<HTMLInputElement>('#repo').value = admin.repo;
    $<HTMLInputElement>('#token').value = admin.token;
  }

  setEdit(edit: boolean) {
    $<HTMLInputElement>('#user').disabled = !edit;
    $<HTMLInputElement>('#repo').disabled = !edit;
    $<HTMLInputElement>('#token').disabled = !edit;

    $<HTMLButtonElement>('#admin-edit').disabled = edit;
    $<HTMLButtonElement>('#admin-save').disabled = !edit;
  }

  onLogout = () => {
    this.getAdmin();
  };

  onEdit = () => {
    this.setEdit(true);
  };

  handleSubmit = (e: SubmitEvent) => {
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
  };
}
