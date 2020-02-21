<template>
  <v-snackbar
    v-model="snackbar"
    :multi-line="multiLine"
    top
    color="green lighten-1"
    class="data-change-message black--text"
    :timeout="timeout"
  >
    {{ text }}
    <v-btn color="black--text" text @click="snackbar = false">
      <v-icon>mdi-close-circle-outline</v-icon>
    </v-btn>
  </v-snackbar>
</template>
<script>
export default {
  props: {
    text: {
      type: String,
      default() {
        return "";
      }
    }
  },
  data() {
    return {
      snackbar: false,
      multiLine: true,
      timeout: 3000
    };
  },
  watch: {
    text() {
      this.snackbar = true;
    }
  }
};
</script>
<style lang="stylus" scoped>
.data-change-message {
    max-width: 100%;
    width: 100%;
    display: block;
    opacity: 0.88;
}
</style>
