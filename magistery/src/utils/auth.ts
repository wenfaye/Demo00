import Cookies from 'js-cookie';

// App
const sidebarStatusKey = 'sidebar_status';
export const getSidebarStatus = () => Cookies.get(sidebarStatusKey);
export const setSidebarStatus = (sidebarStatus: string) => Cookies.set(sidebarStatusKey, sidebarStatus);

const languageKey = 'language';
export const getLanguage = () => Cookies.get(languageKey);
export const setLanguage = (language: string) => Cookies.set(languageKey, language);

const sizeKey = 'size';
export const getSize = () => Cookies.get(sizeKey);
export const setSize = (size: string) => Cookies.set(sizeKey, size);

// const TokenKey = 'PLAY_SESSION';
const TokenKey = 'linfu_token';

export const getToken = () => Cookies.get(TokenKey);

export const setToken = (token: string) => {
  Cookies.set(TokenKey, token);
};

export const removeToken = () => {
  Cookies.remove(TokenKey);
};

