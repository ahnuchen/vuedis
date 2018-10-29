<template slot="string">
    <div>
        <div class="header">
            <ActionHeader :panelContent="panelContent"/>
        </div>
        <div class="string-content">
            <Editor value-title="value:" :content="panelContent.content" :onSave="onSave"/>
        </div>
        <div class="footer">
        </div>
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
        },
        methods:{
            onSave(value){
                console.log('编辑器的内容');
                console.log(value);
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
    }

    .footer {

    }
</style>