import { JsonShow } from '../../components/JsonShow';
import { LocationInfo } from '../../components/LocationInfo';
import { dispatchError } from '../../lib/error';
import { createFragment } from '../../lib/html/createFragment';
import { html } from '../../lib/html/html';
import {
  pathChaptersId,
  pathIsChapters,
  pathIsQuestions,
  pathIsValid,
  pathQuestionsId,
} from '../../lib/location/path';
import { cacheGetRaw } from '../../lib/remote/cache';
import { getRouteParam } from '../../lib/route';
import { searchGetRaw } from '../../lib/search';
import { $ } from '../../lib/utils/query';

export class CacheRawPage extends HTMLElement {
  connectedCallback() {
    if (!this.hasChildNodes()) {
      this.appendChild(this.renderComponent());
    }

    this.updateComponent();
  }

  renderComponent() {
    const str = /* html */ html`
      <div class="is-column is-gap">
        <div class="page-title">Cache Raw</div>
        <location-info id="location-info"></location-info>

        <json-show id="cache"></json-show>
        <json-show id="search"></json-show>

        <div class="is-row is-gap">
          <button class="btn" id="btn-cancel">Back</button>
        </div>
      </div>
    `;

    const frag = createFragment(str);

    $<HTMLButtonElement>('#btn-cancel', frag).onclick = () => {
      history.back();
    };

    return frag;
  }

  async updateComponent() {
    const path = getRouteParam('path');
    if (!pathIsValid(path)) {
      dispatchError(`Path is not valid ${path}`);
      return;
    }

    this.doCache(path);
    this.doSearch(path);
  }

  // TODO: Is there a better solution?
  async doCache(path: string) {
    const location = $<LocationInfo>('#location-info');

    if (pathIsQuestions(path)) {
      const [bookId, chapterId] = pathQuestionsId(path);
      location.show(bookId, chapterId);
    } else if (pathIsChapters(path)) {
      const bookId = pathChaptersId(path);
      location.show(bookId);
    } else {
      location.hide();
    }

    $<JsonShow>('#cache').show('Cache', path, await cacheGetRaw(path));
  }

  async doSearch(path: string) {
    const jsonShow = $<JsonShow>('#search');
    if (pathIsQuestions(path)) {
      jsonShow.show('Search', path, await searchGetRaw(path));
      return;
    }
    jsonShow.hide();
  }
}
