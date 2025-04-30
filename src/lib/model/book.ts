import { pathBooksGet, pathChaptersGet } from '../path';
import { cacheDeletePath, cachedGetPath, cachePutPath } from '../remote/cache';
import { githubGetHash, githubGetUrl } from '../remote/github';
import Result from '../result';
import { TBook, TChapter, TGithubConfig } from '../types';

/**
 * The function reads the file with the book array.
 */
export const bookListing = async (config: TGithubConfig) => {
  const result = new Result<TBook[]>();

  //
  // Get the book list, from cache or from github.
  //
  const resCache = await cachedGetPath<TBook[]>(config, pathBooksGet());
  if (resCache.hasError()) {
    return result.setError(resCache);
  }

  return result.setOk(resCache.getValue().data);
};

/**
 * The function returns a book with a given id.
 */
export const bookGet = async (config: TGithubConfig, id: string) => {
  const result = new Result<TBook>();

  //
  // Get the book list, from cache or from github.
  //
  const resCache = await cachedGetPath<TBook[]>(config, pathBooksGet());
  if (resCache.hasError()) {
    return result.setError(resCache);
  }

  //
  // Search the book.
  //
  const book = resCache.getValue().data.find((b) => b.id === id);
  if (!book) {
    return result.setError(`Not found: ${id}`);
  }
  return result.setOk(book);
};

/**
 * The function adds a book to the array and writes the result to the file.
 */
export const bookCreate = async (config: TGithubConfig, book: TBook) => {
  const result = new Result<TBook[]>();

  //
  // Get the book list, from cache or from github.
  //
  const resCache = await cachedGetPath<TBook[]>(config, pathBooksGet());
  if (resCache.hasError()) {
    return result.setError(resCache);
  }

  //
  // Add the new book to the list
  //
  let books = resCache.getValue().data;
  if (books.find((b) => b.id === book.id)) {
    return result.setError('Id already exists!');
  }
  books.push(book);

  //
  // Write the new book list to github and update the cache.
  //
  const resPut = await cachePutPath<TBook[]>(
    config,
    pathBooksGet(),
    books,
    resCache.getValue().hash,
    `Adding book: ${book.id}`
  );
  if (resPut.hasError()) {
    return result.setError(resPut);
  }

  //
  // Get the hash value of the chapter list from github. This is void if the
  // file does not exist.
  //
  // TODO: Why github funtion is used here?
  const path = pathChaptersGet(book.id);
  const url = githubGetUrl(config.user, config.repo, path);
  const resHash = await githubGetHash(url, config.token);
  if (resHash.hasError()) {
    return result.setError(resHash);
  }

  //
  // Write the empty chapter list for the new file.
  //
  const resultChap = await cachePutPath<TChapter[]>(
    config,
    path,
    [],
    resHash.getValue(),
    'Creating chapters!'
  );
  if (resultChap.hasError()) {
    return result.setError(resultChap);
  }

  return result.setOk(resPut.getValue());
};

/**
 * The function updates a book to the array and writes the result to the file.
 */
export const bookUpdate = async (config: TGithubConfig, book: TBook) => {
  const result = new Result<TBook[]>();

  //
  // Get the book list, from cache or from github.
  //
  const resCache = await cachedGetPath<TBook[]>(config, pathBooksGet());
  if (resCache.hasError()) {
    return result.setError(resCache);
  }

  //
  // Remove the book from the list and add the new version.
  //
  let books = resCache.getValue().data;
  books = books.filter((b) => b.id !== book.id);
  books.push(book);

  //
  // Write the new book list to github and update the cache.
  //
  return await cachePutPath<TBook[]>(
    config,
    pathBooksGet(),
    books,
    resCache.getValue().hash,
    `Updating book: ${book.id}`
  );
};

/**
 * The function removes a book from the book list and deletes the coresponding
 * chapter list.
 */
export const bookDelete = async (config: TGithubConfig, id: string) => {
  const result = new Result<TBook[]>();

  //
  // Get the book list, from cache or from github.
  //
  const resCache = await cachedGetPath<TBook[]>(config, pathBooksGet());
  if (resCache.hasError()) {
    return result.setError(resCache);
  }

  //
  // Remove the book from the list
  //
  let books = resCache.getValue().data;
  const len = books.length;
  books = books.filter((b) => b.id !== id);
  if (len === books.length) {
    return result.setError(`Not found: ${id}`);
  }

  //
  // Write the new book list to github and update the cache.
  //
  const resPut = await cachePutPath<TBook[]>(
    config,
    pathBooksGet(),
    books,
    resCache.getValue().hash,
    `Deleting book ${id}`
  );
  if (resPut.hasError()) {
    return result.setError(resPut);
  }

  //
  // Delete the chapter list of the book from github and from cache.
  //
  const resDel = await cacheDeletePath(
    config,
    pathChaptersGet(id),
    `Deleting file.`
  );
  if (resDel.hasError()) {
    return result.setError(resDel);
  }

  return result.setOk(books);
};
