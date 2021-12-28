import { ReactionID } from './type-declare';

export const BEAUDAR_API = 'https://api.lipk.org';

export const PAGE_SIZE = 10;

export const RepoRegex = /^([\w-_]+)\/([\w-_.]+)$/i;

export const GITHUB_API = 'https://api.github.com/';
export const GITHUB_ENCODING__HTML_JSON =
  'application/vnd.github.VERSION.html+json';
export const GITHUB_ENCODING__HTML = 'application/vnd.github.VERSION.html';
export const GITHUB_ENCODING__REACTIONS_PREVIEW =
  'application/vnd.github.squirrel-girl-preview';

export const PreferredThemeId = 'preferred-color-scheme';

export const PreferredTheme = window.matchMedia('(prefers-color-scheme: dark)')
  .matches
  ? 'github-dark'
  : 'github-light';

export const ReactionNames: Record<ReactionID, string> = {
  '+1': '赞同',
  '-1': '不赞同',
  laugh: '笑脸',
  hooray: '庆祝',
  confused: '困惑',
  heart: '喜欢',
  rocket: '火箭',
  eyes: '瞩目',
};

export const ReactionEmoji: Record<ReactionID, string> = {
  '+1': '👍',
  '-1': '👎',
  laugh: '️😄',
  hooray: '️🎉',
  confused: '😕',
  heart: '❤️',
  rocket: '🚀',
  eyes: '👀',
};

export const ReactionTypes: ReactionID[] = [
  '+1',
  '-1',
  'laugh',
  'hooray',
  'confused',
  'heart',
  'rocket',
  'eyes',
];

export const Thresholds = [
  1000,
  '秒',
  1000 * 60,
  '分钟',
  1000 * 60 * 60,
  '个小时',
  1000 * 60 * 60 * 24,
  '天',
  1000 * 60 * 60 * 24 * 7,
  '周',
  1000 * 60 * 60 * 24 * 27,
  '个月',
];

export const FormatOptions: Intl.DateTimeFormatOptions = {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
};
