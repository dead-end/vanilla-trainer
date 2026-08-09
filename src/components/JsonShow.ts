import { createFragment } from '../lib/html/createFragment';
import { html } from '../lib/html/html';
import { STYLES } from '../lib/ui/stylesheets';
import { $ } from '../lib/utils/query';

const COMP_FRAG = createFragment(/* html */ html`
  <style>
    code {
      white-space: pre;
    }
  </style>

  <div class="is-column is-gap-small" id="wrapper">
    <div class="is-text-bold" id="title"></div>
    <div>
      <span class="is-key">Path</span>
      <span class="is-value" id="path"></span>
    </div>
    <code class="is-border is-shadow is-padding-input" id="content"></code>
  </div>
`);

/**
 * The class shows a json structure, with a title and a path. It gets its
 * content programmatically and it is only shown when content is present.
 * Some json files have an additional search json structure.
 */
export class JsonShow extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.adoptedStyleSheets = STYLES;
    shadow.appendChild(COMP_FRAG.cloneNode(true));

    this.style.display = 'none';
  }

  show(title: string, path: string, content: string) {
    if (this.shadowRoot) {
      this.style.display = 'block';

      $<HTMLElement>('#title', this.shadowRoot).textContent = title;
      $<HTMLElement>('#path', this.shadowRoot).textContent = path;
      $<HTMLElement>('#content', this.shadowRoot).textContent = content;
    }
  }
}
