import { pathQuestionsGet } from '../path';
import { cachedGetPath, cachePutPath } from '../remote/cache';
import Result from '../result';
import { TGithubConfig, TQuestion } from '../types';

/**
 * The function returns the list of questions for the chapter.
 */
export const questionListing = async (
  config: TGithubConfig,
  bookId: string,
  chapterId: string
) => {
  const result = new Result<TQuestion[]>();

  const resCache = await cachedGetPath<TQuestion[]>(
    config,
    pathQuestionsGet(bookId, chapterId)
  );
  if (resCache.hasError()) {
    return result.setError(resCache);
  }

  return result.setOk(resCache.getValue().data);
};

/**
 * The function returns a question from the cache or from github.
 */
export const questionGet = async (
  config: TGithubConfig,
  bookId: string,
  chapterId: string,
  idx: number
) => {
  const result = new Result<TQuestion>();

  const resList = await questionListing(config, bookId, chapterId);
  if (resList.hasError()) {
    return result.setError(resList);
  }

  return result.setOk(resList.getValue()[idx]);
};

/**
 * The function updates a question and writes the result to github.
 */
export const questionUpdate = async (
  config: TGithubConfig,
  bookId: string,
  chapterId: string,
  idx: number,
  question: TQuestion
) => {
  const result = new Result<void>();
  const pathQuestions = pathQuestionsGet(bookId, chapterId);

  const resCache = await cachedGetPath<TQuestion[]>(config, pathQuestions);
  if (resCache.hasError()) {
    return result.setError(resCache);
  }

  const questions = resCache.getValue().data;
  questions[idx] = question;

  const resPut = await cachePutPath<TQuestion[]>(
    config,
    pathQuestions,
    questions,
    resCache.getValue().hash,
    'Updating question!'
  );
  if (resPut.hasError()) {
    return result.setError(resPut);
  }

  return result.setOk();
};

/**
 * The function creates a question and writes the result to github.
 */
export const questionCreate = async (
  config: TGithubConfig,
  bookId: string,
  chapterId: string,
  question: TQuestion
) => {
  const result = new Result<void>();
  const pathQuestions = pathQuestionsGet(bookId, chapterId);

  const resCache = await cachedGetPath<TQuestion[]>(config, pathQuestions);
  if (resCache.hasError()) {
    return result.setError(resCache);
  }

  const questions = resCache.getValue().data;
  questions.push(question);

  const resPut = await cachePutPath<TQuestion[]>(
    config,
    pathQuestions,
    questions,
    resCache.getValue().hash,
    'Adding question!'
  );
  if (resPut.hasError()) {
    return result.setError(resPut);
  }

  return result.setOk();
};

/**
 * The function deletes a question and writes the result to github.
 */
export const questionDelete = async (
  config: TGithubConfig,
  bookId: string,
  chapterId: string,
  idx: number
) => {
  const result = new Result<TQuestion[]>();
  const pathQuestions = pathQuestionsGet(bookId, chapterId);

  const resCache = await cachedGetPath<TQuestion[]>(config, pathQuestions);
  if (resCache.hasError()) {
    return result.setError(resCache);
  }

  const questions = resCache.getValue().data.filter((_v, i) => idx !== i);

  const resPut = await cachePutPath<TQuestion[]>(
    config,
    pathQuestions,
    questions,
    resCache.getValue().hash,
    'Deleting question!'
  );
  if (resPut.hasError()) {
    return result.setError(resPut);
  }

  return result.setOk(questions);
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
