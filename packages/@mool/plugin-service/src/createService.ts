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
import { isPlainObject,serialize } from "./utils/index";
import { IncomingMessage, ServerResponse } from "http";
import {DEFAULTSETTING,IUrlConfig,ServiceModules,IConfig,IViteKeys} from '../types/index';
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

// Add this type definition
// type ModuleInstance<T, L> = {
//   [K in keyof T]: {
//     [P in keyof T[K]]: (data: ApiParams<T[K], P>) => Promise<L>;
//   };
// };


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
        params.url += "?" + serialize(config.data);
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

 
}



export const request = new CreateService();
