import { escapeHtml } from './escapeHtml';

/**
 * Function for template literals. All parameters are html escaped.
 */
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
