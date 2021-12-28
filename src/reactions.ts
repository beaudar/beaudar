import { toggleReaction } from './github';
import { getLoginUrl } from './oauth';
import { readPageAttributes } from './utils';
import { scheduleMeasure } from './measure';
import { ReactionID } from './type-declare';
import { reactionTypes, reactionNames, reactionEmoji } from './constant-data';

const pageAttributes = readPageAttributes();

export const getReactionHtml = (
  url: string,
  reaction: ReactionID,
  disabled: boolean,
  count: number,
) => {
  return `
  <button
    reaction
    type="submit"
    action="javascript:"
    formaction="${url}"
    class="btn BtnGroup-item btn-outline reaction-button"
    value="${reaction}"
    aria-label="Toggle ${reactionNames[reaction]} reaction"
    reaction-count="${count}"
    ${disabled ? 'disabled' : ''}>
    ${reactionEmoji[reaction]}
  </button>`;
};

export const enableReactions = (authenticated: boolean) => {
  const submitReaction = async (event: Event) => {
    const button =
      event.target instanceof HTMLElement && event.target.closest('button');
    if (!button) {
      return;
    }
    if (!button.hasAttribute('reaction')) {
      return;
    }
    event.preventDefault();
    if (!authenticated) {
      return;
    }
    button.disabled = true;
    const parentMenu = button.closest('details');
    if (parentMenu) {
      parentMenu.open = false;
    }
    const url = button.formAction;
    const id = button.value as ReactionID;
    const { deleted } = await toggleReaction(url, id);
    const selector = `button[reaction][formaction="${url}"][value="${id}"],[reaction-count][reaction-url="${url}"]`;
    const elements = Array.from(document.querySelectorAll(selector));
    const delta = deleted ? -1 : 1;
    for (const element of elements) {
      element.setAttribute(
        'reaction-count',
        (
          parseInt(element.getAttribute('reaction-count')!, 10) + delta
        ).toString(),
      );
    }
    button.disabled = false;
    scheduleMeasure();
  };
  addEventListener('click', submitReaction, true);
};

export const getReactionsMenuHtml = (
  url: string,
  align: 'center' | 'right' | 'left',
) => {
  let position = '';
  let alignmentClass = '';
  if (align === 'center') {
    position = 'left: 50%;top: 75%;transform: translateX(-50%)';
  } else if (align === 'right') {
    alignmentClass = 'Popover-message--top-right';
    position = 'right:11px';
  } else if (align === 'left') {
    alignmentClass = 'Popover-message--bottom-left';
    position = 'transform: translateX(-1%) translateY(-133%)';
  }
  const getButtonAndSpan = (id: ReactionID) =>
    getReactionHtml(url, id, false, 0) +
    `<span class="reaction-name" aria-hidden="true">${reactionNames[id]}</span>`;
  return `
  <details class="details-overlay details-popover reactions-popover">
    <summary ${
      align === 'center' ? 'tabindex="-1"' : ''
    }>${addReactionSvgs}</summary>
    <div class="Popover" style="${position}">
      <form class="Popover-message ${alignmentClass} box-shadow-large" action="javascript:">
        <span class="reaction-name">选择你的表情符号</span>
        <div class="BtnGroup">
          ${reactionTypes.slice(0, 4).map(getButtonAndSpan).join('')}
        </div>
        <div class="BtnGroup">
          ${reactionTypes.slice(4).map(getButtonAndSpan).join('')}
        </div>
      </form>
    </div>
  </details>`;
};

export const getSignInToReactMenuHtml = (
  align: 'center' | 'right' | 'left',
) => {
  let position = '';
  let alignmentClass = '';
  if (align === 'center') {
    position = 'left: 50%;top: 75%;transform: translateX(-50%)';
  } else if (align === 'right') {
    alignmentClass = 'Popover-message--top-right';
    position = 'right:11px';
  } else if (align === 'left') {
    alignmentClass = 'Popover-message--bottom-left';
    position = 'transform: translateX(-1%) translateY(-133%)';
  }
  return `
  <details class="details-overlay details-popover reactions-popover">
    <summary aria-label="Reactions Menu">${addReactionSvgs}</summary>
    <div class="Popover" style="${position}">
      <div class="Popover-message ${alignmentClass} box-shadow-large" style="padding: 16px">
        <span><a href="${getLoginUrl(
          pageAttributes.url,
        )}" target="_top">登录</a> 后你可以添加表情符号</span>
      </div>
    </div>
  </details>`;
};

const addReactionSvgs = `<svg aria-hidden="true" viewBox="0 0 16 16" version="1.1" data-view-component="true" height="16" width="16" class="octicon octicon-smiley">
<path fill-rule="evenodd" d="M1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zM8 0a8 8 0 100 16A8 8 0 008 0zM5 8a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zM5.32 9.636a.75.75 0 011.038.175l.007.009c.103.118.22.222.35.31.264.178.683.37 1.285.37.602 0 1.02-.192 1.285-.371.13-.088.247-.192.35-.31l.007-.008a.75.75 0 111.222.87l-.614-.431c.614.43.614.431.613.431v.001l-.001.002-.002.003-.005.007-.014.019a1.984 1.984 0 01-.184.213c-.16.166-.338.316-.53.445-.63.418-1.37.638-2.127.629-.946 0-1.652-.308-2.126-.63a3.32 3.32 0 01-.715-.657l-.014-.02-.005-.006-.002-.003v-.002h-.001l.613-.432-.614.43a.75.75 0 01.183-1.044h.001z"></path>
</svg>`;
