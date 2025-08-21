import { createFragment } from '../lib/html/createFragment';
import { html } from '../lib/html/html';
import { bookGet } from '../lib/model/book';
import { chapterGet } from '../lib/model/chapter';
import { TKeyValue } from '../lib/types';
import { STYLES } from '../lib/ui/stylesheets';
import { $ } from '../lib/utils/query';
import { KeyValues } from './KeyValues';

export class LocationInfo extends HTMLElement {
  connectedCallback() {
    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: 'open' });
      shadow.adoptedStyleSheets = STYLES;
      shadow.appendChild(this.renderComponent());
    }
  }

  renderComponent() {
    const str = /* html */ html` <key-values id="info"></key-values> `;

    return createFragment(str);
  }

  async show(bookId: string, chapterId?: string, idx?: string) {
    if (this.shadowRoot) {
      const data: TKeyValue[] = [];

      const book = await bookGet(bookId);
      data.push({ key: 'Book', value: book.title });

      if (chapterId) {
        const chapter = await chapterGet(bookId, chapterId);
        data.push({ key: 'Chapter', value: chapter.title });
      }

      if (idx) {
        data.push({ key: 'Question', value: idx });
      }

      $<KeyValues>('#info', this.shadowRoot).update(data);
    }
  }

  hide() {
    this.style.display = 'none';
  }
}
