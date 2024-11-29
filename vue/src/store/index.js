import { createStore as _createStore } from 'vuex';
import axios from 'axios';

export function createStore(currentToken, currentUser) {
  let store = _createStore({
    state: {
      token: currentToken || '',
      user: currentUser || {},
      toneRowArray: [],
      pitchClassArray: [],
      isPitchClassVisible: false,
      matrix: [],
      audioContext: null,
      oscillator: null,
      gainNode: null,
      isPlaying: false
    },
    mutations: {
      SET_AUTH_TOKEN(state, token) {
        state.token = token;
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      },
      SET_USER(state, user) {
        state.user = user;
        localStorage.setItem('user', JSON.stringify(user));
      },
      LOGOUT(state) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        state.token = '';
        state.user = {};
        axios.defaults.headers.common = {};
      },
      SET_TONE_ROW_ARRAY(state, toneRowArray) {
        state.toneRowArray = toneRowArray
      },
      SET_PITCH_CLASS_ARRAY(state, pitchClassArray) {
        state.pitchClassArray = pitchClassArray;
        state.isPitchClassVisible = true;
      },
      SET_MATRIX(state, matrix) {
        state.matrix = matrix;
      },
      RESET_STATE(state) {
        // console.log("before reset - isPitchClassVisible:", this.$store.getIsPitchClassVisible(state));
        state.toneRowArray = [];
        state.pitchClassArray = [];
        state.isPitchClassVisible = false;
        // console.log("after reset - isPitchClassVisible:", this.$store.getIsPitchClassVisible(state));
      },
      SET_PLAYING_STATE(state, isPlaying) {
        state.isPlaying = isPlaying;
      },
      SET_AUDIO_NODES(state, { audioContext, oscillator, gainNode }) {
        state.audioContext = audioContext;
        state.oscillator = oscillator;
        state.gainNode = gainNode;
      }
    },
    actions: {

      updateToneRowArray({ commit }, toneRowArray) {
        commit('SET_TONE_ROW_ARRAY', toneRowArray)
      },
      updatePitchClassArray({ commit }, pitchClassArray) {
        commit('SET_PITCH_CLASS_ARRAY', pitchClassArray)
      },
      RESET_STATE({ commit }) {
        console.log("dispatching RESET_STATE");
        commit('RESET_STATE');
      },
      playSound({ state, commit }, pitch) {

        if (state.isPlaying) return; // Prevent starting a new sound if one is already playing

        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        console.log('AudioContext initialized');
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = 'sine';
        oscillator.frequency.value = pitch.frequency;
        gainNode.gain.value = 0.5;

        oscillator.start();
        commit('SET_AUDIO_NODES', { audioContext, oscillator, gainNode });
        commit('SET_PLAYING_STATE', true);
      },
      stopSound({ state, commit }) {
        if (!state.isPlaying) return; // Prevent stopping if no sound is playing
        state.gainNode.gain.setValueAtTime(0.5, state.audioContext.currentTime);
        state.gainNode.gain.exponentialRampToValueAtTime(0.00001, state.audioContext.currentTime + .02);
        // state.oscillator.stop();
        commit('SET_PLAYING_STATE', false);

        // Clean up nodes to release 
        state.oscillator.disconnect();
        state.gainNode.disconnect();
        state.audioContext.close();
        console.log("AudioContext closed");
      },
      async saveToneRow({ state }, toneRowPayload) {
        console.log("ToneRowService.saveToneRow()", toneRowPayload);
        try {
          const response = await axios.post('/tonerow', toneRowPayload, {
            headers: {
              Authorization: `Bearer ${state.token}`,
            },
          });

          if (response.status === 200) {
            console.log("ToneRowService.saveToneRow() - success", response.data);

          } else {
            console.log("ToneRowService.saveToneRow() - error", response.data);
          }
        } catch (error) {
          if (error.response && error.response.status === 409) {
            console.log("ToneRowService.saveToneRow() - duplicate name error", error.response.data);
            alert("Tone Row Name Already Exists, Please choose a different name");
          } else {
            console.log("ToneRowService.saveToneRow() - error", error);
            alert("Error Saving Tone Row, Please Try Again");
          }

          console.log("ToneRowService.saveToneRow() - error", error);
        }
      }
    },
    getters: {
      getToneRowArray(state) {
        return state.toneRowArray;
      },
      getPitchClassArray(state) {
        return state.pitchClassArray;
      },
      getIsPitchClassVisible(state) {
        return state.isPitchClassVisible;
      },
      getMatrix(state) {
        return state.matrix;
      }
    }
  });
  return store;
}
