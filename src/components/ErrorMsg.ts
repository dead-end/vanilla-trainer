import { createFragment } from '../lib/html/createFragment';
import { html } from '../lib/html/html';
import { STYLES } from '../lib/ui/stylesheets';
import { $ } from '../lib/utils/query';

const COMP_FRAG = createFragment(/* html */ html`
  <div class="is-column is-gap is-border is-padding">
    <div class="is-error is-text-bold is-text-larg">Error</div>
    <p id="error-msg"></p>
    <div class="is-row is-gap">
      <button id="error-btn" class="btn" type="button">Ok</button>
    </div>
  </div>
`);

/**
 * The class displays an error message. The message is displayed when a custom
 * event is triggered and shows the message of the event. The message has to be
 * manually confirmed to disappear.
 */
export class ErrorMsg extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.adoptedStyleSheets = STYLES;
    shadow.appendChild(COMP_FRAG.cloneNode(true));

    this.style.display = 'none';
  }

  connectedCallback() {
    if (this.shadowRoot !== null) {
      $<HTMLElement>('#error-btn', this.shadowRoot).onclick = this.onOk;
      document.addEventListener('error-msg', this.onError);
    }
  }

  disconnectedCallback() {
    if (this.shadowRoot != null) {
      $<HTMLElement>('#error-btn', this.shadowRoot).onclick = null;
      document.removeEventListener('error-msg', this.onError);
    }
  }

  onError = (e: Event) => {
    if (this.shadowRoot) {
      const detail = (e as CustomEvent).detail;
      $('#error-msg', this.shadowRoot).textContent = detail;
      this.style.display = 'block';
    }
  };

  onOk = () => {
    if (this.shadowRoot) {
      $('#error-msg', this.shadowRoot).textContent = '';
      this.style.display = 'none';
    }
  };
}
