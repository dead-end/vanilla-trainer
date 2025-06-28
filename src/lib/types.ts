export type TNav = {
  regex: RegExp;
  page: string;
};

export type TContentHash = {
  content: string;
  hash: string;
};

export type TCache<T> = {
  path: string;
  data: T;
  hash: string;
};

export type TSearch = {
  path: string;
  strs: string[];
  hash: string;
};

export type TSearchResult = {
  strIdx: string;
  questId: TQuestionId;
  quest: TQuestion;
};

export type TGithubConfig = {
  id: string;
  user: string;
  repo: string;
  token: string;
};

export type TBook = {
  id: string;
  title: string;
  description: string;
};

export type TChapter = {
  id: string;
  title: string;
};

export type TQuestion = {
  quest: string;
  answer: string;
  details?: string;
};

export type TField = {
  id: string;
  value: string;
};

export type TQuestionId = {
  bookId: string;
  chapterId: string;
  idx: number;
};

export type TQuestionProgress = {
  questionId: TQuestionId;
  progress: number;
};

export type TLession = {
  learning: TQuestionProgress[];
  learned: TQuestionProgress[];
  reverse: boolean;
};

export type TGithubListing = {
  path: string;
  type: 'dir' | 'string';
  sha: string;
};

export type TGithubListingResult = {
  error: string | undefined;
  listing: TGithubListing[];
};

export type TKeyValue = {
  key: string;
  value: string;
};
