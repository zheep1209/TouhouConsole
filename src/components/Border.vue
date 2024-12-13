<template>
  <div class="border">
    <div class="header">
      <slot name="header"></slot>
    </div>
    <div class="content">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<style scoped>
.border{
  width: 100%;
  height: 100%;
  .header{
    padding-left: 5px;
    height: 30px;
    border-top: #fe19ff 3px solid;
    border-bottom: #fe19ff 3px solid;
    background-color: #800080;
  }
  .content{
    height: calc(100% - 30px);
    background-color: #000;
  }
}
</style>