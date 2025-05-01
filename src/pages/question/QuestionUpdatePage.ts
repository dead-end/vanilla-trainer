import { fieldErrorExists, fieldErrorReset } from '../../lib/ui/field';
import { githubConfigGet } from '../../lib/model/githubConfig';
import { $, errorGlobal, tmplClone } from '../../lib/utils';
import { fieldGet, fieldRequired } from '../../lib/ui/field';
import { getRouteParams } from '../../lib/route';
import { hashQuestionList } from '../../lib/hash';
import {
  questionGet,
  questionInst,
  questionUpdate,
} from '../../lib/model/question';
import { TQuestion } from '../../lib/types';

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

    $<HTMLAnchorElement>('#question-list-link', this).href = hashQuestionList(
      bookId,
      chapterId
    );

    const githubConfig = await githubConfigGet();
    const result = await questionGet(
      githubConfig,
      bookId,
      chapterId,
      parseInt(idx)
    );
    if (result.hasError()) {
      errorGlobal(`Unable to update a new chapter: ${result.getMessage()}`);
      return;
    }

    const question = result.getValue();
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

      this.doUpdate(bookId, chapterId, parseInt(idx), question).finally(() => {
        button.disabled = false;
      });
    }
  }

  async doUpdate(
    bookId: string,
    chapterId: string,
    idx: number,
    question: TQuestion
  ) {
    const githubConfig = await githubConfigGet();
    const result = await questionUpdate(
      githubConfig,
      bookId,
      chapterId,
      idx,
      question
    );
    if (result.hasError()) {
      errorGlobal(`Unable to update a new chapter: ${result.getMessage()}`);
      return;
    }

    window.location.hash = hashQuestionList(bookId, chapterId);
  }
}
