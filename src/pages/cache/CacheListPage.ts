import { ConfirmDialog } from '../../components/ConfirmDialog';
import { createFragment } from '../../lib/html/createFragment';
import { html } from '../../lib/html/html';
import { pathIsQuestions } from '../../lib/location/path';
import {
  entryDelete,
  entryListCache,
  entryListSearch,
} from '../../lib/persist/entry';
import { cacheAll, cacheCheckHashes } from '../../lib/remote/cache';
import { TCache, TSearch } from '../../lib/types';
import { $ } from '../../lib/utils/query';

export class CacheListPage extends HTMLElement {
  connectedCallback() {
    if (!this.hasChildNodes()) {
      this.appendChild(this.renderPage());
    }

    this.render();
  }

  onCacheLoad() {
    $<ConfirmDialog>('#confirm-dialog').activate(
      'Load Cache',
      'Do you realy want to load all files?',
      async () => {
        await cacheAll();
        this.render();
      }
    );
  }

  onCacheCheck() {
    $<ConfirmDialog>('#confirm-dialog').activate(
      'Check Cache',
      'Do you realy want to check all files?',
      async () => {
        await cacheCheckHashes();
        this.render();
      }
    );
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

    const caches = await entryListCache();
    const searches = await entryListSearch();

    const arr = caches.map((cache) =>
      this.renderEntry(cache, searches, confirmDialog)
    );

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

  renderPage() {
    const str = /* html */ html`
      <div class="is-column is-gap">
        <div class="page-title">Cache Entries</div>
        <table>
          <thead>
            <tr>
              <th>Path</th>
              <th>Cache Hash</th>
              <th>Search Hash</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
        <div class="is-row is-gap">
          <a href="#/books" class="btn">Books</a>
          <button id="cache-load" class="btn">Load</button>
          <button id="cache-check" class="btn">Check</button>
        </div>
      </div>
    `;

    const frag = createFragment(str);

    $<HTMLButtonElement>('#cache-load', frag).onclick =
      this.onCacheLoad.bind(this);

    $<HTMLButtonElement>('#cache-check', frag).onclick =
      this.onCacheCheck.bind(this);

    return frag;
  }

  renderEntry(
    cache: TCache<any>,
    searches: TSearch[],
    confirmDialog: ConfirmDialog
  ) {
    const cacheHash = this.getHash(cache.hash);
    const search = searches.find((s) => s.path === cache.path);
    const searchHash = this.getSearchHash(cache.path, search);

    const str = /* html */ html`
      <tr>
        <td>${cache.path}</td>
        <td>${cacheHash}</td>
        <td>${searchHash}</td>
        <td>
          <div class="is-row is-gap-action">
            <ui-icons data-icon="delete"></ui-icons>
          </div>
        </td>
      </tr>
    `;

    const frag = createFragment(str);

    $<HTMLElement>('[data-icon="delete"]', frag).onclick = this.onDelete(
      confirmDialog,
      cache.path
    ).bind(this);

    return frag;
  }
}
