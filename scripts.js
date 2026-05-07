const languages = {
  zh: {
    label: "中文",
    fullName: "中文常用记号",
    body: "主体",
    hair: "头发",
    note: "备注",
    abbreviations: "缩写",
    downloadImage: "下载图片",
    downloadPdf: "下载 PDF",
    back: "返回图解列表",
    view: "查看图解",
    chartType: "文字图解"
  },
  us: {
    label: "US",
    fullName: "US Terms",
    body: "Body",
    hair: "Hair",
    note: "Note",
    abbreviations: "Abbreviations",
    downloadImage: "Download PNG",
    downloadPdf: "Download PDF",
    back: "Back to patterns",
    view: "View pattern",
    chartType: "Written pattern"
  },
  uk: {
    label: "UK",
    fullName: "UK Terms",
    body: "Body",
    hair: "Hair",
    note: "Note",
    abbreviations: "Abbreviations",
    downloadImage: "Download PNG",
    downloadPdf: "Download PDF",
    back: "Back to patterns",
    view: "View pattern",
    chartType: "Written pattern"
  }
};

const palette = {
  paper: "#eaf8fb",
  ink: "#111111",
  muted: "#6f665d",
  line: "#cfe8ef",
  rose: "#e53622",
  sage: "#4e8cc7",
  highlight: "rgba(236, 247, 92, 0.72)"
};

const app = document.querySelector("#app");
let selectedLanguage = localStorage.getItem("patternLanguage") || "zh";
let patternData = {};
let patternList = [];

window.addEventListener("hashchange", render);
document.addEventListener("click", handleClick);
init();

async function init() {
  app.innerHTML = renderLoading();

  try {
    await loadPatterns();
    render();
  } catch (error) {
    app.innerHTML = renderLoadError(error);
  }
}

async function loadPatterns() {
  const folders = await fetchJson("patterns.json");
  const patterns = await Promise.all(folders.map((folder) => loadPattern(folder)));
  patternList = patterns;
  patternData = Object.fromEntries(patterns.map((pattern) => [pattern.id, pattern]));
}

async function loadPattern(folder) {
  const markdown = await fetchText(`${folder}/pattern.MD`);
  return parsePatternMarkdown(markdown, folder);
}

async function fetchJson(path) {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Cannot load ${path}`);
  }

  return response.json();
}

async function fetchText(path) {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Cannot load ${path}`);
  }

  return response.text();
}

function parsePatternMarkdown(markdown, folder) {
  const match = markdown.match(/^---\s*([\s\S]*?)\s*---\s*([\s\S]*)$/);

  if (!match) {
    throw new Error(`${folder}/pattern.MD is missing JSON front matter`);
  }

  const meta = JSON.parse(match[1]);
  const body = match[2];
  const cover = meta.cover ? `${folder}/${meta.cover}` : "";
  const extraImages = (meta.images || []).map((image) => `${folder}/${image}`);

  return {
    id: meta.id || folder,
    folder,
    fileName: meta.fileName || folder,
    image: cover,
    images: [cover, ...extraImages].filter(Boolean),
    category: meta.category,
    tags: meta.tags || [],
    title: meta.title,
    summary: meta.summary,
    rows: parseBodyRows(body),
    notes: parseLocalizedList(body, "notes"),
    hair: parseLocalizedList(body, "hair"),
    abbreviations: parseLocalizedList(body, "abbreviations")
  };
}

function parseBodyRows(markdown) {
  const section = getSection(markdown, "body");

  return section
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("|") && !line.includes("---"))
    .slice(1)
    .map((line) => {
      const cells = line
        .split("|")
        .slice(1, -1)
        .map((cell) => cell.trim());

      return {
        round: cells[0],
        zh: cells[1],
        us: cells[2],
        uk: cells[3]
      };
    });
}

function parseLocalizedList(markdown, sectionName) {
  const section = getSection(markdown, sectionName);

  return Object.fromEntries(
    Object.keys(languages).map((language) => {
      const match = section.match(new RegExp(`###\\s+${language}\\s*([\\s\\S]*?)(?=\\n###\\s+|$)`));
      const items = match
        ? match[1]
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.startsWith("- "))
            .map((line) => line.slice(2).trim())
        : [];

      return [language, items];
    })
  );
}

function getSection(markdown, name) {
  const match = markdown.match(new RegExp(`##\\s+${name}\\s*([\\s\\S]*?)(?=\\n##\\s+|$)`));
  return match ? match[1].trim() : "";
}

