import { STYLES } from '../lib/ui/stylesheets';
import { $ } from '../lib/utils/query';
import { tmplClone } from '../lib/utils/tmpl';

export class KeyValues extends HTMLElement {
  static TMPL_LINE = $<HTMLTemplateElement>('#tmpl-key-values-line');
  static TMPL_ENTRY = $<HTMLTemplateElement>('#tmpl-key-values-entry');

  static TMPL_TABLE = $<HTMLTemplateElement>('#tmpl-key-values-table');
  static TMPL_ROW = $<HTMLTemplateElement>('#tmpl-key-values-row');

  connectedCallback() {
    if (!this.shadowRoot) {
      const tmpl = this.getWrapperTmpl();

      const shadow = this.attachShadow({ mode: 'open' });
      shadow.adoptedStyleSheets = STYLES;
      shadow.appendChild(tmpl);
    }
  }

  update(data: { key: string; value: string }[]) {
    if (this.shadowRoot) {
      const arr: DocumentFragment[] = [];

      data.forEach((d) => {
        const tmpl = this.getDataTmpl();
        $<HTMLElement>('[data-id="key"]', tmpl).textContent = `${d.key}:`;
        $<HTMLElement>('[data-id="value"]', tmpl).textContent = d.value;
        arr.push(tmpl);
      });

      $<HTMLElement>('#wrapper', this.shadowRoot).replaceChildren(...arr);
    }
  }

  getWrapperTmpl() {
    if (this.getAttribute('type') === 'line') {
      return tmplClone(KeyValues.TMPL_LINE);
    }
    return tmplClone(KeyValues.TMPL_TABLE);
  }

  getDataTmpl() {
    if (this.getAttribute('type') === 'line') {
      return tmplClone(KeyValues.TMPL_ENTRY);
    }
    return tmplClone(KeyValues.TMPL_ROW);
  }
}
