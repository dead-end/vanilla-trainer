import { $ } from '../lib/utils/query';
import { tmplClone } from '../lib/utils/tmpl';

export class IndexPage extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#index-page');

  connectedCallback() {
    if (!this.hasChildNodes()) {
      const tmpl = tmplClone(IndexPage.TMPL);

      this.appendChild(tmpl);
    }
  }
}
