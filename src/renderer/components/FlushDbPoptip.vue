<template>
    <Poptip
            confirm
            title="确定要删除该数据库里面所有键吗？"
            @on-ok="ok"
    >
        <Button size="small" class="option-btn" type="default" icon='ios-brush' title="清空"/>
    </Poptip>
</template>

<script>
    import {Button} from 'iview'
    export default {
        props:{
            node: {
                type: Object,
                default () {
                    return {};
                }
            },
        },
        components:{Button},
        name: "FlushDbPoptip",
        methods:{
            ok(){
                this.$store.dispatch('flushDb',this.node)
            }
        }
    }
</script>

<style scoped>

</style>