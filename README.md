### Beaudar（表达）

> Beaudar 名称源于粤语“表达”的发音，是 [Utterances](http://utteranc.es) 的中文版本。
> 任何疑问，mail@lipk.org。

- [在 Github 开源](http://github.com/beaudar/beaudar)。
- 没有追踪，没有广告，永久免费。
- 不保留数据，所有数据保存在用户 GitHub issue 中。
- 有源于 Github 风格的多种主题，支持黑夜主题。
- 轻量化，没有字体下载，没有 JS 框架加载，没有 polyfills 兼容上古浏览器。

#### Beaudar 是如何运行的？

Beaudar 加载时，将使用 GitHub issue 搜索 API 根据 url，“路径名”或“标题”查找与页面相关的 issue。如果找不到与页面匹配的 issue，那就没 issue，当有人首次发表评论时，Beaudar-bot 会自动创建一个 issue。
