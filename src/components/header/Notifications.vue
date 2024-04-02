<template>
  <div class="uaz__bell">
    <el-drawer
      v-model="modelValue"
      :title="$t('notifications')"
      direction="rtl"
      size="23%"
      @close="handleClose"
    >
      <div
        :class="[
          'nav',
          { scroll_load_next: currentMessagePage < lastMessagePage }
        ]"
      >
        <ul class="admin-menu">
          <li
            v-for="(item, messageIndex) in messages"
            :key="item.message_id"
            :label="item.message_title"
            :class="[{ active: !messages[messageIndex].read }]"
          >
            <div class="border">
              <!--Заголовок-->
              <span>{{ item.message_title }}</span>
              <div class="new_description">
                <!--Краткое содержание-->
                <div>{{ item.message_shortDescription }}</div>
                <!--Дата-->
                <div class="date_detail">
                  <span class="new_date">
                    {{ localeDate(item.message_datePublish) }}
                  </span>
                  <!--Подробнее-->
                  <a
                    class="detail"
                    @click="getMessage(item.message_id, messageIndex)"
                  >
                    {{ $t('detail') }}
                  </a>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div
        class="block_show_all"
        v-show="currentMessagePage < lastMessagePage"
        @click="loadNext"
      >
        <!--Показать все-->
        <a class="show_all">
          {{ $t('showAll') }}
        </a>
      </div>
    </el-drawer>
  </div>
  <!-- Modal window -->
  <el-dialog
    v-model="isModalOpen"
    width="80%"
    center
    custom-class="uaz__modal uaz__modal-sm uaz__bell_dialog"
    :title="$t('notification')"
  >
    <div class="chr-grid-default">
      <h3>{{ message.message_title }}</h3>
      <p class="short_description">{{ message.message_shortDescription }}</p>
      <p class="ck-content" v-html="message.message_description"></p>
    </div>
  </el-dialog>
</template>
<script>
import { Request } from '@/services/axios.service'

export default {
  props: {
    modelValue: Boolean
  },
  emits: ['update:modelValue', 'emitUnReadMessage'],
  data() {
    return {
      message: {},
      messages: [],
      currentMessagePage: 1,
      lastMessagePage: 1,
      isModalOpen: false,
      countUnReadMessage: 0,
      user_id: JSON.parse(localStorage.getItem('user-data')).user_id,
      role_id: JSON.parse(localStorage.getItem('user-data')).role_id
    }
  },
  mounted() {
    this.getMessages()
  },
  methods: {
    async getMessages() {
      try {
        const res = await Request.get(`message/`, {
          params: {
            user_id: this.user_id,
            role_id: this.role_id,
            page: this.currentMessagePage
          }
        })
        this.lastMessagePage = res.data.last_page
        this.messages = res.data.data
        this.getCountUnReadMessage()
      } catch (error) {
        console.error('getMessages :', error.response)
      }
    },
    getCountUnReadMessage() {
      Request.get(`message/countUnread/`, {
        params: { user_id: this.user_id, role_id: this.role_id }
      })
        .then(response => {
          this.countUnReadMessage = response.data.c_m
        })
        .catch(function(error) {
          console.log('getCountUnReadMessage error:', error.response)
        })
    },
    getMessage(id, index) {
      Request.get(`message/` + id, {
        params: { user_id: this.user_id, role_id: this.role_id }
      })
        .then(response => {
          this.message = response.data
          this.isModalOpen = true

          if (!this.messages[index].read) {
            this.countUnReadMessage = this.countUnReadMessage - 1
            this.messages[index].read = true
          }
          this.$emit('emitUnReadMessage', this.countUnReadMessage)
        })
        .catch(function(error) {
          console.log('getMessage error:', error.response)
        })
    },
    loadNext() {
      this.currentMessagePage = this.currentMessagePage + 1
      Request.get(`message/`, {
        params: { page: this.currentMessagePage }
      })
        .then(response => {
          this.messages = [...this.messages, ...response.data.data]
        })
        .catch(function(error) {
          console.log('getMessages error:', error.response.statusText)
        })
    },
    localeDate(vdate) {
      return (
        new Date(vdate).toLocaleDateString() +
        ' ' +
        new Date(vdate).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      )
    },
    handleClose() {
      this.$emit('update:modelValue', false)
    }
  }
}
</script>
<style scoped>
.active .border {
  border-left: 4px solid #013e2c;
}
.border {
  padding: 0 10px 0 20px !important;
  border-left: 4px solid #ffffff;
}
/*контент*/
.ck-content,
.ck-content strong,
.ck-content b,
.ck-content ol,
.ck-content li,
.ck-content table {
  font-size: 14px;
}
.ck-content .h2,
.ck-content h2 {
  font-size: 30px;
}
.ck-content .h3,
.ck-content h3 {
  font-size: 24px;
}
.ck-content .h4,
.ck-content h4 {
  font-size: 18px;
}
.chr-grid-default h3 {
  font-size: 1.5rem;
  line-height: 2rem;
  letter-spacing: -0.25px;
  margin: 8px 0 16px;
  color: #000000;
}
.chr-grid-default p {
  font-size: 1rem;
  line-height: 1.75rem;
  color: #000000;
  font-family: 'Roboto', sans-serif;
  letter-spacing: 0.1px;
  font-weight: 100;
}
.short_description {
  font-size: 16px !important;
  font-weight: bold !important;
  line-height: 1.4rem;
}
</style>
