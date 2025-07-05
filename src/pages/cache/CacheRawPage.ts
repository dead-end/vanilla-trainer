import { JsonShow } from '../../components/JsonShow';
import { LocationInfo } from '../../components/LocationInfo';
import { errorGlobal } from '../../lib/GlobalError';
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
import { tmplClone } from '../../lib/utils/tmpl';

export class CacheRawPage extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#cache-raw-page');

  connectedCallback() {
    if (!this.hasChildNodes()) {
      const tmpl = tmplClone(CacheRawPage.TMPL);

      $<HTMLButtonElement>('#btn-cancel', tmpl).onclick = () => {
        history.back();
      };

      this.appendChild(tmpl);
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
      return;
    }
    jsonShow.hide();
  }
}
