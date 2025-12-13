import { KeyValues } from '../../components/KeyValues';
import {
  chapterContentsGet,
  chapterContentsGetIds,
  chapterContentsLen,
} from '../../lib/chapterContent';
import { dispatchError } from '../../lib/error';
import { createFragment } from '../../lib/html/createFragment';
import { html } from '../../lib/html/html';
import { hashLessionProcess } from '../../lib/location/hash';

import { bookGet } from '../../lib/model/book';
import { chapterGet } from '../../lib/model/chapter';
import { lessionCreate } from '../../lib/model/lession';
import { getRouteParams } from '../../lib/route';
import { TChapterContent, TKeyValue } from '../../lib/types';
import { fieldGet } from '../../lib/ui/field';
import { $ } from '../../lib/utils/query';

export class LessionPreparePage extends HTMLElement {
  connectedCallback() {
    if (!this.hasChildNodes()) {
      this.appendChild(this.renderComponent());
    }

    this.updateComponent();
  }

  private renderComponent() {
    const str = /* html */ html`
      <div class="is-column is-gap">
        <div class="page-title">Lession prepare</div>

        <key-values id="lession-info"></key-values>

        <form class="is-column is-gap">
          <ui-field data-id="correct" data-label="Correct Answers">
            <select name="correct" id="correct">
              <option value="0">0</option>
              <option value="1" selected>1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </ui-field>
          <ui-field data-id="reverse" data-label="Reverse Answers">
            <select name="reverse" id="reverse">
              <option value="true">True</option>
              <option value="false" selected>False</option>
            </select>
          </ui-field>
          <ui-field data-id="max" data-label="Max Questions">
            <select name="max" id="max">
              <option value="-1" selected>All</option>
              <option value="30">30</option>
              <option value="35">35</option>
              <option value="40">40</option>
            </select>
          </ui-field>

          <div class="is-row is-gap">
            <a href="#" class="btn" id="chapter-list-link">Cancel</a>
            <button class="btn" type="submit" id="btn-start">Start</button>
          </div>
        </form>
      </div>
    `;

    const frag = createFragment(str);

    $<HTMLFormElement>('form', frag).onsubmit = this.handleSubmit.bind(this);

    return frag;
  }

  private async updateComponent() {
    const chapterContents = await this.getChapterContents();

    if (chapterContentsLen(chapterContents) === 0) {
      dispatchError('The chapter has no questions!');
      $<HTMLButtonElement>('#btn-start').disabled = true;
    }

    this.addLessionInfo(chapterContents);
  }

  private async handleSubmit(e: SubmitEvent) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;

    const formData = new FormData(form);
    const correct = fieldGet(formData, 'correct');
    const reverse = fieldGet(formData, 'reverse');
    const max = fieldGet(formData, 'max');

    const chapterContents = await this.getChapterContents();
    const questionIds = chapterContentsGetIds(chapterContents);

    lessionCreate(
      questionIds,
      parseInt(correct.value),
      reverse.value === 'true',
      parseInt(max.value)
    );

    window.location.hash = hashLessionProcess();
  }

  private async addLessionInfo(chapterContents: TChapterContent[]) {
    const data: TKeyValue[] = [];

    for (const chapterContent of chapterContents) {
      const book = await bookGet(chapterContent.bookId);
      const chapter = await chapterGet(
        chapterContent.bookId,
        chapterContent.chapterId
      );

      data.push({ key: 'Book', value: book.title });
      data.push({ key: 'Chapter', value: chapter.title });
      data.push({
        key: 'Length',
        value: chapterContent.questions.length.toString(),
      });
    }

    if (chapterContents.length > 0) {
      data.push({
        key: 'Total',
        value: chapterContentsLen(chapterContents).toString(),
      });
    }

    $<KeyValues>('#lession-info').update(data);
  }

  /**
   * The function gets the book and the selected chapters from the url and
   * returns the corresponding chapter content.
   */
  private async getChapterContents() {
    const [bookId, chapterIds] = getRouteParams('bookId', 'chapterIds');

    const chapterContents = await chapterContentsGet(
      bookId,
      chapterIds.split(',')
    );

    return chapterContents;
  }
}
