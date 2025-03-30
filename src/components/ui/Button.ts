import { $, tmplClone, tmplCreate } from '../../lib/utils';

export class Button extends HTMLElement {
  /*
  static TMPL = tmplCreate(`
<button>Default Label</button>
`);*/
  static TMPL = $<HTMLTemplateElement>('#ui-button');
  button: any;
  constructor() {
    super();

    const tmpl = tmplClone(Button.TMPL);
    const shadow = this.attachShadow({ mode: 'open' });
    this.button = $('button', tmpl);
    shadow.appendChild(tmpl);
  }

  connectedCallback() {
    const label = this.getAttribute('data-label') || 'no-label-found';

    this.button.textContent = label;
  }
}
