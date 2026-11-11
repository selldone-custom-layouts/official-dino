/* Dino in this language: the shared Kalio base and Dino's own words, one chunk. */
import base from "./base/fr";
import own from "./dino.fr";

export default { ...base, ...own } as Record<string, string>;
