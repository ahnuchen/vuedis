<template>
    <Tag :color="typeTags[type]">{{type}}</Tag>
</template>

<script>
    import {typeTags} from "../utils/utils";
    import {Tag} from 'iview'

    export default {
        name: "TypeTag",
        props: {
            type: String,
            default: ""
        },
        components: { Tag },
        data(){
            return {
                typeTags
            }
        }
    }
</script>

<style scoped>

</style>