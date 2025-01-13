import { type IOpt } from 'vite-plugin-service';
import {type UserOptions} from 'vite-plugin-pages';
import { InlineConfig,ProxyOptions } from 'vite';
import {OutputOptions} from 'rollup';
interface ProjectOptions {

  /**
   * Option configuration for vite-plugin-pages
   * @default dirs: ['src/pages'],
   */
  route:UserOptions;
  /**
   * Default `process.cwd()`;
   * where to the index.html that the root directory of project
   */
  root: string;

  /**
   * Default `/`
   * The public infrastructure path for developing or producing environmental services
   */

  base:string;

  /**
   * Default `dist`;
   * where to output built files
   */
  outDir: string;

  /**
   * Default `assets`;
   * where to put static assets (js/css/img/font/...)
   */
  assetsDir: string;

  /**
   * Default `{}`;
   * Alias for file system path
   */
  alias:{};

  /**
   * windicss 
   */
  windicss:{},

  /**
   * Default `false`;
   * Whether to generate a source map file after construction
   */
  souremap: boolean;

  /**
   * Automatically open the application in the browser when the development server starts up. When the value is a string, it will be used as the path name for the URL
   */
  open: boolean|string;

  /**
   * Specify which IP address the server should listen to
   */
  host: string;

  /**
   * Default `8080`
   *  port for development serve
   */
  port:number;

  /**
   * This option allows you to create custom public chunks. When the value is in object form, each attribute represents a chunk. When the value of this option is in the form of a function, each parsed module will be processed by this function. If the function returns a string, then the module and all its dependencies will be added to a custom chunk named after the return string
   */
  codeSplitting:OutputOptions['manualChunks'];

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
   * Whether to perform lint-on-save during development
   */
  lintOnSave?: boolean | 'default' | 'warning' | 'error';

  /**
   * Interface proxy configuration
   */
  proxy:Record<string, string | ProxyOptions>;

  /**
   * Default `false`
   * if enable the mock service
   */
  mock:boolean;

  /**
   * 
   * @default 
   *  {
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
   * @default
   * {
   *   path:'src/service',
   *   dts:'service.d.ts'
   * }
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

type ConfigFunction = () => Partial<ProjectOptions>

export { ProjectOptions, ConfigFunction }
