import { STYLES } from '../lib/ui/stylesheets';
import { $ } from '../lib/utils/query';
import { tmplClone } from '../lib/utils/tmpl';

export class JsonShow extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#tmpl-json-show');

  connectedCallback() {
    if (!this.shadowRoot) {
      const tmpl = tmplClone(JsonShow.TMPL);

      const shadow = this.attachShadow({ mode: 'open' });
      shadow.adoptedStyleSheets = STYLES;
      shadow.appendChild(tmpl);
    }
  }

  show(path: string, content: string) {
    if (this.shadowRoot) {
      $<HTMLElement>('#wrapper', this.shadowRoot).style.display = 'flex';

      $<HTMLElement>('#path', this.shadowRoot).innerText = `Path: ${path}`;
      $<HTMLElement>('#content', this.shadowRoot).innerText = content;
    }
  }
}
