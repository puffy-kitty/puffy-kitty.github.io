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

const patternData = {
  "main-body": {
    fileName: "puffy-kitty-main-body",
    category: "主体",
    title: {
      zh: "主体与头发",
      us: "Body and Hair",
      uk: "Body and Hair"
    },
    summary: {
      zh: "第一版示例图解。适合先确定网页展示、语言切换和下载生成方式。",
      us: "First sample pattern for testing page layout, term switching, and generated downloads.",
      uk: "First sample pattern for testing page layout, term switching, and generated downloads."
    },
    rows: [
      { round: "R1", zh: "4x", us: "4 sc", uk: "4 dc" },
      { round: "R2", zh: "4v", us: "4 inc", uk: "4 inc" },
      { round: "R3", zh: "2(3x, v)", us: "2(3 sc, inc)", uk: "2(3 dc, inc)" },
      { round: "R4", zh: "2(2x, v, 2x)", us: "2(2 sc, inc, 2 sc)", uk: "2(2 dc, inc, 2 dc)" },
      { round: "R5", zh: "3(3x, v)", us: "3(3 sc, inc)", uk: "3(3 dc, inc)" },
      { round: "R6", zh: "3(2x, v, 2x)", us: "3(2 sc, inc, 2 sc)", uk: "3(2 dc, inc, 2 dc)" },
      { round: "R7", zh: "6(x, v, x)", us: "6(sc, inc, sc)", uk: "6(dc, inc, dc)" },
      { round: "R8", zh: "8x, 8x, 8x", us: "8 sc, 8 sc, 8 sc", uk: "8 dc, 8 dc, 8 dc" },
      { round: "R9-10", zh: "10x, 4x, 10x", us: "10 sc, 4 sc, 10 sc", uk: "10 dc, 4 dc, 10 dc" },
      { round: "R11", zh: "9x, 6x, 9x", us: "9 sc, 6 sc, 9 sc", uk: "9 dc, 6 dc, 9 dc" },
      { round: "R12", zh: "4a, 4a, 4a", us: "4 dec, 4 dec, 4 dec", uk: "4 dec, 4 dec, 4 dec" }
    ],
    notes: {
      zh: ["R12 根据带线方式调整，不漏白线就行。"],
      us: ["Adjust R12 depending on how you carry the yarn. The white strand should not show."],
      uk: ["Adjust R12 depending on how you carry the yarn. The white strand should not show."]
    },
    hair: {
      zh: ["10ch，倒 2 回钩 9T，第一个 T 钩无痕起立。"],
      us: ["Ch 10, start in the 2nd chain from hook and work 9 hdc. Use an invisible standing hdc for the first hdc."],
      uk: ["Ch 10, start in the 2nd chain from hook and work 9 htr. Use an invisible standing htr for the first htr."]
    },
    abbreviations: {
      zh: ["x = 短针，v = 加针，a = 减针，ch = 锁针，T = 中长针。"],
      us: ["sc = single crochet, inc = increase, dec = decrease, ch = chain, hdc = half double crochet."],
      uk: ["dc = double crochet, inc = increase, dec = decrease, ch = chain, htr = half treble crochet."]
    }
  }
};

const palette = {
  paper: "#fffdf9",
  ink: "#27221d",
  muted: "#6f665d",
  line: "#ddd6cc",
  rose: "#b65f72",
  sage: "#6f8467"
};

const app = document.querySelector("#app");
let selectedLanguage = localStorage.getItem("patternLanguage") || "zh";

window.addEventListener("hashchange", render);
document.addEventListener("click", handleClick);
render();

function handleClick(event) {
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
    downloadPatternImage(pattern, selectedLanguage);
  }

  if (pdfButton) {
    const pattern = patternData[pdfButton.dataset.downloadPdf];
    downloadPatternPdf(pattern, selectedLanguage);
  }
}

function render() {
  const route = getRoute();

  if (route.type === "pattern" && patternData[route.id]) {
    app.innerHTML = renderPatternDetail(patternData[route.id], route.id);
    return;
  }

  if (route.type === "about") {
    app.innerHTML = renderAbout();
    return;
  }

  if (route.type === "contact") {
    app.innerHTML = renderContact();
    return;
  }

  app.innerHTML = renderPatternList();
}

