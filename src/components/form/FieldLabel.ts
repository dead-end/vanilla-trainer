import { $, tmplClone, tmplCreate } from '../../lib/utils';

export class FieldLabel extends HTMLElement {
  static TMPL = tmplCreate(`
  <style>
    label {
      display: block;
      font-weight: 600;
      font-size: small;
      color: #444;
      margin-bottom: 0.5rem;
    }
  </style>
  <label for="default-input">Default Label</label>
`);

  // static TMPL = $<HTMLTemplateElement>('#label');
  label: HTMLLabelElement;

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });
    const tmpl = tmplClone(FieldLabel.TMPL);
    this.label = $<HTMLLabelElement>('label', tmpl);
    shadow.appendChild(tmpl);
  }

  connectedCallback() {
    const id = this.getAttribute('data-for') || 'no-for-found';
    const label = this.getAttribute('data-label') || 'no-label-found';

    this.label.htmlFor = id;
    this.label.textContent = label;
  }
}
