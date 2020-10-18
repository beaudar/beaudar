### Beaudar - 表达

> Beaudar 名称源于粤语“表达”的发音，是 [Utterances](http://utteranc.es) 的中文版本。
> 在[这篇博客](https://lipk.org/blog/2020/05/31/how-to-use-beaudar/)查看更多。

- [开源](http://github.com/beaudar/beaudar)。📖
- 没有追踪，没有广告，永久免费。♻️
- 不保留数据，所有数据保存在用户 GitHub issue 中。📚
- 有源于 [Github primer](https://primer.style/) 的多个主题。🌈
- 轻量化，没有字体下载，没有 JS 框架加载，没有 polyfills。🍜

#### 与 Utterances 比较，Beaudar 增加了什么？

- 中文界面，拉近距离增加评论友好性。 是 Utterances 的中文版。
- 完整头像，移动端与桌面端一致显示。 Utterances 在页面宽度缩小后会隐藏头像。
- 身份标识，在任何情况下都不会换行。 Utterances 在页面宽度缩小后身份标识会换行。
- 评论时间，缩小至与身份标识相同大。 针对中文，优化显示。
- 名称显示，评论者名称放大增加辨识。 针对中文，优化显示。
- 链接打开，从新标签页打开符合习惯。 新标签页打开链接，才是操作友好、符合习惯的。
- 错误信息，使用对话框形式友好呈现。 Utterances 的错误信息只打印在浏览器控制台。
- 评论头像，增加可以使用 Tab 键选中。 头像可以跳转到用户 GitHub，Utterances 头像设置为了不可选中，无障碍操作不友好。
- 加载状态，默认加载状态可配置去除。 Utterances 没有加载中的状态，配置 `loading="false"` 可以去除加载状态。
- 移除来源，点击加载图标跳转至主页。 移除了 `powered by utteranc.es` 的超链接。
- 刷新页面，出现错误异常可进行刷新。 因为国内请求 api.github.com 非常不稳定，故添加了这个功能。
- 保持主题，刷新页面时主题将会保持。 状态保持在浏览器 `sessionStorage` 中关闭页面会重新加载。

#### Beaudar 是如何工作的？

&emsp;&emsp;Beaudar 加载时，将使用 GitHub issue 搜索 API 根据 url，“路径名”或“标题”查找与页面相关的 issue。如果找不到与页面匹配的 issue，即没有评论，当有人首次发表评论时，[Beaudar-bot](https://github.com/beaudar-bot) 会自动创建一个 issue。
[查看如何在本地运行](https://lipk.org/blog/2020/06/08/run-utterances/)。

#### 更多详情

- [关于 Beaudar 的 Q&A](https://lipk.org/blog/2020/06/08/beauder-qa/)
- [使用评论插件 Beaudar 表达](https://lipk.org/blog/2020/05/31/how-to-use-beaudar/)
- [安全评估报告](https://lipk.org/blog/2020/07/16/beaudar-safety-assessment-report/)
- [隐私政策](https://github.com/beaudar/beaudar/blob/master/PRIVACY-POLICY.md)
