<template>
    <div>
        Project
        {{ project?.name }}

        <!-- {{ project }} -->

        <div class="py-2">
            <ElButton @click="refresh()" :loading="loading">
                <Icon v-if="!loading" icon="zondicons:refresh"></Icon>
                {{ loading ? "loading" : "refresh" }}
            </ElButton>
        </div>

        <ElTable :data="files">
            <ElTableColumn prop="emoji" width="60px" label="icon"></ElTableColumn>
            <ElTableColumn prop="status" width="80px" label="status"></ElTableColumn>
            <ElTableColumn prop="file" label="file"></ElTableColumn>
            <ElTableColumn prop="text" width="120px" label="text">
            </ElTableColumn>
        </ElTable>
    </div>
</template>

<script lang="ts" setup>
import { useStorage } from '@vueuse/core';
import { Keys } from '../common/keys';
import { ProjectImpl } from '../common/project';
import { wait } from '../common/utils/wait'
import { ElTable } from 'element-plus';
import { useRoute } from 'vue-router';
import { listen } from '@tauri-apps/api/event'
const projects = useStorage<Array<ProjectImpl>>(Keys.projects, [])

const loading = ref(false)
const route = useRoute()
const project = computed(() => projects.value.find((p: any) => p.path == route.query.id))
const files = ref<Array<object>>([])
console.log("on page create")
const refresh = async () => {
    loading.value = true
    files.value = []
    await wait(300)
    if(!project.value) return
    files.value = await ProjectImpl.fromProject(project.value!).changeFiles()
    loading.value = false
}

onRenderTracked(() => {
    console.log("on page render")
    refresh()
})

listen("tauri://focus", () => {
    refresh()
})
</script>