import { IOpt } from '../lib/preset/service/src/index';
import { InlineConfig } from 'vite';

interface ProjectOptions {

  /**
   * Default `Conventional routing`———— Automatically generate routing configurations based on project folders
   * @description routes configure,
   */
  routes:any[];
  /**
   * where to the index.html that the root directory of project
   */
  root: string;

  /**
   * The public infrastructure path for developing or producing environmental services
   */

  base:string;

  /**
   * where to output built files
   */
  outDir: string;

  /**
   * where to put static assets (js/css/img/font/...)
   */
  assetsDir: string;

  /**
   * Alias for file system path
   */
  alias:{};

  /**
   * 
   */
  windicss:{},

  /**
   * Whether to generate a source map file after construction
   */
  souremap: boolean;

  /**
   * Automatically open the application in the browser when the development server starts up. When the value is a string, it will be used as the path name for the URL
   */
  open: string;

  /**
   * Specify which IP address the server should listen to
   */
  host: string;

  /**
   * This option allows you to create custom public chunks. When the value is in object form, each attribute represents a chunk. When the value of this option is in the form of a function, each parsed module will be processed by this function. If the function returns a string, then the module and all its dependencies will be added to a custom chunk named after the return string
   */
  codeSplit:{};

  /**
   * A function that will receive an instance of `ChainableConfig` powered by [webpack-chain](https://github.com/mozilla-neutrino/webpack-chain)
   */
  chainVite?: (config: InlineConfig) => void;
  /**
   * Set webpack configuration.  If the value is `Object`, will be merged into config.  If value is `Function`, will receive current config as argument
   */
  configureVite?: ((config: InlineConfig) => (InlineConfig | void))|InlineConfig;

  /**
   * Default: `'default'`
   *
   * Whether to perform lint-on-save during development using [eslint-loader](https://github.com/webpack-contrib/eslint-loader)
   */
  lintOnSave?: boolean | 'default' | 'warning' | 'error';

  /**
   * 
   */
  proxy:{};
  /**
   * 
   */
  mock:boolean;
  /**
   * Default: 
   * {
        verbose: true, // 是否在控制台中输出压缩结果
        disable: false, // 是否禁用压缩
        deleteOriginFile: false, // 压缩后是否删除源文件
        threshold: 1024, // 压缩前最小文件大小，单位为字节
        algorithm: 'gzip', // 使用的压缩算法
        ext: '.gz' // 生成的压缩文件后缀
      }
   *  
   */
  compression:{},

  /**
   * Option configuration for vite-plugin-service, Functional programming mode  for request backend interface, providing complete type hints
   */
  service:IOpt,
  
  /**
   * Option configuration for vite-svg-loader,You can directly import SVG files as components
   */
  svgc:{},

  /**
   *  set the `svgo` property of vite-svg-loader Option configuration that can optimize the svg
   */
  svgo:{},

  /**
   * Option configuration for vite-plugin-seo
   */
  seo:{},

  /**
   * Option configuration for vite-plugin-eslint
   */
  eslint:{},
  
  /**
   * Option configuration for vite-plugin-electron
   */
  electron:{
    entry:'',
  },
}

type ConfigFunction = () => ProjectOptions

export { ProjectOptions, ConfigFunction }
