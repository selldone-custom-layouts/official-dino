<!--
  Dino — a product card (design C, 7 November 2026).

  An app's card: the packshot big on a rounded lavender square, the saving
  as a yellow pill in its corner and a round yellow "+" on the other corner;
  then the price in Fredoka (violet when it is a saving, the old price
  struck beside it), the name in two lines, the unit and who sells it.
  The "+" is Kalio's KalioCardStep, so every behaviour the owner asked for
  stays: it becomes "− n +" across the picture's foot in place, a product
  with sizes says "Options" and opens the quick-buy sheet, out of stock
  says so, and nothing pops up.

  Prices are Selldone's own (discount dates, variants, the shopper's
  currency) through kalio-catalog's priceOf. The card emits "quick-buy";
  the row that shows it opens the sheet or adds straight away (quickAdd).
-->
<template>
  <article :class="{ '-sale': was }" class="d-card">
    <div class="d-card__well">
      <router-link :to="to" aria-hidden="true" class="d-card__pic" tabindex="-1">
        <img v-if="picture" :alt="product.title" :src="picture" :srcset="srcset(product)" loading="lazy" sizes="(max-width: 760px) 53vw, 260px" @error="dropSrcset" />
      </router-link>
      <span v-if="off > 0" class="d-card__off">-{{ off }}%</span>
      <kalio-card-step
        :addable="() => !!product.quantity"
        :adder="() => $emit('quick-buy', product)"
        :product="product"
        :sold-out="() => !product.quantity"
        card
        class="d-card__act"
      />
    </div>

    <div class="d-card__price">
      <u-price :amount="now" :currency="currency" class="d-card__now" />
      <s v-if="was" class="d-card__was"><u-price :amount="was" :currency="currency" /></s>
    </div>

    <router-link :to="to" class="d-card__name">{{ product.title }}</router-link>
    <p v-if="product.unit" class="d-card__unit">per {{ product.unit }}</p>
    <kalio-seller-line :sellers="sellers" class="d-card__by" />
  </article>
</template>

<script>
import CurrencyMixin from "@selldone/components-vue/mixin/currency/CurrencyMixin.ts";
import KalioCardStep from "../kalio/KalioCardStep.vue";
import KalioSellerLine from "../kalio/KalioSellerLine.vue";
import { percentOff, priceOf, productImage, productSrcset, dropSrcset } from "../kalio/kalio-catalog";

export default {
  name: "DinoCard",
  components: { KalioCardStep, KalioSellerLine },
  mixins: [CurrencyMixin],

  props: {
    product: { type: Object, required: true },
    /** The sellers that offer it (kalio-catalog's offers()). */
    sellers: { type: Array, default: () => [] },
  },

  emits: ["quick-buy"],

  computed: {
    shop() {
      return this.$store.getters.getShop;
    },
    currency() {
      return this.GetUserSelectedCurrency().code;
    },
    price() {
      return priceOf(this.shop, this.product, this.currency);
    },
    now() {
      return this.price.now;
    },
    was() {
      return this.price.was;
    },
    off() {
      return percentOff(this.shop, this.product);
    },
    picture() {
      return productImage(this.product);
    },
    to() {
      return { name: window.$storefront.routes.PRODUCT_PAGE, params: { product_id: this.product.id } };
    },
  },

  methods: {
    srcset(product) {
      return productSrcset(product);
    },
    dropSrcset,
  },
};
</script>
