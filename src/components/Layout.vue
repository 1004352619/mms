<template>
  <div>
      <div class="header">头部</div>
      <div class="navbar">左侧导航</div>
      <div class="main">主区域</div>
  </div>
</template>

<style scoped>
.header{
    position: absolute;
    line-height: 50px;
    top: 0px;
    left: 0px;
    right: 0px;
    background-color: red;
}
.navbar{
    position: absolute;
    top: 50px;
    background-color: blue;
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
    background-color: green;
}
</style>

