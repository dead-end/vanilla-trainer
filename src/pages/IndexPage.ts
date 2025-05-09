import { hashLessionProcess } from '../lib/hash';
import { lessionExists, lessionRemove } from '../lib/model/lession';
import { $, tmplClone } from '../lib/utils';

export class IndexPage extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#index-page');

  connectedCallback() {
    if (!this.hasChildNodes()) {
      const tmpl = tmplClone(IndexPage.TMPL);

      // TODO: maybe better in navigation
      if (lessionExists()) {
        $<HTMLButtonElement>('#btn-continue', tmpl).onclick =
          this.onContinue.bind(this);
        $<HTMLButtonElement>('#btn-end', tmpl).onclick = this.onEnd.bind(this);
      } else {
        $<HTMLElement>('#lession', tmpl).style.display = 'none';
      }

      this.appendChild(tmpl);
    }
  }

  onContinue() {
    window.location.hash = hashLessionProcess();
  }

  onEnd() {
    lessionRemove();
    $<HTMLElement>('#lession').style.display = 'none';
  }
}
