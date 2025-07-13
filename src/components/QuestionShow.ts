import { hashQuestionUpdate } from '../lib/location/hash';
import { mdToHtml } from '../lib/markdown';
import {
  TDoDelete,
  TQuestion,
  TQuestionId,
  TQuestionProgress,
} from '../lib/types';
import { STYLES } from '../lib/ui/stylesheets';
import { $ } from '../lib/utils/query';
import { tmplClone } from '../lib/utils/tmpl';
import { LocationInfo } from './LocationInfo';

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
      $('#quest', this.shadowRoot).innerHTML = mdToHtml(question.quest);
      $('#answer', this.shadowRoot).innerHTML = mdToHtml(question.answer);

      this.renderProgress(this.shadowRoot, process);
      this.renderDetails(this.shadowRoot, question);
      this.renderUpdateBtn(this.shadowRoot, questionId);
      this.renderDeleteBtn(this.shadowRoot, questionId);
      this.renderLocationBtn(this.shadowRoot, questionId);
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

  renderProgress(root: ShadowRoot, process: TQuestionProgress | undefined) {
    const elem = $<HTMLElement>('#progress', root);
    if (process) {
      elem.textContent = `Progress: ${process.progress} / 3`;
    } else {
      elem.style.display = 'none';
    }
  }

  renderDetails(root: ShadowRoot, question: TQuestion) {
    const elem = $('#details', root);
    if (!question.details && elem.parentElement) {
      elem.parentElement.style.display = 'none';
    }
    elem.innerHTML = question.details ? mdToHtml(question.details) : '';
  }

  renderUpdateBtn(root: ShadowRoot, questionId: TQuestionId) {
    $<HTMLElement>('[data-icon="update"]', root).onclick = () => {
      window.location.hash = hashQuestionUpdate(
        questionId.bookId,
        questionId.chapterId,
        questionId.idx
      );
    };
  }

  renderDeleteBtn(root: ShadowRoot, questionId: TQuestionId) {
    const elem = $<HTMLElement>('[data-icon="delete"]', root);
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

  // TODO: Display to LocationInfo??
  renderLocationBtn(root: ShadowRoot, questionId: TQuestionId) {
    $<HTMLElement>('[data-icon="info"]', root).onclick = () => {
      const info = $<LocationInfo>('#location-info', root);

      if (info.style.display === 'none') {
        info.style.display = 'block';
        $<LocationInfo>('#location-info', root).show(
          questionId.bookId,
          questionId.chapterId,
          questionId.idx.toString()
        );
      } else {
        info.style.display = 'none';
      }
    };
  }
}
