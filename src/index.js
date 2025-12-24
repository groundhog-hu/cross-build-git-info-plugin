import { generateGitInfoContent } from './git-info-core.js';

const PLUGIN_NAME = 'GitInfoGeneratorPlugin';

// --- Webpack 插件实现 ---
export class WebpackGitInfoPlugin {
  constructor(options = {}) {
    this.filename = options.filename || 'git.info';
  }

  apply(compiler) {
    // 定义处理函数
    const emitHandler = (compilation, callback) => {
      try {
        const content = generateGitInfoContent();

        // 将文件添加到构建产物中
        compilation.assets[this.filename] = {
          source: () => content,
          size: () => content.length
        };

        callback();
      } catch (e) {
        compilation.errors.push(new Error(`[${PLUGIN_NAME}] Execution error: ${e.message}`));
        callback();
      }
    };

    // 兼容 webpack 3 和 webpack 4+
    if (compiler.hooks) {
      // Webpack 4+ 使用 hooks API
      compiler.hooks.emit.tapAsync(PLUGIN_NAME, emitHandler);
    } else {
      // Webpack 3 使用旧的 plugin API
      compiler.plugin('emit', emitHandler);
    }
  }
}

// --- Vite/Rollup 插件实现 ---
export function viteGitInfoPlugin(options = {}) {
  const filename = options.filename || 'git.info';

  return {
    name: 'generate-git-info-vite',
    apply: 'build',

    // generateBundle 钩子用于在生成包时添加额外的文件
    generateBundle() {
      const content = generateGitInfoContent();

      this.emitFile({
        type: 'asset',
        fileName: filename,
        source: content
      });
    }
  };
}