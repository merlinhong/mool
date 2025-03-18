const path = require("path");
const debug = require("debug");
const inquirer = require("inquirer");
const EventEmitter = require("events");
const Generator = require("./Generator");
const cloneDeep = require("lodash.clonedeep");
const sortObject = require("./util/sortObject");
const getVersions = require("./util/getVersions");
const PackageManager = require("./util/ProjectPackageManager");
const { clearConsole } = require("./util/clearConsole");
const PromptModuleAPI = require("./PromptModuleAPI");
const writeFileTree = require("./util/writeFileTree");
const { formatFeatures } = require("./util/features");
const generateReadme = require("./util/generateReadme");
const { resolvePkg, isOfficialPlugin } = require("@vue/cli-shared-utils");

const {
  defaults,
  saveOptions,
  loadOptions,
  savePreset,
  validatePreset,
  rcPath,
} = require("./options");

const {
  chalk,
  execa,

  log,
  warn,
  error,

  hasGit,
  hasProjectGit,
  hasYarn,
  hasPnpm3OrLater,
  hasPnpmVersionOrLater,

  exit,
  loadModule,
} = require("@vue/cli-shared-utils");

const isManualMode = (answers) =>
  answers.preset === "__manual__" || answers.preset === "__max__";

module.exports = class Creator extends EventEmitter {
  constructor(name, context, promptModules) {
    super();

    this.name = name;
    this.context = process.env.VUE_CLI_CONTEXT = context;
    const { presetPrompt, featurePrompt } = this.resolveIntroPrompts();

    this.presetPrompt = presetPrompt;
    this.featurePrompt = featurePrompt;
    this.outroPrompts = this.resolveOutroPrompts();
    this.injectedPrompts = [];
    this.promptCompleteCbs = [];
    this.afterInvokeCbs = [];
    this.afterAnyInvokeCbs = [];
    this.run = this.run.bind(this);

    const promptAPI = new PromptModuleAPI(this);
    promptModules.forEach((m) => m(promptAPI));
  }

  async create(cliOptions = {}, preset = null) {
    const isTestOrDebug = process.env.VUE_CLI_TEST || process.env.VUE_CLI_DEBUG;
    const { run, name, context, afterInvokeCbs, afterAnyInvokeCbs } = this;

    if (!preset) {
      if (cliOptions.preset) {
        // vue create foo --preset bar
        preset = await this.resolvePreset(cliOptions.preset, cliOptions.clone);
      } else if (cliOptions.default) {
        // vue create foo --default
        preset = defaults.presets["Default (Vue 3)"];
      } else if (cliOptions.inlinePreset) {
        // vue create foo --inlinePreset {...}
        try {
          preset = JSON.parse(cliOptions.inlinePreset);
        } catch (e) {
          error(
            `CLI inline preset is not valid JSON: ${cliOptions.inlinePreset}`,
          );
          exit(1);
        }
      } else {
        preset = await this.promptAndResolvePreset();
      }
    }

    // inject core router
    preset.plugins["@mooljs/plugin-router"] = {};

    // clone before mutating
    preset = cloneDeep(preset);
    // inject core service
    preset.plugins["@mooljs/cli-service"] = Object.assign(
      {
        projectName: name,
      },
      preset,
    );
    console.log(33, preset);

    if (preset.answers.preset == "__max__") {
      preset.plugins["@mooljs/plugin-max"] = {};
    }

    // // legacy support for vuex
    // if (preset.vuex) {
    //   preset.plugins["@vue/cli-plugin-vuex"] = {};
    // }

    const packageManager =
      cliOptions.packageManager ||
      loadOptions().packageManager ||
      (hasYarn() ? "yarn" : null) ||
      (hasPnpm3OrLater() ? "pnpm" : "npm");

    await clearConsole();
    const pm = new PackageManager({
      context,
      forcePackageManager: packageManager,
    });

    log(`✨  Creating project in ${chalk.yellow(context)}.`);
    this.emit("creation", { event: "creating" });

    // get latest CLI plugin version
    const { latestMinor } = await getVersions();

    // generate package.json with plugin dependencies
    const pkg = {
      name,
      version: "0.1.0",
      private: true,
      devDependencies: {},
      ...resolvePkg(context),
    };
    const deps = Object.keys(preset.plugins);
    deps.forEach((dep) => {
      if (preset.plugins[dep]._isPreset) {
        return;
      }

      let { version } = preset.plugins[dep];

      if (!version) {
        if (isOfficialPlugin(dep) || dep === "@mooljs/cli-service") {
          version = isTestOrDebug ? `latest` : `~${latestMinor}`;
        } else {
          version = "latest";
        }
      }

      pkg.devDependencies[dep] = version;
    });

    // write package.json
    await writeFileTree(context, {
      "package.json": JSON.stringify(pkg, null, 2),
    });

    // generate a .npmrc file for pnpm, to persist the `shamefully-flatten` flag
    if (packageManager === "pnpm") {
      const pnpmConfig = hasPnpmVersionOrLater("4.0.0")
        ? // pnpm v7 makes breaking change to set strict-peer-dependencies=true by default, which may cause some problems when installing
          "shamefully-hoist=true\nstrict-peer-dependencies=false\n"
        : "shamefully-flatten=true\n";

      await writeFileTree(context, {
        ".npmrc": pnpmConfig,
      });
    }

    // // intilaize git repository before installing deps
    // // so that vue-cli-service can setup git hooks.
    // const shouldInitGit = this.shouldInitGit(cliOptions);
    // if (shouldInitGit) {
    //   log(`🗃  Initializing git repository...`);
    //   this.emit("creation", { event: "git-init" });
    //   await run("git init");
    // }

    // install plugins
    log(`⚙\u{fe0f}  Installing CLI plugins. This might take a while...`);
    log();

    this.emit("creation", { event: "plugins-install" });

    if (isTestOrDebug && !process.env.VUE_CLI_TEST_DO_INSTALL_PLUGIN) {
      // in development, avoid installation process
      await require("./util/setupDevProject")(context);
    } else {
      console.log("正在安装 Installing.... "); // 添加这行
      await pm.install();
    }

    // run generator
    log(`🚀  Invoking generators...`);
    this.emit("creation", { event: "invoking-generators" });
    const plugins = await this.resolvePlugins(preset.plugins, pkg);
    const generator = new Generator(context, {
      pkg,
      plugins,
      afterInvokeCbs,
      afterAnyInvokeCbs,
    });
    await generator.generate({
      extractConfigFiles: false,
    });

    // install additional deps (injected by generators)
    log(`📦  Installing additional dependencies...`);
    this.emit("creation", { event: "deps-install" });
    log();
    if (!isTestOrDebug || process.env.VUE_CLI_TEST_DO_INSTALL_PLUGIN) {
      await pm.install();
    }

    // run complete cbs if any (injected by generators)
    // log(`⚓  Running completion hooks...`);
    this.emit("creation", { event: "completion-hooks" });
    for (const cb of afterInvokeCbs) {
      await cb();
    }
    for (const cb of afterAnyInvokeCbs) {
      await cb();
    }

    if (!generator.files["README.md"]) {
      // generate README.md
      log();
      log("📄  Generating README.md...");
      await writeFileTree(context, {
        "README.md": generateReadme(generator.pkg, packageManager),
      });
    }

    // // commit initial state
    // let gitCommitFailed = false;
    // if (shouldInitGit) {
    //   await run("git add -A");
    //   if (isTestOrDebug) {
    //     await run("git", ["config", "user.name", "test"]);
    //     await run("git", ["config", "user.email", "test@test.com"]);
    //     await run("git", ["config", "commit.gpgSign", "false"]);
    //   }
    //   const msg = typeof cliOptions.git === "string" ? cliOptions.git : "init";
    //   try {
    //     await run("git", ["commit", "-m", msg, "--no-verify"]);
    //   } catch (e) {
    //     gitCommitFailed = true;
    //   }
    // }

    // log instructions
    log();
    log(`🎉  Successfully created project ${chalk.yellow(name)}.`);
    if (!cliOptions.skipGetStarted) {
      log(
        `👉  Get started with the following commands:\n\n` +
          (this.context === process.cwd()
            ? ``
            : chalk.cyan(` ${chalk.gray("$")} cd ${name}\n`)) +
          chalk.cyan(
            ` ${chalk.gray("$")} ${
              packageManager === "yarn"
                ? "yarn serve"
                : packageManager === "pnpm"
                  ? "pnpm run serve"
                  : "npm run serve"
            }`,
          ),
      );
    }
    log();
    this.emit("creation", { event: "done" });

    // if (gitCommitFailed) {
    //   warn(
    //     `Skipped git commit due to missing username and email in git config, or failed to sign commit.\n` +
    //       `You will need to perform the initial commit yourself.\n`
    //   );
    // }

    generator.printExitLogs();
  }

  run(command, args) {
    if (!args) {
      [command, ...args] = command.split(/\s+/);
    }
    return execa(command, args, { cwd: this.context });
  }

  async promptAndResolvePreset(answers = null) {
    // prompt
    if (!answers) {
      await clearConsole(true);
      answers = await inquirer.prompt(this.resolveFinalPrompts());
    }
    debug("vue-cli:answers")(answers);

    if (answers.packageManager) {
      saveOptions({
        packageManager: answers.packageManager,
      });
    }

    let preset;
    // manual
    preset = {
      useConfigFiles: answers.useConfigFiles === "files",
      plugins: {},
      lintOn: answers.lintOn,
      answers,
    };
    answers.features = answers.features || [];
    // run cb registered by prompt modules to finalize the preset
    this.promptCompleteCbs.forEach((cb) => cb(answers, preset));
    // validate
    validatePreset(preset);
    return preset;
  }

  // { id: options } => [{ id, apply, options }]
  async resolvePlugins(rawPlugins, pkg) {
    // ensure cli-service is invoked first
    rawPlugins = sortObject(rawPlugins, ["@mooljs/cli-service"], true);
    const plugins = [];
    for (const id of Object.keys(rawPlugins)) {
      const apply = loadModule(`${id}/generator`, this.context) || (() => {});
      let options = rawPlugins[id] || {};

      if (options.prompts) {
        let pluginPrompts = loadModule(`${id}/prompts`, this.context);

        if (pluginPrompts) {
          const prompt = inquirer.createPromptModule();

          if (typeof pluginPrompts === "function") {
            pluginPrompts = pluginPrompts(pkg, prompt);
          }
          if (typeof pluginPrompts.getPrompts === "function") {
            pluginPrompts = pluginPrompts.getPrompts(pkg, prompt);
          }

          log();
          log(`${chalk.cyan(options._isPreset ? `Preset options:` : id)}`);
          options = await prompt(pluginPrompts);
        }
      }

      plugins.push({ id, apply, options });
    }
    return plugins;
  }

  getPresets() {
    const savedOptions = loadOptions();
    return Object.assign({}, savedOptions.presets, defaults.presets);
  }

  resolveIntroPrompts() {
    const presets = this.getPresets();
    const presetChoices = Object.entries(presets).map(([name, preset]) => {
      let displayName = name;
      // Vue version will be showed as features anyway,
      // so we shouldn't display it twice.
      let opt = {
        Single: "__manual__",
        Max: "__max__",
        "Cross Platform": "__cp__",
      };
      if (name === "Single") {
        displayName = "Single App";
      }
      if (name === "Max") {
        displayName = "Max App";
      }
      if (name === "Cross Platform") {
        displayName = "Cross-Platform App";
      }

      return {
        name: `${displayName} (${formatFeatures(preset, name)})`,
        value: opt[name],
      };
    });
    const presetPrompt = {
      name: "preset",
      type: "list",
      message: `Please pick mooljs app template:`,
      choices: [...presetChoices],
    };
    const featurePrompt = {
      name: "features",
      when: isManualMode,
      type: "checkbox",
      message: "Check the features needed for your project:",
      choices: [],
      pageSize: 10,
    };
    return {
      presetPrompt,
      featurePrompt,
    };
  }

  resolveOutroPrompts() {
    const packageManagerChoices = [];
    packageManagerChoices.push({
      name: "Use Yarn",
      value: "yarn",
      short: "Yarn",
    });
    packageManagerChoices.push({
      name: "Use PNPM (recommand)",
      value: "pnpm",
      short: "PNPM",
    });
    // ask for packageManager once
    packageManagerChoices.push({
      name: "Use NPM",
      value: "npm",
      short: "NPM",
    });

    const outroPrompts = [
      {
        name: "packageManager",
        type: "list",
        message:
          "Pick the package manager to use when installing dependencies:",
        choices: packageManagerChoices,
      },
    ];

    // outroPrompts.push(
    //   {
    //     name: "save",
    //     when: isManualMode,
    //     type: "confirm",
    //     message: "Save this as a preset for future projects?",
    //     default: false,
    //   },
    //   {
    //     name: "saveName",
    //     when: (answers) => answers.save,
    //     type: "input",
    //     message: "Save preset as:",
    //   }
    // );

    return outroPrompts;
  }

  resolveFinalPrompts() {
    // patch generator-injected prompts to only show in manual mode
    this.injectedPrompts.forEach((prompt) => {
      const originalWhen = prompt.when || (() => true);
      prompt.when = (answers) => {
        return isManualMode(answers) && originalWhen(answers);
      };
    });

    const prompts = [
      this.presetPrompt,
      this.featurePrompt,
      ...this.injectedPrompts,
      ...this.outroPrompts,
    ];
    debug("vue-cli:prompts")(prompts);
    return prompts;
  }

  shouldInitGit(cliOptions) {
    if (!hasGit()) {
      return false;
    }
    // --git
    if (cliOptions.forceGit) {
      return true;
    }
    // --no-git
    if (cliOptions.git === false || cliOptions.git === "false") {
      return false;
    }
    // default: true unless already in a git repo
    return !hasProjectGit(this.context);
  }
};
