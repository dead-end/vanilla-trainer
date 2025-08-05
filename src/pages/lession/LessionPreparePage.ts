import { KeyValues } from '../../components/KeyValues';
import { errorGlobal } from '../../lib/GlobalError';
import { createFragment } from '../../lib/html/createFragment';
import { html } from '../../lib/html/html';
import { hashLessionProcess } from '../../lib/location/hash';
import { bookGet } from '../../lib/model/book';
import { chapterGet } from '../../lib/model/chapter';
import { lessionCreate } from '../../lib/model/lession';
import { questionListing } from '../../lib/model/question';
import { getRouteParams } from '../../lib/route';
import { TQuestion, TQuestionId } from '../../lib/types';
import { fieldGet } from '../../lib/ui/field';
import { $ } from '../../lib/utils/query';

export class LessionPreparePage extends HTMLElement {
  connectedCallback() {
    if (!this.hasChildNodes()) {
      this.appendChild(this.renderComponent());
    }

    this.updateComponent();
  }

  renderComponent() {
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

  async updateComponent() {
    const [bookId, chapterId] = getRouteParams('bookId', 'chapterId');

    const questions = await questionListing(bookId, chapterId);
    const len = questions.length;
    if (len === 0) {
      errorGlobal('The chapter has no questions!');
      $<HTMLButtonElement>('#btn-start').disabled = true;
    }

    this.addLessionInfo(bookId, chapterId, questions);
  }

  async handleSubmit(e: SubmitEvent) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;

    const formData = new FormData(form);
    const correct = fieldGet(formData, 'correct');
    const reverse = fieldGet(formData, 'reverse');

    const [bookId, chapterId] = getRouteParams('bookId', 'chapterId');

    const questions = await questionListing(bookId, chapterId);
    const questionIds: TQuestionId[] = questions.map((_q, i) => ({
      bookId,
      chapterId,
      idx: i,
    }));

    lessionCreate(
      questionIds,
      parseInt(correct.value),
      reverse.value === 'true'
    );

    window.location.hash = hashLessionProcess();
  }

  async addLessionInfo(
    bookId: string,
    chapterId: string,
    questions: TQuestion[]
  ) {
    const book = await bookGet(bookId);
    const chapter = await chapterGet(bookId, chapterId);

    $<KeyValues>('#lession-info').update([
      { key: 'Book', value: book.title },
      { key: 'Chapter', value: chapter.title },
      { key: 'Length', value: questions.length.toString() },
    ]);
  }
}
