import { tmplClone, tmplCreate } from '../lib/utils';

export class IndexPage extends HTMLElement {
  static TMPL = tmplCreate(`
<page-layout label="Home">
  <p>Welcome to the Vanilla Trainer</p>
</page-layout>
`);

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });
    const tmpl = tmplClone(IndexPage.TMPL);
    shadow.appendChild(tmpl);
  }
}
