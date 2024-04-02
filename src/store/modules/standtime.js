import { Request } from '@/services/axios.service'
import { modificationNameFormatter } from '@/components/utils/helpers'

import { filter, of } from 'rxjs'

// import { createI18n } from 'vue-i18n'
// // import { i18n } from '@/i18n/index.js'
// import { languages } from '@/i18n/index.js'
// const messages = Object.assign(languages)
// const i18n = createI18n({
//   legacy: false,
//   locale: 'ru',
//   fallbackLocale: 'ru',
//   messages
// })
// console.log('standtime.js : lang', i18n.global.locale.value)

export const types = {
  SET_PROP: 'SET_PROP',
  SET_CLEAR: 'SET_CLEAR',
  SET_CHECKLIST: 'SET_CHECKLIST',

  SET_TIMES: 'SET_TIMES',
  SET_SELECTED_STANDTIMES: 'SET_SELECTED_STANDTIMES',
  SET_STATE: 'SET_STATE',
  SET_GROUPS: 'SET_GROUPS',
  SET_SUBGROUPS: 'SET_SUBGROUPS',
  SET_MODELS: 'SET_MODELS',
  SET_MODIFICATIONS: 'SET_MODIFICATIONS',
  SET_CLEAR_VIN: 'SET_CLEAR_VIN'
}
const initState = {
  groupId: '',
  subgroupId: '',
  productModelId: 0,
  productModificationId: '',

  models: [],
  groups: [],
  subgroups: [],
  modifications: [],
  times: [],
  selected: [],
  standtimesToChoose: [],
  selectedStandtimes: [],
  data: [],
  checkedList: {},
  rightValue: []
}

const state = {
  ...initState
}

// Getter functions
const getters = {
  getModels: function(state) {
    console.log('model', state.models)
    const models = Object.values(state.models).map(model => ({
      value: model.productModel_id,
      label: model.productModel_name
    }))
    models.unshift({
      value: 0,
      label: `Не выбрано`
    })

    return models
  },
  getModelsEn: function(state) {
    console.log('model_en', state.models)
    const models = Object.values(state.models).map(model => ({
      value: model.productModel_id,
      label: model.productModel_name_en
    }))
    models.unshift({
      value: 0,
      label: `Not selected`
    })
    return models
  },
  getModifications: function(state) {
    console.log('state.modifications', state.modifications)
    const modifications = state.modifications.reduce((acc, item) => {
      acc.push({
        value: item.productModification_id,
        label: modificationNameFormatter(`${item.productModification_name}`)
      })
      return acc
    }, [])

    return modifications
  },
  getGroups: function(state) {
    const groups = state.groups.reduce((acc, item) => {
      acc.push({
        value: item.structureFlowChart_id,
        label: `${item.structureFlowChart_code} - ${item.structureFlowChart_name}`
      })
      return acc
    }, [])

    groups.unshift({
      value: 0,
      label: 'Не выбрано'
    })

    return groups
  },
  getGroupsEn: function(state) {
    console.log('groups', state.groups)
    const groups = state.groups.reduce((acc, item) => {
      acc.push({
        value: item.structureFlowChart_id,
        label: `${item.structureFlowChart_code} - ${item.structureFlowChart_name_en}`
      })
      return acc
    }, [])

    groups.unshift({
      value: 0,
      label: 'Not selected'
    })

    return groups
  },
  getSubGroups: function(state) {
    const subgroups = state.subgroups.reduce((acc, item) => {
      acc.push({
        value: item.structureFlowChart_id,
        label: `${item.structureFlowChart_path} - ${item.full_name}`
      })
      return acc
    }, [])

    subgroups.unshift({
      value: 0,
      label: 'Не выбрано'
    })

    return subgroups
  },
  getSubGroupsEn: function(state) {
    console.log('subgroups', state.groups)
    const subgroups = state.subgroups.reduce((acc, item) => {
      acc.push({
        value: item.structureFlowChart_id,
        label: `${item.structureFlowChart_path} - ${item.full_name_en}`
      })
      return acc
    }, [])

    subgroups.unshift({
      value: 0,
      label: 'Not selected'
    })

    return subgroups
  },
  getTimes: function(state) {
    const times = state.times

    return times
  }
}

