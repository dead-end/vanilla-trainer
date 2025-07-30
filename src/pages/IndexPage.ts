import { createFragment } from '../lib/html/createFragment';
import { html } from '../lib/html/html';

export class IndexPage extends HTMLElement {
  connectedCallback() {
    if (!this.hasChildNodes()) {
      this.appendChild(this.renderPage());
    }
  }

  renderPage() {
    const str = /* html */ html`
      <div class="is-column is-gap">
        <div class="page-title">Welcome to Vanilla Trainer</div>
        <lession-continue></lession-continue>
      </div>
    `;
    return createFragment(str);
  }
}
