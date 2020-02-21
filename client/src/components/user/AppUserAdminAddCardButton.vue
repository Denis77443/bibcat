<template>
  <div class="text-xs-center">
    <v-form
      ref="form_insert"
      v-model="valid"
      lazy-validation
      enctype="multipart/form-data"
    >
      <v-dialog v-model="dialog" :width="1100">
        <template v-slot:activator="{ on }">
          <v-btn color="orange darken-2" v-on="on">
            <v-icon dark>mdi-plus</v-icon>
          </v-btn>
        </template>

        <v-card>
          <Loader
            :loading-value="value"
            :title-toolbar="titleOfToolbar"
            :active-class="activeClass"
          />

          <v-card-text>
            <v-container grid-list-md v-bind:class="{ active: activeClass }">
              <v-layout wrap>
                <v-flex xs10>
                  <v-text-field
                    class="pt-0"
                    v-model="insertItem.auths"
                    label="Автор(ы)"
                    :rules="[rules.required]"
                  >
                    {{ insertItem.auths }}
                  </v-text-field>
                </v-flex>
                <v-checkbox
                  class="ml-12"
                  v-model="insertItem.izmiran"
                  :label="`IZMIRAN:`"
                ></v-checkbox>
              </v-layout>
              <v-layout>
                <v-flex xs10>
                  <v-text-field
                    class="pt-0"
                    v-model="insertItem.title"
                    label="Название"
                    :rules="[rules.required]"
                  >
                    {{ insertItem.title }}
                  </v-text-field>
                </v-flex>
                <v-flex xs2>
                  <v-text-field
                    prepend-inner-icon="mdi-calendar"
                    class="pt-0 ml-12"
                    v-model="insertItem.year"
                    label="Год"
                    :rules="[rules.required]"
                    mask="####"
                  >
                    {{ insertItem.year }}
                  </v-text-field>
                </v-flex>
              </v-layout>
              <v-layout align-end justify-center row fill-height>
                <v-flex xs6>
                  <span class="caption">Карточка (заполняется вручную)</span>
                </v-flex>
                <v-flex xs6>
                  <span class="caption">Карточка в виде изображения</span>
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex xs6>
                  <v-card color="orange lighten-4">
                    <v-textarea
                      class="textarea_font_mono"
                      :rows="14"
                      wrap="off"
                      background-color="orange lighten-4"
                      v-model="insertItem.card"
                      solo
                      flat
                      @keydown="rowLimit($event)"
                      filled
                      value="`${insertItem.card}`"
                      no-resize
                      ref="card"
                      :rules="[
                        insertItem.image !== null ? true : rules.required
                      ]"
                    >
                      <v-tooltip
                        slot="append"
                        :value="toolTip"
                        left
                        :position-x="positionX"
                        :position-y="positionY"
                      >
                        <span>Лимит текста в строке!</span>
                      </v-tooltip>
                    </v-textarea>
                    <v-row align="center" justify="center">
                      <v-icon large center>mdi-record</v-icon>
                    </v-row>
                  </v-card>
                </v-flex>

                <v-flex xs6 class="wrap-upload-img">
                  <div
                    id="ADD_IMG_BOX"
                    ref="ADD_IMG_BOX"
                    style="display: none"
                    class="active_card_image"
                  ></div>
                  <div
                    id="ADD_IMG_BOX_ICON"
                    ref="ADD_IMG_BOX_ICON"
                    class="empty_card_image"
                  >
                    <v-row justify="center" align="center">
                      <v-col cols="12">
                        <v-row align="center" justify="center">
                          <v-icon
                            size="150"
                            align="center"
                            color="orange darken-2"
                            >mdi-camera-plus-outline</v-icon
                          >
                        </v-row>
                      </v-col>
                    </v-row>
                  </div>
                </v-flex>
              </v-layout>
              <v-layout align-center justify-space-around row fill-height>
                <v-flex xs6> </v-flex>
                <v-flex xs6>
                  <div class="text-xs-center">
                    <ErrorMessage v-if="error !== null" :message="error" />
                  </div>
                  <div class="float-sm-right">
                    <v-btn
                      small
                      id="open-file-add"
                      @click.native.prevent="openFileDialogAdd($event)"
                    >
                      Файл
                    </v-btn>
                    <input
                      id="file-upload-add"
                      ref="file_upload_add"
                      type="file"
                      style="display:none"
                      accept="image/*"
                      @change="onFileChangeAdd"
                    />
                  </div>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions v-bind:class="{active: activeClass}">
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog = false">
              Отменить
            </v-btn>
            <v-btn
              color="primary"
              text
              @click="saveUpdate(insertItem, 'form_insert')"
            >
              Сохранить
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-form>
  </div>
