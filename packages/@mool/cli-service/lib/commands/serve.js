const {
  info,
  error,
  hasProjectYarn,
  hasProjectPnpm,
  IpcMessenger,
  loadModule,
} = require("@vue/cli-shared-utils");
const getBaseUrl = require("../util/getBaseUrl");
const chokidar = require("chokidar");
const { execSync } = require("node:child_process");
const requiredVersion = require("vite/package.json").version;
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
let initialized = false;

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
      const isInContainer = checkInContainer();
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
        codeSplitting,
      } = options;
      const viteServer = await createServer(
        mergeConfig(
          {
            base,
            root,
            resolve: {
              alias:{
                '@':api.resolve('src'),
                ...alias,
              }
            },
            server: {
              open: open && (!initialized || options.port != server.port),
              port: port || defaults.port,
              host: host || defaults.host,
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
          api.resolveViteConfig()
        )
      );
      await viteServer.listen();
      const urls = prepareURLs(
        "http",
        args.host || (options.host ?? defaults.host),
        args.port || (options.port ?? defaults.port),
        isAbsoluteUrl(baseUrl) ? "/" : baseUrl
      );

      if (
        (options.port && options.port != server.port) ||
        (!options.port && !initialized)
      ) {
        console.log(`
      ${colors.cyanBright(`vite ${requiredVersion}`)} ${colors.greenBright(
          "dev server running at:"
        )}\n
      > Local: ${colors.cyanBright(urls.localUrlForBrowser)}
        `);
      }

      server.port = options.port;
      server.host = options.host;
      const wat = chokidar.watch(api.resolve(".moolrc.ts"));
      wat.on("change", async (d) => {
        await viteServer.close();
      });

      initialized = true;

      return new Promise((resolve) => {
        resolve({
          server: viteServer,
          url: urls.localUrlForBrowser,
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
