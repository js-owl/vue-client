import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Design from '../views/Design.vue'
import Test from '../views/Test.vue'
import Test_old from '../views/Test_old.vue'
import Auth from '../views/Auth.vue'
import Parts from '../views/Parts.vue'
import Diagnostic from '../views/Diagnostic.vue'
import Standtime from '../views/Standtime.vue'
import Flowcharts from '../views/Flowcharts.vue'
import Emaps from '../views/Emaps.vue'
import EmapsGroups from '../views/EmapsGroups.vue'
import Flowchart from '../views/Flowchart.vue'
import FlowchartDetailWrap from '../views/FlowchartDetailWrap.vue'
import FlowchartsGroups from '../views/FlowchartsGroups.vue'
import DiagnosticApp from '../views/DiagnosticApp.vue'
import Dialog from '../components/common/UI/Dialog.vue'
import Detail from '../views/Parts_detail.vue'
import Parts_illustration_detail from '../views/Parts_illustration_detail.vue'
import EmapsIllustrationDetail from '../views/EmapsIllustrationDetail.vue'
import PartsSearch from '../components/search/search_parts.vue'
import PartsSearchModificationList from '../components/search/search_modification_list.vue'
import FlowchartSearchList from '../components/search/flowcharts_search_list.vue'
import FlowchartSearchPage from '../components/search/search_flowcharts.vue'
import EmapsSearchPage from '../components/search/search_emaps.vue'
import DiagnosticSearchPage from '../components/search/search_diagnostic.vue'
import store from '@/store'
import { types } from '@/store/modules/modification.js'
import { Request } from '@/services/axios.service'

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: { layout: 'default' },
    redirect: '/parts',
    component: Home
  },
  {
    path: '/test',
    name: 'Test',
    meta: { layout: 'default' },
    component: Test
  },
  {
    path: '/test_old',
    name: 'Test_old',
    meta: { layout: 'default' },
    component: Test_old
  },
  {
    path: '/auth',
    name: 'auth',
    meta: { layout: 'auth' },
    component: Auth
  },
  {
    path: '/parts',
    name: 'parts',
    meta: { layout: 'default' },
    component: Parts
  },
  {
    path: '/parts/models-:productModelId/:modification-:productModificationId',
    name: 'parts_detail',
    meta: { layout: 'default' },
    component: Detail
  },
  {
    path: '/parts/illustration/detail/:illustrationId',
    name: 'parts_illustration_detail',
    meta: { layout: 'default' },
    component: Parts_illustration_detail
  },
  {
    path: '/parts/search/',
    name: 'parts_search',
    meta: { layout: 'default' },
    component: PartsSearch
  },
  {
    path: '/parts/search/modification-list/',
    name: 'parts_search_modification-list',
    meta: { layout: 'default' },
    component: PartsSearchModificationList
  },
  {
    path: '/flowcharts/search/flowcharts-list/',
    name: 'search_flowcharts-list',
    meta: { layout: 'default' },
    component: FlowchartSearchList
  },
  {
    path: '/flowcharts/search/',
    name: 'flowcharts_search',
    meta: { layout: 'default' },
    component: FlowchartSearchPage
  },
  {
    path: '/diagnostic/search/',
    name: 'diagnostic_search',
    meta: { layout: 'default' },
    component: DiagnosticSearchPage
  },
  {
    path: '/standtime',
    name: 'standtime',
    meta: { layout: 'default' },
    component: Standtime
  },
  {
    path: '/flowcharts',
    name: 'flowcharts',
    meta: { layout: 'default' },
    component: Flowcharts
  },
  {
    path:
      '/flowchart/models-:productModelId/modification-:productModificationId',
    name: 'flowchart',
    meta: { layout: 'default' },
    component: Flowchart
  },
  {
    path: '/new-design/',
    name: 'design',
    meta: { layout: 'default' },
    component: Design
  },
  {
    path:
      '/flowcharts/detail/model-:productModelId/modification-:productModificationId/year-:year/flowchart-:flowchartId',
    name: 'flowchart_detail',
    meta: { layout: 'default' },
    component: FlowchartDetailWrap
  },
  {
    path:
      '/flowcharts/models-:productModelId/modification-:productModificationId',
    name: 'flowcharts_groups',
    meta: { layout: 'default' },
    component: FlowchartsGroups
  },
  {
    path: '/emaps',
    name: 'emaps',
    meta: { layout: 'default' },
    component: Emaps
  },
  {
    path: '/emaps/search/',
    name: 'emaps_search',
    meta: { layout: 'default' },
    component: EmapsSearchPage
  },
  {
    path: '/emaps/models-:productModelId/modification-:productModificationId',
    name: 'emaps_groups',
    meta: { layout: 'default' },
    component: EmapsGroups
  },
  {
    path:
      '/emaps/illustration/detail/model-:productModelId/modification-:productModificationId/year-:year/illustration-:illustrationId',
    name: 'emapsIllustrationDetail',
    meta: { layout: 'default' },
    component: EmapsIllustrationDetail
  },
  {
    path: '/diagnostic',
    name: 'diagnostic',
    meta: { layout: 'default' },
    component: Diagnostic
  },
  {
    path:
      '/diagnostic/models-:productModelId/modification-:productModificationId/',
    name: 'diagnostic_app',
    meta: { layout: 'default' },
    component: DiagnosticApp
  },
  {
    path: '/dialog',
    name: 'dialog',
    meta: { layout: 'default' },
    component: Dialog
  },
  {
    path: '/about',
    name: 'About',
    meta: { layout: 'default' },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  const { params } = to
  if (params.productModificationId) {
    await Request.get(
      `/productmodification/get/${params.productModificationId}`,
      {
        params: {}
      }
    )
      .then(response => {
        store.commit(`modification/${types.SET_STATE}`, {
          type: types.SET_STATE,
          data: response.data
        })
      })
      .catch(function(error) {
        console.log('error', error)
      })
  }
  return next()
})

export default router
