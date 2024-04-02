const state = {
  subGroup_id : 0,
};

// Getter functions
const getters = {
  getSubGroup_id: state => {
    return state.subGroup_id;
  }
};

// Actions
const actions = {
};
// Mutations
const mutations = {
  SET_GROUP(state, data) {
    state.subGroup_id = data;
  }
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
