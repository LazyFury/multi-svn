<template>
    <div class="select-text">
        Project
        {{ project?.name }}

        <!-- {{ project }} -->

        <div class="py-2">
            <ElButton size="small" @click="refresh()" :loading="loading">
                <Icon v-if="!loading" icon="zondicons:refresh"></Icon>
                <!-- {{ loading ? "loading" : "refresh" }} -->
            </ElButton>
        </div>

        <ElTable size="small" ref="tableRef" :data="files" @select-all="handleSelectionAll">
            <ElTableColumn type="selection" width="44"></ElTableColumn>
            <ElTableColumn prop="emoji" width="60px" label="icon"></ElTableColumn>
            <!-- <ElTableColumn prop="status" width="80px" label="status"></ElTableColumn> -->
            <ElTableColumn :filters="SvnUtils.statusKeysToArray()" :filter-method="filterStatus" prop="text" width="120px"
                label="status">
            </ElTableColumn>
            <!-- <ElTableColumn prop="file" label="file"></ElTableColumn> -->
            <ElTableColumn label="file">
                <template #default="scope">
                    <div class="flex flex-row items-center">
                        <Icon class="text-xl mr-1" :icon="fileIconFromFileName(scope.row.file)"></Icon>
                        <span>{{ scope.row.file }}</span>
                    </div>
                </template>
            </ElTableColumn>
            <ElTableColumn>
                <template #default="scope">
                    <ElButton size="small" v-if="enable(scope.row, 'add')" @click="add(scope.row)" link type="primary">Add</ElButton>
                    <!-- <ElButton size="small" v-if="enable(scope.row, 'commit')" @click="commit(scope.row)" link type="primary">Commit
                    </ElButton> -->
                    <ElButton size="small" v-if="enable(scope.row, 'ignore')" @click="ignore(scope.row)" link type="info">Ignore
                    </ElButton>

                    <!-- del  -->
                    <ElPopconfirm v-if="enable(scope.row, 'delete')" @confirm="del(scope.row, scope.index)" width="300"
                        confirm-button-type="danger"
                        title="Are you sure you want to send the svn repository to delete the files?">
                        <template #reference>
                            <ElButton size="small" link type="danger">Del</ElButton>
                        </template>
                    </ElPopconfirm>
                </template>
            </ElTableColumn>
        </ElTable>
    </div>
</template>

<script lang="ts" setup>
import { useStorage } from '@vueuse/core';
import { Keys } from '../common/keys';
import { ProjectImpl } from '../common/project';
import { wait } from '../common/utils/wait'
import { ElPopconfirm, ElTable, TableInstance } from 'element-plus';
import { useRoute } from 'vue-router';
import { SvnUtils } from '../common/SvnUtils';
import { fileIconFromFileName } from '../common/file';


const projects = useStorage<Array<ProjectImpl>>(Keys.projects, [])
const tableRef = ref<TableInstance>();
const loading = ref(false)
const route = useRoute()
const project = computed(() => projects.value.find((p: any) => p.path == route.query.id))
const files = ref<Array<object>>([])
console.log("on page create")
const refresh = async () => {
    loading.value = true
    files.value = []
    await wait(300)
    if (!project.value) return
    let proj = ProjectImpl.fromProject(project.value!)
    let ok = await proj.updateInfo().catch(() => false)
    if (!ok) {
        loading.value = false
        return;
    }
    files.value = await proj.changeFiles()
    loading.value = false
    let index = projects.value.findIndex((p: any) => p.path == route.query.id)
    projects.value[index] = proj
    reset()
}

onBeforeMount(() => {
    refresh()
})
const enable = (file: any, action: string) => {
    return SvnUtils.statusActions(file.status).some((s) => s == action.toLowerCase())
}
const reset = () => {
    tableRef.value?.clearFilter()
    tableRef.value?.clearSelection()
}

const filterStatus = (value: string, row: any) => row.text == value;
const handleSelectionAll = (e: any) => {
    console.log(e)
}
// onRenderTracked(() => {
//     console.log("on page render")
//     refresh()
// })

// listen("tauri://focus", () => {
//     refresh()
// })

// actions 
const del = async (file: any, i: number) => {
    console.log(i)
    let deleted = project.value?.delete(file.file)
    if (deleted) {
        await refresh()
    }
}

const commit = async (file: any) => {
    let commited = project.value?.commit([file.file])
    if (commited) {
        await refresh()
        await refresh()
    }
}

// add file 
const add = async (file: any) => {
    let added = project.value?.add(file.file)
    if (added) {
        await refresh()
    }
}

// ignore file 
const ignore = async (file: any) => {
    await project.value?.update()
    let ignored = project.value?.ignore(file.file)
    if (ignored) {
        await refresh()
    }
}
</script>