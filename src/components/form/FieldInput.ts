import { $, tmplClone, tmplCreate } from '../../lib/utils';

export class FieldInput extends HTMLElement {
  static TMPL = tmplCreate(`
      <style>
        input {
          min-width: 20rem;
          padding: 0.5rem 0.5rem;
          border: var(--border);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-sm);
        }
      </style>
      <div>
        <slot name="label"></slot>
        <input id="default-input" type="text" />
      </div>
`);

  // static TMPL = $<HTMLTemplateElement>('#input');

  input: HTMLInputElement;

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });
    const tmpl = tmplClone(FieldInput.TMPL);
    this.input = $<HTMLInputElement>('input', tmpl);
    shadow.appendChild(tmpl);
  }

  connectedCallback() {
    const id = this.getAttribute('data-id') || 'no-id-found';
    const type = this.getAttribute('data-type') || 'text';

    this.input.id = id;
    this.input.type = type;
  }
}
