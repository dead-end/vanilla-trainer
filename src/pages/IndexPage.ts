export class IndexPage extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
<page-layout label="Home">
<p>Welcome to the Vanilla Trainer</p>
</page-layout>
`;
  }
}
