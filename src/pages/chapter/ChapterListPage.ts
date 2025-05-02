import { ConfirmDialog } from '../../components/ConfirmDialog';
import {
  hashChapterCreate,
  hashChapterUpdate,
  hashLessionPrepare,
  hashQuestionList,
} from '../../lib/hash';
import { chapterDelete, chapterListing } from '../../lib/model/chapter';
import { githubConfigGet } from '../../lib/model/githubConfig';
import { getRouteParam } from '../../lib/route';
import { $, errorGlobal, tmplClone } from '../../lib/utils';

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

    $<HTMLAnchorElement>('#chapter-create-link').href =
      hashChapterCreate(bookId);

    const config = await githubConfigGet();
    const result = await chapterListing(config, bookId);
    if (result.isOk()) {
      const arr: DocumentFragment[] = [];

      const chapters = result.getValue();

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
      console.log(chapters);
    }
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
      const githubConfig = await githubConfigGet();
      const result = await chapterDelete(githubConfig, bookId, chapterId);
      if (result.hasError()) {
        errorGlobal(`Unable to delete the chapter: ${chapterId}`);
        return;
      }

      this.render();
    };
  }
}
