import { GlobalError } from '../GlobalError';
import { pathBooksGet, pathChaptersGet } from '../location/path';
import { jsonGet, jsonPut, jsonDelete } from '../remote/json';
import { TBook, TChapter } from '../types';
import { chapterListing } from './chapter';
import { githubConfigGet } from './githubConfig';

/**
 * The function reads the file with the book array.
 */
export const bookListing = async () => {
  const config = await githubConfigGet();

  const resCache = await jsonGet<TBook[]>(config, pathBooksGet());
  if (resCache.hasError) {
    throw new GlobalError(resCache.message);
  }

  return resCache.value.data;
};

/**
 * The function returns a book with a given id.
 */
export const bookGet = async (id: string) => {
  const config = await githubConfigGet();

  const resCache = await jsonGet<TBook[]>(config, pathBooksGet());
  if (resCache.hasError) {
    throw new GlobalError(resCache.message);
  }

  const book = resCache.value.data.find((b) => b.id === id);
  if (!book) {
    throw new GlobalError(`Book not found: ${id}`);
  }

  return book;
};

/**
 * The function adds a book to the array and writes the result to the file.
 */
export const bookCreate = async (book: TBook) => {
  const config = await githubConfigGet();

  const resCache = await jsonGet<TBook[]>(config, pathBooksGet());
  if (resCache.hasError) {
    throw new GlobalError(resCache.message);
  }

  const books = resCache.value.data;
  if (books.find((b) => b.id === book.id)) {
    throw new GlobalError(`Id already exists: ${book.id}`);
  }
  books.push(book);

  const resPut = await jsonPut<TBook[]>(
    config,
    pathBooksGet(),
    books,
    resCache.value.hash,
    `Adding book: ${book.id}`
  );
  if (resPut.hasError) {
    throw new GlobalError(resPut.message);
  }

  const path = pathChaptersGet(book.id);
  const resultChap = await jsonPut<TChapter[]>(
    config,
    path,
    [],
    undefined,
    'Creating chapters!'
  );
  if (resultChap.hasError) {
    throw new GlobalError(resultChap.message);
  }

  return resPut.value;
};

/**
 * The function updates a book to the array and writes the result to the file.
 */
export const bookUpdate = async (book: TBook) => {
  const config = await githubConfigGet();

  const resCache = await jsonGet<TBook[]>(config, pathBooksGet());
  if (resCache.hasError) {
    throw new GlobalError(resCache.message);
  }

  const books = resCache.value.data;
  const idx = books.findIndex((b) => b.id === book.id);
  if (idx < 0) {
    throw new GlobalError(`Book not found: ${book.id}`);
  }
  books[idx] = book;

  const resPut = await jsonPut<TBook[]>(
    config,
    pathBooksGet(),
    books,
    resCache.value.hash,
    `Updating book: ${book.id}`
  );
  if (resPut.hasError) {
    throw new GlobalError(resPut.message);
  }

  return resPut.value;
};

/**
 * The function removes a book from the book list and deletes the coresponding
 * chapter list.
 */
export const bookDelete = async (id: string) => {
  const chapters = await chapterListing(id);
  if (chapters.length > 0) {
    throw new GlobalError(`Book: ${id} has chapters: ${chapters.length}`);
  }

  const config = await githubConfigGet();

  const resCache = await jsonGet<TBook[]>(config, pathBooksGet());
  if (resCache.hasError) {
    throw new GlobalError(resCache.message);
  }

  let books = resCache.value.data;
  const len = books.length;
  books = books.filter((b) => b.id !== id);
  if (len === books.length) {
    throw new GlobalError(`Book not found: ${id}`);
  }

  const resPut = await jsonPut<TBook[]>(
    config,
    pathBooksGet(),
    books,
    resCache.value.hash,
    `Deleting book ${id}`
  );
  if (resPut.hasError) {
    throw new GlobalError(resPut.message);
  }

  const resDel = await jsonDelete<TChapter[]>(
    config,
    pathChaptersGet(id),
    `Deleting file for: ${id}`
  );
  if (resDel.hasError) {
    throw new GlobalError(resDel.message);
  }

  return books;
};
