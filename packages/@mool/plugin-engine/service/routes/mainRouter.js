const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { parse, compileTemplate } = require("@vue/compiler-sfc");
const cheerio = require("cheerio");

/**
 * 递归查找目录下所有符合条件的文件
 * @param {string} dir - 要搜索的目录路径
 * @param {function} filter - 过滤函数，接收文件名并返回布尔值
 * @returns {string[]} - 符合条件的文件路径数组
 */
function findFilesRecursively(dir, filter, dirs, results = []) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);
    if (stat.isDirectory()) {
      findFilesRecursively(itemPath, filter, dirs, results);
    } else if (
      stat.isFile() &&
      filter(item) &&
      dirs.some((dir) => itemPath.includes(dir))
    ) {
      results.push(itemPath);
    }
  }
  return results;
}

/**
 * 根据配置生成 Vue 模块的源代码
 * @param {string} modulesDir - 模块目录路径
 * @param {string} configPath - 配置文件路径
 * @param {string} outputDir - 输出目录路径
 */
async function generateSourceCode(modulesDir, configPath, outputDir) {
  // 1. 加载配置文件
  const config = configPath;
  const blocksDir = path.resolve(process.cwd(), modulesDir);
  // 2. 确保输出目录存在
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  // 使用递归函数替换原来的代码
  const dirs = Object.keys(config.modules);
  const moduleFiles = findFilesRecursively(
    modulesDir,
    (file) => file == "normal.vue",
    dirs
  );

  // 4. 处理每个模块文件
  for (const moduleFile of moduleFiles) {
    const modulePath = path.join(process.cwd(), moduleFile);
    const moduleContent = fs.readFileSync(modulePath, "utf-8");

    // 5. 解析 Vue 单文件组件
    const { descriptor } = parse(moduleContent);

    // 6. 处理模板部分
    let template = descriptor.template.content;

    // 7. 使用 cheerio 解析 HTML
    const $ = cheerio.load(template, {
      xmlMode: true,
      decodeEntities: false,
    });
    const templateName = dirs.filter((dir) => moduleFile.includes(dir))[0];
    // 8. 获取模块配置
    const moduleConfig = config.modules[templateName] || {};

    // 9. 处理可编辑元素
    $("[data-edit]").each((index, element) => {
      const $element = $(element);
      const editKey = $element.attr("data-edit");

      let $newElement = null;
      // 如果配置中存在该编辑键
      if (moduleConfig[editKey]) {
        const elementConfig = moduleConfig[editKey];
        if (elementConfig.type) {
          const attributes = $element.attr(); // 获取所有属性
          const content = $element.html(); // 获取内部内容
          // 创建新的 Button 元素
          $newElement = $(`<${elementConfig.type}>`);
          // 复制所有属性
          Object.keys(attributes).forEach((attr) => {
            $newElement.attr(attr, attributes[attr]);
          });
          // 复制内部内容
          $newElement.html(content);

          // 替换原始元素
          $element.replaceWith($newElement);
        }else{
          // 如果没有指定类型，直接使用原始元素
          $newElement = $element;
        }
        // 处理循环属性
        if (elementConfig.loop) {
          const loopConfig = elementConfig.loop;
          $newElement.attr(
            "v-for",
            `(${loopConfig.item}, ${loopConfig.index}) in ${JSON.stringify(
              loopConfig.data
            )}`
          );
          $newElement.attr(":key", loopConfig.key || loopConfig.index);
        }

        // 处理条件渲染
        if (elementConfig.condition) {
          $newElement.attr("v-if", elementConfig.condition);
        }

        // 处理绑定属性
        if (elementConfig.props) {
          for (const [attr, binding] of Object.entries(elementConfig.props)) {
            if (attr === "class") {
              if (typeof binding === "string") {
                const existingClasses = $newElement.attr("class") || "";
                $newElement.attr("class", `${existingClasses} ${binding}`);
              } else if (Array.isArray(elementConfig.classes)) {
                $newElement.attr(":class", elementConfig.classes);
              } else if (typeof binding === "object") {
                $newElement.attr(
                  ":class",
                  JSON.stringify(binding).replace(/"/g, "'")
                );
              }
            } else {
              $newElement.attr(`:${attr}`, binding);
            }
          }
        }

        // 处理事件
        if (elementConfig.events) {
          for (const [event, handler] of Object.entries(elementConfig.events)) {
            $newElement.attr(`@${event}`, handler);
          }
        }

        // 处理内容
        if (elementConfig.label) {
          // if (elementConfig.content.type === "text") {

          // } else if (elementConfig.content.type === "html") {
          //   $newElement.attr("v-html", elementConfig.content.value);
          // }
          $newElement.text(`{{ '${elementConfig.label}' }}`);
        }
        // 处理样式
        if (elementConfig.styles) {
          $newElement.attr(
            ":style",
            JSON.stringify(elementConfig.styles).replace(/"/g, "'")
          );
        }
      }

      // 移除 data-edit 属性，因为它只是用于标记可编辑元素
      $newElement.removeAttr("data-edit");
    });

    // 10. 更新模板
    template = $.html();

    // 11. 处理脚本部分
    let script = descriptor.script
      ? descriptor.script.content
      : descriptor.scriptSetup && descriptor.scriptSetup.content;
    // 如果没有脚本部分，创建一个基本的
    if (!script) {
      script = `
export default {
name: '${path.basename(moduleFile, ".vue")}',
data() {
  return {};
}
}`;
    }

    // 12. 添加配置中定义的数据
    if (moduleConfig.data) {
      // 简单的方法是使用正则表达式查找 data() 函数并替换其内容
      script = script.replace(
        /data\s*$$\s*$$\s*{\s*return\s*{([^}]*)}/,
        `data() { return { $1 ${Object.entries(moduleConfig.data)
          .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
          .join(", ")} }`
      );
    }

    // 13. 添加配置中定义的方法
    if (moduleConfig.methods) {
      // 简单的方法是使用正则表达式查找 methods 对象并替换其内容
      if (script.includes("methods:")) {
        script = script.replace(
          /methods\s*:\s*{([^}]*)}/,
          `methods: { $1 ${Object.entries(moduleConfig.methods)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ")} }`
        );
      } else {
        // 如果没有 methods 对象，在 export default 对象中添加一个
        script = script.replace(
          /export\s+default\s+{([^}]*)}/,
          `export default { $1, methods: { ${Object.entries(
            moduleConfig.methods
          )
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ")} } }`
        );
      }
    }

    // 14. 添加配置中定义的计算属性
    if (moduleConfig.computed) {
      // 简单的方法是使用正则表达式查找 computed 对象并替换其内容
      if (script.includes("computed:")) {
        script = script.replace(
          /computed\s*:\s*{([^}]*)}/,
          `computed: { $1 ${Object.entries(moduleConfig.computed)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ")} }`
        );
      } else {
        // 如果没有 computed 对象，在 export default 对象中添加一个
        script = script.replace(
          /export\s+default\s+{([^}]*)}/,
          `export default { $1, computed: { ${Object.entries(
            moduleConfig.computed
          )
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ")} } }`
        );
      }
    }

    // 15. 处理样式部分
    let style =
      descriptor.styles.length > 0 ? descriptor.styles[0].content : "";

    // 如果配置中有样式定义，添加它们
    if (moduleConfig.styles) {
      style += "\n" + moduleConfig.styles;
    }

    // 16. 组合所有部分生成最终的 Vue 文件
    const finalContent = `
<template>
${template}
</template>

<script setup lang='ts'>
${script}
</script>

<style${
      descriptor.styles.length > 0 && descriptor.styles[0].scoped
        ? " scoped"
        : ""
    }>
${style}
</style>
`;

    // 17. 写入输出文件
    const outputPath = path.join(outputDir, templateName + ".vue");
    fs.writeFileSync(outputPath, finalContent);
    console.log(`Generated: ${outputPath}`);
  }

  // 18. 生成主入口文件
  generateMainFile(config, moduleFiles, outputDir);
}

