import { ReactionID } from './type-declare';

export const BEAUDAR_API = 'https://api.lipk.org';

export const PAGE_SIZE = 10;

export const repoRegex = /^([\w-_]+)\/([\w-_.]+)$/i;

export const preferredThemeId = 'preferred-color-scheme';

export const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)')
  .matches
  ? 'github-dark'
  : 'github-light';

export const reactionNames: Record<ReactionID, string> = {
  '+1': '赞同',
  '-1': '不赞同',
  laugh: '笑脸',
  hooray: '庆祝',
  confused: '困惑',
  heart: '喜欢',
  rocket: '火箭',
  eyes: '瞩目',
};

export const reactionEmoji: Record<ReactionID, string> = {
  '+1': '👍',
  '-1': '👎',
  laugh: '️😄',
  hooray: '️🎉',
  confused: '😕',
  heart: '❤️',
  rocket: '🚀',
  eyes: '👀',
};

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

export const thresholds = [
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

export const formatOptions: Intl.DateTimeFormatOptions = {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
};
