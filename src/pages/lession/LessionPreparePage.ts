import { $, tmplClone } from '../../lib/utils';

export class LessionPreparePage extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#lession-prepare-page');

  connectedCallback() {
    if (!this.hasChildNodes()) {
      const tmpl = tmplClone(LessionPreparePage.TMPL);
      this.appendChild(tmpl);
    }
  }
}
