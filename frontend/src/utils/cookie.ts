export function getCookie(name: string): string | undefined {
  const matches = document.cookie.match(
    new RegExp(
      '(?:^|; )' +
        // eslint-disable-next-line no-useless-escape
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
        '=([^;]*)',
    ),
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function setCookie(
  name: string,
  value: string,
  props: { [key: string]: string | number | Date | boolean } = {},
) {
  props = {
    path: '/',
    ...props,
  };

  let exp = props.expires;
  if (exp && typeof exp === 'number') {
    const d = new Date();
    d.setTime(d.getTime() + exp * 1000);
    exp = props.expires = d;
  }

  if (exp && exp instanceof Date) {
    props.expires = exp.toUTCString();
  }
  value = encodeURIComponent(value);
  let updatedCookie = name + '=' + value;
  for (const propName in props) {
    updatedCookie += '; ' + propName;
    const propValue = props[propName];
    if (propValue !== true) {
      updatedCookie += '=' + propValue;
    }
  }
  document.cookie = updatedCookie;
}

export function deleteCookie(name: string) {
  setCookie(name, '', { expires: -1 });
}

export function setTokens(refreshToken: string, accessToken: string) {
  localStorage.setItem('refreshToken', String(refreshToken));

  setCookie('accessToken', String(accessToken), {
    httpOnly: true, // Защита от доступа через JavaScript
    secure: true, // Только через HTTPS-соединение
    sameSite: 'strict', // Защита от межсайтовых запросов
    expires: new Date(Date.now() + 3600000), // Срок действия - 1 час
  });
}

export function deleteTokens() {
  localStorage.removeItem('refreshToken');

  deleteCookie('accessToken');
}
