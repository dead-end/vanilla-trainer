import { ConfirmDialog } from '../../components/ConfirmDialog';
import { QuestionShow } from '../../components/QuestionShow';
import { hashChapterList, hashQuestionCreate } from '../../lib/hash';
import { questionDelete, questionListing } from '../../lib/model/question';
import { getRouteParams } from '../../lib/route';
import { $, tmplClone } from '../../lib/utils';

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

  doDelete(bookId: string, chapterId: string, idx: number) {
    $<ConfirmDialog>('#confirm-dialog').activate(
      'Delete Question',
      `Do you realy want to delete the question: ${idx}?`,
      this.getDeleteFct(bookId, chapterId, idx)
    );
  }

  getDeleteFct(bookId: string, chapterId: string, idx: number) {
    return async () => {
      questionDelete(bookId, chapterId, idx).then(() => {
        this.render();
      });
    };
  }
}
