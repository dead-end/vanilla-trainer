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

  isEnd = false;
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
      this.toggle(true);
    }
  }

  load() {
    this.lession = lessionLoad();
    if (!this.lession) {
      errorGlobal('No lession found!');
      return;
    }

    this.next();
  }

  next() {
    const tmp = this.lession!.learning.shift();

    if (tmp) {
      this.questionProgress = tmp;
      this.toggle(true);
      this.setQuestion();

      if (this.lession && this.questionProgress) {
        this.infoTableProgress(lessionGetProcess(this.lession));
        this.infoTableQuestion(
          this.questionProgress.questionId,
          this.questionProgress.progress
        );
      }
    } else {
      this.isEnd = true;
    }
  }

  async update(progress: number) {
    if (this.questionProgress && this.lession) {
      this.questionProgress.progress = progress;

      if (this.questionProgress.progress < 3) {
        this.lession.learning.push(this.questionProgress);
      } else {
        this.lession.learned.push(this.questionProgress);
      }

      if (!lessionUpdate(this.lession)) {
        this.isEnd = true;
        return;
      }

      this.next();
    }
  }

  onShow() {
    this.toggle(false);
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

  toggle(asking: boolean) {
    $$<HTMLElement>('[data-show="ask"]').forEach((e) => {
      e.style.display = asking ? 'block' : 'none';
    });

    $$<HTMLElement>('[data-show="show"]').forEach((e) => {
      e.style.display = asking ? 'none' : 'block';
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
