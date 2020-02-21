<template>
  <div>
    <v-toolbar dark class="headline dark orange elevation-10">
      {{ title }} библиографических данных
    </v-toolbar>
    <div v-bind:class="{active: !activeClass }">
      <div class="wrap-progress-circular">
        <v-progress-circular
          :rotate="-90"
          :size="100"
          :width="15"
          :value="loadingValue"
          color="primary"
        >
          {{ loadingValue }}%
        </v-progress-circular>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["loadingValue", "titleToolbar", "activeClass"],
  data() {
    return {};
  },
  computed: {
    title: function() {
      return !this.activeClass ? this.titleToolbar : "Сохранение";
    }
  }
};
</script>
<style lang="stylus" scoped>
.active
  display: none;
.wrap-progress-circular
  display: flex;
  justify-content: center;
</style>
