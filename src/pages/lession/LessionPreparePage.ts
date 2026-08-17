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
import { TChapterQuestions, TKeyValue, TQuestionId } from '../../lib/types';
import { fieldGet } from '../../lib/ui/field';
import { $ } from '../../lib/utils/query';

const PAGE_FRAG = createFragment(/* html */ html`
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
`);

/**
 * The class implements the page that prepares the start of a lession.
 */
export class LessionPreparePage extends HTMLElement {
  connectedCallback() {
    if (!this.hasChildNodes()) {
      const frag = PAGE_FRAG.cloneNode(true) as DocumentFragment;
      $<HTMLFormElement>('form', frag).onsubmit = this.handleSubmit;
      this.appendChild(frag);
    }

    this.render();
  }

  async render() {
    const [bookId, chapterIds] = getRouteParams('bookId', 'chapterIds');
    const chapIds = chapterIds.split(',');

    const chapterQuestions = await this.getChapterQuestions(bookId, chapIds);

    const len = chapterQuestions.reduce((l, cq) => l + cq.questions.length, 0);
    if (len === 0) {
      errorGlobal('The chapters has no questions!');
      $<HTMLButtonElement>('#btn-start').disabled = true;
    }

    this.addLessionInfo(chapterQuestions);
  }

  async addLessionInfo(chapterQuestions: TChapterQuestions[]) {
    const arr: TKeyValue[] = [];

    for (const chapterQuestion of chapterQuestions) {
      const book = await bookGet(chapterQuestion.bookId);
      const chapter = await chapterGet(
        chapterQuestion.bookId,
        chapterQuestion.chapterId,
      );

      arr.push(
        { key: 'Book', value: book.title },
        { key: 'Chapter', value: chapter.title },
        { key: 'Length', value: chapterQuestion.questions.length.toString() },
      );
    }

    $<KeyValues>('#lession-info').update(arr);
  }

  handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;

    const formData = new FormData(form);
    const correct = fieldGet(formData, 'correct');
    const reverse = fieldGet(formData, 'reverse');

    const [bookId, chapterIds] = getRouteParams('bookId', 'chapterIds');

    const questionIds: TQuestionId[] = [];

    const chapterQuestions = await this.getChapterQuestions(
      bookId,
      chapterIds.split(','),
    );
    for (const chapterQuestion of chapterQuestions) {
      questionIds.push(...this.getQuestionIds(chapterQuestion));
    }

    lessionCreate(
      questionIds,
      parseInt(correct.value),
      reverse.value === 'true',
    );

    window.location.hash = hashLessionProcess();
  };

  /**
   * The method creates an array of TChapterQuestions from a book and an array
   * of selected chapters.
   */
  async getChapterQuestions(bookId: string, chapterIds: string[]) {
    const result: TChapterQuestions[] = [];

    for (const chapterId of chapterIds) {
      const questions = await questionListing(bookId, chapterId);
      result.push({
        bookId,
        chapterId,
        questions,
      });
    }

    return result;
  }

  /**
   * The method maps a TChapterQuestions to an array of TQuestionId, which
   * represents a lession.
   */
  getQuestionIds(chapterQuestion: TChapterQuestions) {
    const questionIds: TQuestionId[] = chapterQuestion.questions.map(
      (_q, i) => ({
        bookId: chapterQuestion.bookId,
        chapterId: chapterQuestion.chapterId,
        idx: i,
      }),
    );
    return questionIds;
  }
}
