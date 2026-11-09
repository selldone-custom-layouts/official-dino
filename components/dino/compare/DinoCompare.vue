<!--
  Dino — the compare page (8 November 2026; design 1 of the two mockups,
  kalio-design/cd-options/compare-c1.html, the owner's pick).

  Side by side: the picks stay pinned under the header with their photo,
  price, price per ounce and Add to cart (Kalio's "− n +" in place), and an
  empty column to add one more (up to four). Below, the product details in
  the groups the shop wrote them in ("At a Glance", "Product Details", …):
  a row whose values differ is marked, a row where every product says the
  same is one line ("PantryVale · both"), and "Only differences" hides the
  rest. Then why to pick each (its pros, and cons if it has any), its
  reviews, and the link to share.

  The list lives in the page's address (?list=p1_p2v3, Selldone's own
  format), so the link opens the same comparison anywhere; with no list,
  the page opens what the shopper has added to compare. Removing, adding or
  clearing here changes both. Replaces Selldone's SComparisonList table.

  On a phone two products fit side by side; with three or four the details
  scroll sideways, the pinned strip moving with them.
-->
<template>
  <div :style="vars" class="d-cmp k-wrap">
    <nav aria-label="Breadcrumb" class="k-crumbs d-cmp__crumbs">
      <router-link :to="home">{{ shop?.title || "Home" }}</router-link>
      <v-icon size="16">chevron_right</v-icon>
      <span>Compare</span>
    </nav>

    <div v-if="busy && !items.length" class="d-cmp__wait">
      <v-progress-circular color="primary" indeterminate size="26" width="3" />
      Getting your picks…
    </div>

    <!-- ▆▆▆▆ Nothing to compare ▆▆▆▆ -->
    <section v-else-if="!items.length" class="d-cmp__empty">
      <img :src="mark" alt="" class="d-cmp__mascot" />
      <h1>Nothing to compare yet</h1>
      <p>Tap Compare on a product, or find one here. Up to {{ MAX }} side by side.</p>
      <dino-compare-add :max="MAX" :suggestions="suggested" wide @add="add" />
      <router-link :to="catalogue" class="d-cmp__btn -violet">
        Browse groceries<v-icon size="20">arrow_forward</v-icon>
      </router-link>
    </section>

    <template v-else>
      <div class="d-cmp__top">
        <div>
          <h1>Compare groceries</h1>
          <p>{{ summary }}</p>
        </div>
        <div class="d-cmp__tools">
          <button
            :aria-pressed="diffOnly"
            :class="{ '-on': diffOnly }"
            :disabled="items.length < 2"
            class="d-cmp__sw"
            type="button"
            @click="diffOnly = !diffOnly"
          >
            <i></i>Only differences
          </button>
          <button class="d-cmp__btn -line" type="button" @click="share">
            <v-icon size="20">{{ copied === "top" ? "check" : "ios_share" }}</v-icon>{{ copied === "top" ? "Link copied" : "Share" }}
          </button>
          <button class="d-cmp__btn -soft" type="button" @click="clear">
            <v-icon size="20">delete_outline</v-icon>Clear
          </button>
        </div>
      </div>

      <!-- A phone: "Add a product" above the picks (no empty column). -->
      <dino-compare-add
        v-if="items.length < MAX"
        :aisle="aisleTitle"
        :exclude="ids"
        :max="MAX"
        :suggestions="suggested"
        class="d-cmp__add-phone"
        wide
        @add="add"
      />

      <!-- ▆▆▆▆ The picks, pinned ▆▆▆▆ -->
      <div class="d-cmp__strip">
        <div class="d-cmp__scroll" @scroll.passive="sync">
          <div class="d-cmp__g">
            <div class="d-cmp__hint"><b>Your picks</b>Pinned while you scroll. Remove one with ×.</div>

            <article v-for="it in items" :key="it.key" class="d-cmp__cp">
              <button :aria-label="`Remove ${it.product.title}`" class="d-cmp__rm" type="button" @click="remove(it)">
                <v-icon size="18">close</v-icon>
              </button>
              <router-link :to="productRoute(it)" aria-hidden="true" class="d-cmp__well" tabindex="-1">
                <span v-if="it.off > 0" class="d-cmp__off">-{{ it.off }}%</span>
                <img v-if="it.image" :src="it.image" :srcset="it.srcset" alt="" sizes="(max-width: 760px) 72px, 112px" @error="dropSrcset" />
              </router-link>
              <div class="d-cmp__cp-tx">
                <router-link :to="productRoute(it)" class="d-cmp__nm">{{ it.product.title }}</router-link>
                <small v-if="it.variantLabel" class="d-cmp__var">{{ it.variantLabel }}</small>
                <div class="d-cmp__pr">
                  <u-price :amount="it.price.now" :currency="currency" class="d-cmp__now" />
                  <s v-if="it.price.was"><u-price :amount="it.price.was" :currency="currency" /></s>
                </div>
                <div v-if="it.per" class="d-cmp__per">
                  {{ money(it.per.amount) }} {{ it.per.unit === "each" ? "each" : `/ ${it.per.unit}` }}
                </div>
                <kalio-card-step
                  :addable="() => it.stock > 0"
                  :adder="() => quickBuy(it.product)"
                  :product="it.product"
                  :sold-out="() => !(it.stock > 0)"
                  card
                  class="d-cmp__buy"
                />
              </div>
            </article>

            <dino-compare-add
              v-if="items.length < MAX"
              :aisle="aisleTitle"
              :exclude="ids"
              :max="MAX"
              :suggestions="suggested"
              class="d-cmp__slot"
              @add="add"
            />
          </div>
        </div>
      </div>

      <!-- ▆▆▆▆ The details, group by group ▆▆▆▆ -->
      <section v-for="g in shownGroups" :key="g.title" class="d-cmp__grp">
        <h3>
          <span class="d-cmp__ic"><v-icon size="20">{{ g.icon }}</v-icon></span>{{ g.title }}
          <span v-if="items.length > 1" class="d-cmp__n">{{ g.diff ? `${g.diff} differ` : "All the same" }}</span>
        </h3>
        <div class="d-cmp__scroll" @scroll.passive="sync">
          <div v-for="row in g.shown" :key="row.key" :class="{ '-diff': row.diff }" class="d-cmp__g d-cmp__row">
            <div class="d-cmp__k"><i v-if="row.diff"></i>{{ row.key }}</div>
            <div v-if="row.same" class="d-cmp__both">
              <v-icon size="20">check_circle</v-icon>{{ row.values[0] }}<small>· {{ items.length === 2 ? "both" : `all ${items.length}` }}</small>
            </div>
            <template v-else>
              <div v-for="(v, i) in row.values" :key="i" :class="{ '-none': !v }" class="d-cmp__c">{{ v || "—" }}</div>
            </template>
            <div v-if="items.length < MAX" class="d-cmp__sp"></div>
          </div>
        </div>
      </section>

      <section v-if="!diffOnly && hasPros" class="d-cmp__grp">
        <h3><span class="d-cmp__ic"><v-icon size="20">thumb_up</v-icon></span>Why pick it</h3>
        <div class="d-cmp__scroll" @scroll.passive="sync">
          <div class="d-cmp__g d-cmp__row -top">
            <div class="d-cmp__k">Good to know</div>
            <ul v-for="it in items" :key="it.key" class="d-cmp__pros">
              <li v-for="(t, i) in it.pros" :key="i"><v-icon size="20">check_circle</v-icon>{{ t }}</li>
            </ul>
            <div v-if="items.length < MAX" class="d-cmp__sp"></div>
          </div>
          <div v-if="hasCons" class="d-cmp__g d-cmp__row -top">
            <div class="d-cmp__k">Worth knowing</div>
            <ul v-for="it in items" :key="it.key" class="d-cmp__pros -cons">
              <li v-for="(t, i) in it.cons" :key="i"><v-icon size="20">remove_circle</v-icon>{{ t }}</li>
            </ul>
            <div v-if="items.length < MAX" class="d-cmp__sp"></div>
          </div>
        </div>
      </section>

      <section v-if="!diffOnly" class="d-cmp__grp">
        <h3><span class="d-cmp__ic"><v-icon size="20">star</v-icon></span>Reviews</h3>
        <div class="d-cmp__scroll" @scroll.passive="sync">
          <div class="d-cmp__g d-cmp__row">
            <div class="d-cmp__k">Rating</div>
            <div v-for="it in items" :key="it.key" class="d-cmp__rev">
              <span class="d-cmp__stars" :aria-label="it.rateCount ? `${it.rate} out of 5` : 'No reviews yet'">
                <v-icon v-for="s in 5" :key="s" :class="{ '-on': it.rateCount && s <= Math.round(it.rate) }" size="18">star</v-icon>
              </span>
              <template v-if="it.rateCount">{{ it.rate.toFixed(1) }} · {{ it.rateCount }} {{ it.rateCount === 1 ? "review" : "reviews" }}</template>
              <template v-else>No reviews yet <router-link :to="productRoute(it)">Write one</router-link></template>
            </div>
            <div v-if="items.length < MAX" class="d-cmp__sp"></div>
          </div>
        </div>
      </section>

      <section class="d-cmp__share">
        <img :src="mark" alt="" class="d-cmp__mascot" />
        <div>
          <h3>Share this comparison</h3>
          <p>Send it to someone you shop with, or keep the link for later.</p>
        </div>
        <div class="d-cmp__lnk">
          <span>{{ linkShown }}</span>
          <button class="d-cmp__btn -violet" type="button" @click="copy('card')">
            <v-icon size="18">{{ copied === "card" ? "check" : "content_copy" }}</v-icon>{{ copied === "card" ? "Copied" : "Copy link" }}
          </button>
        </div>
      </section>
    </template>

    <kalio-quick-buy v-model="quick_buy" :product="picked" />
  </div>
</template>

<script>
import { PriceHelper } from "@selldone/core-js";
import CurrencyMixin from "@selldone/components-vue/mixin/currency/CurrencyMixin.ts";
import KalioCardStep from "../../kalio/KalioCardStep.vue";
import KalioQuickBuy from "../../kalio/KalioQuickBuy.vue";
import DinoCompareAdd from "./DinoCompareAdd.vue";
import { BRAND } from "../../kalio/kalio-brand";
import { quickAdd } from "../../kalio/kalio-basket";
import { aisleIndex, catalogueRoute, dropSrcset, productImage, productSrcset } from "../../kalio/kalio-catalog";
import { compareListParam, groupIcon, parseCompareList, specGroups, specText, specValue, unitSize } from "./dino-compare";

const MAX = 4;
/* A variant's own sizes, as rows of their own when a pick is a variant. */
const VARIANT_KEYS = [
  ["volume", "Volume"],
  ["weight", "Weight"],
  ["pack", "Pack"],
  ["style", "Style"],
  ["type", "Type"],
];
const norm = (s) => String(s || "").trim().toLowerCase();

export default {
  name: "DinoCompare",
  components: { KalioCardStep, KalioQuickBuy, DinoCompareAdd },
  mixins: [CurrencyMixin],

  data: () => ({
    MAX,
    mark: BRAND.mark,
    busy: false,
    refs: [],
    loaded: {},
    aisles: null,
    pool: [],
    pool_for: null,
    diffOnly: false,
    copied: null,
    quick_buy: false,
    picked: null,
  }),

  computed: {
    shop() {
      return this.$store.getters.getShop;
    },
    currency() {
      return this.GetUserSelectedCurrency().code;
    },
    home() {
      return { name: window.$storefront.routes.SHOP_PAGE };
    },
    catalogue() {
      return catalogueRoute();
    },

    /** The picks, with what the page shows of each worked out once. */
    items() {
      const out = [];
      for (const ref of this.refs) {
        const product = this.loaded[ref.p];
        if (!product) continue;
        const variant = ref.v ? (product.product_variants || []).find((x) => x.id === ref.v) || null : null;
        if (ref.v && !variant) continue;
        const price = this.priceOf(product, variant);
        const size = unitSize(product, variant);
        out.push({
          key: ref.v ? `${ref.p}-${ref.v}` : `${ref.p}`,
          ref,
          product,
          variant,
          price,
          off: this.offOf(product, variant),
          per: size && price.now ? { amount: price.now / size.n, unit: size.unit } : null,
          image: variant?.image ? window.CDN.GET_SHOP_IMAGE_PATH(variant.image) : productImage(product),
          srcset: productSrcset(product, variant?.image || null),
          variantLabel: variant ? VARIANT_KEYS.map(([k]) => specText(variant[k])).filter(Boolean).join(" · ") : null,
          stock: variant ? variant.quantity : product.quantity,
          pros: this.lines(product.pros),
          cons: this.lines(product.cons),
          rate: Number(product.rate) || 0,
          rateCount: Number(product.rate_count) || 0,
        });
        if (out.length === MAX) break;
      }
      return out;
    },
    ids() {
      return this.items.map((it) => it.product.id);
    },

    /** Every detail row: its values side by side, whether they differ. */
    groups() {
      const items = this.items;
      const many = items.length > 1;
      const row = (key, values) => {
        const same = many && values[0] !== "" && values.every((v) => norm(v) === norm(values[0]));
        const diff = many && !same;
        return { key, values, same, diff };
      };
      const out = [];
      const variantRows = VARIANT_KEYS.filter(([k]) => items.some((it) => it.variant && specText(it.variant[k])))
        .map(([k, label]) => row(label, items.map((it) => specText(it.variant?.[k]))));
      if (variantRows.length) out.push({ title: "Your pick", rows: variantRows });
      for (const g of specGroups(items.map((it) => it.product))) {
        out.push({ title: g.title, rows: g.keys.map((k) => row(k, items.map((it) => specValue(it.product, k)))) });
      }
      return out.map((g) => ({ ...g, icon: groupIcon(g.title), diff: g.rows.filter((r) => r.diff).length }));
    },
    shownGroups() {
      return this.groups
        .map((g) => ({ ...g, shown: this.diffOnly ? g.rows.filter((r) => r.diff) : g.rows }))
        .filter((g) => g.shown.length);
    },
    rowCount() {
      return this.groups.reduce((n, g) => n + g.rows.length, 0);
    },
    diffCount() {
      return this.groups.reduce((n, g) => n + g.diff, 0);
    },
    hasPros() {
      return this.items.some((it) => it.pros.length);
    },
    hasCons() {
      return this.items.some((it) => it.cons.length);
    },

    /** The aisle the picks come from (the first pick's). */
    aisle() {
      const first = this.items[0];
      return first && this.aisles ? this.aisles.get(first.product.category_id) || null : null;
    },
    aisleTitle() {
      return this.aisle ? this.aisle.title || this.aisle.name : null;
    },
    summary() {
      const n = this.items.length;
      if (n < 2) return "Add one more product to see what differs.";
      const cats = new Set(this.items.map((it) => it.product.category_id));
      const from = cats.size === 1 ? (this.aisleTitle ? ` from ${this.aisleTitle}` : "") : ` from ${cats.size} aisles`;
      const tail = this.rowCount ? ` · ${this.diffCount} of ${this.rowCount} details differ` : "";
      return `${n} products${from}${tail}`;
    },
    suggested() {
      return this.pool.filter((p) => !this.ids.includes(p.id)).slice(0, 3);
    },

    link() {
      const href = this.$router.resolve({
        name: window.$storefront.routes.COMPARISON_PAGE,
        query: { list: compareListParam(this.refs) },
      }).href;
      return `${window.location.origin}${href}`;
    },
    linkShown() {
      return this.link.replace(/^https?:\/\//, "");
    },
    vars() {
      const n = Math.max(1, this.items.length);
      return { "--n": n, "--slots": n < MAX ? n + 1 : n };
    },
  },

  watch: {
    "$route.query.list": {
      handler() {
        this.read();
      },
    },
    "aisle.id"() {
      this.fillPool();
    },
  },

  created() {
    this.setPageTitle("Compare groceries");
    this.read();
    aisleIndex().then((map) => {
      this.aisles = map;
      this.fillPool();
    });
  },

  beforeUnmount() {
    clearTimeout(this.copy_timer);
  },

  methods: {
    dropSrcset,

    /** The list from the address; with none, what the shopper has added to
     *  compare (then the address is set to it, so it can be shared). */
    read() {
      // Leaving for another page changes the query too: not ours to touch.
      if (this.$route.name !== window.$storefront.routes.COMPARISON_PAGE) return;
      const param = this.$route.query.list;
      let refs = parseCompareList(param);
      if (!refs.length && param === undefined && !this.touched) {
        const stored = this.$store.getters.getProductsComparison || [];
        refs = stored.map((p) => ({ p: p.id, v: p.variant?.id || null }));
        if (refs.length) {
          this.$router.replace({ query: { ...this.$route.query, list: compareListParam(refs) } });
          return;
        }
      }
      this.refs = refs.slice(0, MAX);
      this.fetch(this.refs.map((r) => r.p));
    },

    /** Full products (details, pros, variants) for the ids not read yet. */
    fetch(ids) {
      const need = [...new Set(ids)].filter((id) => !this.loaded[id]);
      if (!need.length) return Promise.resolve();
      this.busy = true;
      return window.axios
        .get(window.XAPI.GET_PRODUCTS_LIST(this.shop?.name || window.$storefront.name), { params: { list: need } })
        .then(({ data }) => {
          if (data?.error) return;
          const next = { ...this.loaded };
          for (const p of data.products || []) next[p.id] = p;
          this.loaded = next;
        })
        .catch(() => {})
        .finally(() => (this.busy = false));
    },

    /** A few products from the picks' aisle, to add with one tap. */
    fillPool() {
      if (!this.aisles) return;
      const aisle = this.aisle;
      const key = aisle ? aisle.id : "all";
      if (this.pool_for === key) return;
      this.pool_for = key;
      window.$storefront.products
        .list(aisle ? aisle.name : null, 0, 10, { products_only: true, available: true, ...(aisle ? {} : { sort: "most_popular" }) })
        .then(({ products }) => {
          if (this.pool_for === key) this.pool = (products || []).filter((p) => p.icon);
        })
        .catch(() => {});
    },

    setRefs(refs) {
      this.touched = true;
      const query = { ...this.$route.query };
      if (refs.length) query.list = compareListParam(refs);
      else delete query.list;
      this.refs = refs;
      this.$router.replace({ query });
    },

    remove(it) {
      this.removeFromProductComparison(it.product, it.variant);
      this.setRefs(this.refs.filter((r) => !(r.p === it.ref.p && r.v === it.ref.v)));
    },

    add(product) {
      if (this.items.length >= MAX || this.ids.includes(product.id)) return;
      this.fetch([product.id]).then(() => {
        const full = this.loaded[product.id];
        if (!full || this.ids.includes(full.id)) return;
        const variant = (full.product_variants || [])[0] || null;
        this.addToProductComparison(full, variant);
        this.setRefs([...this.refs, { p: full.id, v: variant ? variant.id : null }]);
      });
    },

    clear() {
      this.$store.commit("setProductsComparison", []);
      this.diffOnly = false;
      this.setRefs([]);
    },

    quickBuy(product) {
      quickAdd(this, product, (picked) => {
        this.picked = picked;
        this.quick_buy = true;
      });
    },

    share() {
      if (navigator.share && window.matchMedia("(max-width: 760px)").matches) {
        navigator.share({ title: "Compare groceries", url: this.link }).catch(() => {});
        return;
      }
      this.copy("top");
    },

    copy(where) {
      const done = () => {
        this.copied = where;
        clearTimeout(this.copy_timer);
        this.copy_timer = setTimeout(() => (this.copied = null), 2000);
      };
      if (navigator.clipboard?.writeText) navigator.clipboard.writeText(this.link).then(done, () => {});
    },

    /* ── Values ── */
    priceOf(product, variant) {
      try {
        const now = PriceHelper.priceProductByCurrency(this.shop, product, variant, this.currency);
        const off = PriceHelper.getProductDiscountAmountByCurrency(this.shop, product, variant, this.currency) || 0;
        return { now, was: off > 0 ? now + off : null };
      } catch {
        return { now: 0, was: null };
      }
    },
    offOf(product, variant) {
      try {
        return this.shop ? Math.round(PriceHelper.discountProductPercent(this.shop, product, variant) || 0) : 0;
      } catch {
        return 0;
      }
    },
    /** Pros and cons as lines: Selldone keeps them as { title: text }. */
    lines(list) {
      if (!list) return [];
      if (Array.isArray(list)) return list.map(specText).filter(Boolean);
      return Object.entries(list).map(([k, v]) => specText(v) || k).filter(Boolean);
    },
    /** A small amount in full ("$0.10"): u-price shrinks the cents, which
     *  left "$0" big in front of a tiny ".10". */
    money(amount) {
      try {
        return new Intl.NumberFormat("en-US", { style: "currency", currency: this.currency || "USD" }).format(amount);
      } catch {
        return `${Number(amount).toFixed(2)} ${this.currency || ""}`.trim();
      }
    },
    productRoute(it) {
      return { name: window.$storefront.routes.PRODUCT_PAGE, params: { product_id: it.product.id } };
    },

    /* ── Layout ── */
    /** A phone with 3 or 4 picks: the strip and every group scroll sideways
     *  together. */
    sync(e) {
      if (this.syncing) return;
      const left = e.target.scrollLeft;
      this.syncing = true;
      this.$el.querySelectorAll(".d-cmp__scroll").forEach((el) => {
        if (el !== e.target && el.scrollLeft !== left) el.scrollLeft = left;
      });
      requestAnimationFrame(() => (this.syncing = false));
    },
  },
};
</script>
