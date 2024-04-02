<template>
  <div class="uaz uaz_content_container uaz_content_container_auth">
    <router-view />
  </div>
</template>
<script>
export default {
  mounted() {
    console.log('AuthLayout')
  }
}
</script>
<style lang="less">
.uaz {
  font-size: 10px;
  font-family: Arial;
  margin: 0;
}
.uaz_content_container {
  padding: 4px 10px 13px;
  min-width: 1280px;
}
</style>
