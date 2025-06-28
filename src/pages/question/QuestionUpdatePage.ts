import { fieldErrorExists, fieldErrorReset } from '../../lib/ui/field';
import { $ } from '../../lib/utils/query';
import { tmplClone } from '../../lib/utils/tmpl';
import { fieldGet, fieldRequired } from '../../lib/ui/field';
import { getRouteParams } from '../../lib/route';
import { hashQuestionList } from '../../lib/location/hash';
import {
  questionGet,
  questionInst,
  questionUpdate,
} from '../../lib/model/question';
import { bookGet } from '../../lib/model/book';
import { chapterGet } from '../../lib/model/chapter';
import { KeyValues } from '../../components/KeyValues';

export class QuestionUpdatePage extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#question-update-page');

  connectedCallback() {
    if (!this.hasChildNodes()) {
      const tmpl = tmplClone(QuestionUpdatePage.TMPL);
      $<HTMLFormElement>('form', tmpl).onsubmit = this.handleSubmit.bind(this);
      this.appendChild(tmpl);
    }

    this.render();
  }

  async render() {
    const [bookId, chapterId, idx] = getRouteParams(
      'bookId',
      'chapterId',
      'idx'
    );

    this.addQuestionInfo(bookId, chapterId, idx);

    $<HTMLAnchorElement>('#question-list-link', this).href = hashQuestionList(
      bookId,
      chapterId
    );

    const question = await questionGet(bookId, chapterId, parseInt(idx));

    this.setValue('#quest', question.quest);
    this.setValue('#answer', question.answer);
    this.setValue('#details', question.details || '');
  }

  setValue(id: string, value: string) {
    const elem = $<HTMLTextAreaElement>(id);
    elem.value = value;
    elem.dispatchEvent(new Event('input'));
  }

  async handleSubmit(e: SubmitEvent) {
    e.preventDefault();

    const [bookId, chapterId, idx] = getRouteParams(
      'bookId',
      'chapterId',
      'idx'
    );

    const form = e.target as HTMLFormElement;

    const formData = new FormData(form);
    const quest = fieldGet(formData, 'quest');
    const answer = fieldGet(formData, 'answer');
    const details = fieldGet(formData, 'details');

    fieldErrorReset(form);

    fieldRequired(form, quest);
    fieldRequired(form, answer);

    if (!fieldErrorExists(form)) {
      const button = $<HTMLButtonElement>('#btn-submit', form);
      button.disabled = true;

      const question = questionInst(quest.value, answer.value, details.value);

      questionUpdate(bookId, chapterId, parseInt(idx), question)
        .then(() => {
          window.location.hash = hashQuestionList(bookId, chapterId);
        })
        .finally(() => {
          button.disabled = false;
        });
    }
  }

  async addQuestionInfo(bookId: string, chapterId: string, idx: string) {
    const book = await bookGet(bookId);
    const chapter = await chapterGet(bookId, chapterId);
    $<KeyValues>('#question-info').update([
      { key: 'Book', value: book.title },
      { key: 'Chapter', value: chapter.title },
      { key: 'Question', value: idx },
    ]);
  }
}
