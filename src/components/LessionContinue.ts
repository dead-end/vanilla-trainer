import { hashLessionProcess } from '../lib/location/hash';
import { lessionExists, lessionRemove } from '../lib/model/lession';
import { STYLES } from '../lib/ui/stylesheets';
import { $ } from '../lib/utils/query';
import { tmplClone } from '../lib/utils/tmpl';

export class LessionContinue extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#tmpl-lession-continue');

  connectedCallback() {
    if (!this.shadowRoot) {
      const tmpl = tmplClone(LessionContinue.TMPL);

      $<HTMLButtonElement>('#btn-continue', tmpl).onclick =
        this.onContinue.bind(this);
      $<HTMLButtonElement>('#btn-end', tmpl).onclick = this.onEnd.bind(this);

      const shadow = this.attachShadow({ mode: 'open' });
      shadow.adoptedStyleSheets = STYLES;
      shadow.appendChild(tmpl);
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
}
