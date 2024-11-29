<template>
  <div class="header-container">
    <h1>Tone Rows</h1>
  </div>
  <div class="tonerow-list">
    <div
      v-for="toneRow in toneRows"
      :key="toneRow.id"
      @click="goToToneRow(toneRow.id)"
      class="tonerow-card"
    >
      <div class="card-content">
        <h2>{{ toneRow.name || "Unnamed Tone Row" }}</h2>
        <p>ID: {{ toneRow.id }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import ToneRowService from "../services/ToneRowService";

export default {
  data() {
    return {
      toneRows: [],
      toneRow: [],
    };
  },

  methods: {
    loadToneRow() {
      ToneRowService.getToneRow()
        .then((response) => {
          this.toneRows = response.data;
          console.log("toneRows: ", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    goToToneRow(id) {
      this.$router.push({ name: "toneRowDetails", params: { id: id } });
    },
  },
  created() {
    this.loadToneRow();
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
</style>