export const imageCard = {
  data() {
    return {};
  },
  methods: {
    $_imageCard_fileName(id, image) {
      let ext = image.match(/(\w+)$/g).join();
      return id + "." + ext;
    }
  }
};
