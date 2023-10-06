<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { RouterView } from 'vue-router'
import { SvnUtils } from './common/SvnUtils';
import { ElDrawer } from 'element-plus';
import { useStorage } from '@vueuse/core';
import { Keys } from './common/keys';
import { invoke } from '@tauri-apps/api/tauri'

const version = ref("--")
const compiled = ref("")
const logDrawerRef = ref<InstanceType<typeof ElDrawer>>()
const showDrawer = ref(false)
const logs = useStorage<Array<any>>(Keys.logs, []);
onMounted(async () => {
  version.value = (await SvnUtils.versionGet()).stdout
  compiled.value = (await SvnUtils.compiledGet()).compiled

  await invoke("run", {
    program: "sh",
    args: ["-c","locale"],
    dir: "/"
  }).then((res:any)=>{
    SvnUtils.log(res)
  }).catch(err => {
    console.log(err)
  })

})
const showLogs = () => {
  logs.value = JSON.parse(localStorage.getItem(Keys.logs) || "[]");
  showDrawer.value = true;
}
const clearLogs = () => {
  logs.value = []
  localStorage.setItem(Keys.logs, JSON.stringify(logs.value))
}
</script>

<template>
  <div class="box-border select-none dark" style="overscroll-behavior: none;">
    <!-- <header data-tauri-drag-region class="w-100vw h-24px fixed left-0 top-0 justify-end flex flex-row items-center pr-4 dark:bg-dark-500 dark:text-dark-50 box-border">
    </header> -->
    <div class="flex flex-row h-100vh pb-6 overflow-y-scroll dark:text-white">
      <SideMenu></SideMenu>
      <div class="flex-1 overflow-hidden select-text">
        <router-view></router-view>
      </div>
    </div>
    <footer
      class="fixed select-text left-0 bottom-0 w-100vw text-sm p-1 flex flex-row items-center dark:text-gray-400 dark:bg-dark-600">
      <Icon icon="ant-design:info-circle-filled" class="mr-1"></Icon>
      <div>Svn: v{{ version }} _ {{ compiled }}</div>
      <div class="flex-1"></div>
      <Icon icon="mdi:math-log" @click="showLogs()" class="text-xl mr-2"></Icon>
    </footer>

    <ElDrawer ref="logDrawerRef" v-model="showDrawer" size="500" title="log">
      <div class="text-sm select-text">
        <div v-for="l in logs" :key="l.toString()">
          <div>
            <span class="text-green-600 bg-white">>>{{ l.program }} {{ l.args.join(" ") }}</span>
          </div>
          <div><span>working on：{{ l.dir }}</span></div>
          <div class="dark:text-gray-400" v-html="l.stdout.split('\n').join('<br>') + '<br>'"></div>
          <div class="dark:text-red-600" v-html="l.stderr.split('\n').join('<br>') + '<br>'"></div>
        </div>
      </div>
      <template #footer>
        <ElButton @click="clearLogs()">clear</ElButton>
      </template>
    </ElDrawer>
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
