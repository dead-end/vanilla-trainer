import { lessionTotal2Learn } from '../lib/model/lession';
import { STYLES } from '../lib/ui/stylesheets';
import { $, tmplClone } from '../lib/utils';

export class LessionStatus extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#tmpl-lession-status');

  progress: HTMLElement[] = [];
  total: HTMLElement | undefined;

  connectedCallback() {
    if (!this.shadowRoot) {
      const tmpl = tmplClone(LessionStatus.TMPL);

      this.progress[0] = $<HTMLElement>('#answers-0', tmpl);
      this.progress[1] = $<HTMLElement>('#answers-1', tmpl);
      this.progress[2] = $<HTMLElement>('#answers-2', tmpl);
      this.progress[3] = $<HTMLElement>('#answers-3', tmpl);

      this.total = $<HTMLElement>('#total', tmpl);

      const shadow = this.attachShadow({ mode: 'open' });
      shadow.adoptedStyleSheets = STYLES;
      shadow.appendChild(tmpl);
    }
  }

  update(progress: number[]) {
    if (this.total) {
      this.progress.forEach((p, i) => (p.textContent = progress[i].toString()));
      this.total.textContent = lessionTotal2Learn(progress).toString();
    }
  }
}
