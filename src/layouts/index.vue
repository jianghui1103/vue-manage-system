<template>
  <div class="flex">
    <layout-side-nav class="yuanju-sidebar"></layout-side-nav>
    <div class=" flex-1">
      <layout-header></layout-header>
      <layout-content></layout-content>
  </div>
  </div>
</template>
<script setup lang="ts">
import LayoutHeader from './components/LayoutHeader.vue';
// import LayoutContent from './components/LayoutContent.vue';
import LayoutSideNav from './components/LayoutSideNav.vue';
</script>

<style>

</style>