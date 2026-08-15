import { fieldErrorExists, fieldErrorReset } from '../../lib/ui/field';
import { $ } from '../../lib/utils/query';
import { fieldGet, fieldId, fieldRequired } from '../../lib/ui/field';
import { chapterCreate } from '../../lib/model/chapter';
import { getRouteParam } from '../../lib/route';
import { hashChapterList } from '../../lib/location/hash';
import { LocationInfo } from '../../components/LocationInfo';
import { createFragment } from '../../lib/html/createFragment';
import { html } from '../../lib/html/html';

const PAGE_FRAG = createFragment(/* html */ html`
  <div class="is-column is-gap">
    <div class="page-title">Create Chapter</div>
    <location-info id="location-info"></location-info>
    <form class="is-column is-gap">
      <ui-field data-id="id" data-label="Id">
        <input id="id" name="id" type="text" />
      </ui-field>
      <ui-field data-id="title" data-label="Title">
        <input id="title" name="title" type="text" />
      </ui-field>
      <div class="is-row is-gap">
        <a href="#" class="btn" id="chapter-list-link">Cancel</a>
        <button class="btn" type="submit" id="btn-submit">Create</button>
      </div>
    </form>
  </div>
`);

/**
 * The class implements a page to create a chapter.
 */
export class ChapterCreatePage extends HTMLElement {
  connectedCallback() {
    if (!this.hasChildNodes()) {
      const frag = PAGE_FRAG.cloneNode(true) as DocumentFragment;
      $<HTMLFormElement>('form', frag).onsubmit = this.handleSubmit;
      this.appendChild(frag);
    }

    this.render();
  }

  render() {
    const bookId = getRouteParam('bookId');

    $<LocationInfo>('#location-info').show(bookId);

    const link = hashChapterList(bookId);
    $<HTMLAnchorElement>('#chapter-list-link', this).href = link;
  }

  handleSubmit = async (e: SubmitEvent) => {
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
  };
}
