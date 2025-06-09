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
  const re = /books\/[^\/]+\/questions.[^\/]+.json$/;
  return re.test(path);
};
