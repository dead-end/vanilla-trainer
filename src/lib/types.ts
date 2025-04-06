export type TNav = {
  hash: string;
  label: string;
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
