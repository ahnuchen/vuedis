<template>
    <div>
        <Tag>
            <router-link to="/index">iview组件</router-link>
        </Tag>
        <Button type="primary" @click="viewRedis">查看redis</Button>
        <Button @click="viewRedis">查看redis</Button>
    </div>
</template>

<script>
    import Redis from 'redis'

    export default {
        name: "MainPage",
        methods: {
            viewRedis() {
                console.log(Redis);
            }
        }
    }
</script>

<style scoped>

</style>