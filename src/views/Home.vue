<template>
    <div class="flex flex-row h-full">
        <side-bar></side-bar>
        <div class="flex-1 h-96vh overflow-y-scroll">
            <router-view :key="$route.path + JSON.stringify($route.query)"></router-view>
        </div>
    </div>
</template>
<script lang="ts" setup></script>