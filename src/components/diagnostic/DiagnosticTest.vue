<template>
  <DiagnosticQuestion
    :setProp="setProp"
    :currentStep="currentStep"
    :next="next"
    :preview="preview"
    :previewDisabled="previewDisabled"
    :addAnswers="addAnswers"
    :currentIndex="currentIndex"
    :answers="answers"
    :currentFurther="currentFurther"
    :isHistory="isHistory"
  />
</template>

<script>
import DiagnosticQuestion from "./DiagnosticQuestion.vue";
export default {
  components: {
    DiagnosticQuestion,
  },

  props: [
    "setProp",
    "currentFurther",
    "currentStep",
    "next",
    "preview",
    "previewDisabled",
    "addAnswers",
    "currentIndex",
    "answers",
    "isHistory",
  ],
  data() {
    return {
      previewStep: null,
      nextStep: null,
    };
  },
  methods: {},
  watch: {},
  mounted() {},
};
</script>