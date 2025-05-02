import { ConfirmDialog } from '../../components/ConfirmDialog';
import { QuestionShow } from '../../components/QuestionShow';
import { adminGet } from '../../lib/admin';
import { hashChapterList, hashQuestionCreate } from '../../lib/hash';
import { githubConfigGet } from '../../lib/model/githubConfig';
import { questionDelete, questionListing } from '../../lib/model/question';
import { getRouteParams } from '../../lib/route';
import { $, errorGlobal, tmplClone } from '../../lib/utils';

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

    const config = await adminGet();
    const result = await questionListing(config, bookId, chapterId);
    if (result.isOk()) {
      const arr: QuestionShow[] = [];

      const questions = result.getValue();
      questions.forEach((q, idx) => {
        arr.push(QuestionShow.instance(idx, q, this.doDelete.bind(this)));
      });

      $<HTMLElement>('[data-id="questions"]').replaceChildren(...arr);
    }
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
      const githubConfig = await githubConfigGet();
      const result = await questionDelete(githubConfig, bookId, chapterId, idx);
      if (result.hasError()) {
        errorGlobal(`Unable to delete the chapter: ${chapterId}`);
        return;
      }

      this.render();
    };
  }
}
