import { createFragment } from '../lib/html/createFragment';
import { html } from '../lib/html/html';

const PAGE_FRAG = createFragment(/* html */ html`
  <div class="is-column is-gap">
    <div class="page-title">Welcome to Vanilla Trainer</div>
    <lession-continue></lession-continue>
  </div>
`);

/**
 * The class implements the home / index page.
 */
export class IndexPage extends HTMLElement {
  connectedCallback() {
    if (!this.hasChildNodes()) {
      this.appendChild(PAGE_FRAG.cloneNode(true));
    }
  }
}
