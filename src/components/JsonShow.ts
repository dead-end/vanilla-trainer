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

  show(title: string, path: string, content: string) {
    if (this.shadowRoot) {
      // TODO: why set fley? not static?
      $<HTMLElement>('#wrapper', this.shadowRoot).style.display = 'flex';

      $<HTMLElement>('#title', this.shadowRoot).innerText = title;
      $<HTMLElement>('#path', this.shadowRoot).innerText = path;
      $<HTMLElement>('#content', this.shadowRoot).innerText = content;
    }
  }

  hide() {
    this.style.display = 'none';
  }
}
