import { githubConfigGet } from '../../lib/model/githubConfig';
import { getRouteParam } from '../../lib/route';
import { $, errorGlobal, tmplClone } from '../../lib/utils';
import { fieldGet, fieldRequired } from '../../lib/ui/field';
import { fieldErrorExists, fieldErrorReset } from '../../lib/ui/field';
import { chapterGet, chapterUpdate } from '../../lib/model/chapter';
import { hashChapterList } from '../../lib/hash';

export class ChapterUpdatePage extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#chapter-update-page');

  connectedCallback() {
    if (!this.hasChildNodes()) {
      const tmpl = tmplClone(ChapterUpdatePage.TMPL);
      $<HTMLFormElement>('form', tmpl).onsubmit = this.handleSubmit.bind(this);
      this.appendChild(tmpl);
    }

    this.render();
  }

  async render() {
    const bookId = getRouteParam('bookId');
    const chapterId = getRouteParam('chapterId');

    const link = hashChapterList(bookId);
    $<HTMLAnchorElement>('#chapter-list-link', this).href = link;

    const githubConfig = await githubConfigGet();
    const result = await chapterGet(githubConfig, bookId, chapterId);
    if (!result.isOk()) {
      errorGlobal(`Unable to get chapter id: ${bookId}`);
      return;
    }

    const chapter = result.getValue();

    $<HTMLInputElement>('#id').value = chapter.id;
    $<HTMLInputElement>('#title').value = chapter.title;
  }

  async handleSubmit(e: SubmitEvent) {
    e.preventDefault();

    const bookId = getRouteParam('bookId');

    const form = e.target as HTMLFormElement;

    const formData = new FormData(form);
    const id = fieldGet(formData, 'id');
    const title = fieldGet(formData, 'title');

    fieldErrorReset(form);

    fieldRequired(form, title);

    if (!fieldErrorExists(form)) {
      const button = $<HTMLButtonElement>('#btn-submit', form);
      button.disabled = true;

      this.doUpdate(bookId, id.value, title.value).finally(() => {
        button.disabled = false;
      });
    }
  }

  async doUpdate(bookId: string, id: string, title: string) {
    const githubConfig = await githubConfigGet();
    const result = await chapterUpdate(githubConfig, bookId, {
      id: id,
      title: title,
    });
    if (result.hasError()) {
      errorGlobal(
        `Unable to update the chapter: ${id} - ${result.getMessage()}`
      );
      return;
    }

    window.location.hash = hashChapterList(bookId);
  }
}
