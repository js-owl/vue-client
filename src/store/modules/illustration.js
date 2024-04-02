const state = {
  illustration : 0,
};

// Getter functions
const getters = {
  getIllustration: state => {
    return state.illustration;
  }
};

// Actions
const actions = {
};
// Mutations
const mutations = {
  SET_ILLUSTRATION(state, data) {
    state.illustration = data;
  }
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
