<template>
  <div>
    <div class="header-container">
      <h1>Tone Row Matrix</h1>
      <button
        v-on:click="
          this.resetState();
          $router.push({ name: 'randomToneRow' });
        "
      >
        Back to Tone Row
      </button>
      <!-- <h1>Tone Row by Pitch Class</h1> -->

      <div class="button-group">
        <button v-on:click="showByNote">Show Matrix by Note Name</button>
        <button v-on:click="showByNumber">Show Matrix by Pitch Class</button>
        <button v-on:click="playRandomPitch">play note</button>
      </div>
    </div>
    <div class="tone-grid">
      <div
        class="grid-item d-flex flex-nowrap"
        :class="{ highlighted: pitch.isHighlighted }"
        v-for="(pitch, index) in matrix"
        v-bind:key="index"
        @mouseover="onNoteMouseOver(pitch)"
        @mouseleave="onNoteMouseLeave(pitch)"
      >
        {{ pitch[currentDisplay] }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      matrix: [],
      currentDisplay: "",
    };
  },
  computed: {
    pitchClassArray() {
      console.log(
        "this is pitchClassArray: ",
        this.$store.state.pitchClassArray
      );
      return this.$store.state.pitchClassArray;
    },
  },
  methods: {
    onNoteMouseOver(pitch) {
      this.$store.dispatch("playSound", pitch);
    },
    onNoteMouseLeave(pitch) {
      this.$store.dispatch("stopSound", pitch);
    },

    backToRandomToneRow() {
      this.$state.isPitchClassVisible = false;
      this.$router.push({ name: "randomToneRow" });
    },
    showByNote() {
      this.currentDisplay = "note";
      this.buildToneRowMatrix();
    },
    showByNumber() {
      this.currentDisplay = "baseZero";
      this.buildToneRowMatrix();
    },
    buildToneRowMatrix() {
      // the matrix is the complete toneRow matrix
      let matrix = [];
      // this assigns the matrix to the pitchClassArray
      matrix = [...this.$store.state.pitchClassArray];
      console.log("this is the matrix: ", matrix);

      // this array holds the first row of the matrix only filled with P0 values
      let primeZero = [];
      primeZero = matrix.map((baseZero) => {
        return {
          pitchValue: baseZero.pitchValue,
          baseZero: baseZero.baseZero,
          note: baseZero.note,
          frequency: baseZero.frequency,
        };
      });
      console.log("line 64 - This is primeZero: ", primeZero);
      // this loop builds each row of the matrix
      let primeRows = [];
      for (let eachRow = 1; eachRow < 12; eachRow++) {
        primeRows[0] = 12 - primeZero[eachRow].baseZero;
        console.log(
          "this is primeZero[eachRow]: ",
          primeZero[eachRow] + "|" + eachRow
        );
        console.log("this is primeRows[0]: ", primeRows[0]);
        console.log("this is primeRows: ", primeRows);
        const matchingZeroElement = matrix.find(
          (element) => element.baseZero === primeRows[0]
        );
        matrix.push({
          pitchValue: matchingZeroElement.pitchValue,
          baseZero: matchingZeroElement.baseZero,
          note: matchingZeroElement.note,
          frequency: matchingZeroElement.frequency,
        });
        // loop for each column of the matrix
        for (let eachColumn = 1; eachColumn < 12; eachColumn++) {
          // calculate the value for primeRows[eachColumn] based on primeZero[eachColumn] and primeRows[0]
          // primeRows[0] will always be the next row in the matrix

          const calculateBaseZero =
            (primeZero[eachColumn].baseZero + primeRows[0]) % 12;

          // find the matching element in the matrix
          const matchingElement = matrix.find(
            (element) => element.baseZero === calculateBaseZero
          );

          matrix.push({
            pitchValue: matchingElement.pitchValue,
            baseZero: matchingElement.baseZero,
            note: matchingElement.note,
            frequency: matchingElement.frequency,
          });
        }
      }
      this.matrix = matrix;
      console.log("this is primeRows: ", primeRows);
      console.log("this is matrix: ", matrix);
      console.log("this is the pitchClassArray: ", this.pitchClassArray);
    },
    resetState() {
      this.matrix = [];
    },
    async playRandomPitch() {
      if (this.matrix.length === 0) {
        console.log("Matrix is empty. Cannot play a pitch.");
        return;
      }

      // Choose a random pitch from the matrix
      const randomIndex = Math.floor(Math.random() * this.matrix.length);
      const selectedPitch = this.matrix[randomIndex];

      // Temporarily highlight the selected pitch
      this.matrix[randomIndex] = {
        ...selectedPitch,
        isHighlighted: true,
      };

      // Play the sound
      this.$store.dispatch("playSound", selectedPitch);

      // Update the matrix to trigger re-render
      this.matrix = [...this.matrix];

      // Wait for 2 seconds
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Stop the sound and remove the highlight
      this.$store.dispatch("stopSound", selectedPitch);
      this.matrix[randomIndex] = {
        ...selectedPitch,
        isHighlighted: false,
      };

      // Update the matrix to revert the highlight
      this.matrix = [...this.matrix];
    },
  },
};
</script>

<style scoped>
button {
  border-radius: 4px;
}
.header-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}
.tone-grid {
  display: grid;
  grid-template-columns: repeat(
    12,
    minmax(20px, 1fr)
  ); /* 12 columns that shrink but won't go below 40px */
  grid-template-rows: repeat(12, 1fr); /* 12 equal-height rows */
  gap: 5px; /* Space between grid items */
  margin-left: 2%;
  margin-right: 2%;
  margin: 0 auto;
  /* width: 100%; Allow grid to take full width */
  max-width: 600px; /* Maximum width of 600px */
}

.grid-item {
  white-space: nowrap;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background-color: #f0f0f0; /* Background color */
  border: 1px solid #ddd; /* Border around items */
  border-radius: 4px; /* Rounded corners (optional) */
  font-size: 1rem; /* Default font size */
  transition: background-color 0.3s; /* Transition for hover effect */
}
.grid-item:hover {
  background-color: #b0e57c; /* Background color on hover */
}
.button-group {
  overflow-x: auto;
  white-space: nowrap;
  display: flex;
  flex-direction: row;
  gap: 10px;
}
.grid-item.highlighted {
  background-color: #a0d9a1; /* Light green for highlighted item */
}

@media (max-width: 576px) {
  .grid-item {
    font-size: 0.8rem;
  }
}
</style>