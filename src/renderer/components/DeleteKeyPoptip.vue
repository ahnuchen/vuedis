<template>
    <Poptip
            confirm
            title="确定要删除此条记录吗？"
            @on-ok="ok"
    >
        <Button size="small" class="option-btn" type="default" icon='ios-trash' title="删除"/>
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
            root: {
                type: Array,
                default () {
                    return {};
                }
            },
        },
        components:{Button},
        name: "DeleteKeyPoptip",
        methods:{
            ok(){
                let {node, root} = this
                this.$store.commit('DELETE_KEY', {root, node})
            }
        }
    }
</script>

<style scoped>

</style>