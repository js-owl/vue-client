<template>
  <div id="errorBlock"></div>
  <component :is="$route.meta.layout"></component>
</template>
<script>
import Auth from '@/layouts/AuthLayout'
import Default from '@/layouts/DefaultLayout'
export default {
  name: 'App',
  components: { Auth, Default }
}
</script>
<style lang="less">
.uaz_parts_container {
  display: flex;
  font-family: Arial;
  font-size: 10px;
  font-weight: 600;
}
.uaz_message {
  position: absolute;
  text-align: center;
  top: 0;
  height: 65px;
  width: 100%;
  background: #dd514c;
  line-height: 46px;
  color: white;
  margin: 0;
  z-index: 100;
  padding: 0;
  left: 0;
  font-size: 14px;
  font-family: arial, sans-serif;
  font-weight: normal;
}
.uaz_message__warning,
.uaz_message__error {
  background: #0e90d2;
  height: 47px;
}
.uaz_message__danger {
  background: #fb0000;
}
body {
  margin: 0;
  padding: 0;
  font-family: Arial, Helvetica, sans-serif;
}
.uaz_content_container {
  padding: 4px 10px 13px;
  min-width: 1280px;
}
.uaz {
  font-size: 10px;
  font-family: Arial;
  margin: 0;
}
</style>
