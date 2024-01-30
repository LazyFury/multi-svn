<template>
    <div class="w-240px select-none dark:bg-dark-600 p-2">
        <RouterLink to="/">
            <div class="mb-2 flex flex-row items-center justify-between">
                <h1 class="text-2xl">

                    Projects</h1>

                <Icon icon="ant-design:home-outlined"></Icon>
            </div>
        </RouterLink>

        <ElRadioGroup class="mb-2 ml-2" size="small" v-model="filter">
            <ElRadioButton label="All"></ElRadioButton>
            <ElRadioButton label="Clean"></ElRadioButton>
            <ElRadioButton label="Dirty"></ElRadioButton>
            <ElRadioButton label="Invalid"></ElRadioButton>
        </ElRadioGroup>

        <div class="projects  overflow-y-scroll h-72vh">
            <ul>
                <li v-for="(p, i) in filterProjects" :key="i" class="cursor-pointer select-none  px-2 py-1 dark:text-gray-500"
                    :class="{ 'dark:bg-dark-400 dark:text-gray-50': i == projectIndex }" @click="toDetail(p, i)">
                    <div>
                        <div class="break-words whitespace-normal">
                            <Icon class=" text-xl" v-if="refreshingLoading[i]" icon="svg-spinners:bars-scale-fade"></Icon>
                            <span v-else>[{{ p.isClean ? '✅' : '❌' }}]</span>
                            <span class="">{{ p.name }}</span>
                        </div>
                        <div class="text-red-300" v-if="!p.validate">
                            <span>working copy is rename or move</span>
                        </div>
                        <div class="flex flex-row items-center justify-between">
                            <span class="text-xs dark:text-dark-50"> {{ dayjs(p.lastUpdate).format("YYYY-MM-DD HH:mm:ss") }}</span>

                            <ElPopconfirm width="200" confirm-button-type="danger" title="confirm delete this?" @confirm="del(p)">
                                <template #reference>
                                    <ElButton link ><Icon class="text-xl text-gray-600" icon="mdi:delete-empty-outline"></Icon></ElButton>
                                </template>
                            </ElPopconfirm>
                        </div>

                    </div>
                </li>
            </ul>
        </div>



        <ElButton size="small" :loading="refreshingAllLoading" @click="refresh()" class="my-4 w-full">
            <Icon v-if="!refreshingAllLoading" icon="zondicons:refresh" class="text-md mr-1"></Icon>
            <span v-if="!refreshingAllLoading">Refresh All Status</span>
            <span v-else>refreshing</span>
        </ElButton>
    </div>
</template>

<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import { Keys } from '../common/keys';
import { ProjectImpl } from '../common/project';
import router from '../router';
import { wait } from '../common/utils/wait';
import dayjs from 'dayjs';
import { ElPopconfirm, ElRadioButton, ElRadioGroup } from 'element-plus';

const filter = ref("All")
const projectIndex = useStorage(Keys.projectIndex, -1)
const projects = useStorage<Array<ProjectImpl>>(Keys.projects, [])
const refreshingAllLoading = ref(false)
const refreshingLoading = ref<{[key:string]:Boolean}>({})


const filterProjects = computed(()=>{
    if(filter.value == "All"){
        return projects.value
    }else if(filter.value == "Clean"){
        return projects.value.filter(p=>p.isClean)
    }else if(filter.value == "Dirty"){
        return projects.value.filter(p=>!p.isClean)
    }else if(filter.value == "Invalid"){
        return projects.value.filter(p=>!p.validate)
    }
    return projects.value
})


const del = ({path}:{path:string}) => {
    projects.value = projects.value.filter(p=>p.path != path)
}

const toDetail = (project: any, i: number) => {
    projectIndex.value = i
    router.push("/home/project?id=" + project.path)
    debugger
}

const refresh = async () => {
    refreshingAllLoading.value = true
    for (let i = 0; i < projects.value.length; i++) {
        refreshingLoading.value[i] = true
        projects.value[i].isClean = false
        let proj = ProjectImpl.fromProject(projects.value[i])
        await proj.updateInfo().catch(()=>{
            proj.validate = false
            return Promise.resolve({})
        })
        await wait(100)
        projects.value[i] = proj
        refreshingLoading.value[i] = false
    }
    refreshingAllLoading.value = false
}
</script>