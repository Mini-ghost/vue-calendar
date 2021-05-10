# vue-calendar

## Commit Message

### 約定式提交

使用 [commitlint](https://github.com/conventional-changelog/commitlint) 做為 commit 風格管理。

### Commit Message 格式

```text
<type>(<scope>?): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>?
```

例如：

```shell
echo "feat(帳務管理): 這次 commit 新增了那些功能呢

盡量簡單且詳細的說明

BREAKING CHANGE: 如果是很重大的更新在這裡說明一下吧"
```

```shell
echo "fix(帳務管理): 這次 commit 修改了那些功能呢（#修復的 issues 編號）?

盡量簡單且詳細的說明
```

### Common Types

| type     | 說明                                                                          |
| -------- | ---------------------------------------------------------------------------- |
| feat     | 增加或修改功能                                                                 |
| fix      | 功能修復 bug（build 相關的不在該範圍）                                            |
| perf     | 針對改善效能做的修改                                                            |
| docs     | 新增、修改文件內容                                                              |
| style    | 不影響代碼含義的改動，例如去掉空格、改變縮進、增刪分號                                |
| refactor | 重構（即不是新增功能，也不是修改bug的代碼變動，重命名變量也算）                        |
| test     | 添加測試或者修改現有測試                                                         |
| build    | 構造工具的或者外部依賴的改動，例如：webpack、npm 等                                 |
| ci       | 與 CI（持續集成服務）有關的改動                                                   |
| chore    | 非上述狀態的修改，不涉及 code 的修改，例如修改 stylelint.config.js、.eslintrc.js    |
| revert   | 撤銷先前的 commit                                                              |
