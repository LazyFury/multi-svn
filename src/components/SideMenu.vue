<template>
    <div class="flex flex-col items-center p-2 dark:bg-dark-800">
        <div>
            <RouterLink to="/">
                <Icon icon="ant-design:folder-open-filled" class="text-2xl"></Icon>
            </RouterLink>
        </div>
        <div>
            <RouterLink to="/server">
                <Icon icon="ant-design:cloud-download-outlined" class="text-2xl"></Icon>
            </RouterLink>
        </div>
        <div class="flex-1"></div>
        <div>
            <RouterLink to="/setting">
                <Icon icon="ant-design:setting-filled" class="text-2xl"></Icon>
            </RouterLink>
        </div>
    </div>
</template>