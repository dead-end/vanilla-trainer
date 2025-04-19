import { bookGet, bookUpdate } from '../../lib/model/book';
import { githubConfigGet } from '../../lib/model/githubConfig';
import { getRouteParam } from '../../lib/route';
import { $, errorGlobal, tmplClone } from '../../lib/utils';
import { fieldGet, fieldRequired } from '../../lib/ui/field';
import { fieldErrorExists, fieldErrorReset } from '../../lib/ui/fieldError';

export class BookUpdatePage extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#page-book-update');

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
    if (!bookId) {
      errorGlobal(`Unable to get book id from: ${window.location.hash}`);
      return;
    }

    const githubConfig = await githubConfigGet();
    if (!githubConfig) {
      errorGlobal('Unable to get github config!');
      return;
    }

    const result = await bookGet(githubConfig, bookId);
    if (!result.isOk()) {
      errorGlobal(`Unable to get book id: ${bookId}`);
      return;
    }

    const book = result.getValue();

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

      this.doUpdate(id.value, title.value, desc.value).finally(() => {
        button.disabled = false;
      });
    }
  }

  async doUpdate(id: string, title: string, desc: string) {
    const githubConfig = await githubConfigGet();
    if (!githubConfig) {
      errorGlobal('Unable to get github config!');
      return;
    }

    const result = await bookUpdate(githubConfig, {
      id: id,
      title: title,
      description: desc,
    });

    if (result.hasError()) {
      errorGlobal(`Unable to update the book: ${id} - ${result.getMessage()}`);
      return;
    }

    window.location.hash = '#/books';
  }
}
