import { STYLES } from '../lib/stylesheets';
import { $, tmplClone } from '../lib/utils';

export class NotFoundPage extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#page-not-found');

  constructor() {
    super();

    this.attachShadow({ mode: 'open' }).adoptedStyleSheets = STYLES;

    const tmpl = tmplClone(NotFoundPage.TMPL);

    this.shadowRoot?.appendChild(tmpl);
  }
}
