<template>
  <v-container fill-height fluid grid-list-xl class="mt-5">
    <v-layout justify-center wrap>
      <v-flex md12>
        <v-card color="white">
          <div class="v-offset">
            <v-card class="dark orange elevation-10 pa-3" :height="355">
              <div fluid class="float-left">
                <span>
                  <h4 class="title font-weight-light mb-2">
                    Вход добавления/редактирования картотеки
                  </h4>
                </span>
              </div>

              <div class="clearfix" v-if="connect !== true">
                <v-form
                  ref="form_change_connection"
                  v-model="validChangeConnection"
                  lazy-validation
                  @submit.prevent="newConnection"
                >
                  <v-card class="orange lighten-3 xs">
                    <v-layout justify-center row fill-height>
                      <v-flex xs12 sm4 md4 ml-3>
                        <v-text-field
                          :value="login"
                          solo
                          hint="Имя пользователя"
                          :rules="[rules.required]"
                          persistent-hint
                          @change="v => (login = v)"
                        ></v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout justify-center row fill-height>
                      <v-flex xs12 sm4 md4 ml-3>
                        <v-text-field
                          :value="pass"
                          :rules="[rules.required]"
                          solo
                          hint="Пароль"
                          persistent-hint
                          :type="show ? 'text' : 'password'"
                          :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                          @change="v => (pass = v)"
                          @click:append="show = !show"
                        ></v-text-field>
                      </v-flex>
                    </v-layout>

                    <v-layout justify-center row fill-height>
                      <v-flex xs12 sm4 md2 class="text-xs-center">
                        <v-btn
                          :height="34"
                          color="orange"
                          :disabled="!validChangeConnection"
                          type="submit"
                        >
                          Войти
                          <v-icon right>mdi-login-variant</v-icon>
                        </v-btn>
                      </v-flex>
                    </v-layout>
                  </v-card>
                </v-form>
              </div>
            </v-card>
          </div>
        </v-card>
      </v-flex>
      <v-flex md12> </v-flex>
      <ErrorMessage
        class="ml-4 mr-4"
        :message="`${error.err.message}`"
        v-if="error"
      />
    </v-layout>
  </v-container>
</template>
<script>
import CardService from "../../services/CardService";
import ErrorMessage from "../ui/AppErrorMessage";

export default {
  components: {
    ErrorMessage
  },
  data() {
    return {
      show: false,
      error: null,
      login: null,
      pass: null,
      validChangeConnection: true,
      connect: null,
      checkLogin: false,
      rules: {
        required: value =>
          (!!value && value.replace(/\s/g, "").length > 0) || "Required."
      }
    };
  },
  methods: {
    async newConnection() {
      if (this.$refs["form_change_connection"].validate()) {
        let text = {
          login: this.login,
          pass: this.pass
        };
        let connect = await CardService.changeDbConnection(
          "posts/connection/dbconnect",
          text
        );

        if (connect.status) {
          this.$store.dispatch("setUser", text.login);
          sessionStorage.setItem("user", text.login);
          await this.$emit("logged", {});
        } else {
          let jsonError = await JSON.stringify(connect);
          this.error = await JSON.parse(jsonError);
        }
      }
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

.clearfix {
  clear: both;
}
</style>
