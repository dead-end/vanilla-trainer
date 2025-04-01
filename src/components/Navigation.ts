import { routesGet } from '../lib/route';
import { $, tmplClone, tmplCreate } from '../lib/utils';

export class Navigation extends HTMLElement {
  static TMPL = tmplCreate(`
<style>
  nav {
    display: flex;
    gap: 1rem;
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
</style>
<nav>
</nav>
<
`);
  initialized = false;

  constructor() {
    super();
  }

  connectedCallback() {
    if (!this.initialized) {
      const tmpl = tmplClone(Navigation.TMPL);
      const container = $('nav', tmpl);

      routesGet().forEach((nav) => {
        const a = document.createElement('a');
        a.href = nav.hash;
        a.textContent = nav.label;
        container.appendChild(a);
      });

      this.appendChild(tmpl);
      this.initialized = true
    }
  }
}
