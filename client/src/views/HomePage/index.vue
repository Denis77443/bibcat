<template>
  <div>
    <SearchPanel />
    <CardsPanel v-if="show" />
  </div>
</template>
<script>
import SearchPanel from "../../components/cards/AppSearch";
import CardsPanel from "../../components/cards/AppCardsList";
import { mapActions } from "vuex";

export default {
  components: {
    SearchPanel,
    CardsPanel
  },
  data() {
    return {
      show: false
    };
  },
  async created() {
    await this.fetchAllCards();
    this.show = await true;
    await this.setCurrentFilter({});
  },
  methods: mapActions(["fetchAllCards", "setCurrentFilter"])
};
</script>
