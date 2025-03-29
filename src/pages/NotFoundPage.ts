import { tmplClone, tmplCreate } from '../lib/utils';

export class NotFoundPage extends HTMLElement {
  static TMPL = tmplCreate(`
<style>
  .error {
    color: var(--error-color);
  }
</style>
<page-layout label="Page not found">
  <p class="error">Sorry, the page was not found!</p>
</page-layout>
`);

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });
    const tmpl = tmplClone(NotFoundPage.TMPL);
    shadow.appendChild(tmpl);
  }
}
