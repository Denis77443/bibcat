<template>
  <v-app>
    <Header />
    <v-content class="orange lighten-3">
      <router-view />
    </v-content>
    <Footer />
  </v-app>
</template>

<script>
import Header from "./components/layout/AppHeader";
import Footer from "./components/layout/AppFooter";

export default {
  name: "App",
  components: {
    Header,
    Footer
  },
  data() {
    return {
      //
    };
  },
  async beforeCreate() {
    if (sessionStorage.getItem("user") === null) {
      this.$store.dispatch("setUser", null);
    }
  }
};
</script>
