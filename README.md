## Deploy

```sh
npm install gh-pages --save-dev
```

Add file: `gh-pages.js` with:

```js
import ghpages from 'gh-pages';

ghpages.publish(
  'dist', // path to public directory
  {
    branch: 'main',
    repo: 'https://github.com/dead-end/supa-trainer-pub.git',
  },
  () => {
    console.log('Deploy Complete!');
  }
);
```

Add to `package.json`

```sh
"deploy": "node ./gh-pages.js",
```

Add to `vite.config.js` the base path of the github page

```sh
base: '/trainer',
```

To deploy to Github pages:

```sh
npm run build
npm run deploy
```

## innerHtml

Install VS Code extension: `es6-string-html`
