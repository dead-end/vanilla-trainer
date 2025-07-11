import { KeyValues } from '../../components/KeyValues';
import { LocationInfo } from '../../components/LocationInfo';
import { QuestionShow } from '../../components/QuestionShow';
import { errorGlobal } from '../../lib/GlobalError';
import { hashHome } from '../../lib/location/hash';
import {
  lessionGetProcess,
  lessionLoad,
  lessionTotal2Learn,
  lessionUpdate,
} from '../../lib/model/lession';
import { questionGet } from '../../lib/model/question';
import { TLession, TQuestionId, TQuestionProgress } from '../../lib/types';
import { $, $$ } from '../../lib/utils/query';
import { tmplClone } from '../../lib/utils/tmpl';

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
      this.setStateRunning(false);
      errorGlobal('No lession found!');
      return;
    }

    this.setStateRunning(true);
    this.next();
  }

  /**
   * The function removes the current question form the learing list and sets
   * up the info tables.
   */
  next() {
    if (this.lession) {
      this.addProgressInfo(lessionGetProcess(this.lession));
      const tmp = this.lession!.learning.shift();

      if (tmp) {
        this.questionProgress = tmp;
        this.setQuestion(
          this.questionProgress.questionId,
          this.questionProgress
        );
        this.setStateQuestion(true);
      } else {
        this.setStateRunning(false);
        return;
      }

      if (this.questionProgress) {
        $<LocationInfo>('location-info').show(
          this.questionProgress.questionId.bookId,
          this.questionProgress.questionId.chapterId,
          this.questionProgress.questionId.idx.toString()
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
    this.setStateQuestion(false);
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

  setStateQuestion(asking: boolean) {
    this.doShow('[data-show="ask"]', asking);
    this.doShow('[data-show="show"]', !asking);
    $<QuestionShow>('#question-show').show(!asking);
  }

  setStateRunning(running: boolean) {
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

  async setQuestion(questionId: TQuestionId, progress: TQuestionProgress) {
    const question = await questionGet(
      questionId.bookId,
      questionId.chapterId,
      questionId.idx
    );
    $<QuestionShow>('#question-show').render(questionId, question, progress);
  }

  addProgressInfo(progress: number[]) {
    $<KeyValues>('#progress-info').update([
      { key: 'Unlearned', value: progress[0].toString() },
      { key: 'One correct', value: progress[1].toString() },
      { key: 'Two correct', value: progress[2].toString() },
      { key: 'Learned', value: progress[3].toString() },
      { key: 'Total', value: lessionTotal2Learn(progress).toString() },
    ]);
  }
}
