import { createFragment } from '../lib/html/createFragment';
import { html } from '../lib/html/html';

const PAGE_FRAG = createFragment(/* html */ html`
  <div class="page-title">Page not found</div>
  <p class="is-error">Sorry, the page was not found!</p>
`);

/**
 * The class implements the not found page.
 */
export class NotFoundPage extends HTMLElement {
  connectedCallback() {
    if (!this.hasChildNodes()) {
      this.appendChild(PAGE_FRAG.cloneNode(true));
    }
  }
}
