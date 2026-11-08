<!--
  Dino — the home page (design C, 7 November 2026:
  kalio-design/cd-options/home-c.html).

  A grocery app's front: three rounded promo cards you swipe (the shop's
  promise on violet with a still life of its own packshots, this week's
  savings on yellow, one fresh aisle on lavender); then the aisles as a big
  tile grid, the main way in; today's deals with a countdown to midnight;
  the fresh aisle, the sellers as round avatars with four of their
  groceries, the top picks, how the order reaches you, and last the shop's
  four newest journal posts as pastel cards. Everything is
  read from the shop: products, prices, savings, aisles, sellers and the
  delivery methods. A section with nothing to show is not drawn.
-->
<template>
  <div class="d-home">
    <!-- ▆▆▆▆ Promo cards ▆▆▆▆ -->
    <section class="d-promos k-wrap" aria-label="This week">
      <router-link :to="catalogue" class="d-promo -violet">
        <span class="d-promo__tick"><v-icon size="16">bolt</v-icon>{{ waysLine || "Groceries, delivered" }}</span>
        <h1>Groceries at your door, in a few taps.</h1>
        <p>
          {{ aisleList.length ? `${aisleList.length} aisles` : "Every aisle" }}<template v-if="sellerList.length > 1"> from {{ sellerList.length }} independent sellers</template>, one cart and one checkout.
        </p>
        <span class="d-btn -yellow -big">Start shopping<v-icon size="20">arrow_forward</v-icon></span>
        <span aria-hidden="true" class="d-promo__blob"></span>
        <span aria-hidden="true" class="d-promo__packs -three">
          <img v-for="p in heroPacks" :key="p.id" :src="image(p)" :srcset="srcset(p)" alt="" sizes="220px" @error="dropSrcset" />
        </span>
      </router-link>
      <router-link v-if="dealList.length" :to="deals" class="d-promo -yellow">
        <h3>{{ best_off ? `Up to ${best_off}% off this week` : "This week's deals" }}</h3>
        <p>Savings on {{ dealList.length }}{{ dealList.length >= 12 ? "+" : "" }} groceries.</p>
        <span class="d-btn -violet">See deals</span>
        <span aria-hidden="true" class="d-promo__packs">
          <img v-for="p in dealList.slice(3, 5)" :key="p.id" :src="image(p)" :srcset="srcset(p)" alt="" sizes="220px" @error="dropSrcset" />
        </span>
      </router-link>
      <router-link v-if="fresh" :to="aisleRoute(fresh)" class="d-promo -lav">
        <h3>Fresh from {{ fresh.title || fresh.name }}</h3>
        <p>Picked for this week.</p>
        <span class="d-btn -white">Shop {{ (fresh.title || fresh.name).toLowerCase() }}</span>
        <span aria-hidden="true" class="d-promo__packs">
          <img v-for="p in freshList.slice(0, 2)" :key="p.id" :src="image(p)" :srcset="srcset(p)" alt="" sizes="220px" @error="dropSrcset" />
        </span>
      </router-link>
    </section>

    <!-- ▆▆▆▆ The aisles, as tiles ▆▆▆▆ -->
    <section v-if="aisleList.length" class="d-sec k-wrap">
      <header class="d-sec__head">
        <h2><span class="d-sec__ic"><v-icon size="22">grid_view</v-icon></span>Shop by aisle</h2>
        <router-link :to="catalogue" class="d-sec__more">Everything<v-icon size="20">chevron_right</v-icon></router-link>
      </header>
      <div class="d-tiles">
        <router-link
          v-for="(a, i) in aisleList"
          :key="a.id"
          :style="{ background: TINTS[i % TINTS.length] }"
          :to="aisleRoute(a)"
          class="d-tile"
        >
          <img v-if="a.icon" :src="aisleImage(a, 256)" alt="" loading="lazy" />
          <span>{{ a.title || a.name }}</span>
        </router-link>
      </div>
    </section>

    <!-- ▆▆▆▆ Today's deals, with a countdown to midnight ▆▆▆▆ -->
    <dino-row
      v-if="dealList.length || !deals_ready"
      :items="deals_ready ? dealList : null"
      :more-to="deals"
      icon="local_fire_department"
      title="Today's deals"
      hot
    >
      <template #badge>
        <span class="d-count"><v-icon size="16">timer</v-icon>Ends in {{ countdown }}</span>
      </template>
    </dino-row>

    <dino-row
      v-if="fresh"
      :dir="fresh.name"
      :limit="12"
      :more-to="aisleRoute(fresh)"
      :title="`Fresh from ${fresh.title || fresh.name}`"
      icon="eco"
      lazy
      sort="bestselling"
    />

    <!-- ▆▆▆▆ The sellers ▆▆▆▆ -->
    <section v-if="sellerList.length" class="d-sec k-wrap">
      <header class="d-sec__head">
        <h2><span class="d-sec__ic"><v-icon size="22">storefront</v-icon></span>Meet the sellers</h2>
      </header>
      <div class="d-sellers">
        <router-link v-for="v in sellerList" :key="v.id" :to="sellerRoute(v)" class="d-seller">
          <span class="d-seller__av"><img v-if="vendorImage(v)" :src="vendorImage(v)" alt="" /><b v-else>{{ v.name[0] }}</b></span>
          <span class="d-seller__who">
            <b>{{ v.name }}</b>
            <small>An independent seller on {{ $shop.title }}</small>
            <em>Visit shop<v-icon size="18">chevron_right</v-icon></em>
          </span>
          <span aria-hidden="true" class="d-seller__packs">
            <span v-for="p in (shelfOf.get(v.id) || []).filter((x) => x.icon).slice(0, 4)" :key="p.id"><img :src="image(p)" :srcset="srcset(p)" alt="" sizes="80px" @error="dropSrcset" /></span>
          </span>
        </router-link>
      </div>
    </section>

    <dino-row :limit="12" icon="favorite" lazy sort="bestselling" spread title="Top picks for you" />

    <div class="d-home__end k-wrap">
      <router-link :to="catalogue" class="d-btn -violet -big">Browse every product<v-icon size="20">arrow_forward</v-icon></router-link>
    </div>

    <!-- ▆▆▆▆ How it reaches you ▆▆▆▆ -->
    <section v-if="ways.length" class="d-sec k-wrap">
      <header class="d-sec__head">
        <h2><span class="d-sec__ic"><v-icon size="22">local_shipping</v-icon></span>How you get it</h2>
      </header>
      <div class="d-ways">
        <div v-for="w in ways" :key="w.key" class="d-way">
          <span class="d-way__ic"><v-icon size="28">{{ w.icon }}</v-icon></span>
          <span>
            <b>{{ w.word }}</b>
            <small>{{ w.line }}</small>
            <em v-if="w.free">Free</em>
            <em v-else-if="w.freeOver">Free over <u-price :amount="w.freeOver" :currency="w.currency" /></em>
          </span>
        </div>
      </div>
    </section>

    <!-- ▆▆▆▆ From the journal: the shop's own articles, the page's last
         section (owner, 8 November 2026) ▆▆▆▆ -->
    <section v-if="posts.length" class="d-sec d-blog k-wrap">
      <header class="d-sec__head">
        <h2><span class="d-sec__ic"><v-icon size="22">menu_book</v-icon></span>From the journal</h2>
        <router-link :to="journal" class="d-sec__more">All articles<v-icon size="20">chevron_right</v-icon></router-link>
      </header>
      <div class="d-blog__track">
        <router-link v-for="(a, i) in posts" :key="a.id" :style="{ background: POST_TINTS[i % POST_TINTS.length] }" :to="postRoute(a)" class="d-post">
          <span class="d-post__pic"><img v-if="a.image" :src="postImage(a)" :srcset="postSrcset(a)" alt="" loading="lazy" sizes="(max-width: 760px) 78vw, (max-width: 1100px) 46vw, 330px" @error="dropSrcset" /></span>
          <span class="d-post__tx">
            <small v-if="dateParts(a.created_at).full" class="d-post__date"><v-icon size="15">event</v-icon>{{ dateParts(a.created_at).full }}</small>
            <b class="d-post__title">{{ a.title }}</b>
            <span v-if="a.description" class="d-post__desc">{{ a.description }}</span>
            <em class="d-post__go">Read<v-icon size="18">arrow_forward</v-icon></em>
          </span>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script>
