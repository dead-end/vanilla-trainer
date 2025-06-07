import { QuestionShow } from '../../components/QuestionShow';
import { searchDo } from '../../lib/search';
import { TSearchResult } from '../../lib/types';
import {
  fieldErrorExists,
  fieldErrorReset,
  fieldGet,
  fieldMinLen,
  fieldRequired,
} from '../../lib/ui/field';
import { $, tmplClone } from '../../lib/utils';

// TODO: search with a url path parameter. This allows back
// http://localhost:5173/#/misc/search/search-str

export class SearchPage extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#search-page');

  connectedCallback() {
    if (!this.hasChildNodes()) {
      const tmpl = tmplClone(SearchPage.TMPL);

      $<HTMLFormElement>('form', tmpl).onsubmit = this.handleSubmit.bind(this);

      this.appendChild(tmpl);
    }
  }

  async render(results: TSearchResult[]) {
    const arr: QuestionShow[] = [];

    results.forEach((r) => {
      arr.push(QuestionShow.instance(r.questId, r.quest, undefined));
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

    const button = $<HTMLButtonElement>('button', form);

    if (!fieldErrorExists(form)) {
      button.disabled = true;

      searchDo(search.value)
        .then((result) => this.render(result))
        .finally(() => {
          button.disabled = false;
        });
    }
  }
}
