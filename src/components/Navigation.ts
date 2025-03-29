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
`);

  constructor() {
    super();

    const tmpl = tmplClone(Navigation.TMPL);
    const container = $('nav', tmpl);
    const routes = routesGet();

    routes.forEach((page, href) => {
      const a = document.createElement('a');
      a.href = '#' + href;
      a.textContent = page;
      container.appendChild(a);
    });

    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(tmpl);
  }
}
