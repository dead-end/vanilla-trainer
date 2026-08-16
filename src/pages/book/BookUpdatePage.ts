import { bookGet, bookUpdate } from '../../lib/model/book';
import { getRouteParam } from '../../lib/route';
import { $ } from '../../lib/utils/query';
import { fieldGet, fieldRequired } from '../../lib/ui/field';
import { fieldErrorExists, fieldErrorReset } from '../../lib/ui/field';
import { hashBookList } from '../../lib/location/hash';
import { LocationInfo } from '../../components/LocationInfo';
import { html } from '../../lib/html/html';
import { createFragment } from '../../lib/html/createFragment';

const PAGE_FRAG = createFragment(/* html */ html`
  <div class="is-column is-gap">
    <div class="page-title">Update Book</div>
    <location-info id="location-info"></location-info>
    <form class="is-column is-gap">
      <ui-field data-id="id" data-label="Id">
        <input id="id" name="id" type="text" readonly />
      </ui-field>
      <ui-field data-id="title" data-label="Title">
        <input id="title" name="title" type="text" />
      </ui-field>
      <ui-field data-id="desc" data-label="Description">
        <textarea id="desc" name="desc" rows="4"></textarea>
      </ui-field>
      <div class="is-row is-gap">
        <a href="#/books" class="btn">Cancel</a>
        <button class="btn" type="submit">Update</button>
      </div>
    </form>
  </div>
`);

export class BookUpdatePage extends HTMLElement {
  connectedCallback() {
    if (!this.hasChildNodes()) {
      const frag = PAGE_FRAG.cloneNode(true) as DocumentFragment;
      $<HTMLFormElement>('form', frag).onsubmit = this.handleSubmit;
      this.appendChild(frag);
    }

    this.render();
  }

  async render() {
    const bookId = getRouteParam('bookId');

    $<LocationInfo>('#location-info').show(bookId);
    const book = await bookGet(bookId);

    $<HTMLInputElement>('#id').value = book.id;
    $<HTMLInputElement>('#title').value = book.title;
    $<HTMLTextAreaElement>('#desc').value = book.description;
  }

  handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;

    const formData = new FormData(form);
    const id = fieldGet(formData, 'id');
    const title = fieldGet(formData, 'title');
    const desc = fieldGet(formData, 'desc');

    fieldErrorReset(form);

    fieldRequired(form, title);
    fieldRequired(form, desc);

    const button = $<HTMLButtonElement>('button', form);

    if (!fieldErrorExists(form)) {
      button.disabled = true;

      bookUpdate({
        id: id.value,
        title: title.value,
        description: desc.value,
      })
        .then(() => {
          window.location.hash = hashBookList();
        })
        .finally(() => {
          button.disabled = false;
        });
    }
  };
}
