<template>
  <header class="uaz__header">
    <div class="uaz__logo_wrapper" @click="goToMain">
      <logo-en v-show="this.$i18n.locale == 'en'" />
      <logo-ru v-show="this.$i18n.locale == 'ru'" />
    </div>
    <div class="uaz__header___tab_part">
      <div class="tab_wrapper">
        <el-tabs v-model="selectedTab" type="card" @tab-click="handleClick">
          <el-tab-pane name="parts" :label="$t('parts')"></el-tab-pane>
          <el-tab-pane :disabled="isAuth" name="standtime" :label="$t('standtime')"></el-tab-pane>
          <el-tab-pane :disabled="isAuth" name="flowcharts" :label="$t('flowcharts')"></el-tab-pane>
          <el-tab-pane :disabled="isAuth" name="emaps" :label="$t('emaps')"></el-tab-pane>
          <el-tab-pane :disabled="isAuth" name="diagnostic" :label="$t('diagnostic')"></el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="uaz__header___flex_part"></div>
    <div
      :class="[
        'uaz__header___menu_part',
        { uaz__header___menu_part_en: activeLang == 'EN' }
      ]"
    >
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        background-color="#013e2c"
        text-color="#fff"
        :ellipsis="false"
      >
        <el-tooltip
          class="item"
          effect="light"
          :content="$t('notifications')"
          placement="left"
          popper-class="uaz__tooltip uaz__tooltip-left"
        >
          <el-badge :is-dot="isRedDot" class="bell" @click="visible = !visible">
            <i class="bell_icon fas fa-bell"></i>
          </el-badge>
        </el-tooltip>
        <el-sub-menu index="1" popper-class="header_submenu_select_option">
          <template #title>{{ $t('documents') }}</template>
          <el-menu-item class="submenu_select_option" index="1-1">
            API
          </el-menu-item>
          <el-menu-item class="submenu_select_option" index="1-2">
            {{ $t('documentsOld') }}
          </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="2" popper-class="header_submenu_select_option">
          <template #title>{{ $t('language') }}</template>
          <el-menu-item
            @click="setLocale('ru')"
            :class="['submenu_select_option', { active: activeLang == 'RU' }]"
            index="2-1"
          >
            RU
          </el-menu-item>
          <el-menu-item
            @click="setLocale('en')"
            :class="['submenu_select_option', { active: activeLang == 'EN' }]"
            index="2-2"
          >
            EN
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
      <div class="uaz__header__logout" @click="logOut">{{ $t('logout') }}</div>
    </div>
    <div class="uaz__header__logo_part">
      <img src="../assets/logo.png" />
    </div>
  </header>

  <div
    :class="[
      'uaz__subheader',
      'uaz__subheader_' + section,
      { uaz__subheader_list: currentComponent == 'List' },
      { uaz__subheader_test: currentComponent == 'Test' },
      { uaz__subheader_result: currentComponent == 'Result' },
      { uaz__subheader_session: currentComponent == 'Session' },
      { uaz__subheader_report: currentComponent == 'Report' }
    ]"
  >
    <div style="display: flex;">
      <div class="search_block">
        <search />
        <div id="header-middle" />
      </div>
      <!--section !== 'diagnostic'-когда выходим из вкладки Диагностика(кнопки Сброс/История),Модель/Год-исчезали-->
      <selection-panel />
    </div>
    <div class="uaz__bar_header">
      <through-vin-panel />
      <left-bar-header />
      <right-bar-header />
    </div>
  </div>
  <notifications v-model="visible" @emitUnReadMessage="countUnReadMessage" />
  <AlertDialog
    :open="alertOpen"
    :bodyModal="$t('sureDiagnostic')"
    :headModal="$t('confirmDiagnostic').toUpperCase()"
    :confirmClick="handleConfirm"
    :cancelClick="handleCancel"
  />
  <el-dialog
    v-model="handleClick"
    width="80%"
    center
    custom-class="uaz__modal uaz__modal-sm uaz__auth_dialog"
    :title="$t('auth')"
  >
    <div class="uaz-login-content uaz_login_content_auth">
      <div class="uaz-container">
        <div class="uaz-green"></div>
        <div class="uaz-indent">
          <div class="uaz-info">
            <span class="h1">
              {{ $t('mainTitle') }}
            </span>
            <br />
            <span class="p">{{ $t('electronic') }} {{ $t('catalogue') }}</span>
          </div>
          <div class="uaz-connection">
            <el-form
              :model="ruleForm"
              :rules="rules"
              hide-required-asterisk
              label-width="120px"
              class="demo-ruleForm"
              ref="ruleFormRef"
            >
              <el-form-item :label="$t('emailOrLogin')" prop="login">
                <el-input v-model="ruleForm.login"></el-input>
              </el-form-item>
              <el-form-item :label="$t('password')" prop="password">
                <password-box v-model="ruleForm.password" />
              </el-form-item>
              <Modal-forgot-password />
              <div class="uaz-registration">
                <a><Modal-reg /></a>
                <el-button @click="submitForm(ruleFormRef)">
                  {{ $t('login') }}
                </el-button>
              </div>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
