import { QuestionShow } from '../../components/QuestionShow';
import { hashSearch } from '../../lib/hash';
import { getRouteParam } from '../../lib/route';
import { searchDo } from '../../lib/search';
import {
  fieldErrorExists,
  fieldErrorReset,
  fieldGet,
  fieldMinLen,
  fieldRequired,
} from '../../lib/ui/field';
import { $, tmplClone } from '../../lib/utils';

export class SearchPage extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#search-page');

  connectedCallback() {
    if (!this.hasChildNodes()) {
      const tmpl = tmplClone(SearchPage.TMPL);

      $<HTMLFormElement>('form', tmpl).onsubmit = this.handleSubmit.bind(this);

      this.appendChild(tmpl);
    }

    this.render();
  }

  async render() {
    const searchStr = getRouteParam('searchStr');
    if (!searchStr || searchStr.length < 3) {
      return;
    }
    $<HTMLInputElement>('#search').value = searchStr;

    const arr: QuestionShow[] = [];

    const results = await searchDo(searchStr);
    results.forEach((r) => {
      arr.push(QuestionShow.instance(r.questId, r.quest));
    });

    $<HTMLElement>('[data-id="questions"]').replaceChildren(...arr);
  }

  async handleSubmit(e: SubmitEvent) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const search = fieldGet(formData, 'search');

    fieldErrorReset(form);
    fieldRequired(form, search) && fieldMinLen(form, search, 3);

    if (!fieldErrorExists(form)) {
      window.location.hash = hashSearch(search.value);
    }
  }
}
