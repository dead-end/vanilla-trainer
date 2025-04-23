import { fieldErrorExists, fieldErrorReset } from '../../lib/ui/field';
import { bookCreate } from '../../lib/model/book';
import { githubConfigGet } from '../../lib/model/githubConfig';
import { $, errorGlobal, tmplClone } from '../../lib/utils';
import { fieldGet, fieldId, fieldRequired } from '../../lib/ui/field';
import { hashBookList } from '../../lib/hash';

export class BookCreatePage extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#page-book-create');

  connectedCallback() {
    if (!this.hasChildNodes()) {
      const tmpl = tmplClone(BookCreatePage.TMPL);
      $<HTMLFormElement>('form', tmpl).onsubmit = this.handleSubmit.bind(this);
      this.appendChild(tmpl);
    }
  }

  async handleSubmit(e: SubmitEvent) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;

    const formData = new FormData(form);
    const id = fieldGet(formData, 'id');
    const title = fieldGet(formData, 'title');
    const desc = fieldGet(formData, 'desc');

    fieldErrorReset(form);

    fieldRequired(form, id) && fieldId(form, id);
    fieldRequired(form, title);
    fieldRequired(form, desc);

    const button = $<HTMLButtonElement>('button', form);

    if (!fieldErrorExists(form)) {
      console.log('id', id, 'title', title, 'desc', desc);

      button.disabled = true;

      this.doCreate(id.value, title.value, desc.value).finally(() => {
        button.disabled = false;
      });
    }
  }

  async doCreate(id: string, title: string, desc: string) {
    const githubConfig = await githubConfigGet();
    if (!githubConfig) {
      errorGlobal('Unable to get github config!');
      return;
    }

    const result = await bookCreate(githubConfig, {
      id: id,
      title: title,
      description: desc,
    });

    if (result.hasError()) {
      errorGlobal(`Unable to create a new book: ${result.getMessage()}`);
      return;
    }

    window.location.hash = hashBookList();
  }
}
