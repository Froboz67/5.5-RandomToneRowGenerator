import axios from "axios";

export default {
    getToneRow() {
        console.log("ToneRowService.getToneRow()");
        return axios.get(`/tonerow`);
    },
    saveToneRow(toneRow) {
        console.log("ToneRowService.saveToneRow()");
        return axios.post(`/tonerow`, toneRow);
    }

}