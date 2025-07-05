import { GlobalError } from '../GlobalError';

export const pathRoot = () => {
  return 'books';
};

export const pathBooksGet = () => {
  return 'books/books.json';
};

export const pathChaptersGet = (bookId: string) => {
  return `books/${bookId}/chapters.json`;
};

export const pathQuestionsGet = (bookId: string, chapterId: string) => {
  return `books/${bookId}/questions.${chapterId}.json`;
};

export const pathIsQuestions = (path: string) => {
  const re = /^books\/[^\/]+\/questions.[^\/]+.json$/;
  return re.test(path);
};

export const pathIsChapters = (path: string) => {
  const re = /^books\/[^\/]+\/chapters.json$/;
  return re.test(path);
};

export const pathIsBooks = (path: string) => {
  return path === 'books/books.json';
};

export const pathIsValid = (path: string) => {
  return pathIsBooks(path) || pathIsChapters(path) || pathIsQuestions(path);
};

export const pathQuestionsId = (path: string) => {
  const re = /^books\/([^\/]+)\/questions.([^\/]+).json$/;
  const match = path.match(re);
  if (!match) {
    throw new GlobalError(`No matches for ${path}`);
  }
  return [match[1], match[2]];
};
