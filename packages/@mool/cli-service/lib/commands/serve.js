const {
  info,
} = require("@vue/cli-shared-utils");
const getBaseUrl = require("../util/getBaseUrl");
const { existsSync, accessSync, readdirSync, constants } = require("fs");
const vitePluginConfigHMR = require("../vitePlugins/config-hmr");
const colors = require("picocolors");

const server = {
  port: 8080,
  host: "0.0.0.0",
};
const defaults = {
  host: "0.0.0.0",
  port: 8080,
  https: false,
};
let initialized;

let timer = undefined;
const delay = process.platform === 'win32' ? 1500 : 800;
function clear() {
  clearTimeout(timer);
}
function schedule(fn) {
  clear();
  timer = setTimeout(fn, delay);
}
/** @type {import('@mooljs/cli-service').ServicePlugin} */
module.exports = (api, options) => {
  const baseUrl = getBaseUrl(options);
  api.registerCommand(
    "serve",
    {
      description: "start development server",
      usage: "mool-cli-service serve [options] [entry]",
      options: {
        "--open": `open browser on server start`,
        "--copy": `copy url to clipboard on server start`,
        "--stdin": `close when stdin ends`,
        "--mode": `specify env mode (default: development)`,
        "--host": `specify host (default: ${defaults.host})`,
        "--port": `specify port (default: ${defaults.port})`,
        "--https": `use https (default: ${defaults.https})`,
        "--public": `specify the public network URL for the HMR client`,
        "--skip-plugins": `comma-separated list of plugin names to skip for this run`,
      },
    },
    async function serve(args) {
      !initialized && info("Starting development server...");
      const isProduction = process.env.NODE_ENV === "production";
      const prepareURLs = require("../util/prepareURLs");
      const isAbsoluteUrl = require("../util/isAbsoluteUrl");

      // Vite server logic
      const { createServer, mergeConfig } = await import("vite");
      // let fileConfig = viteConfig;
      const {
        base,
        root,
        alias,
        outDir,
        assetsDir,
        sourcemap,
        port,
        host,
        open,
        proxy,
        codeSplitting,
      } = options;
      const optimizeDepsIncludes = ['vue', 'vue-router', 'mooljs'];
      const HMR_INCLUDES = ['.moolrc.ts','src/app.tsx'];
      if(options.access){
        HMR_INCLUDES.push('src/access.ts')
      }
      if (existsSync(api.resolve("src/locale"))) {
        optimizeDepsIncludes.push('vue-i18n');
      }
      try {
        require.resolve('element-plus');
        optimizeDepsIncludes.push("element-plus", "@element-plus/icons-vue", "element-plus/es");
        readdirSync("node_modules/element-plus/es/components").map((dirname) => {
          try {
            accessSync(`node_modules/element-plus/es/components/${dirname}/style/css.mjs`, constants.R_OK | constants.W_OK);
            let path = `element-plus/es/components/${dirname}/style/css`;
            optimizeDepsIncludes.push(path);
          } catch (error) {
          }
        })
      } catch (error) {
      }
      const viteServer = await createServer(
        mergeConfig(
          {
            envDir: api.resolve("env"),
            base,
            root,
            plugins: [
              vitePluginConfigHMR(HMR_INCLUDES, async (restart=false) => {
                if(restart) return viteServer.restart();
                // 先销毁服务器实例
                await viteServer.close();
                // 再重新执行服务器初始化的流程
                // await _createViteDevServer(true)
                schedule(() => {
                  api.run();
                });
              })
            ],
            resolve: {
              alias: {
                '@': api.resolve('src'),
                ...alias,
              }
            },
            optimizeDeps: {
              include: optimizeDepsIncludes
            },
            server: {
              open: (args.open || open) && (!initialized || options.port != server.port),
              port: args.port || port || defaults.port,
              host: args.host || host || defaults.host,
              warmup: {
                clientFiles: ['/src/components/*.vue', '/src/service/*.ts', '/src/store/*.ts', '/src/utils/*.ts'],
              },
              proxy
            },
            build: {
              outDir,
              assetsDir,
              sourcemap,
              rollupOptions: {
                output: {
                  manualChunks: codeSplitting,
                },
              },
            },
          },
          api.resolveViteConfig(),

        )
      );
      await viteServer.listen();
      const urls = prepareURLs(
        "http",
        args.host || (options.host ?? defaults.host),
        viteServer.config.server.port,
        isAbsoluteUrl(baseUrl) ? "/" : baseUrl
      );
      if (
        (options.port && options.port != server.port) ||
        (!options.port && !initialized)
      ) {
        console.log(`
      ${colors.cyanBright(`vite`)} ${colors.greenBright(
          "dev server running at:"
        )}\n
      > Local: ${colors.cyanBright(urls.localUrlForBrowser)}
        `);
      }
      server.port = options.port;
      server.host = options.host;
      initialized = true;
      return new Promise((resolve) => {
        resolve({
          server: viteServer,
          // url: urls.localUrlForBrowser,
        });
      });
    }
  );
};

function checkInContainer() {
  if ("CODESANDBOX_SSE" in process.env) {
    return true;
  }
  const fs = require("fs");
  if (fs.existsSync(`/proc/1/cgroup`)) {
    const content = fs.readFileSync(`/proc/1/cgroup`, "utf-8");
    return /:\/(lxc|docker|kubepods(\.slice)?)\//.test(content);
  }
}

module.exports.defaultModes = {
  serve: "development",
};
