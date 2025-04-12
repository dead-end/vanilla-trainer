import {
  errorExists,
  errorGlobal,
  errorReset,
  errorSet,
} from '../../lib/error';
import { bookCreate } from '../../lib/model/book';
import { githubConfigGet } from '../../lib/model/githubConfig';
import { $, tmplClone } from '../../lib/utils';

export class BookCreatePage extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#page-book-create');

  _form: HTMLFormElement | undefined;
  _desc: HTMLTextAreaElement | undefined;
  _id: HTMLInputElement | undefined;
  _title: HTMLInputElement | undefined;

  constructor() {
    super();
  }

  connectedCallback() {
    if (!this._form) {
      const tmpl = tmplClone(BookCreatePage.TMPL);

      this._form = $<HTMLFormElement>('form', tmpl);
      this._form.onsubmit = this.handleSubmit.bind(this);
      this.appendChild(tmpl);

      this._id = $<HTMLInputElement>('#id', this._form);
      this._title = $<HTMLInputElement>('#title', this._form);
      this._desc = $<HTMLTextAreaElement>('#desc', this._form);
    }
  }

  async handleSubmit(e: SubmitEvent) {
    e.preventDefault();

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

      this.doCreate(
        this._id.value,
        this._title.value,
        this._desc.value
      ).finally(() => {
        $<HTMLButtonElement>('button').disabled = false;
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

    window.location.hash = '#/books';
  }
}
