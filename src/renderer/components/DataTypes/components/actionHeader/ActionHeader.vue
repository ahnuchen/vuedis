<template>
    <div>
        <span>{{panelContent.type.toUpperCase()}}：</span>
        <input v-bind:value="panelContent.value.title" disabled/>
        <span>TTL：{{panelContent.ttl}}</span>
        <Button>重命名</Button>
        <Button icon="ios-trash-outline" type="error" ghost>删除</Button>
        <Button>刷新</Button>
        <Button>设置TTL</Button>
    </div>
</template>

<script>
    export default {
        name: "action-header",
        props: {
            panelContent: {
                dataType: Object,
                required: true
            }
        },
    }
</script>

<style scoped>

</style>