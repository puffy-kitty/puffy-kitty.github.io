# GitHub Pages 钩针图解网站

这是一个纯静态网站，可以用 GitHub Pages 免费托管，用来发布钩针图解 PDF、成品照片、材料说明和联系方式。

## 本地文件

- `index.html`：网页内容
- `styles.css`：页面样式
- `patterns/`：建议放 PDF 图解、图片或下载文件

## 发布到 GitHub Pages

1. 在 GitHub 新建一个仓库，例如 `crochet-patterns`。
2. 把这个文件夹里的文件上传到仓库。
3. 进入仓库的 `Settings`。
4. 打开 `Pages`。
5. 在 `Build and deployment` 里选择 `Deploy from a branch`。
6. Branch 选择 `main`，文件夹选择 `/root`，保存。
7. 等 GitHub 生成网址，通常是：

```text
https://你的用户名.github.io/crochet-patterns/
```

## 添加新图解

1. 把 PDF 放进 `patterns/` 文件夹，例如 `patterns/flower-coaster.pdf`。
2. 打开 `index.html`。
3. 复制一个 `<article class="pattern-card">...</article>` 卡片。
4. 修改标题、难度、说明和下载链接。

## 替换为成品照片

如果你有图片，例如 `patterns/flower-coaster.jpg`，可以把卡片里的：

```html
<div class="pattern-preview motif-a" aria-hidden="true"></div>
```

改成：

```html
<img class="pattern-image" src="patterns/flower-coaster.jpg" alt="花朵杯垫成品照片" />
```

然后在 `styles.css` 最后添加：

```css
.pattern-image {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}
```
