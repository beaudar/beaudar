import { toggleReaction } from './github';
import { getLoginUrl } from './oauth';
import { scheduleMeasure } from './measure';
import { ReactionID } from './type-declare';
import {
  ReactionTypes,
  ReactionNames,
  ReactionEmoji,
  AddReactionSVG,
} from './constant-data';
import { readPageAttributes } from './utils';

const pageAttrs = readPageAttributes(location);

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
    aria-label="Toggle ${ReactionNames[reaction]} reaction"
    reaction-count="${count}"
    ${disabled ? 'disabled' : ''}>
    ${ReactionEmoji[reaction]}
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
    `<span class="reaction-name" aria-hidden="true">${ReactionNames[id]}</span>`;
  return `
  <details class="details-overlay details-popover reactions-popover">
    <summary ${
      align === 'center' ? 'tabindex="-1"' : ''
    }>${AddReactionSVG}</summary>
    <div class="Popover" style="${position}">
      <form class="Popover-message ${alignmentClass} box-shadow-large" action="javascript:">
        <span class="reaction-name">选择你的表情符号</span>
        <div class="BtnGroup">
          ${ReactionTypes.slice(0, 4).map(getButtonAndSpan).join('')}
        </div>
        <div class="BtnGroup">
          ${ReactionTypes.slice(4).map(getButtonAndSpan).join('')}
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
    <summary aria-label="Reactions Menu">${AddReactionSVG}</summary>
    <div class="Popover" style="${position}">
      <div class="Popover-message ${alignmentClass} box-shadow-large" style="padding: 16px">
        <span><a href="${getLoginUrl(
          pageAttrs.url,
        )}" target="_top">登录</a> 后你可以添加表情符号</span>
      </div>
    </div>
  </details>`;
};
