import { tmplClone, tmplCreate } from '../../lib/utils';

export class FormWrapper extends HTMLElement {
  static TMPL = tmplCreate(`
      <style>
        form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
      </style>
      <form>
        <slot></slot>
      </form>
`);

  // static TMPL = $<HTMLTemplateElement>('#form-wrapper');
  constructor() {
    super();

    const tmpl = tmplClone(FormWrapper.TMPL);
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(tmpl);
  }
}
