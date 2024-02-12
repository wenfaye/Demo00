import axios from 'axios';
import { ElMessage } from 'element-plus';

export function showErrorMessage<T>(reason?: any) {
  if (typeof reason.message === 'string') {
    ElMessage({
      message: reason.message,
      type: 'error',
      duration: 5 * 1000,
    });
  } else {
    ElMessage({
      message: reason,
      type: 'error',
      duration: 5 * 1000,
    });
  }
}
export function showErrorMessageAndReturnError<T>(reason?: any): Promise<T> {
  showErrorMessage(reason);
  return Promise.reject(reason);
}

export interface QueryResponse<T> {
  items: T
  total: number
}

export interface Option {
  value: string
  label: string
}

export const optionText = (value: string, opts: Option[]): string => {
  for (const idx in opts) {
    if (opts[idx].value === value) {
      return opts[idx].label;
    }
  }
  return value;
};

const urlJoin = (a: string, b: string) => {
  if (a.endsWith('/')) {
    if (b.startsWith('/')) {
      return a.substring(0, a.length - 1) + b;
    }
    return a + b;
  } else {
    if (b.startsWith('/')) {
      return a + b;
    }
    return a + '/' + b;
  }
};

const whitelist = [
  '/sessions/current',
  '/sessions/current_token',
];

const service = axios.create({
  baseURL: (window as any).apiPrefix,
  timeout: 50000,

  // Be careful if we are using the transformRequest option: the data from request.config is already transformed into a string.
  // transformRequest: [
  //   data => (isString(data) ? data : qs.stringify(data)),
  // ],
});

export const ds = axios.create({
  baseURL: (window as any).dsPrefix,
  timeout: 50000,
  // Be careful if we are using the transformRequest option: the data from request.config is already transformed into a string.
  // transformRequest: [
  //   data => (isString(data) ? data : qs.stringify(data)),
  // ],
});

export const req = axios.create({
  baseURL: (window as any).urlPrefix,
  timeout: 50000,

  // Be careful if we are using the transformRequest option: the data from request.config is already transformed into a string.
  // transformRequest: [
  //   data => (isString(data) ? data : qs.stringify(data)),
  // ],
});

export const rest = axios.create({
  baseURL: (window as any).restPrefix,
  timeout: 50000,

  // Be careful if we are using the transformRequest option: the data from request.config is already transformed into a string.
  // transformRequest: [
  //   data => (isString(data) ? data : qs.stringify(data)),
  // ],
});

// // Function that will be called to refresh authorization
// const refreshAuthLogic = (failedRequest: any) =>
//   UserModule.currentToken().then(token => {
//     setToken(token);
//     failedRequest.response.config.params.token = token;
//     return Promise.resolve();
//   });

// // Instantiate the interceptor (you can chain it as it returns the axios instance)
// createAuthRefreshInterceptor(service, refreshAuthLogic);

// // Request interceptors
// service.interceptors.request.use(
//   (config: any) => {
//     // Add X-Token header to every request, you can add other custom headers here
//     if (UserModule.token) {
//       if (!config.params) {
//         config.params = {};
//       }
//       config.params.token = getToken();
//       // config.headers['X-Token'] = getToken();
//     }
//     return config;
//   },
//   (error: any) => {
//     Promise.reject(error);
//   },
// );

// Response interceptors
service.interceptors.response.use(
  (response: any) => {
    return response;
  },
  (error: any) => {
    const data = error.response;
    if (!!data && !!data.data) {
      const res = data.data;
      const err = {
        code: data.status,
        message: error.message,
      };
      if (typeof res === 'string') {
        err.message = res;
      } else if (typeof res.error === 'string') {
        err.message = res.error;
      } else if (typeof res.message === 'string') {
        err.message = res.message;
      }

      if (typeof res.code === 'number') {
        err.code = res.code;
      }

      const errCode = err.code;
      if (errCode === 401 || errCode % 1000 === 401) {
        // let skip = false;
        // for (const i in whitelist) {
        //   if (whitelist[i] == error.config.url) {
        //     skip = true;
        //   }
        // }
        // if (!skip) {
        //   return UserModule.currentToken().then(token => {
        //     setToken(token);
        //     error.config.params.token = token;

        //     // Be careful if you're using the transformRequest option: the data from error.config is already transformed into a string.
        //     // Here, the request data will be double stringified with qs.stringify,
        //     // potentially leading to 422 responses or similar.
        //     return service.request(error.config);
        //   });
        // }

        // MessageBox.confirm(
        //   '你已被登出，可以取消继续留在该页面，或者重新登录',
        //   '确定登出',
        //   {
        //     confirmButtonText: '重新登录',
        //     cancelButtonText: '取消',
        //     type: 'warning',
        //   },
        // ).then(() => {
        //   UserModule.LogOut().then(() => {
        //     location.reload(); // To prevent bugs from vue-router
        //   });
        // });
      }

      showErrorMessage(err);
    } else {
      showErrorMessage(error);
    }

    return Promise.reject(error);
  },
);

ds.interceptors.response.use(
  (response: any) => {
    return response;
  },
  (error: any) => {
    const data = error.response;
    if (!!data && !!data.data) {
      const res = data.data;
      const err = {
        code: data.status,
        message: error.message,
      };
      if (typeof res.error === 'string') {
        err.message = res.error;
      } else if (typeof res.message === 'string') {
        err.message = res.message;
      }

      if (typeof res.code === 'number') {
        err.code = res.code;
      }

      console.log(error);
    } else {
      console.log(error);
    }

    return Promise.reject(error);
  },
);

rest.interceptors.response.use(
  (response: any) => {
    return response;
  },
  (error: any) => {
    const data = error.response;
    if (!!data && !!data.data) {
      const res = data.data;
      const err = {
        code: data.status,
        message: error.message,
      };
      if (typeof res === 'string') {
        err.message = res;
      } else if (typeof res.error === 'string') {
        err.message = res.error;
      } else if (typeof res.message === 'string') {
        err.message = res.message;
      }

      if (typeof res.code === 'number') {
        err.code = res.code;
      }

      showErrorMessage(err);
    } else {
      showErrorMessage(error);
    }

    return Promise.reject(error);
  },
);

export default service;
