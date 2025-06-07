import { ConfirmDialog } from '../../components/ConfirmDialog';
import { pathIsQuestions } from '../../lib/path';
import {
  entryDelete,
  entryListCache,
  entryListSearch,
} from '../../lib/persist/entry';
import { cacheAll } from '../../lib/remote/cache';
import { TSearch } from '../../lib/types';
import { $, tmplClone } from '../../lib/utils';

// TODO: Create page with raw cache and search content.

export class CachePage extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#cache-page');
  static TMPL_ROW = $<HTMLTemplateElement>('#tmpl-cache-list');

  connectedCallback() {
    if (!this.hasChildNodes()) {
      const tmpl = tmplClone(CachePage.TMPL);
      $<HTMLButtonElement>('#cache-load', tmpl).onclick =
        this.cacheLoad.bind(this);
      this.appendChild(tmpl);
    }

    this.render();
  }

  async cacheLoad() {
    await cacheAll();
    this.render();
  }

  getHash(hash: string) {
    return hash.substring(0, 6);
  }

  getSearchHash(path: string, search: TSearch | undefined) {
    if (!pathIsQuestions(path)) {
      return '';
    }
    if (search) {
      return this.getHash(search.hash);
    }
    return 'missing';
  }

  async render() {
    const confirmDialog = $<ConfirmDialog>('#confirm-dialog');

    const arr: DocumentFragment[] = [];

    const caches = await entryListCache();
    const searches = await entryListSearch();

    caches.forEach((cache) => {
      const tmpl = tmplClone(CachePage.TMPL_ROW);

      const search = searches.find((s) => s.path === cache.path);

      $('[data-id="path"]', tmpl).textContent = cache.path;
      $('[data-id="cache-hash"]', tmpl).textContent = this.getHash(cache.hash);
      $('[data-id="search-hash"]', tmpl).textContent = this.getSearchHash(
        cache.path,
        search
      );

      $<HTMLElement>('[data-icon="delete"]', tmpl).onclick = this.onDelete(
        confirmDialog,
        cache.path
      ).bind(this);

      arr.push(tmpl);
    });

    $<HTMLElement>('tbody').replaceChildren(...arr);
  }

  onDelete(confirmDialog: ConfirmDialog, path: string) {
    return () => {
      confirmDialog.activate(
        'Delete Cache Entry',
        `Do you realy want to delete the cache entry: ${path}?`,
        async () => {
          await entryDelete(path, pathIsQuestions(path));
          this.render();
        }
      );
    };
  }
}
