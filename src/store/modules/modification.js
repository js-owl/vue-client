export const types = {
  SET_STATE: 'SET_STATE'
}

// @ts-nocheck
const state = {
  productModification_id: 0,
  productModification_name: '316300-0000305-01 LIMITED',
  productModification_code: null,
  comment: null,
  comment_en: null,
  productModel_id: 0,
  isAll: false,
  productModification_description: null,
  showInDealer: false,
  productModification_modelYear: 2006,
  showInParts: null,
  showInFlowchart: true,
  showInEmaps: false,
  greenRoundType: 'none',
  engine_type_code: null,
  showInLaborTime: false,
  showInDiagnostic: false,
  productModel_name: 'ПAТРИОТ',
  productModel_name_en: 'PATRIOT'
}

// Getter functions
const getters = {
  getModification_id: state => {
    return state.productModification_id
  }
}

// Actions
const actions = {}
// Mutations
const mutations = {
  [types.SET_STATE](state, payload) {
    for (let key in state) {
      state[key] = payload.data[key]
    }
  },
  SET_NAME(state, data) {
    state.name = data
  },
  SET_ID(state, data) {
    state.productModification_id = data
  },
  SET_FULL_STATE(state, data) {
    Object.keys(state).forEach(function(key) {
      if (key in data) {
        state[key] = data[key]
      }
    })
  },
  RESET(state, data) {
    Object.keys(state).forEach(function(key) {
      state[key] = 0
    })
  }
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
