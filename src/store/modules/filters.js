const state = {
  year : '-',
  group : '-',
  group2 : '-',
  subgroup : '-',
  imageID : '-',
};

// Getter functions
const getters = {
  getSelectedYear: state => {
    return state.year;
  },
  getSelectedGroup: state => {
    return state.group;
  },
  getSelectedGroup2: state => {
    return state.group2;
  },
  getSelectedSubgroup: state => {
    return state.subgroup;
  }, 
  getSelectedImageID: state => {
    return state.imageID;
  }, 
};

// Actions
const actions = {
};
// Mutations
const mutations = {
  SET_YEAR(state, data) {
    state.year = data;
  },
  SET_GROUP(state, data) {
    state.group = data;
  },
  SET_GROUP_EMAPS(state, data) {
    state.group2 = data;
  },
  SET_SUBGROUP(state, data) {
    state.subgroup = data;
  },
  SET_IMAGE_ID(state, data) {
    state.imageID = data;
  },
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