import DinoRow from "./DinoRow.vue";
import { DEALS_FILTER, findAisle, listProducts, waysOf } from "./dino-home";
import {
  aisleImage,
  aisleRoute,
  aisles,
  catalogueRoute,
  dealsRoute,
  featured,
  offers,
  percentOff,
  photoSrcset,
  productImage,
  productSrcset,
  dropSrcset,
  sellerRoute,
  vendorImage,
  vendors,
} from "../kalio/kalio-catalog";
import { dateParts, journalPage, journalRoute, postRoute } from "../kalio/pages/kalio-journal";

/** Pastel grounds for the aisle tiles, in turn. */
const TINTS = ["#ffe9d6", "#e3f6e8", "#e6efff", "#ffe3ea", "#fff3c7", "#ece4ff", "#dff4f7", "#ffe8f6"];
/** The journal's cards: lavender, butter, mint and blush, in turn. */
const POST_TINTS = ["#f3eeff", "#fff3c7", "#e3f6e8", "#ffe3ea"];

function untilMidnight() {
  const now = new Date();
  const end = new Date(now);
  end.setHours(24, 0, 0, 0);
  const s = Math.max(0, Math.floor((end - now) / 1000));
  const two = (n) => String(n).padStart(2, "0");
  return `${two(Math.floor(s / 3600))}:${two(Math.floor((s % 3600) / 60))}:${two(s % 60)}`;
}

