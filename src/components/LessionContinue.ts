import { createFragment } from '../lib/html/createFragment';
import { html } from '../lib/html/html';
import { hashLessionProcess } from '../lib/location/hash';
import { lessionExists, lessionRemove } from '../lib/model/lession';
import { STYLES } from '../lib/ui/stylesheets';
import { $ } from '../lib/utils/query';

const COMP_FRAG = createFragment(/* html */ html`
  <div class="is-row is-gap">
    <button class="btn" id="btn-continue">Continue</button>
    <button class="btn" id="btn-end">End</button>
  </div>
`);

/**
 * The class renders the lession continue and cancel buttons on the homepage.
 * It checks if a lession exists.If so, it provides a button to end the lession
 * and one with a redirect to continue the lession.
 */
export class LessionContinue extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.adoptedStyleSheets = STYLES;
    shadow.appendChild(COMP_FRAG.cloneNode(true));
  }

  connectedCallback() {
    if (this.shadowRoot != null) {
      $<HTMLButtonElement>('#btn-continue', this.shadowRoot).onclick =
        this.onContinue;
      $<HTMLButtonElement>('#btn-end', this.shadowRoot).onclick = this.onEnd;
    }

    this.checkLessons();
  }

  disconnectedCallback() {
    if (this.shadowRoot != null) {
      $<HTMLButtonElement>('#btn-continue', this.shadowRoot).onclick = null;

      $<HTMLButtonElement>('#btn-end', this.shadowRoot).onclick = null;
    }
  }

  checkLessons() {
    if (lessionExists()) {
      this.style.display = 'block';
    } else {
      this.style.display = 'none';
    }
  }

  onContinue = () => {
    window.location.hash = hashLessionProcess();
  };

  onEnd = () => {
    lessionRemove();
    this.style.display = 'none';
  };
}
