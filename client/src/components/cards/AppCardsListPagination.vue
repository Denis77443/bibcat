<template>
  <div>
    <!-- <div class="wrapper" style="border: 1px solid green">-->
    <v-row justify="center" align="center" class="navigation">
      <div>
        <v-btn
          class="float-left mx-12 black--text pa-0 mr-0 ml-2"
          min-width="36"
          color="white"
          v-on:click="cardNext"
          :disabled="disabledBttonTop"
        >
          <v-icon large color="orange darken-2">mdi-arrow-up-bold</v-icon>
        </v-btn>
        <v-btn
          class="clearfix mx-12 black--text pa-0 ma-2 mr-0 ml-2"
          min-width="36"
          v-on:click="cardPrev"
          :disabled="disabledButtonDown"
          left
        >
          <v-icon large color="orange darken-2">mdi-arrow-down-bold</v-icon>
        </v-btn>
      </div>
      <div>
        <v-btn
          class="float-left mx-12 black--text pa-0 mr-0 ml-4"
          min-width="36"
          color="white"
          @click="lastPage"
          :disabled="disableButtonNextPage"
          >{{ page.last }}
        </v-btn>
        <v-btn
          class="clearfix mx-12 pa-0 ma-2 mr-0 ml-4"
          min-width="36"
          @click="nextPage"
          :disabled="disableButtonNextPage"
          ><v-icon large color="orange darken-2">mdi-chevron-up</v-icon>
        </v-btn>
        <v-btn
          class="clearfix mx-12 pa-0 mr-0 ml-4"
          min-width="36"
          color="primary"
          >{{ page.current }}
        </v-btn>
        <v-btn
          class="clearfix mx-12 pa-0 ma-2 mr-0 ml-4"
          min-width="36"
          @click="prevPage"
          :disabled="disableButtonPrevPage"
          ><v-icon large color="orange darken-2"> mdi-chevron-down</v-icon>
        </v-btn>
        <v-btn
          class="clearfix mx-12 black--text pa-0 mr-0 ml-4"
          min-width="36"
          color="white"
          @click="startPage"
          :disabled="disabledButton"
          >{{ page.first }}
        </v-btn>
      </div>
    </v-row>
  </div>
  <!-- </v-row>
  </div>-->
</template>
<script>
import config from "../../services/Config";

