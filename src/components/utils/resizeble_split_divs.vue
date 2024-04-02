<template>
<div @mousedown="resize" @mouseup="finish" id="dragMe" class="uaz_resizer"></div>
</template>
<script>
export default {
  props: {
    
  },
  data() {
      return {
        
      }
  },
  computed: {
   
  },
  methods: {
    resize: function(e){
      console.log('start');
    },
    finish: function(e){
      console.log('finish');
    },
  }
};
</script>
<style scoped>
.uaz_resizer{
  width: 10px;
  margin-top: 18px;
  margin-right: 0px;
  cursor: ew-resize;
}
.uaz_resizer:hover{
  background: #7fa099; 
}
</style>