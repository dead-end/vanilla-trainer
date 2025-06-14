import { JsonShow } from '../../components/JsonShow';
import { errorGlobal } from '../../lib/GlobalError';
import { pathIsQuestions, pathIsValid } from '../../lib/location/path';
import { cacheGetRaw } from '../../lib/remote/cache';
import { getRouteParam } from '../../lib/route';
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

    $<JsonShow>('#cache').show(path, await cacheGetRaw(path));

    if (pathIsQuestions(path)) {
      $<JsonShow>('#search').show(path, await cacheGetRaw(path));
    }
  }
}
