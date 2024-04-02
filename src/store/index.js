import standtime from '@/store/modules/standtime.js'
import group from '@/store/modules/group.js'
import illustration from '@/store/modules/illustration.js'
import illustrationGroup from '@/store/modules/illustrationGroup.js'
import model from '@/store/modules/model.js'
import modification from '@/store/modules/modification.js'
import section from '@/store/modules/section.js'
import filters from '@/store/modules/filters.js'
import lang from '@/store/modules/lang.js'
import settings from '@/store/modules/settings.js'
import subgroup from '@/store/modules/subgroup.js'
import vinThrough from '@/store/modules/vinThrough.js'
import createPersistedState from 'vuex-persistedstate'
import diagnostic from '@/store/modules/diagnostic'
import emaps from '@/store/modules/emaps'
import Vuex, { createStore, createLogger } from 'vuex'

export default new Vuex.Store({
  state: {
    authToken: ''
  },
  mutations: {
    SET_AUTH_TOKEN(state, value) {
      state.authToken = value
    },
    AUTH_LOGIN(state, value) {
      if (value.access_token) {
        localStorage.setItem('user-token', value.access_token)
        localStorage.setItem('user-data', JSON.stringify(value.user_data))
        state.authToken = value.access_token
      }
    },
    AUTH_LOGOUT(state) {
      localStorage.removeItem('user-token')
      localStorage.removeItem('user-data')
      state.authToken = ''
    }
  },
  actions: {},
  getters: {
    getAuthToken: state => {
      return state.authToken
    }
  },
  plugins: [createPersistedState()],
  modules: {
    diagnostic,
    emaps,
    filters,
    group,
    illustration,
    illustrationGroup,
    lang,
    model,
    modification,
    section,
    settings,
    standtime,
    subgroup,
    vinThrough
  }
})
