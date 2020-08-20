import axios from "axios";
import { getToken } from "@/utils/auth";
import i18n from "@/plug/i18n.ts";
const service = axios.create({
  timeout: 10000,
});
const baseUrl = process.env.VUE_APP_BASE_URL;
const baseUrl_2 = process.env.VUE_APP_BASE_URL_2;
// Request interceptors
service.interceptors.request.use(
  (config: any) => {
    const { data, headers } = config;
    return config;
  },
  (error: any) => {
    // Handle request error here
    Promise.reject(error);
  },
);

// Response interceptors
service.interceptors.response.use(
  (response: any) => {
    if (response.status >= 400) {
      return Promise.reject(response.data);
    } else {
      if (response.data.success) {
        return Promise.resolve(response);
      }
      return Promise.reject(response.data);
    }
  },

  (error: any) => {
    return Promise.reject(error.response.data);
  },
);

interface Ioptions {
  method: string;
  url: string;
  data: object | undefined | null;
  params?: object | string | undefined | null;
  baseURL: string | undefined;
  headers: object | null;
}

function request(method: string): any {
  return async (url: string, data: object = {}, opt?: {}) => {
    const requestUrl = baseUrl;
    let options: Ioptions = {
      method,
      url,
      data,
      baseURL: requestUrl,
      headers: {
        "content-type": "application/json",
        token: `${getToken()}`,
        Locale: `${i18n.locale.replace(/-/, "_")}`,
      },
    };
    options = opt ? { ...options, ...opt } : options;
    if (["GET", "DELETE"].includes(method)) {
      options.params = data;
      options.data = {};
    }
    return await service(options)
      .then((res) => {
        return [null, res];
      })
      .catch((err) => {
        const { errors } = err;
        const errorsKey = errors && Object.keys(errors)[0];
        if (errors && errorsKey) {
          err.msg = errors[errorsKey][0];
        }
        err.msg = err.msg
          ? err.msg
          : err.message
          ? err.message
          : "网络请求出错";
        return [err, null];
      });
  };
}

export const GET = request("GET");
export const POST = request("POST");
export const PUT = request("PUT");
export const DELETE = request("DELETE");

export default service;
