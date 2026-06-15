## Template literals

For our Web Components we want to use template strings with interpolation as an easy
way to create our html. The problem is that we want to prevent XSS issues.

```js
const title = '<script>alert("XSS")</script>';
const str = `<h4>${title}</h4>`;
```

The solutions are template literals. [see: Mozilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)

We use a `html` prefix to our template string, which is a function.

```js
const title = '<script>alert("XSS")</script>';
const str = html`<h4>${title}</h4>`;
```

The function is called with an `TemplateStringsArray` and an array of parameter, which we
want to escape.

```js
export const html = (template: TemplateStringsArray, ...params: any[]) => {
  const result: string[] = [template[0]];

  for (let i = 1; i < template.length; i++) {
    let value = params[i - 1];
    if (typeof value !== 'string') {
      value = value.toString();
    }
    result.push(escapeHtml(value));
    result.push(template[i]);
  }

  return result.join('');
};
```

Here an example. The string:

```js
const str = `string-0${param_0}string-1${param_1}`;
```

looks like:

```js
(template[0], param[0], template[1], param[1], template[2]);
```

with:

```js
template[0] = 'string-0';
param[0] = param_0;
template[1] = 'string-1';
param[1] = param_1;
template[2] = '';
```
