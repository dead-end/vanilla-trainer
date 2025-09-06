import { escapeHtml } from './escapeHtml';

/**
 * The class marks a string as 'unsafe' and is not exported.
 */
class UnsafeHtml {
  str: string;

  constructor(str: string) {
    this.str = str;
  }
}

/**
 * Return a string, marked as unsafe.
 */
export const unsafeHtml = (str: string) => {
  return new UnsafeHtml(str);
};

/**
 * Function for template literals. All parameters are html escaped.
 */
export const html = (template: TemplateStringsArray, ...params: any[]) => {
  const result: string[] = [template[0]];

  for (let i = 1; i < template.length; i++) {
    let value = params[i - 1];
    let str: string;
    if (value instanceof UnsafeHtml) {
      str = value.str;
    } else if (typeof value !== 'string') {
      str = escapeHtml(value.toString());
    } else {
      str = escapeHtml(value);
    }

    result.push(str);
    result.push(template[i]);
  }

  return result.join('');
};
