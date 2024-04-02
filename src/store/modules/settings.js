const state = {
  showCarousel: false
}

// Getter functions(get value)
const getters = {
  getCarouselStatus: state => {
    return state.showCarousel
  }
}

// Actions
const actions = {}
// Mutations(change value)
const mutations = {
  SET_CAROUSEL_STATUS(state, data) {
    state.showCarousel = data
  }
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
