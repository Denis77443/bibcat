<template>
  <div class="text-xs-center">
    <!--Dialog Box Delete Record-->
    <v-dialog v-model="dialogDelete" max-width="420">
      <template v-slot:activator="{ on }">
        <v-btn color="orange darken-2" v-on="on">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="headline">
          Вы желаете удалить карточку?
        </v-card-title>
        <v-card-text>
          <div>
            <span>id:</span>
            <span class="font-weight-light"> {{ current.id }}</span>
          </div>
          <div>
            <span>Автор(ы):</span>
            <span class="font-weight-light"> {{ current.auths }}</span>
          </div>
          <div>
            <span>Название:</span>
            <span class="font-weight-light"> {{ current.title }}</span>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn color="primary" text="text" @click="dialogDelete = false">
            Нет
          </v-btn>

          <v-btn color="primary" text="text" @click="deleteRecord">
            Да
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import CardService from "../../services/CardService";
import { imageCard } from "../../mixins/imageCard";

import { mapGetters, mapActions } from "vuex";

export default {
  mixins: [imageCard],
  props: {
    currentCardId: {
      type: Number,
      default() {
        return 0;
      }
    }
  },
  data() {
    return {
      current: {},
      dialogDelete: false
    };
  },
  computed: mapGetters(["getByIndexRecord"]),
  watch: {
    dialogDelete(val) {
      if (val) {
        this.current = this.getByIndexRecord(this.currentCardId);
      }
    }
  },
  methods: {
    ...mapActions(["deleteCard"]),
    async deleteRecord() {
      await this.deleteCard(this.current.id);

      if (this.current.image !== undefined) {
        let fileName = await this.$_imageCard_fileName(
          this.current.id,
          this.current.image
        );
        await CardService.deleteImageFile(fileName);
      }

      this.dialogDelete = await false;
      await this.$emit("deleterecord", { card: this.current });
    }
  }
};
</script>
