/*
 * Dino — the theme switcher's config (the footer's "Theme" row, just above
 * the copyright line: the owner, 10 November 2026, after talking with the
 * Selldone team; it was a header button from 9 November). The same on every
 * molino Layout as on Digito and Besti.
 *
 * The switcher itself is Layout-agnostic (components/theme-switcher/); this
 * file is everything Dino-specific: the palettes, which Dino and Kalio
 * variables each palette value feeds, the dark token set, and Vuetify's dark
 * surfaces. storefront.ts calls bootThemeSwitcher(DINO_THEME, vuetify)
 * before mounting, so the chosen theme paints first, with no flash.
 *
 * Dino's dress: the action colour (violet) paints the header bar, buttons
 * and chosen states; three tints of it (lav, lav-2, lav-3) are the soft
 * grounds and edges; a very deep shade ("night") the footer and headings;
 * the sunny yellow press-me (cart pill, the round +) stays yellow in every
 * palette, with dark words.
 *
 * Contrast (WCAG 2.1, measured): white on each light primary — violet 8.98,
 * emerald 6.99, blue 6.97, teal 6.51, orange 6.37 (6.3 or more: the header
 * carries 12% white pills and pale words). White on each light hover
 * ("deep", lighter in Dino) — 5.70, 5.48, 5.17, 5.36, 5.18. White on each
 * dark primary — 5.21, 5.48, 5.17, 5.36, 5.18, each 3:1 or more against the
 * dark card #161d2e; each dark "text" colour on that card — 9.11, 11.03,
 * 7.86, 11.60, 9.97.
 */
import { t } from "../kalio/i18n/kalio-i18n";
import type { ThemeSwitcherConfig } from "../theme-switcher/theme-switcher";
import { THEME_SETTINGS } from "./dino-theme.settings";

/* The custom colour's tints, from its own primary: on white in light, on the
   dark card in dark. Plain hex (not color-mix), so every check that reads
   computed colours can measure them. */
const mix = (c: string, pct: number, base: string): string => {
  const rgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [a, b] = [rgb(c), rgb(base)];
  return "#" + a.map((v, i) => Math.round((v * pct + b[i] * (100 - pct)) / 100).toString(16).padStart(2, "0")).join("");
};

