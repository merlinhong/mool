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
  default: "VITE_API_BASE_URL",
} as const satisfies IConfig<ImportMetaEnv>;

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
declare global{
  type IApiConfig = IUrlConfig<IRootKeys<typeof config>>;
}