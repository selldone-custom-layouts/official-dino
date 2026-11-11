<!--
  Dino — the seller's banner (seller page design C, 7 November 2026:
  kalio-design/cd-options/seller-c.html; first made for Walio as a side card).

  A violet banner across the page: the seller's mark in a yellow ring, a pill
  saying they sell independently on the shop, their name, a line from their
  own aisles, three live numbers as pills (products, on sale, aisles), and
  their aisles as chips with how many products each holds: "Everything"
  shows all of the seller's products, an aisle opens that aisle with only
  this seller's products.
-->
<template>
  <section class="d-scard">
    <div class="d-scard__top">
      <span class="d-scard__mark">
        <img v-if="mark" :src="mark" alt="" />
        <v-icon v-else size="44">storefront</v-icon>
      </span>
      <div class="d-scard__who">
        <span class="d-scard__tag"><v-icon size="16">verified</v-icon>{{ t("dino.seller.on", "Independent seller on {shop}", { shop: $shop.title }) }}</span>
        <h1>{{ vendor ? vendor.name : "" }}</h1>
        <p>
          <template v-if="sells_line">{{ t("dino.seller.sellsIn", "{sells}, in the same cart as every other seller.", { sells: sells_line.charAt(0).toUpperCase() + sells_line.slice(1) }) }}</template>
          <template v-else>{{ t("dino.seller.sameCart", "In the same cart as every other seller.") }}</template>
        </p>
        <div class="d-scard__facts">
          <span>{{ total !== null ? t("dino.seller.products", { one: "{n} product", other: "{n} products" }, { n: total }) : "–" }}</span>
          <span v-if="on_sale"><v-icon size="16">local_offer</v-icon>{{ t("dino.seller.saleCount", "{n} on sale", { n: on_sale }) }}</span>
          <span>{{ t("dino.seller.aisles", { one: "{n} aisle", other: "{n} aisles" }, { n: tiles.length }) }}</span>
        </div>
      </div>
    </div>
    <nav :aria-label="t('dino.seller.nav', 'The seller\'s aisles')" class="d-scard__nav">
      <router-link :class="{ '-on': !$route.params.category_name }" :to="sellerTo">{{ t("dino.home.everything", "Everything") }} <span>{{ total ?? "" }}</span></router-link>
      <router-link
        v-for="a in tiles"
        :key="a.aisle.id"
        :class="{ '-on': $route.params.category_name === a.aisle.name }"
        :to="{ ...aisleRoute(a.aisle), query: { vendor_id: vendorId } }"
      >
        {{ a.aisle.title || a.aisle.name }} <span>{{ a.count }}</span>
      </router-link>
    </nav>
  </section>
</template>

<script>
import { aisleRoute, aisles, countProducts, featured, offers, sellerRoute, vendorImage } from "../../kalio/kalio-catalog";

export default {
  name: "DinoSellerSide",
  inject: ["$shop"],
  emits: ["tab"],

  props: {
    vendorId: { type: [Number, String], required: true },
    tab: { type: String, default: "shop" },
  },

  data() {
    return { vendor: null, total: null, on_sale: null, tiles: [] };
  },

  computed: {
    mark() {
      return vendorImage(this.vendor);
    },
    sellerTo() {
      return this.vendor ? sellerRoute(this.vendor) : { name: window.$storefront.routes.SHOP_PAGE };
    },
    sells_line() {
      const names = this.tiles.slice(0, 3).map((a) => String(a.aisle.title || a.aisle.name).toLowerCase().replace(/&amp;/g, "&"));
      if (names.length < 2) return names[0] || "";
      return names.slice(0, -1).join(", ") + " and " + names[names.length - 1];
    },
  },

  watch: {
    vendorId: { handler: "fetch", immediate: true },
  },

  methods: {
    aisleRoute,
    fetch() {
      const id = this.vendorId;
      const mine = () => String(id) === String(this.vendorId);
      window.$storefront.vendor
        .getVendor(id)
        .then(({ vendor }) => mine() && (this.vendor = vendor || null))
        .catch(() => null);
      countProducts(null, { vendor_id: id }).then((n) => mine() && (this.total = n));
      countProducts(null, { vendor_id: id, filter: JSON.stringify({ only_has_discount: true }) }).then((n) => mine() && (this.on_sale = n));
      Promise.all([offers(), aisles()]).then(([{ shelfOf }, list]) => {
        if (!mine()) return;
        const shelf = shelfOf.get(Number(id)) || shelfOf.get(id) || [];
        const counts = new Map();
        for (const p of shelf) counts.set(p.category_id, (counts.get(p.category_id) || 0) + 1);
        this.tiles = featured(list.filter((a) => counts.has(a.id))).map((aisle) => ({ aisle, count: counts.get(aisle.id) }));
      });
    },
  },
};
</script>
