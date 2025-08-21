import { createFragment } from '../lib/html/createFragment';
import { html } from '../lib/html/html';
import { TKeyValue } from '../lib/types';
import { STYLES } from '../lib/ui/stylesheets';
import { $ } from '../lib/utils/query';

export class KeyValues extends HTMLElement {
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
        .wrapper {
          display: grid;
          grid-gap: var(--gap-small);
          grid-template-columns: 1fr 1fr 1fr;
        }
      </style>
      <div id="wrapper" class="wrapper"></div>
    `;

    return createFragment(str);
  }

  renderData(data: TKeyValue) {
    const str = /* html */ html`
      <div class="is-row is-gap-small">
        <div class="is-key">${data.key}</div>
        <div class="is-value">${data.value}</div>
      </div>
    `;
    return createFragment(str);
  }

  update(data: TKeyValue[]) {
    if (this.shadowRoot) {
      const arr = data.map((d) => this.renderData(d));
      $<HTMLElement>('#wrapper', this.shadowRoot).replaceChildren(...arr);
    }
  }
}
