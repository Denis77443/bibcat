<template>
  <div class="ml-3">
    <div class="my-2">
      <v-btn
        color="orange darken-2"
        :href="`${urlapi}api/posts/print/${currentCardId}`"
        target="_blank"
      >
        <v-icon dark>mdi-printer</v-icon>
      </v-btn>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    currentCardId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      urlapi: process.env.VUE_APP_API_URL
    };
  }
};
</script>
