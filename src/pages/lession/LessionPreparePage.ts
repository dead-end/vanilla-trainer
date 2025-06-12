import { InfoTable } from '../../components/InfoTable';
import { hashLessionProcess } from '../../lib/location/hash';
import { bookGet } from '../../lib/model/book';
import { chapterGet } from '../../lib/model/chapter';
import { lessionCreate } from '../../lib/model/lession';
import { questionListing } from '../../lib/model/question';
import { getRouteParams } from '../../lib/route';
import { TQuestion, TQuestionId } from '../../lib/types';
import { fieldGet } from '../../lib/ui/field';
import { $, errorGlobal, tmplClone } from '../../lib/utils';

export class LessionPreparePage extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#lession-prepare-page');

  connectedCallback() {
    if (!this.hasChildNodes()) {
      const tmpl = tmplClone(LessionPreparePage.TMPL);
      $<HTMLFormElement>('form', tmpl).onsubmit = this.handleSubmit.bind(this);
      this.appendChild(tmpl);
    }

    this.render();
  }

  async render() {
    const [bookId, chapterId] = getRouteParams('bookId', 'chapterId');

    const questions = await questionListing(bookId, chapterId);
    const len = questions.length;
    if (len === 0) {
      errorGlobal('The chapter has no questions!');
      $<HTMLButtonElement>('#btn-start').disabled = true;
    }

    this.infoTable(bookId, chapterId, questions);
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

  async infoTable(bookId: string, chapterId: string, questions: TQuestion[]) {
    const book = await bookGet(bookId);
    const chapter = await chapterGet(bookId, chapterId);

    $<InfoTable>('#info-prepare').update([
      { key: 'Book', value: book.title },
      { key: 'Chapter', value: chapter.title },
      { key: 'Length', value: questions.length.toString() },
    ]);
  }
}
