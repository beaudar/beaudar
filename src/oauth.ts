import { BEAUDAR_API } from './beaudar-api';
import { removeLoadingElement } from './beaudar-loading';
import { param } from './deparam';
import { NewErrorElement } from './new-error-element';
import { pageAttributes } from './page-attributes';

export const token = { value: null as null | string };

// tslint:disable-next-line:variable-name
export function getLoginUrl(redirect_uri: string) {
  return `${BEAUDAR_API}/authorize?${param({ redirect_uri })}`;
}

export async function loadToken(): Promise<string | null> {
  if (token.value) {
    return token.value;
  }
  if (!pageAttributes.session) {
    return null;
  }
  const url = `${BEAUDAR_API}/token`;
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(pageAttributes.session),
  }).catch((err) => {
    const errorElement = new NewErrorElement();
    errorElement.createMsgElement(
      `Token 请求失败`,
      `网络断开或网络不稳定，检查网络连接，点击<code>刷新</code>重试。`,
      '#qtoken-请求失败',
      true,
    );

    removeLoadingElement();
    throw new Error(`token 请求失败，${err}`);
  });
  if (response.ok) {
    const t = await response.json();
    token.value = t;
    return t;
  }
  return null;
}
