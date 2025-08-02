import { createFragment } from '../lib/html/createFragment';
import { html } from '../lib/html/html';
import { hashLessionProcess } from '../lib/location/hash';
import { lessionExists, lessionRemove } from '../lib/model/lession';
import { STYLES } from '../lib/ui/stylesheets';
import { $ } from '../lib/utils/query';

export class LessionContinue extends HTMLElement {
  connectedCallback() {
    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: 'open' });
      shadow.adoptedStyleSheets = STYLES;
      shadow.appendChild(this.renderComponent());
    }

    this.render();
  }

  render() {
    if (lessionExists()) {
      this.style.display = 'block';
    } else {
      this.style.display = 'none';
    }
  }

  onContinue() {
    window.location.hash = hashLessionProcess();
  }

  onEnd() {
    lessionRemove();
    this.style.display = 'none';
  }

  renderComponent() {
    const str = /* html */ html`
      <div class="is-row is-gap">
        <button class="btn" id="btn-continue">Continue</button>
        <button class="btn" id="btn-end">End</button>
      </div>
    `;
    const frag = createFragment(str);

    $<HTMLButtonElement>('#btn-continue', frag).onclick =
      this.onContinue.bind(this);
    $<HTMLButtonElement>('#btn-end', frag).onclick = this.onEnd.bind(this);

    return frag;
  }
}
