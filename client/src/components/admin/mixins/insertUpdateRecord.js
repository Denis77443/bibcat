import CardService from "../../../services/CardService";

export const saverecord = {
  data() {
    return {};
  },
  methods: {
    async saveUpdate(obj, ref) {
      let text = {
        auths: obj.auths,
        title: obj.title,
        year: obj.year,
        card: obj.card,
        izmiran: obj.izmiran === true ? 1 : 0,
        image: obj.image
      };

      if (text.card !== null && text.card.search(/[a-zA-Zа-яА-Я0-9]/g) === -1) {
        text.card = null;
      }

      if (this.$refs[ref].validate()) {
        if (this.formData !== null) {
          this.activeClass = true;
          this.interval = async ms => {
            await CardService.delay(ms);
            this.value += await 17;
            await CardService.sendImageFile(this.formData);
            await CardService.delay(ms);
            this.value += await 17;

            if (ref === "form_insert") {
              await CardService.insertRecord(text, "/posts/");
            }

            if (ref === "form_update") {
              await CardService.updateRecord(
                this.updateItem.id,
                text,
                "/posts/"
              );
            }

            await CardService.delay(ms);
            this.value += await 17;

            if (ref === "form_insert") {
              const lastId =
                (
                  await CardService.getOneLastPost("/posts/last/lastrec")
                ).data.id.toString() +
                "." +
                this.fileExtention;

              await CardService.delay(ms);
              this.value += await 17;
              await CardService.renameImageFile(text.image, lastId);
            }

            if (ref === "form_update") {
              const lastId =
                (await this.updateItem.id) + "." + this.fileExtention;
              //console.log('lastId= ', lastId)
              await CardService.delay(ms);
              this.value += await 17;
              await CardService.renameImageFile(this.fileOriginal, lastId);
            }

            //await this.delay(ms);
            await CardService.delay(ms);
            this.value += await 17;
            await CardService.delay(ms);
            this.value += await 15;

            if (ref === "form_update") {
              await CardService.delay(ms);
              await this.$emit("editrecord", { id: obj.id, data: text });
              this.dialogUpdate = await false;
            }

            if (ref === "form_insert") {
              await CardService.delay(ms);
              await this.$emit("newrecord", {});
              this.dialog = await false;
            }
          };
          this.interval(350);
        } else {
          if (ref === "form_update") {
            await CardService.updateRecord(obj.id, text, "/posts/");
            await this.$emit("editrecord", { id: obj.id, data: text });
            this.dialogUpdate = await false;
          }
          if (ref === "form_insert") {
            let insertRecord = await CardService.insertRecord(text, "/posts/");
            if (insertRecord.status === 201) {
              this.$emit("newrecord", {});
              this.dialog = await false;
            }
          }
        }
      } else {
        //console.log("validation is not good from mixin");
      }
    }
  }
};
