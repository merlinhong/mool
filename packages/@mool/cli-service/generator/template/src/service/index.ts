// auto generate by cli-service
import {
  CreateService,
  type IConfig,
  IRootKeys,
  IUrlConfig,
  createServiceWithModules,
} from "mooljs";

const config = {
  env: import.meta.env,
  default: "VITE_APP_BASE_API",
} as const satisfies IConfig<ImportMetaEnv>;

export type IApiConfig = IUrlConfig<IRootKeys<typeof config>>;

// 创建服务实例并直接应用类型
export const service = createServiceWithModules(new CreateService(config));

service.setResponseInterceptor(
  (res) => {
    return res;
  },
  (err) => {
    console.log("error", err);
    return err;
  }
);
