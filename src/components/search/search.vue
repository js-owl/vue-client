<template>
  <div class="search_wrapper">
    <div class="search_title">{{ $t('search') }}</div>
    <div class="search_input">
      <input
        :class="'search_input__long_' + section"
        v-on:keyup.enter="uazSearch"
        v-model="searchValue"
        :placeholder="getPlaceholder()"
        autocomplete="on"
        type="text"
      />
      <span @click="uazSearch" class="search_button">
        <i class="search_icon fas fa-search"></i>
      </span>
    </div>
  </div>
  <ModalContent
    v-if="searchVinInfo"
    v-model="showModal"
    :redirect-after-confim="redirectLink"
    :vin-info="searchVinInfo"
  />
  <ModalMessage
    v-if="modalMessageText"
    v-model="showModalMessage"
    :text="modalMessageText"
  />
  <AlertDialog
    :open="alertOpen"
    :bodyModal="$t('sureDiagnostic')"
    :headModal="$t('confirmDiagnostic').toUpperCase()"
    :confirmClick="handleConfirm"
    :cancelClick="handleCancel"
  />
  <AlertDialog
    :open="alertOpenVin"
    :bodyModal="$t('sureDiagnostic')"
    :headModal="$t('confirmDiagnostic').toUpperCase()"
    :confirmClick="handleConfirmVin"
    :cancelClick="handleCancelVin"
  />
