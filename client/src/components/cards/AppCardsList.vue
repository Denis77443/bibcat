<template>
  <div id="list-demo">
    <v-progress-linear
      v-if="error === false"
      :active="loading"
      :indeterminate="loading"
      color="light-blue"
      height="5"
      value="10"
      striped
      class="mt-3"
    ></v-progress-linear>

    <ErrorMessage
      v-if="error"
      :message="`Необходимых карточек не найдено!`"
      class="ma-4"
    />

    <v-row no-gutters mb-6 v-if="loading === false">
      <v-col>
        <div>
          <div class="wrap-catalog">
            <transition-group name="list" tag="div" class="catalog">
              <div
                v-for="(item, index) in filterData"
                v-bind:key="item.id"
                class="list-item"
                :style="transformIndex(index)"
              >
                <v-card
                  raised
                  class="mx-auto"
                  max-width="526"
                  height="350"
                  width="526"
                >
                  <v-card-text v-if="index !== 0" class="ma-0 pl-2 pt-1">
                    {{ item.auths }}
                    {{ item.title }}
                  </v-card-text>
                  <v-textarea
                    class="textarea_font_mono"
                    wrap="off"
                    solo
                    :value="item.card"
                    auto-grow
                    flat
                    readonly
                    v-if="index === 0 && item.card !== null"
                  >
                  </v-textarea>
                  <img
                    v-if="index === 0 && item.card === null"
                    ref="img"
                    :src="showImageCard(item.id, item.image) + '?' + Date.now()"
                    @error="onError"
                    :height="350"
                    :width="526"
                    aspect-ratio="1.4"
                  />
                  <v-row
                    class="mb-0"
                    align="end"
                    justify="center"
                    v-if="index === 0"
                  >
                    <v-icon large center>mdi-record</v-icon>
                  </v-row>
                </v-card>
              </div>
            </transition-group>
            <div class="wrapper" v-if="!error">
              <v-row justify="center" align="center" class="navigation">
                <Pagination
                  :items="items"
                  :page="{
                    first: pagination.first,
                    last: pagination.last,
                    current: pagination.current,
                    next: nextNum,
                    prev: prevNum
                  }"
                  v-on:cardNext="onNextClick"
                />
                <div class="ml-4">
                  <AdminPanel
                    v-if="user !== null && this.$route.name === 'admin2'"
                    :current-card-id="current.id"
                  />
                  <PrintCardButton :current-card-id="current.id" />
                </div>
              </v-row>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import Pagination from "./AppCardsListPagination";
import config from "../../services/Config";
import ErrorMessage from "../ui/AppErrorMessage";
import PrintCardButton from "../ui/AppCardsListPrintButton";
import AdminPanel from "../user/AppUserAdminPanel";
import { mapState, mapGetters, mapActions } from "vuex";

import { imageCard } from "../../mixins/imageCard";

export default {
  mixins: [imageCard],

  components: {
    Pagination,
    ErrorMessage,
    AdminPanel,
    PrintCardButton
  },

  data() {
    return {
      items: [],
      loading: true,
      error: false,
      path: process.env.VUE_APP_API_URL,
      nextNum: config.CARDS_ON_PAGE,
      prevNum: 0,
      temporaryData: {
        marginTop: 210,
        zIndex: 10,
        marginLeft: 10
      },
      current: {
        id: 0,
        auths: null,
        title: null,
        image: null
      },
      pagination: {
        first: 1,
        last: 1,
        current: 1
      }
    };
  },
  async mounted() {
    await this.fetchAllCards();
    setTimeout(() => {
      this.loading = false;
    }, 500);
  },
  created() {
    this.items = this.cards;
  },
  computed: {
    ...mapState({
      user: state => state.user,
      cards: state => state.cards.cards,
      filter: state => state.cards.filter
    }),

    ...mapGetters(["getFilteredCards"]),

    filterData() {
      return this.items.filter(
        (a, b) => (a = b < this.nextNum && b >= this.prevNum)
      );
    }
  },
  watch: {
    filter(newFilter) {
      //set page/card to start position
      this.loading = true;

      this.pagination.first = 1;
      this.pagination.current = 1;
      this.prevNum = 0;

      let hasSerachFilter = Object.prototype.hasOwnProperty.call(
        newFilter,
        "izmiran"
      );

      this.items = hasSerachFilter ? this.getFilteredCards : this.cards;

      this.nextNum =
        this.items.length >= config.CARDS_ON_PAGE
          ? config.CARDS_ON_PAGE
          : this.items.length;

      setTimeout(() => {
        this.loading = false;
      }, 500);
    },
    filterData: {
      deep: true,
      handler: function(val) {
        this.error = this.items.length === 0 ? true : false;
        this.pagination.last = Math.ceil(
          this.items.length / config.CARDS_ON_PAGE
        );

        if (val.length !== 0) {
          this.current.id = val[0].id;
          this.current.title = val[0].title;
          this.current.image = val[0].image !== undefined ? val[0].image : null;
          this.current.auths = val[0].auths;
        }
      }
    },
    cards(val) {
      let emptyFilter = !Object.keys(this.filter).length;
      return (this.items = emptyFilter ? val : this.getFilteredCards);
    }
  },
  methods: {
    ...mapActions(["fetchAllCards", "findCardsByFilter"]),
    onNextClick(value) {
      this.nextNum = value.next;
      this.prevNum = value.prev;
      this.pagination.current = value.current;
    },
    transformIndex(index) {
      let mrTop =
        index !== 0
          ? this.temporaryData.marginTop - 30 * index
          : this.temporaryData.marginTop;

      let zIndx = this.temporaryData.zIndex - index;
      let mrLeft = index !== 0 ? -520 : -520;

      var styleCard =
        "margin-top:" +
        mrTop +
        "px; z-index:" +
        zIndx +
        "; margin-left:" +
        mrLeft +
        "px";

      ("px");

      return styleCard;
    },
    showImageCard(id, img) {
      let image =
        img !== undefined
          ? this.$_imageCard_fileName(id, img)
          : "not_found.png";
      return this.path + image;
    },
    onError() {
      this.$refs.img[0].src = this.path + "not_found.png";
    }
  }
};
</script>
<style lang="stylus" scoped>
.wrap-catalog {
  margin-right: -526px;
  justify-content: center;
  display: flex;
  overflow: hidden;
}

.list-item {
  transition: 0.15s ease-in;
  display: inline-block;
  margin-right: 10px;
  margin-bottom: 10px;
}

.list-enter-active, .list-leave-active {
  transition: 0.25s ease-in;
  /* transition: all 1s; */
}

.list-enter { /* .list-leave-active до версии 2.1.8 */
  opacity: 0;
  transform: translateY(30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(-130px);
}

.catalog {
  display: flex;
  margin-top: 50px;
  height: 100%;
}

.textarea_font_mono {
  font-family: monospace, monospace;
  font-size: 14px;
  font-style: normal;
  font-variant: normal;
  font-weight: 400;
  line-height: 12px;
  width: 526px;
  height: 287px;
}

.v-textarea >>> textarea {
  line-height: 1.2rem;
}

.wrapper {
  padding-left: 20px;
  display: table-cell;
  position: absolute;
  margin-top: 200px;
}
</style>
