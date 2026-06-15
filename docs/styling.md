## Styling Web Components

The Shadow Dom encapsulates CSS. The is what you want if you want to create a
Web Component that can be placed on any website.

If you create an app that has a lot of web components you probably want to have a
consistent styling. In this case the encapsulation becomes a problem.

The solution to this is `adoptedStyleSheets`. ([see: Mozilla](https://developer.mozilla.org/en-US/docs/Web/API/Document/adoptedStyleSheets))

The first step is to create styles and export the styles that you want to share.
You can import the styles as a raw string, which is a vite feature. ([see: Vite](https://vite.dev/guide/assets#importing-asset-as-string))
Then you can create an array of `CSSStyleSheet` objects. The `CSSStyleSheet` ensures
that the css is parsed only once and then can be shared.

```js
import style from './assets/style.css?raw';

const cssStyles = new CSSStyleSheet();
cssStyles.replace(style);

export const STYLES = [cssStyles];
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
