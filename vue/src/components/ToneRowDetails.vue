<template>
  <div class="tone-row-details">
    <h1>{{ toneRow.name }}</h1>
    <p>{{ toneRow.startingPitchValue }}</p>
    <ul>
      <li v-for="(pitch, index) in pitches" :key="index">
        Pitch {{ index }}: {{ pitch }}
      </li>
    </ul>
  </div>
</template>

<script>
import ToneRowService from "../services/ToneRowService";

export default {
  data() {
    return {
      toneRow: {},
      pitches: [],
    };
  },
  methods: {
    loadToneRowDetails() {
      const id = this.$route.params.id;

      ToneRowService.getToneRow(id)
        .then((response) => {
          this.toneRow = response.data;
          this.pitches = [
            this.toneRow.pZero,
            this.toneRow.pOne,
            this.toneRow.pTwo,
            this.toneRow.pThree,
            this.toneRow.pFour,
            this.toneRow.pFive,
            this.toneRow.pSix,
            this.toneRow.pSeven,
            this.toneRow.pEight,
            this.toneRow.pNine,
            this.toneRow.pTen,
            this.toneRow.pEleven,
          ];
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  created() {
    this.loadToneRowDetails();
  },
};
</script>

<style scoped>
.tone-row-details {
  padding: 20px;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  padding: 5px 0;
}
</style>