<template>
  <div
    class="diagnostic-structure__pad diagnostic-algorithm__operation-headline"
  >
    <h2 class="diagnostic-structure__headline">
      {{ currentStep.defect_description }}
    </h2>
  </div>
  <div class="diagnostic-algorithm__operation-wrap">
    <div
      class="diagnostic-structure__pad diagnostic-algorithm__image"
      style="width: 50%"
    >
      <OnceImage :src="src" />
    </div>
    <div class="diagnostic-algorithm__description" style="width: 50%">
      <div style="position: relative; width: 100%; height: 100%">
        <div
          style="
            display: inline-block;
            vertical-align: bottom;
            width: 100%;
            margin-top: 0;
            margin-left: 0;
          "
        >
          <div
            class="diagnostic-algorithm__description-title diagnostic-algorithm__description-title--step"
          >
            {{ $t('step') }} {{ currentStep.defectItem_step }}
          </div>
          <div class="diagnostic-algorithm__description-title">
            {{ currentStep.diagnosticOperation_action }}
          </div>
          <div
            class="diagnostic-algorithm__description-title"
            v-html="currentStep.diagnosticOperation_description"
          />
          <div class="diagnostic-algorithm__description-title">
            {{ currentStep.diagnosticOperation_question }}
          </div>

          <div
            class="diagnostic-structure__pad diagnostic-algorithm__options"
            v-if="currentAnswers.length"
          >
            <div v-if="currentStep.diagnosticOperation_type === 'dynamic'">
              <TextInput
                :answers="currentAnswers"
                :value="value"
                :textChangeHandler="textChangeHandler"
                :isHistory="isHistory"
              />
            </div>
            <div v-else>
              <RadioInput
                v-for="answer in currentAnswers"
                :key="answer.defectItemRelation_id"
                :answer="answer"
                :value="value"
                :buttonClickHandler="buttonClickHandler"
                :isHistory="isHistory"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="diagnostic-algorithm__buttons" id="diagnostic_algorithm_buttons">
    <button
      type="button"
      class="uaz__btn uaz__btn-default uaz__btn-arrow"
      :disabled="previewDisabled"
      :class="{ 'uaz__btn-disabled': previewDisabled }"
      @click="handlePreview()"
    >
      ←
    </button>
    <button
      :disabled="!value"
      type="button"
      class="uaz__btn uaz__btn-default uaz__pull-right diagnostic-algorithm__button"
      :class="{ 'uaz__btn-disabled': !value }"
      @click="handleNext()"
    >
      {{ $t('onward') }}
    </button>
  </div>
</template>

<script>
import RadioInput from '@/components/common/UI/RadioInput.vue'
import OnceImage from '@/components/common/UI/OnceImage.vue'
import TextInput from '@/components/common/UI/TextInput.vue'
function sortAnswers(a, b) {
  if (a.linkText > b.linkText) {
    return 1
  }
  if (a.linkText < b.linkText) {
    return -1
  }
  return 0
}

export default {
  components: {
    RadioInput,
    TextInput,
    OnceImage
  },
  data() {
    return {
      currentAnswers: [],
      src: '',
      value: null
    }
  },
  props: [
    'currentStep',
    'next',
    'setProp',
    'preview',
    'previewDisabled',
    'addAnswers',
    'currentIndex',
    'answers',
    'currentFurther',
    'isHistory'
  ],
  methods: {
    buttonClickHandler(answer) {
      this.value = answer.linkText
      this.setProp({ meta: 'selectedAnswer', data: answer })
      this.addAnswers(this.value)
    },
    textChangeHandler(answer, value) {
      console.log('textChangeHandler selectedAnswer', { answer, value })
      this.value = value
      this.setProp({ meta: 'selectedAnswer', data: answer })
      this.addAnswers(this.value)
    },

    async handleNext() {
      // TODO why was helping async await?
      await this.next()
      const existAnswer = this.answers[this.currentFurther.defectItem_step][
        this.currentIndex
      ]
      this.value = existAnswer ? existAnswer : ''
    },
    async handlePreview() {
      // TODO why was helping async await ?
      await this.preview()

      this.value = this.answers[this.currentFurther.defectItem_step][
        this.currentIndex
      ]
    }
  },
  watch: {},
  mounted() {
    const answers = this.currentStep.answer
    console.log('DiagnosticQuestion', { answers })
    this.currentAnswers = answers.sort(sortAnswers)
  },
  updated: function() {
    // TODO to will be do not mutation
    const answers = this.currentStep.answer
    this.currentAnswers = answers.sort(sortAnswers)
    this.src = `https://elis.uaz.ru/${this.currentStep.diagnosticOperation_operation_image}`
  },
  beforeUpdated: function() {}
}
</script>
<style>
.diagnostic-structure__pad {
  padding: 5px;
  position: relative;
}
.diagnostic-algorithm__operation-headline {
  height: 50px;
}
.diagnostic-structure__headline {
  margin: 0;
}
.diagnostic-algorithm__operation-wrap {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-flow: column wrap;
  flex-flow: column wrap;
  height: calc(100% - 130px);
  position: relative;
  overflow: hidden;
}
.diagnostic-algorithm__image {
  -ms-flex-pack: center;
  justify-content: center;
}
.diagnostic-algorithm__image img {
  max-width: 100%;
  max-height: 100%;
}
.diagnostic-algorithm__description {
  display: -ms-flexbox;
  display: flex;
  height: 100%;
  -ms-flex-flow: column nowrap;
  flex-flow: column nowrap;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding-top: 5px;
  position: relative;
  max-height: 100%;
}
.diagnostic-algorithm__description span,
.diagnostic-algorithm__description p {
  font-size: 10px;
  font-family: Arial !important;
}
.diagnostic-algorithm__description td {
  border: 1px solid;
  line-height: 6px;
}
.diagnostic-algorithm__description-title {
  width: 100%;
  padding: 0 5px;
  white-space: pre-wrap;
  clear: both;
  margin-bottom: 14px;
}
.diagnostic-algorithm__description-title--step {
  font-weight: 400;
}
.diagnostic-algorithm__buttons {
  clear: both;
  width: 100%;
  position: relative;
  overflow: hidden;
}
.uaz__pull-right {
  float: right !important;
}

.diagnostic-algorithm__buttons .uaz__btn-default {
  cursor: pointer;
  border: none;
  border-radius: 3px;
  min-width: 135px;
  height: 20px;
  color: #fff;
  background-color: #013e2c;
  font-weight: 700;
  font-size: 10px;
  text-transform: none;
  vertical-align: bottom;
  height: 34px;
  margin: 4px;
}
.diagnostic-algorithm__buttons .uaz__btn-arrow {
  background-color: transparent;
  border: 1px solid #013e2c;
  color: #013e2c;
  min-width: 0;
  font-size: 20px;
  margin-left: 50%;
}
.uaz__btn-disabled {
  color: #ccc !important;
  cursor: default !important;
  border: 1px solid #ccc !important;
}
</style>
