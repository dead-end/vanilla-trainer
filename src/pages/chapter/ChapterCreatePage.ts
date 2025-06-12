import { fieldErrorExists, fieldErrorReset } from '../../lib/ui/field';
import { $ } from '../../lib/utils/query';
import { tmplClone } from '../../lib/utils/tmpl';
import { fieldGet, fieldId, fieldRequired } from '../../lib/ui/field';
import { chapterCreate } from '../../lib/model/chapter';
import { getRouteParam } from '../../lib/route';
import { hashChapterList } from '../../lib/location/hash';

export class ChapterCreatePage extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#chapter-create-page');

  connectedCallback() {
    if (!this.hasChildNodes()) {
      const tmpl = tmplClone(ChapterCreatePage.TMPL);
      $<HTMLFormElement>('form', tmpl).onsubmit = this.handleSubmit.bind(this);
      this.appendChild(tmpl);
    }

    this.render();
  }

  render() {
    const bookId = getRouteParam('bookId');
    const link = hashChapterList(bookId);
    $<HTMLAnchorElement>('#chapter-list-link', this).href = link;
  }

  async handleSubmit(e: SubmitEvent) {
    e.preventDefault();

    const bookId = getRouteParam('bookId');

    const form = e.target as HTMLFormElement;

    const formData = new FormData(form);
    const id = fieldGet(formData, 'id');
    const title = fieldGet(formData, 'title');

    fieldErrorReset(form);

    fieldRequired(form, id) && fieldId(form, id);
    fieldRequired(form, title);

    if (!fieldErrorExists(form)) {
      const button = $<HTMLButtonElement>('#btn-submit', form);
      button.disabled = true;

      chapterCreate(bookId, {
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