/**
 * 生成主入口文件
 * @param {Object} config - 配置对象
 * @param {Array<string>} moduleFiles - 模块文件名数组
 * @param {string} outputDir - 输出目录路径
 */
function generateMainFile(config, moduleFiles, outputDir) {
  // 生成 main.js
  const mainJs = `
import { createApp } from 'vue';
import App from './App.vue';
${
  config.plugins
    ? config.plugins
        .map((plugin) => `import ${plugin.name} from '${plugin.package}';`)
        .join("\n")
    : ""
}

const app = createApp(App);

${
  config.plugins
    ? config.plugins
        .map(
          (plugin) =>
            `app.use(${plugin.name}${
              plugin.options ? `, ${JSON.stringify(plugin.options)}` : ""
            });`
        )
        .join("\n")
    : ""
}

app.mount('#app');
`;

  fs.writeFileSync(path.join(outputDir, "main.js"), mainJs);

  // 生成 App.vue
  const imports = moduleFiles
    .map((file, index) => {
      const componentName = `Module${index + 1}`;
      return `import ${componentName} from './${file}';`;
    })
    .join("\n");

  const components = moduleFiles
    .map((file, index) => {
      return `    Module${index + 1}`;
    })
    .join(",\n");

  const template = config.layout
    ? config.layout
    : moduleFiles
        .map((file, index) => {
          return `<Module${index + 1} />`;
        })
        .join("\n    ");

  const appVue = `
<template>
<div class="app">
  ${template}
</div>
</template>

<script>
${imports}

export default {
name: 'App',
components: {
${components}
},
data() {
  return {
    ${
      config.globalData
        ? Object.entries(config.globalData)
            .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
            .join(",\n      ")
        : ""
    }
  };
},
${
  config.globalMethods
    ? `methods: {
  ${Object.entries(config.globalMethods)
    .map(([key, value]) => `${key}: ${value}`)
    .join(",\n    ")}
},`
    : ""
}
${
  config.globalComputed
    ? `computed: {
  ${Object.entries(config.globalComputed)
    .map(([key, value]) => `${key}: ${value}`)
    .join(",\n    ")}
},`
    : ""
}
};
</script>

<style>
${config.globalStyles || ""}
</style>
`;

  fs.writeFileSync(path.join(outputDir, "App.vue"), appVue);

  console.log(`Generated: ${path.join(outputDir, "main.js")}`);
  console.log(`Generated: ${path.join(outputDir, "App.vue")}`);
}

