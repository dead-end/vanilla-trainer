## Templates

Currently the html template parsing is done on every web component instance.

A static or global template can be used that is cloned.

Example: Create a global fragment

```
  const PAGE_FRAG = createFragment(/* html */ html`
    <div class="is-column is-gap">
      <div class="page-title">Book List</div>
      <table>
        <thead>
          <tr>
            <th class="is-larger-sm">Id</th>
            <th>Title</th>
            <th class="is-larger-sm">Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
      <div class="is-row is-gap">
        <a href="#/books/create" class="btn">Create</a>
        <a href="#/cache/raw/books/books.json" class="btn">Cache</a>
      </div>
    </div>
  `);
```

Clone the fragment, add event listener and append the clone to the dom.

```
  connectedCallback() {
    if (!this.hasChildNodes()) {
      const clone = PAGE_FRAG.cloneNode(true) as DocumentFragment

      $<HTMLElement>('[data-icon="list"]', clone).onclick = ...

      this.appendChild(clone);
    }
    ...
  }
```
