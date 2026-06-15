## Styling Web Components

The Shadow Dom encapsulates CSS. This is desired behavior if you want to create a
Web Component that is reusable and can be placed on any website.

If you create an app that has a lot of web components you probably want to have a
consistent styling. In this case the encapsulation becomes a problem.

The solution to this is `adoptedStyleSheets`
([see: Mozilla](https://developer.mozilla.org/en-US/docs/Web/API/Document/adoptedStyleSheets)).

The first step is to import the css files as a string, which is a vite feature
([see: Vite](https://vite.dev/guide/assets#importing-asset-as-string)).
Then you can create an array of `CSSStyleSheet` objects from the css strings and
export them. The `CSSStyleSheet` objects parses the css string when it is created.
Then you can share the array with the parsed css.

```js
import style from './assets/style.css?raw';

const cssStyle = new CSSStyleSheet();
cssStyle.replace(style);

export const STYLES = [cssStyle];
```

You can use this array to style the normal dom:

```js
document.adoptedStyleSheets = STYLES;
```

And you can style your web components.

```js
import { STYLES } from '../lib/ui/stylesheets';

export class MyElement extends HTMLElement {
  connectedCallback() {
    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: 'open' });
      shadow.adoptedStyleSheets = STYLES;
      ...
    }
  }
```
