const state = {
    VIN_SATUS:"",
    needToRefreshStandTime:false,
    timeUpdate:0,
    THROUGH_VIN:{}
  };
  
  // Getter functions
  const getters = {
    getVinTokenState: state => {
        return state.VIN_SATUS;
    },
    getRefreshStandTime: state => {
        return state.needToRefreshStandTime;
    },
    getTimestamp: state => {
        return state.timeUpdate;
    },
    getThroughVinState: state => {
        return state.THROUGH_VIN;
    }
  };
  
  // Actions
  const actions = {
    
  };
  // Mutations
  const mutations = {
    SET_VIN_STATUS(state,value){
        state.VIN_SATUS = value;
    },
    SET_TIMESTAMP(state,value){
        state.timeUpdate = Date.now();
    },
    SET_REFRESH_STAND_TIME(state,value){
        state.needToRefreshStandTime = value;
    },
    SET_THROUGH_VIN(state,value){
        state.THROUGH_VIN = value;
    },
  };
  export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
  };
  