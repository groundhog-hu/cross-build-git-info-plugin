import { writeFileSync } from 'fs';
import path from 'path';
import { generateGitInfoContent } from './git-info-core.js';

const PLUGIN_NAME = 'GitInfoGeneratorPlugin';

/**
 * 通用文件写入函数
 */
function writeFile(content, outputPath, filename) {
  const filePath = path.join(outputPath, filename);
  try {
    writeFileSync(filePath, content, 'utf-8');
    console.log(`\n✅ [${PLUGIN_NAME}] Git information file generated successfully at: ${filePath}`);
  } catch (e) {
    console.error(`\n❌ [${PLUGIN_NAME}] Failed to write file to ${filePath}. Error: ${e.message}`);
  }
}

// --- Webpack 插件实现 ---
export class WebpackGitInfoPlugin {
  constructor(options = {}) {
    this.filename = options.filename || 'git.info';
  }

  apply(compiler) {
    // 使用 Webpack 钩子，确保在资源发送到输出目录后执行
    compiler.hooks.afterEmit.tap(PLUGIN_NAME, (compilation) => {
      try {
        const content = generateGitInfoContent();
        // 获取 Webpack 的输出目录
        const outputPath = compiler.options.output.path;
        writeFile(content, outputPath, this.filename);
      } catch (e) {
        compilation.errors.push(new Error(`[${PLUGIN_NAME}] Execution error: ${e.message}`));
      }
    });
  }
}

// --- Vite/Rollup 插件实现 ---
export function viteGitInfoPlugin(options = {}) {
  const filename = options.filename || 'git.info';
  let outputPath = 'dist';

  return {
    name: 'generate-git-info-vite',
    apply: 'build',

    // configResolved 钩子用于获取配置信息
    configResolved(config) {
      // 从 Vite 配置中获取最终的输出目录
      outputPath = config.build.outDir || 'dist';
    },

    // closeBundle 钩子在所有打包工作完成后执行
    closeBundle() {
      const content = generateGitInfoContent();
      writeFile(content, outputPath, filename);
    },
  };
}