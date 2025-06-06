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
  return path.match(/books\/[^\/]+\/questions.[^\/]+.json$/);
};
