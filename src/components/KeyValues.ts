import { createFragment } from '../lib/html/createFragment';
import { html } from '../lib/html/html';
import { TKeyValue } from '../lib/types';
import { STYLES } from '../lib/ui/stylesheets';
import { $ } from '../lib/utils/query';

const COMP_FRAG = createFragment(/* html */ html`
  <style>
    .wrapper {
      display: grid;
      grid-gap: var(--gap-small);
      grid-template-columns: 1fr 1fr 1fr;
    }
  </style>
  <div id="wrapper" class="wrapper"></div>
`);

const DATA_FRAG = createFragment(/* html */ html`
  <div class="is-row is-gap-small">
    <div class="is-key"></div>
    <div class="is-value"></div>
  </div>
`);

/**
 * The class renders an array of key / values. The array is provided
 * programmatically.
 */
export class KeyValues extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.adoptedStyleSheets = STYLES;
    shadow.appendChild(COMP_FRAG.cloneNode(true));
  }

  update(data: TKeyValue[]) {
    if (this.shadowRoot) {
      const arr = data.map((d) => this.renderData(d));
      $<HTMLElement>('#wrapper', this.shadowRoot).replaceChildren(...arr);
    }
  }

  renderData(data: TKeyValue) {
    const clone = DATA_FRAG.cloneNode(true) as DocumentFragment;
    $<HTMLElement>('.is-key', clone).innerText = data.key;
    $<HTMLElement>('.is-value', clone).innerText = data.value;
    return clone;
  }
}