</template>
<script>
import CardService from "../../services/CardService";
import ErrorMessage from "../ui/AppErrorMessage";
import Loader from "../admin/ImageLoader";
import { limiter } from "../admin/mixins/rowColLimiter";
import { saverecord } from "../admin/mixins/insertUpdateRecord";

const INSERT_ITEM = () => ({
  auths: null,
  title: null,
  year: null,
  card: null,
  image: null,
  izmiran: false
});


export default {
  mixins: [limiter, saverecord],
  components: {
    Loader,
    ErrorMessage
  },
  data() {
    return {
      titleOfToolbar: "Добавление",
      interval: {},
      value: 0,
      activeClass: false,
      error: null,
      dialog: false,
      insertItem: INSERT_ITEM(),
      valid: true,
      formData: null,
      fileExtention: "",
      rules: {
        required: v =>
          (!!v && v.replace(/\s/g, "").length > 0) ||
          "Поле обязательно к заполнению",
        notRequered: v => !v
      }
    };
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  watch: {
    dialog() {
      this.$refs.form_insert.reset();
      Object.assign(this.insertItem, INSERT_ITEM());

      this.formData = null;
      this.fileExtention = "";
     

      this.error = null;
      (this.activeClass = false), (this.value = 0), (this.interval = {});

      //Clear image box
      if (this.$refs.ADD_IMG_BOX) {
        if (this.$refs.file_upload_add) {
          this.$refs.file_upload_add.value = null;
        }
        this.$refs.ADD_IMG_BOX.style = "display: none";
        this.$refs.ADD_IMG_BOX_ICON.style = "display: inline-flex";
      }
    }
  },

  methods: {
    async onFileChangeAdd(e) {
      this.$refs.ADD_IMG_BOX.style = await "display: inline-flex";
      this.$refs.ADD_IMG_BOX_ICON.style = await "display: none";

      this.error = await CardService.errorAlert(e);
      let fileInfo = await CardService.onFileChange(
        e,
        "ADD_IMG_BOX",
        this.error
      );

      if (fileInfo !== null) {
        this.formData = fileInfo.form;
        this.insertItem.image = fileInfo.name;
        this.fileExtention = fileInfo.ext;
      }
    },
    async openFileDialogAdd(e) {
      this.error = null;
      await CardService.openFileDialog(e);
    }
  }
};
</script>
<style lang="stylus" scoped>
.active {
  display: none;
}

.v-progress-circular {
  margin: 1rem;
}

.textarea_font_mono {
  font-family: monospace, monospace;
  font-size: 14px;
  font-style: normal;
  font-variant: normal;
  font-weight: 400;
  height: 297px;
}

.empty_card_image {
  height: 330px;
  border: 1px dashed green;
  display: inline-flex;
  width: 100%;
}

.active_card_image {
  height: 330px;
  width: 100%;
  position: absolute;
}

.img_size {
  width: 100%;
}

.wrap-progress-circular {
  display: flex;
  justify-content: center;
}

.v-textarea >>> textarea {
  line-height: 1.2rem;
  width: 526px;
}

.wrap-upload-img {
  overflow: hidden;
  position: relative;
  width: 100%;
}
</style>
