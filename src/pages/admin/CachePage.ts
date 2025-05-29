import { ConfirmDialog } from '../../components/ConfirmDialog';
import { cacheEntryDelete, cacheEntryList } from '../../lib/remote/cacheEntry';
import { $, tmplClone } from '../../lib/utils';

export class CachePage extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#cache-page');
  static TMPL_ROW = $<HTMLTemplateElement>('#tmpl-cache-list');

  connectedCallback() {
    if (!this.hasChildNodes()) {
      const tmpl = tmplClone(CachePage.TMPL);
      this.appendChild(tmpl);
    }

    this.render();
  }

  async render() {
    const confirmDialog = $<ConfirmDialog>('#confirm-dialog');

    const arr: DocumentFragment[] = [];

    const caches = await cacheEntryList();

    caches.forEach((cache) => {
      const tmpl = tmplClone(CachePage.TMPL_ROW);

      $('[data-id="path"]', tmpl).textContent = cache.path;
      $('[data-id="hash"]', tmpl).textContent = cache.hash;
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
          cacheEntryDelete(path).then(() => {
            this.render();
          });
        }
      );
    };
  }
}
