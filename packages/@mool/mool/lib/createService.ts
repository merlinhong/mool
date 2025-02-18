import axios, {
  GenericAbortSignal,
  AxiosStatic,
  AxiosRequestConfig,
  AxiosProgressEvent,
  ResponseType,
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosInterceptorManager,
  RawAxiosRequestHeaders,
  CreateAxiosDefaults,
  CanceledError,
} from "axios";
import qs from "qs";
import { isPlainObject } from "./utils/index";
import { IncomingMessage, ServerResponse } from "http";

function capitalize<T extends keyof HttpMethodMap>(str: T) {
  if (typeof str !== "string") {
    return str; // 如果不是字符串，直接返回原字符串
  }
  const firstLetter = str.charAt(0).toUpperCase(); // 首字母大写
  const restOfString = str.slice(1).toLowerCase(); // 其余部分小写
  return (firstLetter + restOfString) as CapitalizeHttpMethod<T>; // 拼接并返回
}
type CapitalizeHttpMethod<T extends keyof HttpMethodMap> =
  T extends keyof HttpMethodMap ? HttpMethodMap[T] : never;

type CommonResponse<T = any> = {
  code: number;
  data: T;
  msg: string;
};
type HttpMethodMap = {
  get: "Get";
  GET: "Get";
  delete: "Delete";
  DELETE: "Delete";
  head: "Head";
  HEAD: "Head";
  options: "Options";
  OPTIONS: "Options";
  post: "Post";
  POST: "Post";
  put: "Put";
  PUT: "Put";
  patch: "Patch";
  PATCH: "Patch";
  link: "Link";
  LINK: "Link";
  unlink: "Unlink";
  UNLINK: "Unlink";
};

export enum StateEnum {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  INVALID_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  NOT_AUTH = 820101,
  ERR_CANCELED = "ERR_CANCELED",
}

const defaultSettings: DEFAULTSETTING = {
  type: "post",
  url: "",
  data: {},
  headers: {},
  timeout: 8000,
  contentType: "application/json",
  withCredentials: true,
  baseURL: "",
  success: () => {},
  error: () => {},
  complete: () => {},
};
export interface RespThisType {
  req: IncomingMessage;
  res: ServerResponse;
  parseJson: () => any;
}

// export type MethodType = "get" | "post" | "put" | "delete" | "patch";
export type Recordable<T = any> = Record<string, T>;
interface DEFAULTSETTING<T = any, K = Record<string, any>> {
  /**
   * mock后端接口数据
   */
  mock?: {
    /**
     * 设置响应时间
     */
    timeout?: number;
    /**
     * 自定义状态码
     */
    statusCode?: number;
    /**
       *  @default `'函数类型'`
       * ((
            this: RespThisType,
            opt: { url: Recordable; body: Recordable; query: Recordable; headers: Recordable },
          ) => any)
       * 
       *  @description 自定义返回响应数据
       */
    response?:
      | ((
          this: RespThisType,
          opt: {
            url: Recordable;
            body: Recordable;
            query: Recordable;
            headers: Recordable;
          }
        ) => any)
      | any;
    /**
     * 可自定义设置响应体
     * @param this 响应实例类型
     * @param req 请求体
     * @param res 响应体
     * @returns
     */
    rawResponse?: (
      this: RespThisType,
      req: IncomingMessage,
      res: ServerResponse
    ) => void;
  };
  /**
   * default `'post'`
   * 请求类型
   * */
  type?: keyof HttpMethodMap;
  /**请求路径 */
  url: string;
  /**请求体 */
  data?: K;
  /**请求超时时间 */
  timeout?: number | undefined;
  /**请求头 */
  headers?: RawAxiosRequestHeaders;
  /**项目根路径类别 */
  root?: T;
  /**
   * default `'application/json'`
   * 请求体编码类型
   */
  contentType?:
    | "text/html"
    | "text/plain"
    | "multipart/form-data"
    | "application/json"
    | "application/x-www-form-urlencoded"
    | "application/octet-stream";
  /**返回的响应类型 */
  responseType?: ResponseType;
  /**跨域成功是否携带cookie */
  withCredentials?: boolean;
  /**请求根路径，如果遇到跨域问题到vite.config配好代理后在baseURL处修改逻辑 */
  baseURL?: string;
  /**文件上传的file对象集合 */
  files?: Array<{
    file?: File;
    name?: string;
  }>;
  /**上传进度 */
  uploading?: ((progressEvent: AxiosProgressEvent) => void) | undefined;
  /**下载进度 */
  downloading?: ((progressEvent: AxiosProgressEvent) => void) | undefined;
  onDownloadProgress?:
    | ((progressEvent: AxiosProgressEvent) => void)
    | undefined;
  onUploadProgress?: ((progressEvent: AxiosProgressEvent) => void) | undefined;
  /**请求成功回调 */
  success?: Function;
  /**请求报错回调 */
  error?: Function;
  /**请求完成回调 */
  complete?: Function;
  /**
   * 取消请求
   */
  cancelToken?: AxiosStatic['CancelToken'];
  /**
   * 信号
   */
  signal?: GenericAbortSignal;
}
export type IRootKeys<T extends { env: any; default?: any }> = keyof IViteKeys<
  T["env"],
  T["default"]
