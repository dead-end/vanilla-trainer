import { shuffleArr } from '../shuffle';
import { TLession, TQuestionId, TQuestionProgress } from '../types';

const KEY = 'lession';

/**
 * The function creates a persisted lession.
 */
export const lessionCreate = (
  questionIds: TQuestionId[],
  progress: number,
  reverse: boolean
) => {
  if (questionIds.length == 0) {
    return;
  }

  const learning: TQuestionProgress[] = questionIds.map((questionId) => {
    return {
      questionId,
      progress,
    };
  });
  shuffleArr(learning);

  const lession: TLession = {
    learning: learning,
    learned: [],
    reverse: reverse,
  };

  localStorage.setItem(KEY, JSON.stringify(lession));
};

/**
 * The function checks if a lession exists.
 */
export const lessionExists = () => {
  return localStorage.getItem(KEY) != null;
};

/**
 * The function loads the lession from the store
 */
export const lessionLoad = () => {
  const data = localStorage.getItem(KEY);
  if (data) {
    return JSON.parse(data) as TLession;
  }

  return undefined;
};

/**
 * The function persists the lession.
 */
export const lessionUpdate = (lession: TLession) => {
  if (lession.learning.length > 0) {
    localStorage.setItem(KEY, JSON.stringify(lession));
    return true;
  } else {
    localStorage.removeItem(KEY);
    return false;
  }
};

/**
 * The function removes the lession from the store.
 */
export const lessionRemove = () => {
  localStorage.removeItem(KEY);
};

/**
 * The function returns an arrary with the progress of the lession.
 */
export const lessionGetProcess = (lession: TLession) => {
  const tmp = [0, 0, 0, lession.learned.length];
  lession.learning.forEach((quest) => {
    if (quest.progress > 2) {
      throw Error(`Invalid progress ${quest.progress}`);
    }
    tmp[quest.progress]++;
  });

  return tmp;
};

/**
 * The function returns the questions to learn for a lession.
 */
export const lessionTotal2Learn = (process: number[]) => {
  let total2learn = 0;
  total2learn += process[0] * 3;
  total2learn += process[1] * 2;
  total2learn += process[2] * 1;
  return total2learn;
};
