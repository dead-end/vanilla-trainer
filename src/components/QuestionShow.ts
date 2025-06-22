import { hashQuestionUpdate } from '../lib/location/hash';
import { mdToHtml } from '../lib/markdown';
import { TQuestion, TQuestionId, TQuestionProgress } from '../lib/types';
import { STYLES } from '../lib/ui/stylesheets';
import { $ } from '../lib/utils/query';
import { tmplClone } from '../lib/utils/tmpl';

// TODO: move to types ?
type TDoDelete = (questionId: TQuestionId) => void;

export class QuestionShow extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#tmpl-question-show');

  questionId: TQuestionId | undefined;
  question: TQuestion | undefined;
  doDelete: TDoDelete | undefined;

  static instance(
    questionId: TQuestionId,
    question: TQuestion,
    doDelete?: TDoDelete | undefined
  ) {
    const instance = document.createElement('question-show') as QuestionShow;
    instance.questionId = questionId;
    instance.question = question;
    instance.doDelete = doDelete;
    return instance;
  }

  connectedCallback() {
    if (!this.shadowRoot) {
      const tmpl = tmplClone(QuestionShow.TMPL);

      const shadow = this.attachShadow({ mode: 'open' });
      shadow.adoptedStyleSheets = STYLES;
      shadow.appendChild(tmpl);

      if (this.questionId && this.question) {
        this.render(this.questionId, this.question);
      }
    }
  }

  /**
   * The function uses questionId and question as parameters. This ensures that
   * both are not undefined.
   */
  render(
    questionId: TQuestionId,
    question: TQuestion,
    process?: TQuestionProgress
  ) {
    if (this.shadowRoot) {
      $('#label', this.shadowRoot).textContent = `Question: ${questionId.idx}`;
      if (process) {
        $(
          '#progress',
          this.shadowRoot
        ).textContent = `Progress: ${process.progress} / 3`;
      }

      $('#quest', this.shadowRoot).innerHTML = mdToHtml(question.quest);
      $('#answer', this.shadowRoot).innerHTML = mdToHtml(question.answer);

      const details = $('#details', this.shadowRoot);
      if (!question.details && details.parentElement) {
        details.parentElement.style.display = 'none';
      }
      details.innerHTML = question.details ? mdToHtml(question.details) : '';

      $<HTMLElement>('[data-icon="update"]', this.shadowRoot).onclick = () => {
        window.location.hash = hashQuestionUpdate(
          questionId.bookId,
          questionId.chapterId,
          questionId.idx
        );
      };

      const elem = $<HTMLElement>('[data-icon="delete"]', this.shadowRoot);
      if (this.doDelete) {
        elem.onclick = () => {
          if (this.doDelete) {
            this.doDelete(questionId);
          }
        };
      } else {
        elem.style.display = 'none';
      }
    }
  }

  show(showAnswer: boolean) {
    if (this.shadowRoot) {
      const value = showAnswer ? 'flex' : 'none';

      const answer = $('#answer', this.shadowRoot);
      if (answer.parentElement) {
        answer.parentElement.style.display = value;
      }

      const details = $('#details', this.shadowRoot);
      if (details.parentElement) {
        details.parentElement.style.display = details.innerHTML
          ? value
          : 'none';
      }
    }
  }
}
