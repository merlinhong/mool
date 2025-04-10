declare module "@mooljs/plugin-service" {
  export type IRootKeys<T extends { env: any; default?: any }> = keyof IViteKeys<
    T["env"],
    T["default"]
  >;
  // 修改 ApiServiceWithModules 类型定义
  type ApiServiceWithModules<
    T extends Record<string, any>,
    G extends string,
    M extends ServiceModules,
  > = CreateService<T, G, IUrlConfig, CommonResponse, M> & {
    [K in keyof M]: {
      [P in keyof M[K]]: ApiParams<M[K], P> extends undefined
        ? (data?: {}) => Promise<CommonResponse>
        : (data: ApiParams<M[K], P>) => Promise<CommonResponse>;
    };
  };

  type ApiParams<T, K extends keyof T> = T[K] extends { data: infer D }
    ? D
    : undefined;

  // 添加类型转换函数
  export function createServiceWithModules<
    T extends Record<string, any>,
    G extends string,
    M extends ServiceModules,
  >(
    apiService: CreateService<T, G, IUrlConfig, CommonResponse, M>,
  ): ApiServiceWithModules<T, G, M> {
    return apiService as ApiServiceWithModules<T, G, M>;
  }
  export * from "./createService";
}

export interface RespThisType {
  req: IncomingMessage;
  res: ServerResponse;
  parseJson: () => any;
}

export type HttpMethodMap = "get" | "post" | "put" | "delete" | "patch";
export type Recordable<T = any> = Record<string, T>;
export interface DEFAULTSETTING<T = any, K = Record<string, any>> {
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
          },
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
      res: ServerResponse,
    ) => void;
  };
  /**
   * default `'post'`
   * 请求类型
   * */
  type?: HttpMethodMap;
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
  cancelToken?: AxiosStatic["CancelToken"];
  /**
   * 信号
   */
  signal?: GenericAbortSignal;
}
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
type IEnvKeys<T> = {
  [K in keyof T as K extends `VITE_${infer Rest}` ? K : never]: T[K];
};

/**
 * 推导接口参数类型
 */
export type IConfig<T, G = string, L = CommonResponse> = {
  env: T;
  default?: G & keyof IEnvKeys<T>;
  baseURL?: string;
  response?: L;
};

// // 构建服务模块类型
export type ServiceModules = {
  [K in keyof ServiceTypes]: ServiceTypes[K];
};
