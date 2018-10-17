<template slot="hash">
    <div>
        <div class="header">
            <ActionHeader :panelContent="panelContent"/>
        </div>
        <div class="footer"></div>
    </div>
</template>

<script>
    import ActionHeader from './components/actionHeader'

    export default {
        components: {
            ActionHeader
        },
        name: "Hash",
        props: {
            panelContent: {
                dataType: Object,
                required: true
            }
        },
    }
</script>

<style scoped>
    .header {
        width: 100%;
        height: 40px;
        border-bottom: 1px solid #727272;
    }
</style>