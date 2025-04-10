import { adminGet } from '../../lib/admin';
import { bookListing } from '../../lib/model/book';
import { $, tmplClone } from '../../lib/utils';

export class BookListPage extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#page-book-list');
  static TMPL_ROW = $<HTMLTemplateElement>('#tmpl-book-list');

  tbody: HTMLElement | undefined;

  constructor() {
    super();
  }

  connectedCallback() {
    if (!this.tbody) {
      const tmpl = tmplClone(BookListPage.TMPL);
      this.tbody = $<HTMLElement>('tbody', tmpl);
      this.appendChild(tmpl);
      this.render();
    }
  }

  async render() {
    if (!this.tbody) {
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

        arr.push(tmpl);
      });

      this.tbody.replaceChildren(...arr);
      console.log(books);
    }
  }
}
