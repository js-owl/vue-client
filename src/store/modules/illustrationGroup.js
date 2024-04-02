const state = {
  illustrationGroup : 0,
};

// Getter functions
const getters = {
  getIllustrationGroup: state => {
    return state.illustrationGroup;
  }
};

// Actions
const actions = {
};
// Mutations
const mutations = {
  SET_GROUP(state, data) {
    state.illustrationGroup = data;
  }
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
