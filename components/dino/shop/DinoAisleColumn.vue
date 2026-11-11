<!--
  Dino — the aisles beside a listing (aisle page design C, 7 November 2026:
  kalio-design/cd-options/shop-c.html).

  An app's aisle list: every aisle with its icon, the one being shown in
  violet, Deals first. On a computer it heads the sticky column beside the
  grid; on a phone it becomes a row of icon tiles you swipe, above the grid.
  The aisles are the shop's own (kalio-catalog's aisles()).

  On a computer only the first ten show, plus the one being shown when it
  is further down; "N more aisles" opens the rest and "Fewer aisles" closes
  them (the owner, 8 November 2026: the column had grown too long). The
  phone's swipe row keeps every aisle.
-->
<template>
  <nav v-if="list.length" :class="{ '-open': open }" :aria-label="t('header.aisles', 'Aisles')" class="d-aisles">
    <p class="d-aisles__h">{{ t("header.aisles", "Aisles") }}</p>
    <router-link :class="{ '-on': deals }" :to="dealsTo" class="d-aisles__a -deals">
      <span class="d-aisles__ic"><v-icon size="20">local_fire_department</v-icon></span>
      {{ t("header.deals", "Deals") }}
    </router-link>
    <router-link
      v-for="(a, i) in list"
      :key="a.id"
      :class="{ '-on': a.name === current, '-more': !open && i >= LIMIT && a.name !== current }"
      :to="aisleRoute(a)"
      class="d-aisles__a"
    >
      <span class="d-aisles__ic"><img v-if="a.icon" :src="aisleImage(a, 64)" alt="" loading="lazy" /></span>
      {{ a.title || a.name }}
    </router-link>
    <button v-if="hidden" :aria-expanded="open" class="d-aisles__a d-aisles__more" type="button" @click="open = !open">
      <span class="d-aisles__ic"><v-icon size="20">{{ open ? "expand_less" : "expand_more" }}</v-icon></span>
      {{ open ? t("dino.aisles.fewer", "Fewer aisles") : t("dino.aisles.more", { one: "{n} more aisle", other: "{n} more aisles" }, { n: hidden }) }}
    </button>
  </nav>
</template>

<script>
import { aisleImage, aisleRoute, aisles, dealsRoute } from "../../kalio/kalio-catalog";

/** Aisles shown on a computer before "N more aisles". */
const LIMIT = 10;

export default {
  name: "DinoAisleColumn",

  props: {
    /** The aisle shown (its category name), if any. */
    current: { type: String, default: null },
    /** The listing is the deals. */
    deals: Boolean,
  },

  data() {
    return { LIMIT, list: [], open: false };
  },

  computed: {
    dealsTo() {
      return dealsRoute();
    },
    /** How many aisles the closed list leaves out (the current one always shows). */
    hidden() {
      return this.list.filter((a, i) => i >= LIMIT && a.name !== this.current).length;
    },
  },

  mounted() {
    aisles().then((list) => (this.list = list || []));
  },

  methods: {
    aisleRoute,
    aisleImage,
  },
};
</script>
