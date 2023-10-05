<template>
    <div class="p-2 h-96vh overflow-y-scroll">
        <h1 class="text-3xl">Setting</h1>

        <ElCard shadow="never" class="my-4">
            <h1 class="text-lg mb-2">SVN Setting:</h1>
            <ElForm size="small">
                <ElFormItem class="w-420px" label="svn location:">
                    <ElInput v-model="svnLocation" placeholder="place input the svn location"></ElInput>
                </ElFormItem>
                <ElRow>
                    <ElButton @click="saveSvnSetting()" type="primary">Save</ElButton> 
                    <ElButton @click="findSvn()" type="default">Auto Find Svn Command line</ElButton> 
                </ElRow>
            </ElForm>
        </ElCard>

        <p>command line svn version info:</p>
        <div class="dark:text-gray-500 text-sm" v-html="version"></div>

    </div>
</template>

<script lang="ts" setup>
import { ElForm, ElFormItem, ElInput, ElMessage } from 'element-plus';
import { SvnUtils } from '../common/SvnUtils';
import { useStorage } from '@vueuse/core';
import { Keys } from '../common/keys';

const svnLocation = useStorage(Keys.svnLocation, "")
const version = ref("")
SvnUtils.version().then(res => {
    version.value = res.stdout.split("\n").join("<br>")
})

const findSvn = async () => {
    let location = await SvnUtils.findSvn()
    console.log(location)
    if(location)svnLocation.value = location
}
const saveSvnSetting = () => {
    ElMessage({
        message:"success",
        type:"success"
    })
}
</script>