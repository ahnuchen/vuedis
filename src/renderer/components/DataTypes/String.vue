<template slot="string">
    <div>
        <div class="header">
            <ActionHeader :panelContent="panelContent"/>
        </div>
        <div class="content">
            <Editor value-title="value:" :panelContent="panelContent"/>
        </div>
        <div class="footer"></div>
    </div>
</template>

<script>
    import ActionHeader from './components/actionHeader'
    import Editor from './components/editor'

    export default {
        name: "String",
        components: {
            ActionHeader,
            Editor
        },
        props: {
            panelContent: {
                dataType: Object,
                required: true
            }
        }
    }
</script>

<style scoped lang="scss">
    .header {
        width: 100%;
        height: 40px;
        border-bottom: 1px solid #727272;
    }

    .content {
        height: 60vh;
    }

    .footer {

    }
</style>