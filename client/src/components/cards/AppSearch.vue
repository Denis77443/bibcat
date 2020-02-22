<template>
  <div class="mt-5">
    <v-container fill-height fluid grid-list-xl>
      <v-layout justify-center wrap>
        <v-flex md12>
          <v-card color="white">
            <div class="v-offset">
              <v-card class="dark orange elevation-10 pa-3" :height="130">
                <div>
                  <span>
                    <p class="category font-weight-light pa-0 mb-0">
                      Всего записей в картотеке: {{ totalCards }}
                    </p>
                  </span>
                </div>
                <div>
                  <v-card class="orange lighten-3 xs">
                    <v-row class="mb-6" justify="center" no-gutters>
                      <v-col class="ma-1">
                        <v-text-field
                          :value="search.auths"
                          solo
                          hint="Поиск по фамилии автора"
                          persistent-hint
                          @change="v => (search.auths = v)"
                        ></v-text-field>
                      </v-col>
                      <v-col class="ma-1">
                        <v-text-field
                          solo
                          hint="Поск по названию"
                          persistent-hint
                          :value="search.title"
                          @change="v => (search.title = v)"
                        ></v-text-field>
                      </v-col>
                      <v-col class="ma-1">
                        <v-text-field
                          solo
                          hint="Поиск по году"
                          persistent-hint
                          return-masked-value
                          mask="####"
                          :value="search.year"
                          @change="v => (search.year = v)"
                        ></v-text-field>
                      </v-col>
                      <v-col md="auto" class="ml-2 mr-2">
                        <v-switch
                          class="font-weight-light"
                          v-model="search.izmiran"
                          label="IZMIRAN"
                          color="orange darken-2"
                          hide-details
                        ></v-switch>
                      </v-col>
                      <v-col md="auto" class="ml-2 mr-2 pt-1">
                        <v-btn :height="34" color="orange" @click="searchItems">
                          Поиск
                          <v-icon right>mdi-magnify</v-icon>
                        </v-btn>
                        <br />
                        <v-btn
                          :height="34"
                          class="mt-2"
                          @switch="resetParams"
                          color="orange"
                          @click="resetParams"
                        >
                          Сброс
                          <v-icon right>mdi-refresh</v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card>
                </div>
              </v-card>
            </div>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from "vuex";

const SEARCH_DEFAULT_FILTER = () => ({
  auths: null,
  title: null,
  year: null,
  izmiran: null
});

export default {
  data() {
    return {
      search: SEARCH_DEFAULT_FILTER()
    };
  },
  computed: {
    ...mapGetters(["totalCards", "FILTERS"]),
    ...mapState({ filter: state => state.cards.filter })
  },
  watch: {
    filter(val) {
      let emptyFilter = !Object.keys(val).length;

      if (emptyFilter) {
        Object.assign(this.search, SEARCH_DEFAULT_FILTER());
      }
    }
  },
  methods: {
    ...mapActions(["setCurrentFilter"]),
    async resetParams() {
      await this.setCurrentFilter({});
    },
    async searchItems() {
      let izmiran = (await this.search.izmiran) === true ? 1 : undefined;
      let auths = await this.search.auths;
      let title = await this.search.title;
      let year = await this.search.year;

      await this.setCurrentFilter({
        izmiran: izmiran,
        auths: auths,
        title: title,
        year: year
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
.v-offset {
  margin: 0 auto;
  max-width: calc(100% - 32px);
  position: relative;
  top: -24px;
  margin-bottom: -24px;
}
</style>
