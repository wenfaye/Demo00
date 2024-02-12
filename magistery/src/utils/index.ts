import dayjs from 'dayjs';
import html2canvas from 'html2canvas';

export const parseDateTime = (s: string) : (dayjs.Dayjs|string) => {
  const RFC3339 = 'YYYY-MM-DDTHH:mm:ssZ';
  const RFC3339Nano = 'YYYY-MM-DDTHH:mm:ss.SSSSSSZ';

  const parse = (dateString: string, layer: string) : dayjs.Dayjs => {
    return dayjs(dateString, layer);
  };

  try {
    const date = dayjs(s);
    if (date.isValid()) {
      return date;
    }
  } catch (e) {
    console.log(e);
  }

  try {
    const date = parse(s, RFC3339Nano);
    if (date.isValid()) {
      return date;
    }
  } catch (e) {
    console.log(e);
  }

  let idx = s.indexOf('.');
  if (idx > 0) {
    s = s.substring(0, idx);
    const substr = s.substring(idx);
    idx = substr.indexOf('Z');
    if (idx > 0) {
      s = s + substr.substring(idx);
    } else {
      idx = substr.indexOf('+');
      if (idx > 0) {
        s = s + substr.substring(idx);
      } else {
        idx = substr.indexOf('-');
        if (idx > 0) {
          s = s + substr.substring(idx);
        }
      }
    }
  }

  try {
    const date = parse(s, RFC3339);
    if (date.isValid()) {
      return date;
    }
  } catch (e) {
    console.log(e);
  }

  try {
    const date = dayjs(s);
    if (date.isValid()) {
      return date;
    }
  } catch (e) {
    console.log(e);
  }
  return s;
};

export const dateFormat = (row: any, column: any) : any => {
  const date = row[column.property];
  return dateStringFormat(date);
};

export const dateStringFormat = (timeString: string) : any => {
  if (!timeString) {
    return '';
  }
  if (timeString == '0001-01-01T00:00:00Z') {
    return '';
  }
  const s = parseDateTime(timeString);
  if (s as dayjs.Dayjs) {
    console.log(s);
    return (s as dayjs.Dayjs).format('YYYY-MM-DD HH:mm:ss');
  }
  return s;
};

export function parseTime(time: any, cFormat?: string): string|null {
  if (arguments.length === 0) {
    return null;
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
  let date;
  if (typeof time === 'object') {
    date = time;
  } else {
    if ((typeof time === 'string')) {
      time = parseInt(time);
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time);
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(/-/gm, '/');
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj: { [ id: string ]: number } = {
    '{y}': date.getFullYear(),
    '{m}': date.getMonth() + 1,
    '{d}': date.getDate(),
    '{h}': date.getHours(),
    '{i}': date.getMinutes(),
    '{s}': date.getSeconds(),
    '{a}': date.getDay(),
  };
  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (key: string): string => {
    const value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value];
    }
    if (value < 10) {
      return '0' + value;
    }
    if (!value) {
      return '0';
    }
    return value.toString();
  });
  return timeStr;
}

export function formatTime(time: number, option: any): string|null {
  time = +time * 1000;
  const d = new Date(time);
  const now = Date.now();

  const diff = (now - d.getTime()) / 1000;

  if (diff < 30) {
    return '刚刚';
  } else if (diff < 3600) {
    // less 1 hour;
    return Math.ceil(diff / 60) + '分钟前';
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前';
  } else if (diff < 3600 * 24 * 2) {
    return '1天前';
  }
  if (option) {
    return parseTime(time, option);
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    );
  }
}

// 格式化时间
// export function getQueryObject(url: string) {
//   url = url == null ? window.location.href : url
//   const search = url.substring(url.lastIndexOf('?') + 1)
//   const obj = {}
//   const reg = /([^?&=]+)=([^?&=]*)/g
//   search.replace(reg, (rs, $1, $2) => {
//     const name = decodeURIComponent($1)
//     let val = decodeURIComponent($2)
//     val = String(val)
//     obj[name] = val
//     return rs
//   })
//   return obj
// }

/**
 *get getByteLen
 * @param {Sting} val input value
 * @returns {number} output value
 */
export function getByteLen(val: string): number {
  /* eslint no-control-regex: 0 */
  let len = 0;
  for (let i = 0; i < val.length; i++) {
    if (val[i].match(/[^\x00-\xff]/gi) != null) {
      len += 1;
    } else {
      len += 0.5;
    }
  }
  return Math.floor(len);
}

export function cleanArray(actual: any[]): any[] {
  const newArray = [];
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
}

export function param(json: object|null): string {
  if (!json) return '';
  return cleanArray(
    Object.keys(json).map((key: string) => {
      if ((json as { [ id: string ]: any })[key]) return '';
      return encodeURIComponent(key) + '=' + encodeURIComponent((json as { [ id: string ]: any })[key]);
    }),
  ).join('&');
}

export function param2Obj(url: string): object {
  const search = url.split('?')[1];
  if (!search) {
    return {};
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"') +
      '"}',
  );
}

export function html2Text(val: string): string {
  const div = document.createElement('div');
  div.innerHTML = val;
  return div.textContent || div.innerText;
}

