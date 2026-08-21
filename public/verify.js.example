/**
 * verify.js — bateria de verificação da página, rodada dentro do browser.
 *
 * COMO USAR
 *   1. Na feature 0, copie este arquivo para `public/verify.js` do projeto.
 *   2. Com a página aberta na automação de browser, uma chamada só:
 *
 *        const { verify } = await import("/verify.js");
 *        await verify({ copy: ["Falar no WhatsApp", "..."] });
 *
 *   3. Se o relatório vier com "NAO MEDIDO — janela sem quadros", repita em duas
 *      fases: `verify({ phase: "prep" })` · screenshot · `verify({ phase: "read" })`.
 *      O screenshot é o que produz os quadros; a aba em segundo plano não anda
 *      sozinha, e reveal e larguras dependem disso.
 *   4. A feature de launch apaga `public/verify.js` — ele não vai para produção.
 *
 * POR QUE ASSIM
 *   Servido pelo `public/`, o payload da chamada é uma linha em vez do arquivo
 *   inteiro, e a medição roda na página real em vez de num HTML baixado. Cada
 *   verificação daqui existe porque a leitura ingênua dela já deu veredito
 *   errado em produção — ver `AGENTS.md` §5, "Armadilhas conhecidas".
 */

const DEFAULTS = {
  ctaSelector: 'a[href^="https://wa.me"], a[href*="wa.me/"]',
  widths: [390, 1440],
  copy: [],
  maxList: 8,
};

// --- cor -------------------------------------------------------------------

// getComputedStyle devolve lab()/oklch() no Chrome. Ler aqueles números como se
// fossem RGB reprova a página inteira em silêncio: quem converte para sRGB é o
// browser, pintando a cor num pixel e lendo de volta.
const ctx = document.createElement("canvas").getContext("2d", { willReadFrequently: true });

function toRGBA(color) {
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillStyle = "#000";
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
  return [r, g, b, a / 255];
}

function over([r, g, b, a], back) {
  return [0, 1, 2].map((i) => Math.round([r, g, b][i] * a + back[i] * (1 - a)));
}

