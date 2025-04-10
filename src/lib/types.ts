export type TNav = {
  hash: string;
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
