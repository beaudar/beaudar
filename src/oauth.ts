import { BEAUDAR_API } from './beaudar-api';
import { param } from './deparam';
import { NewErrorElement } from './new-error-element';

export const token = { value: null as null | string };

// tslint:disable-next-line:variable-name
export function getLoginUrl(redirect_uri: string) {
  return `${BEAUDAR_API}/authorize?${param({ redirect_uri })}`;
}

export async function loadToken(): Promise<string | null> {
  if (token.value) {
    return token.value;
  }
  const url = `${BEAUDAR_API}/token`;
  const errorElement = new NewErrorElement();
  const response = await fetch(url, { method: 'POST', mode: 'cors', credentials: 'include' }).catch(err => {
    errorElement.createMsgElement(`token 请求失败。`);
    throw new Error(`token 请求失败，${err}`);
  });
  if (response.ok) {
    const t = await response.json();
    token.value = t;
    return t;
  }
  return null;
}
