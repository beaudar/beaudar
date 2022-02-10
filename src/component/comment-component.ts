import {
  AvatarArgs,
  DisplayAssociations,
  ReactionTypes,
} from '../constant-data';
import { IssueComment } from '../type-declare';
import { processRenderedMarkdown, timeAgo } from '../utils';
import {
  getReactionsMenuHtml,
  getReactionHtml,
  getSignInToReactMenuHtml,
} from '../reactions';

export class CommentComponent {
  public readonly element: HTMLElement;

  constructor(
    public comment: IssueComment,
    private currentUser: string | null,
    locked: boolean,
  ) {
    const {
      user,
      html_url,
      created_at,
      body_html,
      author_association,
      reactions,
    } = comment;

    this.element = document.createElement('article');
    this.element.classList.add('timeline-comment');
    if (user.login === currentUser) {
      this.element.classList.add('current-user');
    }
    const association = DisplayAssociations[author_association];
    const reactionCount = ReactionTypes.reduce(
      (sum, id) => sum + reactions[id],
      0,
    );
    let headerReactionsMenu = '';
    let footerReactionsMenu = '';
    if (!locked) {
      if (currentUser) {
        headerReactionsMenu = getReactionsMenuHtml(
          comment.reactions.url,
          'right',
        );
        footerReactionsMenu = getReactionsMenuHtml(
          comment.reactions.url,
          'left',
        );
      } else {
        headerReactionsMenu = getSignInToReactMenuHtml('right');
        footerReactionsMenu = getSignInToReactMenuHtml('left');
      }
    }
    this.element.innerHTML = `
      <a class="avatar" href="${user.html_url}" target="_blank" title="@${
      user.login
    }">
        <img alt="@${user.login}" height="40" width="40"
              src="${user.avatar_url}${AvatarArgs}">
      </a>
      <div class="comment">
        <header class="comment-header">
          <span class="comment-meta">
            <a class="smallAvatar" href="${
              user.html_url
            }" target="_blank" title="@${user.login}">
              <img alt="@${user.login}" height="20" width="20" src="${
      user.avatar_url
    }${AvatarArgs}">
            </a>
            <a class="text-link comment-author" href="${
              user.html_url
            }" target="_blank"><strong>${user.login}</strong></a>
            评论<a class="text-link" href="${html_url}" target="_blank">${timeAgo(
      Date.now(),
      new Date(created_at),
    )}</a>
          </span>
          <div class="comment-actions">
            ${
              association
                ? `<span class="author-association-badge">${association}</span>`
                : ''
            }
            ${headerReactionsMenu}
          </div>
        </header>
        <div class="markdown-body markdown-body-scrollable">
          ${body_html}
        </div>
        ${
          reactionCount > 0
            ? `<div class="comment-footer" reaction-count="${reactionCount}" reaction-url="${
                reactions.url
              }">
              ${footerReactionsMenu}
              <form class="reaction-list BtnGroup" action="javascript:">
                ${ReactionTypes.map((id) =>
                  getReactionHtml(
                    reactions.url,
                    id,
                    !currentUser || locked,
                    reactions[id],
                  ),
                ).join('')}
              </form>
            </div>`
            : ''
        }
      </div>`;

    const markdownBody = this.element.querySelector('.markdown-body')!;
    const emailToggle = markdownBody.querySelector(
      '.email-hidden-toggle a',
    ) as HTMLAnchorElement;
    if (emailToggle) {
      const emailReply = markdownBody.querySelector(
        '.email-hidden-reply',
      ) as HTMLDivElement;
      emailToggle.onclick = (event) => {
        event.preventDefault();
        emailReply.classList.toggle('expanded');
      };
    }

    processRenderedMarkdown(markdownBody);
  }

  public setCurrentUser(currentUser: string | null) {
    if (this.currentUser === currentUser) {
      return;
    }
    this.currentUser = currentUser;

    if (this.comment.user.login === this.currentUser) {
      this.element.classList.add('current-user');
    } else {
      this.element.classList.remove('current-user');
    }
  }
}
