import { Request } from "@/services/axios.service";
import { modificationNameFormatter } from "@/components/utils/helpers";
import { filter } from "rxjs";

export const types = {
  SET_PROP: "SET_PROP",
  ADD_HISTORY: "ADD_HISTORY",
  ADD_ANSWERS: "ADD_ANSWERS",
  SET_CLEAR: "SET_CLEAR"
};
const initState = {
  tree: {},
  currentComponent: "List",
  furtherList: [],
  currentFurther: {},
  currentStep: null,
  currentIndex: 0,
  answers: {},
  history: {},
  selectedAnswer: null,
  isComplete: false,
  currentResult: ""
};

const state = {
  ...initState
};

// Getter functions
const getters = {};

// Actions
const actions = {};

// Mutations
const mutations = {
  [types.SET_PROP](state, payload) {
    state[payload.meta] = payload.data;
  },
  [types.SET_CLEAR](state) {
    for (let key in initState) {
      state[key] = initState[key];
    }
  },
  [types.ADD_HISTORY](state, payload) {
    //TODO refact
    let oldHistory = { ...state.history };
    let newHistory = { ...state.history };
    let newCurrentIndex = state.currentIndex;
    if (state.currentFurther) {
      if (oldHistory[state.currentFurther.defectItem_step]) {
        const found = oldHistory[state.currentFurther.defectItem_step].find(
          (item) => item.uid === payload.uid
        );
        if (!found) {
          newHistory[state.currentFurther.defectItem_step].push(payload);
          newCurrentIndex =
            newHistory[state.currentFurther.defectItem_step].length;
        }
      } else {
        newHistory[state.currentFurther.defectItem_step] = [payload];
        newCurrentIndex = 1;
      }
    }
    state.history = newHistory;
    state.currentIndex = newCurrentIndex;
  },
  [types.ADD_ANSWERS](state, payload) {
    let newAnswers = { ...state.answers };
    if (state.currentFurther) {
      if (newAnswers[state.currentFurther.defectItem_step]) {
        newAnswers[state.currentFurther.defectItem_step].splice(
          state.history[state.currentFurther.defectItem_step].length - 1,
          1,
          payload
        );
      } else {
        newAnswers[state.currentFurther.defectItem_step] = [payload];
      }
    }
    state.answers = newAnswers;
  }
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
