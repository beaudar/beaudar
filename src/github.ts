import { token } from './oauth';
import { decodeBase64UTF8 } from './encoding';
import { BEAUDAR_API } from './beaudar-api';
import { NewErrorElement } from './new-error-element';

const GITHUB_API = 'https://api.github.com/';
const GITHUB_ENCODING__HTML_JSON = 'application/vnd.github.VERSION.html+json';
const GITHUB_ENCODING__HTML = 'application/vnd.github.VERSION.html';
const GITHUB_ENCODING__REACTIONS_PREVIEW =
  'application/vnd.github.squirrel-girl-preview';

export const PAGE_SIZE = 25;

export type ReactionID =
  | '+1'
  | '-1'
  | 'laugh'
  | 'hooray'
  | 'confused'
  | 'heart'
  | 'rocket'
  | 'eyes';

export const reactionTypes: ReactionID[] = [
  '+1',
  '-1',
  'laugh',
  'hooray',
  'confused',
  'heart',
  'rocket',
  'eyes',
];

let owner: string;
let repo: string;
let branch: string;

export function setRepoContext(context: {
  owner: string;
  repo: string;
  branch: string;
}) {
  owner = context.owner;
  repo = context.repo;
  branch = context.branch;
}

function githubRequest(relativeUrl: string, init?: RequestInit) {
  init = init || {};
  init.mode = 'cors';
  init.cache = 'no-cache'; // force conditional request
  const request = new Request(GITHUB_API + relativeUrl, init);
  request.headers.set('Accept', GITHUB_ENCODING__REACTIONS_PREVIEW);
  if (token.value !== null) {
    request.headers.set('Authorization', `token ${token.value}`);
  }
  return request;
}

const rateLimit = {
  standard: {
    limit: Number.MAX_VALUE,
    remaining: Number.MAX_VALUE,
    reset: 0,
  },
  search: {
    limit: Number.MAX_VALUE,
    remaining: Number.MAX_VALUE,
    reset: 0,
  },
};

function processRateLimit(response: Response) {
  const limit = response.headers.get('X-RateLimit-Limit')!;
  const remaining = response.headers.get('X-RateLimit-Remaining')!;
  const reset = response.headers.get('X-RateLimit-Reset')!;

  const isSearch = /\/search\//.test(response.url);
  const rate = isSearch ? rateLimit.search : rateLimit.standard;

  rate.limit = +limit;
  rate.remaining = +remaining;
  rate.reset = +reset;

  if (response.status === 403 && rate.remaining === 0) {
    const resetDate = new Date(0);
    resetDate.setUTCSeconds(rate.reset);
    const mins = Math.round(
      (resetDate.getTime() - new Date().getTime()) / 1000 / 60,
    );
    const apiType = isSearch ? 'search API' : 'non-search APIs';
    // tslint:disable-next-line:no-console
    console.warn(
      `超出了 ${apiType} 的速率限制 ${apiType}，在 ${mins} 分钟后重置`,
    );
  }
}

export function readRelNext(response: Response) {
  const link = response.headers.get('link');
  if (link === null) {
    return 0;
  }
  const match = /\?page=([2-9][0-9]*)>; rel="next"/.exec(link);
  if (match === null) {
    return 0;
  }
  return +match[1];
}

function githubFetch(request: Request): Promise<Response> {
  return fetch(request).then((response) => {
    if (response.status === 401) {
      token.value = null;
    }
    if (response.status === 403) {
      response.json().then((data) => {
        if (data.message === 'Resource not accessible by integration') {
          window.dispatchEvent(new CustomEvent('not-installed'));
        }
      });
    }

    processRateLimit(response);

    if (
      request.method === 'GET' &&
      [401, 403].indexOf(response.status) !== -1 &&
      request.headers.has('Authorization')
    ) {
      request.headers.delete('Authorization');
      return githubFetch(request);
    }
    return response;
  });
}

