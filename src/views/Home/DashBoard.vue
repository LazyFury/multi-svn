<template>
    <div class="p-2 select-text">

        <div class="drag-area w-full h-200px bg-dark-800 mb-4 flex flex-col items-center justify-center">
            <Icon icon="tabler:drag-drop" class="text-5xl mb-4"></Icon>
            <span>
                Drap Folder Here To Add Project
            </span>
        </div>


        <div>
            <h1 class="text-xl mb-2">Add History</h1>
            <ElTable :data="folders">
                <ElTableColumn prop="folder" label="folder"></ElTableColumn>
                <ElTableColumn label="actions">
                    <template #default="scope">
                        <ElButton @click="addProject(scope.row.folder)" size="small" type="primary">Add To Project</ElButton>
                        <ElButton @click="checkSvn(scope.row.folder)" size="small">Test</ElButton>
                        <ElButton @click="del(scope.$index)" size="small" type="danger">del</ElButton>
                    </template>
                </ElTableColumn>
            </ElTable>
        </div>
    </div>
</template>


<script setup lang="ts">
import { listen } from '@tauri-apps/api/event'
import { useStorage } from '@vueuse/core';
import { Keys } from '../../common/keys';

import {  SvnUtils } from '../../common/SvnUtils';
import { ElMessage } from 'element-plus';
import { ProjectImpl } from '../../common/project';


const folders = useStorage<Array<any>>(Keys.folders, [])
const projects = useStorage<Array<ProjectImpl>>(Keys.projects, [])
// const test = async () => {
//     // let output = await invoke("run",{program:"zsh",dir:"/",args:["-c","echo hello"]})
//     let output = await invoke<CommandlineOutput>("run", { program: "zsh", dir: "/", args: ["-c", "which svn"] })
//     console.log(output)

//     let svn = await invoke<CommandlineOutput>("run", { program: output.stdout.replace(/\n/g, ''), dir: "/", args: ["--version"] })
//     console.log(svn.stdout)

//     let dir = "/Users/suke/Desktop/项目/铁硬钢强/core"
//     let isSvn = await SvnUtils.isWorkingCopy(dir)
//     console.log(isSvn)
//     if (isSvn) {
//         let info = (await SvnUtils.info(dir)).format()
//         let Last_Changed_Date = dayjs(info.Last_Changed_Date).format("YYYY-MM-DD HH:mm:ss")
//         console.log(Last_Changed_Date, info.Last_Changed_Author)
//     }
// }

const del = (i: number) => {
    folders.value.splice(i, 1)
}

const checkSvn = async (folder:string) => {
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
    return isSvn
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

listen('tauri://file-drop', async (result) => {
    if (!result.payload) return
    let list = result.payload as Array<string>
    for (let i = 0; i < list.length; i++) {
        let folder = list[i];
        if(/(\.)/.test(folder)){
            return ElMessage({message:"not support file",type:"error"});
        }
        if (folders.value.find(f => f.folder == folder)) {
            return ElMessage({message:"folder already exists",type:"error"});
        }
        if (! await checkSvn(folder)) {
            return;
        }
        folders.value.unshift({
            folder
        })
    }
})
</script>