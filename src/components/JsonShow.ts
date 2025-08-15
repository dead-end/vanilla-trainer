import { createFragment } from '../lib/html/createFragment';
import { html } from '../lib/html/html';
import { STYLES } from '../lib/ui/stylesheets';
import { $ } from '../lib/utils/query';

export class JsonShow extends HTMLElement {
  connectedCallback() {
    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: 'open' });
      shadow.adoptedStyleSheets = STYLES;
      shadow.appendChild(this.renderComponent());
    }
  }

  renderComponent() {
    const str = /* html */ html`
      <style>
        code {
          white-space: pre;
        }
      </style>

      <div class="is-column is-gap-small" id="wrapper" style="display: none">
        <div class="is-text-bold" id="title"></div>
        <div>
          <span class="is-key">Path</span>
          <span class="is-value" id="path"></span>
        </div>
        <code class="is-border is-shadow is-padding-input" id="content"></code>
      </div>
    `;

    return createFragment(str);
  }

  show(title: string, path: string, content: string) {
    if (this.shadowRoot) {
      // Default is display: none if cache has no search index
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
