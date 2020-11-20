<template>
  <div>
      <app-header></app-header>
      <app-navbar></app-navbar>
      <app-main></app-main>
      
      
  </div>
</template>

<script>

import AppHeader from './AppHeader'
import AppNavbar from './AppNavbar'
import AppMain from './AppMain'
export default {
    components:{
        AppHeader,
        AppNavbar,
        AppMain
    }
}
</script>

<style scoped>
.header{
    position: absolute;
    line-height: 50px;
    top: 0px;
    left: 0px;
    right: 0px;
    background-color: black;
}
.navbar{
    position: absolute;
    top: 50px;
    background-color: grey;
    width: 230px;
    left: 0px;
    bottom: 0px;
    /* 滚动条 */
    overflow-y: auto;
}
.main{
    position: absolute;
    top: 50px;
    left: 230px;
    right: 0px;
    bottom: 0px;
    padding: 10px;
    overflow-y: auto;
}
</style>

