const state = {
  activeLanguage: ''
}

// Getter functions
const getters = {
  getActiveLanguage: state => {
    return state.activeLanguage
  }
}

// Actions
const actions = {}
// Mutations
const mutations = {
  SET_ACTIVE_LANGUAGE(state, data) {
    localStorage.setItem('lang', data.toUpperCase())
    state.activeLanguage = localStorage.getItem('lang')
  }
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
