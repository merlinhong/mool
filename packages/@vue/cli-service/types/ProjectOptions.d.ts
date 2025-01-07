import { IOpt } from '../lib/preset/service/index';
import ChainableViteConfig from 'vite-chainable';
import { InlineConfig } from 'vite';
type PredefinedOptions<T> = T & { [key: string]: any }

interface ProjectOptions {
  /**
   * where to the index.html that the root directory of project
   */
  root: string,

  /**
   * The public infrastructure path for developing or producing environmental services
   */

  base:string,

  /**
   * where to output built files
   */
  outDir: string,

  /**
   * where to put static assets (js/css/img/font/...)
   */
  assetsDir: string,

  /**
   * Alias for file system path
   */
  alias:{},

  /**
   * Whether to generate a source map file after construction
   */
  souremap: boolean,

  /**
   * Automatically open the application in the browser when the development server starts up. When the value is a string, it will be used as the path name for the URL
   */
  open: string,

  /**
   * Specify which IP address the server should listen to
   */
  host: string,

  /**
   * This option allows you to create custom public chunks. When the value is in object form, each attribute represents a chunk. When the value of this option is in the form of a function, each parsed module will be processed by this function. If the function returns a string, then the module and all its dependencies will be added to a custom chunk named after the return string
   */
  codeSplit:{},

  /**
   * A function that will receive an instance of `ChainableConfig` powered by [webpack-chain](https://github.com/mozilla-neutrino/webpack-chain)
   */
  chainVite?: (config: ChainableViteConfig) => void;
  /**
   * Set webpack configuration.  If the value is `Object`, will be merged into config.  If value is `Function`, will receive current config as argument
   */
  configureVite?: ((config: InlineConfig) => (InlineConfig | void));

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
   * 
   */
  compression:{},

  /**
   * Option configuration for vite-plugin-service
   */
  service:IOpt,

  /**
   * Option configuration for vite-svg-loader
   */
  svgc:{},

  /**
   * Option configuration for vite-plugin-svgo
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
