import { bookGet, bookUpdate } from '../../lib/model/book';
import { githubConfigGet } from '../../lib/model/githubConfig';
import { getRouteParam } from '../../lib/route';
import { STYLES } from '../../lib/ui/stylesheets';
import { $, errorGlobal, tmplClone } from '../../lib/utils';
import { fieldRequired } from '../../lib/ui/validate';
import { fieldErrorExists, fieldErrorReset } from '../../lib/ui/fieldError';

export class BookUpdatePage extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#page-book-update');

  _form: HTMLFormElement;
  _id: HTMLInputElement;
  _title: HTMLInputElement;
  _desc: HTMLTextAreaElement;
  _button: HTMLButtonElement;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).adoptedStyleSheets = STYLES;

    const tmpl = tmplClone(BookUpdatePage.TMPL);

    this._form = $<HTMLFormElement>('form', tmpl);
    this._id = $<HTMLInputElement>('#id', this._form);
    this._title = $<HTMLInputElement>('#title', this._form);
    this._desc = $<HTMLTextAreaElement>('#desc', this._form);
    this._button = $<HTMLButtonElement>('button', this._form);

    this._form.onsubmit = this.handleSubmit.bind(this);

    this.shadowRoot?.appendChild(tmpl);
  }

  connectedCallback() {
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

    this._id.value = book.id;
    this._title.value = book.title;
    this._desc.value = book.description;
  }

  async handleSubmit(e: SubmitEvent) {
    e.preventDefault();

    fieldErrorReset(this._form);

    fieldRequired(this._form, 'title', this._title.value);
    fieldRequired(this._form, 'desc', this._desc.value);

    if (!fieldErrorExists(this._form)) {
      this._button.disabled = true;

      this.doUpdate(
        this._id.value,
        this._title.value,
        this._desc.value
      ).finally(() => {
        this._button.disabled = false;
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