>;
export type IUrlConfig<T = any, K = {}> = Record<string, DEFAULTSETTING<T, K>>;
// 定义一个将以 VITE 开头的属性名转换为小写的映射类型
export type IViteKeys<T, G> = {
  [K in keyof T as K extends `VITE_${infer Rest}`
    ? G extends K
      ? never
      : K
    : never]: T[K];
};
// 定义一个将以 VITE 开头的属性名转换为小写的映射类型
export type IEnvKeys<T> = {
  [K in keyof T as K extends `VITE_${infer Rest}` ? K : never]: T[K];
};

/**
 * 推导接口参数类型
 */
type ApiParams<T, K extends keyof T> = T[K] extends { data: infer D } ? D : undefined;

export type IConfig<T, G = string, L = CommonResponse> = {
  env: T;
  default?: G & keyof IEnvKeys<T>;
  baseURL?: string;
  response?: L;
};

// Add this type definition
type ModuleInstance<T, L> = {
  [K in keyof T]: {
    [P in keyof T[K]]: (data: ApiParams<T[K], P>) => Promise<L>;
  };
};

// // 构建服务模块类型
type ServiceModules = {
  [K in keyof ServiceTypes]: ServiceTypes[K];
};

// 修改 ApiService 类定义，增加泛型约束
export class CreateService<
  T extends Record<string, any>,
  G extends string,
  H extends IUrlConfig,
  L = CommonResponse,
  M extends ServiceModules = ServiceModules
