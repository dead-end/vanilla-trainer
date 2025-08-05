import { fieldErrorExists, fieldErrorReset } from '../../lib/ui/field';
import { $ } from '../../lib/utils/query';
import { fieldGet, fieldRequired } from '../../lib/ui/field';
import { getRouteParams } from '../../lib/route';
import { hashQuestionList } from '../../lib/location/hash';
import {
  questionGet,
  questionInst,
  questionUpdate,
} from '../../lib/model/question';
import { LocationInfo } from '../../components/LocationInfo';
import { createFragment } from '../../lib/html/createFragment';
import { html } from '../../lib/html/html';

export class QuestionUpdatePage extends HTMLElement {
  connectedCallback() {
    if (!this.hasChildNodes()) {
      this.appendChild(this.renderComponent());
    }

    this.updateComponent();
  }

  renderComponent() {
    const str = /* html */ html`
      <div class="is-column is-gap">
        <div class="page-title">Update Question</div>
        <location-info id="location-info"></location-info>
        <form class="is-column is-gap">
          <ui-field data-id="quest" data-label="Question">
            <preview-field data-id="quest">
              <textarea id="quest" name="quest" rows="4"></textarea>
            </preview-field>
          </ui-field>

          <ui-field data-id="answer" data-label="Answer">
            <preview-field data-id="answer">
              <textarea id="answer" name="answer" rows="4"></textarea>
            </preview-field>
          </ui-field>

          <ui-field data-id="details" data-label="Details">
            <preview-field data-id="details">
              <textarea id="details" name="details" rows="4"></textarea>
            </preview-field>
          </ui-field>

          <div class="is-row is-gap">
            <a href="#" class="btn" id="question-list-link">Cancel</a>
            <button class="btn" type="submit" id="btn-submit">Update</button>
          </div>
        </form>
      </div>
    `;

    const frag = createFragment(str);

    $<HTMLFormElement>('form', frag).onsubmit = this.handleSubmit.bind(this);

    return frag;
  }

  async updateComponent() {
    const [bookId, chapterId, idx] = getRouteParams(
      'bookId',
      'chapterId',
      'idx'
    );

    $<LocationInfo>('#location-info').show(bookId, chapterId, idx);

    $<HTMLAnchorElement>('#question-list-link', this).href = hashQuestionList(
      bookId,
      chapterId
    );

    const question = await questionGet(bookId, chapterId, parseInt(idx));

    this.setValue('#quest', question.quest);
    this.setValue('#answer', question.answer);
    this.setValue('#details', question.details || '');
  }

  setValue(id: string, value: string) {
    const elem = $<HTMLTextAreaElement>(id);
    elem.value = value;
    elem.dispatchEvent(new Event('input'));
  }

  async handleSubmit(e: SubmitEvent) {
    e.preventDefault();

    const [bookId, chapterId, idx] = getRouteParams(
      'bookId',
      'chapterId',
      'idx'
    );

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

      questionUpdate(bookId, chapterId, parseInt(idx), question)
        .then(() => {
          window.location.hash = hashQuestionList(bookId, chapterId);
        })
        .finally(() => {
          button.disabled = false;
        });
    }
  }
}