export const DINO_THEME: ThemeSwitcherConfig = {
  /* The merchant's choice (palette or brand colour, light or dark, whether
     visitors get the switcher): dino-theme.settings.ts, the one file to edit. */
  settings: THEME_SETTINGS,

  /* The owner (9 November 2026): a merchant who imports Dino into their own
     shop must not see the switcher. With themeSwitcher "showcase" it shows
     only on these shops; the shop is told by window.shop.id, else
     <meta name="shop-name">. */
  showcaseShops: [
    { id: 15549, name: "digini-hzgablru" }, // Digini: Digito, Besti
    { id: 15645, name: "molino" }, // Molino: Molino, Tario, Walio, Dino, Valero
  ],

  storageKey: "dino-theme",
  darkClass: "dn-dark",

  palettes: [
    {
      id: "violet",
      get name() {
        return t("dino.palette.violet", "Dino violet");
      },
      light: { primary: "#5b21b6", deep: "#7c3aed", soft: "#f3eeff", soft2: "#e9dfff", soft3: "#d9c9ff", night: "#2e1065", onPrimary: "#ffffff", text: "#5b21b6", pop: "#ffd43b" },
      dark: { primary: "#8046ee", deep: "#6d28d9", soft: "#2a1d4d", soft2: "#33245c", soft3: "#45307a", night: "#1d1236", onPrimary: "#ffffff", text: "#c4b5fd" },
    },
    {
      id: "emerald",
      get name() {
        return t("dino.palette.emerald", "Emerald");
      },
      light: { primary: "#05664a", deep: "#047857", soft: "#e3f6ee", soft2: "#cdeee0", soft3: "#a7dcc5", night: "#053b2b", onPrimary: "#ffffff", text: "#05664a", pop: "#ffffff" },
      dark: { primary: "#047857", deep: "#065f46", soft: "#123a30", soft2: "#164a3d", soft3: "#1d5e4d", night: "#0b2a22", onPrimary: "#ffffff", text: "#6ee7b7" },
    },
    {
      id: "blue",
      get name() {
        return t("dino.palette.blue", "Ocean blue");
      },
      light: { primary: "#0a4bd8", deep: "#2563eb", soft: "#e8efff", soft2: "#d6e2ff", soft3: "#b8ccff", night: "#0a2463", onPrimary: "#ffffff", text: "#0a4bd8", pop: "#ffffff" },
      dark: { primary: "#2563eb", deep: "#1d4ed8", soft: "#16264d", soft2: "#1c2f60", soft3: "#263f7d", night: "#0e1a3d", onPrimary: "#ffffff", text: "#8fb0ff" },
    },
    {
      id: "teal",
      get name() {
        return t("dino.palette.teal", "Teal");
      },
      light: { primary: "#0c6680", deep: "#0e7490", soft: "#e0f4f8", soft2: "#c8ebf3", soft3: "#a1dae8", night: "#083344", onPrimary: "#ffffff", text: "#0c6680", pop: "#ffffff" },
      dark: { primary: "#0e7490", deep: "#155e75", soft: "#123540", soft2: "#16424f", soft3: "#1c5566", night: "#0a2630", onPrimary: "#ffffff", text: "#67e8f9" },
    },
    {
      id: "orange",
      get name() {
        return t("dino.palette.orange", "Sunset orange");
      },
      light: { primary: "#a93a0b", deep: "#c2410c", soft: "#fdeee6", soft2: "#fbdccb", soft3: "#f6bf9f", night: "#4a1a06", onPrimary: "#ffffff", text: "#a93a0b", pop: "#ffffff" },
      dark: { primary: "#c2410c", deep: "#9a3412", soft: "#3d2215", soft2: "#4a2a19", soft3: "#5e3520", night: "#2a1409", onPrimary: "#ffffff", text: "#fdba74" },
    },
  ],

  /* Palette value -> the variables that carry it. Dino's own (--d-*) and the
     Kalio base's (--k-green* is Kalio's name for the action colour). */
  tokens: {
    "--d-violet": "primary",
    "--d-violet-2": "deep",
    "--d-deep": "night",
    "--d-lav": "soft",
    "--d-lav-2": "soft2",
    "--d-lav-3": "soft3",
    "--d-link": "text",
    "--d-deep-ink": "light.night",
    "--d-head": "light.primary",
    "--d-foot": "light.night",
    "--d-pop": "light.pop", /* the accent words on the header colour: yellow on violet (4.8:1 on the drawer head), white where yellow falls under 4.5 */
    "--d-primary-rgb": "primary:rgb",
    "--d-on-brand": "onPrimary",
    "--d-on-brand-rgb": "onPrimary:rgb",
    "--k-green": "primary",
    "--k-green-deep": "light.night",
    "--k-green-lift": "deep",
    "--k-green-soft": "soft",
    "--k-on-green": "onPrimary",
    "--k-coral": "text",
    "--k-wash": "soft",
    "--k-line-strong": "soft3",
    /* The packshot ground: the palette's light tint, light in dark mode too,
       so a packshot never shows its edge on a dark tile. */
    "--k-well": "light.soft",
    "--k-tint": "light.soft",
  },

  /* While dark (Digito's neutrals, the same on every molino Layout but
     Valero). The yellow press-me and the packshot wells stay light. */
  dark: {
    "--d-deep-ink": "#e8ecf3",
    "--d-ink-bg": "var(--d-violet)",
    "--k-ink": "#e8ecf3",
    "--k-ink-2": "#d3d9e3",
    "--k-muted": "#a3adbd",
    "--k-paper": "#0d1220",
    "--k-card": "#161d2e",
    "--k-plain": "#1e2639",
    "--k-line": "#2a3347",
    "--k-line-strong": "#6b7690",
    "--k-line-soft": "#232b3d",
    "--k-coral-soft": "#3a3016",
    "--k-amber": "#fbbf24",
    "--k-star-off": "#6b7690",
    "--k-shadow": "0 10px 28px -14px rgba(0, 0, 0, 0.7)",
  },

  vuetify: {
    light: "light",
    dark: "dark",
    paletteColors: { primary: "primary", "on-primary": "onPrimary" },
    darkColors: {
      background: "#0d1220",
      surface: "#161d2e",
      "surface-bright": "#1e2639",
      "surface-variant": "#2a3347",
      "on-background": "#e8ecf3",
      "on-surface": "#e8ecf3",
      "on-surface-variant": "#c3cbd8",
      "on-primary": "#ffffff",
      secondary: "#e8ecf3",
      "on-secondary": "#0d1220",
      error: "#ff6b7d",
      info: "#7aa2ff",
      success: "#4ade80",
      warning: "#fbbf24",
    },
  },

  metaThemeColor: "light.primary",
  ui: { ink: "var(--k-ink)", muted: "var(--k-muted)", line: "var(--k-line)", surface: "var(--k-card)", font: "var(--k-body)" },
  labels: {
    get theme() {
      return t("theme.title", "Theme");
    },
    get palettes() {
      return t("theme.palettes", "Colour");
    },
    get mode() {
      return t("theme.mode", "Light or dark");
    },
    get modeTitle() {
      return t("theme.modeTitle", "Mode");
    },
    get light() {
      return t("theme.light", "Light");
    },
    get dark() {
      return t("theme.dark", "Dark");
    },
    get custom() {
      return t("theme.custom", "Custom colour");
    },
    get adjusted() {
      return t("theme.adjusted", "Adjusted for readability");
    },
    get brand() {
      return t("theme.brand", "Brand colour");
    },
  },

  /* "Custom colour" (the owner, 9 November 2026): any colour, made readable
     by paletteFromColor(). Dino's header is painted with the light primary
     and carries 12% white pills and pale words, so white on it must reach
     6.5:1. Dino's three tints and its night shade come from the pick. */
  custom: {
    headerContrast: 6.5,
    darkSurfaces: ["#0d1220", "#161d2e", "#1e2639"],
    darkText: "#1e1033",
    extras: (v, mode) =>
      mode === "light"
        ? { soft2: mix(v.primary, 15, "#ffffff"), soft3: mix(v.primary, 28, "#ffffff"), night: mix(v.primary, 52, "#000000"), pop: v.onPrimary }
        : { soft2: mix(v.primary, 24, "#161d2e"), soft3: mix(v.primary, 36, "#161d2e"), night: mix(v.primary, 26, "#0b0f1a") },
  },
};
