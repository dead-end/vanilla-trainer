import { fieldErrorExists, fieldErrorReset } from '../../lib/ui/field';
import { $ } from '../../lib/utils/query';
import { tmplClone } from '../../lib/utils/tmpl';
import { fieldGet, fieldRequired } from '../../lib/ui/field';
import { getRouteParams } from '../../lib/route';
import { hashQuestionList } from '../../lib/location/hash';
import { questionCreate, questionInst } from '../../lib/model/question';
import { bookGet } from '../../lib/model/book';
import { chapterGet } from '../../lib/model/chapter';
import { KeyValues } from '../../components/KeyValues';

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

    this.addChapterInfo(bookId, chapterId);

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

      questionCreate(bookId, chapterId, question)
        .then(() => {
          window.location.hash = hashQuestionList(bookId, chapterId);
        })
        .finally(() => {
          button.disabled = false;
        });
    }
  }

  async addChapterInfo(bookId: string, chapterId: string) {
    const book = await bookGet(bookId);
    const chapter = await chapterGet(bookId, chapterId);
    $<KeyValues>('#chapter-info').update([
      { key: 'Book', value: book.title },
      { key: 'Chapter', value: chapter.title },
    ]);
  }
}
