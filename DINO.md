# Dino — Selldone Layout

**Dino Market** (package `dino-grocery-app`) is a Layout of the Selldone shop **molino** (shop 15645), shown only on **dino.selldone.shop**. Molino Market Hall is the shop's default; Tario, Walio, Dino and Valero each run on their own address. It was made on 7 November 2026, when the owner asked for designs C and D, "one with a purple theme, one black, every page with a new design, completely different from each other". Dino is design C. It started from Walio Market 1.1.6.

Every behaviour of Molino is kept:
- "Add to cart" turns into "− n +" in place;
- no pop-ups and no phone bottom bar;
- the two-step, map-first address sheet;
- the receipt;
- the reviews and the buyer account (the tabbed design).

[`KALIO.md`](KALIO.md) explains every behaviour and Selldone workaround.

## What makes it Dino

A quick-delivery grocery **app** on the web: purple on light, rounded, chunky and playful.

| | |
| --- | --- |
| Colour | Deep violet `#5b21b6` for every action, sunny yellow `#ffd43b` for the one thing to press (add, check out) and every saving badge, lavender `#f3eeff` under every packshot, a deep violet `#2e1065` footer |
| Type | **Fredoka** for headings and prices, **Figtree** for everything else (`components/kalio/kalio-fonts.ts`) |
| Shape | Big radii (18–32 px), pills everywhere, soft shadows, the yellow button's "step" shadow |
| Mark | A violet dinosaur on a yellow disc (`assets/brand/dino-mark.svg`); the wordmark is "dino" in Fredoka |

## Every page (1.0.0)

The mockups are `kalio-design/cd-options/<page>-c.html` in the project folder.

| Page | Design C |
| --- | --- |
| Header | A violet bar: the dinosaur, a "Get it your way" pill naming the shop's own delivery methods, a big rounded search, round icon buttons, and a yellow cart pill with the count and the total. Under it, a white strip of aisles, each with its icon. |
| Home | Three rounded promo cards you swipe on a phone (the shop's promise on violet with three packshots, this week's savings on yellow, the fresh aisle on lavender), the aisles as a big tile grid, today's deals with a countdown to midnight, the fresh aisle, the sellers as round avatars with four of their groceries, top picks, and how the order reaches you. |
| Card | A lavender rounded square with the packshot at 120 %, a yellow saving pill, and a round yellow "+" on the corner that becomes a violet "− n +" across the picture's foot; "Options" for sized products. Selldone's own card (catalogue, aisles, related rows) is dressed the same way. |
| Aisle, catalogue, search | A sticky column: every aisle with its icon (the current one in violet), then the filters in a white rounded card. The aisle's banner is a lavender-to-sun card with the aisle's icon. On a phone the aisles become a row of icon tiles you swipe. |
| Product | The picture in a rounded lavender stage, a brand pill, the price in violet Fredoka with a yellow saving pill, the delivery methods and the sellers as rounded choice cards, a big yellow "Add to cart", pill tabs for the details. |
| Cart | A rounded sheet from the right on every screen: a violet head with the count and a yellow free-shipping progress bar, rounded lines, a yellow checkout button. |
| Checkout | Step chips (done in yellow, current in violet), rounded cards, a lavender summary and a yellow pay button. |
| Seller | A violet banner across the page: the seller's mark in a yellow ring, an "Independent seller" pill, the name, live numbers as pills, and the seller's aisles as chips. |
| Account | A violet gradient banner with the tabs as pills; the overview's tiles in eight pastel colours; orders and addresses as rounded cards. |
| About | The story beside the dinosaur with the shop's live numbers floating around it, the four steps of an order, the values on pastel cards. |
| 404 | The dinosaur, tilted, asking "?" — "Oops, this aisle is empty." — the way home, the aisles as chips, today's deals. |
| Journal, terms, sign-in | Rounded cards and pill topics; the short version of the terms on pastel cards; sign-in on a lavender field with soft colour discs. |

Styles: `style/dino-home.scss` (home, rows, card), `style/dino-pages.scss` (the page structure, from Walio), `style/dino-c.scss` and `style/dino-c-pages.scss` (design C over every page), `style/dino-skin.scss` (header, strip, cart sheet, footer, checkout steps; loaded last).

## Photos

Dino needs no lifestyle photos: every picture is the shop's own packshots. `components/dino/dino-home.ts` still picks up photos dropped into `assets/dino/` by name (`dino-hero-1-weekly`, `dino-tile-bakery`…), for a later design; prompts for them are in `kalio-design/cd-options/image-prompts-c.md`.

## Releases

Release with `bash scripts/release.sh <version> home` (the tabbed account).

- **1.0.2 (8 November 2026):** no grey band down the right edge of every page: the closed cart sheet waits just past the edge, and its shadow (80px of blur) reached into the page; the shadow now shows only while the sheet is open.
- **1.0.1 (7 November 2026):** "cart", not "basket", in the footer; the violet promo card's packshots larger.
- **1.0.0 (7 November 2026):** the first Dino: design C on every page.
