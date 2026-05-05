const patternData = {
  "main-body": {
    fileName: "puffy-kitty-main-body",
    title: "主体与头发",
    subtitle: "Puffy Kitty Crochet Pattern",
    sections: [
      {
        heading: "主体",
        lines: [
          "R1: 4x",
          "R2: 4v",
          "R3: 2(3x, v)",
          "R4: 2(2x, v, 2x)",
          "R5: 3(3x, v)",
          "R6: 3(2x, v, 2x)",
          "R7: 6(x, v, x)",
          "R8: 8x, 8x, 8x",
          "R9-10: 10x, 4x, 10x",
          "R11: 9x, 6x, 9x",
          "R12: 4a, 4a, 4a",
          "备注: R12 根据带线方式调整，不漏白线就行。"
        ]
      },
      {
        heading: "头发",
        lines: ["10ch，倒 2 回钩 9T，第一个 T 钩无痕起立。"]
      },
      {
        heading: "缩写",
        lines: ["x = 短针，v = 加针，a = 减针，ch = 锁针，T = 中长针或你常用定义。"]
      }
    ]
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

document.addEventListener("click", async (event) => {
  const imageButton = event.target.closest("[data-download-image]");
  const pdfButton = event.target.closest("[data-download-pdf]");

  if (imageButton) {
    const pattern = patternData[imageButton.dataset.downloadImage];
    if (pattern) {
      const canvas = createPatternCanvas(pattern);
      downloadDataUrl(canvas.toDataURL("image/png"), `${pattern.fileName}.png`);
    }
  }

  if (pdfButton) {
    const pattern = patternData[pdfButton.dataset.downloadPdf];
    if (pattern) {
      const canvas = createPatternCanvas(pattern);
      const jpegDataUrl = canvas.toDataURL("image/jpeg", 0.95);
      const pdfBlob = createPdfFromJpeg(jpegDataUrl, canvas.width, canvas.height);
      downloadBlob(pdfBlob, `${pattern.fileName}.pdf`);
    }
  }
});

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
  return Math.max(760, 250 + lineCount * 40);
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
