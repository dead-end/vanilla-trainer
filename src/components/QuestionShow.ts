import { createFragment } from '../lib/html/createFragment';
import { html } from '../lib/html/html';
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
import { LocationInfo } from './LocationInfo';

export class QuestionShow extends HTMLElement {
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
      const shadow = this.attachShadow({ mode: 'open' });
      shadow.adoptedStyleSheets = STYLES;
      shadow.appendChild(this.renderComponent());

      if (this.questionId && this.question) {
        this.renderQuestion(this.questionId, this.question);
      }
    }
  }

  /**
   * The function uses questionId and question as parameters. This ensures that
   * both are not undefined.
   */
  renderQuestion(
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

  renderComponent() {
    const str = /* html */ html`
      <style>
        .label {
          font-weight: bold;
          padding-bottom: 0.5rem;
        }
      </style>
      <div class="is-column is-gap-small">
        <location-info id="location-info" style="display: none"></location-info>
        <div class="is-grid-3">
          <div class="is-column">
            <div class="is-row is-space-between">
              <div class="label" id="label">Question</div>
              <div id="progress"></div>
            </div>
            <div
              id="quest"
              class="is-border is-shadow is-padding-input is-multiline is-grow"
            ></div>
          </div>
          <div class="is-column">
            <div class="label">Answer</div>
            <div
              id="answer"
              class="is-border is-shadow is-padding-input is-multiline is-grow"
            ></div>
          </div>
          <div class="is-column">
            <div class="label">Details</div>
            <div
              id="details"
              class="is-border is-shadow is-padding-input is-multiline is-grow"
            ></div>
          </div>
        </div>

        <div class="is-row is-end is-gap-small">
          <ui-icons data-icon="delete"></ui-icons>
          <ui-icons data-icon="update"></ui-icons>
          <ui-icons data-icon="info"></ui-icons>
        </div>
      </div>
    `;

    return createFragment(str);
  }
}