export default {
  name: "DinoHome",
  components: { DinoRow },
  inject: ["$shop"],

  data() {
    return {
      TINTS,
      POST_TINTS,
      posts: [],
      aisleList: [],
      sellerList: [],
      dealList: [],
      deals_ready: false,
      newList: [],
      freshList: [],
      shelfOf: new Map(),
      countdown: untilMidnight(),
    };
  },

  computed: {
    catalogue() {
      return catalogueRoute();
    },
    deals() {
      return dealsRoute();
    },
    journal() {
      return journalRoute();
    },
    ways() {
      return waysOf(this.$shop);
    },
    waysLine() {
      return this.ways.map((w) => w.key).join(", ").replace(/, ([^,]*)$/, " or $1");
    },
    best_off() {
      return this.dealList.reduce((max, p) => Math.max(max, this.percent(p)), 0);
    },
    fresh() {
      return findAisle(this.aisleList, /produce|fruit|veg|fresh/i) || this.aisleList[0] || null;
    },
    /** Three packshots for the violet card: deals first, then what is new. */
    heroPacks() {
      const seen = new Set();
      return [...this.dealList, ...this.newList].filter((p) => p.icon && !seen.has(p.id) && seen.add(p.id)).slice(0, 3);
    },
  },

  watch: {
    fresh: {
      immediate: true,
      handler(aisle) {
        if (!aisle) return;
        listProducts(aisle.name, 4, { sort: "bestselling" }).then((list) => (this.freshList = list.filter((p) => p.icon)));
      },
    },
  },

  mounted() {
    aisles().then((list) => (this.aisleList = featured(list)));
    vendors().then((list) => (this.sellerList = list.filter((v) => v && v.name)));
    offers().then(({ shelfOf }) => (this.shelfOf = shelfOf));
    /* The biggest savings first: Selldone sorts deals by sales, so the
       saving is ranked here. */
    listProducts(null, 40, { filter: DEALS_FILTER, sort: "bestselling" })
      .then((list) => {
        this.dealList = list.filter((p) => this.percent(p) > 0).sort((a, b) => this.percent(b) - this.percent(a)).slice(0, 12);
      })
      .catch(() => (this.dealList = []))
      .finally(() => (this.deals_ready = true));
    listProducts(null, 6, { sort: "newest" }).then((list) => (this.newList = list.filter((p) => p.icon)));
    this.timer = setInterval(() => (this.countdown = untilMidnight()), 1000);
    /* The four newest posts; no posts, no section. */
    journalPage({ limit: 4 })
      .then(({ articles }) => (this.posts = articles || []))
      .catch(() => (this.posts = []));
  },

  beforeUnmount() {
    clearInterval(this.timer);
  },

  methods: {
    aisleRoute,
    aisleImage,
    sellerRoute,
    postRoute,
    dateParts,
    postImage(a) {
      return /^https?:/.test(a.image) ? a.image : window.CDN.GET_SHOP_IMAGE_PATH(a.image);
    },
    /** The post's photo from the shop's resizer, at the size it is shown. */
    postSrcset(a) {
      return photoSrcset(this.postImage(a));
    },
    image(p) {
      return productImage(p);
    },
    srcset(p) {
      return productSrcset(p);
    },
    dropSrcset,
    vendorImage(v) {
      return vendorImage(v, true);
    },
    percent(p) {
      return percentOff(this.$shop, p) || 0;
    },
  },
};
</script>
