<template>
    <div class="editor-container">
        <div class="editor-header">
            <span>{{valueTitle}}</span>
            <div>
                <Label>view as:</Label>
                <Select class="editor-select" v-model="viewAs">
                    <Option value="plain text">plain text</Option>
                    <Option value="json">json</Option>
                </Select>
            </div>
        </div>
        <paste-editor
                class="editor-area"
                v-model="content"
                :viewAs="viewAs"
                :onSave="onSave"
        />
    </div>
</template>

<script>
    import {tryFormatJSON} from "../../../../utils/utils";
    import PasteEditor from './components/paste-editor'
    export default {
        name: "Editor",
        components:{
            PasteEditor
        },
        data() {
            return {
                viewAs: "plain text"
            }
        },
        props: {
            content: {
                dataType: Object,
                required: true
            },
            valueTitle: {
                dataType: String,
                required: false,
                defaultValue: "value:"
            },
            onSave:Function
        },
        methods: {
            onSave(v){
                this.onSave(v)
            }
        },
        created(){
            let jsonContent = tryFormatJSON(this.content)
            this.$nextTick(()=>{
                if(jsonContent){
                    this.viewAs = 'json'
                }else{
                    this.viewAs = 'plain text'
                }
            })
        }
    }
</script>

<style scoped>
    .editor-container {
        width: 98%;
        height: 100%;
        margin: 0 auto;
    }

    .editor-header {
        display: flex;
        justify-content: space-between;
        height: 40px;
        line-height: 40px;
    }
    .editor-select {
        width: 100px;
    }

    .editor-area {
        margin: 0 auto;
        width: 100%;
        height: 90%;
    }
</style>