<!--
  - Copyright (c) 2024. Selldone® Business OS™
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
<template>
  <!-- Dino (404 design C, kalio-design/cd-options/notfound-c.html): the
       mascot lost in an empty aisle, the way back, the aisles to jump to,
       then today's deals. -->
  <div class="d-404">
    <section class="d-404__panel k-wrap">
      <div aria-hidden="true" class="d-404__art">
        <img :src="BRAND.mark" alt="" />
        <span>?</span>
      </div>
      <div class="d-404__tx">
        <span class="d-404__tag">{{ t("dino.404.tag", "Error 404") }}</span>
        <h1>{{ t("dino.404.title", "Oops, this aisle is empty.") }}</h1>
        <p>{{ t("dino.404.text", "The page moved or never existed. Everything else is right where you left it, your cart included.") }}</p>
        <div class="d-404__acts">
          <router-link :to="{ path: '/' }" class="d-btn -yellow -big">{{ t("dino.404.home", "Back to the home page") }}</router-link>
          <router-link :to="catalogue" class="d-btn -outline -big">{{ t("dino.home.browseAll", "Browse every product") }}</router-link>
        </div>
      </div>
    </section>
    <nav v-if="aisleList.length" :aria-label="t('header.aisles', 'Aisles')" class="d-404__aisles k-wrap">
      <router-link v-for="a in aisleList.slice(0, 10)" :key="a.id" :to="aisleRoute(a)">
        <img v-if="a.icon" :src="aisleImage(a, 64)" alt="" />{{ a.title || a.name }}
      </router-link>
    </nav>
    <dino-row :filter="{ only_has_discount: true }" :limit="12" :more-to="deals" hot icon="local_fire_department" :title="t('header.todaysDeals', 'Today’s deals')" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DinoRow from "../../../components/dino/DinoRow.vue";
import { BRAND } from "../../../components/kalio/kalio-brand";
import { aisleImage, aisleRoute, aisles, catalogueRoute, dealsRoute } from "../../../components/kalio/kalio-catalog";

export default defineComponent({
  name: "StorefrontPageError404",
  components: { DinoRow },
  data: () => ({ BRAND, aisleList: [] as any[] }),
  computed: {
    deals() {
      return dealsRoute();
    },
    catalogue() {
      return catalogueRoute();
    },
  },
  mounted() {
    aisles().then((list: any[]) => (this.aisleList = list || []));
  },
  methods: { aisleRoute, aisleImage },
});
</script>
<style scoped lang="scss"></style>
