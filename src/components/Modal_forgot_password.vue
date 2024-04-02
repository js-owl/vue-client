<template>
  <a class="uaz-forgot" @click="showModal">
    {{ $t('passwordForget') }}
  </a>

  <!-- If the option changed modal component the name
  <MyModal>
  -->
  <Modal v-model="isShow" :close="closeModal">
    <div class="modal">
      <div class="uaz-card">
        <section class="uaz-wrapper uaz-recovery">
          <div class="uaz-card-registration">
            <label>{{ $t('passwordRecovery') }}</label>
            <span @click="closeModal" class="uaz-modal-close">x</span>
          </div>
          <div class="uaz-modal-form uaz-indent-card">
            <h2>{{ $t('elisRecovery') }}</h2>
            <div class="uaz-support-description">
              {{ $t('emailPasswordRecovery') }}
            </div>
          </div>
          <div class="uaz-card-indent uaz-indent-card">
            <label>{{ $t('email') }}:</label>
            <input placeholder="" v-model="user_email" type="text" />
          </div>
          <div class="uaz-card-button">
            <button
              @click="restorePassword"
              class="uaz-card-submit uaz-card-close"
            >
              {{ $t('send').toUpperCase() }}
            </button>
          </div>
        </section>
      </div>
    </div>
  </Modal>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { Request } from '@/services/axios.service'
import { errorMixin } from '@/plugins/error.plugin'
export default defineComponent({
  setup() {
    const isShow = ref(false)
    const user_email = ref('')

    function showModal() {
      isShow.value = true
    }

    function closeModal() {
      isShow.value = false
    }
    function restorePassword() {
      var dataToSend = new FormData()
      console.log(11)
      if (this.user_email) {
        return Request.post('/user/restorePassword', {
          email: this.user_email
        })
          .then(response => {})
          .catch(function(error) {
            errorMixin.methods.showError(error.response.data.message)
          })
      }
    }
    return {
      restorePassword,
      isShow,
      showModal,
      closeModal,
      user_email
    }
  }
})
</script>

<style scoped>
body {
  font-family: Arial, Helvetica, sans-serif;
}
.modal {
  width: 600px;
  box-sizing: border-box;
  background-color: #fff;
  font-size: 20px;
  text-align: center;
}
.uaz-header {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 25px;
  width: 100%;
  background-color: #013e2c;
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
  display: inline-block;
  width: auto;
  color: #fff;
  font-size: 12px;
  text-decoration: none;
  font-family: Arial, sans-serif;
  font-weight: normal;
}
.uaz-language:hover {
  color: #cfdbd9;
}
.uaz-language.active {
  text-decoration: underline !important;
}

.uaz-login-content .uaz-info {
  color: #fff;
}
.uaz-login-content .uaz-info .h1 {
  text-transform: uppercase;
  font-size: 35px;
  font-weight: 600;
}
.uaz-login-content .uaz-info .p {
  font-size: 13px;
  line-height: 1.6;
  font-weight: normal;
}
.uaz-login-content a {
  text-decoration: inherit;
  color: inherit;
}
.uaz-login-content a:hover {
  text-decoration: inherit;
}
.uaz-login-content {
  font-family: Arial, sans-serif;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 900px;
  background: url(../assets/login-bg.jpg) no-repeat top;
  background-size: 1855px 370px;
  margin-top: 125px;
}
.uaz-login-content .uaz-container {
  display: block;
  position: relative;
  width: 530px;
  height: 679px;
  margin: auto;
  right: 310px;
}
.uaz-indent {
  position: absolute;
  top: 0px;
  padding: 35px;
}
.uaz-green {
  position: relative;
  width: 320px;
  height: 370px;
  padding: 35px;
  background-color: #004735;
  opacity: 0.4;
}
.uaz-login-content .uaz-connection {
  position: absolute;
  transition: all 0.7s;
  margin-top: 15px;
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
  display: block;
  margin: 7px 0 1px;
  padding: 3px 0px 9px;
  font-size: 10px;
  font-weight: 600;
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
  width: 100%;
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
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  padding: 0 0 0 6px;
  margin-top: 3px;
}
.uaz-registration a,
.uaz-registration button {
  cursor: pointer !important;
  color: #fff;
  width: 97px;
}
.uaz-registration a {
  border-color: transparent;
  font-size: 13px;
  padding: 5px 60px 5px 0px;
  font-weight: normal;
}
.uaz-registration button {
  background-color: transparent;
  border: 1px solid #fff;
  padding: 5px 30px;
  margin-top: 3px;
  float: right;
}

