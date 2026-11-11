/* Dino in this language: the shared Kalio base and Dino's own words, one chunk. */
import base from "./base/ar";
import own from "./dino.ar";

export default { ...base, ...own } as Record<string, string>;
