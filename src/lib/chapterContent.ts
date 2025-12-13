import { questionListing } from './model/question';
import { TChapterContent, TQuestionId } from './types';

/**
 * The function returns the number of questions for the array with the chapter
 * contents.
 */
export const chapterContentsLen = (chapterContents: TChapterContent[]) => {
  return chapterContents.reduce((a, c) => a + c.questions.length, 0);
};

/**
 * The function reads the questions for the selected chapters of the book.
 */
export const chapterContentsGet = async (
  bookId: string,
  chapterIds: string[]
) => {
  const contents: TChapterContent[] = [];

  for (const chapterId of chapterIds) {
    contents.push({
      bookId,
      chapterId,
      questions: await questionListing(bookId, chapterId),
    });
  }

  return contents;
};

/**
 * The functions converts an array of TChapterContent to an array of
 * TQuestionId.
 */
export const chapterContentsGetIds = (chapterContents: TChapterContent[]) => {
  const result: TQuestionId[] = [];

  for (const chapterContent of chapterContents) {
    chapterContent.questions.forEach((_q, i) =>
      result.push({
        bookId: chapterContent.bookId,
        chapterId: chapterContent.chapterId,
        idx: i,
      })
    );
  }

  return result;
};
