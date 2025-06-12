import { ConfirmDialog } from '../../components/ConfirmDialog';
import { hashBookUpdate, hashChapterList } from '../../lib/location/hash';
import { bookDelete, bookListing } from '../../lib/model/book';
import { $ } from '../../lib/utils/query';
import { tmplClone } from '../../lib/utils/tmpl';

export class BookListPage extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#book-list-page');
  static TMPL_ROW = $<HTMLTemplateElement>('#tmpl-book-list');

  connectedCallback() {
    if (!this.hasChildNodes()) {
      const tmpl = tmplClone(BookListPage.TMPL);
      this.appendChild(tmpl);
    }

    this.render();
  }

  async render() {
    const arr: DocumentFragment[] = [];
    const confirmDialog = $<ConfirmDialog>('#confirm-dialog');

    const books = await bookListing();
    books.forEach((b) => {
      const tmpl = tmplClone(BookListPage.TMPL_ROW);

      $('[data-id="id"]', tmpl).textContent = b.id;
      $('[data-id="title"]', tmpl).textContent = b.title;
      $('[data-id="desc"]', tmpl).textContent = b.description;
      $<HTMLElement>('[data-icon="delete"]', tmpl).onclick = this.onDelete(
        confirmDialog,
        b.id
      ).bind(this);

      $<HTMLElement>('[data-icon="update"]', tmpl).onclick = () => {
        window.location.hash = hashBookUpdate(b.id);
      };

      $<HTMLElement>('[data-icon="list"]', tmpl).onclick = () => {
        window.location.hash = hashChapterList(b.id);
      };
      arr.push(tmpl);
    });

    $<HTMLElement>('tbody').replaceChildren(...arr);
    console.log(books);
  }

  onDelete(confirmDialog: ConfirmDialog, bookId: string) {
    return () => {
      confirmDialog.activate(
        'Delete Book',
        `Do you realy want to delete the book: ${bookId}?`,
        this.getDeleteFct(bookId)
      );
    };
  }

  getDeleteFct(bookId: string) {
    return async () => {
      await bookDelete(bookId);
      this.render();
    };
  }
}
