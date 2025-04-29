const sanitize = new RegExp(/[<>]/, 'g');

type TReplacer = {
  pattern: RegExp;
  replace: string;
};

/**
 * Replacers that are processed to lines.
 */
const lineReplacer: TReplacer[] = [
  {
    pattern: new RegExp(/^- (.+)=#/, 'g'),
    replace:
      '<span class="md-right">&bull;</span><span class="md-it">$1</span>',
  },
  {
    pattern: new RegExp(/^(.+)=#/, 'g'),
    replace: '<span class="md-it">$1</span>',
  },
  {
    pattern: new RegExp(/#=(.+)$/, 'g'),
    replace: '<span class="md-it">$1</span>',
  },
  {
    pattern: new RegExp(/^- /, 'g'),
    replace: '<span class="md-right">&bull;</span>',
  },
];

/**
 * Replacers that are processed to strings.
 */
const strReplacer: TReplacer[] = [
  {
    pattern: new RegExp(/#([^#]+)#/, 'g'),
    replace: '<span class="md-it">$1</span>',
  },
  {
    pattern: new RegExp(/\*\*(.)/, 'g'),
    replace: '<span class="md-em">$1</span>',
  },
  {
    pattern: new RegExp(/\*([^*]+)\*/, 'g'),
    replace: '<span class="md-em">$1</span>',
  },
];

/**
 * The function calls the replacers for a string.
 */
const mdReplaceStr = (replacers: TReplacer[], str: string) => {
  replacers.forEach((replacer) => {
    str = str.replaceAll(replacer.pattern, replacer.replace);
  });

  return str;
};

/**
 * The function returns the html.
 */
export const mdToHtml = (content: string) => {
  const lines = content.replace(sanitize, '').split('\n');

  let result: string[] = [];

  for (const line of lines) {
    result.push(mdReplaceStr(lineReplacer, line.trim()));
  }

  return mdReplaceStr(strReplacer, result.join('\n'));
};

const regexStart = /^~([^~]+)~/;
const regexEnd = /~([^~]+)~$/;
const regexPrefix = /_(.)_/g;

/**
 * The function transforms old markdown to new markdown. The array is joined at
 * the end to avoid new line handling.
 */
// TODO: is this in this application necessary?
export const mdTransform = (arr: string[]) => {
  return arr
    .map((str) =>
      str

        .replace(regexStart, '$1=#')
        .replace(regexEnd, '#=$1')
        .replaceAll('~', '#')

        .replaceAll(regexPrefix, '**$1')
        .replaceAll('_', '*')
    )
    .join('\n');
};