export function objectMerge(target: { [key: string]: any }, source: { [key: string]: any }): {[key: string]: any } {
  /* Merges two  objects,
     giving the last one precedence */

  if (!target) {
    target = {};
  }

  if (Array.isArray(source)) {
    return source.slice();
  }
  Object.keys(source).forEach((property: any) => {
    const sourceProperty = source[property];
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property] as {[key: string]: any }, sourceProperty);
    } else {
      target[property] = sourceProperty;
    }
  });
  return target;
}

// Check if an element has a class
export const hasClass = (ele: HTMLElement, className: string) => {
  return !!ele.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
};

// Add class to element
export const addClass = (ele: HTMLElement, className: string) => {
  if (!hasClass(ele, className)) ele.className += ' ' + className;
};

// Remove class from element
export const removeClass = (ele: HTMLElement, className: string) => {
  if (hasClass(ele, className)) {
    const reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
    ele.className = ele.className.replace(reg, ' ');
  }
};

export function toggleClass(element: HTMLElement, className: string) {
  if (!element || !className) {
    return;
  }
  let classString = element.className;
  const nameIndex = classString.indexOf(className);
  if (nameIndex === -1) {
    classString += '' + className;
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length);
  }
  element.className = classString;
}

export const pickerOptions = [
  {
    text: '今天',
    onClick(picker: any) {
      const end = new Date();
      const start = new Date(new Date().toDateString());
      end.setTime(start.getTime());
      picker.$emit('pick', [start, end]);
    },
  },
  {
    text: '最近一周',
    onClick(picker: any) {
      const end = new Date(new Date().toDateString());
      const start = new Date();
      start.setTime(end.getTime() - 3600 * 1000 * 24 * 7);
      picker.$emit('pick', [start, end]);
    },
  },
  {
    text: '最近一个月',
    onClick(picker: any) {
      const end = new Date(new Date().toDateString());
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      picker.$emit('pick', [start, end]);
    },
  },
  {
    text: '最近三个月',
    onClick(picker: any) {
      const end = new Date(new Date().toDateString());
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      picker.$emit('pick', [start, end]);
    },
  },
];

export function getTime(type: string): Date {
  if (type === 'start') {
    return new Date(Date.now() - 3600 * 1000 * 24 * 90);
  } else {
    return new Date(new Date().toDateString());
  }
}

export function debounce(func: Function, wait: number, immediate?: boolean) {
  let timeout: any;
  let contextArgs: any[];
  let context: any;
  let timestamp: number;
  let result: any;

  const later = function() {
    // 据上一次触发时间间隔
    const last = Date.now() - timestamp;

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, contextArgs);
        if (!timeout) {
          context = null;
          contextArgs = [];
        }
      }
    }
  };

  return function(this: any, ...args: any[]) {
    context = this;
    contextArgs = args;

    timestamp = +new Date();
    const callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);

      context = null;
      contextArgs = [];
    }

    return result;
  };
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 */
export function deepClone(source: any): any {
  if (!source) {
    throw new Error('error arguments: shallowClone');
  }
  const targetObj = source.constructor === Array ? [] : {};
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      (<any>targetObj)[keys] = deepClone(source[keys]);
    } else {
      (<any>targetObj)[keys] = source[keys];
    }
  });
  return targetObj;
}

export function uniqueArr(arr: any) {
  return Array.from(new Set(arr));
}

export function createUniqueString(): string {
  const timestamp = +new Date() + '';
  const randomNum = (1 + Math.random()) * 65536;
  return (+(randomNum + timestamp)).toString(32);
}

export function readID(url: string): any {
  url = url.trim();
  if (url.endsWith('/')) {
    url = url.substring(0, url.length - 1);
  }
  const idx = url.lastIndexOf('/');
  const idWithParams = url.substring(idx + 1);
  const questIdx = idWithParams.indexOf('?');
  if (questIdx >= 0) {
    return idWithParams.substring(0, questIdx);
  }
  return idWithParams;
}

export const intToString = (a: any) => parseInt(a).toFixed(0);

export const toHelp = (pa: string): string => {
  const urlPrefix = (window as any).urlPrefix;

  if (!pa.startsWith('/')) {
    pa = '/' + pa;
  }
  if (urlPrefix.endsWith('/')) {
    return urlPrefix + 'internal/help/#' + pa;
  } else {
    return urlPrefix + '/internal/help/#' + pa;
  }
};

export const genImage = (r: any, id: any) => {
  html2canvas(r, {
    logging: false,
    allowTaint: true,
    scale: window.devicePixelRatio,
    // width: shareContent.clientWidth, //dom 原始宽度
    // height: shareContent.clientHeight,
    scrollY: 0,
    scrollX: 0,
    useCORS: true,
    backgroundColor: '#ffffff',
  }).then(function(canvas) {
    // console.log(canvas);
    const imgUrl = canvas.toDataURL('image/png');
    const tempLink = document.createElement('a');// 创建一个a标签
    tempLink.style.display = 'none';
    tempLink.href = imgUrl;
    tempLink.setAttribute('download', id);// 给a标签添加下载属性
    if (typeof tempLink.download === 'undefined') {
      tempLink.setAttribute('target', '_blank');
    }
    document.body.appendChild(tempLink);// 将a标签添加到body当中
    tempLink.click();// 启动下载
    document.body.removeChild(tempLink);// 下载完毕删除a标签
    window.URL.revokeObjectURL(imgUrl);
  });
};
