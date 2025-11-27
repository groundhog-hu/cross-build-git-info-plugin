import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/index.js',
  output: {
    // 输出 CommonJS 模块，以便 Webpack 和 Node.js 兼容
    file: 'dist/index.cjs',
    format: 'cjs',
    exports: 'named', // 导出具名导出的 WebpackGitInfoPlugin 和 viteGitInfoPlugin
    sourcemap: true,
  },
  plugins: [
    nodeResolve(),
    commonjs(),
  ],
  // 声明 Node.js 内置模块为外部依赖，Rollup 不应尝试打包它们
  external: ['path', 'fs', 'child_process'],
};