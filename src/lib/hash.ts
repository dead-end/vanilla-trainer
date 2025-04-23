export const hashBookList = () => {
  return '#/books';
};

export const hashBookUpdate = (bookId: string) => {
  return `#/books/update/${bookId}`;
};

export const hashChapterList = (bookId: string) => {
  return `#/book/${bookId}/chapters`;
};

export const hashChapterCreate = (bookId: string) => {
  return `#/book/${bookId}/chapters/create`;
};

export const hashChapterUpdate = (bookId: string, chapterId: string) => {
  return `#/book/${bookId}/chapter/${chapterId}/update`;
};
