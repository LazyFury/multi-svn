<template>
    <div class="p-2">
        <h1 class="text-3xl">Server</h1>
         on "{{ svnServerUrl }}"
        <div class="flex flex-row">

            <div class="flex-1">
                <div v-for="f in files" :key="f">
                    <span @click="changeDir(f)">{{ f.name }}</span>
                </div>
            </div>

            <div class="w-360px"> {{ selectInfo }}</div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { SvnUtils } from '../common/SvnUtils';
const files = ref<Array<any>>([])
const svnServerUrl = ref("svn://127.0.0.1")
const selectInfo = ref<any>(null)

SvnUtils.listServerToTree(svnServerUrl.value, true).then(res => {
    files.value = res
})

const changeDir = async ({ protol, host, path }:any) => {
    let url = `${protol}://${host}/${path}`

    console.log(url)
    let info =  (await SvnUtils.infoServer(url)).format()
    console.log(info)
    if (info.Node_Kind == "directory") {
        svnServerUrl.value = url
        selectInfo.value = info
        SvnUtils.listServerToTree(url, info.Path == ".").then(res => {
            console.log(res)
            files.value = res
        })
    }
}
</script>