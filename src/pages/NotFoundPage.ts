import { createFragment } from '../lib/html/createFragment';
import { html } from '../lib/html/html';

export class NotFoundPage extends HTMLElement {
  connectedCallback() {
    if (!this.hasChildNodes()) {
      this.appendChild(this.renderComponent());
    }
  }

  renderComponent() {
    const str = /* html */ html`
      <div class="page-title">Page not found</div>
      <p class="is-error">Sorry, the page was not found!</p>
    `;
    return createFragment(str);
  }
}
