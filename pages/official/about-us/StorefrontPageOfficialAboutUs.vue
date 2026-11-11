<!--
  - Copyright (c) 2023. Selldone® Business OS™
  -
  - Author: M.Pajuhaan
  - Web: https://selldone.com
  - ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  -
  - All rights reserved. In the weave of time, where traditions and innovations intermingle, this content was crafted.
  - From the essence of thought, through the corridors of creativity, each word, and sentiment has been molded.
  - Not just to exist, but to inspire. Like an artist's stroke or a sculptor's chisel, every nuance is deliberate.
  - Our journey is not just about reaching a destination, but about creating a masterpiece.
  - Tread carefully, for you're treading on dreams.
  -->

<!--
  Kalio — About us, design B "A letter", chosen by the owner on 5 November
  2026.

  Beside the letter: three of the shop's best sellers on a warm ground and
  the facts read from the shop itself — its sellers, its aisles, how many
  products it stocks — with the way to reach it. The letter is the shop's
  own About profile (Selldone dashboard › Shop › Profile) when it has one;
  until then a sample letter, marked as a test, with its values, a
  timeline (marked as examples) and a signature.
-->
<template>
  <!-- Dino (About design C): the story beside the mascot and the shop's numbers, how an order works in four steps, what the shop stands for,
       and how to reach it. The text is the shop's own About profile
       (Selldone dashboard › Shop › Profile) when it has one; until then a
       sample, marked as such. The steps are read from the shop: its
       sellers and its delivery methods. -->
  <div class="w-mag k-wrap">
    <section class="w-mag__ed">
      <div>
        <p class="w-mag__eyebrow">{{ t("about.title", "About {shop}", { shop: shopTitle }) }}</p>
        <h1>{{ missing || busy ? t("dino.about.hi", "Hi, we're {shop}. We bring the groceries.", { shop: shopTitle }) : t("about.title", "About {shop}", { shop: shopTitle }) }}</h1>
        <div v-if="busy" aria-hidden="true" class="k-legal__loading"><span></span><span></span><span></span></div>
        <template v-else-if="missing">
          <kalio-sample-note>{{ t("dino.about.sample", "This text is general copy written to show the page. It is not {shop}'s real story.", { shop: shopTitle }) }}</kalio-sample-note>
          <p class="w-mag__lead">{{ sample.lead }}</p>
          <p>{{ sample.text[0] }}</p>
          <p class="w-mag__sign">{{ sample.sign }}</p>
        </template>
        <div v-else class="k-prose" v-html="profile.body"></div>
      </div>
      <!-- Dino: the mascot on a lavender disc, with the shop's numbers. -->
      <div aria-hidden="true" class="d-about">
        <img :src="BRAND.mark" alt="" class="d-about__mark" />
        <span v-if="aisleList.length" class="d-about__fact -a">{{ t("dino.about.aisles", { one: "{n} aisle", other: "{n} aisles" }, { n: aisleList.length }) }}</span>
        <span v-if="productCount" class="d-about__fact -b">{{ t("dino.about.groceries", { one: "{n} grocery", other: "{n} groceries" }, { n: productCount }) }}</span>
        <span v-if="sellers.length" class="d-about__fact -c">{{ t("dino.about.sellers", { one: "{n} seller", other: "{n} sellers" }, { n: sellers.length }) }}</span>
      </div>
    </section>

    <section class="t-sec">
      <header class="t-sec__head"><h2 class="t-sec__title">{{ t("dino.about.how", "How an order works") }}</h2></header>
      <ol class="w-mag__how">
        <li v-for="(st, i) in how" :key="st.t">
          <i>{{ i + 1 }}</i>
          <b>{{ st.t }}</b>
          <p>{{ st.p }}</p>
        </li>
      </ol>
    </section>

    <section v-if="missing" class="t-sec">
      <div class="w-mag__vals">
        <div v-for="(value, i) in sample.values" :key="value.title">
          <v-icon size="26">{{ ICONS[i] || "check_circle" }}</v-icon>
          <b>{{ value.title }}</b>
          <p>{{ value.text }}</p>
        </div>
      </div>
    </section>

    <section id="contact" class="t-sec w-mag__contact">
      <div>
        <p class="w-mag__eyebrow">{{ t("contact.pageTitle", "Contact us") }}</p>
        <h2>{{ t("dino.about.still", "Still need us?") }}</h2>
        <p>{{ t("dino.about.contactText", "For an order, the fastest way is the message thread on the order page: it goes straight to the seller who packed it. For anything else, write to us.") }}</p>
      </div>
      <div class="w-mag__acts">
        <router-link :to="{ name: window.$storefront.routes.SHOP_CONTACT_US }" class="t-btn -main">{{ t("dino.about.write", "Write to us") }}</router-link>
        <router-link :to="catalogueRoute" class="t-btn -line">{{ t("pages.startShopping", "Start shopping") }}</router-link>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import KalioSampleNote from "@app-storefront/components/kalio/pages/KalioSampleNote.vue";
