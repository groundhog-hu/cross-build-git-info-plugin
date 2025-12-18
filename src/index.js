import { generateGitInfoContent } from './git-info-core.js';

const PLUGIN_NAME = 'GitInfoGeneratorPlugin';

// --- Webpack 插件实现 ---
export class WebpackGitInfoPlugin {
  constructor(options = {}) {
    this.filename = options.filename || 'git.info';
  }

  apply(compiler) {
    // 使用 emit 钩子，这是生成资源的标准时机
    compiler.hooks.emit.tapAsync(PLUGIN_NAME, (compilation, callback) => {
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
    });
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