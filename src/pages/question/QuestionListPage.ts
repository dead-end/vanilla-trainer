import { ConfirmDialog } from '../../components/ConfirmDialog';
import { LocationInfo } from '../../components/LocationInfo';
import { QuestionShow } from '../../components/QuestionShow';
import { createFragment } from '../../lib/html/createFragment';
import { html } from '../../lib/html/html';
import {
  hashCache,
  hashChapterList,
  hashQuestionCreate,
} from '../../lib/location/hash';
import { pathQuestionsGet } from '../../lib/location/path';
import { questionDelete, questionListing } from '../../lib/model/question';
import { getRouteParams } from '../../lib/route';
import { TQuestionId } from '../../lib/types';
import { $ } from '../../lib/utils/query';

export class QuestionListPage extends HTMLElement {
  connectedCallback() {
    if (!this.hasChildNodes()) {
      this.appendChild(this.renderPage());
    }

    this.render();
  }

  async render() {
    const [bookId, chapterId] = getRouteParams('bookId', 'chapterId');

    $<LocationInfo>('#location-info').show(bookId, chapterId);
    this.addLinks(bookId, chapterId);

    const questions = await questionListing(bookId, chapterId);
    const arr: QuestionShow[] = [];

    questions.forEach((q, idx) => {
      arr.push(
        QuestionShow.instance(
          { bookId, chapterId, idx },
          q,
          this.doDelete.bind(this)
        )
      );
    });

    $<HTMLElement>('[data-id="questions"]').replaceChildren(...arr);
  }

  addLinks(bookId: string, chapterId: string) {
    $<HTMLAnchorElement>('#question-create-link').href = hashQuestionCreate(
      bookId,
      chapterId
    );
    $<HTMLAnchorElement>('#question-cache-link').href = hashCache(
      pathQuestionsGet(bookId, chapterId)
    );
    $<HTMLAnchorElement>('#chapter-list-link').href = hashChapterList(bookId);
  }

  doDelete(questionId: TQuestionId) {
    $<ConfirmDialog>('#confirm-dialog').activate(
      'Delete Question',
      `Do you realy want to delete the question: ${questionId.idx}?`,
      this.getDeleteFct(questionId)
    );
  }

  getDeleteFct(questionId: TQuestionId) {
    return async () => {
      questionDelete(
        questionId.bookId,
        questionId.chapterId,
        questionId.idx
      ).then(() => {
        this.render();
      });
    };
  }

  renderPage() {
    const str = /* html */ html`
      <div class="is-column is-gap">
        <div class="page-title">Question List</div>
        <location-info id="location-info"></location-info>
        <div data-id="questions"></div>
        <div class="is-row is-gap-action">
          <a href="#" class="btn" id="chapter-list-link">Chapters</a>
          <a href="#" class="btn" id="question-create-link">Create</a>
          <a href="#" class="btn" id="question-cache-link">Cache</a>
        </div>
      </div>
    `;

    return createFragment(str);
  }
}
