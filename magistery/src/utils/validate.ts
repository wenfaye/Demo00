export const isValidUsername = (str: string) => ['admin', 'editor'].indexOf(str.trim()) >= 0;

export const isExternal = (path: string) => /^(https?:|mailto:|tel:)/.test(path);

export const validateLowerCase = (str: string) => /^[a-z]+$/.test(str);

export const validateUpperCase = (str: string) => /^[A-Z]+$/.test(str);

export const validatAlphabets = (str: string) => /^[A-Za-z]+$/.test(str);

export const isArray = (arg: any) => {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]';
  }
  return Array.isArray(arg);
};

export const isEmptyObj = (obj: any) => {
  return Object.keys(obj).length === 0;
};

export const isValidURL = (url: string) => {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return reg.test(url);
};
