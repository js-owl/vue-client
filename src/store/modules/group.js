const state = {
  partGroup_id: 0,
};

// Getter functions
const getters = {
  getPartGroup_id: state => {
    return state.partGroup_id;
  }
};

// Actions
const actions = {
};
// Mutations
const mutations = {
  SET_ID(state, data) {
    state.partGroup_id = data;
  }
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