async function handleClick(event) {
  const languageButton = event.target.closest("[data-language]");
  const imageButton = event.target.closest("[data-download-image]");
  const pdfButton = event.target.closest("[data-download-pdf]");

  if (languageButton) {
    selectedLanguage = languageButton.dataset.language;
    localStorage.setItem("patternLanguage", selectedLanguage);
    render();
  }

  if (imageButton) {
    const pattern = patternData[imageButton.dataset.downloadImage];
    await downloadPatternImage(pattern, selectedLanguage);
  }

  if (pdfButton) {
    const pattern = patternData[pdfButton.dataset.downloadPdf];
    await downloadPatternPdf(pattern, selectedLanguage);
  }
}

function render() {
  const route = getRoute();

  if (route.type === "pattern" && patternData[route.id]) {
    app.innerHTML = renderPatternDetail(patternData[route.id], route.id);
    return;
  }

  if (route.type === "patternIndex") {
    app.innerHTML = renderPatternIndex();
    return;
  }

  if (route.type === "about") {
    app.innerHTML = renderAbout();
    return;
  }

  if (route.type === "gallery") {
    app.innerHTML = renderGallery();
    return;
  }

  if (route.type === "contact") {
    app.innerHTML = renderContact();
    return;
  }

  app.innerHTML = renderHome();
}

