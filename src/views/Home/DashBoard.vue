<template>
    <div class="h-96vh p-2 w-full select-text overflow-y-scroll flex-1 dark:bg-dark-400" style="overscroll-behavior: auto;">

        <el-button @click="_e => {
            test()
        }" type="primary">
            click
        </el-button>

        <div class="drag-area w-full h-200px bg-gray-500 flex flex-col items-center justify-center">
            drap folder here
        </div>

        <div>
            <div v-for=" (folder, i)  in  folders" :key="folder">
                <p>{{ folder }}</p>
                <div>
                    <el-button @click="del(i)">del</el-button>
                    <el-button @click="checkSvn(i)">check Svn</el-button>
                    <el-button @click="addProject(folder)" type="primary">add project</el-button>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">
import { listen } from '@tauri-apps/api/event'
import { useStorage } from '@vueuse/core';
import { Keys } from '../../common/keys';

import { invoke } from '@tauri-apps/api/tauri'
import { CommandlineOutput, SvnUtils } from '../../common/SvnUtils';
import { ElMessage, dayjs } from 'element-plus';
import { ProjectImpl } from '../../common/project';


const folders = useStorage<Array<string>>(Keys.folders, [])
const projects = useStorage<Array<ProjectImpl>>(Keys.projects, [])
const test = async () => {
    // let output = await invoke("run",{program:"zsh",dir:"/",args:["-c","echo hello"]})
    let output = await invoke<CommandlineOutput>("run", { program: "zsh", dir: "/", args: ["-c", "which svn"] })
    console.log(output)

    let svn = await invoke<CommandlineOutput>("run", { program: output.stdout.replace(/\n/g, ''), dir: "/", args: ["--version"] })
    console.log(svn.stdout)

    let dir = "/Users/suke/Desktop/项目/铁硬钢强/core"
    let isSvn = await SvnUtils.isWorkingCopy(dir)
    console.log(isSvn)
    if (isSvn) {
        let info = (await SvnUtils.info(dir)).format()
        let Last_Changed_Date = dayjs(info.Last_Changed_Date).format("YYYY-MM-DD HH:mm:ss")
        console.log(Last_Changed_Date, info.Last_Changed_Author)
    }
}

const del = (i: number) => {
    folders.value.splice(i, 1)
}

const checkSvn = async (i: number) => {
    let folder = folders.value[i]
    let isSvn = await SvnUtils.isWorkingCopy(folder)
    if (!isSvn) {
        ElMessage({
            message: 'not svn',
            type: 'error'
        })
    } else {
        ElMessage({
            message: 'is svn',
            type: 'success'
        })
    }
}

const addProject = async (folder: string) => {
    let isSvn = await SvnUtils.isWorkingCopy(folder);
    if (!isSvn) {
        ElMessage({
            message: 'not svn',
            type: 'error'
        })
        return
    }
    let project = await ProjectImpl.New(folder, folder)
    await project.updateInfo()
    console.log(projects)
    if (projects.value.find(p => p.path == project.path)) {
        ElMessage({
            message: 'project already exists',
            type: 'error'
        })
        return
    }

    projects.value.unshift(project)
}

listen('tauri://file-drop', (result) => {
    if (!result.payload) return
    let list = result.payload as Array<string>
    for (let i = 0; i < list.length; i++) {
        folders.value.unshift(list[i])
    }
})
</script>