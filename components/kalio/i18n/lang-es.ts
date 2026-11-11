/* Dino in this language: the shared Kalio base and Dino's own words, one chunk. */
import base from "./base/es";
import own from "./dino.es";

export default { ...base, ...own } as Record<string, string>;
