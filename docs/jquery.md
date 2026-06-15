## Poor men's JQuery

This is a simple implementation of the `$` function in JQuery:

```js
export const $ = <T extends Element>(
  query: string,
  root?: Document | DocumentFragment | HTMLElement
) => {
  if (!root) {
    root = document;
  }

  const result = root.querySelector(query);
  if (!result) {
    throw new Error(`Unable to find: ${query}`);
  }
  return result as T;
};
```

You can use it to query elements in the whole document:

```js
$<HTMLButtonElement>('#my-button').disabled = true;
```

Or you can query elements in a fragment:

```js
const tmpl = document.createElement('template');
tmpl.innerHTML = '<div><button>My Button</button><div>';
const frag = tmpl.content;

$<HTMLButtonElement>('button', frag).disabled = true;
```
