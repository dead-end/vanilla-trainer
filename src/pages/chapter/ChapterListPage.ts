import { ConfirmDialog } from '../../components/ConfirmDialog';
import { LocationInfo } from '../../components/LocationInfo';
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
import { $ } from '../../lib/utils/query';
import { tmplClone } from '../../lib/utils/tmpl';

export class ChapterListPage extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#chapter-list-page');
  static TMPL_ROW = $<HTMLTemplateElement>('#tmpl-chapter-list');

  connectedCallback() {
    if (!this.hasChildNodes()) {
      const tmpl = tmplClone(ChapterListPage.TMPL);
      this.appendChild(tmpl);
    }

    this.render();
  }

  async render() {
    const bookId = getRouteParam('bookId');
    const confirmDialog = $<ConfirmDialog>('#confirm-dialog');

    $<LocationInfo>('#location-info').show(bookId);
    this.addLinks(bookId);

    const arr: DocumentFragment[] = [];

    const chapters = await chapterListing(bookId);

    chapters.forEach((chap) => {
      const tmpl = tmplClone(ChapterListPage.TMPL_ROW);

      $('[data-id="id"]', tmpl).textContent = chap.id;
      $('[data-id="title"]', tmpl).textContent = chap.title;
      $<HTMLElement>('[data-icon="delete"]', tmpl).onclick = this.onDelete(
        confirmDialog,
        bookId,
        chap.id
      ).bind(this);

      $<HTMLElement>('[data-icon="update"]', tmpl).onclick = () => {
        window.location.hash = hashChapterUpdate(bookId, chap.id);
      };

      $<HTMLElement>('[data-icon="list"]', tmpl).onclick = () => {
        window.location.hash = hashQuestionList(bookId, chap.id);
      };

      $<HTMLElement>('[data-icon="start"]', tmpl).onclick = () => {
        window.location.hash = hashLessionPrepare(bookId, chap.id);
      };
      arr.push(tmpl);
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
        this.render();
      });
    };
  }
}
