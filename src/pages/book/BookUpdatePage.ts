import {
  errorExists,
  errorGlobal,
  errorReset,
  errorSet,
} from '../../lib/error';
import { bookGet, bookUpdate } from '../../lib/model/book';
import { githubConfigGet } from '../../lib/model/githubConfig';
import { getRouteParam } from '../../lib/route';
// import { STYLE_SHEETS } from '../../lib/stylesheets';
import { $, tmplClone } from '../../lib/utils';

export class BookUpdatePage extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#page-book-update');

  _form: HTMLFormElement | undefined;
  _desc: HTMLTextAreaElement | undefined;
  _id: HTMLInputElement | undefined;
  _title: HTMLInputElement | undefined;
 // shadow: ShadowRoot;

  constructor() {
    super();
  //  this.shadow = this.attachShadow({ mode: 'open' });
  //  this.shadow.adoptedStyleSheets = STYLE_SHEETS;
  }

  connectedCallback() {
    if (!this._form) {
      const tmpl = tmplClone(BookUpdatePage.TMPL);

      this._form = $<HTMLFormElement>('form', tmpl);
      this._form.onsubmit = this.handleSubmit.bind(this);
    //  this.shadow.appendChild(tmpl);
      this.appendChild(tmpl)

      this._id = $<HTMLInputElement>('#id', this._form);
      this._title = $<HTMLInputElement>('#title', this._form);
      this._desc = $<HTMLTextAreaElement>('#desc', this._form);

      this._id.readOnly = true;

      this.render();
    }
  }

  async render() {
    if (!this._id || !this._title || !this._desc) {
      errorGlobal('Not initialized!');
      return;
    }

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

    const formData = new FormData($<HTMLFormElement>('form', this))
    console.log('id', formData.get('id'), 'title', formData.get('title'), 'desc', formData.get('desc'))

    if (!this._id || !this._title || !this._desc) {
      throw new Error('Not initialized!');
    }

    errorReset(this);

    if (!this._id.value) {
      errorSet(this, 'id', 'Please enter a value!');
    }
    if (!this._title.value) {
      errorSet(this, 'title', 'Please enter a value!');
    }
    if (!this._desc.value) {
      errorSet(this, 'desc', 'Please enter a value!');
    }

    if (!errorExists(this)) {
      console.log('id', this._id, 'title', this._title, 'desc', this._desc);

      $<HTMLButtonElement>('button').disabled = true;

      this.doUpdate(
        this._id.value,
        this._title.value,
        this._desc.value
      ).finally(() => {
        $<HTMLButtonElement>('button').disabled = false;
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
