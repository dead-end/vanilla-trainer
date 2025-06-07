import { bookListing } from './model/book';
import { chapterListing } from './model/chapter';
import { questionGet } from './model/question';
import { pathQuestionsGet } from './path';
import { entryGetSearch } from './persist/entry';
import { TQuestion, TQuestionId, TSearch, TSearchResult } from './types';
import { errorGlobal } from './utils';

/**
 * The regex is used to remove special characters.
 */
const replaceRegex = new RegExp(/[.,;!?()'"/&+-]/, 'g');
const removeRegex = new RegExp(/[\*#=~]/, 'g');

const ignore = new Set([
  'der',
  'die',
  'das',
  'ein',
  'sich',
  'etwas',
  'etw',
  'hier',
  'instr',
  'nom',
  'она',
  'оно',
  'они',
]);

/**
 * The function creates a string with words without special characters which
 * will be used for searching.
 *
 * There are two kinds of special characters:
 * - formating characters: 'jo**ho'
 * - sentence characters: 'hallo, world' => ','
 * Formating characters are removed and sentence characters are replaced by a
 * space.
 */
export const searchIndexStr = (
  quest: string,
  answer: string,
  details: string | undefined
) => {
  let tmp = quest + ' ' + answer;
  if (details) {
    tmp = tmp + ' ' + details;
  }

  tmp = tmp.replaceAll(replaceRegex, ' ');
  tmp = tmp.replaceAll(removeRegex, '');
  let arr = tmp.split(/\s+/);

  const set = new Set<string>();

  arr.forEach((str) => {
    if (str.length > 2 && !ignore.has(str)) {
      set.add(str.toLowerCase());
    }
  });

  return Array.from(set).sort().join(' ');
};

/**
 * The functions is called with the content of a files with questions. It
 * creates the content for the corresponding index file for searching.
 */
export const searchIndex = (
  path: string,
  questions: TQuestion[],
  hash: string
) => {
  const strs = questions.map((q) =>
    searchIndexStr(q.quest, q.answer, q.details)
  );

  const result: TSearch = {
    path,
    strs,
    hash,
  };

  return result;
};

/**
 * The function checks if the search result contains the maximal of allowed
 * entries.
 */
export const searchIsMax = (result: TSearchResult[]) => {
  return result.length >= 10;
};

/**
 * The function searches a string in the search index json's.
 *
 * It iterates through the books and its chapters and gets the corresponding
 * index files. The string is searched in the index files.
 *
 * This approach ensures that the search index is complete (not necessary up to
 * date). If a question file is not in the cache it is loaded with its index
 * file.
 *
 * A more direct approach is to iterate through the store with the index files,
 * which assumes that the cache and the index files are complete.
 *
 * TODO: Implement this approach.
 */
export const searchDo = async (str: string) => {
  const result: TSearchResult[] = [];

  const books = await bookListing();

  for (const book of books) {
    const chapters = await chapterListing(book.id);

    for (const chapter of chapters) {
      const path = pathQuestionsGet(book.id, chapter.id);
      const search = await entryGetSearch(path);

      if (!search) {
        errorGlobal(`No search index for: ${path}`);
        continue;
      }

      for (let i = 0; i < search.strs.length; i++) {
        const strIdx = search.strs[i];
        if (strIdx.indexOf(str) >= 0) {
          const questId: TQuestionId = {
            bookId: book.id,
            chapterId: chapter.id,
            idx: i,
          };

          const quest = await questionGet(
            questId.bookId,
            questId.chapterId,
            questId.idx
          );

          result.push({
            questId,
            quest,
            strIdx,
          });

          if (searchIsMax(result)) {
            return result;
          }
        }
      }
    }
  }

  return result;
};
