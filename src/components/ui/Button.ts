import { $, tmplClone, tmplCreate } from '../../lib/utils';

export class Button extends HTMLElement {
  /*
  static TMPL = tmplCreate(`
<button>Default Label</button>
`);*/
  static TMPL = $<HTMLTemplateElement>('#ui-button');
  constructor() {
    super();

    const tmpl = tmplClone(Button.TMPL);
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(tmpl);
  }
}
