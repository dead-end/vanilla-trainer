import { bookGet, bookUpdate } from '../../lib/model/book';
import { getRouteParam } from '../../lib/route';
import { $, tmplClone } from '../../lib/utils';
import { fieldGet, fieldRequired } from '../../lib/ui/field';
import { fieldErrorExists, fieldErrorReset } from '../../lib/ui/field';
import { hashBookList } from '../../lib/location/hash';

export class BookUpdatePage extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#book-update-page');

  connectedCallback() {
    if (!this.hasChildNodes()) {
      const tmpl = tmplClone(BookUpdatePage.TMPL);
      $<HTMLFormElement>('form', tmpl).onsubmit = this.handleSubmit.bind(this);
      this.appendChild(tmpl);
    }

    this.render();
  }

  async render() {
    const bookId = getRouteParam('bookId');
    const book = await bookGet(bookId);

    $<HTMLInputElement>('#id').value = book.id;
    $<HTMLInputElement>('#title').value = book.title;
    $<HTMLTextAreaElement>('#desc').value = book.description;
  }

  async handleSubmit(e: SubmitEvent) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;

    const formData = new FormData(form);
    const id = fieldGet(formData, 'id');
    const title = fieldGet(formData, 'title');
    const desc = fieldGet(formData, 'desc');

    fieldErrorReset(form);

    fieldRequired(form, title);
    fieldRequired(form, desc);

    const button = $<HTMLButtonElement>('button', form);

    if (!fieldErrorExists(form)) {
      button.disabled = true;

      bookUpdate({
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
