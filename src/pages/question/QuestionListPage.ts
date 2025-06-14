import { ConfirmDialog } from '../../components/ConfirmDialog';
import { QuestionShow } from '../../components/QuestionShow';
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
import { tmplClone } from '../../lib/utils/tmpl';

export class QuestionListPage extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#question-list-page');

  connectedCallback() {
    if (!this.hasChildNodes()) {
      const tmpl = tmplClone(QuestionListPage.TMPL);
      this.appendChild(tmpl);
    }

    this.render();
  }

  async render() {
    const [bookId, chapterId] = getRouteParams('bookId', 'chapterId');
    $<HTMLAnchorElement>('#question-create-link').href = hashQuestionCreate(
      bookId,
      chapterId
    );
    $<HTMLAnchorElement>('#question-cache-link').href = hashCache(
      pathQuestionsGet(bookId, chapterId)
    );
    $<HTMLAnchorElement>('#chapter-list-link').href = hashChapterList(bookId);

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
}
