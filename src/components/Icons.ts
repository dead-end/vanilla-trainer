import { STYLES } from '../lib/ui/stylesheets';
import { $, tmplClone } from '../lib/utils';

export class Icons extends HTMLElement {
  static ICONS: Record<string, HTMLTemplateElement> = {
    logout: $<HTMLTemplateElement>('#tmpl-icon-logout'),
    home: $<HTMLTemplateElement>('#tmpl-icon-home'),
    admin: $<HTMLTemplateElement>('#tmpl-icon-admin'),
    book: $<HTMLTemplateElement>('#tmpl-icon-book'),
    delete: $<HTMLTemplateElement>('#tmpl-icon-delete'),
    update: $<HTMLTemplateElement>('#tmpl-icon-update'),
    list: $<HTMLTemplateElement>('#tmpl-icon-list'),
    start: $<HTMLTemplateElement>('#tmpl-icon-start'),
  };

  static TMPL = $<HTMLTemplateElement>('#tmpl-icon');

  connectedCallback() {
    if (!this.shadowRoot) {
      const name = this.getAttribute('data-icon') || 'login';

      const tmpl = tmplClone(Icons.TMPL);

      const tmplIcon = tmplClone(Icons.ICONS[name]);
      tmpl.appendChild(tmplIcon);

      const shadow = this.attachShadow({ mode: 'open' });
      shadow.adoptedStyleSheets = STYLES;
      shadow.appendChild(tmpl);
    }
  }
}
