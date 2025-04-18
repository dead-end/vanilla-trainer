import { STYLES } from '../lib/ui/stylesheets';
import { $, tmplClone } from '../lib/utils';

export class IndexPage extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#page-index');

  constructor() {
    super();

    this.attachShadow({ mode: 'open' }).adoptedStyleSheets = STYLES;

    const tmpl = tmplClone(IndexPage.TMPL);

    this.shadowRoot?.appendChild(tmpl);
  }
}
