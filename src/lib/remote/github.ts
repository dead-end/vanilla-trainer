import { TContentHash, TGithubListing } from '../types';
import Result from '../result';

/**
 * See: https://developer.mozilla.org/en-US/docs/Glossary/Base64
 */
const utf8_to_b64 = (str: string) => {
  return window.btoa(unescape(encodeURIComponent(str)));
};

/**
 * See: https://developer.mozilla.org/en-US/docs/Glossary/Base64
 */
const b64_to_utf8 = (str: string) => {
  return decodeURIComponent(escape(window.atob(str)));
};

/**
 * The function returns a message from a response of a request that returns an error.
 */
const getErrorFromResponse = async (response: Response) => {
  if (response.statusText) {
    return response.statusText;
  }
  return response.text();
};

/**
 * The following properties are required for a PUT request to create or update
 * a file. If the file exists the sha of the file is required.
 */
type TGithubPutBody = {
  content: string;
  message: string;
  sha?: string;
};

export const githubGetUrl = (user: string, repo: string, path: string) => {
  return `https://api.github.com/repos/${user}/${repo}/contents/${path}`;
};

/**
 * The function writes a string to a githup file. If the file exists, then a
 * hash is required. A token for an authentication is also required,
 */
export const githubWriteContent = async (
  url: string,
  content: string,
  hash: string | void,
  comment: string,
  token: string
) => {
  const result = new Result<string>();

  try {
    const body: TGithubPutBody = {
      content: utf8_to_b64(content),
      message: comment,
    };

    if (hash) {
      body.sha = hash;
    }

    const data = {
      method: 'PUT',
      headers: {
        Accept: 'application/vnd.github.v3+json',
        authorization: `token ${token}`,
      },
      body: JSON.stringify(body),
    };

    const response = await fetch(url, data);
    if (!response.ok) {
      const e = await getErrorFromResponse(response);
      return result.setError(`githubWriteContent - Url: ${url} Error: ${e}`);
    }

    const json = await response.json();
    console.log(json);
    return result.setOk(json.content.sha);
  } catch (e) {
    return result.setError(`githubWriteContent - Url: ${url} Error: ${e}`);
  }
};

/**
 * The function reads a file from github. A token can be given optionally.
 */
export const githubReadContent = async (url: string, token: string) => {
  const result = new Result<TContentHash>();

  try {
    const headers: any = {
      Accept: 'application/vnd.github.v3+json',
    };

    if (token) {
      headers.authorization = `token ${token}`;
    }

    const response = await fetch(url, headers);
    if (!response.ok) {
      const e = await getErrorFromResponse(response);
      return result.setError(
        `githubReadContent - Url: ${url} Read error: ${e}`
      );
    }

    const githubJson = await response.json();
    const content = b64_to_utf8(githubJson.content);
    // console.log('githubReadContent', content)

    return result.setOk({
      content: content,
      hash: githubJson.sha,
    });
  } catch (e) {
    return result.setError(`githubReadContent - Url: ${url} Error: ${e}`);
  }
};

/**
 * The function return the sha value for a file. Example:
 *
 * etag: W/"92cf13a1ecb655679f232302e0535d4ea689fb7f"
 * sha:     92cf13a1ecb655679f232302e0535d4ea689fb7f
 */
export const githubGetHash = async (url: string, token: string) => {
  const result = new Result<string | void>();

  try {
    const headers: any = {
      Accept: 'application/vnd.github.v3+json',
    };

    if (token) {
      headers.authorization = `token ${token}`;
    }

    const response = await fetch(url, { method: 'HEAD', headers: headers });
    //
    // File not found => no hash
    //
    if (response.status === 404) {
      return result.setOk();
    }

    if (!response.ok) {
      const e = await getErrorFromResponse(response);
      return result.setError(`githubGetHash - Url: ${url} Error: ${e}`);
    }

    const etag = response.headers.get('ETag');
    if (!etag) {
      console.log('githubGetHash - no ETag found', url);
      return result.setOk();
    }

    const start = etag.startsWith('W/') ? 3 : 1;
    const hash = etag.substring(start, etag.length - 1);

    console.log('githubGetHash:', hash);
    return result.setOk(hash);
  } catch (e) {
    return result.setError(`githubGetHash - Url: ${url} Error: ${e}`);
  }
};

/**
 * The function deletes a file from github.
 */
export const githubDelete = async (
  url: string,
  hash: string | void,
  comment: string,
  token: string
) => {
  const result = new Result<void>();

  try {
    const body = {
      message: comment,
      sha: hash,
    };

    const data = {
      method: 'DELETE',
      headers: {
        Accept: 'application/vnd.github.v3+json',
        authorization: `token ${token}`,
      },
      body: JSON.stringify(body),
    };

    const response = await fetch(url, data);
    if (!response.ok) {
      const e = await getErrorFromResponse(response);
      return result.setError(`githubDelete - Url: ${url} Error: ${e}`);
    }

    console.log(`githubDelete - Url: ${url}`);
    return result.setOk();
  } catch (e) {
    return result.setError(`githubDelete - Url: ${url} Error: ${e}`);
  }
};

/**
 * The function returns a directory listing. It is assumed that the path is a
 * directory.
 */
export const githubListing = async (url: string, token: string) => {
  const result = new Result<TGithubListing[]>();

  try {
    const headers: any = {
      Accept: 'application/vnd.github.v3+json',
    };

    if (token) {
      headers.authorization = `token ${token}`;
    }

    const response = await fetch(url, headers);
    if (!response.ok) {
      const e = await getErrorFromResponse(response);
      return result.setError(`githubListing - Url: ${url} Read error: ${e}`);
    }

    return result.setOk(await response.json());
  } catch (e) {
    return result.setError(`githubListing - Url: ${url} Error: ${e}`);
  }
};
