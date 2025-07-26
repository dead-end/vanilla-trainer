import { ConfirmDialog } from '../../components/ConfirmDialog';
import { hashBookUpdate, hashChapterList } from '../../lib/location/hash';
import { bookDelete, bookListing } from '../../lib/model/book';
import { TBook } from '../../lib/types';
import { html } from '../../lib/html/html';
import { $ } from '../../lib/utils/query';
import { createFragment } from '../../lib/html/createFragment';

export class BookListPage extends HTMLElement {
  connectedCallback() {
    if (!this.hasChildNodes()) {
      this.appendChild(this.renderPage());
    }
    this.render();
  }

  async render() {
    const confirmDialog = $<ConfirmDialog>('#confirm-dialog');

    const frags = (await bookListing()).map((b) =>
      this.renderBook(b, confirmDialog)
    );

    $<HTMLElement>('tbody').replaceChildren(...frags);
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

  renderPage() {
    const str = /* html */ html`
      <div class="is-column is-gap">
        <div class="page-title">Book List</div>
        <table>
          <thead>
            <tr>
              <th class="is-larger-sm">Id</th>
              <th>Title</th>
              <th class="is-larger-sm">Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
        <div class="is-row is-gap">
          <a href="#/books/create" class="btn">Create</a>
          <a href="#/cache/raw/books/books.json" class="btn">Cache</a>
        </div>
      </div>
    `;

    return createFragment(str);
  }

  renderBook(book: TBook, confirmDialog: ConfirmDialog) {
    const str = /*html*/ html`
      <tr>
        <td class="is-larger-sm">${book.id}</td>
        <td>${book.title}</td>
        <td class="is-larger-sm">${book.description}</td>
        <td data-id="actions">
          <div class="is-row is-gap-action">
            <ui-icons data-icon="delete"></ui-icons>
            <ui-icons data-icon="update"></ui-icons>
            <ui-icons data-icon="list"></ui-icons>
          </div>
        </td>
      </tr>
    `;

    const frac = createFragment(str);

    $<HTMLElement>('[data-icon="delete"]', frac).onclick = this.onDelete(
      confirmDialog,
      book.id
    ).bind(this);

    $<HTMLElement>('[data-icon="update"]', frac).onclick = () => {
      window.location.hash = hashBookUpdate(book.id);
    };

    $<HTMLElement>('[data-icon="list"]', frac).onclick = () => {
      window.location.hash = hashChapterList(book.id);
    };

    return frac;
  }
}
