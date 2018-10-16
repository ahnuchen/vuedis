<template>
    <Tag class="type-tag" :color="typeTags[type]">{{type}}</Tag>
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
.type-tag{
    width: 48px;
    text-align: center;
}
</style>