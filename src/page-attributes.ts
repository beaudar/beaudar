import { deparam } from './deparam';
import repoRegex from './repo-regex';

function readPageAttributes() {
  const params = deparam(location.search.substring(1));

  let issueTerm: string | null = null;
  let issueNumber: number | null = null;
  if ('issue-term' in params) {
    issueTerm = params['issue-term'];
    if (issueTerm !== undefined) {
      if (issueTerm === '') {
        throw new Error('指定的 issue-term 不能为空');
      }
      if (['title', 'url', 'pathname', 'og:title'].indexOf(issueTerm) !== -1) {
        if (!params[issueTerm]) {
          throw new Error(`找不到 "${issueTerm}" 这个 issue 的信息`);
        }
        issueTerm = params[issueTerm];
      }
    }
  } else if ('issue-number' in params) {
    issueNumber = +params['issue-number'];
    if (issueNumber.toString(10) !== params['issue-number']) {
      throw new Error(`issue-number 无效，${params['issue-number']}`);
    }
  } else {
    throw new Error('"issue-term" 或 "issue-number" 是必须项');
  }

  if (!('repo' in params)) {
    throw new Error('仓库 "repo" 是必须项');
  }

  if (!('origin' in params)) {
    throw new Error('来源 "origin" 是必须项');
  }

  const matches = repoRegex.exec(params.repo);
  if (matches === null) {
    throw new Error(`无效的仓库 repo: "${params.repo}"`);
  }

  return {
    owner: matches[1],
    repo: matches[2],
    branch: params.branch || 'master',
    issueTerm,
    issueNumber,
    origin: params.origin,
    url: params.url,
    title: params.title,
    description: params.description,
    label: params.label,
    theme: params.theme || 'github-light',
    keepTheme: params['keep-theme'] || 'true',
    loading: params.loading || 'true',
    commentOrder: params['comment-order'] || 'asc',
    inputPosition: params['input-position'] || 'bottom',
    session: params.session,
  };
}

export const pageAttributes = readPageAttributes();
