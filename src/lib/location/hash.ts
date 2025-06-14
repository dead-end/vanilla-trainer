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

export const hashQuestionList = (bookId: string, chapterId: string) => {
  return `#/book/${bookId}/chapter/${chapterId}/questions`;
};

export const hashQuestionCreate = (bookId: string, chapterId: string) => {
  return `#/book/${bookId}/chapter/${chapterId}/questions/create`;
};

export const hashQuestionUpdate = (
  bookId: string,
  chapterId: string,
  idx: number
) => {
  return `#/book/${bookId}/chapter/${chapterId}/question/${idx}/update`;
};

export const hashLessionPrepare = (bookId: string, chapterId: string) => {
  return `#/book/${bookId}/chapter/${chapterId}/lession-prepare`;
};

export const hashLessionProcess = () => {
  return '#/lession-process';
};

export const hashHome = () => {
  return '#';
};

export const hashSearch = (searchStr?: string) => {
  if (searchStr) {
    return `#/search/${searchStr}`;
  }
  return '#/search';
};

export const hashCache = (path: string) => {
  return `#/cache/raw/${path}`;
};