> {
  private axiosInstance: AxiosInstance;
  private defaultSettings: DEFAULTSETTING;
  private _env: Record<string, any>;
  private _default: string;
  private baseURL: string;
  private complete: boolean = false;
  private Modules: M | ServiceModules;

  // 使用更灵活的索引签名
  [key: string]: any;

  constructor(config?: IConfig<T, G, L>, modules?: M) {
    this.defaultSettings = defaultSettings;
    this._env = config?.env || {};
    this._default = config?.default ?? "";
    this.baseURL = config?.baseURL ?? "";

    // 如果没有传入modules，则自动加载
    this.Modules = modules || this.loadModules();

    // 动态添加模块方法
    if (this.Modules) {
      for (const [name, apis] of Object.entries(this.Modules)) {
        const apiInstance = this.setApi(apis);
        Object.defineProperty(this, name, {
          value: apiInstance,
          enumerable: true,
          configurable: false,
          writable: false,
        });
      }
    }

    this.axiosInstance = axios.create(this.getAxiosConfig());
    this.init();
  }

  private loadModules(): ServiceModules {
    // 自动导入所有模块
    const moduleFiles = import.meta.glob<{ default: IUrlConfig }>(
      "/src/service/!(index).ts",
      { eager: true }
    );
    console.log(3333, moduleFiles);

    const modules = {} as Record<string, IUrlConfig>;

    for (const path in moduleFiles) {
      const moduleName = path.match(/([^/]+)\.ts$/)?.[1];
      if (moduleName && moduleName !== "index") {
        modules[moduleName] = moduleFiles[path].default;
      }
    }

    return modules as ServiceModules;
  }

  private setApi(api?: H) {
    const apiMap: Record<string, any> = {};
    if (!api) return apiMap;

    for (const key in api) {
      if (Object.prototype.hasOwnProperty.call(api, key)) {
        const conf = api[key];
        apiMap[key] = (data: any) =>
          this.request(
            this.mergeConfig({
              ...conf,
              data,
            })
          );
      }
    }
    return apiMap;
  }

  private init() {
    // 添加请求拦截器
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // 可以在这里添加自定义的请求拦截逻辑
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 添加响应拦截器
    this.axiosInstance.interceptors.response.use(
      (response) => {
        // 可以在这里添加自定义的响应拦截逻辑
        return response.data;
      },
      (error) => {
        // 处理错误
        return Promise.reject(error);
      }
    );
  }

  private getAxiosConfig() {
    const config: CreateAxiosDefaults<any> | undefined = {
      timeout: this.defaultSettings.timeout,
      headers: this.defaultSettings.headers,
    };
    if (this._default) {
      config.baseURL = this._default.startsWith("VITE")
        ? this._env[this._default]
        : this._default;
    }
    if (this.baseURL) {
      config.baseURL = this.baseURL;
    }
    return config;
  }
  // 合并配置
  private mergeConfig(options: DEFAULTSETTING): DEFAULTSETTING {
    return { ...this.defaultSettings, ...options };
  }

  /**
   * 取消当前正在发起的请求
   */
  public cancel(msg?: string, confirm?: () => Promise<any>) {
    if (this.complete || !this.source) return;
    if (confirm) {
      confirm().then(() => {
        this.source.cancel(msg); // 取消请求
      });
    } else {
      this.source.cancel(msg);
    }
  }

  // 请求方法
  async request<K = L>(
    options: DEFAULTSETTING<keyof IViteKeys<T, G>>
  ): Promise<K> {
    const config = this.mergeConfig(options);
    // // 创建一个 AbortController 实例
    // this.controller = new AbortController();
    // const signal = this.controller.signal;
    this.source = axios.CancelToken.source();
    this.complete = false;
    const params: AxiosRequestConfig = {
      url: config.url,
      method: config.type,
      data: config.data,
      headers: config.headers,
      responseType: config.responseType,
      withCredentials: config.withCredentials,
      onUploadProgress: config.uploading,
      onDownloadProgress: config.downloading,
      baseURL: this.baseURL,
      cancelToken: this.source.token,
    };
    if (config.root) {
      params.baseURL = this._env[config.root] ?? "";
    }
    if (config.baseURL) {
      params.baseURL = config.baseURL;
    }
    if (params.headers) {
      params.headers["Content-Type"] = config.contentType;
      if (config.type === "get" && isPlainObject(config.data)) {
        params.url += "?" + qs.stringify(config.data);
      } else {
        params.data = JSON.stringify(config.data);
      }
    }
    return new Promise((resolve, reject) => {
      this.axiosInstance(params)
        .then((response: AxiosResponse | CanceledError<any>) => {
          if (!response.status) {
            (response as AxiosResponse).data = { ...response };
            response.status = response.code || 200;
          }
          const { status, data } = response as AxiosResponse;
          if (
            status !== 200 ||
            (response as CanceledError<any>).code == StateEnum.ERR_CANCELED
          ) {
            reject(data);
            config.error && config.error(data);
          } else {
            config.success && config.success(data);
            resolve(data);
          }
        })
        .catch((err) => {
          config.error && config.error(err);
          reject(err);
        })
        .finally(() => {
          config.complete && config.complete();
          this.complete = true;
        });
    });
  }

  // 自定义请求拦截器
  setRequestInterceptor(
    ...interceptor: Parameters<
      AxiosInterceptorManager<InternalAxiosRequestConfig<any>>["use"]
    >
  ) {
    this.axiosInstance.interceptors.request.use(...interceptor);
  }

  // 自定义响应拦截器
  setResponseInterceptor(
    ...interceptor: Parameters<
      AxiosInterceptorManager<AxiosResponse<any, any>>["use"]
    >
  ) {
    this.axiosInstance.interceptors.response.use(...interceptor);
  }

  // 添加一个方法来获取模块实例，这将帮助类型推断
  getModuleInstance<K extends keyof M>(
    moduleName: K
  ): {
    [P in keyof M[K]]: (data: ApiParams<M[K], P>) => Promise<L>;
  } {
    return this[moduleName] as {
      [P in keyof M[K]]: (data: ApiParams<M[K], P>) => Promise<L>;
    };
  }
}

// 修改 ApiServiceWithModules 类型定义
export type ApiServiceWithModules<
  T extends Record<string, any>,
  G extends string,
  M extends ServiceModules
> = CreateService<T, G, IUrlConfig, CommonResponse, M> & {
  [K in keyof M]: {
    [P in keyof M[K]]: ApiParams<M[K], P> extends undefined ?(data?: {}) => Promise<CommonResponse>:(data: ApiParams<M[K], P>) => Promise<CommonResponse>;
  };
};

// 添加类型转换函数
export function createServiceWithModules<
  T extends Record<string, any>,
  G extends string,
  M extends ServiceModules
>(
  apiService: CreateService<T, G, IUrlConfig, CommonResponse, M>
): ApiServiceWithModules<T, G, M> {
  return apiService as ApiServiceWithModules<T, G, M>;
}

export const request = new CreateService();
