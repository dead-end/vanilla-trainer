import { GlobalError } from '../error';
import { pathQuestionsGet } from '../location/path';
import { jsonGet, jsonPut } from '../remote/json';
import { TQuestion } from '../types';
import { githubConfigGet } from './githubConfig';

/**
 * The function returns the list of questions for the chapter.
 */
export const questionListing = async (bookId: string, chapterId: string) => {
  const config = await githubConfigGet();
  const path = pathQuestionsGet(bookId, chapterId);

  const resCache = await jsonGet<TQuestion[]>(config, path);
  if (resCache.hasError) {
    throw new GlobalError(resCache.message);
  }

  return resCache.value.data;
};

/**
 * The function returns a question from the cache or from github.
 */
export const questionGet = async (
  bookId: string,
  chapterId: string,
  idx: number
) => {
  const questions = await questionListing(bookId, chapterId);
  return questions[idx];
};

/**
 * The function updates a question and writes the result to github.
 */
export const questionUpdate = async (
  bookId: string,
  chapterId: string,
  idx: number,
  question: TQuestion
) => {
  const config = await githubConfigGet();
  const pathQuestions = pathQuestionsGet(bookId, chapterId);

  const resCache = await jsonGet<TQuestion[]>(config, pathQuestions);
  if (resCache.hasError) {
    throw new GlobalError(resCache.message);
  }

  const questions = resCache.value.data;
  questions[idx] = question;

  const resPut = await jsonPut<TQuestion[]>(
    config,
    pathQuestions,
    questions,
    resCache.value.hash,
    'Updating question!'
  );
  if (resPut.hasError) {
    throw new GlobalError(resPut.message);
  }
};

/**
 * The function creates a question and writes the result to github.
 */
export const questionCreate = async (
  bookId: string,
  chapterId: string,
  question: TQuestion
) => {
  const config = await githubConfigGet();
  const path = pathQuestionsGet(bookId, chapterId);

  const resCache = await jsonGet<TQuestion[]>(config, path);
  if (resCache.hasError) {
    throw new GlobalError(resCache.message);
  }

  const questions = resCache.value.data;
  questions.push(question);

  const resPut = await jsonPut<TQuestion[]>(
    config,
    path,
    questions,
    resCache.value.hash,
    'Adding question!'
  );
  if (resPut.hasError) {
    throw new GlobalError(resPut.message);
  }
};

/**
 * The function deletes a question and writes the result to github.
 */
export const questionDelete = async (
  bookId: string,
  chapterId: string,
  idx: number
) => {
  const config = await githubConfigGet();
  const path = pathQuestionsGet(bookId, chapterId);

  const resCache = await jsonGet<TQuestion[]>(config, path);
  if (resCache.hasError) {
    throw new GlobalError(resCache.message);
  }

  const questions = resCache.value.data.filter((_v, i) => idx !== i);

  const resPut = await jsonPut<TQuestion[]>(
    config,
    path,
    questions,
    resCache.value.hash,
    'Deleting question!'
  );
  if (resPut.hasError) {
    throw new GlobalError(resPut.message);
  }

  return questions;
};

/**
 * Create a TQuestion instance. I do not want a details property if it is
 * undefined. I want a minimal json to store at github.
 */
export const questionInst = (
  quest: string,
  answer: string,
  details: string | undefined
) => {
  const result: TQuestion = {
    quest: quest,
    answer: answer,
  };
  if (details) {
    result.details = details;
  }
  return result;
};