function luminance([r, g, b]) {
  const f = (c) => (c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function ratio(fg, bg) {
  const [a, b] = [luminance(fg), luminance(bg)].sort((x, y) => y - x);
  return Math.round(((a + 0.05) / (b + 0.05)) * 100) / 100;
}

// Sobe a árvore compondo fundos até achar um opaco. Fundo com imagem não é
// medível assim — vira lista separada, não aprovação silenciosa.
function backdropOf(el) {
  let node = el;
  let acc = null;
  let hasImage = false;
  while (node) {
    const cs = getComputedStyle(node);
    if (cs.backgroundImage !== "none") hasImage = true;
    const c = toRGBA(cs.backgroundColor);
    if (c[3] > 0) acc = acc === null ? c : [...over(acc, c.slice(0, 3)), c[3]];
    if (acc && acc[3] >= 1) return { rgb: acc.slice(0, 3), hasImage };
    node = node.parentElement;
  }
  return { rgb: over(acc || [255, 255, 255, 1], [255, 255, 255]), hasImage };
}

// --- quadros ---------------------------------------------------------------

// A janela da automação nem sempre produz quadros: visibilityState "visible" não
// garante nada, hasFocus() falso congela o rAF do mesmo jeito. Sem este teste,
// toda medição de animação vira falso negativo.
function rafTicks(ms = 700) {
  return Promise.race([
    new Promise((res) => {
      let n = 0;
      const stop = performance.now() + ms;
      const loop = () => (performance.now() >= stop ? res(n) : (n++, requestAnimationFrame(loop)));
      requestAnimationFrame(loop);
    }),
    new Promise((res) => setTimeout(() => res(-1), ms + 2000)),
  ]);
}

// Sem o timeout, esperar N quadros numa janela que não pinta trava a chamada
// inteira em vez de devolver o diagnóstico. O fallback é o diagnóstico.
const frames = (n, ms = 3000) =>
  Promise.race([
    new Promise((res) => {
      const step = () => (--n <= 0 ? res("ok") : requestAnimationFrame(step));
      requestAnimationFrame(step);
    }),
    new Promise((res) => setTimeout(() => res("timeout"), ms)),
  ]);

// --- elementos -------------------------------------------------------------

const FOCUSABLE = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
const NATIVELY_INTERACTIVE = "A,BUTTON,INPUT,SELECT,TEXTAREA,SUMMARY,LABEL";

const path = (el) => {
  const id = el.id ? `#${el.id}` : "";
  const cls = typeof el.className === "string" && el.className ? `.${el.className.trim().split(/\s+/)[0]}` : "";
  return `${el.tagName.toLowerCase()}${id}${cls}`;
};

const label = (el) => (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 48);

const visible = (el) => {
  const r = el.getBoundingClientRect();
  const cs = getComputedStyle(el);
  return r.width > 0 && r.height > 0 && cs.display !== "none" && cs.visibility !== "hidden";
};

const ownsText = (el) =>
  [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1);

// --- verificações ----------------------------------------------------------

function checkContrast(max) {
  const fails = [];
  const onImage = [];
  for (const el of document.body.querySelectorAll("*")) {
    if (!ownsText(el) || !visible(el)) continue;
    const cs = getComputedStyle(el);
    if (parseFloat(cs.opacity) === 0) continue;

    const size = parseFloat(cs.fontSize);
    const bold = parseInt(cs.fontWeight, 10) >= 700;
    const large = size >= 24 || (bold && size >= 18.66);
    const need = large ? 3 : 4.5;

    const { rgb: bg, hasImage } = backdropOf(el);
    const fg = over(toRGBA(cs.color), bg);
    const r = ratio(fg, bg);
    const row = { el: path(el), text: label(el), size, ratio: r, need };

    if (hasImage) onImage.push(row);
    else if (r < need) fails.push(row);
  }
  fails.sort((a, b) => a.ratio - b.ratio);
  return {
    checked: "contraste AA na cor renderizada",
    fail: fails.length,
    worst: fails.slice(0, max),
    manual: onImage.slice(0, max).map((r) => ({ ...r, nota: "fundo com imagem — medir no ponto mais claro" })),
  };
}

const hiddenNow = (max) => {
  const hidden = [...document.body.querySelectorAll("*")]
    .filter((el) => ownsText(el) && visible(el) && parseFloat(getComputedStyle(el).opacity) < 0.99)
    .map((el) => ({ el: path(el), text: label(el), opacity: getComputedStyle(el).opacity }));
  return { checked: "opacidade após scroll", fail: hidden.length, list: hidden.slice(0, max) };
};

async function checkReveal(max) {
  const y = scrollY;
  scrollTo(0, document.body.scrollHeight);
  await frames(45);
  const out = hiddenNow(max);
  scrollTo(0, y);
  await frames(4);
  return out;
}

// A janela da automação tem piso de largura e mente sobre innerWidth. Iframe de
// largura fixa carrega a mesma URL num viewport real — e o rAF de dentro anda
// junto com o de cima, então só funciona com a janela pintando.
const openFrame = (w) => {
  const f = document.createElement("iframe");
  f.style.cssText = `position:fixed;left:-9999px;top:0;width:${w}px;height:900px;border:0`;
  f.src = location.href;
  document.body.appendChild(f);
  return f;
};

const readFrame = (f, w) => {
  const d = f.contentDocument;
  return {
    width: w,
    innerWidth: f.contentWindow.innerWidth,
    overflowX: Math.max(0, d.documentElement.scrollWidth - w),
    bodyFontSize: getComputedStyle(d.body).fontSize,
    h1FontSize: d.querySelector("h1") ? getComputedStyle(d.querySelector("h1")).fontSize : null,
  };
};

async function checkWidths(widths) {
  const out = [];
  for (const w of widths) {
    const f = openFrame(w);
    try {
      await new Promise((res) => {
        f.onload = res;
        f.onerror = res;
        setTimeout(res, 5000);
      });
      await frames(15);
      out.push(readFrame(f, w));
    } finally {
      f.remove();
    }
  }
  return { checked: "larguras reais via iframe", list: out };
}

function checkTabStops(ctaSelector, max) {
  const stops = [...document.querySelectorAll(FOCUSABLE)].filter(visible);
  const firstCta = stops.findIndex((el) => el.matches(ctaSelector));
  const inert = stops
    .filter((el) => !NATIVELY_INTERACTIVE.includes(el.tagName) && el.getAttribute("tabindex") === "0")
    .map((el) => ({ el: path(el), text: label(el) }));
  return {
    checked: "stops de Tab",
    total: stops.length,
    antesDoPrimeiroCta: firstCta < 0 ? "CTA não encontrado" : firstCta,
    tabIndexSemAcao: inert.length,
    list: inert.slice(0, max),
  };
}

// Acento, travessão e aspa tipográfica passam despercebidos na leitura a olho.
// textContent, não innerText: innerText devolve o texto já com `text-transform`
// aplicado, e aí todo CTA em caixa alta acusa divergência que não existe.
function checkCopy(expected, max) {
  const text = document.body.textContent.replace(/\s+/g, " ");
  const misses = [];
  for (const want of expected) {
    const flat = want.replace(/\s+/g, " ").trim();
    if (text.includes(flat)) continue;
    const head = flat.slice(0, 12);
    const at = text.indexOf(head);
    let diff = null;
    if (at >= 0) {
      const got = text.slice(at, at + flat.length + 8);
      const i = [...flat].findIndex((c, k) => c !== got[k]);
      diff = { index: i, esperado: flat[i], achado: got[i], contexto: got.slice(Math.max(0, i - 12), i + 12) };
    }
    misses.push({ esperado: flat.slice(0, 64), diff });
  }
  return { checked: "copy caractere a caractere", fail: misses.length, list: misses.slice(0, max) };
}

// --- entrada ---------------------------------------------------------------

// Duas fases, para quando a janela não pinta. Medido: um screenshot produz uns
// 7 quadros, mas só ENTRE chamadas de JS — dentro de uma chamada o rAF não anda
// com a aba em segundo plano. Então `prep` monta a cena e sai na hora, o
// screenshot roda os quadros, e `read` lê o que já ficou pronto.
function verifyPrep(cfg) {
  const st = (window.__verifyPrep = { y: scrollY, frames: [] });
  scrollTo(0, document.body.scrollHeight);
  for (const w of cfg.widths) st.frames.push({ w, f: openFrame(w) });
  return {
    fase: "prep",
    feito: `scroll no fim da página, ${st.frames.length} iframes carregando`,
    proximo: "tire um screenshot (é ele que produz os quadros) e chame verify({ phase: 'read' })",
  };
}

function verifyRead(cfg) {
  const st = window.__verifyPrep;
  if (!st) return { erro: "chame verify({ phase: 'prep' }) antes" };
  const reveal = hiddenNow(cfg.maxList);
  const list = [];
  for (const { w, f } of st.frames) {
    try {
      list.push(readFrame(f, w));
    } catch (e) {
      list.push({ width: w, erro: String(e) });
    }
    f.remove();
  }
  scrollTo(0, st.y);
  delete window.__verifyPrep;
  return { reveal, larguras: { checked: "larguras reais via iframe", list } };
}

export async function verify(options = {}) {
  const cfg = { ...DEFAULTS, ...options };
  const t0 = performance.now();

  if (cfg.phase === "prep") return verifyPrep(cfg);
  const lido = cfg.phase === "read" ? verifyRead(cfg) : null;

  // Primeiro passo, sempre: a janela produz quadros? Sem isso, tudo que depende
  // de animação ou de iframe devolve reprovação de página correta.
  const ticks = lido ? -1 : await rafTicks(500);
  const painting = Boolean(lido) || ticks > 2;
  const congelado = {
    status: "NAO MEDIDO — janela sem quadros",
    ticks,
    comoDestravar:
      "rode em duas fases: verify({ phase: 'prep' }) · screenshot · verify({ phase: 'read' })",
  };

  const report = {
    url: location.href,
    ambiente: {
      visibilityState: document.visibilityState,
      hasFocus: document.hasFocus(),
      rafTicksEm500ms: ticks,
    },
    contraste: checkContrast(cfg.maxList),
    reveal: lido ? lido.reveal : painting ? await checkReveal(cfg.maxList) : congelado,
    larguras: lido ? lido.larguras : painting ? await checkWidths(cfg.widths) : congelado,
    tab: checkTabStops(cfg.ctaSelector, cfg.maxList),
    copy: cfg.copy.length ? checkCopy(cfg.copy, cfg.maxList) : "nenhuma string passada",
  };

  const problemas = [
    report.contraste.fail && `contraste: ${report.contraste.fail} reprovando`,
    report.contraste.manual.length && `contraste: ${report.contraste.manual.length} sobre imagem, medir à mão`,
    !painting && `${congelado.status} — reveal e larguras não medidos, ${congelado.comoDestravar}`,
    report.reveal.fail && `opacidade: ${report.reveal.fail} elementos invisíveis após scroll`,
    painting && report.larguras.list.some((w) => w.overflowX > 0) && "largura: scroll horizontal em alguma largura",
    report.tab.tabIndexSemAcao && `tab: ${report.tab.tabIndexSemAcao} tabIndex em elemento sem ação`,
    report.copy.fail && `copy: ${report.copy.fail} strings divergindo`,
  ].filter(Boolean);

  report.veredito = problemas.length ? problemas : "nenhum problema nas verificações automáticas";
  report.ms = Math.round(performance.now() - t0);
  return report;
}

export default verify;
