import { getRouteParam } from '../../lib/route';
import { $, tmplClone } from '../../lib/utils';
import { fieldGet, fieldRequired } from '../../lib/ui/field';
import { fieldErrorExists, fieldErrorReset } from '../../lib/ui/field';
import { chapterGet, chapterUpdate } from '../../lib/model/chapter';
import { hashChapterList } from '../../lib/location/hash';

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

    const chapter = await chapterGet(bookId, chapterId);

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

      chapterUpdate(bookId, {
        id: id.value,
        title: title.value,
      })
        .then(() => {
          window.location.hash = hashChapterList(bookId);
        })
        .finally(() => {
          button.disabled = false;
        });
    }
  }
}
