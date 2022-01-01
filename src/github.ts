import { token } from './oauth';
import { decodeBase64UTF8 } from './utils';
import {
  BEAUDAR_API,
  PAGE_SIZE,
  GITHUB_API,
  GITHUB_ENCODING__HTML_JSON,
  GITHUB_ENCODING__HTML,
  GITHUB_ENCODING__REACTIONS_PREVIEW,
} from './constant-data';
import { NewErrorComponent } from './component/new-error-component';
import {
  ReactionID,
  FileContentsResponse,
  IssueSearchResponse,
  IssueComment,
  Issue,
  User,
  Reaction,
  RepoConfig,
  PageAttrs,
} from './type-declare';
import { removeLoadingElement } from './beaudar-loading';

let owner: string;
let repo: string;
let branch: string;
let beaudarJson: RepoConfig;

export const setRepoContext = (context: {
  owner: string;
  repo: string;
  branch: string;
}) => {
  owner = context.owner;
  repo = context.repo;
  branch = context.branch;
};

const githubRequest = (relativeUrl: string, init?: RequestInit) => {
  init = init || {};
  init.mode = 'cors';
  init.cache = 'no-cache'; // force conditional request
  const request = new Request(GITHUB_API + relativeUrl, init);
  request.headers.set('Accept', GITHUB_ENCODING__REACTIONS_PREVIEW);
  if (token.value !== null) {
    request.headers.set('Authorization', `token ${token.value}`);
  }
  return request;
};

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

const processRateLimit = (response: Response) => {
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
    const errorElement = new NewErrorComponent();
    errorElement.createMsgElement(
      `获取评论数据失败`,
      `<p>超出了 ${apiType} 的速率限制，在 ${mins} 分钟后重置</p>`,
      '',
      true,
    );
  }
};

export const readRelNext = (response: Response) => {
  const link = response.headers.get('link');
  if (link === null) {
    return 0;
  }
  const match = /\?page=([2-9][0-9]*)>; rel="next"/.exec(link);
  if (match === null) {
    return 0;
  }
  return +match[1];
};

const githubFetch = (request: Request): Promise<Response> => {
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
};

export const loadJsonFile = <T>(path: string, html = false) => {
  const request = githubRequest(
    `repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
  );
  if (html) {
    request.headers.set('accept', GITHUB_ENCODING__HTML);
  }
  return githubFetch(request)
    .then<FileContentsResponse | string>((response) => {
      if (response.status === 404) {
        const errorElement = new NewErrorComponent();
        errorElement.createMsgElement(
          `缺少 "${path}" 配置`,
          `<p>在存储库 "${owner}/${repo}" 中，"${branch}" 分支下找不到 "${path}"。</p>`,
          '#q缺少-beaudarjson-配置-或-不允许-xxx-发布到-xxxxxx',
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
};

export const loadIssueByTerm = (term: string) => {
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
};

export const loadIssueByNumber = (issueNumber: number) => {
  const request = githubRequest(`repos/${owner}/${repo}/issues/${issueNumber}`);
  return githubFetch(request).then<Issue>((response) => {
    if (response === undefined || !response.ok) {
      throw new Error(`通过 Issue 编号提取评论时出错`);
    }
    return response.json();
  });
};

const commentsRequest = (issueNumber: number, page: number) => {
  const url = `repos/${owner}/${repo}/issues/${issueNumber}/comments?page=${page}&per_page=${PAGE_SIZE}`;
  const request = githubRequest(url);
  const accept = `${GITHUB_ENCODING__HTML_JSON},${GITHUB_ENCODING__REACTIONS_PREVIEW}`;
  request.headers.set('Accept', accept);
  return request;
};

export const loadCommentsPage = (
  issueNumber: number,
  page: number,
): Promise<IssueComment[]> => {
  const request = commentsRequest(issueNumber, page);
  return githubFetch(request).then((response) => {
    if (response === undefined || !response.ok) {
      throw new Error(`提取评论时出错。`);
    }
    return response.json();
  });
};

export const loadUser = (): Promise<User | null> => {
  if (token.value === null) {
    return Promise.resolve(null);
  }
  return githubFetch(githubRequest('user')).then((response) => {
    if (response.ok) {
      return response.json();
    }
    return null;
  });
};

export const createIssue = (
  issueTerm: string,
  documentUrl: string,
  title: string,
  description: string,
  label: string,
) => {
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
};

export const postComment = (issueNumber: number, markdown: string) => {
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
};

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

export const renderMarkdown = (text: string) => {
  const body = JSON.stringify({
    text,
    mode: 'gfm',
    context: `${owner}/${repo}`,
  });
  return githubFetch(githubRequest('markdown', { method: 'POST', body })).then(
    (response) => response.text(),
  );
};

export async function getRepoConfig(pageAttrs: PageAttrs) {
  const { origin, owner, repo } = pageAttrs;
  if (beaudarJson) {
    return;
  }
  beaudarJson = await loadJsonFile<RepoConfig>('beaudar.json').then((data) => {
    if (!Array.isArray(data.origins)) {
      data.origins = [];
    }
    return data;
  });
  if (beaudarJson.origins.indexOf(origin) === -1) {
    removeLoadingElement();
    const errorElement = new NewErrorComponent();
    errorElement.createMsgElement(
      `错误: <code>${origin}</code> 评论不允许发布到仓库 <code>${owner}/${repo}</code>`,
      `
    <p>&emsp;&emsp;请确认 <code>${owner}/${repo}</code> 是本站点评论的正确仓库。如果您拥有此仓库，
    <a href="https://github.com/${owner}/${repo}/edit/master/beaudar.json" target="_blank">
      <strong>添加或更新 beaudar.json</strong>
    </a>
    添加 <code>${origin}</code> 到来源列表。</p>
    <p>需要配置：</p>
    <pre><code>${JSON.stringify({ origins: [origin] }, null, 2)}</code></pre>
    `,
      '#q缺少-beaudarjson-配置-或-不允许-xxx-发布到-xxxxxx',
    );
    throw new Error(
      `评论发布被禁止，<code>${origin}</code> 评论不允许发布到仓库 <code>${owner}/${repo}</code>。`,
    );
  }
}