export default {
  props: {
    items: {
      type: Array,
      default() {
        return [];
      }
    },
    page: {
      type: Object,
      default() {
        return {
          first: 1,
          last: 1,
          current: 1
        };
      }
    }
  },
  data() {
    return {
      CARDS_ON_PAGE: config.CARDS_ON_PAGE,
      disabledBttonTop: false,
      disabledButton: true,
      disabledButtonDown: true,
      pagination: {
        first: 1,
        last: 1,
        current: 1
      },
      nextNum: config.CARDS_ON_PAGE,
      prevNum: 0,
      disableButtonNextPage: false,
      disableButtonPrevPage: true
    };
  },
  watch: {
    page(value) {
      this.nextNum = value.next;
      this.prevNum = value.prev;
      this.pagination.current = value.current;

      if (this.prevNum === 0) {
        this.disabledBttonTop = false;
        this.disabledButtonDown = true;
        this.disabledButton = true;
        this.disableButtonNextPage = false;
        this.disableButtonPrevPage = true;
      }

      if (this.prevNum === this.items.length - 1) {
        this.disabledBttonTop = true;
        this.disableButtonPrevPage = false;
        this.disableButtonNextPage = true;
      }

      if (value.first === value.last) {
        this.disableButtonNextPage = true;
        this.disableButtonPrevPage = true;
        this.disabledButton = true;
      }
    }
  },

  methods: {
    cardNext() {
      this.nextNum++;
      this.prevNum++;

      if (this.prevNum > 0) {
        this.disabledButtonDown = false;
        this.disabledButton = false;
        this.disableButtonPrevPage = false;
      }

      if (this.prevNum === this.items.length - 1) {
        this.disabledBttonTop = true;
      }

      if (
        (this.nextNum % this.CARDS_ON_PAGE) * this.pagination.current == 0 &&
        this.nextNum !== this.CARDS_ON_PAGE
      ) {
        this.pagination.current++;
      }

      this.$emit("cardNext", {
        next: this.nextNum,
        prev: this.prevNum,
        disabledButton: this.disabledButton,
        disabledBttonTop: this.disabledBttonTop,
        current: this.pagination.current
      });
    },
    cardPrev() {
      if (this.prevNum % this.CARDS_ON_PAGE == 0) {
        --this.pagination.current;
      }

      if (this.nextNum - this.prevNum !== this.CARDS_ON_PAGE) {
        --this.prevNum;
      } else {
        --this.prevNum;
        --this.nextNum;
      }

      if (this.prevNum < 1) {
        this.disabledButton = true;
        this.disabledButtonDown = true;
      }
      this.disabledBttonTop = false;

      this.$emit("cardNext", {
        next: this.nextNum,
        prev: this.prevNum,
        disabledButton: this.disabledButton,
        disabledBttonTop: this.disabledBttonTop,
        current: this.pagination.current
      });
    },
    lastPage() {
      let cardsOnPage = this.CARDS_ON_PAGE;
      const lastStartPosition = this.items
        .map((a, index) => (index = index % cardsOnPage == 0 ? index : 0))
        .filter(a => a !== 0);

      this.pagination.current = this.page.last;
      this.nextNum = this.items.length;
      this.prevNum = lastStartPosition[lastStartPosition.length - 1];
      this.disableButtonNextPage = true;
      this.disabledButton = false;
      this.disabledButtonDown = false;
      this.disableButtonPrevPage = false;

      this.$emit("cardNext", {
        next: this.nextNum,
        prev: this.prevNum,
        disabledButton: this.disabledButton,
        disabledBttonTop: this.disabledBttonTop,
        current: this.pagination.current
      });
    },
    nextPage() {
      if (this.page.current < this.page.last) {
        this.page.current++;
        //this.page.current++;
        this.disabledButton = false;
        this.disableButtonPrevPage = false;
        this.disabledButtonDown = false;

        this.$emit("cardNext", {
          next: this.page.current * this.CARDS_ON_PAGE,
          prev: this.page.current * this.CARDS_ON_PAGE - this.CARDS_ON_PAGE,
          current: this.page.current
        });
      }

      if (this.page.current === this.page.last) {
        this.disableButtonNextPage = true;
        this.disabledButton = false;
      }
    },
    prevPage() {
      if (this.page.current > this.page.first) {
        --this.page.current;

        // this.disableButtonNextPage = false;
        this.disabledBttonTop = false;
      }

      if (this.page.current === this.page.first) {
        this.disableButtonNextPage = false;
        this.disabledButton = true;
        this.disabledButtonDown = true;
      }

      this.$emit("cardNext", {
        next: this.page.current * this.CARDS_ON_PAGE,
        prev: this.page.current * this.CARDS_ON_PAGE - this.CARDS_ON_PAGE,
        current: this.page.current
      });
    },
    startPage() {
      this.disabledBttonTop = false;
      this.disableButtonNextPage = false;
      this.disabledButton = true;
      this.disabledButtonDown = true;
      this.disableButtonNextPage = true;
      this.disableButtonNextPage = false;

      this.$emit("cardNext", {
        next: this.CARDS_ON_PAGE,
        prev: 0,
        current: this.page.first
      });
    }
  }
};
</script>
<style scoped>
.wrapper {
  padding-left: 20px;
  display: table-cell;
  position: absolute;
  margin-top: 200px;
}
.navigation {
  height: 100%;
  border: 0px solid red;
  margin-left: 400px;
}
.clearfix {
  clear: both;
  float: left;
}
</style>
