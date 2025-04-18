import { fieldErrorExists, fieldErrorReset } from '../../lib/ui/fieldError';
import { bookCreate } from '../../lib/model/book';
import { githubConfigGet } from '../../lib/model/githubConfig';
import { STYLES } from '../../lib/ui/stylesheets';
import { $, errorGlobal, tmplClone } from '../../lib/utils';
import { fieldId, fieldRequired } from '../../lib/ui/validate';

export class BookCreatePage extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#page-book-create');

  _form: HTMLFormElement;
  _desc: HTMLTextAreaElement;
  _id: HTMLInputElement;
  _title: HTMLInputElement;
  _button: HTMLButtonElement;

  constructor() {
    super();

    this.attachShadow({ mode: 'open' }).adoptedStyleSheets = STYLES;

    const tmpl = tmplClone(BookCreatePage.TMPL);

    this._form = $<HTMLFormElement>('form', tmpl);
    this._id = $<HTMLInputElement>('#id', this._form);
    this._title = $<HTMLInputElement>('#title', this._form);
    this._desc = $<HTMLTextAreaElement>('#desc', this._form);
    this._button = $<HTMLButtonElement>('button');

    this._form.onsubmit = this.handleSubmit.bind(this);

    this.shadowRoot?.appendChild(tmpl);
  }

  async handleSubmit(e: SubmitEvent) {
    e.preventDefault();

    fieldErrorReset(this._form);

    fieldRequired(this._form, 'id', this._id.value) &&
      fieldId(this._form, 'id', this._id.value);
    fieldRequired(this._form, 'title', this._title.value);
    fieldRequired(this._form, 'desc', this._desc.value);

    if (!fieldErrorExists(this._form)) {
      console.log('id', this._id, 'title', this._title, 'desc', this._desc);

      this._button.disabled = true;

      this.doCreate(
        this._id.value,
        this._title.value,
        this._desc.value
      ).finally(() => {
        this._button.disabled = false;
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