const axios = require('axios')
import { Request } from '@/services/axios.service'
import Modal_reg from '@/components/Modal_reg.vue'
import Modal_forgot_password from '@/components/Modal_forgot_password.vue'
import { errorMixin } from '@/plugins/error.plugin'
import Password_box from '@/components/Password_box.vue'
import Trough_vin_panel from '@/components/search/trough_vin_panel.vue'
import Selection_panel from '@/components/header/Selection_panel.vue'
import Right_bar_header from '@/components/Right_bar_header.vue'
import Left_bar_header from '@/components/Left_bar_header.vue'
import search from '@/components/search/search.vue'
import SelectFilterable from '@/components/common/UI/SelectFilterable.vue'
import AlertDialog from '@/components/diagnostic/AlertDialog.vue'
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'
import { types } from '@/store/modules/diagnostic'
import LogoEn from '@/components/header/logo_en.vue'
import LogoRu from '@/components/header/logo_ru.vue'
import Notifications from '@/components/header/Notifications.vue'

export default {
  mixins: [errorMixin],
  name: 'Header',
  data() {
    return {
      visible: false,
      selectedTab: this.section,
      activeLang: '',
      alertOpen: false,
      hideBar: false,
      isRedDot: false,
      ruleFormRef: Object.assign({}, this.ruleForm),
      ruleForm: {
        login: '',
        password: ''
      },
      rules: {
        login: [
          {
            required: true,
            message: this.$t('fillLogin'),
            trigger: 'change'
          }
        ],
        password: [
          {
            required: true,
            message: this.$t('fillPassword'),
            trigger: 'change'
          }
        ]
      }
    }
  },
  components: {
    'right-bar-header': Right_bar_header,
    'left-bar-header': Left_bar_header,
    'through-vin-panel': Trough_vin_panel,
    'selection-panel': Selection_panel,
    search,
    AlertDialog,
    SelectFilterable,
    LogoEn,
    LogoRu,
    Notifications,
    'Modal-reg': Modal_reg,
    'Modal-forgot-password': Modal_forgot_password,
    'password-box': Password_box
  },
  mounted: function() {
    if (localStorage.getItem('lang') === null) {
      localStorage.setItem('lang', 'RU')
    }
    this.$i18n.locale = localStorage.getItem('lang').toLowerCase()
    this.selectedTab = this.section
    this.activeLang = this.activeLanguage
    this.setLocale(this.$i18n.locale)
  },

  methods: {
    ...mapMutations({
      setProp: `emaps/breadcrumbs`,
      setPropDiagnostic: `diagnostic/SET_PROP`,
      toClearSession: `diagnostic/${types.SET_CLEAR}`,
      toClearTesting: `diagnostic/testing/${types.SET_CLEAR}`
    }),
    setLocale(locale) {
      this.$i18n.locale = locale
      this.activeLang = locale.toUpperCase()
      this.$store.commit('lang/SET_ACTIVE_LANGUAGE', locale)
      window.document.title = this.$t('documentTitle')
    },
    handleClick(tab, event) {
      if (
        tab.props.name == 'diagnostic' &&
        this.section == 'diagnostic' &&
        this.defectId
      ) {
        this.openAlert()
      } else {
        this.$router.push('/' + this.selectedTab)
      }
      if (tab.props.name == 'standtime' && tab.props.name == 'flowcharts' && tab.props.name == 'emaps' && tab.props.name == 'diagnostic') {
        this.openLogin()
      }
    },
    goToMain() {
      console.log('goToMain')
      this.selectedTab = 'parts'
      window.location = '/parts'
      this.$store.commit('section/SET_PAGE_LEVEL', 0)
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
    logOut() {
      this.$store.commit('AUTH_LOGOUT')
      this.$store.commit('vinThrough/SET_VIN_STATUS', 'not set')
      this.$store.commit('vinThrough/SET_THROUGH_VIN', '')
      this.$store.commit('model/SET_ID', 0)
      this.$store.commit('modification/SET_ID', 0)
      this.$router.push('/auth')
      this.$store.commit('section/SET_PAGE_LEVEL', -1)
    },
    openAlert() {
      this.alertOpen = true
    },
    handleConfirm() {
      this.setPropDiagnostic({ meta: 'defectId', data: '' })
      this.toClearSession()
      this.toClearTesting()
      this.$router.push('/diagnostic')
      this.alertOpen = false
    },
    handleCancel() {
      this.alertOpen = false
    },
    destroySession() {
      this.toClearTesting()
      this.toClearSession()
    },
    countUnReadMessage(count) {
      console.log('Header : count', count)
      this.isRedDot = count > 0
    },
	openLogin() {
      console.log('2222')
    },
    isAuth() {
        const hasToken = localStorage.getItem('user-token');
        return !!hasToken;
    },
    submitForm: function(formEl) {
      if (!this.ruleForm.login || !this.ruleForm.password) {
        errorMixin.methods.showError('error', this.$t('fillRequired'))
      }
      this.$refs.ruleFormRef.validate(valid => {
        if (valid) {
          this.getLogin()
        } else {
          return false
        }
      })
    },
    getLogin: function() {
      return Request.post('/auth/login', {
        email: this.ruleForm.login,
        password: this.ruleForm.password
      })
        .then(response => {
          this.$store.commit('AUTH_LOGIN', response.data)
          Request.defaults.headers.common['Authorization'] =
            'Bearer ' + localStorage.getItem('user-token')
          this.$router.push('/parts')
          this.$store.commit('section/SET_PAGE_LEVEL', 0)
        })
        .catch(function(error) {
          errorMixin.methods.showError('error', this.$t('wrongLogin'))
        })
    }
  },
  computed: {
    ...mapGetters({
      modificationID: 'modification/getModification_id',
      modelID: 'model/getModel_id'
    }), //
    ...mapState({
      currentComponent: state => state.diagnostic.testing.currentComponent,
      defectId: state => state.diagnostic.defectId,
      THROUGH_VIN: state => state.vinThrough.THROUGH_VIN,
      section: state => state.section.section
    }),
    ...mapGetters({
      panelDiagnostic: 'diagnostic/getDiagnosticData'
    }),
    ...mapState({
      activeLanguage: state => {
        return state.lang.activeLanguage
      }
    }),
    activeIndex() {
      return this.$i18n.locale == 'ru' ? '2-1' : '2-2'
    }
  },
  watch: {
    $route(to, from) {
      let section = to.path.split('/')[1]
      if (
        !['parts', 'standtime', 'flowcharts', 'emaps', 'diagnostic'].includes(
          section
        )
      ) {
        console.log('could not recognize default page', 'error')
      }
      if (section == 'flowcharts') {
        if (
          this.modificationID &&
          this.modelID &&
          !this.$route.params.flowchartId &&
          this.THROUGH_VIN.showInFlowchart
        ) {
          if (this.THROUGH_VIN.showInParts) {
            this.$router.push(
              '/flowcharts/models-' +
                this.modelID +
                '/modification-' +
                this.modificationID +
                '/'
            )
            this.$store.commit('section/SET_PAGE_LEVEL', 1)
          } else {
            this.$router.push('/flowcharts/search/flowcharts-list/')
            this.$store.commit('section/SET_PAGE_LEVEL', 1)
          }
        }
      }
      if (section == 'emaps') {
        if (
          this.modificationID &&
          this.modelID &&
          !this.$route.params.illustrationId
        ) {
          if (this.THROUGH_VIN && this.THROUGH_VIN.showInEmaps) {
            this.$router.push(
              '/emaps/models-' +
                this.modelID +
                '/modification-' +
                this.modificationID +
                '/'
            )
            this.$store.commit('section/SET_PAGE_LEVEL', 1)
          }
        }
      }
      if (section == 'diagnostic') {
        if (this.THROUGH_VIN && this.THROUGH_VIN.showInDiagnostic) {
          if (
            this.modificationID &&
            this.modelID &&
            !this.$route.params.illustrationId
          ) {
            this.$router.push(
              '/diagnostic/models-' +
                this.modelID +
                '/modification-' +
                this.modificationID +
                '/'
            )
            this.$store.commit('section/SET_PAGE_LEVEL', 1)
          }
        }
        if (this.defectId) {
          this.setPropDiagnostic({ meta: 'currentComponent', data: 'Session' })
          this.$router.push(
            '/diagnostic/models-' +
              this.modelID +
              '/modification-' +
              this.modificationID +
              '/'
          )
          this.$store.commit('section/SET_PAGE_LEVEL', 1)
        }
        if (this.$route.params.productModificationId) {
          this.hideBar = true
        } else {
          this.hideBar = false
        }
      }
    },
    section(newVal, oldVal) {
      this.selectedTab = newVal
      this.previousTab = oldVal
    }
  }
}
</script>
<style scoped>
.header_st0,
.header_st1 {
  fill: #014637;
}
.header_st1 {
  font-size: 8px;
  font-family: Arial;
  color: #014637;
  font-weight: 600;
  letter-spacing: -0.03em;
}
.header_st2 {
  font-size: 10px;
  font-family: Arial;
  fill: #014637;
  font-weight: 800;
  letter-spacing: -0.03em;
}
.uaz__header {
  display: flex;
  flex-direction: row;
  position: relative;
  width: 100%;
  height: 66px;
}
.uaz__logo_wrapper {
  width: 95px;

  z-index: 10;
  padding: 5px 0 5px 10px;
  height: 100%;
  background-color: #fff;
}
.uaz__logo_wrapper::after {
  content: '';
  width: 0;
  height: 0;
  top: 1px;
  position: absolute;
  border-style: solid;
  border-width: 0 20px 65px 0px;
  border-color: transparent transparent #ffffff transparent;
}

.uaz__logo_wrapper svg {
  position: relative;
  z-index: 9;
  width: 100%;
  height: 65px;
}
.uaz-header,
.uaz__icon-bar,
.uaz__icons-double {
  background-color: #013e2c;
}
.uaz__header__logo_part {
  padding: 5px 5px 4px 13px;
}
.uaz__header__logo_part img {
  height: 55px;
}
.uaz__header__logo_part::before {
  content: '';
  width: 0;
  height: 0;
  margin-left: -33px;
  top: 1px;
  position: absolute;
  border-style: solid;
  border-width: 0 0 65px 20px;
  border-color: transparent transparent #ffffff transparent;
}
.uaz__header__lang_button::after {
  position: absolute;
  top: -9px;
  left: 41px;
  right: 0;
  content: '^';
  font-family: cursive;
  font-size: 23px;
  color: #fff !important;
  transform: rotate(180deg);
  padding: 0 0 2px;
  pointer-events: none;
}
.uaz__header__doc_button::after {
  position: absolute;
  top: -9px;
  left: 71px;
  right: 0;
  content: '^';
  font-family: cursive;
  font-size: 23px;
  color: #fff !important;
  transform: rotate(180deg);
  padding: 0 0 2px;
  pointer-events: none;
}
.uaz__header___menu_part {
  display: flex;
  width: 230px;
  justify-content: flex-start;
}
.uaz__header___menu_part_en {
  width: 255px;
}

.uaz__header___menu_part div {
  line-height: 65px;
  color: white;
  font-size: 10px;
  font-weight: bold;
  margin-left: 14px;
}
.el-menu--horizontal .el-menu .el-menu-item {
  background: white !important;
  color: black;
}
.el-menu--popup {
  background: white !important;
}
.uaz__header___tab_part,
.uaz__header___flex_part,
.uaz__header___menu_part {
  background: #013e2c;
}
.uaz__header___flex_part {
  flex: auto;
}
.tab_wrapper {
  margin-left: 20px;
  position: relative;
  top: 45px;
}
.uaz__header__doc_button,
.uaz__header__lang_button {
  position: relative;
}
.uaz__subheader {
  height: 60px;
  padding: 1px 10px 0px;
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.uaz__bar_header {
  z-index: 99;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  margin-top: 19px;
}
.uaz__header__logout,
.uaz__logo_wrapper {
  cursor: pointer;
}
.search_block {
  display: flex;
}
#header-middle {
  display: flex;
  align-items: flex-start;
  /*margin-top: 19px;*/
  margin-top: 18.5px;
}

.uaz__subheader_diagnostic {
  width: 100%;
}
.uaz__subheader_diagnostic .search_block {
  width: 500px;
}
.uaz__subheader_diagnostic .uaz__bar_header {
  width: calc(100% - 490px);
}
.uaz__subheader_list,
.uaz__subheader_test,
.uaz__subheader_result,
.uaz__subheader_session,
.uaz__subheader_report {
  min-width: 1280px;
}
header {
  min-width: 1280px;
}
/*.uaz__subheader_list .search_block,
	.uaz__subheader_test .search_block,
	.uaz__subheader_result .search_block,
	.uaz__subheader_session .search_block,
	.uaz__subheader_report .search_block - Поиск - увеличивал, влиял на хедер {
		width: 1042px;
	}*/
.uaz__subheader_list .uaz__bar_header,
.uaz__subheader_test .uaz__bar_header,
.uaz__subheader_result .uaz__bar_header,
.uaz__subheader_session .uaz__bar_header,
.uaz__subheader_report .uaz__bar_header {
  width: calc(100% - 1042px);
}

.el-menu--horizontal ul {
  border-radius: 50%;
}
.el-menu--horizontal .submenu_select_option {
  font-size: 10px;
  font-family: Arial;
  color: #013e2c !important;
  height: 28px;
  cursor: pointer;
}
.el-menu--horizontal .submenu_select_option {
  padding-left: 20px;
}
.el-menu--horizontal .is-active.submenu_select_option {
  background-color: #cfdbd9 !important;
}
</style>