export function loadJsonFile<T>(path: string, html = false) {
  const request = githubRequest(
    `repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
  );
  if (html) {
    request.headers.set('accept', GITHUB_ENCODING__HTML);
  }
  return githubFetch(request)
    .then<FileContentsResponse | string>((response) => {
      if (response.status === 404) {
        const errorElement = new NewErrorElement();
        errorElement.createMsgElement(
          `缺少 "${path}" 配置`,
          `<p>在存储库 "${owner}/${repo}" 中，"${branch}" 分支下找不到 "${path}"。</p>`,
        );
        throw new Error(
          `在存储库 "${owner}/${repo}" 中，"${branch}" 分支下找不到 "${path}"`,
        );
      }
      if (response === undefined || !response.ok) {
        throw new Error(`${path} 提取失败`);
      }
      return html ? response.text() : response.json();
    })
    .then<T>((file) => {
      if (html) {
        return file;
      }
      const { content } = file as FileContentsResponse;
      const decoded = decodeBase64UTF8(content);
      return JSON.parse(decoded);
    });
}

export function loadIssueByTerm(term: string) {
  const q = `"${term}" type:issue in:title repo:${owner}/${repo}`;
  const request = githubRequest(
    `search/issues?q=${encodeURIComponent(q)}&sort=created&order=asc`,
  );
  return githubFetch(request)
    .then<IssueSearchResponse>((response) => {
      if (response === undefined || !response.ok) {
        throw new Error('搜索 Issues 失败。');
      }
      return response.json();
    })
    .then((results) => {
      if (results.total_count === 0) {
        return null;
      }
      if (results.total_count > 1) {
        // tslint:disable-next-line:no-console
        console.warn(`匹配到多个问题 "${q}"`);
      }
      term = term.toLowerCase();
      for (const result of results.items) {
        if (result.title.toLowerCase().indexOf(term) !== -1) {
          return result;
        }
      }
      // tslint:disable-next-line:no-console
      console.warn(`Issue 搜索结果中没有与 "${term}" 标题匹配的评论。`);
      return null;
    });
}

export function loadIssueByNumber(issueNumber: number) {
  const request = githubRequest(`repos/${owner}/${repo}/issues/${issueNumber}`);
  return githubFetch(request).then<Issue>((response) => {
    if (response === undefined || !response.ok) {
      throw new Error(`通过 Issue 编号提取评论时出错`);
    }
    return response.json();
  });
}

function commentsRequest(issueNumber: number, page: number) {
  const url = `repos/${owner}/${repo}/issues/${issueNumber}/comments?page=${page}&per_page=${PAGE_SIZE}`;
  const request = githubRequest(url);
  const accept = `${GITHUB_ENCODING__HTML_JSON},${GITHUB_ENCODING__REACTIONS_PREVIEW}`;
  request.headers.set('Accept', accept);
  return request;
}

export function loadCommentsPage(
  issueNumber: number,
  page: number,
): Promise<IssueComment[]> {
  const request = commentsRequest(issueNumber, page);
  return githubFetch(request).then((response) => {
    if (response === undefined || !response.ok) {
      throw new Error(`提取评论时出错。`);
    }
    return response.json();
  });
}

export function loadUser(): Promise<User | null> {
  if (token.value === null) {
    return Promise.resolve(null);
  }
  return githubFetch(githubRequest('user')).then((response) => {
    if (response.ok) {
      return response.json();
    }
    return null;
  });
}

export function createIssue(
  issueTerm: string,
  documentUrl: string,
  title: string,
  description: string,
  label: string,
) {
  const url = `${BEAUDAR_API}/repos/${owner}/${repo}/issues${
    label ? `?label=${encodeURIComponent(label)}` : ''
  }`;
  const request = new Request(url, {
    method: 'POST',
    body: JSON.stringify({
      title: issueTerm,
      body: `# ${title}\n\n${description}\n\n[${documentUrl}](${documentUrl})`,
    }),
  });
  request.headers.set('Accept', GITHUB_ENCODING__REACTIONS_PREVIEW);
  request.headers.set('Authorization', `token ${token.value}`);
  return fetch(request).then<Issue>((response) => {
    if (response === undefined || !response.ok) {
      throw new Error(`创建评论 issue 时出错`);
    }
    return response.json();
  });
}

export function postComment(issueNumber: number, markdown: string) {
  const url = `repos/${owner}/${repo}/issues/${issueNumber}/comments`;
  const body = JSON.stringify({ body: markdown });
  const request = githubRequest(url, { method: 'POST', body });
  const accept = `${GITHUB_ENCODING__HTML_JSON},${GITHUB_ENCODING__REACTIONS_PREVIEW}`;
  request.headers.set('Accept', accept);
  return githubFetch(request).then<IssueComment>((response) => {
    if (response === undefined || !response.ok) {
      throw new Error(`发布评论时出错`);
    }
    return response.json();
  });
}

