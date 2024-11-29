<template>
  <div class="home">
    <h1>Home</h1>
    <!-- <p>You must be authenticated to see this</p> -->
    <button v-on:click="handleClick">Create Random Tone Row</button>
    <!-- <button v-on:click="otherHandleClick">Load a Saved Tone Row</button> -->
  </div>
</template>

<script>
import RandomToneRow from "../components/RandomToneRow.vue";

export default {
  methods: {
    handleClick() {
      this.$store.dispatch("RESET_STATE");
      this.$router.push({ name: "randomToneRow" });
    },
    otherHandleClick() {
      this.$store.dispatch("RESET_STATE");
      this.$router.push({ name: "tonerow" });
    },
  },
  created() {
    this.$router.push({ name: "randomToneRow" });
  },
};
</script>

<style scoped>
button {
  margin: 5px;
}
</style>
