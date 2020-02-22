<template>
  <div class="text-xs-center">
    <!--Edit Item -->
    <v-form
      ref="form_update"
      v-model="validUpdate"
      lazy-validation
      enctype="multipart/form-data"
    >
      <v-dialog v-model="dialogUpdate" :width="1100">
        <template v-slot:activator="{ on }">
          <v-btn
            color="orange darken-2"
            v-on="on"
            @click="showEditDialog(currentCardId)"
          >
            <v-icon dark>mdi-pencil</v-icon>
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
                    v-model="updateItem.auths"
                    label="Автор(ы)"
                    :rules="[rules.required]"
                  >
                    {{ updateItem.auths }}
                  </v-text-field>
                </v-flex>
                <v-checkbox
                  class="ml-12"
                  v-model="updateItem.izmiran"
                  :label="`IZMIRAN:`"
                ></v-checkbox>
              </v-layout>
              <v-layout>
                <v-flex xs10>
                  <v-text-field
                    class="pt-0"
                    v-model="updateItem.title"
                    label="Название"
                    :rules="[rules.required]"
                  >
                    {{ updateItem.title }}
                  </v-text-field>
                </v-flex>
                <v-flex xs2>
                  <v-text-field
                    class="pt-0 ml-12"
                    v-model="updateItem.year"
                    label="Год"
                    :rules="[rules.required]"
                  >
                    {{ updateItem.year }}
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
                      wrap="off"
                      solo
                      filled
                      flat
                      background-color="orange lighten-4"
                      class="textarea_font_mono"
                      v-model="updateItem.card"
                      no-resize
                      name="input-7-1"
                      value="`${updateItem.card}`"
                      @keydown="rowLimit($event)"
                      :rows="14"
                      :rules="[
                        updateItem.image == null && formData == null
                          ? rules.required
                          : true
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
                    ref="EDIT_IMG_BOX"
                    id="EDIT_IMG_BOX"
                    class="active_card_image"
                  ></div>

                  <div
                    ref="EDIT_IMG_BOX_ICON"
                    id="EDIT_IMG_BOX_ICON"
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
                      id="open-file-edit"
                      @click.native.prevent="openFileDialogEdit($event)"
                    >
                      Файл
                    </v-btn>
                    <input
                      id="file-upload-update"
                      type="file"
                      style="display:none"
                      accept="image/*"
                      @change="onFileChangeEdit"
                    />
                  </div>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions v-bind:class="{ active: activeClass }">
            <v-spacer />
            <v-btn color="blue darken-1" text @click="dialogUpdate = false">
              Отмена
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="saveUpdate(updateItem, 'form_update')"
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
import { mapGetters } from "vuex";

import { imageCard } from "../../mixins/imageCard";

export default {
  mixins: [limiter, saverecord, imageCard],
  components: {
    ErrorMessage,
    Loader
  },
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
      path: process.env.VUE_APP_API_URL,
      titleOfToolbar: "Редактирование",
      imageInBlock: null,
      activeClass: false,
      interval: {},
      value: 0,
      error: null,
      dialogUpdate: false,
      validUpdate: true,
      updateItem: {
        id: "",
        auths: "",
        title: "",
        year: 0,
        izmiran: null,
        card: "",
        image: null
      },
      image: null,
      checkbox: false,
      formData: null,
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
  computed: mapGetters(["getByIndexRecord"]),
  watch: {
    async dialogUpdate(val) {
      if (!val) {
        this.$refs.form_update.reset();
      }

      this.image = null;
      this.error = null;
      (this.value = 0),
        (this.interval = {}),
        (this.activeClass = false),
        (this.formData = null);
      if (this.$refs.EDIT_IMG_BOX) {
        this.$refs.EDIT_IMG_BOX.innerHTML = "";
      }
    }
  },
  methods: {
    async showEditDialog(id) {
      this.dialogUpdate = true;
      this.current = await this.getByIndexRecord(id);

      this.updateItem.id = id;
      this.updateItem.auths = this.current.auths;
      this.updateItem.title = this.current.title;
      this.updateItem.year = this.current.year;
      this.updateItem.izmiran = this.current.izmiran == 1 ? true : false;
      this.updateItem.card = this.current.card;
      this.updateItem.image =
        this.current.image === undefined ? null : this.current.image;

      if (this.current.image !== undefined) {
        this.$refs.EDIT_IMG_BOX_ICON.style = "display: none";

        this.image =
          (await this.path) +
          this.$_imageCard_fileName(id, this.updateItem.image) +
          "?" +
          Date.now();

        let statusUrl = await this.statusUrl(this.image);

        if (statusUrl == 404 || statusUrl == 500) {
          this.image = (await this.path) + "not_found.png" + "?" + Date.now();
        }


          console.log('что уходит в IMAGE in EDIT comp', this.image)


        await CardService.showImage("EDIT_IMG_BOX", this.image, 350, 526);
      } else {
        this.$refs.EDIT_IMG_BOX_ICON.style = "display: inline-box";
      }
    },
    async statusUrl(url) {
      return await new Promise(function(resolve, reject) {
        return fetch(url).then(
          function(response) {
            if (response) {
              resolve(response.status);
            } else {
              reject(new Error(error));
            }
          },
          error => {
            reject(new Error(error.message));
          }
        );
      });
    },

    async openFileDialogEdit(e) {
      console.log("OPEN DIALOG FROM openFileDialogEdit");
      this.error = null;
      await CardService.openFileDialog(e);
    },
    async onFileChangeEdit(e) {
      console.log("onFileChangeEdit", e);
      this.$refs.EDIT_IMG_BOX.style = await "display: inline-flex";
      this.$refs.EDIT_IMG_BOX_ICON.style = "display: none";
      this.error = await CardService.errorAlert(e);

      let fileInfo = await CardService.onFileChange(
        e,
        "EDIT_IMG_BOX",
        this.error
      );

      if (fileInfo !== null) {
        this.formData = fileInfo.form;
        this.fileOriginal = this.updateItem.image = fileInfo.name;
        this.fileExtention = fileInfo.ext;
      }
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
  font-family: monospace, monospace !important;
  font-style: normal;
  font-variant: normal;
  font-weight: 400;
  height: 297px;
}

.active_card_image {
  height: 330px;
  width: 100%;
  position: absolute;
}

.empty_card_image {
  height: 330px;
  border: 1px dashed green;
  display: inline-flex;
  width: 100%;
}

.v-textarea >>> textarea {
  font-family: monospace, monospace !important;
  line-height: 1.2rem;
  font-size: 13px;
  width: 502px;
}

.wrap-upload-img {
  overflow: hidden;
  position: relative;
  width: 100%;
}
</style>
