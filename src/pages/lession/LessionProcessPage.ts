import { KeyValues } from '../../components/KeyValues';
import { LocationInfo } from '../../components/LocationInfo';
import { QuestionShow } from '../../components/QuestionShow';
import { dispatchError } from '../../lib/error';
import { createFragment } from '../../lib/html/createFragment';
import { html } from '../../lib/html/html';
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

export class LessionProcessPage extends HTMLElement {
  lession: TLession | undefined;
  questionProgress: TQuestionProgress | undefined;

  connectedCallback() {
    if (!this.hasChildNodes()) {
      this.appendChild(this.renderComponent());
      this.load();
    }
  }

  private renderComponent() {
    const str = /* html */ html`
      <div class="is-column is-gap">
        <div class="page-title">Lession Process</div>

        <location-info id="location-info"></location-info>
        <key-values id="progress-info"></key-values>

        <question-show id="question-show" data-show="running"></question-show>

        <div class="is-row is-gap">
          <button class="btn" id="btn-correct" data-show="show">Correct</button>
          <button class="btn" id="btn-wrong" data-show="show">Wrong</button>
          <button class="btn" id="btn-skip" data-show="show">Skip</button>
          <button class="btn" id="btn-learned" data-show="show">Learned</button>
          <button class="btn" id="btn-show" data-show="ask">Show</button>
          <button class="btn" id="btn-stop">End</button>
        </div>
      </div>
    `;

    const frag = createFragment(str);

    [
      { id: '#btn-show', fct: this.onShow },
      { id: '#btn-correct', fct: this.onCorrect },
      { id: '#btn-wrong', fct: this.onWrong },
      { id: '#btn-skip', fct: this.onSkip },
      { id: '#btn-learned', fct: this.onLearned },
      { id: '#btn-stop', fct: this.onStop },
    ].forEach((e) => {
      $<HTMLButtonElement>(e.id, frag).onclick = e.fct.bind(this);
    });

    return frag;
  }

  private load() {
    this.lession = lessionLoad();
    if (!this.lession) {
      this.setStateRunning(false);
      dispatchError('No lession found!');
      return;
    }

    this.setStateRunning(true);
    this.next();
  }

  /**
   * The function removes the current question form the learing list and sets
   * up the info tables.
   */
  private next() {
    if (this.lession) {
      this.addProgressInfo(lessionGetProcess(this.lession));
      const tmp = this.lession!.learning.shift();

      if (tmp) {
        this.questionProgress = tmp;
        this.setQuestion(
          this.questionProgress.questionId,
          this.questionProgress,
          this.lession.reverse
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
  private async update(progress: number) {
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

  private onShow() {
    this.setStateQuestion(false);
  }

  private onCorrect = () => {
    this.update(this.questionProgress!.progress + 1);
  };

  private onWrong() {
    this.update(0);
  }

  private onLearned() {
    this.update(3);
  }

  private onSkip() {
    this.update(this.questionProgress!.progress);
  }

  private onStop() {
    window.location.hash = hashHome();
  }

  private setStateQuestion(asking: boolean) {
    this.doShow('[data-show="ask"]', asking);
    this.doShow('[data-show="show"]', !asking);
    $<QuestionShow>('#question-show').show(!asking);
  }

  private setStateRunning(running: boolean) {
    this.doShow('[data-show="running"]', running);

    if (!running) {
      this.doShow('[data-show="ask"]', false);
      this.doShow('[data-show="show"]', false);
    }
  }

  private doShow(tag: string, show: boolean) {
    $$<HTMLElement>(tag).forEach((e) => {
      const display = e.dataset.display || 'block';
      e.style.display = show ? display : 'none';
    });
  }

  private async setQuestion(
    questionId: TQuestionId,
    progress: TQuestionProgress,
    reverse: boolean
  ) {
    const question = await questionGet(
      questionId.bookId,
      questionId.chapterId,
      questionId.idx
    );
    $<QuestionShow>('#question-show').renderQuestion(
      questionId,
      question,
      reverse,
      progress
    );
  }

  private addProgressInfo(progress: number[]) {
    $<KeyValues>('#progress-info').update([
      { key: 'Unlearned', value: progress[0].toString() },
      { key: 'One correct', value: progress[1].toString() },
      { key: 'Two correct', value: progress[2].toString() },
      { key: 'Learned', value: progress[3].toString() },
      { key: 'Total', value: lessionTotal2Learn(progress).toString() },
    ]);
  }
}
