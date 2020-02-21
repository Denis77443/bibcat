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
                        <v-btn
                          :height="34"
                          color="orange"
                          @click="searchItems"
                        >
                          Поиск
                          <v-icon right>search</v-icon> 
                        </v-btn><br />
                        <v-btn
                          :height="34"
                          class="mt-2"
                          @switch="resetParams"
                          color="orange"
                          @click="resetParams"
                        >
                          Сброс
                          <v-icon right>settings_backup_restore</v-icon>
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
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      search: {
        auths: null,
        title: null,
        year: null,
        izmiran: null
      },
      refreshData: false
      //  items: []
    };
  },
  computed: mapGetters(["totalCards", "FILTERS"]),
  // methods: mapActions(['setCurrentFilter']),
  methods: {
    ...mapActions(["setCurrentFilter"]),
    async resetParams() {
      console.log('resret')
      this.search.auths = null;
      this.search.title = null;
      this.search.year = null;
      this.search.izmiran = null;
      this.setCurrentFilter({});
    },
    async setRefresh() {
      console.log('set refresh')
      this.refreshData = await !this.refreshData;
    },

    async searchItems() {
      console.log('app search')
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