// 示例配置文件格式
const exampleConfig = {
  modules: {
    "normal.vue": {
      menu: {
        classes: "p-5 box-border bottom text-surface-0",
        bindings: {
          text: true,
          plain: true,
        },
        loop: {
          data: "navItems",
          item: "item",
          index: "index",
          key: "item.id",
        },
      },
      data: {
        navItems: [
          { label: "Tab 1", content: "Tab 1 Content", value: "0" },
          { label: "Tab 2", content: "Tab 2 Content", value: "1" },
          { label: "Tab 3", content: "Tab 3 Content", value: "2" },
        ],
        siteName: "我的网站",
      },
    },
  },
  globalData: {
    theme: "light",
  },
  globalMethods: {
    toggleTheme:
      'function() { this.theme = this.theme === "light" ? "dark" : "light"; }',
  },
  layout: `
  <header-component />
  <main>
    <banner-component />
    <section v-if="theme === 'light'" class="light-section">
      <h2>Light Theme Content</h2>
    </section>
    <section v-else class="dark-section">
      <h2>Dark Theme Content</h2>
    </section>
  </main>
  <footer-component />
`,
  plugins: [
    {
      name: "VueRouter",
      package: "vue-router",
      options: {
        mode: "history",
      },
    },
  ],
  globalStyles: `
  .app {
    font-family: Arial, sans-serif;
    max-width: 1200px;
    margin: 0 auto;
  }
  .text-primary {
    color: #3498db;
  }
  .text-bold {
    font-weight: bold;
  }
  .light-section {
    background-color: #f8f9fa;
    padding: 20px;
  }
  .dark-section {
    background-color: #343a40;
    color: white;
    padding: 20px;
  }
`,
};
router.post("/generate-code", (req, res) => {
  // 获取请求体
  const requestBody = req.body;
  console.log(requestBody);

  generateSourceCode(
    "./src/pages/designer/blocks",
    requestBody,
    path.resolve(process.cwd(), "dist")
  );
  // 使用示例
  // generateSourceCode('./modules', './config.json', './output');
  res.status(200).json({
    message: "Code generated successfully",
    data: {},
  });
});

module.exports = router;
