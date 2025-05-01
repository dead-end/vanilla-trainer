import { fieldErrorExists, fieldErrorReset } from '../../lib/ui/field';
import { githubConfigGet } from '../../lib/model/githubConfig';
import { $, errorGlobal, tmplClone } from '../../lib/utils';
import { fieldGet, fieldRequired } from '../../lib/ui/field';
import { getRouteParams } from '../../lib/route';
import { hashQuestionList } from '../../lib/hash';
import { questionCreate, questionInst } from '../../lib/model/question';
import { TQuestion } from '../../lib/types';

export class QuestionCreatePage extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#question-create-page');

  connectedCallback() {
    if (!this.hasChildNodes()) {
      const tmpl = tmplClone(QuestionCreatePage.TMPL);
      $<HTMLFormElement>('form', tmpl).onsubmit = this.handleSubmit.bind(this);
      this.appendChild(tmpl);
    }

    this.render();
  }

  render() {
    const [bookId, chapterId] = getRouteParams('bookId', 'chapterId');
    $<HTMLAnchorElement>('#question-list-link', this).href = hashQuestionList(
      bookId,
      chapterId
    );
  }

  async handleSubmit(e: SubmitEvent) {
    e.preventDefault();

    const [bookId, chapterId] = getRouteParams('bookId', 'chapterId');

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

      this.doCreate(bookId, chapterId, question).finally(() => {
        button.disabled = false;
      });
    }
  }

  async doCreate(bookId: string, chapterId: string, question: TQuestion) {
    const githubConfig = await githubConfigGet();
    const result = await questionCreate(
      githubConfig,
      bookId,
      chapterId,
      question
    );
    if (result.hasError()) {
      errorGlobal(`Unable to create a new chapter: ${result.getMessage()}`);
      return;
    }

    window.location.hash = hashQuestionList(bookId, chapterId);
  }
}
