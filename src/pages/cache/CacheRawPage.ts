import { JsonShow } from '../../components/JsonShow';
import { LocationInfo } from '../../components/LocationInfo';
import { errorGlobal } from '../../lib/GlobalError';
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

const PAGE_FRAG = createFragment(/* html */ html`
  <div class="is-column is-gap">
    <div class="page-title">Cache Raw</div>
    <location-info id="location-info"></location-info>

    <json-show id="cache"></json-show>
    <json-show id="search"></json-show>

    <div class="is-row is-gap">
      <button class="btn" id="btn-cancel">Back</button>
    </div>
  </div>
`);

export class CacheRawPage extends HTMLElement {
  connectedCallback() {
    if (!this.hasChildNodes()) {
      const frag = PAGE_FRAG.cloneNode(true) as DocumentFragment;
      $<HTMLButtonElement>('#btn-cancel', frag).onclick = () => {
        history.back();
      };
      this.appendChild(frag);
    }

    this.render();
  }

  async render() {
    const path = getRouteParam('path');
    if (!pathIsValid(path)) {
      errorGlobal(`Path is not valid ${path}`);
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
    }
  }
}
