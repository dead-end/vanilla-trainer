import { ConfirmDialog } from '../../components/ConfirmDialog';
import { LocationInfo } from '../../components/LocationInfo';
import { createFragment } from '../../lib/html/createFragment';
import { html } from '../../lib/html/html';
import {
  hashCache,
  hashChapterCreate,
  hashChapterUpdate,
  hashLessionPrepare,
  hashQuestionList,
} from '../../lib/location/hash';
import { pathChaptersGet } from '../../lib/location/path';
import { chapterDelete, chapterListing } from '../../lib/model/chapter';
import { getRouteParam } from '../../lib/route';
import { TChapter } from '../../lib/types';
import { $ } from '../../lib/utils/query';

export class ChapterListPage extends HTMLElement {
  connectedCallback() {
    if (!this.hasChildNodes()) {
      this.appendChild(this.renderComponent());
    }

    this.updateComponent();
  }

  renderComponent() {
    const str = /* html */ html`
      <div class="is-column is-gap">
        <div class="page-title">Chapter List</div>
        <location-info id="location-info"></location-info>
        <table>
          <thead>
            <tr>
              <th class="is-larger-sm">Id</th>
              <th>Title</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
        <div class="is-row is-gap">
          <a href="#/books" class="btn">Books</a>
          <a href="#" class="btn" id="chapter-create-link">Create</a>
          <a href="#/" class="btn" id="chapter-cache-link">Cache</a>
        </div>
      </div>
    `;

    const frag = createFragment(str);

    return frag;
  }

  async updateComponent() {
    const bookId = getRouteParam('bookId');
    const confirmDialog = $<ConfirmDialog>('#confirm-dialog');

    $<LocationInfo>('#location-info').show(bookId);
    this.addLinks(bookId);

    const arr: DocumentFragment[] = [];

    const chapters = await chapterListing(bookId);

    chapters.forEach((chap) => {
      arr.push(this.renderEntry(bookId, chap, confirmDialog));
    });

    $<HTMLElement>('tbody').replaceChildren(...arr);
  }

  addLinks(bookId: string) {
    $<HTMLAnchorElement>('#chapter-create-link').href =
      hashChapterCreate(bookId);

    $<HTMLAnchorElement>('#chapter-cache-link').href = hashCache(
      pathChaptersGet(bookId)
    );
  }

  onDelete(confirmDialog: ConfirmDialog, bookId: string, chapterId: string) {
    return () => {
      confirmDialog.activate(
        'Delete Chapter',
        `Do you realy want to delete the chapter: ${chapterId}?`,
        this.getDeleteFct(bookId, chapterId)
      );
    };
  }

  getDeleteFct(bookId: string, chapterId: string) {
    return async () => {
      chapterDelete(bookId, chapterId).then(() => {
        this.updateComponent();
      });
    };
  }

  renderEntry(bookId: string, chap: TChapter, confirmDialog: ConfirmDialog) {
    const str = /* html */ html`
      <tr>
        <td class="is-larger-sm">${chap.id}</td>
        <td>${chap.title}</td>
        <td data-id="actions">
          <div class="is-row is-gap-action">
            <ui-icons data-icon="delete"></ui-icons>
            <ui-icons data-icon="update"></ui-icons>
            <ui-icons data-icon="list"></ui-icons>
            <ui-icons data-icon="start"></ui-icons>
          </div>
        </td>
      </tr>
    `;

    const frag = createFragment(str);

    $<HTMLElement>('[data-icon="delete"]', frag).onclick = this.onDelete(
      confirmDialog,
      bookId,
      chap.id
    ).bind(this);

    $<HTMLElement>('[data-icon="update"]', frag).onclick = () => {
      window.location.hash = hashChapterUpdate(bookId, chap.id);
    };

    $<HTMLElement>('[data-icon="list"]', frag).onclick = () => {
      window.location.hash = hashQuestionList(bookId, chap.id);
    };

    $<HTMLElement>('[data-icon="start"]', frag).onclick = () => {
      window.location.hash = hashLessionPrepare(bookId, chap.id);
    };

    return frag;
  }
}
