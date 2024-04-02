import { Request } from "@/services/axios.service";
import testing from "@/store/modules/diagnostic/testing.js";
import {modificationNameFormatter} from '@/components/utils/helpers'

export const types = {
  SET_PROP: "SET_PROP",
  SET_CLEAR: "SET_CLEAR",
  SET_HISTORY: "SET_HISTORY",
  SET_HISTORY_SORTABLE: "SET_HISTORY_SORTABLE"
};
const initState = {
  history: {
    data: [],
    paginate: {
      pageSize: 25,
      currentPage: 1,
      total: 0
    },
    sortable: {
      sorting: "",
      sortingDirection: ""
    }
  },
  currentComponent: "Defects",
  structureFlowChartId: 0,
  defectType: "defectbycode",
  defectId: 0,
  defectInterviewId: 0
};

const state = {
  ...initState
};

// Getter functions
const getters = {
	getDiagnosticData: state => {
		return state;
	},
};

// Actions
const actions = {
  loadHistory({ commit, state }) {
    Request.get(`/defectinterview/`, {
      params: {
        page: state.history.paginate.currentPage,
        sorting: state.history.sortable.sorting,
        sortingDirection: state.history.sortable.sortingDirection		
      }
    })
      .then((response) => {
        if (response.data) {
          response.data.data = response.data.data.map((item) => ({
            ...item,
            productModification_name:modificationNameFormatter(item.productModification_name)
          }));		
          const histories = {
            data: response.data.data,
            paginate: {
              total: response.data.total,
              pageSize: response.data.per_page,
              currentPage: response.data.current_page
            },
            sortable: state.history.sortable
          };
          commit(types.SET_HISTORY, histories);
        }
      })
      .catch(function (error) {
        console.log("DiagnosticHistory", error);
      });
  }
};

// Mutations
const mutations = {
  [types.SET_PROP](state, payload) {
    state[payload.meta] = payload.data;
  },
  [types.SET_HISTORY](state, payload) {
    state.history = payload;
  },
  [types.SET_HISTORY_SORTABLE](state, payload) {
    state.history = { ...state.history, sortable: payload };
  },
  [types.SET_CLEAR](state) {
    for (let key in initState) {
      state[key] = initState[key];
    }
  }
};

const modules = {
  testing
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
  modules
};