function getRoute() {
  const hash = window.location.hash || "#/";
  const parts = hash.replace(/^#\/?/, "").split("/").filter(Boolean);

  if (parts[0] === "pattern" && parts[1]) {
    return { type: "pattern", id: parts.slice(1).join("/") };
  }

  if (parts[0] === "pattern") {
    return { type: "patternIndex" };
  }

  if (parts[0] === "about") {
    return { type: "about" };
  }

  if (parts[0] === "gallery") {
    return { type: "gallery" };
  }

  if (parts[0] === "contact") {
    return { type: "contact" };
  }

  return { type: "list" };
}

function renderLoading() {
  return `
    <section class="section">
      <p class="eyebrow">Loading</p>
      <h2>正在读取图解文件</h2>
    </section>
  `;
}

function renderLoadError(error) {
  const isLocalFile = window.location.protocol === "file:";

  return `
    <section class="section">
      <p class="eyebrow">Pattern Error</p>
      <h2>图解文件读取失败</h2>
      <p>${escapeHtml(error.message)}</p>
      ${
        isLocalFile
          ? `<p>当前页面是用 <code>file://</code> 打开的。这个版本需要用本地服务器打开，才能读取 <code>patterns.json</code> 和每个图解文件夹里的 <code>pattern.MD</code>。</p>
             <p>在仓库目录运行 <code>node serve-local.js</code>，然后打开 <code>http://127.0.0.1:4173/</code>。</p>`
          : `<p>请确认 <code>patterns.json</code> 中登记的文件夹存在，并且每个文件夹内都有 <code>pattern.MD</code>。</p>`
      }
    </section>
  `;
}

function renderHome() {
  const featuredPattern = patternList[0];
  const seriesData = [
    {
      eyebrow: "Pattern",
      title: "钩针软糖图解",
      description: "原创玩偶和小物的文字图解档案。每份图解都有独立文件夹、图片和多语言记号。",
      image: featuredPattern ? featuredPattern.image : "assets/larvitar-pattern-2.jpeg",
      href: "#/pattern"
    },
    {
      eyebrow: "Gallery",
      title: "OC 定制展示",
      description: "角色定制、成品照片和灵感记录。这里更像作品集，不是商品列表。",
      image: featuredPattern?.images[1] || "assets/larvitar-pattern-1.jpeg",
      href: "#/gallery"
    }
  ];

  const rows = seriesData
    .map((series) => {
      return `
        <a class="series-row" href="${series.href}">
          <div>
            <p class="eyebrow">${series.eyebrow}</p>
            <h2>${series.title}</h2>
            <p>${series.description}</p>
          </div>
          <img src="${series.image}" alt="" />
        </a>
      `;
    })
    .join("");

  return `
    <section class="home-hero">
      <div class="home-portrait">
        <img src="${featuredPattern ? featuredPattern.image : "assets/larvitar-pattern-1.jpeg"}" alt="" />
        <span class="portrait-doodle heart">♥</span>
        <span class="portrait-doodle face">^^</span>
      </div>
      <div class="home-intro">
        <p class="eyebrow">Puffy Kitty Studio</p>
        <h1>把毛线变成软糖一样的小角色。</h1>
        <p>
          这里是我的钩针图解、OC 定制和制作记录。页面会保持手帐式的浅蓝底、圆润字和图解纸张感，
          像一个慢慢扩展的创作档案。
        </p>
      </div>
    </section>
    <section class="series-list" aria-label="作品系列">
      ${rows}
    </section>
  `;
}

function renderPatternIndex() {
  const cards = patternList
    .map((pattern) => {
      return `
        <article class="pattern-card list-card">
          <a class="card-link" href="#/pattern/${pattern.id}">
            ${renderPreview(pattern, "pattern-preview")}
            <div class="pattern-body">
              <div class="pattern-meta">
                ${renderPatternTags(pattern)}
                <span>${languages[selectedLanguage].chartType}</span>
              </div>
              <h2>${getLocalized(pattern.title)}</h2>
              <p>${getLocalized(pattern.summary)}</p>
              <span class="text-link">${languages[selectedLanguage].view}</span>
            </div>
          </a>
        </article>
      `;
    })
    .join("");

  return `
    <section class="section">
      <a class="back-link" href="#/">返回主页</a>
      <div class="section-heading">
      <p class="eyebrow">Pattern Library</p>
        <h2>钩针软糖图解</h2>
      </div>
      <div class="pattern-grid">${cards}</div>
    </section>
  `;
}

function renderPreview(pattern, className) {
  if (pattern.image) {
    return `
      <div class="${className} photo-preview" aria-hidden="true">
        <img src="${pattern.image}" alt="" />
        <span class="preview-spark spark-one"></span>
        <span class="preview-spark spark-two"></span>
        <span class="preview-spark spark-three"></span>
      </div>
    `;
  }

  return `
    <div class="${className} crochet-preview" aria-hidden="true">
      <span class="preview-loop loop-one"></span>
      <span class="preview-loop loop-two"></span>
      <span class="preview-loop loop-three"></span>
      <span class="preview-hook"></span>
    </div>
  `;
}

function renderPatternTags(pattern) {
  const tags = [pattern.category, ...(pattern.tags || [])]
    .map((tag) => getLocalized(tag))
    .filter(Boolean);

  return tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("");
}

function renderPatternDetail(pattern, id) {
  const term = languages[selectedLanguage];

  return `
    <section class="section detail-section">
    <a class="back-link" href="#/pattern">${term.back}</a>
    <article class="detail-layout">
      <aside class="detail-aside">
        ${renderImageCarousel(pattern)}
        <div class="language-panel">
          <p class="eyebrow">Terms</p>
          <div class="language-toggle" role="group" aria-label="切换钩针语言">
            ${Object.entries(languages)
              .map(([key, language]) => {
                const active = key === selectedLanguage ? "is-active" : "";
                return `<button class="${active}" type="button" data-language="${key}">${language.label}</button>`;
              })
              .join("")}
          </div>
          <p>${term.fullName}</p>
        </div>
      </aside>

      <section class="pattern-detail">
        <div class="pattern-meta">
          ${renderPatternTags(pattern)}
          <span>${term.chartType}</span>
        </div>
        <h2>${getLocalized(pattern.title)}</h2>
        <p>${getLocalized(pattern.summary)}</p>

        ${renderPatternSheet(pattern, selectedLanguage)}

        <div class="download-actions">
          <button type="button" data-download-image="${id}">${term.downloadImage}</button>
          <button type="button" data-download-pdf="${id}">${term.downloadPdf}</button>
        </div>
      </section>
    </article>
    </section>
  `;
}

function renderImageCarousel(pattern) {
  const slides = pattern.images
    .map((image, index) => {
      return `
        <figure class="carousel-slide">
          <img src="${image}" alt="${getLocalized(pattern.title)} 图片 ${index + 1}" />
        </figure>
      `;
    })
    .join("");

  return `
    <div class="detail-gallery" aria-label="${getLocalized(pattern.title)} 图片">
      <div class="image-carousel">${slides}</div>
      <div class="carousel-hint">← swipe →</div>
    </div>
  `;
}

function renderPatternSheet(pattern, language) {
  const term = languages[language];
  const rows = pattern.rows
    .map((row) => `<li><span>${escapeHtml(row.round)}</span><strong>${escapeHtml(row[language])}</strong></li>`)
    .join("");

  return `
    <div class="pattern-sheet">
      <div class="sheet-header">
        <p>Puffy Kitty Pattern · ${term.fullName}</p>
        <h3>${getLocalized(pattern.title)}</h3>
      </div>

      <section class="sheet-section">
        <h4>${term.body}</h4>
        <ol class="round-list">${rows}</ol>
      </section>

      <section class="sheet-section">
        <h4>${term.note}</h4>
        ${renderLines(pattern.notes[language])}
      </section>

      <section class="sheet-section">
        <h4>${term.hair}</h4>
        ${renderLines(pattern.hair[language])}
      </section>

      <section class="sheet-section abbreviations">
        <h4>${term.abbreviations}</h4>
        ${renderLines(pattern.abbreviations[language])}
      </section>
    </div>
  `;
}

function renderLines(lines) {
  return lines.map((line) => `<p>${escapeHtml(line)}</p>`).join("");
}

function renderAbout() {
  return `
    <section class="section">
    <div class="split">
      <div>
        <p class="eyebrow">Workflow</p>
        <h2>后续添加图解的方式</h2>
      </div>
      <div class="notes">
        <p>每个图解放在多层归档文件夹中，例如 <code>patterns/gummy/pokemon/ralts/</code>。</p>
        <p>图解文字维护在文件夹内的 <code>pattern.MD</code>，封面和过程图也放在同一个文件夹。</p>
        <p><code>patterns.json</code> 只负责登记有哪些图解文件夹；下载图片和 PDF 会使用当前切换的语言版本。</p>
      </div>
    </div>
    </section>
  `;
}

function renderGallery() {
  const images = patternList.flatMap((pattern) => pattern.images);

  return `
    <section class="section">
    <a class="back-link" href="#/">返回主页</a>
    <div class="section-heading">
      <p class="eyebrow">Gallery</p>
      <h2>OC 定制展示</h2>
    </div>
    <div class="gallery-grid">
      ${images.map((image, index) => `<img src="${image}" alt="作品图片 ${index + 1}" />`).join("")}
    </div>
    </section>
  `;
}

function renderContact() {
  return `
    <section class="section">
    <div class="contact">
      <p class="eyebrow">Contact</p>
      <h2>购买、授权或合作</h2>
      <p>邮箱：your-name@example.com</p>
    </div>
    </section>
  `;
}

function getPrintablePattern(pattern, language) {
  const term = languages[language];

  return {
    fileName: `${pattern.fileName}-${language}`,
    title: getLocalized(pattern.title, language),
    subtitle: `Puffy Kitty Pattern · ${term.fullName}`,
    sections: [
      {
        heading: term.body,
        lines: pattern.rows.map((row) => `${row.round}: ${row[language]}`)
      },
      {
        heading: term.note,
        lines: pattern.notes[language]
      },
      {
        heading: term.hair,
        lines: pattern.hair[language]
      },
      {
        heading: term.abbreviations,
        lines: pattern.abbreviations[language]
      }
    ]
  };
}

async function downloadPatternImage(pattern, language) {
  await ensurePatternFont();
  const printable = getPrintablePattern(pattern, language);
  const canvas = createPatternCanvas(printable);
  downloadDataUrl(canvas.toDataURL("image/png"), `${printable.fileName}.png`);
}

async function downloadPatternPdf(pattern, language) {
  await ensurePatternFont();
  const printable = getPrintablePattern(pattern, language);
  const canvas = createPatternCanvas(printable);
  const jpegDataUrl = canvas.toDataURL("image/jpeg", 0.95);
  const pdfBlob = createPdfFromJpeg(jpegDataUrl, canvas.width, canvas.height);
  downloadBlob(pdfBlob, `${printable.fileName}.pdf`);
}

async function ensurePatternFont() {
  if (!document.fonts) {
    return;
  }

  await document.fonts.load("25px 'cjkFonts 全瀨體'");
  await document.fonts.ready;
}

function createPatternCanvas(pattern) {
  const scale = 2;
  const width = 900;
  const height = getCanvasHeight(pattern);
  const canvas = document.createElement("canvas");
  canvas.width = width * scale;
  canvas.height = height * scale;

  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);
  ctx.fillStyle = palette.paper;
  ctx.fillRect(0, 0, width, height);

  drawDecor(ctx, width);

  let y = 70;
  ctx.fillStyle = palette.rose;
  ctx.font = "700 18px 'cjkFonts 全瀨體', Comic Sans MS, Microsoft YaHei, sans-serif";
  ctx.fillText(pattern.subtitle, 64, y);

  y += 52;
  ctx.fillStyle = palette.ink;
  ctx.font = "700 48px 'cjkFonts 全瀨體', Comic Sans MS, Microsoft YaHei, sans-serif";
  ctx.fillText(pattern.title, 64, y);

  y += 38;
  ctx.strokeStyle = palette.line;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(64, y);
  ctx.lineTo(width - 64, y);
  ctx.stroke();

  y += 54;
  pattern.sections.forEach((section) => {
    ctx.fillStyle = palette.sage;
    ctx.font = "700 26px 'cjkFonts 全瀨體', Comic Sans MS, Microsoft YaHei, sans-serif";
    ctx.fillText(section.heading, 64, y);
    y += 34;

    section.lines.forEach((line) => {
      const wrapped = wrapText(ctx, line, width - 128, "25px 'cjkFonts 全瀨體', Comic Sans MS, Microsoft YaHei, sans-serif");
      wrapped.forEach((text) => {
        if (section.heading === languages.zh.note || section.heading === languages.us.note || section.heading === languages.uk.note) {
          ctx.fillStyle = palette.highlight;
          ctx.fillRect(75, y - 24, Math.min(ctx.measureText(text).width + 18, width - 150), 30);
        }
        ctx.fillStyle = palette.ink;
        ctx.font = "25px 'cjkFonts 全瀨體', Comic Sans MS, Microsoft YaHei, sans-serif";
        ctx.fillText(text, 82, y);
        y += 34;
      });
    });

    y += 24;
  });

  ctx.fillStyle = palette.muted;
  ctx.font = "16px 'cjkFonts 全瀨體', Comic Sans MS, Microsoft YaHei, sans-serif";
  ctx.fillText("© 2026 Puffy Kitty", 64, height - 44);

  return canvas;
}

function getCanvasHeight(pattern) {
  const lineCount = pattern.sections.reduce((total, section) => total + section.lines.length + 2, 0);
  return Math.max(760, 250 + lineCount * 42);
}

function drawDecor(ctx, width) {
  ctx.strokeStyle = "rgba(182, 95, 114, 0.28)";
  ctx.lineWidth = 6;

  for (let i = 0; i < 5; i += 1) {
    ctx.beginPath();
    ctx.ellipse(width - 120 - i * 42, 86 + i * 18, 32, 18, -0.55, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(111, 132, 103, 0.18)";
  ctx.beginPath();
  ctx.arc(width - 92, 188, 54, 0, Math.PI * 2);
  ctx.fill();
}

function wrapText(ctx, text, maxWidth, font) {
  ctx.font = font;
  const words = Array.from(text);
  const lines = [];
  let line = "";

  words.forEach((char) => {
    const nextLine = line + char;
    if (ctx.measureText(nextLine).width > maxWidth && line) {
      lines.push(line);
      line = char;
    } else {
      line = nextLine;
    }
  });

  if (line) {
    lines.push(line);
  }

  return lines;
}

function createPdfFromJpeg(jpegDataUrl, imageWidth, imageHeight) {
  const binary = atob(jpegDataUrl.split(",")[1]);
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const margin = 28;
  const imageRatio = imageWidth / imageHeight;
  const fitWidth = pageWidth - margin * 2;
  const fitHeight = fitWidth / imageRatio;
  const finalHeight = Math.min(fitHeight, pageHeight - margin * 2);
  const finalWidth = finalHeight * imageRatio;
  const x = (pageWidth - finalWidth) / 2;
  const y = pageHeight - margin - finalHeight;

  const contentStream = `q\n${finalWidth.toFixed(2)} 0 0 ${finalHeight.toFixed(2)} ${x.toFixed(2)} ${y.toFixed(2)} cm\n/Im0 Do\nQ`;
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`,
    `<< /Type /XObject /Subtype /Image /Width ${imageWidth} /Height ${imageHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${binary.length} >>\nstream\n${binary}\nendstream`,
    `<< /Length ${contentStream.length} >>\nstream\n${contentStream}\nendstream`
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  const bytes = new Uint8Array(pdf.length);
  for (let i = 0; i < pdf.length; i += 1) {
    bytes[i] = pdf.charCodeAt(i) & 0xff;
  }

  return new Blob([bytes], { type: "application/pdf" });
}

function getLocalized(value, language = selectedLanguage) {
  if (!value || typeof value === "string") {
    return value || "";
  }

  return value[language] || value.zh || value.us || value.uk || "";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function downloadDataUrl(dataUrl, fileName) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = fileName;
  link.click();
}

function downloadBlob(blob, fileName) {
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}
