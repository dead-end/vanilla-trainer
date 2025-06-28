import { TKeyValue } from '../lib/types';
import { STYLES } from '../lib/ui/stylesheets';
import { $ } from '../lib/utils/query';
import { tmplClone } from '../lib/utils/tmpl';

export class KeyValues extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#tmpl-key-values');
  static TMPL_ENTRY = $<HTMLTemplateElement>('#tmpl-key-values-entry');

  connectedCallback() {
    if (!this.shadowRoot) {
      const tmpl = tmplClone(KeyValues.TMPL);

      const shadow = this.attachShadow({ mode: 'open' });
      shadow.adoptedStyleSheets = STYLES;
      shadow.appendChild(tmpl);
    }
  }

  update(data: TKeyValue[]) {
    if (this.shadowRoot) {
      const arr: DocumentFragment[] = [];

      data.forEach((d) => {
        const tmpl = tmplClone(KeyValues.TMPL_ENTRY);
        $<HTMLElement>('[data-id="key"]', tmpl).textContent = d.key;
        $<HTMLElement>('[data-id="value"]', tmpl).textContent = d.value;
        arr.push(tmpl);
      });

      $<HTMLElement>('#wrapper', this.shadowRoot).replaceChildren(...arr);
    }
  }
}
