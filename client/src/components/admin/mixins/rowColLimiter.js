export const limiter = {
  data() {
    return {
      positionY: 0,
      positionX: 0,
      toolTip: false
    };
  },
  methods: {
    async rowLimit(e) {
      // Row length limiter
      let limiter = (await e.target.offsetWidth) / 11;

      console.log(limiter);

      let widthElem =
        e.target.getBoundingClientRect().right -
        e.target.getBoundingClientRect().left;

      // Array of limiting rows
      let lines = await e.target.value.split(/\n/gm);

      console.log(lines);

      let textLines = await e.target.value
        .substr(0, e.target.selectionStart)
        .split("\n");

      if (textLines.length === 14 && e.keyCode === 13) {
        e.preventDefault();
      }

      var currentLineNumber = textLines.length;

      var currentLine = lines[currentLineNumber - 1];

      if (
        currentLine.length > limiter &&
        e.keyCode !== 13 &&
        e.keyCode !== 8 &&
        e.keyCode !== 46 &&
        e.keyCode !== 40 &&
        e.keyCode !== 38 &&
        e.keyCode !== 37 &&
        e.keyCode !== 39 &&
        e.keyCode !== 35 &&
        e.keyCode !== 36
      ) {
        this.positionY =
          e.target.getBoundingClientRect().top + Number(currentLineNumber * 18);
        this.positionX = e.target.getBoundingClientRect().right + 180;
        this.toolTip = true;
        e.preventDefault();
        return false;
      } else {
        this.toolTip = false;
        this.positionY = 0;
        this.positionX = 0;
      }
    }
  }
};
