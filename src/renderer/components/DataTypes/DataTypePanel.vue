<template>
    <div>
        <Hash v-if="panelContent.type ==='hash'" :panelContent="panelContent"/>
        <List v-if="panelContent.type ==='list'" :panelContent="panelContent"/>
        <Set v-if="panelContent.type ==='set'" :panelContent="panelContent"/>
        <ZSet v-if="panelContent.type ==='zset'" :panelContent="panelContent"/>
        <String v-if="panelContent.type ==='string'" :panelContent="panelContent"/>
    </div>
</template>

<script>
    import Hash from './Hash'
    import List from './List'
    import Set from './Set'
    import ZSet from './ZSet'
    import String from './String'

    export default {
        props: {
            panelContent: {
                type: Object,
                required: true
            }
        },
        name: "data-type-panel",
        components: {
            Hash,
            Set,
            List,
            ZSet,
            String
        }
    }
</script>

<style scoped>

</style>