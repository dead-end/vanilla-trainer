import { adminGet } from '../../lib/admin';
import { hashChapterCreate, hashChapterUpdate } from '../../lib/hash';
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

  disconnectedCallback() {
    $<HTMLElement>('tbody').replaceChildren(...[]);
  }

  async render() {
    const bookId = getRouteParam('bookId');

    $<HTMLAnchorElement>('#chapter-create-link').href =
      hashChapterCreate(bookId);

    const config = await adminGet();
    const result = await chapterListing(config, bookId);
    if (result.isOk()) {
      const arr: DocumentFragment[] = [];

      const chapters = result.getValue();

      chapters.forEach((chap) => {
        const tmpl = tmplClone(ChapterListPage.TMPL_ROW);

        $('[data-id="id"]', tmpl).textContent = chap.id;
        $('[data-id="title"]', tmpl).textContent = chap.title;
        $<HTMLElement>('[data-icon="delete"]', tmpl).onclick = this.onDelete(
          bookId,
          chap.id
        ).bind(this);

        $<HTMLElement>('[data-icon="update"]', tmpl).onclick = () => {
          window.location.hash = hashChapterUpdate(bookId, chap.id);
        };

        $<HTMLElement>('[data-icon="list"]', tmpl).onclick = () => {
          console.log('##################### list');
        };
        arr.push(tmpl);
      });

      $<HTMLElement>('tbody').replaceChildren(...arr);
      console.log(chapters);
    }
  }

  onDelete(bookId: string, chapterId: string) {
    return async () => {
      const githubConfig = await githubConfigGet();
      if (!githubConfig) {
        errorGlobal('Unable to get github config!');
        return;
      }
      const result = await chapterDelete(githubConfig, bookId, chapterId);
      if (result.hasError()) {
        errorGlobal(`Unable to delete the chapter: ${chapterId}`);
        return;
      }

      this.render();
    };
  }
}
