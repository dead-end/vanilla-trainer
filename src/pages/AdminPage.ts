export class AdminPage extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
<page-layout label="Admin">
  <p>This is the admin page</p>
</page-layout>
`;
  }
}
