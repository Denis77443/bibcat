<template>
  <div>
    <AuthAdminPage v-if="user === null" />
    <SearchPanel v-if="user !== null" />
    <CardsPanel v-if="user !== null" />

    <!--  <Login v-if="!connect" @logged="log" />
    <Search v-if="connect" />-->
  </div>
</template>
<script>
//import Search from "../../components/Search";
import AuthAdminPage from "../../components/user/AppUserLogin";

import SearchPanel from "../../components/cards/AppSearch";
import CardsPanel from "../../components/cards/AppCardsList";
import { mapState, mapActions } from "vuex";

export default {
  components: {
    AuthAdminPage,
    SearchPanel,
    CardsPanel
  },
  data() {
    return {
      connect: null
    };
  },
  async created() {
    this.setCurrentFilter({});
  },
  computed: {
    ...mapState({
      user: state => state.user,
      filter: state => state.cards.filter
    })
  },
  methods: {
    ...mapActions(["setCurrentFilter"]),
    log() {
      this.connect = true;
    }
  }
};
</script>
<style scoped>
.v-offset {
  margin: 0 auto;
  max-width: calc(100% - 32px);
  position: relative;
  top: -24px;
  margin-bottom: -24px;
}
</style>
