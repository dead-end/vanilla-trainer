import { hashQuestionUpdate } from '../lib/hash';
import { mdToHtml } from '../lib/markdown';
import { TQuestion, TQuestionId } from '../lib/types';
import { STYLES } from '../lib/ui/stylesheets';
import { $, tmplClone } from '../lib/utils';

type TDoDelete = (bookId: string, chapterId: string, idx: number) => void;

export class QuestionShow extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#tmpl-question-show');

  questionId: TQuestionId | undefined;
  question: TQuestion | undefined;
  doDelete: TDoDelete | undefined;

  static instance(
    questionId: TQuestionId,
    question: TQuestion,
    doDelete: TDoDelete
  ) {
    const instance = document.createElement('question-show') as QuestionShow;
    return instance.setup(questionId, question, doDelete);
  }

  setup(questionId: TQuestionId, question: TQuestion, doDelete: TDoDelete) {
    this.questionId = questionId;
    this.question = question;
    this.doDelete = doDelete;
    return this;
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

  render(questionId: TQuestionId, question: TQuestion) {
    if (this.shadowRoot) {
      $('#label', this.shadowRoot).textContent = `Question: ${questionId.idx}`;
      $('#quest', this.shadowRoot).innerHTML = mdToHtml(question.quest);
      $('#answer', this.shadowRoot).innerHTML = mdToHtml(question.answer);
      if (question.details) {
        $('#details', this.shadowRoot).innerHTML = mdToHtml(question.details);
      } else {
        $<HTMLElement>('#details', this.shadowRoot).parentElement!.hidden =
          true;
      }

      $<HTMLElement>('[data-icon="update"]', this.shadowRoot).onclick = () => {
        window.location.hash = hashQuestionUpdate(
          questionId.bookId,
          questionId.chapterId,
          questionId.idx
        );
      };

      $<HTMLElement>('[data-icon="delete"]', this.shadowRoot).onclick = () => {
        if (this.doDelete) {
          this.doDelete(
            questionId.bookId,
            questionId.chapterId,
            questionId.idx
          );
        }
      };
    }
  }
}
