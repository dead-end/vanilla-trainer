import { fieldErrorExists, fieldErrorReset } from '../../lib/ui/field';
import { bookCreate } from '../../lib/model/book';
import { $, tmplClone } from '../../lib/utils';
import { fieldGet, fieldId, fieldRequired } from '../../lib/ui/field';
import { hashBookList } from '../../lib/hash';

export class BookCreatePage extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#book-create-page');

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

      bookCreate({
        id: id.value,
        title: title.value,
        description: desc.value,
      })
        .then(() => {
          window.location.hash = hashBookList();
        })
        .finally(() => {
          button.disabled = false;
        });
    }
  }
}
