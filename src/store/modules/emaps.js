import { Request } from "@/services/axios.service";

export const types = {
  SET_PROP: "SET_PROP",
  SET_CLEAR: "SET_CLEAR"
};
const initState = {
  breadcrumbs: [],
  illustrationId: 0,
  illustrationName: "",
  svgPath: "",
  notes: [],
  svg: ""
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
  SET_BREADCRUMBS(state,value){
    state.breadcrumbs = value;
  },
  [types.SET_PROP](state, payload) {
    state[payload.meta] = payload.data;
  },
  [types.SET_CLEAR](state) {
    for (let key in initState) {
      state[key] = initState[key];
    }
  }  
};

const modules = {};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
  modules
};
