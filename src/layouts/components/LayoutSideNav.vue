

<template>
  <div class="sticky z-40 bg-white mx-auto w-80 ">
    <div class="flex items-center border-b h-16 justify-center">
      <a> <img src="/src/assets/images/logo_yuanju.png" alt=""> </a>
    </div>
    <div class="overflow-y-auto">
      <menu-content :menu-list="menuList"></menu-content>
    </div>
  </div>
</template>

<script lang="ts" setup>
import MenuContent from './MenuContent.vue';
import { useRouter } from 'vue-router';
import { ref } from 'vue'
const routers = useRouter();
const menuList = ref(routers.options.routes)
</script>

<style>

</style>