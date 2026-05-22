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
    downloadMenu: "下载↓",
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
    downloadMenu: "Download ↓",
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
    downloadMenu: "Download ↓",
    back: "Back to patterns",
    view: "View pattern",
    chartType: "Written pattern"
  }
};

languages.zh = {
  label: "中文",
  fullName: "中文常用记号",
  body: "主体",
  hair: "配件",
  note: "备注",
  abbreviations: "缩写",
  downloadImage: "下载图片",
  downloadPdf: "下载 PDF",
  downloadMenu: "下载↓",
  back: "返回图解列表",
  view: "查看图解",
  chartType: "文字图解"
};

const siteCopy = {
  zh: {
    brandSubtitle: "钩针",
    nav: {
      home: "首页",
      pattern: "图解",
      gallery: "相册",
      contact: "联系",
      about: "关于"
    },
    footer: "2026 Puffy Kitty。原创钩针图解和制作档案。",
    heroText:
      "我是 Puffy Kitty。这里收集小小的钩针图解、软糖一样的角色，还有正在桌上慢慢长大的手作灵感。",
    patternHeading: "钩针软糖图解",
    loadingTitle: "正在读取图解文件",
    errorTitle: "图解文件读取失败",
    localFileHelp:
      "当前页面是用 file:// 打开的。这个版本需要用本地服务器打开，才能读取 patterns.json 和每个图解文件夹里的 pattern.MD。",
    loadHelp: "请确认 patterns.json 中登记的文件夹存在，并且每个文件夹内都有 pattern.MD。",
    aboutTitle: "关于 Puffy Kitty",
    aboutLines: [
      "我是 Puffy Kitty。这里收集小小的钩针图解、软糖一样的角色，还有正在桌上慢慢长大的手作灵感。",
      "我喜欢把柔软的线、明亮的颜色和一点点童趣做成可以留在手心里的小作品。"
    ],
    galleryTitle: "作品相册",
    contactTitle: "联系",
    contactLinks: [
      { label: "Instagram", handle: "@puffy_kitty_", href: "https://www.instagram.com/puffy_kitty_/" },
      { label: "X", handle: "@puffy_kitty_", href: "https://x.com/puffy_kitty_" },
      { label: "小红书", handle: "猫团团 · 193650226", href: "https://www.xiaohongshu.com/search_result?keyword=193650226" }
    ]
  },
  en: {
    brandSubtitle: "Crochet",
    nav: {
      home: "main",
      pattern: "pattern",
      gallery: "gallery",
      contact: "contact",
      about: "about"
    },
    footer: "2026 Puffy Kitty. Original crochet patterns and studio archive.",
    heroText:
      "hi im Puffy Kitty. i make tiny crochet patterns, soft gummy-looking creatures, and little handmade experiments.",
    patternHeading: "Crochet Gummy Patterns",
    loadingTitle: "Loading pattern files",
    errorTitle: "Pattern files failed to load",
    localFileHelp:
      "This page is opened with file://. Run the local server so the browser can load patterns.json and each pattern.MD file.",
    loadHelp: "Check that every folder listed in patterns.json exists and contains pattern.MD.",
    aboutTitle: "About Puffy Kitty",
    aboutLines: [
      "hi im Puffy Kitty. i make tiny crochet patterns, soft gummy-looking creatures, and little handmade experiments.",
      "I like turning soft yarn, bright colors, and a little playfulness into small handmade pieces you can hold."
    ],
    galleryTitle: "Studio Gallery",
    contactTitle: "Contact",
    contactLinks: [
      { label: "Instagram", handle: "@puffy_kitty_", href: "https://www.instagram.com/puffy_kitty_/" },
      { label: "X", handle: "@puffy_kitty_", href: "https://x.com/puffy_kitty_" },
      { label: "RedNote", handle: "猫团团 · 193650226", href: "https://www.xiaohongshu.com/search_result?keyword=193650226" }
    ]
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

const downloadFormats = [
  { id: "jpeg", label: "JPEG", type: "image/jpeg", extension: "jpeg", quality: 0.95 },
  { id: "png", label: "PNG", type: "image/png", extension: "png" },
  { id: "pdf", label: "PDF", type: "application/pdf", extension: "pdf" }
];

const app = document.querySelector("#app");
let selectedSiteLanguage = normalizeSiteLanguage(localStorage.getItem("siteLanguage"));
let selectedLanguage = localStorage.getItem("patternLanguage") || "zh";
let selectedDownloadScope = localStorage.getItem("patternDownloadScope") || "current";
let selectedPatternFilter = localStorage.getItem("patternFilter") || "all";
let selectedPatternVersions = JSON.parse(localStorage.getItem("patternVersions") || "{}");
let patternData = {};
let patternList = [];
let bioData = {
  short: {},
  long: {}
};

window.addEventListener("hashchange", render);
document.addEventListener("click", handleClick);
document.addEventListener("change", handleChange);
init();

async function init() {
  app.innerHTML = renderLoading();

  try {
    await Promise.all([loadBio(), loadPatterns()]);
    render();
  } catch (error) {
    app.innerHTML = renderLoadError(error);
  }
}

async function loadBio() {
  try {
    const markdown = await fetchText("bio.MD");
    bioData = parseBioMarkdown(markdown);
  } catch (error) {
    bioData = {
      short: {
        zh: siteCopy.zh.heroText,
        en: siteCopy.en.heroText
      },
      long: {
        zh: siteCopy.zh.aboutLines,
        en: siteCopy.en.aboutLines
      }
    };
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
  const response = await fetch(path, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Cannot load ${path}`);
  }

  return response.json();
}

async function fetchText(path) {
  const response = await fetch(path, { cache: "no-store" });

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
  const cover = `${folder}/${meta.cover1 || meta.cover || "cover1.JPEG"}`;
  const exportImage = `${folder}/${meta.cover2 || meta.seriesCover || "cover2.JPEG"}`;
  const seriesImage = meta.seriesCover ? `${folder}/${meta.seriesCover}` : "";
  const extraImages = (meta.images || []).map((image) => `${folder}/${image}`);
  const versionGroups = Array.isArray(meta.versionGroups) ? meta.versionGroups : [];
  const versionMeta = versionGroups.length
    ? buildGroupedVersions(versionGroups)
    : meta.versions?.length
      ? meta.versions
      : [{ id: "default", label: { zh: "默认版", us: "Default", uk: "Default" } }];
  const versions = versionMeta.map((version) => {
    const suffix = version.id === "default" ? "" : `:${version.id}`;
    return {
      id: version.id,
      label: version.label || version.id,
      parts: version.parts || {},
      materials: parseLocalizedList(body, `body-materials${suffix}`),
      colorNotes: parseLocalizedList(body, `color-notes${suffix}`),
      rows: parseBodyRows(body, `body${suffix}`),
      notes: parseLocalizedList(body, `notes${suffix}`),
      hair: parseLocalizedList(body, `hair${suffix}`),
      accessories: parseAccessories(body, meta.accessories || [], suffix)
    };
  });

  return {
    id: meta.id || folder,
    folder,
    fileName: meta.fileName || folder,
    image: cover,
    exportImage,
    seriesImage,
    images: [cover, ...extraImages].filter(Boolean),
    category: meta.category,
    tags: meta.tags || [],
    versionGroups,
    versions,
    title: meta.title,
    summary: meta.summary,
    rows: versions[0].rows,
    materials: versions[0].materials,
    colorNotes: versions[0].colorNotes,
    notes: versions[0].notes,
    hair: versions[0].hair,
    accessories: versions[0].accessories,
    abbreviations: parseLocalizedList(body, "abbreviations")
  };
}

function parseBioMarkdown(markdown) {
  return {
    short: parseLocalizedTextBlock(markdown, "short"),
    long: parseLocalizedTextBlock(markdown, "long")
  };
}

function parseLocalizedTextBlock(markdown, sectionName) {
  const section = getSection(markdown, sectionName);
  const languages = {};
  const matches = [...section.matchAll(/###\s+(\w+)\s*\n([\s\S]*?)(?=\n###\s+\w+\s*\n|$)/g)];

  matches.forEach((match) => {
    const key = match[1].trim();
    const value = match[2]
      .trim()
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.replace(/\s*\n\s*/g, " ").trim())
      .filter(Boolean);

    languages[key] = value;
  });

  return languages;
}

function parseAccessories(markdown, accessoryMeta, suffix) {
  const accessories = accessoryMeta
    .map((accessory) => {
      const sectionName = `assess:${accessory.id}${suffix}`;
      return {
        id: accessory.id,
        label: accessory.label || accessory.id,
        lines: parseLocalizedList(markdown, sectionName),
        rows: parseBodyRows(markdown, sectionName)
      };
    })
    .filter(
      (accessory) =>
        Object.values(accessory.lines).some((lines) => lines.length) || accessory.rows.some((row) => row.round || row.zh || row.us || row.uk)
    );

  if (accessories.length) {
    return accessories;
  }

  const legacyHair = parseLocalizedList(markdown, `hair${suffix}`);
  return Object.values(legacyHair).some((lines) => lines.length)
    ? [{ id: "hair", label: { zh: "配件", us: "Accessory", uk: "Accessory" }, lines: legacyHair }]
    : [];
}

function buildGroupedVersions(groups) {
  return groups.reduce(
    (versions, group) =>
      versions.flatMap((version) =>
        (group.options || []).map((option) => {
          const id = [version.id, option.id].filter(Boolean).join("-");
          const label = Object.fromEntries(
            Object.keys(languages).map((language) => [
              language,
              [version.label?.[language], option.label?.[language] || option.id].filter(Boolean).join(" / ")
            ])
          );

          return {
            id,
            label,
            parts: {
              ...version.parts,
              [group.id]: option.id
            }
          };
        })
      ),
    [{ id: "", label: {}, parts: {} }]
  );
}

function parseBodyRows(markdown, sectionName = "body") {
  const section = getSection(markdown, sectionName);

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
  const sectionName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = markdown.match(new RegExp(`(?:^|\\n)##\\s+${sectionName}\\s*\\n([\\s\\S]*?)(?=\\n##\\s+|$)`));
  return match ? match[1].trim() : "";
}

async function handleClick(event) {
  const siteLanguageButton = event.target.closest("[data-site-language]");
  const languageButton = event.target.closest("[data-language]");
  const versionGroupButton = event.target.closest("[data-pattern-version-group]");
  const versionButton = event.target.closest("[data-pattern-version]");
  const downloadScopeButton = event.target.closest("[data-download-scope]");
  const patternFilterButton = event.target.closest("[data-pattern-filter]");

  if (siteLanguageButton) {
    selectedSiteLanguage = normalizeSiteLanguage(siteLanguageButton.dataset.siteLanguage);
    localStorage.setItem("siteLanguage", selectedSiteLanguage);
    render();
    return;
  }

  if (languageButton) {
    selectedLanguage = languageButton.dataset.language;
    localStorage.setItem("patternLanguage", selectedLanguage);
    render();
  }

  if (versionGroupButton) {
    const pattern = patternData[versionGroupButton.dataset.patternId];
    const activeVersion = getActiveVersion(pattern);
    const nextParts = {
      ...activeVersion.parts,
      [versionGroupButton.dataset.patternVersionGroup]: versionGroupButton.dataset.patternVersionOption
    };
    const nextVersion = pattern.versions.find((version) =>
      pattern.versionGroups.every((group) => version.parts?.[group.id] === nextParts[group.id])
    );

    if (nextVersion) {
      selectedPatternVersions[pattern.id] = nextVersion.id;
      localStorage.setItem("patternVersions", JSON.stringify(selectedPatternVersions));
      render();
    }
  }

  if (versionButton) {
    selectedPatternVersions[versionButton.dataset.patternId] = versionButton.dataset.patternVersion;
    localStorage.setItem("patternVersions", JSON.stringify(selectedPatternVersions));
    render();
  }

  if (downloadScopeButton) {
    selectedDownloadScope = downloadScopeButton.dataset.downloadScope;
    localStorage.setItem("patternDownloadScope", selectedDownloadScope);
    render();
  }

  if (patternFilterButton) {
    selectedPatternFilter = patternFilterButton.dataset.patternFilter;
    localStorage.setItem("patternFilter", selectedPatternFilter);
    render();
  }

}

async function handleChange(event) {
  const formatMenu = event.target.closest("[data-download-format]");

  if (!formatMenu || !formatMenu.value) {
    return;
  }

  const pattern = patternData[formatMenu.dataset.downloadFormat];
  await downloadPattern(pattern, selectedLanguage, selectedDownloadScope, formatMenu.value);
  formatMenu.value = "";
}

function render() {
  const route = getRoute();

  if (route.type === "pattern" && patternData[route.id]) {
    app.innerHTML = renderPatternDetail(patternData[route.id], route.id);
    updateSiteChrome();
    updateActiveNav(route);
    return;
  }

  if (route.type === "patternIndex") {
    app.innerHTML = renderPatternIndex();
    updateSiteChrome();
    updateActiveNav(route);
    return;
  }

  if (route.type === "about") {
    app.innerHTML = renderAbout();
    updateSiteChrome();
    updateActiveNav(route);
    return;
  }

  if (route.type === "gallery") {
    app.innerHTML = renderGallery();
    updateSiteChrome();
    updateActiveNav(route);
    return;
  }

  if (route.type === "contact") {
    app.innerHTML = renderContact();
    updateSiteChrome();
    updateActiveNav(route);
    return;
  }

  app.innerHTML = renderHome();
  updateSiteChrome();
  updateActiveNav(route);
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

  return { type: "home" };
}

function updateActiveNav(route) {
  document.querySelectorAll(".site-header > nav a").forEach((link) => {
    const key = link.dataset.nav;
    const active =
      (route.type === "home" && key === "home") ||
      ((route.type === "patternIndex" || route.type === "pattern") && key === "pattern") ||
      route.type === key;

    link.classList.toggle("is-active", active);
  });
}

function updateSiteChrome() {
  const copy = siteCopy[selectedSiteLanguage];
  document.documentElement.lang = selectedSiteLanguage === "zh" ? "zh-Hans" : "en";

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    const value = key.split(".").reduce((source, part) => source?.[part], copy);
    if (value) {
      element.textContent = value;
    }
  });

  document.querySelectorAll("[data-site-language]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.siteLanguage === selectedSiteLanguage);
  });
}

function getSiteCopy(key) {
  return key.split(".").reduce((source, part) => source?.[part], siteCopy[selectedSiteLanguage]) || "";
}

function normalizeSiteLanguage(value) {
  return Object.hasOwn(siteCopy, value) ? value : "en";
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
  const activeVersion = getActiveVersion(pattern);

  return `
    <section class="section detail-section">
      ${renderBreadcrumb(pattern)}
      <article class="detail-layout">
        <aside class="detail-aside">
          ${renderImageCarousel(pattern)}
          <div class="language-panel controls-panel">
            <div class="language-toggle" role="group" aria-label="Switch crochet terms">
              ${Object.entries(languages)
                .map(([key, language]) => {
                  const active = key === selectedLanguage ? "is-active" : "";
                  return `<button class="${active}" type="button" data-language="${key}">${language.label}</button>`;
                })
                .join("")}
            </div>
            ${renderVersionControls(pattern, activeVersion)}
          </div>
        </aside>

        <section class="pattern-detail">
          ${renderPatternSheet(pattern, selectedLanguage, activeVersion)}

          <div class="download-actions">
            ${renderDownloadFormatMenu(id, term)}
            ${renderDownloadScopeControls()}
          </div>
        </section>
      </article>
    </section>
  `;
}

function renderDownloadFormatMenu(id, term) {
  return `
    <label class="download-format">
      <span class="sr-only">${escapeHtml(term.downloadMenu || "Download")}</span>
      <select data-download-format="${id}" aria-label="${escapeHtml(term.downloadMenu || "Download")}">
        <option value="">${escapeHtml(term.downloadMenu || "Download ↓")}</option>
        ${downloadFormats
          .map((format) => `<option value="${format.id}">${format.label}</option>`)
          .join("")}
      </select>
    </label>
  `;
}

function renderBreadcrumb(pattern) {
  const homeLabel = selectedSiteLanguage === "zh" ? "主页" : "Home";
  const patternLabel = selectedSiteLanguage === "zh" ? "图解" : "Patterns";
  const series = getPatternSeries(pattern);
  const title = getLocalized(pattern.title);

  return `
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="#/">${escapeHtml(homeLabel)}</a>
      <span>/</span>
      <a href="#/pattern">${escapeHtml(patternLabel)}</a>
      <span>/</span>
      <a href="#/pattern">${escapeHtml(series.label)}</a>
      <span>/</span>
      <strong>${escapeHtml(title)}</strong>
    </nav>
  `;
}

function renderVersionControls(pattern, activeVersion) {
  if (pattern.versions.length <= 1) {
    return "";
  }

  if (pattern.versionGroups?.length) {
    const groups = pattern.versionGroups
      .map((group) => {
        const buttons = (group.options || [])
          .map((option) => {
            const active = activeVersion.parts?.[group.id] === option.id ? "is-active" : "";
            return `<button class="${active}" type="button" data-pattern-id="${pattern.id}" data-pattern-version-group="${group.id}" data-pattern-version-option="${option.id}">${escapeHtml(getLocalized(option.label || option.id))}</button>`;
          })
          .join("");

        return `
          <div class="version-group">
            <span>${escapeHtml(getLocalized(group.label || group.id))}</span>
            <div class="version-toggle" role="group" aria-label="${escapeHtml(getLocalized(group.label || group.id))}">
              ${buttons}
            </div>
          </div>
        `;
      })
      .join("");

    return `
      <div class="version-panel">
        <p class="eyebrow">Version</p>
        ${groups}
      </div>
    `;
  }

  const buttons = pattern.versions
    .map((version) => {
      const active = version.id === activeVersion.id ? "is-active" : "";
      return `<button class="${active}" type="button" data-pattern-id="${pattern.id}" data-pattern-version="${version.id}">${escapeHtml(getLocalized(version.label))}</button>`;
    })
    .join("");

  return `
    <div class="version-panel">
      <p class="eyebrow">Version</p>
      <div class="version-toggle" role="group" aria-label="Switch pattern version">
        ${buttons}
      </div>
    </div>
  `;
}

function renderDownloadScopeControls() {
  const options = [
    { id: "current", label: { zh: "当前", us: "Current", uk: "Current" } },
    { id: "all", label: { zh: "全部", us: "All", uk: "All" } }
  ];

  return `
    <div class="download-scope is-${selectedDownloadScope}" role="group" aria-label="Download scope">
      ${options
        .map((option) => {
          const active = option.id === selectedDownloadScope ? "is-active" : "";
          return `<button class="${active}" type="button" data-download-scope="${option.id}">${escapeHtml(getLocalized(option.label))}</button>`;
        })
        .join("")}
    </div>
  `;
}

function renderImageCarousel(pattern) {
  const slides = pattern.images
    .map((image, index) => {
      return `
        <figure class="carousel-slide">
          <img src="${image}" alt="${getLocalized(pattern.title)} image ${index + 1}" />
        </figure>
      `;
    })
    .join("");

  return `
    <div class="detail-gallery" aria-label="${getLocalized(pattern.title)} images">
      <div class="image-carousel">${slides}</div>
    </div>
  `;
}

function renderPatternSheet(pattern, language, version = getActiveVersion(pattern)) {
  const term = languages[language];
  const bodyRows = version.rows;
  const bodyMaterial = extractMaterialNote(version.materials?.[language] || []);
  const colorNotes = version.colorNotes?.[language] || [];
  const accessorySections = getAccessorySections(version, language, term.hair);
  const rows = bodyRows
    .map((row) => `<li><span>${escapeHtml(row.round)}</span><strong>${renderInlinePatternText(row[language])}</strong></li>`)
    .join("");
  const accessories = accessorySections
    .map(
      (accessory) => `
        <section class="sheet-section">
          ${renderSectionHeading(accessory.heading, accessory.note, language)}
          ${renderLines(accessory.lines)}
          ${
            accessory.rows?.length
              ? `<ol class="round-list">${accessory.rows
                  .map((row) => `<li><span>${escapeHtml(row.round)}</span><strong>${renderInlinePatternText(row.text)}</strong></li>`)
                  .join("")}</ol>`
              : ""
          }
        </section>
      `
    )
    .join("");
  const versionLabel = pattern.versions.length > 1 ? getLocalized(version.label) : "";

  return `
    <div class="pattern-sheet">
      <div class="sheet-header">
        <h3>${getLocalized(pattern.title)}</h3>
        <div class="sheet-meta-row">
          <p>${language === "zh" ? "猫团团图解" : "Puffy Kitty Pattern"} · ${term.fullName}</p>
          ${versionLabel ? `<span>${escapeHtml(versionLabel)}</span>` : ""}
        </div>
      </div>
      ${colorNotes.length ? `<div class="sheet-color-notes">${renderLines(colorNotes)}</div>` : ""}

      <section class="sheet-section">
        ${renderSectionHeading(term.body, bodyMaterial.note, language)}
        ${renderLines(bodyMaterial.lines)}
        <ol class="round-list">${rows}</ol>
      </section>

      <section class="sheet-section note-section">
        <h4>${term.note}</h4>
        ${renderLines(version.notes[language])}
      </section>

      ${accessories}

      <section class="sheet-section abbreviations">
        ${renderSectionHeading(term.abbreviations)}
        ${renderLines(getAbbreviationLines(pattern, language))}
      </section>
    </div>
  `;
}

function renderSectionHeading(heading, note = "", language = selectedLanguage) {
  const noteText = Array.isArray(note) ? note.filter(Boolean).join(" ") : note;
  const noteLabel = language === "zh" ? "线材" : "Yarn";

  return `
    <h4>
      <span class="section-title-label">${escapeHtml(heading)}</span>
      ${
        noteText
          ? `<span class="section-note"><span class="section-note-label">${noteLabel}</span>${renderInlinePatternText(noteText)}</span>`
          : ""
      }
    </h4>
  `;
}

function getAccessorySections(version, language, fallback) {
  if (version.accessories?.length) {
    return version.accessories.map((accessory) => {
      const heading = getLocalized(accessory.label, language);
      const { note, lines } = extractMaterialNote(accessory.lines[language] || []);
      const normalized = normalizeAccessoryRows(accessory.id, lines, language);
      const rows = accessory.rows?.length
        ? accessory.rows.map((row) => ({ round: row.round, text: row[language] }))
        : normalized.rows;

      return {
        id: accessory.id,
        heading,
        note,
        lines: normalized.lines,
        rows
      };
    });
  }

  const { note, lines } = extractMaterialNote(version.hair?.[language] || []);
  return [{ id: "hair", heading: fallback, note, lines }];
}

function normalizeAccessoryRows(accessoryId, lines, language) {
  const rows = [];
  const otherLines = [];

  lines.forEach((line) => {
    const cleaned = line.replace(/[。.]$/, "").trim();
    const roundMatch = cleaned.match(/^(R\d+(?:-\d+)?)[:：]\s*(.+)$/i);

    if (/^(环起|Magic ring)/i.test(cleaned)) {
      rows.push({ round: "R1", text: cleaned });
      return;
    }

    if (roundMatch) {
      rows.push({ round: roundMatch[1].toUpperCase(), text: roundMatch[2] });
      return;
    }

    if (/^(断线|Fasten off)/i.test(cleaned)) {
      rows.push({
        round: language === "zh" ? "断线" : "Cut",
        text: cleaned
      });
      return;
    }

    otherLines.push(line);
  });

  return rows.length ? { lines: otherLines, rows } : { lines, rows: [] };
}

function extractMaterialNote(lines) {
  const [firstLine = "", ...rest] = lines;
  const trimmed = firstLine.trim();

  if (!trimmed) {
    return { note: "", lines };
  }

  const prefixed = trimmed.match(/^([^:\uff1a]{1,24})[:\uff1a]\s*(.+)$/);
  if (prefixed) {
    return { note: prefixed[2], lines: rest };
  }

  if (/\u7ebf|\u7dda|\u7ebf\u6750|\u7dda\u6750|yarn/i.test(trimmed)) {
    return { note: trimmed, lines: rest };
  }

  return { note: "", lines };
}

function getAbbreviationLines(pattern, language) {
  const lines = [...(pattern.abbreviations[language] || [])];

  if (language === "zh" && !lines.some((line) => /\bB\s*=/.test(line))) {
    lines.push("B = 5个未完成的长针钩的枣型针");
  }

  return lines;
}

function renderLines(lines) {
  return lines.map((line) => `<p>${renderInlinePatternText(line)}</p>`).join("");
}

function renderInlinePatternText(value) {
  return escapeHtml(value)
    .replace(/__(.+?)__/g, '<mark class="stitch-highlight stitch-highlight-three">$1</mark>')
    .replace(/\*\*(.+?)\*\*/g, '<mark class="stitch-highlight stitch-highlight-two">$1</mark>')
    .replace(/\*(.+?)\*/g, '<mark class="stitch-highlight stitch-highlight-one">$1</mark>');
}

function stripInlinePatternText(value) {
  return String(value).replaceAll("**", "").replaceAll("*", "").replaceAll("__", "");
}

function getActiveVersion(pattern) {
  const selectedVersion = selectedPatternVersions[pattern.id];
  return pattern.versions.find((version) => version.id === selectedVersion) || pattern.versions[0];
}

function getDownloadVersions(pattern, scope) {
  return scope === "all" ? pattern.versions : [getActiveVersion(pattern)];
}

function renderLoading() {
  return `
    <section class="section">
      <p class="eyebrow">Loading</p>
      <h2>${escapeHtml(getSiteCopy("loadingTitle"))}</h2>
    </section>
  `;
}

function renderLoadError(error) {
  const isLocalFile = window.location.protocol === "file:";

  return `
    <section class="section">
      <p class="eyebrow">Pattern Error</p>
      <h2>${escapeHtml(getSiteCopy("errorTitle"))}</h2>
      <p>${escapeHtml(error.message)}</p>
      ${
        isLocalFile
          ? `<p>${escapeHtml(getSiteCopy("localFileHelp"))}</p>
             <p><code>node serve-local.js</code> / <code>http://127.0.0.1:4173/</code></p>`
          : `<p>${escapeHtml(getSiteCopy("loadHelp"))}</p>`
      }
    </section>
  `;
}

function renderHome() {
  const slides = ["assets/1.JPEG", "assets/2.JPEG", "assets/3.JPEG"]
    .map((image, index) => {
      return `
        <figure class="home-slide" style="--slide-index: ${index}">
          <img src="${image}" alt="Puffy Kitty crochet work ${index + 1}" />
        </figure>
      `;
    })
    .join("");

  return `
    <section class="home-hero">
      <div class="home-intro">
        ${renderBioParagraphs("short")}
      </div>
      <div class="home-slideshow" aria-label="Featured crochet photos">
        ${slides}
      </div>
    </section>
    <section class="section pattern-library">
      <div class="section-heading">
        <p class="eyebrow">Pattern</p>
        <h2>${escapeHtml(getSiteCopy("patternHeading"))}</h2>
      </div>
      <div class="pattern-archive">
        <section class="pattern-series">
          <div class="pattern-grid">${patternList.map(renderPatternCard).join("")}</div>
        </section>
      </div>
    </section>
  `;
}

function renderPatternIndex() {
  const filterOptions = getPatternFilterOptions(patternList);
  const filteredPatterns =
    selectedPatternFilter === "all"
      ? patternList
      : patternList.filter((pattern) => getPatternFilterKeys(pattern).includes(selectedPatternFilter));
  const groups = groupPatternsBySeries(filteredPatterns);
  const seriesSections = groups
    .map((group) => {
      const cards = group.patterns.map(renderPatternCard).join("");

      return `
        <section class="pattern-series">
          <h2>${escapeHtml(group.label)}</h2>
          <div class="pattern-grid">${cards}</div>
        </section>
      `;
    })
    .join("");

  return `
    <section class="section pattern-library">
      ${renderPatternFilters(filterOptions)}
      <div class="pattern-archive">
        ${seriesSections}
      </div>
    </section>
  `;
}

function renderPatternFilters(options) {
  const title = selectedSiteLanguage === "zh" ? "标签" : "Tags";

  return `
    <aside class="pattern-filters" aria-label="${escapeHtml(title)}">
      ${options
        .map((option) => {
          const active = option.key === selectedPatternFilter ? "is-active" : "";
          return `<button class="pattern-filter ${active}" type="button" data-pattern-filter="${escapeHtml(option.key)}">${escapeHtml(option.label)}</button>`;
        })
        .join("")}
    </aside>
  `;
}

function getPatternFilterOptions(patterns) {
  const allLabel = selectedSiteLanguage === "zh" ? "全部" : "All";
  const options = new Map([["all", allLabel]]);

  patterns.forEach((pattern) => {
    getPatternMenuEntries(pattern).forEach((entry) => {
      if (!options.has(entry.key)) {
        options.set(entry.key, entry.label);
      }
    });
  });

  if (!options.has(selectedPatternFilter)) {
    selectedPatternFilter = "all";
    localStorage.setItem("patternFilter", selectedPatternFilter);
  }

  return [...options].map(([key, label]) => ({ key, label }));
}

function getPatternFilterKeys(pattern) {
  return getPatternMenuEntries(pattern).map((entry) => entry.key);
}

function getPatternMenuEntries(pattern) {
  const series = getPatternSeries(pattern);
  const entries = [{ key: `series:${series.key}`, label: series.label }];

  (pattern.tags || [])
    .filter((tag) => {
      const label = getLocalized(tag, "us").toLowerCase();
      return label === "gummy" || label === "pokemon";
    })
    .forEach((tag) => {
      const label = getTagFilterLabel(tag);
      const key = `tag:${slugify(getLocalized(tag, "us"))}`;
      entries.push({ key, label });
    });

  return entries.filter((entry) => entry.label);
}

function getTagFilterLabel(tag) {
  const usLabel = getLocalized(tag, "us").toLowerCase();

  if (selectedSiteLanguage === "zh") {
    if (usLabel === "gummy") {
      return "软糖系列";
    }
    if (usLabel === "pokemon") {
      return "宝可梦系列";
    }
  }

  return `${getLocalized(tag, "us")} Series`;
}

function renderPatternCard(pattern) {
  return `
    <article class="pattern-card list-card">
      <a class="card-link" href="#/pattern/${pattern.id}">
        ${renderPreview(pattern, "pattern-preview")}
        <div class="pattern-body">
          <h2>${getLocalized(pattern.title)}</h2>
          <div class="pattern-meta">
            ${renderPatternTags(pattern)}
          </div>
        </div>
      </a>
    </article>
  `;
}

function groupPatternsBySeries(patterns) {
  const groups = new Map();

  patterns.forEach((pattern) => {
    const series = getPatternSeries(pattern);
    if (!groups.has(series.key)) {
      groups.set(series.key, { label: series.label, patterns: [] });
    }
    groups.get(series.key).patterns.push(pattern);
  });

  return [...groups.values()];
}

function getPatternSeries(pattern) {
  const parts = pattern.folder.split("/");
  const kind = parts[1] || "pattern";
  const family = parts[2] || "archive";
  const key = `${kind}/${family}`;

  if (selectedSiteLanguage === "zh" && key === "gummy/pokemon") {
    return { key, label: "宝可梦软糖" };
  }

  return {
    key,
    label: `${toTitleCase(family)} ${toTitleCase(kind)}`
  };
}

function toTitleCase(value) {
  return value.replace(/[-_]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function slugify(value) {
  return String(value).trim().toLowerCase().replace(/\s+/g, "-");
}

function renderAbout() {
  return `
    <section class="section">
      <div class="split">
        <div>
          <p class="eyebrow">About</p>
          <h2>${escapeHtml(getSiteCopy("aboutTitle"))}</h2>
        </div>
        <div class="notes">
          ${renderBioParagraphs("long")}
        </div>
      </div>
    </section>
  `;
}

function renderBioParagraphs(kind) {
  return getBioParagraphs(kind).map((line) => `<p>${escapeHtml(line)}</p>`).join("");
}

function getBioParagraphs(kind) {
  const language = selectedSiteLanguage;
  const fallbackLanguage = language === "zh" ? "en" : "zh";
  const paragraphs = bioData[kind]?.[language] || bioData[kind]?.[fallbackLanguage] || [];

  if (paragraphs.length) {
    return paragraphs;
  }

  if (kind === "short") {
    return [getSiteCopy("heroText")];
  }

  return siteCopy[selectedSiteLanguage].aboutLines;
}

function renderGallery() {
  const images = patternList.flatMap((pattern) => pattern.images);

  return `
    <section class="section">
      <div class="section-heading">
        <p class="eyebrow">Gallery</p>
        <h2>${escapeHtml(getSiteCopy("galleryTitle"))}</h2>
      </div>
      <div class="gallery-grid">
        ${images.map((image, index) => `<img src="${image}" alt="Studio work ${index + 1}" />`).join("")}
      </div>
    </section>
  `;
}

function renderContact() {
  const links = siteCopy[selectedSiteLanguage].contactLinks || [];

  return `
    <section class="section">
      <div class="contact">
        <p class="eyebrow">Contact</p>
        <h2>${escapeHtml(getSiteCopy("contactTitle"))}</h2>
        <div class="contact-links">
          ${links
            .map(
              (link) => `
                <a class="contact-link" href="${escapeHtml(link.href)}" target="_blank" rel="noopener noreferrer">
                  <span>${escapeHtml(link.label)}</span>
                  <strong>${escapeHtml(link.handle)}</strong>
                </a>
              `
            )
            .join("")}
        </div>
      </div>
    </section>
  `;
}

function getPrintablePattern(pattern, language, version = getActiveVersion(pattern)) {
  const term = languages[language];
  const versionSuffix = pattern.versions.length > 1 ? `-${version.id}` : "";
  const versionLabel = pattern.versions.length > 1 ? ` / ${getLocalized(version.label, language)}` : "";
  const accessorySections = getAccessorySections(version, language, term.hair).map((accessory) => ({
    id: accessory.id,
    heading: accessory.heading,
    note: accessory.note,
    lines: accessory.lines,
    rows: accessory.rows
  }));
  const bodyMaterial = extractMaterialNote(version.materials?.[language] || []);

  return {
    fileName: `${pattern.fileName}${versionSuffix}-${language}`,
    title: getLocalized(pattern.title, language),
    image: pattern.exportImage || pattern.seriesImage || pattern.image,
    watermark: "logo/watermark1.PNG",
    colorNotes: version.colorNotes?.[language] || [],
    subtitle:
      language === "zh"
        ? `猫团团图解 · ${term.fullName}${versionLabel}`
        : `Puffy Kitty Pattern · ${term.fullName}${versionLabel}`,
    noteLabel: language === "zh" ? "线材" : "Yarn",
    footerLines: [
      "© 2026 猫团团。原创图解仅供个人手作使用，请勿转载、转售或声称为自己的作品。",
      "© 2026 Puffy Kitty. Original pattern for personal handmade use only. Do not redistribute, resell, or claim as your own."
    ],
    sections: [
      {
        id: "body",
        heading: term.body,
        note: bodyMaterial.note,
        lines: bodyMaterial.lines,
        rows: version.rows.map((row) => ({
          round: row.round,
          text: row[language]
        }))
      },
      ...accessorySections
    ],
    abbreviations: {
      heading: term.abbreviations,
      lines: getExportAbbreviationLines(pattern.abbreviations[language])
    }
  };
}

function getExportAbbreviationLines(lines = []) {
  return lines.flatMap((line) =>
    stripInlinePatternText(line)
      .split(/[，,]/)
      .map((part) => part.trim().replace(/[。.]$/, ""))
      .filter(Boolean)
  );
}

async function downloadPattern(pattern, language, scope, formatId) {
  const format = downloadFormats.find((item) => item.id === formatId);

  if (!pattern || !format) {
    return;
  }

  if (format.id === "pdf") {
    await downloadPatternPdfs(pattern, language, scope);
    return;
  }

  await downloadPatternImages(pattern, language, scope, format);
}

async function downloadPatternImages(pattern, language, scope, format = downloadFormats.find((item) => item.id === "png")) {
  await ensurePatternFont();
  for (const version of getDownloadVersions(pattern, scope)) {
    const printable = getPrintablePattern(pattern, language, version);
    const pages = getPrintablePages(pattern, printable);
    for (const [index, page] of pages.entries()) {
      const canvas = await createPatternCanvas(page);
      const pageSuffix = pages.length > 1 ? `-${index + 1}` : "";
      downloadDataUrl(
        canvas.toDataURL(format.type, format.quality),
        `${printable.fileName}${pageSuffix}.${format.extension}`
      );
    }
  }
}

async function downloadPatternPdfs(pattern, language, scope) {
  await ensurePatternFont();
  for (const version of getDownloadVersions(pattern, scope)) {
    const printable = getPrintablePattern(pattern, language, version);
    const pages = getPrintablePages(pattern, printable);
    const canvases = [];
    for (const page of pages) {
      canvases.push(await createPatternCanvas(page));
    }
    const jpegDataUrls = canvases.map((canvas) => canvas.toDataURL("image/jpeg", 0.95));
    const pdfBlob = createPdfFromJpegs(jpegDataUrls, canvases[0].width, canvases[0].height);
    downloadBlob(pdfBlob, `${printable.fileName}.pdf`);
  }
}

function getPrintablePages(pattern, printable) {
  if (!pattern.id?.endsWith("/mudkip")) {
    return [printable];
  }

  const firstPageSections = printable.sections.filter((section) => section.id !== "cheeks");
  const secondPageSections = printable.sections.filter((section) => section.id === "cheeks");

  if (!secondPageSections.length) {
    return [printable];
  }

  const pages = [
    {
      ...printable,
      sections: firstPageSections
    },
    {
      ...printable,
      sections: secondPageSections,
      colorNotes: []
    }
  ];
  return pages.map((page, index) => ({
    ...page,
    pageLabel: `${index + 1}/${pages.length}`
  }));
}

async function ensurePatternFont() {
  if (!document.fonts) {
    return;
  }

  await document.fonts.load("25px 'cjkFonts 全瀨體'");
  await document.fonts.load("44px 'Handmade Alphabet'");
  await document.fonts.load("44px 'naikaifont'");
  await document.fonts.ready;
}

function createLegacyPatternCanvas(pattern) {
  const width = 1440;
  const height = 1920;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  ctx.fillStyle = palette.paper;
  ctx.fillRect(0, 0, width, height);

  const layout = createExportLayout(ctx, pattern, width, height);

  let y = layout.marginTop;
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

async function createPatternCanvas(pattern) {
  const width = 1440;
  const height = 1920;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  drawExportGridBackground(ctx, width, height);

  const layout = createExportLayout(ctx, pattern, width, height);
  const exportImage = await loadExportImage(pattern.image);
  const watermarkImage = await loadExportImage(pattern.watermark);

  ctx.fillStyle = palette.rose;
  ctx.font = layout.metaFont;
  ctx.fillText(pattern.subtitle, layout.headerLeftX, 92);

  ctx.fillStyle = palette.ink;
  ctx.font = layout.titleFont;
  drawFittedText(ctx, pattern.title, layout.headerLeftX, 210, layout.titleMaxWidth, layout.titleFont, layout.minTitleFontSize);

  if (exportImage) {
    drawExportImage(ctx, exportImage, layout.imageBox);
  }

  drawExportLegend(ctx, layout.legendPills, layout.headerLeftX, layout.legendTop, layout);

  drawExportItems(ctx, layout);
  drawExportAbbreviations(ctx, layout);

  if (watermarkImage) {
    drawExportWatermark(ctx, watermarkImage, layout.watermarkBox);
  }

  ctx.fillStyle = palette.muted;
  ctx.font = layout.footerFont;
  (pattern.footerLines || []).forEach((line, index) => {
    drawFittedText(
      ctx,
      line,
      layout.marginX,
      height - 60 + index * 28,
      layout.watermarkBox.x - layout.marginX - 34,
      layout.footerFont,
      14
    );
  });

  return canvas;
}

function createExportLayout(ctx, pattern, width, height) {
  const fontFamily =
    "'Handmade Alphabet', 'naikaifont', 'cjkFonts 全瀨體', 'Segoe Print', 'Comic Sans MS', 'Microsoft YaHei', Arial, sans-serif";
  const marginX = 64;
  const coverWidth = 744;
  const coverHeight = 360;
  const watermarkWidth = 380;
  const watermarkHeight = 258;
  const abbreviationBox = {
    x: marginX,
    y: 1600,
    width: width - marginX * 2 - watermarkWidth - 44,
    height: 170
  };
  const settings = {
    width,
    height,
    marginX,
    headerLeftX: marginX,
    contentTop: 410,
    contentBottom: abbreviationBox.y - 34,
    columnGap: 54,
    imageBox: { x: width - marginX - coverWidth, y: 18, width: coverWidth, height: coverHeight, radius: 34 },
    watermarkBox: { x: width - marginX - watermarkWidth, y: height - marginX - watermarkHeight, width: watermarkWidth, height: watermarkHeight },
    abbreviationBox,
    titleMaxWidth: width - marginX * 2 - coverWidth - 26,
    minTitleFontSize: 90,
    metaFont: `700 30px ${fontFamily}`,
    titleFont: `700 106px ${fontFamily}`,
    headingFont: `700 58px ${fontFamily}`,
    noteFont: `700 28px ${fontFamily}`,
    legendFont: `500 42px ${fontFamily}`,
    lineFont: `500 52px ${fontFamily}`,
    roundFont: `500 44px ${fontFamily}`,
    abbreviationFont: `500 38px ${fontFamily}`,
    footerFont: `500 20px ${fontFamily}`,
    headingLineHeight: 78,
    lineHeight: 68,
    abbreviationLineHeight: 42,
    legendHeight: 50,
    noteHeight: 40,
    rowRoundWidth: 126,
    sectionGap: 34
  };
  const contentHeight = settings.contentBottom - settings.contentTop;
  const singleColumnWidth = width - settings.marginX * 2;
  settings.legendPills = buildExportLegendPills(ctx, pattern.colorNotes || [], settings.titleMaxWidth, settings);
  settings.legendTop = 244;
  const exportSections = pattern.sections;
  const singleColumnGroups = buildExportGroups(ctx, exportSections, settings, singleColumnWidth);
  const singleHeight = measureExportGroups(singleColumnGroups, settings);
  const useTwoColumns = singleHeight > contentHeight;
  const columnWidth = useTwoColumns
    ? (width - settings.marginX * 2 - settings.columnGap) / 2
    : singleColumnWidth;

  const groups = buildExportGroups(ctx, exportSections, settings, columnWidth);

  return {
    ...settings,
    noteLabel: pattern.noteLabel || "Yarn",
    abbreviations: pattern.abbreviations || null,
    columns: useTwoColumns ? 2 : 1,
    columnWidth,
    groups: positionExportGroups(groups, settings, useTwoColumns ? 2 : 1, columnWidth)
  };
}

function buildExportGroups(ctx, sections, settings, maxWidth) {
  return sections.map((section) => ({
    items: buildExportItems(ctx, [section], settings, maxWidth),
    keepTogether: !section.noHeading
  }));
}

function buildExportItems(ctx, sections, settings, maxWidth) {
  return sections.flatMap((section) => {
    const sectionLines = section.lines || [];
    const headingLines = section.noHeading ? [] : wrapText(ctx, section.heading, maxWidth, settings.headingFont);
    const headingItems = headingLines.map((text, index) => ({
      type: "heading",
      text,
      note: index === headingLines.length - 1 ? section.note || "" : ""
    }));
    const legendItems = section.legend?.length
      ? [{ type: "legend", pills: buildExportLegendPills(ctx, section.legend, maxWidth, settings) }]
      : [];
    const noteItems = sectionLines.flatMap((line) =>
      wrapRichInlineText(ctx, line, maxWidth, settings.lineFont).map((segments) => ({
        type: "line",
        text: segments.map((segment) => segment.text).join(""),
        segments,
        noteHighlight: false
      }))
    );
    const rowItems = (section.rows || []).flatMap((row) =>
      wrapRichInlineText(ctx, row.text, maxWidth - settings.rowRoundWidth, settings.lineFont).map((segments, index) => ({
        type: "row",
        round: index === 0 ? row.round : "",
        text: segments.map((segment) => segment.text).join(""),
        segments
      }))
    );
    const lineItems = sectionLines.flatMap((line) =>
      wrapRichInlineText(ctx, line, maxWidth, settings.lineFont).map((segments) => ({
        type: "line",
        text: segments.map((segment) => segment.text).join(""),
        segments,
        noteHighlight: false
      }))
    );

    return [
      ...headingItems,
      ...legendItems,
      ...(section.rows ? [...noteItems, ...rowItems] : lineItems),
      { type: "gap" }
    ];
  });
}

function measureExportItems(items, settings) {
  return items.reduce((total, item) => total + getExportItemHeight(item, settings), 0);
}

function measureExportGroups(groups, settings) {
  return groups.reduce((total, group) => total + measureExportItems(group.items, settings), 0);
}

function positionExportGroups(groups, settings, columns, columnWidth) {
  const columnYs = Array.from({ length: columns }, () => settings.contentTop);
  const columnX = (column) => settings.marginX + column * (columnWidth + settings.columnGap);

  return groups.map((group, index) => {
    const groupHeight = measureExportItems(group.items, settings);
    let column = 0;

    if (columns > 1 && index > 0) {
      const candidates = columnYs
        .map((y, candidateColumn) => ({ column: candidateColumn, y }))
        .sort((a, b) => a.y - b.y);
      const fitting = candidates.find((candidate) => candidate.y + groupHeight <= settings.contentBottom);
      column = (fitting || candidates[0]).column;
    }

    const positioned = {
      ...group,
      x: columnX(column),
      y: columnYs[column]
    };
    columnYs[column] += groupHeight;
    return positioned;
  });
}

function buildExportLegendPills(ctx, lines, maxWidth, settings) {
  ctx.font = settings.legendFont;
  const gap = 18;
  let x = 0;
  let line = 0;

  return lines.map((value) => {
    const segments = tokenizeInlinePatternText(value);
    const text = segments.map((segment) => segment.text).join("");
    const width = ctx.measureText(text).width + 24;

    if (x && x + width > maxWidth) {
      x = 0;
      line += 1;
    }

    const pill = {
      text,
      highlight: segments.find((segment) => segment.highlight)?.highlight || "",
      x,
      line,
      width
    };
    x += width + gap;
    return pill;
  });
}

function drawExportLegend(ctx, pills, x, y, layout) {
  ctx.font = layout.legendFont;
  pills.forEach((pill) => {
    const pillX = x + pill.x;
    const pillY = y + pill.line * layout.legendHeight + 5;
    ctx.fillStyle = getExportHighlightColor(pill.highlight);
    drawRoundedRect(ctx, pillX, pillY, pill.width, 40, 7);
    if (pill.highlight === "three") {
      ctx.strokeStyle = "rgba(83, 112, 122, 0.26)";
      ctx.lineWidth = 1;
      strokeRoundedRect(ctx, pillX, pillY, pill.width, 40, 7);
    }
    ctx.fillStyle = palette.ink;
    ctx.fillText(pill.text, pillX + 12, pillY + 33);
  });
}

function getExportItemHeight(item, settings) {
  if (item.type === "heading") {
    return settings.headingLineHeight;
  }
  if (item.type === "line" || item.type === "row") {
    return settings.lineHeight;
  }
  if (item.type === "legend") {
    return Math.max(1, item.pills[item.pills.length - 1]?.line + 1 || 1) * settings.legendHeight;
  }
  return settings.sectionGap;
}

function drawExportItems(ctx, layout) {
  layout.groups.forEach((group) => {
    let x = group.x;
    let y = group.y;

    group.items.forEach((item) => {
    const itemHeight = getExportItemHeight(item, layout);

    if (item.type === "heading") {
      ctx.font = layout.headingFont;
      const headingWidth = ctx.measureText(item.text).width + 18;
      ctx.fillStyle = "rgba(185, 222, 234, 0.82)";
      drawRoundedRect(ctx, x, y + 8, headingWidth, 58, 5);
      ctx.fillStyle = palette.ink;
      ctx.fillText(item.text, x + 9, y + 58);
      if (item.note) {
        ctx.font = layout.noteFont;
        const noteLabel = layout.noteLabel;
        const noteX = x + headingWidth + 14;
        ctx.fillStyle = "rgba(83, 112, 122, 0.72)";
        ctx.fillText(noteLabel, noteX, y + 52);
        ctx.fillStyle = palette.muted;
        ctx.fillText(stripInlinePatternText(item.note), noteX + ctx.measureText(noteLabel).width + 10, y + 52);
      }
    } else if (item.type === "line") {
      ctx.font = layout.lineFont;
      if (item.noteHighlight) {
        ctx.fillStyle = palette.highlight;
        drawRoundedRect(ctx, x + 6, y + 8, Math.min(ctx.measureText(item.text).width + 28, layout.columnWidth), 56, 8);
      }
      drawRichInlineSegments(ctx, item.segments, x + 12, y, layout);
    } else if (item.type === "row") {
      ctx.font = layout.roundFont;
      ctx.fillStyle = palette.muted;
      ctx.fillText(item.round, x, y + 52);
      drawRichInlineSegments(ctx, item.segments, x + layout.rowRoundWidth, y, layout);
    } else if (item.type === "legend") {
      drawExportLegend(ctx, item.pills, x, y, layout);
    }

    y += itemHeight;
    });
  });
}

function drawExportAbbreviations(ctx, layout) {
  if (!layout.abbreviations?.lines?.length) {
    return;
  }

  const box = layout.abbreviationBox;
  const headingHeight = 62;
  let y = box.y;

  ctx.font = layout.headingFont;
  const headingWidth = ctx.measureText(layout.abbreviations.heading).width + 18;
  ctx.fillStyle = "rgba(185, 222, 234, 0.82)";
  drawRoundedRect(ctx, box.x, y + 8, headingWidth, 58, 5);
  ctx.fillStyle = palette.ink;
  ctx.fillText(layout.abbreviations.heading, box.x + 9, y + 58);
  y += headingHeight;

  const availableWidth = box.width - 24;
  const maxRows = Math.max(1, Math.floor((box.y + box.height - y) / layout.abbreviationLineHeight));
  let fontSize = 38;
  let rows = [];

  while (fontSize >= 24) {
    const font = layout.abbreviationFont.replace(/\d+px/, `${fontSize}px`);
    rows = wrapExportInlineItems(ctx, layout.abbreviations.lines, availableWidth, font, Math.min(2, maxRows));
    if (rows.length <= maxRows) {
      ctx.font = font;
      break;
    }
    fontSize -= 2;
  }

  rows.slice(0, maxRows).forEach((row, rowIndex) => {
    let x = box.x + 12;
    row.forEach((item) => {
      ctx.fillStyle = palette.ink;
      ctx.fillText(item.text, x, y + rowIndex * layout.abbreviationLineHeight + fontSize);
      x += item.width + 34;
    });
  });
}

function wrapExportInlineItems(ctx, lines, maxWidth, font, preferredRows = 1) {
  ctx.font = font;
  const items = lines.map((line) => ({ text: line, width: ctx.measureText(line).width }));

  if (preferredRows === 2 && items.length > 2) {
    let bestRows = null;
    let bestScore = Infinity;

    for (let split = 1; split < items.length; split += 1) {
      const first = items.slice(0, split);
      const second = items.slice(split);
      const firstWidth = getExportInlineRowWidth(first);
      const secondWidth = getExportInlineRowWidth(second);

      if (firstWidth <= maxWidth && secondWidth <= maxWidth) {
        const score = Math.abs(firstWidth - secondWidth);
        if (score < bestScore) {
          bestScore = score;
          bestRows = [first, second];
        }
      }
    }

    if (bestRows) {
      return bestRows;
    }
  }

  const rows = [[]];
  let x = 0;

  items.forEach((item) => {
    if (x && x + item.width > maxWidth) {
      rows.push([]);
      x = 0;
    }
    rows[rows.length - 1].push(item);
    x += item.width + 34;
  });

  return rows;
}

function getExportInlineRowWidth(items) {
  return items.reduce((total, item, index) => total + item.width + (index ? 34 : 0), 0);
}

function tokenizeInlinePatternText(value) {
  const tokens = [];
  const pattern = /(__|\*\*|\*)(.+?)\1/g;
  let index = 0;
  let match;

  while ((match = pattern.exec(String(value)))) {
    if (match.index > index) {
      tokens.push({ text: String(value).slice(index, match.index), highlight: "" });
    }

    const highlight = match[1] === "*" ? "one" : match[1] === "**" ? "two" : "three";
    tokens.push({ text: match[2], highlight });
    index = pattern.lastIndex;
  }

  if (index < String(value).length) {
    tokens.push({ text: String(value).slice(index), highlight: "" });
  }

  return tokens;
}

function wrapRichInlineText(ctx, value, maxWidth, font) {
  ctx.font = font;
  const lines = [];
  let line = [];
  let lineText = "";

  tokenizeInlinePatternText(value).forEach((token) => {
    splitTextForExportWrap(token.text).forEach((unit) => {
      const pieces = ctx.measureText(unit).width > maxWidth && unit.length > 1 ? Array.from(unit) : [unit];
      pieces.forEach((piece) => {
        const nextText = lineText + piece;
        if (ctx.measureText(nextText).width > maxWidth && line.length) {
          lines.push(line);
          line = [];
          lineText = "";
        }

        const previous = line[line.length - 1];
        if (previous && previous.highlight === token.highlight) {
          previous.text += piece;
        } else {
          line.push({ text: piece, highlight: token.highlight });
        }
        lineText += piece;
      });
    });
  });

  if (line.length) {
    lines.push(line);
  }

  return lines.length ? lines : [[{ text: "", highlight: "" }]];
}

function splitTextForExportWrap(text) {
  const units = [];
  let buffer = "";
  let depth = 0;

  Array.from(String(text)).forEach((char) => {
    if (char === "(" || char === "（") {
      if (buffer && depth === 0) {
        units.push(...Array.from(buffer));
        buffer = "";
      }
      while (units.length && /[0-9A-Za-z]/.test(units[units.length - 1])) {
        buffer = units.pop() + buffer;
      }
      depth += 1;
      buffer += char;
      return;
    }

    if ((char === ")" || char === "）") && depth > 0) {
      buffer += char;
      depth -= 1;
      if (depth === 0) {
        units.push(buffer);
        buffer = "";
      }
      return;
    }

    if (depth > 0) {
      buffer += char;
    } else {
      units.push(char);
    }
  });

  if (buffer) {
    units.push(...Array.from(buffer));
  }

  return units;
}

function drawRichInlineSegments(ctx, segments, x, y, layout) {
  ctx.font = layout.lineFont;
  let cursor = x;

  segments.forEach((segment) => {
    const textWidth = ctx.measureText(segment.text).width;
    if (segment.highlight) {
      ctx.fillStyle = getExportHighlightColor(segment.highlight);
      drawRoundedRect(ctx, cursor - 4, y + 8, textWidth + 8, 48, 8);
    }

    ctx.fillStyle = palette.ink;
    ctx.fillText(segment.text, cursor, y + 52);
    cursor += textWidth;
  });
}

function getExportHighlightColor(highlight) {
  if (highlight === "one") {
    return "rgba(147, 202, 135, 0.45)";
  }
  if (highlight === "two") {
    return "rgba(255, 169, 62, 0.45)";
  }
  return "rgba(255, 255, 255, 0.98)";
}

function drawExportGridBackground(ctx, width, height) {
  ctx.fillStyle = "#f9fdfe";
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "rgba(127, 199, 233, 0.24)";
  ctx.lineWidth = 1;

  for (let x = 0; x <= width; x += 28) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (let y = 0; y <= height; y += 28) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
}

function loadExportImage(src) {
  if (!src) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = src;
  });
}

function drawExportImage(ctx, image, box) {
  const imageRatio = image.naturalWidth / image.naturalHeight;
  const boxRatio = box.width / box.height;
  const drawWidth = imageRatio > boxRatio ? box.width : box.height * imageRatio;
  const drawHeight = imageRatio > boxRatio ? box.width / imageRatio : box.height;
  const drawX = box.x + (box.width - drawWidth) / 2;
  const drawY = box.y + (box.height - drawHeight) / 2;

  ctx.save();
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(box.x, box.y, box.width, box.height, box.radius);
  } else {
    ctx.rect(box.x, box.y, box.width, box.height);
  }
  ctx.clip();
  ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
  ctx.restore();
}

function drawExportWatermark(ctx, image, box) {
  const imageRatio = image.naturalWidth / image.naturalHeight;
  const boxRatio = box.width / box.height;
  const drawWidth = imageRatio > boxRatio ? box.width : box.height * imageRatio;
  const drawHeight = imageRatio > boxRatio ? box.width / imageRatio : box.height;
  const drawX = box.x + box.width - drawWidth;
  const drawY = box.y + box.height - drawHeight;

  ctx.save();
  ctx.globalAlpha = 0.82;
  ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
  ctx.restore();
}

function drawFittedText(ctx, text, x, y, maxWidth, font, minSize) {
  const match = font.match(/(\d+)px/);
  const baseSize = match ? Number(match[1]) : minSize;
  let size = baseSize;
  let fittedFont = font;

  ctx.font = fittedFont;
  while (ctx.measureText(text).width > maxWidth && size > minSize) {
    size -= 2;
    fittedFont = font.replace(/\d+px/, `${size}px`);
    ctx.font = fittedFont;
  }

  ctx.fillText(text, x, y);
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
  if (ctx.roundRect) {
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    ctx.fill();
    return;
  }

  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.fill();
}

function strokeRoundedRect(ctx, x, y, width, height, radius) {
  if (ctx.roundRect) {
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    ctx.stroke();
    return;
  }

  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.stroke();
}

function createPdfFromJpeg(jpegDataUrl, imageWidth, imageHeight) {
  return createPdfFromJpegs([jpegDataUrl], imageWidth, imageHeight);
}

function createPdfFromJpegs(jpegDataUrls, imageWidth, imageHeight) {
  const pageWidth = imageWidth;
  const pageHeight = imageHeight;
  const contentStream = `q\n${pageWidth.toFixed(2)} 0 0 ${pageHeight.toFixed(2)} 0 0 cm\n/Im0 Do\nQ`;
  const pageRefs = jpegDataUrls.map((_, index) => 3 + index * 3);
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    `<< /Type /Pages /Kids [${pageRefs.map((ref) => `${ref} 0 R`).join(" ")}] /Count ${jpegDataUrls.length} >>`
  ];

  jpegDataUrls.forEach((jpegDataUrl, index) => {
    const pageRef = pageRefs[index];
    const imageRef = pageRef + 1;
    const contentRef = pageRef + 2;
    const binary = atob(jpegDataUrl.split(",")[1]);

    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /XObject << /Im0 ${imageRef} 0 R >> >> /Contents ${contentRef} 0 R >>`,
      `<< /Type /XObject /Subtype /Image /Width ${imageWidth} /Height ${imageHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${binary.length} >>\nstream\n${binary}\nendstream`,
      `<< /Length ${contentStream.length} >>\nstream\n${contentStream}\nendstream`
    );
  });

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
