import { adminGet } from '../../lib/admin';
import { errorGlobal } from '../../lib/error';
import { bookDelete, bookListing } from '../../lib/model/book';
import { githubConfigGet } from '../../lib/model/githubConfig';
import { $, tmplClone } from '../../lib/utils';

export class BookListPage extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#page-book-list');
  static TMPL_ROW = $<HTMLTemplateElement>('#tmpl-book-list');

  _tbody: HTMLElement | undefined;

  constructor() {
    super();
  }

  connectedCallback() {
    if (!this._tbody) {
      const tmpl = tmplClone(BookListPage.TMPL);
      this._tbody = $<HTMLElement>('tbody', tmpl);
      this.appendChild(tmpl);
      this.render();
    }
  }

  async render() {
    if (!this._tbody) {
      return;
    }
    const config = await adminGet();
    const result = await bookListing(config);
    if (result.isOk()) {
      const arr: DocumentFragment[] = [];

      const books = result.getValue();

      books.forEach((b) => {
        const tmpl = tmplClone(BookListPage.TMPL_ROW);

        $('[data-id="id"]', tmpl).textContent = b.id;
        $('[data-id="title"]', tmpl).textContent = b.title;
        $('[data-id="desc"]', tmpl).textContent = b.description;
        $('[data-icon="delete"]', tmpl).onclick = this.onDelete(b.id).bind(
          this
        );

        $('[data-icon="update"]', tmpl).onclick = () => {
          window.location.hash = `#/book/update/${b.id}`;
        };

        $('[data-icon="list"]', tmpl).onclick = () => {
          console.log('##################### list');
        };
        arr.push(tmpl);
      });

      this._tbody.replaceChildren(...arr);
      console.log(books);
    }
  }

  onDelete(id: string) {
    return async () => {
      const githubConfig = await githubConfigGet();
      if (!githubConfig) {
        errorGlobal('Unable to get github config!');
        return;
      }
      const result = await bookDelete(githubConfig, id);
      if (result.hasError()) {
        errorGlobal(`Unable to delete the book: ${id}`);
        return;
      }

      this.render();
    };
  }
}
