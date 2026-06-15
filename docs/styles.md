## Styling web components

The shadow dom encaplsulates CSS. The is ok if you want to create a web component
that can be placed on every page.

If you create an app that has a lot of web components you probably want to have a
consistent styling.

The solution to this is `adoptedStyleSheets`. ([see:](https://developer.mozilla.org/en-US/docs/Web/API/Document/adoptedStyleSheets))

The first step is to create styles. You can import the styles as a raw string and
create an array of `CSSStyleSheet`objects. The `CSSStyleSheet` ensures that the
css is parsed only once and then can be shared.

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

Now you can style your web components.

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
