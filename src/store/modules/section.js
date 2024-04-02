const state = {
  section : 'parts',
  pageLevel : 0,
};

// Getter functions
const getters = {
  getSection: state => {
    return state.section;
  },
  pageLevel: state => {
    return state.pageLevel;
  }
};

// Actions
const actions = {
};
// Mutations
const mutations = {
  SET_SECTION(state, data) {
    state.section = data;
  },
  SET_PAGE_LEVEL(state, data) {
    state.pageLevel = data;
  }
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
