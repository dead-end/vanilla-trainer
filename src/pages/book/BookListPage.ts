import { ConfirmDialog } from '../../components/ConfirmDialog';
import { hashBookUpdate, hashChapterList } from '../../lib/location/hash';
import { bookDelete, bookListing } from '../../lib/model/book';
import { TBook } from '../../lib/types';
import { html } from '../../lib/html/html';
import { $ } from '../../lib/utils/query';
import { createFragment } from '../../lib/html/createFragment';

const PAGE_FRAG = createFragment(/* html */ html`
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
`);

const ENTRY_FRAG = createFragment(/*html*/ html`
  <tr>
    <td data-id="id" class="is-larger-sm"></td>
    <td data-id="title"></td>
    <td data-id="desc" class="is-larger-sm"></td>
    <td data-id="actions">
      <div class="is-row is-gap-action">
        <ui-icons data-icon="delete"></ui-icons>
        <ui-icons data-icon="update"></ui-icons>
        <ui-icons data-icon="list"></ui-icons>
      </div>
    </td>
  </tr>
`);

export class BookListPage extends HTMLElement {
  connectedCallback() {
    if (!this.hasChildNodes()) {
      this.appendChild(PAGE_FRAG.cloneNode(true));
    }
    this.render();
  }

  async render() {
    const confirmDialog = $<ConfirmDialog>('#confirm-dialog');

    const frags = (await bookListing()).map((b) =>
      this.renderBook(b, confirmDialog),
    );

    $<HTMLElement>('tbody').replaceChildren(...frags);
  }

  getDeleteFct(bookId: string) {
    return async () => {
      await bookDelete(bookId);
      this.render();
    };
  }

  renderBook(book: TBook, confirmDialog: ConfirmDialog) {
    const frag = ENTRY_FRAG.cloneNode(true) as DocumentFragment;

    $<HTMLElement>('[data-id="id"]', frag).innerText = book.id;
    $<HTMLElement>('[data-id="title"]', frag).innerText = book.title;
    $<HTMLElement>('[data-id="desc"]', frag).innerText = book.description;

    $<HTMLElement>('[data-icon="delete"]', frag).onclick = this.onDelete(
      confirmDialog,
      book.id,
    );

    $<HTMLElement>('[data-icon="update"]', frag).onclick = () => {
      window.location.hash = hashBookUpdate(book.id);
    };

    $<HTMLElement>('[data-icon="list"]', frag).onclick = () => {
      window.location.hash = hashChapterList(book.id);
    };

    return frag;
  }

  onDelete = (confirmDialog: ConfirmDialog, bookId: string) => {
    return () => {
      confirmDialog.activate(
        'Delete Book',
        `Do you really want to delete the book: ${bookId}?`,
        this.getDeleteFct(bookId),
      );
    };
  };
}
