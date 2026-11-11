/*
 * Dino's words, per language: the shared Kalio base (base/<lang>.ts, a copy
 * of new-shop-kits/i18n/kalio-base) plus Dino's own (dino.<lang>.ts).
 * English is bundled; every other language is its own small chunk, fetched
 * only when a visitor picks it (lang-<code>.ts merges its files).
 * Dino says "cart" where the shared base says "basket" (dino.en-cart.ts, English
 * only: the other languages' base terms already fit a cart).
 * A language the owner enables later: copy base/<code>.ts, write
 * dino.<code>.ts, add lang-<code>.ts and one line below.
 */
import baseEn from "./base/en";
import dinoEn from "./dino.en";
import cartEn from "./dino.en-cart";

export const EN: Record<string, string> = { ...baseEn, ...cartEn, ...dinoEn };

export const LOADERS: Record<string, () => Promise<any>> = {
  ar: () => import("./lang-ar"),
  pa: () => import("./lang-pa"),
  es: () => import("./lang-es"),
  da: () => import("./lang-da"),
  fr: () => import("./lang-fr"),
};
