import { errorGlobal } from '../../lib/GlobalError';
import { pathIsQuestions, pathIsValid } from '../../lib/location/path';
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

    $<HTMLElement>('#path-cache').innerText = `Cache path: ${path}`;
    $<HTMLElement>('#raw-json').innerText = await cacheGetRaw(path);

    if (pathIsQuestions(path)) {
      $<HTMLElement>('#path-search').innerText = `Search path: ${path}`;
      $<HTMLElement>('#raw-search').innerText = await searchGetRaw(path);
    } else {
      $<HTMLElement>('#search-block').style.display = 'none';
    }
  }
}
