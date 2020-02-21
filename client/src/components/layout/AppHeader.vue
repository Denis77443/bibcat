<template>
  <v-app-bar app>
    <v-toolbar-title class="headline text-uppercase">
      <span>БИБЛИОТЕКА ИЗМИРАН</span>
      <span class="font-weight-light">
        КАТАЛОГ БИБЛИОГРАФИЧЕСКОЙ ИНФОРМАЦИИ</span
      >
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn text to="/">
      <span class="mr-2">Поиск</span>
      <v-icon>mdi-magnify</v-icon>
    </v-btn>
    <v-btn text to="/admin2">
      <span class="mr-2">Библиотекарь</span>
      <v-icon>mdi-account</v-icon>
    </v-btn>

    <v-btn text to="/admin">
      <span class="mr-2">Admin</span>
      <v-icon>mdi-account</v-icon>
    </v-btn>

    <span v-if="this.$store.state.user">
      <v-btn text @click="logout">
        <span class="mr-2">Logout</span>
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </span>

    <v-btn text to="/help">
      <span class="mr-2">Справка {{ this.$store.state.user }}</span>
      <v-icon>mdi-help-circle</v-icon>
    </v-btn>
  </v-app-bar>
</template>
<script>
export default {
  data() {
    return {
      //
    };
  },
  methods: {
    logout() {
      this.$store.dispatch("setUser", null);
      sessionStorage.setItem("user", null);
      this.$router.push({
        name: "home"
      });
    }
  }
};
</script>
