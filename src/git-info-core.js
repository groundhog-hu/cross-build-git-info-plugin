import { execSync } from 'child_process';
import os from 'os';
import fs from 'fs';
import path from 'path';

/**
 * 辅助函数：安全地执行 Git 命令
 * @param {string} command 要执行的 Git 命令
 * @returns {string} 命令执行结果，去除首尾空白
 */
function getGitInfo(command) {
  try {
    // execSync同步执行命令
    return execSync(command, { encoding: 'utf8', stdio: 'pipe' }).trim();
  } catch (error) {
    // 在非 Git 仓库中执行时返回默认值
    return '';
  }
}

/**
 * 获取 package.json 中的版本号
 */
function getPackageVersion() {
  try {
    const packageJsonPath = path.resolve(process.cwd(), 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      return packageJson.version || '';
    }
  } catch (e) {
    // ignore
  }
  return '';
}

/**
 * 获取所有 Git 信息，并格式化为 key=value 字符串
 * @returns {string} 格式化后的 Git 信息内容
 */
export function generateGitInfoContent() {
  // 1. 获取所有 Git 信息

  // 构建时间格式化：YYYY.MM.DD HH:MM:SS
  const buildTime = new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).replace(/\//g, '.').replace(', ', ' ').replace(/:/g, '\\:'); // 冒号转义

  const commitHash = getGitInfo('git rev-parse HEAD');
  const commitHashShort = getGitInfo('git rev-parse --short HEAD');

  // 提交时间格式化为 YYYY-MM-DD HH:MM:SS (并转义冒号)
  const commitTimeRaw = getGitInfo('git log -1 --pretty=format:%ci');
  const commitTime = commitTimeRaw ? `${commitTimeRaw.split(' ')[0]} ${commitTimeRaw.split(' ')[1]}`.replace(/:/g, '\\:') : '';

  const commitUserEmail = getGitInfo('git log -1 --pretty=format:%ae');
  const commitUserName = getGitInfo('git log -1 --pretty=format:%an');
  // 提交信息处理：换行符转义为 \n
  const commitMessageFull = getGitInfo('git log -1 --pretty=format:%B').replace(/\n/g, '\\n');
  const commitMessageShort = getGitInfo('git log -1 --pretty=format:%s');

  const branchName = getGitInfo('git rev-parse --abbrev-ref HEAD');

  const remoteUrl = getGitInfo('git config --get remote.origin.url');
  // 多个 tag 用逗号分隔
  const tags = getGitInfo('git tag --points-at HEAD').replace(/\n/g, ',');
  // 检查工作区是否干净
  const isDirty = getGitInfo('git status --porcelain').length > 0;

  // 2. 格式化为 key=value 字符串数组
  const gitInfoArray = [
    `git.branch=${branchName}`,
    `git.build.host=${os.hostname()}`,
    `git.build.time=${buildTime}`,
    `git.build.user.email=${process.env.BUILD_USER_EMAIL || ''}`,
    `git.build.user.name=${process.env.BUILD_USER_NAME || ''}`,
    `git.build.version=${getPackageVersion()}`,
    `git.commit.id=${commitHash}`,
    `git.commit.id.abbrev=${commitHashShort}`,
    `git.commit.id.describe=${commitHashShort}`,
    `git.commit.id.describe-short=${commitHashShort}`,
    `git.commit.message.full=${commitMessageFull}`,
    `git.commit.message.short=${commitMessageShort}`,
    `git.commit.time=${commitTime}`,
    `git.commit.user.email=${commitUserEmail}`,
    `git.commit.user.name=${commitUserName}`,
    `git.dirty=${isDirty}`,
    `git.remote.origin.url=${remoteUrl}`,
    `git.tags=${tags}`,
  ];

  return gitInfoArray.join('\n');
}