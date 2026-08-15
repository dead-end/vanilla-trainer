import { QuestionShow } from '../../components/QuestionShow';
import { createFragment } from '../../lib/html/createFragment';
import { html } from '../../lib/html/html';
import { hashSearch } from '../../lib/location/hash';
import { getRouteParam } from '../../lib/route';
import { searchDo } from '../../lib/search';
import {
  fieldErrorExists,
  fieldErrorReset,
  fieldGet,
  fieldMinLen,
  fieldRequired,
} from '../../lib/ui/field';
import { $ } from '../../lib/utils/query';

const PAGE_FRAG = createFragment(/* html */ html`
  <div class="is-column is-gap">
    <div class="page-title">Search</div>
    <form class="is-column is-gap">
      <ui-field data-id="search" data-label="Search text">
        <input id="search" name="search" type="text" />
      </ui-field>

      <div class="is-row is-gap">
        <button class="btn" type="submit">Search</button>
      </div>
    </form>
    <div data-id="num" class="is-text-bold is-text-right is-text-small"></div>
    <div data-id="questions"></div>
  </div>
`);

/**
 * The class implements the search page. The search string is taken from the
 * url. The form submit does a redirect with the search string in the url.
 */
export class SearchPage extends HTMLElement {
  connectedCallback() {
    if (!this.hasChildNodes()) {
      const frag = PAGE_FRAG.cloneNode(true) as DocumentFragment;
      $<HTMLFormElement>('form', frag).onsubmit = this.handleSubmit;
      this.appendChild(frag);
    }

    this.search();
  }

  async search() {
    const searchRaw = getRouteParam('searchStr');
    if (!searchRaw) {
      return;
    }
    const searchStr = decodeURI(searchRaw);
    if (searchStr.length < 3) {
      return;
    }
    $<HTMLInputElement>('#search').value = searchStr;

    const arr: QuestionShow[] = [];

    const results = await searchDo(searchStr.toLowerCase());
    $<HTMLElement>('[data-id="num"]').textContent =
      results.length === 0
        ? 'Nothing found!'
        : `Number of results: ${results.length}`;

    results.forEach((r) => {
      arr.push(new QuestionShow().init(r.questId, r.quest));
    });

    $<HTMLElement>('[data-id="questions"]').replaceChildren(...arr);
  }

  handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const search = fieldGet(formData, 'search');

    fieldErrorReset(form);
    fieldRequired(form, search) && fieldMinLen(form, search, 3);

    if (!fieldErrorExists(form)) {
      window.location.hash = hashSearch(encodeURI(search.value));
    }
  };
}
