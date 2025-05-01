import { mdToHtml } from '../../lib/markdown';
import { STYLES } from '../../lib/ui/stylesheets';
import { $, tmplClone } from '../../lib/utils';

export class PreviewField extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#tmpl-preview-field');

  connectedCallback() {
    if (!this.shadowRoot) {
      const tmpl = tmplClone(PreviewField.TMPL);

      const id = this.getAttribute('data-id') || 'no-id';
      const input = $<HTMLTextAreaElement>(`#${id}`);
      const preview = $<HTMLElement>('#preview', tmpl);

      input.oninput = () => {
        console.log('input');
        preview.innerHTML = mdToHtml(input.value);
      };

      const shadow = this.attachShadow({ mode: 'open' });
      shadow.adoptedStyleSheets = STYLES;
      shadow.appendChild(tmpl);
    }
  }
}