</template>
<script>
import { Request } from '@/services/axios.service'
import ModalContent from '@/components/modal_templates/Search_vin_modal.vue'
import ModalMessage from '@/components/modal_templates/Search_vin_message.vue'
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'
import { types } from '@/store/modules/diagnostic'
import AlertDialog from '@/components/diagnostic/AlertDialog.vue'
import { errorMixin } from '@/plugins/error.plugin'
export default {
  data() {
    return {
      idForPopUp: 1,
      searchValue: '',
      lastSearchValue: '',
      redirectLink: '',
      haveItems: 0,
      searchVinInfo: {},
      modalMessageText: '',
      showModal: false,
      alertOpen: false,
      alertOpenVin: false,
      vinWasAlready: false,
      showModalMessage: false,
      tempVinInfo: {},
      tempResponse: {},
      tempAlternative: false
    }
  },
  computed: {
    ...mapState(['VIN_SATUS', 'THROUGH_VIN']),
    ...mapState('section', ['section']),
    ...mapState('vinThrough', ['THROUGH_VIN']),
    ...mapState({
      productModelId: state => state.modification.productModel_id,
      productModificationId: state => state.modification.productModification_id,
      defectId: state => state.diagnostic.defectId
    })
  },
  components: {
    ModalContent,
    AlertDialog,
    ModalMessage
  },
  mounted() {},
  methods: {
    ...mapMutations({
      setPropDiagnostic: `diagnostic/SET_PROP`,
      toClearSession: `diagnostic/${types.SET_CLEAR}`,
      toClearTesting: `diagnostic/testing/${types.SET_CLEAR}`
    }),
    uazSearch: function() {
      if (this.searchValue.length > 2) {
        Request.get('/productmodification/searchvin', {
          params: {
            filter: this.searchValue,
            section: this.section,
            page: 1
          }
        })
          .then(response => {
            if (response.data.isVin) {
              this.searchValue = ''
              let vinInfo = response.data.vin_info
              vinInfo.color = this.getColor(response.data.option, vinInfo.color)
              if (!this.isEmptyVin(vinInfo)) {
                if (this.defectId) {
                  this.tempResponse = response
                  this.tempVinInfo = vinInfo
                  this.tempAlternative = false
                  this.openAlertVin()
                } else {
                  this.showModalAndSaveVIN(vinInfo, response)
                }
              } else {
                if (!response.data.fit_mods.length) {
                  errorMixin.methods.showError('warn', this.$t('notFoundAll'))
                } else {
                  if (!vinInfo.showInParts && response.data.fit_mods.length) {
                    if (this.defectId) {
                      this.tempResponse = response
                      this.tempVinInfo = vinInfo
                      this.tempAlternative = true
                      this.openAlertVin()
                    } else {
                      this.showModalAndSaveVIN(vinInfo, response, true)
                    }
                  }
                }
              }
            } else {
              if (
                response.data.items &&
                response.data.items.length &&
                this.section == 'parts'
              ) {
                if (response.data.items.length == 1) {
                  this.$router.push(
                    '/parts/models-' +
                      response.data.items[0].productModel_id +
                      '/modification-' +
                      response.data.items[0].productModification_id +
                      '/'
                  )
                  this.$store.commit('section/SET_PAGE_LEVEL', 1)
                  this.modalMessageText =
                    this.$t('modificationMatch') +
                    response.data.items[0].productModification_name
                  this.showModalMessage = true
                } else {
                  this.$router.push(
                    '/parts/search/modification-list/' +
                      '?query=' +
                      this.searchValue
                  )
                  this.$store.commit('section/SET_PAGE_LEVEL', 1)
                }
              } else {
                if (this.section == 'parts') {
                  if (this.$route.path == '/parts/search/') {
                    this.getParts(true) //если мы ищем один и тот же запрос дважды
                  } else {
                    this.getParts()
                  }
                } else if (this.section == 'flowcharts') {
                  this.checkIfHaveResultsFlowcharts().then(() => {
                    if (
                      (response.data.items && response.data.items.length) ||
                      this.haveItems
                    ) {
                      if (this.$route.path !== '/flowcharts') {
                        this.getFlowcharts()
                      }
                    } else {
                      errorMixin.methods.showError(
                        'warn',
                        this.$t('notFoundAll')
                      )
                    }
                  })
                } else if (this.section == 'emaps') {
                  this.searchEmaps()
                } else if (this.section == 'diagnostic') {
                  this.checkIfHaveResultsDiagnostic().then(() => {
                    if (this.haveItems) {
                      this.getDiagnostics()
                    } else {
                      errorMixin.methods.showError(
                        'warn',
                        this.$t('notFoundAll')
                      )
                    }
                  })
                } else {
                  errorMixin.methods.showError('warn', this.$t('notFoundAll'))
                }
              }
            }
            this.lastSearchValue = this.searchValue
          })
          .catch(function(error) {
            console.log('error', error)
          })
      } else {
        errorMixin.methods.showError('warn', 'Введите не менее 3 символов')
      }
    },
    // метод дублируется из компанента поиска запчастей потому что 1) если нет результатов не редиректим на сттраницу поиска + при данной логике если запросить дважды одно и тоже не работает ворнинг( как и весь запрос)
    getParts: function(selfSearch = false) {
      let params = {
        filter: this.searchValue,
        section: this.section
      }
      if (
        this.vinThrough &&
        this.vinThrough.showInParts &&
        this.productModificationId
      ) {
        params.productModification_id = this.productModificationId
      } else {
        if (
          this.vinThrough &&
          this.vinThrough.alternative &&
          this.vinThrough.alternative.showInParts &&
          this.vinThrough.alternative.productModification_id
        ) {
          params.productModification_id = this.vinThrough.alternative.productModification_id
        }
      }
      Request.get('/part/search', {
        params
      })
        .then(response => {
          //конкретный кейс, мы поискали что-то существующее, перешли на страницу поиска и с неё ищем 2 раза одинаковое несуществующее
          if (
            selfSearch &&
            !Object.keys(response.data.data).length &&
            this.lastSearchValue == this.searchValue
          ) {
            errorMixin.methods.showError('warn', this.$t('notFoundAll'))
            this.$router.push('/parts/search/' + '?query=' + this.searchValue)
            this.$store.commit('section/SET_PAGE_LEVEL', 1)
          } else if (Object.keys(response.data.data).length) {
            this.$router.push('/parts/search/' + '?query=' + this.searchValue)
            this.$store.commit('section/SET_PAGE_LEVEL', 1)
          } else {
            errorMixin.methods.showError('warn', this.$t('notFoundAll'))
          }
        })
        .catch(function(error) {
          console.log('error', error)
        })
    },
    searchEmaps: function() {
      let params = {
        filter: this.searchValue,
        section: this.section,
        isDealer: true,
        isDilerSearch: true,
        isPublish: 1
      }
      if (
        this.vinThrough &&
        this.vinThrough.showInParts &&
        this.productModificationId
      ) {
        params.productModification_id = this.productModificationId
      } else {
        if (
          this.vinThrough &&
          this.vinThrough.alternative &&
          this.vinThrough.alternative.showInParts &&
          this.vinThrough.alternative.productModification_id
        ) {
          params.productModification_id = this.vinThrough.alternative.productModification_id
        }
      }
      Request.get('/electricgroup/', {
        params
      })
        .then(response => {
          this.$router.push('/emaps/search/' + '?query=' + this.searchValue)
        })
        .catch(function(error) {
          console.log('error', error)
        })
    },
    getFlowcharts: function() {
      this.$router.push('/flowcharts/search/' + '?query=' + this.searchValue)
      this.$store.commit('section/SET_PAGE_LEVEL', 1)
    },
    getDiagnostics: function() {
      if (this.defectId) {
        this.openAlert()
      } else {
        this.$router.push('/diagnostic/search/' + '?query=' + this.searchValue)
      }
    },
    checkIfHaveResultsFlowcharts: function() {
      this.haveItems = 0
      let params = {
        filter: this.searchValue,
        getmods4part: 'true',
        groupbymodel: 'true',
        productModification_id:
          this.THROUGH_VIN && this.THROUGH_VIN.productModification_id
            ? this.THROUGH_VIN.productModification_id
            : this.productModificationId,
        isPublish: '1',
        page: 1
      }
      return Request.get('/flowchart/', {
        params
      })
        .then(response => {
          this.haveItems = response.data.data.length
        })
        .catch(function(error) {
          console.log('error', error)
        })
    },
    checkIfHaveResultsEmaps: function() {
      this.haveItems = 0
      let params = {
        filter: this.searchValue,
        isDealer: 'true',
        isDilerSearch: 'true',
        isPublish: '1',
        page: 1
      }
      Request.get('/electricgroup/', {
        params
      })
        .then(response => {
          this.haveItems = response.data.data.length
        })
        .catch(function(error) {
          console.log('error', error)
        })
    },
    checkIfHaveResultsDiagnostic: function() {
      this.haveItems = 0
      let params = {
        filter: this.searchValue,
        section: 'diagnostic',
        page: 1
      }
      return Request.get('/diagnostic/list', {
        params
      })
        .then(response => {
          this.haveItems = Object.keys(response.data).length
          console.log(this.haveItems)
        })
        .catch(function(error) {
          console.log('error', error)
        })
    },
    getColor: function(options, defaultColorName) {
      let res = defaultColorName
      if (options) {
        for (var i = 0; i < options.length; i++) {
          if (options[i].optionIncadea_type == 1) {
            res = options[i].optionIncadea_description
            break
          }
        }
      }
      return res
    },
    getPlaceholder: function() {
      let res = ''
      switch (this.section) {
        case 'parts':
          res = this.$t('searchPlaceholders.modifications.parts')
          break
        case 'standtime':
          res = 'VIN'
          break
        case 'flowcharts':
          res =
            this.$route.path == '/flowcharts'
              ? 'VIN'
              : this.$t('searchPlaceholders.modifications.flowcharts')
          break
        case 'emaps':
          res = 'VIN'
          break
        case 'diagnostic':
          res = this.$t('searchPlaceholders.modifications.diagnostic')
          break
      }
      return res
    },

    //TODO global
    saveThroughVin: function(vinInfo) {
      this.$store.commit('vinThrough/SET_THROUGH_VIN', vinInfo)
      this.$store.commit('vinThrough/SET_TIMESTAMP')
      this.$store.commit('vinThrough/SET_REFRESH_STAND_TIME', true)
    },
    showModalAndSaveVIN: function(vinInfo, response, isAlternaive = false) {
      //проверяем был ли закреплён до этого
      if (this.THROUGH_VIN) {
        this.vinWasAlready = true
      } else {
        this.vinWasAlready = false
      }
      this.showModal = true
      this.searchVinInfo = response.data.vin_info
      this.searchVinInfo.option = response.data.option
      if (isAlternaive) {
        this.searchVinInfo.alternative = response.data.fit_mods[0] // это чисто для отображения в модалке
        vinInfo.alternative = response.data.fit_mods[0]
      }
      if (!this.isEmptyVin(vinInfo) || isAlternaive) {
        this.saveThroughVin(vinInfo)
        this.setPropDiagnostic({ meta: 'defectId', data: '' })
        this.setPropDiagnostic({ meta: 'currentComponent', data: 'Defects' })
        this.refreshGlobalData(vinInfo)
        console.log(vinInfo, this.section, 'fffff3')
        if (
          this.checkAvailableInChapter(vinInfo, this.section) ||
          isAlternaive
        ) {
          this.redirectAfterModal(vinInfo, isAlternaive)
        } else {
          this.$router.push('/' + this.section + '/')
        }
        //чтобы подгружались модель в НЧ TODO чтобы без перегазгрузки
        if (this.section == 'standtime') {
          this.redirectLink = 'reload'
        }
      }
    },
    refreshGlobalData: function(vinInfo) {
      this.$store.commit('model/SET_FULL_STATE', vinInfo)
      this.$store.commit('modification/SET_FULL_STATE', vinInfo)
      this.$store.commit('standtime/SET_CLEAR_VIN')
      // window.location.reload();
    },
    checkAvailableInChapter: function(permissionObject, section) {
      let havePermission = false
      switch (section) {
        case 'parts':
          havePermission = permissionObject.showInParts
          break
        case 'standtime':
          havePermission = permissionObject.showInLaborTime
          break
        case 'flowcharts':
          havePermission = permissionObject.showInFlowchart
          break
        case 'emaps':
          havePermission = permissionObject.showInEmaps
          break
        case 'diagnostic':
          havePermission = permissionObject.showInDiagnostic
          break
      }
      return havePermission
    },
    isEmptyVin: function(permissionObject) {
      return !(
        permissionObject.showInParts ||
        permissionObject.showInLaborTime ||
        permissionObject.showInFlowchart ||
        permissionObject.showInEmaps ||
        permissionObject.showInDiagnostic
      )
    },
    isContentPage() {
      let res = false
      let currentPath = this.$router.currentRoute._value.path
      if (currentPath == '/parts/search/') {
        res = true
      }
      return res
    },
    redirectAfterModal: function(vinInfo, isAlternaive = false) {
      if (this.checkAvailableInChapter(vinInfo, this.section)) {
        if (
          this.section == 'parts' &&
          !this.$route.query.productModification_id
        ) {
          this.$router.push(
            '/parts/models-' +
              vinInfo.productModel_id +
              '/modification-' +
              vinInfo.productModification_id +
              '/'
          )
          this.$store.commit('section/SET_PAGE_LEVEL', 1)
          if (this.vinWasAlready) {
            this.redirectLink = 'reload'
          }
        }
        if (this.section == 'flowcharts' && !this.$route.params.flowchartId) {
          this.$router.push(
            '/flowcharts/models-' +
              vinInfo.productModel_id +
              '/modification-' +
              vinInfo.productModification_id +
              '/'
          )
          this.$store.commit('section/SET_PAGE_LEVEL', 1)
        }
        if (this.section == 'emaps' && !this.$route.params.illustrationId) {
          this.$router.push(
            '/emaps/models-' +
              vinInfo.productModel_id +
              '/modification-' +
              vinInfo.productModification_id +
              '/'
          )
          this.$store.commit('section/SET_PAGE_LEVEL', 1)
        }
        if (this.section == 'diagnostic') {
          this.$router.push(
            '/diagnostic/models-' +
              vinInfo.productModel_id +
              '/modification-' +
              vinInfo.productModification_id +
              '/'
          )
          this.$store.commit('section/SET_PAGE_LEVEL', 1)
        }
      } else {
        if (isAlternaive) {
          if (
            this.section == 'parts' &&
            !this.$route.query.productModification_id
          ) {
            this.$router.push(
              '/parts/models-' +
                vinInfo.alternative.productModel_id +
                '/modification-' +
                vinInfo.alternative.productModification_id +
                '/'
            )
            this.$store.commit('section/SET_PAGE_LEVEL', 1)
          }
        } else {
          //this.$router.push('/'+ this.section +'/');
        }
      }
    },
    //тут на самом деле большая проблема в которой один не большой баг, при смене двух винов которые эфейлибл ин партс всё люто тупит а так это копия redirectAfterModal
    //но после перехода по табам
    redirectAfterGoTabs: function(vinInfo, isAlternaive = false) {
      if (this.checkAvailableInChapter(vinInfo, this.section)) {
        if (
          this.section == 'parts' &&
          !this.$route.query.productModification_id
        ) {
          this.$router.push(
            '/parts/models-' +
              vinInfo.productModel_id +
              '/modification-' +
              vinInfo.productModification_id +
              '/'
          )
          this.$store.commit('section/SET_PAGE_LEVEL', 1)
        }
        if (this.section == 'flowcharts' && !this.$route.params.flowchartId) {
          //убрал за ненужностью но если баг всплываёт надо рефакторить или обновить эту функцию до копии
          //    this.$router.push('/flowcharts/models-'+ vinInfo.productModel_id +'/modification-'+ vinInfo.productModification_id +'/');
          //   this.$store.commit('section/SET_PAGE_LEVEL',1);
        }
        if (this.section == 'emaps' && !this.$route.params.illustrationId) {
          this.$router.push(
            '/emaps/models-' +
              vinInfo.productModel_id +
              '/modification-' +
              vinInfo.productModification_id +
              '/'
          )
          this.$store.commit('section/SET_PAGE_LEVEL', 1)
        }
      } else {
        if (isAlternaive) {
          if (
            this.section == 'parts' &&
            !this.$route.query.productModification_id
          ) {
            this.$router.push(
              '/parts/models-' +
                vinInfo.alternative.productModel_id +
                '/modification-' +
                vinInfo.alternative.productModification_id +
                '/'
            )
            this.$store.commit('section/SET_PAGE_LEVEL', 1)
          }
        } else {
          //this.$router.push('/'+ this.section +'/');
        }
      }
    },
    openAlert() {
      this.alertOpen = true
    },
    handleConfirm() {
      this.destroySession()
      this.setPropDiagnostic({ meta: 'defectId', data: '' })
      this.toClearSession()
      this.toClearTesting()
      this.$router.push('/diagnostic/search/' + '?query=' + this.searchValue)
      this.handleCancel()
    },
    handleCancel() {
      this.alertOpen = false
    },
    openAlertVin() {
      this.alertOpenVin = true
    },
    handleConfirmVin() {
      this.destroySession()
      this.setPropDiagnostic({ meta: 'defectId', data: '' })
      this.setPropDiagnostic({ meta: 'currentComponent', data: 'Defects' })
      this.toClearSession()
      this.toClearTesting()
      this.showModalAndSaveVIN(
        this.tempVinInfo,
        this.tempResponse,
        this.tempAlternative
      )
      this.handleCancelVin()
    },
    handleCancelVin() {
      this.alertOpenVin = false
    },
    destroySession() {
      this.toClearTesting()
      this.toClearSession()
    }
  },
  watch: {
    section: function(newValue, oldValue) {
      this.section = newValue
    },
    $route(to, from) {
      let section = to.path.split('/')[1]
      if (
        ![
          'parts',
          'standtime',
          'flowcharts',
          'flowchart',
          'emaps',
          'diagnostic'
        ].includes(section)
      ) {
        console.log('could not recognize default page', 'error')
      }
      if (section == 'flowchart') {
        section = 'flowcharts'
      }
      this.$store.commit('section/SET_SECTION', section)
      if (!this.isContentPage()) {
        if (this.THROUGH_VIN) {
          if (
            this.THROUGH_VIN.alternative &&
            this.THROUGH_VIN.alternative.showInParts
          ) {
            this.redirectAfterGoTabs(this.THROUGH_VIN, true)
          } else {
            if (this.checkAvailableInChapter(this.THROUGH_VIN, section)) {
              this.redirectAfterGoTabs(this.THROUGH_VIN, false)
            }
          }
        }
      }
    }
  }
}
</script>
<style scoped>
.search_button {
  cursor: pointer;
  margin-left: -7px;
}
.search_title {
  font-size: 10px;
  font-weight: 600;
}
.search_input {
  font-size: 10px;
  font-weight: 400;
  white-space: nowrap;
}
.search_input input {
  padding: 5px;
  border: 1px solid #b8bdc0;
  box-sizing: border-box;
  height: 20px;
  font-size: 10px;
  font-weight: 400;
  width: 352px; /*Parts : search*/
}
.search_wrapper {
  margin-top: 7px;
  position: relative;
}
.search_icon {
  /*position: absolute;
  right: 7px;
  top: 16px;
  font-size: 13px;*/
  color: #013e2c;
  position: relative;
  right: 20px;
  top: 3px;
  font-size: 16px;
  display: inherit;
}
.search_input__long_standtime {
  width: 670px !important;
}
.search_input__long_diagnostic {
  width: 489px !important;
}
.uaz__subheader_list .search_input__long_diagnostic,
.uaz__subheader_test .search_input__long_diagnostic,
.uaz__subheader_result .search_input__long_diagnostic,
.uaz__subheader_session .search_input__long_diagnostic,
.uaz__subheader_report .search_input__long_diagnostic {
  width: 330px !important;
  width: 490px !important;
}
</style>
