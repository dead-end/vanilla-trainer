import { hashQuestionUpdate } from '../lib/hash';
import { mdToHtml } from '../lib/markdown';
import { getRouteParam } from '../lib/route';
import { TQuestion } from '../lib/types';
import { STYLES } from '../lib/ui/stylesheets';
import { $, tmplClone } from '../lib/utils';

export class QuestionShow extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#tmpl-question-show');

  idx: number = -1;
  question: TQuestion | undefined;
  doDelete:
    | ((bookId: string, chapterId: string, idx: number) => void)
    | undefined;

  static instance(
    idx: number,
    question: TQuestion,
    doDelete: (bookId: string, chapterId: string, idx: number) => void
  ) {
    const instance = document.createElement('question-show') as QuestionShow;
    instance.idx = idx;
    instance.question = question;
    instance.doDelete = doDelete;
    return instance;
  }

  connectedCallback() {
    if (!this.shadowRoot) {
      const tmpl = tmplClone(QuestionShow.TMPL);

      if (this.question) {
        $('#label', tmpl).textContent = `Question: ${this.idx}`;
        $('#quest', tmpl).innerHTML = mdToHtml(this.question.quest);
        $('#answer', tmpl).innerHTML = mdToHtml(this.question.answer);
        if (this.question.details) {
          $('#details', tmpl).innerHTML = mdToHtml(this.question.details);
        }
      }

      const bookId = getRouteParam('bookId');
      const chapterId = getRouteParam('chapterId');

      $<HTMLElement>('[data-icon="update"]', tmpl).onclick = () => {
        window.location.hash = hashQuestionUpdate(bookId, chapterId, this.idx);
      };

      $<HTMLElement>('[data-icon="delete"]', tmpl).onclick = () => {
        if (this.doDelete) {
          this.doDelete(bookId, chapterId, this.idx);
        }
      };

      const shadow = this.attachShadow({ mode: 'open' });
      shadow.adoptedStyleSheets = STYLES;
      shadow.appendChild(tmpl);
    }
  }
}
