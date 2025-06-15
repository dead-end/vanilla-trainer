import ghpages from 'gh-pages';

ghpages.publish(
  'dist', // path to public directory
  {
    branch: 'main',
    repo: 'https://github.com/dead-end/trainer.git',
  },
  () => {
    console.log('Deploy Complete!');
  }
);
