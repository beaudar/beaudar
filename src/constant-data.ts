import { CommentAuthorAssociation, ReactionID } from './type-declare';

export const BEAUDAR_API = 'https://beaudar-api.lipk.org';

export const PAGE_SIZE = 10;

export const RepoRegex = /^([\w-_]+)\/([\w-_.]+)$/i;

export const GITHUB_API = 'https://api.github.com/';
export const GITHUB_ENCODING__HTML_JSON =
  'application/vnd.github.VERSION.html+json';
export const GITHUB_ENCODING__HTML = 'application/vnd.github.VERSION.html';
export const GITHUB_ENCODING__REST_V3 = 'application/vnd.github.v3+json';

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

export const AvatarArgs = '?v=3&s=88';

export const DisplayAssociations: Record<CommentAuthorAssociation, string> = {
  COLLABORATOR: '合作者',
  CONTRIBUTOR: '贡献者',
  MEMBER: '成员',
  OWNER: '作者',
  FIRST_TIME_CONTRIBUTOR: '初期贡献者',
  FIRST_TIMER: '沙发',
  NONE: '',
};

// 表达图标
export const BeaudarAvatarUrl = `data:image/png;base64,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 MDowMKZDaTcAAAAASUVORK5CYII=`;

export const NothingToPreview = '没有可预览的内容';

// 添加表情图标
export const AddReactionSVG = `<svg aria-hidden="true" viewBox="0 0 16 16" version="1.1" data-view-component="true" height="16" width="16" class="octicon octicon-smiley">
<path fill-rule="evenodd" d="M1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zM8 0a8 8 0 100 16A8 8 0 008 0zM5 8a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zM5.32 9.636a.75.75 0 011.038.175l.007.009c.103.118.22.222.35.31.264.178.683.37 1.285.37.602 0 1.02-.192 1.285-.371.13-.088.247-.192.35-.31l.007-.008a.75.75 0 111.222.87l-.614-.431c.614.43.614.431.613.431v.001l-.001.002-.002.003-.005.007-.014.019a1.984 1.984 0 01-.184.213c-.16.166-.338.316-.53.445-.63.418-1.37.638-2.127.629-.946 0-1.652-.308-2.126-.63a3.32 3.32 0 01-.715-.657l-.014-.02-.005-.006-.002-.003v-.002h-.001l.613-.432-.614.43a.75.75 0 01.183-1.044h.001z"></path>
</svg>`;
