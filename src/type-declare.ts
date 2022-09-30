export type ReactionID =
  | '+1'
  | '-1'
  | 'laugh'
  | 'hooray'
  | 'confused'
  | 'heart'
  | 'rocket'
  | 'eyes';

export interface IssueSearchResponse {
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

export interface FileContentsResponse {
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

export interface RepoConfig {
  origins: string[];
}

export interface ResizeMessage {
  type: 'resize';
  height: number;
}

export interface PageAttrs {
  owner: string;
  repo: string;
  branch: string;
  issueTerm: string | null;
  issueLabel: string | null;
  issueNumber: number | null;
  origin: string;
  url: string;
  title: string;
  description: string;
  label: string;
  theme: string;
  keepTheme: string;
  loading: string;
  commentOrder: string;
  inputPosition: string;
  session: string;
}

type TextExpanderChangeResult = {
  fragment: HTMLElement;
  matched: boolean;
};
export interface CustomEventTextExpanderChange extends Event {
  detail: {
    provide: (
      result: Promise<TextExpanderChangeResult> | TextExpanderChangeResult,
    ) => number;
    text: string;
    key: string;
  };
}

export interface CustomEventTextExpanderValue extends Event {
  detail: { item: HTMLElement; key: string; value: null | string };
}

export interface CreateMsgElement {
  header: string;
  body: string;
  helpHash: string;
  reload?: boolean;
}

export interface CreateIssue {
  issueTerm: string;
  documentUrl: string;
  title: string;
  description: string;
  label?: string;
  issueLabel: string | null;
}
