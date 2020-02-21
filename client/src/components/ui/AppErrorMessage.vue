<template>
  <v-row no-gutters mb-6>
    <v-col class="ma-0">
      <v-alert type="error" dense class="mt-0" transition="scale-transition">{{ message }}
      </v-alert>
    </v-col>
  </v-row>
</template>
<script>
export default {
  props: {
    message: {
      type: String,
      default() {
        return "";
      }
    }
  },
  data() {
    return {};
  }
};
</script>
