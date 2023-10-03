<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { RouterView } from 'vue-router'
import { SvnUtils } from './common/SvnUtils';

const version = ref("--")
const compiled = ref("")
onMounted(async ()=>{
  version.value = (await SvnUtils.versionGet()).stdout
  compiled.value = (await SvnUtils.compiledGet()).compiled
})

</script>

<template>
  <div class="box-border select-none dark" style="overscroll-behavior: none;">
    <!-- <header data-tauri-drag-region class="w-100vw h-24px fixed left-0 top-0 justify-end flex flex-row items-center pr-4 dark:bg-dark-500 dark:text-dark-50 box-border">
    </header> -->
    <div class="flex flex-row h-100vh pb-6 dark:text-white">
      <SideMenu></SideMenu>
      <div class="flex-1">
        <router-view></router-view>
      </div>
    </div>
    <footer class="fixed left-0 bottom-0 w-100vw text-sm p-1 flex flex-row items-center dark:text-gray-400 dark:bg-dark-600">
      <Icon icon="ant-design:info-circle-filled" class="mr-1"></Icon>
      <div>Svn: v{{version}} _ {{ compiled }}</div>
      <div class="flex-1"></div>
      <Icon icon="mdi:math-log" class="text-xl mr-2"></Icon>
    </footer>
  </div>
</template>

<style scoped>
.logo.vite:hover {
  filter: drop-shadow(0 0 2em #747bff);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #249b73);
}
</style>
