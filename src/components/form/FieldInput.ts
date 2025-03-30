import { $, tmplClone, tmplCreate } from '../../lib/utils';
import { FieldLabel } from './FieldLabel';

export class FieldInput extends HTMLElement {
  static TMPL = tmplCreate(`
      <style>
        input {
          min-width: 20rem;
          padding: 0.5rem 0.5rem;
          border: var(--border);
          border-radius: var(--border-radius);
        }
      </style>
      <div>
        <field-label></field-label>
        <input id="default-input" type="text" />
      </div>
`);

  // static TMPL = $<HTMLTemplateElement>('#input');
  formLabel: FieldLabel;
  input: HTMLInputElement;

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });
    const tmpl = tmplClone(FieldInput.TMPL);

    this.input = $<HTMLInputElement>('input', tmpl);
    this.formLabel = $<FieldLabel>('field-label', tmpl);

    shadow.appendChild(tmpl);
  }

  connectedCallback() {
    const id = this.getAttribute('data-id') || 'no-id-found';
    const label = this.getAttribute('data-label') || 'no-label-found';
    const type = this.getAttribute('data-type') || 'text';

    this.input.id = id;
    this.input.type = type;

    this.formLabel.update(id, label);
  }
}
