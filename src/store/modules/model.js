
const state = {
  productModel_id: 0,
  productModel_code: "",
  productModel_group: "",
  productModel_image: 0,
  productModel_name: "",
  productModel_name_en: "",
};

// Getter functions
const getters = {
  getModel_id: state => {
    return state.productModel_id;
  },
  getModel_code: state => {
    return state.productModel_code;
  },
  getModel_group: state => {
    return state.productModel_group;
  },
  getModel_image: state => {
    return state.productModel_image;
  },
  getModel_name: state => {
    return state.productModel_name;
  },
};

// Actions
const actions = {
};
// Mutations
const mutations = {
  SET_ID(state, data) {
    state.productModel_id = data;
  },
  SET_CODE(state, data) {
    state.productModel_code = data;
  },
  SET_GROUP(state, data) {
    state.productModel_group = data;
  },
  SET_IMAGE(state, data) {
    state.productModel_image = data;
  },
  SET_NAME(state, data) {
    state.productModel_name = data;
  },
  SET_FULL_STATE(state, data) {
    Object.keys(state).forEach(function(key) {
      if(key in data){
        state[key] = data[key];
      }
    });
  },
  RESET(state, data) {
    Object.keys(state).forEach(function(key) {
      state[key] = 0;
    });
  }
  
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
