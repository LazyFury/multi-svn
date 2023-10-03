<template>
    <div class="p-2 h-96vh overflow-y-scroll">
        <h1 class="text-3xl">Setting</h1>

        <p>command line svn version info:</p>
        <div class="dark:text-gray-500 text-sm" v-html="version"></div>

    </div>
</template>

<script lang="ts" setup>
import { SvnUtils } from '../common/SvnUtils';

const version = ref("")
SvnUtils.version().then(res => {
    version.value = res.stdout.split("\n").join("<br>")
})
</script>