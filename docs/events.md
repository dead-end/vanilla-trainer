## Introduction

If you add an event handler, you need to remove it to prevent memory leaks.

## Event properties

If you are adding event handler with a property you can simply set it null, to
remove the handle without memory leaks.

```js
  connectedCallback() {
    if (this.shadowRoot !== null) {
      $<HTMLButtonElement>('#btn-end', this.shadowRoot).onclick =
        this.onEnd.bind(this);
        ...
    }
  }

  disconnectedCallback() {
    if (this.shadowRoot !== null) {
      $<HTMLButtonElement>('#btn-end', this.shadowRoot).onclick = null;
      ...
    }
  }
```

## Adding handler with bind

To be able to add and remove an event handle we need a reference. This is the
result of the bind call, if we need this in the handler function. Here is an
example:

```js
export class Navigation extends HTMLElement {
  bindOnLogin: (event: Event) => void;

  constructor() {
    super();
    this.bindOnLogin = this.onLogin.bind(this);
  }

  connectedCallback() {
    if (!this.shadowRoot) {
      document.addEventListener('login', this.bindOnLogin);
      ...
    }
  }

  disconnectedCallback() {
    if (!this.shadowRoot) {
      document.removeEventListener('login', this.bindOnLogin);
      ...
    }
  }
```

## Adding handler as an arrow function

A simpler version is to use an arrow function, which has the right this.

```js
  connectedCallback() {
    if (!this.shadowRoot) {
      document.addEventListener('login', this.onLogin);
      ...
    }
  }

  disconnectedCallback() {
    if (!this.shadowRoot) {
      document.removeEventListener('login', this.onLogin);
      ...
    }
  }

  onLogin = () => {
    if (this.shadowRoot) {
      ...
    }
  };
```