.uaz-card {
  text-align: left;
}
.uaz-wrapper {
  background: white;
  box-shadow: 0 0 10px #000;
  position: relative;
  border-radius: 3px;
  display: block;
  padding: 67px 0px;
  width: 650px;
  font-size: 12px;
  line-height: 25px;
  font-weight: 500;
  font-family: Arial, sans-serif;
}
.uaz-wrapper .uaz-check {
  padding: 10px 0;
  margin-bottom: 5px;
}
.uaz-wrapper .uaz-form-checkbox {
  height: 30px;
  margin: 8px 0 2px;
}
.uaz-wrapper .uaz-card-checkbox {
  position: absolute;
  z-index: -1;
  opacity: 0;
  margin: 10px 0 0 20px;
}
.uaz-wrapper .uaz-card-checkbox + label {
  position: relative;
  padding: 0 0 0 60px;
  cursor: pointer;
  font-size: 10px;
}
.uaz-wrapper .uaz-card-checkbox + label:before {
  content: '';
  position: absolute;
  top: -7px;
  left: 0;
  width: 50px;
  height: 26px;
  border-radius: 13px;
  background: #cdd1da;
  box-shadow: inset 0 2px 3px rgb(0 0 0 / 20%);
  transition: 0.2s;
}
.uaz-wrapper .uaz-form-checkbox a {
  text-decoration: underline;
}
.uaz-wrapper .uaz-pointer {
  cursor: pointer;
}
.uaz-wrapper .uaz-card-checkbox + label:after {
  content: '';
  position: absolute;
  top: -5px;
  left: 2px;
  width: 22px;
  height: 22px;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 2px 5px rgb(0 0 0 / 30%);
  transition: 0.2s;
}
.uaz-wrapper .uaz-check {
  padding: 10px 0 60px;
}
.uaz-wrapper .uaz-form-checkbox a {
  cursor: pointer;
  text-decoration: underline;
}
.uaz-wrapper .uaz-form-checkbox a:hover {
  text-decoration: none;
}

@media screen and (min-width: 530px) {
  .uaz-card {
    width: 75%;
  }
}
@media screen and (min-width: 600px) {
  .uaz-card {
    max-width: 400px;
    width: 65%;
  }
}
@media screen and (max-width: 599px) {
  .uaz-card.in-flight {
    border-radius: 0;
    max-width: 100%;
    top: 0 !important;
    left: 0 !important;
  }
}
@media screen and (min-width: 600px) {
  .uaz-card.in-flight {
    left: calc((100vw - 460px) / 2) !important;
    max-width: 460px !important;
  }
}
@media screen and (min-width: 730px) {
  .uaz-card {
    max-width: 400px;
    width: 40%;
  }
  .uaz-card.in-flight {
    left: calc((100vw - 700px) / 2) !important;
    max-width: 700px !important;
  }
}
@media screen and (min-width: 1000px) {
  .uaz-card {
    width: 400px;
  }
  .uaz-card.xl {
    width: 600px;
    max-width: 600px;
  }
  .uaz-card.xl.active {
    width: 100%;
    max-width: 700px;
  }
}
.uaz-card-registration {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 25px;
  background-color: #013e2c;
  color: #fff;
  padding: 0 5px;
  line-height: 23px;
  text-align: center;
}
.uaz-card-registration {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 25px;
  background-color: #013e2c;
  color: #fff;
  padding: 0 5px;
  line-height: 23px;
  text-align: center;
}
.uaz-card-registration label {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 10px;
}
.uaz-modal-close {
  font-size: 20px;
  position: absolute;
  right: 10px;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  cursor: pointer;
}

.uaz-modal-close:hover {
  color: #cfdbd9;
}
.uaz-card-indent label {
  display: inline-block;
  width: 153px;
  /*padding: 5px 0;*/
  font-size: 12px;
}
.uaz-card-indent .uaz__text-danger {
  color: #a94442;
}
.uaz-card-indent input {
  width: 429px;
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
.uaz-card-indent input:focus {
  border-color: #013e2c;
  outline: 0;
  box-shadow: inset 0 1px 1px rgb(0 0 0 / 8%), 0 0 8px #cfdbd9;
}
.uaz-indent-card {
  padding-left: 24px;
  font-size: 10px;
}
.uaz-card-button {
  padding-right: 14px;
  border-top: 1px solid #eee;
}
.uaz-card-submit {
  cursor: pointer;
  border: none;
  border-radius: 3px;
  min-width: 135px;
  color: #fff;
  background-color: #013e2c;
  font: 400 13.3333px Arial;
  font-size: 10px;
  height: 30px;
  padding: 0 14px;
  float: right;
  margin: 10px;
}

.uaz-processing {
  width: 683px;
}
.uaz-processing .uaz-card-button {
  padding: 10px 14px;
}
.uaz-support-form {
  padding: 50px 20px;
}
.uaz-modal-body {
  height: 680px;
  padding: 10px 24px 1px 0;
  overflow: auto;
}
@media (min-width: 768px) {
  .uaz-col-sm-12 {
    width: 100%;
    float: left;
  }
}
.uaz__col-sm-12 {
  position: relative;
  min-height: 1px;
  padding-right: 5px;
  padding-left: 5px;
}
.uaz-col-sm-12 p {
  text-align: left;
  font-size: 10px;
  font-weight: 600;
  line-height: normal;
}
.uaz-card-close {
  height: 20px;
}

.uaz-recovery {
  padding: 35px 0 50px;
}
.uaz-recovery .uaz-card-indent {
  padding: 0 0 110px 24px;
}
.uaz-modal-form h2 {
  font-size: 2em;
}
.uaz-support-description {
  font-size: 12px;
  font-weight: 400;
  margin: 10px 0;
}
</style>