import { aboutSample, plainText } from "@app-storefront/components/kalio/pages/kalio-sample-pages";
import { aisles, catalogueRoute, countProducts, productImage, vendors } from "@app-storefront/components/kalio/kalio-catalog";
import { waysOf } from "@app-storefront/components/dino/dino-home";
import { BRAND } from "@app-storefront/components/kalio/kalio-brand";
import { locale, t } from "@app-storefront/components/kalio/i18n/kalio-i18n";

export default {
  name: "StorefrontPageOfficialAboutUs",
  components: { KalioSampleNote },
  inject: ["$shop"],

  data: () => ({
    profile: null,
    missing: false,
    busy: true,
    packs: [],
    sellers: [],
    aisleList: [],
    productCount: null,
    BRAND,
    ICONS: ["sell", "storefront", "eco", "chat_bubble_outline"],
  }),

  computed: {
    shopTitle() {
      return this.$shop?.title || t("sample.thisShop", "This shop");
    },
    /* The four steps, in the shop's own terms. */
    how() {
      const ways = waysOf(this.$shop).map((w) => w.label);
      const many = this.sellers.length > 1;
      let list = "";
      try {
        list = new Intl.ListFormat(locale(), { type: "disjunction" }).format(ways);
      } catch {
        list = ways.join(" · ");
      }
      return [
        many
          ? { t: t("dino.about.how1", "Pick from any seller"), p: t("dino.about.how1p", "Every aisle shows each seller's own products and prices.") }
          : { t: t("dino.about.how1one", "Pick from every aisle"), p: t("dino.about.how1pOne", "Every aisle, every price, in one place.") },
        { t: t("dino.about.how2", "One checkout"), p: many ? t("dino.about.how2p", "One cart, one payment, however many sellers you shop.") : t("dino.about.how2pOne", "One cart and one payment.") },
        many
          ? { t: t("dino.about.how3", "Each seller packs"), p: t("dino.about.how3p", "Your order is split into a package per seller.") }
          : { t: t("dino.about.how3one", "We pack it"), p: t("dino.about.how3pOne", "Your order is packed as soon as it is placed.") },
        { t: t("dino.about.how4", "Delivered your way"), p: ways.length ? t("dino.about.how4p", "{ways}, as you choose at checkout.", { ways: list }) : t("dino.about.how4pNone", "As you choose at checkout.") },
      ];
    },
    sample() {
      return aboutSample(this.shopTitle);
    },
    catalogueRoute() {
      return catalogueRoute();
    },
    aisleLine() {
      const names = this.aisleList.map((it) => it.title || it.name);
      if (names.length <= 3) return names.join(", ");
      const shown = names.slice(0, 3).join(", ");
      return t("about.facts.aisleLine", { one: "{count}: {names} and {n} more", other: "{count}: {names} and {n} more" }, { count: names.length, names: shown, n: names.length - 3 });
    },
  },

  created() {
    this.setPageTitle?.(t("about.pageTitle", "About us"));

    window.axios
      .get(window.XAPI.GET_SHOP_PROFILE(this.$shop.name, "about-us"))
      .then(({ data }) => {
        this.profile = data?.error ? null : data?.profile || null;
        this.missing = !plainText(this.profile?.body);
      })
      .catch(() => (this.missing = true))
      .finally(() => (this.busy = false));

    window.$storefront.products
      .list(null, 0, 8, { products_only: true, available: true, sort: "bestselling" })
      .then(({ products }) => (this.packs = (products || []).filter((it) => it.icon).slice(0, 3)))
      .catch(() => {});
    vendors().then((list) => (this.sellers = list.filter((it) => it && it.name)));
    aisles().then((list) => (this.aisleList = list));
    countProducts(null).then((count) => (this.productCount = count));
  },

  methods: {
    picture(product) {
      return productImage(product);
    },
  },
};
</script>
