<template>
    <div class="w-240px dark:bg-dark-600 p-2">
        <RouterLink to="/">
            <div class="mb-2 flex flex-row items-center justify-between">
                <h1 class="text-2xl">

                    Projects</h1>

                <Icon icon="ant-design:home-outlined"></Icon>
            </div>
        </RouterLink>

        <div class="projects  overflow-y-scroll h-82vh">
            <ul>
                <li v-for="(p, i) in projects" :key="i" class="cursor-pointer select-none  px-2 py-1 dark:text-gray-500"
                    :class="{ 'dark:bg-dark-400 dark:text-gray-50': i == projectIndex }" @click="toDetail(p, i)">
                        <div>
                            <div class="">
                                <span class="break-words whitespace-normal">{{ p.name }}</span>
                                [{{ p.isClean ? '✅' : '❌' }}]
                            </div>
                            <span class="text-sm dark:text-dark-50"> {{ p.lastUpdate }}</span>
                        </div>
                    <ElButton @click="update(p, i)">refresh</ElButton>
                </li>
            </ul>
        </div>

    </div>
</template>

<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import { Keys } from '../common/keys';
import { ProjectImpl } from '../common/project';
import router from '../router';
const projectIndex = useStorage(Keys.projectIndex, -1)
const projects = useStorage<Array<ProjectImpl>>(Keys.projects, [])

const update = async (project: any, i: number) => {
    console.log(project)
    let p = ProjectImpl.fromProject(project)
    await p.updateInfo()
    projects.value[i] = p
}

const toDetail = (project: any, i: number) => {
    projectIndex.value = i
    router.push("/home/project?id=" + project.path)
}
</script>