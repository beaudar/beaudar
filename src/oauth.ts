import { BEAUDAR_API } from './constant-data';
import { removeLoadingElement } from './beaudar-loading';
import { readPageAttributes } from './utils';
import { NewErrorComponent } from './component/new-error-component';

export const token = { value: null as null | string };

const pageAttrs = readPageAttributes(location);

export const getLoginUrl = (redirect_uri: string) => {
  return `${BEAUDAR_API}/authorize?${new URLSearchParams({ redirect_uri })}`;
};

export async function loadToken() {
  const url = `${BEAUDAR_API}/token`;
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(pageAttrs.session),
  }).catch((err) => {
    const errorElement = new NewErrorComponent();
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
  }
}
