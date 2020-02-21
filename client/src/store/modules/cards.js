import CardService from "../../services/CardService";

export default {
  actions: {
    async fetchCards(ctx) {
      const items = await CardService.getrecords("/posts/");
      ctx.commit("updateCards", await items.length);
    },
    async deleteCard(ctx, id) {
      await CardService.deleteRecord("/posts/", id);
      let response = await CardService.getrecords("/posts/");
      ctx.commit("getData", await response);
    },

    async getLastRecord(ctx) {
      const items = await CardService.getrecords("/posts/");
      //console.log('get last record from STATEEEEE', await items);
      ctx.commit("updateLastInsertRecord", await items[0]);
    },
    async fetchAllCards(ctx) {
      let response;

      try {
        response = await CardService.getrecords("/posts/");
      } catch (ex) {
        // Handle error
        return ex;
      }

      const data = response;
      //  console.log('data in action',data)
      ctx.commit("getData", data);
    },
    async setCurrentFilter(ctx, data) {
      ctx.commit("SET_FILTER", await data);
      //  ctx.commit('SET_FILTER_MARK', await data)
    },
    async findCardsByFilter(ctx) {
      ctx.commit("SET_CARDS_MAP", await ["set", "cards", "map"]);
    }
  },
  mutations: {
    updateCards(state, total) {
      state.total = total;
    },
    updateLastInsertRecord(state, lastRecord) {
      state.lastRecord = lastRecord;
    },
    getData(state, cards) {
      state.cards = cards;
    },
    SET_FILTER: (state, filter) => {
      state.filter = filter;
    },
    SET_CARDS_MAP: (state, cards_map) => {
      state.cards_map = cards_map;
    },
    SET_FILTER_MARK: (state, isFilteredData) => {
      state.isFilteredData = isFilteredData;
    }
  },
  state: {
    cards: [],
    total: 0,
    lastRecord: {},
    filter: {},
    cards_map: [],
    isFilteredData: false
  },
  getters: {
    totalCards(state) {
      return state.cards.length;
    },
    getByIndexRecord: state => index => state.cards.find(el => el.id === index),
    getLastRecord(state) {
      return state.lastRecord;
    },
    getFilteredCards: state => {
      let result = [];

      //filter data by field Author
      result =
        state.filter.auths !== null
          ? state.cards.filter(
              item =>
                item.auths
                  .toLowerCase()
                  .indexOf(state.filter.auths.toLowerCase()) !== -1
            )
          : state.cards;

      //filter data by field Title
      result =
        state.filter.title !== null
          ? result.filter(
              item =>
                item.title
                  .toLowerCase()
                  .indexOf(state.filter.title.toLowerCase()) !== -1
            )
          : result;

      //filter data by field Year
      result =
        state.filter.year !== null
          ? result.filter(
              item =>
                item.year
                  .toLowerCase()
                  .indexOf(state.filter.year.toLowerCase()) !== -1
            )
          : result;

      //filter data by field IZMIRAN
      result =
        state.filter.izmiran !== undefined
          ? result.filter(item => item.izmiran === state.filter.izmiran)
          : result;

      return result;
    }
  }
};
