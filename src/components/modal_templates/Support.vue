<template>
  <div>
    <Modal
      :hideOk="true"
      width="675px"
      :open="modelValue"
      :headModal="$t('supportDesk').toUpperCase()"
      :confirmClick="handleConfirm"
      :cancelClick="handleCancel"
      submitButtonName="OK"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        hide-required-asterisk
        label-width="120px"
        class="demo-ruleForm form_message"
        ref="ruleFormRef2"
      >
        <el-form-item
          class="user_lname"
          :label="$t('nameYour')"
          prop="user_lname"
        >
          <el-input
            v-model="ruleForm.user_lname"
            placeholder=""
            type="text"
          /><!--disabled-->
        </el-form-item>
        <el-form-item class="user_email" label="Email" prop="user_email">
          <el-input
            disabled
            v-model="ruleForm.user_email"
            placeholder=""
            type="text"
          />
        </el-form-item>
        <el-form-item
          class="user_message"
          :label="$t('message')"
          prop="message"
        >
          <el-input v-model="ruleForm.message" type="textarea"></el-input>
        </el-form-item>
        <el-form-item
          class="form_upload"
          :label="this.$t('fileJoin')"
          prop="file"
        >
          <el-upload
            class="upload-demo"
            action="https://v2.elis.uaz.ru/api/files/upload"
            multiple
            list-type="picture"
            :headers="HeadersForUpload"
            :limit="10"
            :on-change="handleChange"
            :on-success="handleImage"
            :before-upload="beforeImageUpload"
          >
            <el-button type="Default" class="el-button-upload">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="17"
                viewBox="0 0 20 17"
              >
                <path
                  d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"
                ></path>
              </svg>
              {{ $t('download') }}
            </el-button>
            <template #tip>
              <div class="el-upload__tip">
                {{ $t('fileMax10') }}
              </div>
            </template>
          </el-upload>
        </el-form-item>

        <el-form-item class="user_submit">
          <el-button @click="submitForm(ruleFormRef2)" class="uaz-card-submit">
            {{ $t('send') }}
          </el-button>
        </el-form-item>
      </el-form>
    </Modal>
  </div>
</template>
<script>
import { Request } from '@/services/axios.service'
import Modal from '@/components/diagnostic/Modal.vue'
import { modificationNameFormatter } from '@/components/utils/helpers'
import { ElMessage } from 'element-plus'
import { mapState } from 'vuex'
export default {
  props: {
    modelValue: Boolean,
    text: String
  },
  data() {
    return {
      ruleFormRef2: Object.assign({}, this.ruleForm),
      userData: {},
      id: this.modelValue ? true : false,
      fileList: [],
      HeadersForUpload: {},
      ruleForm: {
        user_lname: '',
        user_email: '',
        message: '',
        file: ''
      },
      rules: {
        user_lname: [
          {
            required: true,
            message: this.$t('fillFIO'),
            trigger: 'change'
          }
        ],
        file: [
          {
            message: this.$t('fillFile'),
            trigger: 'change'
          }
        ],
        user_email: [
          {
            type: 'email',
            required: true,
            message: this.$t('fillEmail'),
            trigger: 'change'
          }
        ],
        message: [
          {
            required: true,
            message: this.$t('fillMessage'),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted() {
    if (localStorage.getItem('user-data')) {
      this.userData = JSON.parse(localStorage.getItem('user-data'))
      this.ruleForm.user_lname = this.getFullName(
        this.userData.lname,
        this.userData.fname,
        this.userData.mname
      )
      this.ruleForm.user_email = this.userData.email
    }
    this.HeadersForUpload = { Authorization: 'Bearer  ' + this.token }
  },
  computed: {
    ...mapState({
      token: state => state.authToken
    })
  },
  methods: {
    formatDate: function(val) {
      let res = val.substring(0, 10)
      res = res.split('-')
      res = res[2] + '.' + res[1] + '.' + res[0]
      return res
    },
    beforeImageUpload: function(rawFile) {
      if (rawFile.type !== 'image/jpeg') {
        ElMessage.error(this.$t('fileImg'))
        return false
      } else if (rawFile.size / 1024 / 1024 > 10) {
        ElMessage.error(this.$t('fileLess10'))
        return false
      }
      return true
    },
    submitForm: function() {
      this.$refs.ruleFormRef2.validate(valid => {
        if (valid) {
          Request.post('/emails', {
            email_files: this.fileList,
            type: 'support',
            name: this.ruleForm.user_lname,
            email: this.ruleForm.user_email,
            email_message: this.ruleForm.message
          }).then(response => {
            this.message = ''
          })
          this.$emit('update:modelValue', false)
          this.id = 0
        } else {
          return false
        }
      })
    },
    handleConfirm: function() {
      this.$emit('update:modelValue', false)
      this.id = 0
      if (this.redirectAfterConfim) {
        this.$router.push(this.redirectAfterConfim)
        this.$store.commit('section/SET_PAGE_LEVEL', 2)
      }
    },
    //if null - make invisible
    getFullName: function(lname, fname, mname) {
      if (lname === null) {
        lname = ''
      }
      if (fname === null) {
        fname = ''
      }
      if (mname === null) {
        mname = ''
      }
      let res = lname + ' ' + fname + ' ' + mname
      return res
    },
    handleCancel: function() {
      this.$emit('update:modelValue', false)
      this.id = 0
    },
    handleChange: function(file, fileList) {},
    handleImage: function(file) {
      this.fileList.push(file.data)
    },
    formatName: function(val) {
      return modificationNameFormatter(val)
    }
  },
  components: {
    Modal
  },
  watch: {
    modelValue(newVal, oldVal) {
      //   this.getData(newVal);
    },

    token(newVal, oldVal) {
      this.token = newVal
    },
    HeadersForUpload(newVal, oldVal) {
      this.HeadersForUpload = newVal
    }
  }
}
</script>
<style scoped>
.vin-modal-wrapper {
  width: 600px;
  padding: 25px;
  font-size: 13px;
}
.vin-modal-value {
  font-weight: 100;
}
.vin-modal-row {
  display: flex;
  height: 30px;
}
.vin-modal-label {
  width: 160px;
}
.vin-modal-additional-block {
  display: flex;
  align-content: space-around;
  align-items: center;
  padding-bottom: 10px;
}
.vin-modal-options {
  text-transform: uppercase;
}
.vin-modal-alternative-heading {
  font-size: 14px;
  text-align: center;
  padding: 0px 0 15px 0;
  font-weight: 600;
}
.alternative-disclaimer {
  font-style: italic;
  font-weight: 100;
  font-size: 13px;
}
.demo-ruleForm {
  padding: 50px 20px;
}
.user_message label:before {
  content: '*';
  color: red;
  margin-right: 4px;
}
</style>