// Actions
const actions = {
  loadModels({ commit, state }) {
    return Request.get(`/productmodelsLT`, {
      params: {
        section: 'standtime',
        notShowIsIgnored: true,
        showInDealer: 1,
        showInLaborTime: 1,
        time: new Date().getTime()
      }
    })
      .then(response => {
        commit('SET_MODELS', response.data.data)
      })
      .catch(function(error) {
        console.log('error', error)
      })
  },

  loadModifications({ commit, state }, status) {
    if (status == 'clear') {
      commit('SET_MODIFICATIONS', [])
    } else {
      if (state.productModelId) {
        return Request.get(`/productmodificationLT`, {
          params: {
            productModel_id: state.productModelId,
            showGoodMods: true,
            section: 'labortime',
            showInDealer: 1,
            time: new Date().getTime()
          }
        })
          .then(response => {
            let res = response.data.data.map(v => {
              v.productModification_name = v.productModificationLT_code
              return v
            })
            commit('SET_MODIFICATIONS', res)
          })
          .catch(function(error) {
            console.log('error', error)
          })
      }
    }
  },

  loadGroups({ commit, state }) {
    return Request.get(`/structureflowchart/`, {
      params: {
        section: 'flowchart',
        productModel_id: state.productModelId,
        productModification_id: state.productModificationId,
        time: new Date().getTime()
      }
    })
      .then(response => {
        commit('SET_GROUPS', response.data.data)
      })
      .catch(function(error) {
        console.log('error', error)
      })
  },
  loadSubgroups({ commit, state }) {
    return Request.get(`/structureflowchart/merge/${state.groupId}`, {
      params: {
        section: 'flowchart',
        productModel_id: state.productModelId,
        productModification_id: state.productModificationId,
        time: new Date().getTime()
      }
    })
      .then(response => {
        commit('SET_SUBGROUPS', response.data.data)
      })
      .catch(function(error) {
        console.log('error', error)
      })
  },
  saveStandtime({ commit, state }, value) {
    console.log(state.selectedStandtimes, 'state.selectedStandtimes')
    if (
      !state.selectedStandtimes.filter(elem => elem.key == value.key).length
    ) {
      let res = state.selectedStandtimes
      res.push(value)
      console.log(res, 'res')
      commit('SET_SELECTED_STANDTIMES', res)
    }
  },
  loadTimes({ commit, state }) {
    return Request.get(`/structureflowchartlabortime`, {
      params: {
        productModification_id: state.productModificationId,
        structureFlowChart_id: state.subgroupId,
        time: new Date().getTime()
      }
    })
      .then(response => {
        const times = response.data.data.map(i => ({
          ...i,
          laborTime_name:
            String(i.laborTime_code).slice(0, 2) +
            i.laborTime_norm +
            String(i.laborTime_code).slice(2) +
            ' - ' +
            i.laborTime_name
        }))
        commit('SET_TIMES', times)
      })
      .catch(function(error) {
        console.log('error', error)
      })
  }
}

// Mutations
const mutations = {
  [types.SET_PROP](state, payload) {
    state[payload.meta] = payload.data
  },
  [types.SET_MODIFICATIONS](state, payload) {
    state.modifications = payload
    console.log('SET_MODIFICATIONS', { payload })
  },
  [types.SET_GROUPS](state, payload) {
    state.groups = payload
  },
  [types.SET_SUBGROUPS](state, payload) {
    state.subgroups = payload
  },
  [types.SET_TIMES](state, payload) {
    state.times = payload
  },
  [types.SET_SELECTED_STANDTIMES](state, payload) {
    state.selectedStandtimes = payload
  },
  [types.SET_MODELS](state, payload) {
    state.models = payload
  },
  [types.SET_CLEAR_VIN](state, payload) {
    for (let key in initState) {
      if (
        key !== 'models' &&
        key !== 'groups' &&
        key !== 'modifications' &&
        key !== 'subgroups'
      ) {
        state[key] = initState[key]
        console.log(key)
      }
      // this.loadModifications();
    }
  },
  [types.SET_CLEAR](state) {
    for (let key in initState) {
      state[key] = initState[key]
    }
  },
  [types.SET_CHECKLIST](state) {
    const keys = Object.keys(state.checkedList)
    const list = state.data.reduce((acc, item, index, source) => {
      if (keys.indexOf(String(item.laborTime_id)) === -1) {
        acc[item.laborTime_id] = true
      } else {
        acc[item.laborTime_id] = state.checkedList[item.laborTime_id]
      }
      return acc
    }, {})
    state.checkedList = list
  },
  SET_NAME(state, data) {
    state.name = data
  },
  SET_MODEL_ID(state, data) {
    state.productModelId = data
  },
  SET_MODIFICATION_ID(state, data) {
    state.productModificationId = data
  }
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
