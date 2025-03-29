import { $, tmplClone, tmplCreate } from '../lib/utils';

export class PageLayout extends HTMLElement {
  static TMPL = tmplCreate(`
<div class="page-layout">
  <h3></h3>
  <slot>Default text</slot>
</div>
`);

  constructor() {
    super();

    const tmpl = tmplClone(PageLayout.TMPL);
    $('h3', tmpl).textContent = this.getAttribute('label') || 'No-Label-Found';
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(tmpl);
  }
}
