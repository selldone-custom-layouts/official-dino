/* Dino in this language: the shared Kalio base and Dino's own words, one chunk. */
import base from "./base/pa";
import own from "./dino.pa";

export default { ...base, ...own } as Record<string, string>;