function getRoute() {
  const hash = window.location.hash || "#/";
  const parts = hash.replace(/^#\/?/, "").split("/").filter(Boolean);

  if (parts[0] === "patterns" && parts[1]) {
    return { type: "pattern", id: parts[1] };
  }

  if (parts[0] === "about") {
    return { type: "about" };
  }

  if (parts[0] === "contact") {
    return { type: "contact" };
  }

  return { type: "list" };
}

function renderPatternList() {
  const cards = Object.entries(patternData)
    .map(([id, pattern]) => {
      return `
        <article class="pattern-card list-card">
          <a class="card-link" href="#/patterns/${id}">
            <div class="pattern-preview crochet-preview" aria-hidden="true">
              <span class="preview-loop loop-one"></span>
              <span class="preview-loop loop-two"></span>
              <span class="preview-loop loop-three"></span>
              <span class="preview-hook"></span>
            </div>
            <div class="pattern-body">
              <div class="pattern-meta">
                <span class="tag">${pattern.category}</span>
                <span>${languages[selectedLanguage].chartType}</span>
              </div>
              <h2>${pattern.title[selectedLanguage]}</h2>
              <p>${pattern.summary[selectedLanguage]}</p>
              <span class="text-link">${languages[selectedLanguage].view}</span>
            </div>
          </a>
        </article>
      `;
    })
    .join("");

  return `
    <div class="section-heading">
      <p class="eyebrow">Pattern Library</p>
      <h2>图解列表</h2>
    </div>
    <div class="pattern-grid">${cards}</div>
  `;
}

function renderPatternDetail(pattern, id) {
  const term = languages[selectedLanguage];

  return `
    <a class="back-link" href="#/">${term.back}</a>
    <article class="detail-layout">
      <aside class="detail-aside">
        <div class="pattern-preview crochet-preview compact-preview" aria-hidden="true">
          <span class="preview-loop loop-one"></span>
          <span class="preview-loop loop-two"></span>
          <span class="preview-loop loop-three"></span>
          <span class="preview-hook"></span>
        </div>
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
          <span class="tag">${pattern.category}</span>
          <span>${term.chartType}</span>
        </div>
        <h2>${pattern.title[selectedLanguage]}</h2>
        <p>${pattern.summary[selectedLanguage]}</p>

        ${renderPatternSheet(pattern, selectedLanguage)}

        <div class="download-actions">
          <button type="button" data-download-image="${id}">${term.downloadImage}</button>
          <button type="button" data-download-pdf="${id}">${term.downloadPdf}</button>
        </div>
      </section>
    </article>
  `;
}

function renderPatternSheet(pattern, language) {
  const term = languages[language];
  const rows = pattern.rows
    .map((row) => `<li><span>${row.round}</span><strong>${row[language]}</strong></li>`)
    .join("");

  return `
    <div class="pattern-sheet">
      <div class="sheet-header">
        <p>Puffy Kitty Pattern · ${term.fullName}</p>
        <h3>${pattern.title[language]}</h3>
      </div>

      <section class="sheet-section">
        <h4>${term.body}</h4>
        <ol class="round-list">${rows}</ol>
      </section>

      <section class="sheet-section">
        <h4>${term.note}</h4>
        ${pattern.notes[language].map((line) => `<p>${line}</p>`).join("")}
      </section>

      <section class="sheet-section">
        <h4>${term.hair}</h4>
        ${pattern.hair[language].map((line) => `<p>${line}</p>`).join("")}
      </section>

      <section class="sheet-section abbreviations">
        <h4>${term.abbreviations}</h4>
        ${pattern.abbreviations[language].map((line) => `<p>${line}</p>`).join("")}
      </section>
    </div>
  `;
}

function renderAbout() {
  return `
    <div class="split">
      <div>
        <p class="eyebrow">Workflow</p>
        <h2>后续添加图解的方式</h2>
      </div>
      <div class="notes">
        <p>首页只展示图解卡片，完整内容放在单独详情页。</p>
        <p>每个图解在 <code>scripts.js</code> 里维护中文、US、UK 三套文字。</p>
        <p>下载图片和 PDF 会使用当前切换的语言版本。</p>
      </div>
    </div>
  `;
}

function renderContact() {
  return `
    <div class="contact">
      <p class="eyebrow">Contact</p>
      <h2>购买、授权或合作</h2>
      <p>邮箱：your-name@example.com</p>
    </div>
  `;
}

function getPrintablePattern(pattern, language) {
  const term = languages[language];

  return {
    fileName: `${pattern.fileName}-${language}`,
    title: pattern.title[language],
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

function downloadPatternImage(pattern, language) {
  const printable = getPrintablePattern(pattern, language);
  const canvas = createPatternCanvas(printable);
  downloadDataUrl(canvas.toDataURL("image/png"), `${printable.fileName}.png`);
}

function downloadPatternPdf(pattern, language) {
  const printable = getPrintablePattern(pattern, language);
  const canvas = createPatternCanvas(printable);
  const jpegDataUrl = canvas.toDataURL("image/jpeg", 0.95);
  const pdfBlob = createPdfFromJpeg(jpegDataUrl, canvas.width, canvas.height);
  downloadBlob(pdfBlob, `${printable.fileName}.pdf`);
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
  ctx.font = "700 18px Arial, Microsoft YaHei, sans-serif";
  ctx.fillText(pattern.subtitle, 64, y);

  y += 52;
  ctx.fillStyle = palette.ink;
  ctx.font = "700 44px Arial, Microsoft YaHei, sans-serif";
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
    ctx.font = "700 24px Arial, Microsoft YaHei, sans-serif";
    ctx.fillText(section.heading, 64, y);
    y += 34;

    section.lines.forEach((line) => {
      const wrapped = wrapText(ctx, line, width - 128, "22px Arial, Microsoft YaHei, sans-serif");
      wrapped.forEach((text) => {
        ctx.fillStyle = palette.ink;
        ctx.font = "22px Arial, Microsoft YaHei, sans-serif";
        ctx.fillText(text, 82, y);
        y += 34;
      });
    });

    y += 24;
  });

  ctx.fillStyle = palette.muted;
  ctx.font = "16px Arial, Microsoft YaHei, sans-serif";
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
