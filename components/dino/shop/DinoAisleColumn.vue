<!--
  Dino — the aisles beside a listing (aisle page design C, 7 November 2026:
  kalio-design/cd-options/shop-c.html).

  An app's aisle list: every aisle with its icon, the one being shown in
  violet, Deals first. On a computer it heads the sticky column beside the
  grid; on a phone it becomes a row of icon tiles you swipe, above the grid.
  The aisles are the shop's own (kalio-catalog's aisles()).
-->
<template>
  <nav v-if="list.length" aria-label="Aisles" class="d-aisles">
    <p class="d-aisles__h">Aisles</p>
    <router-link :class="{ '-on': deals }" :to="dealsTo" class="d-aisles__a -deals">
      <span class="d-aisles__ic"><v-icon size="20">local_fire_department</v-icon></span>
      Deals
    </router-link>
    <router-link
      v-for="a in list"
      :key="a.id"
      :class="{ '-on': a.name === current }"
      :to="aisleRoute(a)"
      class="d-aisles__a"
    >
      <span class="d-aisles__ic"><img v-if="a.icon" :src="aisleImage(a, 64)" alt="" loading="lazy" /></span>
      {{ a.title || a.name }}
    </router-link>
  </nav>
</template>

<script>
import { aisleImage, aisleRoute, aisles, dealsRoute } from "../../kalio/kalio-catalog";

export default {
  name: "DinoAisleColumn",

  props: {
    /** The aisle shown (its category name), if any. */
    current: { type: String, default: null },
    /** The listing is the deals. */
    deals: Boolean,
  },

  data() {
    return { list: [] };
  },

  computed: {
    dealsTo() {
      return dealsRoute();
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
