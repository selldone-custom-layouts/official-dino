/* Dino in this language: the shared Kalio base and Dino's own words, one chunk. */
import base from "./base/da";
import own from "./dino.da";

export default { ...base, ...own } as Record<string, string>;
