import { adminGet } from '../../lib/admin';
import { bookDelete, bookListing } from '../../lib/model/book';
import { githubConfigGet } from '../../lib/model/githubConfig';
import { STYLES } from '../../lib/ui/stylesheets';
import { $, errorGlobal, tmplClone } from '../../lib/utils';

export class BookListPage extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#page-book-list');
  static TMPL_ROW = $<HTMLTemplateElement>('#tmpl-book-list');

  connectedCallback() {
    if (!this.shadowRoot) {
      const tmpl = tmplClone(BookListPage.TMPL);

      const shadow = this.attachShadow({ mode: 'open' });
      shadow.adoptedStyleSheets = STYLES;
      shadow.appendChild(tmpl);
    }

    this.render();
  }

  async render() {
    if (!this.shadowRoot) {
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

      $<HTMLElement>('tbody', this.shadowRoot).replaceChildren(...arr);
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
