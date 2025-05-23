import { GlobalError } from '../GlobalError';
import { pathChaptersGet, pathQuestionsGet } from '../path';
import { cacheDeletePath, cachedGetPath, cachePutPath } from '../remote/cache';
import { TChapter, TQuestion } from '../types';
import { githubConfigGet } from './githubConfig';

/**
 * The function returns a list of chapters of a book from the cache.
 */
export const chapterListing = async (bookId: string) => {
  const config = await githubConfigGet();
  const path = pathChaptersGet(bookId);

  const resCache = await cachedGetPath<TChapter[]>(config, path);
  if (resCache.hasError) {
    throw new GlobalError(resCache.message);
  }

  return resCache.value.data;
};

/**
 * The function returns a chapter of a book. All chapters are read from the
 * cache and the required is got from this list.
 */
export const chapterGet = async (bookId: string, id: string) => {
  const config = await githubConfigGet();
  const path = pathChaptersGet(bookId);

  const resCache = await cachedGetPath<TChapter[]>(config, path);
  if (resCache.hasError) {
    throw new GlobalError(resCache.message);
  }

  const chapter = resCache.value.data.find((c) => c.id === id);
  if (!chapter) {
    throw new GlobalError(`Not found: ${id}`);
  }
  return chapter;
};

/**
 * The function update a chapter of a book. All chapters are load from the
 * cache. Then the old chapter is removed from the list and the new is added
 * to the array. Then all is written to the cache.
 */
export const chapterUpdate = async (bookId: string, chapter: TChapter) => {
  const config = await githubConfigGet();
  const path = pathChaptersGet(bookId);

  const resCache = await cachedGetPath<TChapter[]>(config, path);
  if (resCache.hasError) {
    throw new GlobalError(resCache.message);
  }

  const chapters = resCache.value.data;
  const idx = chapters.findIndex((c) => c.id === chapter.id);
  if (idx < 0) {
    throw new GlobalError(`Chapter not found: ${chapter.id}`);
  }
  chapters[idx] = chapter;

  const resPut = await cachePutPath<TChapter[]>(
    config,
    path,
    chapters,
    resCache.value.hash,
    `Updating chapter: ${chapter.id}`
  );

  return resPut.value;
};

/**
 * The function deletes a chapter of a book. All chapters of the book are read
 * from the cache. The chapter is filtered out and the result is then written
 * back to the cache. Additionally the file with the questions of the chapter
 * is deleted.
 */
export const chapterDelete = async (bookId: string, id: string) => {
  const config = await githubConfigGet();
  const path = pathChaptersGet(bookId);

  const resCache = await cachedGetPath<TChapter[]>(config, path);
  if (resCache.hasError) {
    throw new GlobalError(resCache.message);
  }

  let chapters = resCache.value.data;
  const len = chapters.length;
  chapters = chapters.filter((c) => c.id !== id);
  if (len === chapters.length) {
    throw new GlobalError(`Not found: ${id}`);
  }

  const resPut = await cachePutPath<TChapter[]>(
    config,
    path,
    chapters,
    resCache.value.hash,
    `Deleting chapter ${id}`
  );
  if (resPut.hasError) {
    throw new GlobalError(resPut.message);
  }

  const resDel = await cacheDeletePath(
    config,
    pathQuestionsGet(bookId, id),
    `Deleting file.`
  );
  if (resDel.hasError) {
    throw new GlobalError(resDel.message);
  }

  return chapters;
};

/**
 * The function creates a new chapter for a book. All chapters of the book are
 * read from the cache. The chapter is added, if it does not already exist and
 * then all is written to the cache. Additionally an empty file for the
 * questions is added.
 */
export const chapterCreate = async (bookId: string, chapter: TChapter) => {
  const config = await githubConfigGet();
  const path = pathChaptersGet(bookId);

  const resCache = await cachedGetPath<TChapter[]>(config, path);
  if (resCache.hasError) {
    throw new GlobalError(resCache.message);
  }

  const chapters = resCache.value.data;
  if (chapters.find((c) => c.id === chapter.id)) {
    throw new GlobalError(`Id already exists: ${chapter.id}`);
  }
  chapters.push(chapter);

  const resPut = await cachePutPath<TChapter[]>(
    config,
    path,
    chapters,
    resCache.value.hash,
    `Adding chapter: ${chapter.id}`
  );
  if (resPut.hasError) {
    throw new GlobalError(resPut.message);
  }

  const pathQuestions = pathQuestionsGet(bookId, chapter.id);
  const resultChap = await cachePutPath<TQuestion[]>(
    config,
    pathQuestions,
    [],
    undefined,
    'Creating chapters!'
  );
  if (resultChap.hasError) {
    throw new GlobalError(resultChap.message);
  }

  return chapters;
};
