import { InfoTable } from '../../components/InfoTable';
import { hashHome } from '../../lib/hash';
import { mdToHtml } from '../../lib/markdown';
import { bookGet } from '../../lib/model/book';
import { chapterGet } from '../../lib/model/chapter';
import { githubConfigGet } from '../../lib/model/githubConfig';
import {
  lessionGetProcess,
  lessionLoad,
  lessionTotal2Learn,
  lessionUpdate,
} from '../../lib/model/lession';
import { questionGet } from '../../lib/model/question';
import { TLession, TQuestionId, TQuestionProgress } from '../../lib/types';
import { $, $$, errorGlobal, tmplClone } from '../../lib/utils';

export class LessionProcessPage extends HTMLElement {
  static TMPL = $<HTMLTemplateElement>('#lession-process-page');

  lession: TLession | undefined;
  questionProgress: TQuestionProgress | undefined;

  connectedCallback() {
    if (!this.hasChildNodes()) {
      const tmpl = tmplClone(LessionProcessPage.TMPL);

      [
        { id: '#btn-show', fct: this.onShow },
        { id: '#btn-correct', fct: this.onCorrect },
        { id: '#btn-wrong', fct: this.onWrong },
        { id: '#btn-skip', fct: this.onSkip },
        { id: '#btn-learned', fct: this.onLearned },
        { id: '#btn-stop', fct: this.onStop },
      ].forEach((e) => {
        $<HTMLButtonElement>(e.id, tmpl).onclick = e.fct.bind(this);
      });

      this.appendChild(tmpl);

      this.load();
    }
  }

  load() {
    this.lession = lessionLoad();
    if (!this.lession) {
      this.toggleRunning(false);
      errorGlobal('No lession found!');
      return;
    }

    this.toggleRunning(true);
    this.next();
  }

  /**
   * The function removes the current question form the learing list and sets
   * up the info tables.
   */
  next() {
    if (this.lession) {
      this.infoTableProgress(lessionGetProcess(this.lession));
      const tmp = this.lession!.learning.shift();

      if (tmp) {
        this.questionProgress = tmp;
        this.setQuestion();
        this.toggleQuestion(true);
      } else {
        this.toggleRunning(false);
        return;
      }

      if (this.questionProgress) {
        this.infoTableQuestion(
          this.questionProgress.questionId,
          this.questionProgress.progress
        );
      }
    }
  }

  /**
   * The function adds the current question to the learning or learned array
   * and saves the result. The next() function removes the current question
   * from the learning array, so it has to be added before saving.
   */
  async update(progress: number) {
    if (this.questionProgress && this.lession) {
      this.questionProgress.progress = progress;

      if (this.questionProgress.progress < 3) {
        this.lession.learning.push(this.questionProgress);
      } else {
        this.lession.learned.push(this.questionProgress);
      }

      lessionUpdate(this.lession);

      this.next();
    }
  }

  onShow() {
    this.toggleQuestion(false);
  }

  onCorrect = () => {
    this.update(this.questionProgress!.progress + 1);
  };

  onWrong() {
    this.update(0);
  }

  onLearned() {
    this.update(3);
  }

  onSkip() {
    this.update(this.questionProgress!.progress);
  }

  onStop() {
    window.location.hash = hashHome();
  }

  toggleQuestion(asking: boolean) {
    this.doShow('[data-show="ask"]', asking);
    this.doShow('[data-show="show"]', !asking);
  }

  toggleRunning(running: boolean) {
    this.doShow('[data-show="running"]', running);

    if (!running) {
      this.doShow('[data-show="ask"]', false);
      this.doShow('[data-show="show"]', false);
    }
  }

  doShow(tag: string, show: boolean) {
    $$<HTMLElement>(tag).forEach((e) => {
      const display = e.dataset.display || 'block';
      e.style.display = show ? display : 'none';
    });
  }

  async getQuestion(questionId: TQuestionId) {
    const config = await githubConfigGet();
    const result = await questionGet(
      config,
      questionId.bookId,
      questionId.chapterId,
      questionId.idx
    );
    if (result.hasError()) {
      const msg = `Unable to get question - ${result.getMessage()}`;
      errorGlobal(msg);
      throw new Error(msg);
    }

    return result.getValue();
  }

  async getBook(questionId: TQuestionId) {
    const config = await githubConfigGet();
    const result = await bookGet(config, questionId.bookId);
    if (result.hasError()) {
      const msg = `Unable to get question - ${result.getMessage()}`;
      errorGlobal(msg);
      throw new Error(msg);
    }

    return result.getValue();
  }

  async getChapter(questionId: TQuestionId) {
    const config = await githubConfigGet();
    const result = await chapterGet(
      config,
      questionId.bookId,
      questionId.chapterId
    );
    if (result.hasError()) {
      const msg = `Unable to get question - ${result.getMessage()}`;
      errorGlobal(msg);
      throw new Error(msg);
    }

    return result.getValue();
  }

  async setQuestion() {
    if (this.questionProgress) {
      const question = await this.getQuestion(this.questionProgress.questionId);

      $('#quest').innerHTML = mdToHtml(question.quest);
      $('#answer').innerHTML = mdToHtml(question.answer);
      $('#quest').innerHTML = question.quest ? mdToHtml(question.quest) : '';
    }
  }

  infoTableProgress(progress: number[]) {
    $<InfoTable>('#info-progress').update([
      { key: 'No correct answers', value: progress[0].toString() },
      { key: 'One correct answer', value: progress[1].toString() },
      { key: 'Two correct answers', value: progress[2].toString() },
      { key: 'Learned', value: progress[3].toString() },
      { key: 'Total', value: lessionTotal2Learn(progress).toString() },
    ]);
  }

  async infoTableQuestion(questionId: TQuestionId, progress: number) {
    const book = await this.getBook(questionId);
    const chapter = await this.getBook(questionId);

    $<InfoTable>('#info-question').update([
      { key: 'Books', value: book.title },
      { key: 'Chapter', value: chapter.title },
      { key: 'Index', value: questionId.idx.toString() },
      { key: 'Progress', value: `${progress} / 3` },
    ]);
  }
}
