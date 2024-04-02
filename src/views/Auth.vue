<template>
  <div class="uaz-header">
    <div class="uaz__header-info"></div>
    <div class="uaz-header-language">
      <span
        @click="setLocale('RU')"
        :class="['uaz-language', { active: this.$i18n.locale == 'ru' }]"
      >
        RU
      </span>
      <span
        @click="setLocale('EN')"
        :class="['uaz-language', { active: this.$i18n.locale == 'en' }]"
      >
        EN
      </span>
    </div>
  </div>

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
</template>
<script>
const axios = require('axios')
import { Request } from '@/services/axios.service'
import Modal_reg from '@/components/Modal_reg.vue'
import Modal_forgot_password from '@/components/Modal_forgot_password.vue'
import { errorMixin } from '@/plugins/error.plugin'
import Password_box from '@/components/Password_box.vue'
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'
export default {
  mixins: [errorMixin],
  name: 'Register',
  data() {
    return {
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
    'Modal-reg': Modal_reg,
    'Modal-forgot-password': Modal_forgot_password,
    'password-box': Password_box
  },
  computed: {
    ...mapState({
      activeLanguage: state => {
        return state.lang.activeLanguage
      }
    })
  },
  mounted: function() {
    if (localStorage.getItem('lang') === null) {
      localStorage.setItem('lang', 'RU')
    }
    this.$i18n.locale = localStorage.getItem('lang').toLowerCase()
    this.setLocale(this.$i18n.locale)
  },
  methods: {
    setLocale(locale) {
      this.$i18n.locale = locale.toLowerCase()
      this.$store.commit('lang/SET_ACTIVE_LANGUAGE', locale)
      window.document.title = this.$t('documentTitle')
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
  }
}
</script>
<style>
body {
  overflow: hidden;
}
.uaz_content_container_auth {
  padding: 0px;
}
.uaz-header {
  /*position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;*/
  height: 25px;
  width: 100%;
  background-color: #013e2c;
}
.uaz__header-info {
  width: 90%;
  max-width: 1235px;
  display: inline-block;
}
.uaz-header-language {
  /*float: right;
  width: 90px;*/
  padding: 5px 0;
  margin: 0 15px 0 25px;

  display: inline-block;
  margin-right: 15px;
  width: auto;
  margin-left: 25px;
}
.uaz-language {
  margin-right: 6px;
  display: inline-block;
  width: auto;
  color: #fff;
  font-size: 12px;
  text-decoration: none;
  font-family: Arial, sans-serif;
  font-weight: normal;
  cursor: pointer;
}
.uaz-language:hover {
  color: #cfdbd9;
  text-decoration: underline !important;
}
.uaz-language.active {
  text-decoration: underline !important;
}

.uaz-login-content .uaz-info {
  margin-bottom: 25px;
}
.uaz-login-content .uaz-info .h1 {
  /*color: #fff;*/
  text-transform: uppercase;
  font-size: 35px;
  font-weight: 600;
}
.uaz-login-content .uaz-info .p {
  /*color: #fff;
  line-height: 1.6;
  font-weight: normal;*/
  font-size: 13px;
  font-weight: 100;
}
.uaz-login-content a {
  text-decoration: inherit;
  color: inherit;
}
.uaz-login-content a:hover {
  text-decoration: inherit;
}
.uaz-login-content {
  /*font-family: Arial,sans-serif;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 900px;
  background: url(../assets/login-bg.jpg) no-repeat top;
  background-size: 1855px 370px;
  margin-top: 125px;*/
  width: 100%;
  background-image: url(/img/login-bg.9630b7b0.jpg);
  background-size: auto 100%;
  background-position: center top;
  background-repeat: no-repeat;
  margin-top: 100px;

  max-width: 2200px;
  min-width: 320px;
  width: auto;
}
.uaz-login-content .uaz-container {
  /*display: block;
  position: relative;
  width: 530px;
  height: 679px;
  margin: auto;
  right: 310px;*/
  position: relative;
  width: 100%;
  min-height: 370px;
}
.uaz-indent {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 330px;
  color: #fff;
  padding: 35px;
  left: 20%;
}
.req__container {
  min-height: 18px;
}
.uaz-green {
  /*position: relative;
  width: 320px;
  height: 370px;*/
  position: absolute;
  top: 0;
  bottom: 0;
  width: 330px;
  color: #fff;
  padding: 35px;
  left: 20%;
  background-color: #004735;
  opacity: 0.4;
}
.uaz-login-content .uaz-connection {
  /*position: absolute;
  transition: all 0.7s;
  margin-top: 15px;*/
}
.uaz-login-content .uaz-connection span {
  font-size: 10px;
  margin-bottom: 0;
  text-align: center;
  color: #fff;
}
.uaz-login-content .uaz-connection span:hover {
  opacity: 0.8;
  transition: all 0.1s ease-in;
}
.uaz-login-content label {
  /*display: block;
  padding: 3px 0px 9px;*/
  margin: 7px 0 1px;
  font-size: 10px;
  font-weight: 600;
}
.uaz-connection .el-form-item {
  /*margin-bottom: 0px;*/
  display: inline-block;
  margin-bottom: 4px;
}
.el-form-item__label {
  text-align: left;
  line-height: 2.8;
}

.uaz-connection .el-form-item__content {
  line-height: 0px;
}
.uaz-login-content .uaz-connection label {
  color: #fff;
}
.uaz-login-content .uaz-forgot {
  display: block;
  font-family: Arial, sans-serif;
  font-size: 10px;
  cursor: pointer;
  margin-top: 5px;
  color: #fff;
}
.uaz-login-content .uaz-forgot:hover,
.uaz-login-content .uaz-registration a:hover {
  text-decoration: underline;
}
.uaz-login-content .uaz-connection input {
  color: #fff;
  background-color: transparent;
  border: 1px solid #fff;
  font-weight: 100;
  font-size: 16px;
  padding: 2px 10px;
  height: 25px;
  width: 260px;
}
.uaz-login-content .uaz-form {
  margin-top: 11px;
}
.uaz-login-content .uaz-enregistrer input {
  display: block;
  width: 100%;
  height: 25px;
  padding: 0 12px;
  font-size: 10px;
  line-height: 1.42857143;
  color: #555;
  background-color: #fff;
  background-image: none;
  border: 1px solid #b8bdc0;
  border-radius: 3px;
}
.uaz-login-content input p {
  color: #fff;
  opacity: 1;
}
.uaz-login-content input.submit {
  height: 30px;
  padding-left: 14px;
  padding-right: 14px;
  cursor: pointer;
  border: none;
  border-radius: 3px;
  min-width: 135px;
  height: 20px;
  color: #fff;
  background-color: #013e2c;
  font-weight: 700;
  font-size: 10px;
}
.uaz-login-content .uaz-check label {
  float: left;
  width: 10%;
  margin-left: 5%;
}

.uaz-login-content .uaz-enregistrer {
  position: absolute;
  padding: 15% 13%;
  width: 74%;
  right: 0px;
  transition: all 0.7s;
  margin-top: 10px;
}
.uaz-login-content .active-section {
  border: 1px solid black;
}
.uaz-login-content .remove-section {
  margin-top: 400px;
  border: 1px solid black;
}
.uaz-registration {
  /*padding: 0 0 0 6px;
  margin-top: 3px;*/
  display: -ms-flexbox;
  display: flex;
  -ms-flex-flow: row nowrap;
  flex-flow: row nowrap;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding-top: 30px;
  margin-bottom: 5px;
}
.uaz-registration a,
.uaz-registration button {
  cursor: pointer !important;
  color: #fff;
  width: 97px;
  border-radius: 0;
  min-height: 28px;
  /*display: inline-block;*/
}
.uaz-login-content .uaz-connection span {
  font-size: 13px;
}
.uaz-registration a {
  border-color: transparent;
  font-size: 13px;
  /*padding: 5px 60px 5px 0px;*/
  padding: 15px 0px 0px 9px;
  font-weight: normal;
}
.uaz-registration button {
  background-color: transparent;
  border: 1px solid #fff;
  padding: 5px 30px;
  margin-top: 9px;
  float: right;
}
.uaz-registration button:active,
.uaz-registration button:focus,
.uaz-registration button:hover {
  background-color: #cfdbd9 !important;
}
.input__empty_error {
  color: red !important;
  font-weight: bold;
}
.input__password_error {
  font-size: 12px;
  font-weight: normal;
}
</style>