export async function toggleReaction(url: string, content: ReactionID) {
  url = url.replace(GITHUB_API, '');
  // We don't know if the reaction exists or not. Attempt to create it. If the GitHub
  // API responds that the reaction already exists, delete it.
  const body = JSON.stringify({ content });
  const postRequest = githubRequest(url, { method: 'POST', body });
  postRequest.headers.set('Accept', GITHUB_ENCODING__REACTIONS_PREVIEW);
  const response = await githubFetch(postRequest);
  const reaction: Reaction = response.ok ? await response.json() : null;
  if (response.status === 201) {
    // reaction created.
    return { reaction, deleted: false };
  }
  if (response.status !== 200) {
    throw new Error('预期的“ 201 响应已创建”或“ 200 响应已存在”');
  }
  // reaction already exists... delete.
  const deleteRequest = githubRequest(`reactions/${reaction.id}`, {
    method: 'DELETE',
  });
  deleteRequest.headers.set('Accept', GITHUB_ENCODING__REACTIONS_PREVIEW);
  await githubFetch(deleteRequest);
  return { reaction, deleted: true };
}

export function renderMarkdown(text: string) {
  const body = JSON.stringify({
    text,
    mode: 'gfm',
    context: `${owner}/${repo}`,
  });
  return githubFetch(githubRequest('markdown', { method: 'POST', body })).then(
    (response) => response.text(),
  );
}

interface IssueSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: Issue[];
}

export interface User {
  login: string;
  id: number;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
}

export type CommentAuthorAssociation =
  | 'COLLABORATOR'
  | 'CONTRIBUTOR'
  | 'FIRST_TIMER'
  | 'FIRST_TIME_CONTRIBUTOR'
  | 'MEMBER'
  | 'NONE'
  | 'OWNER';

export interface Reactions {
  url: string;
  total_count: number;
  '+1': number;
  '-1': number;
  laugh: number;
  hooray: number;
  confused: number;
  heart: number;
  rocket: number;
  eyes: number;
}

export interface Reaction {
  id: number;
  user: User;
  content: ReactionID;
  created_at: string;
}

export interface Issue {
  url: string;
  repository_url: string;
  labels_url: string;
  comments_url: string;
  events_url: string;
  html_url: string;
  id: number;
  number: number;
  title: string;
  user: User;
  locked: boolean;
  labels: {
    url: string;
    name: string;
    color: string;
  }[];
  state: string;
  assignee: null; // todo,
  milestone: null; // todo,
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at: null; // todo,
  pull_request: {
    html_url: null; // todo,
    diff_url: null; // todo,
    patch_url: null; // todo
  };
  body: string;
  score: number;
  reactions: Reactions;
  author_association: CommentAuthorAssociation;
}

interface FileContentsResponse {
  type: string;
  encoding: string;
  size: number;
  name: string;
  path: string;
  content: string;
  sha: string;
  url: string;
  git_url: string;
  html_url: string;
  download_url: string;
}

export interface IssueComment {
  id: number;
  url: string;
  html_url: string;
  body_html: string;
  user: User;
  created_at: string;
  updated_at: string;
  author_association: CommentAuthorAssociation;
  reactions: Reactions;
}

/*
query IssueComments($owner: String!, $repo: String!, $issueQuery: String!) {
  search(query: $issueQuery, type: ISSUE, first: 1) {
    issueCount
    edges {
      node {
        ... on Issue {
          id
          title,
          comments(first: 100) {
            totalCount
            edges {
              node {
                id,
                createdAt,
                bodyHTML,
                author {
                  avatarUrl,
                  login
                }
              }
            }
          }
        }
      }
    }
  }

  rateLimit {
    cost
    limit
    remaining
    resetAt
  }

  repository(owner: $owner, name: $repo) {
    object(expression: "master:beaudar.json") {
      ... on Blob {
        text
      }
    }
  }
}

{
  "issueQuery": "user:zsdycs repo:beaudar-demo debug",
  "owner": "zsdycs",
  "repo": "beaudar-demo"
}
*/
