export class NotFoundPage extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
<style>
  .error {
    color: var(--error-color);
  }
</style>
<page-layout label="Page not found">
  <p class="error">Sorry, the page was not found!</p>
</page-layout>
`;
  }
}
