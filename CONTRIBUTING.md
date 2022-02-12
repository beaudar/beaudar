## 贡献指南

### 本地运行

**Node** 版本 v16

1. 克隆仓库

```bash
git clone https://github.com/beaudar/beaudar
```

3. 安装依赖

```bash
cd beaudar
npm install
```

4. 运行

```bash
npm start
```

此命令将会编译源文件并启动开发 Web 服务器。 对源 TypeScript，HTML 和 CSS 文件所做的任何更改都会自动重新编译。
当项目启动后，浏览器将会自动打开 `http://localhost:3000`。

> aip.github.com 请求出错，请在 host 中设置 `aip.github.com` 的重定向，使其请求不被重置。

### 主题开发

每个主题都位于 `src/stylesheets/themes` 的子目录中。

- 主题必须在 `github-syntax.css` 设置对应的代码高亮语义。
- **pull request** 请提交到 `develop` 分支。
