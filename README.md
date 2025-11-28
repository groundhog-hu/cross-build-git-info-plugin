# cross-build-git-info-plugin

一个跨平台的 Webpack 和 Vite 插件，用于在项目打包后，在输出目录中生成一个详细的 `git.info` 文件。

## 💡 背景

在企业级开发中，我们经常面临私有化部署业务过多的问题。随着时间的推移，很难追踪某个特定环境部署的是哪个代码仓库的哪个分支或版本。

`cross-build-git-info-plugin` 旨在解决这个问题。它会在构建产物中自动生成一个包含详细 Git 信息的文件，方便运维和开发人员快速定位线上代码版本。

## ✨ 特性

* **跨平台支持:** 同时兼容 Webpack 和 Vite/Rollup。
* **格式统一:** 输出格式为 `key=value`，易于被后端服务或运维工具读取。
* **信息丰富:** 包含分支、Commit Hash、提交人、构建时间等详细信息。
* **零配置:** 开箱即用，同时也支持自定义文件名和输出目录。

## 📦 安装

```bash
npm install --save-dev cross-build-git-info-plugin
```

## 🚀 使用方法

### Webpack

在 `webpack.config.js` 中引入并配置插件：

```javascript
const { WebpackGitInfoPlugin } = require('cross-build-git-info-plugin');

module.exports = {
  // ... 其他配置
  plugins: [
    new WebpackGitInfoPlugin({
      // 可选：自定义输出文件名，默认为 'git.info'
      filename: 'version.txt',
      // 可选：自定义输出目录，默认使用 Webpack 配置的 output.path
      outputDir: 'dist' // 适用于 Nuxt 2 等框架，可指定确切的输出目录
    })
  ]
};
```

### Vite / Rollup

在 `vite.config.js` 或 `rollup.config.js` 中引入并配置插件：

```javascript
import { viteGitInfoPlugin } from 'cross-build-git-info-plugin';

export default {
  // ... 其他配置
  plugins: [
    viteGitInfoPlugin({
      // 可选：自定义输出文件名，默认为 'git.info'
      filename: 'version.txt',
      // 可选：自定义输出目录，默认使用 Vite 配置的 build.outDir
      outputDir: 'dist' // 适用于框架项目，可指定输出到根目录而非子目录
    })
  ]
};
```

### 配置参数说明

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `filename` | `string` | `'git.info'` | 生成的文件名 |
| `outputDir` | `string` | 自动获取 | 输出目录路径。<br>• Webpack：默认使用 `output.path`<br>• Vite：默认使用 `build.outDir`<br>• 在 Nuxt 等框架中，可手动指定以避免文件输出到错误位置 |

## 📄 输出示例

构建完成后，你将在输出目录（如 `dist/`）中看到一个 `git.info` 文件，内容如下：

```properties
git.branch=main
git.build.host=build-server-01
git.build.time=2023.11.27 16:00:00
git.build.user.email=builder@example.com
git.build.user.name=CI Builder
git.build.version=1.0.0
git.commit.id=a1b2c3d4e5f6...
git.commit.id.abbrev=a1b2c3d
git.commit.message.full=feat: add new feature\n\nDetailed description...
git.commit.message.short=feat: add new feature
git.commit.time=2023-11-27 15:50:00
git.commit.user.email=dev@example.com
git.commit.user.name=Developer
git.dirty=false
git.remote.origin.url=git@github.com:user/repo.git
git.tags=v1.0.0
```