<template>
  <div class="ml-3">
    <div class="my-2">
      <AddRecord @newrecord="updateRecord" />
    </div>
    <div class="my-2">
      <EditRecord
        @editrecord="updateAfterEdit"
        :current-card-id="currentCardId"
      />
    </div>
    <div class="my-2">
      <DeleteRecord
        @deleterecord="updateAfterDel"
        :current-card-id="currentCardId"
      />
    </div>
    <ChangeDataMessage :text="message" />
  </div>
</template>
<script>
import AddRecord from "./AppUserAdminAddCardButton";
import EditRecord from "./AppUserAdminEditCardButton";
import DeleteRecord from "./AppUserAdminDeleteCardButton";
import ChangeDataMessage from "../ui/AppSnackbarChangeData";

import { mapActions, mapGetters, mapState } from "vuex";

export default {
  props: {
    currentCardId: {
      type: Number,
      required: true
    }
  },
  components: {
    AddRecord,
    EditRecord,
    DeleteRecord,
    ChangeDataMessage
  },
  data() {
    return {
      message: null
    };
  },
  computed: {
    ...mapState({ last: state => state.cards.lastRecord }),
    ...mapGetters(["totalCards", "getFilteredCards"])
  },
  methods: {
    ...mapActions([
      "fetchAllCards",
      "setCurrentFilter",
      "getLastRecord",
      "fetchCards"
    ]),
    async updateRecord() {
      await this.setCurrentFilter({});
      await this.fetchAllCards();
      await this.getLastRecord();
      this.message =
        (await "Карточка добавлена !") +
        this.last.id +
        " Автор:" +
        this.last.auths;
    },
    async updateAfterEdit(val) {
      await this.fetchAllCards();
      this.message =
        (await "Карточка отредактирована ! ID:") +
        val.id +
        " Автор:" +
        val.data.auths;
    },
    async updateAfterDel(val) {
      await this.fetchAllCards();
      this.message =
        (await "Карточка удалена ! ID:") +
        val.card.id +
        " Автор:" +
        val.card.auths;
    }
  }
};
</script>
