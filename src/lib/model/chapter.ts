import { pathChaptersGet, pathQuestionsGet } from '../path';
import { cacheDeletePath, cachedGetPath, cachePutPath } from '../remote/cache';
import { githubGetHash, githubGetUrl } from '../remote/github';
import Result from '../result';
import { TChapter, TGithubConfig, TQuestion } from '../types';

export const chapterListing = async (config: TGithubConfig, bookId: string) => {
  const result = new Result<TChapter[]>();

  //
  // Get the chapter list, from cache or from github.
  //
  const resCache = await cachedGetPath<TChapter[]>(
    config,
    pathChaptersGet(bookId)
  );
  if (resCache.hasError()) {
    return result.setError(resCache);
  }

  return result.setOk(resCache.getValue().data);
};

export const chapterCreate = async (
  config: TGithubConfig,
  bookId: string,
  chapter: TChapter
) => {
  const result = new Result<TChapter[]>();
  const pathChapters = pathChaptersGet(bookId);

  //
  // Get the book list, from cache or from github.
  //
  const resCache = await cachedGetPath<TChapter[]>(config, pathChapters);
  if (resCache.hasError()) {
    return result.setError(resCache);
  }

  //
  // Add the new book to the list
  //
  let chapters = resCache.getValue().data;
  if (chapters.find((c) => c.id === chapter.id)) {
    return result.setError('Id already exists!');
  }
  chapters.push(chapter);

  //
  // Write the new book list to github and update the cache.
  //
  const resPut = await cachePutPath<TChapter[]>(
    config,
    pathChapters,
    chapters,
    resCache.getValue().hash,
    `Adding chapter: ${chapter.id}`
  );
  if (resPut.hasError()) {
    return result.setError(resPut);
  }

  //
  // Get the hash value of the chapter list from github. This is void if the
  // file does not exist.
  //
  // TODO: Why github funtion is used here?
  // TODO: This is error handling. If the file, that we want to create already exists!
  const pathQuestions = pathQuestionsGet(bookId, chapter.id);
  const url = githubGetUrl(config.user, config.repo, pathQuestions);
  const resHash = await githubGetHash(url, config.token);
  if (resHash.hasError()) {
    return result.setError(resHash);
  }

  //
  // Write the empty list of questions for that chapter for the new file.
  //
  // TODO: Is the the question list?
  const resultChap = await cachePutPath<TQuestion[]>(
    config,
    pathQuestions,
    [],
    resHash.getValue(),
    'Creating chapters!'
  );
  if (resultChap.hasError()) {
    return result.setError(resultChap);
  }

  return result.setOk(chapters);
};

export const chapterGet = async (
  config: TGithubConfig,
  bookId: string,
  id: string
) => {
  const result = new Result<TChapter>();

  //
  // Get the book list, from cache or from github.
  //
  const resCache = await cachedGetPath<TChapter[]>(
    config,
    pathChaptersGet(bookId)
  );
  if (resCache.hasError()) {
    return result.setError(resCache);
  }

  //
  // Search the chapter.
  //
  const chapter = resCache.getValue().data.find((c) => c.id === id);
  if (!chapter) {
    return result.setError(`Not found: ${id}`);
  }
  return result.setOk(chapter);
};

export const chapterUpdate = async (
  config: TGithubConfig,
  bookId: string,
  chapter: TChapter
) => {
  const result = new Result<TChapter[]>();
  const pathChapters = pathChaptersGet(bookId);

  //
  // Get the book list, from cache or from github.
  //
  const resCache = await cachedGetPath<TChapter[]>(config, pathChapters);
  if (resCache.hasError()) {
    return result.setError(resCache);
  }

  //
  // Remove the book from the list and add the new version.
  //
  let chapters = resCache.getValue().data;
  chapters = chapters.filter((c) => c.id !== chapter.id);
  chapters.push(chapter);

  //
  // Write the new book list to github and update the cache.
  //
  return await cachePutPath<TChapter[]>(
    config,
    pathChapters,
    chapters,
    resCache.getValue().hash,
    `Updating chapter: ${chapter.id}`
  );
};

export const chapterDelete = async (
  config: TGithubConfig,
  bookId: string,
  id: string
) => {
  const result = new Result<TChapter[]>();
  const pathChapters = pathChaptersGet(bookId);

  //
  // Get the book list, from cache or from github.
  //
  const resCache = await cachedGetPath<TChapter[]>(config, pathChapters);
  if (resCache.hasError()) {
    return result.setError(resCache);
  }

  //
  // Remove the book from the list
  //
  let chapters = resCache.getValue().data;
  const len = chapters.length;
  chapters = chapters.filter((c) => c.id !== id);
  if (len === chapters.length) {
    return result.setError(`Not found: ${id}`);
  }

  //
  // Write the new book list to github and update the cache.
  //
  const resPut = await cachePutPath<TChapter[]>(
    config,
    pathChapters,
    chapters,
    resCache.getValue().hash,
    `Deleting chapter ${id}`
  );
  if (resPut.hasError()) {
    return result.setError(resPut);
  }

  //
  // Delete the chapter list of the book from github and from cache.
  //
  const resDel = await cacheDeletePath(
    config,
    pathQuestionsGet(bookId, id),
    `Deleting file.`
  );
  if (resDel.hasError()) {
    return result.setError(resDel);
  }

  return result.setOk(chapters);
};
