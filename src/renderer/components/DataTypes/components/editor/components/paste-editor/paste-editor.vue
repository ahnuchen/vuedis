<template>
    <div>
        <div class="paste-editor-wrapper">
            <textarea ref="codemirror" class="textarea-el"></textarea>
        </div>
        <Button class="paste-editor-save" @click="getContentValue" size="small">保存</Button>
    </div>

</template>
<script>
    import * as CodeMirror from 'codemirror'
    import 'codemirror/mode/javascript/javascript'
    import 'codemirror/addon/selection/active-line'
    import {tryFormatJSON} from "../../../../../../utils/utils";

    export default {
        name: 'PasteEditor',
        props: {
            value: String,
            viewAs: String
        },
        data() {
            return {
                placeholder: "请输入内容...",
                editor: null
            }
        },
        watch: {
            value() {
                this.setEditorValue()
            },
            viewAs() {
                this.setEditorValue()
            }
        },
        computed: {},
        methods: {
            setEditorValue() {
                if(this.viewAs === 'json'){
                    let jsonContent = tryFormatJSON(this.value,true)
                    if(jsonContent){
                        this.editor.setValue(jsonContent)
                        return true
                    }
                }
                this.editor.setValue(this.value)
            },
            getContentValue(){
                let v = this.editor.getValue()
                this.$emit('onSave',v)
            }
        },
        mounted() {
            this.editor = CodeMirror.fromTextArea(this.$refs.codemirror, {
                lineNumbers: true,
                lineWrapping: true,
                styleActiveLine: true,
                placeholder: this.placeholder,
                mode:{
                  name:"javascript",
                  json:true
                },
                smartIndent: true,
                tabSize: 4,
                indentWithTabs: true,
            })

            this.setEditorValue()
        }
    }
</script>
<style scoped lang="scss">
    @import "~codemirror/lib/codemirror.css";
    .paste-editor-wrapper{
        width: 100%;
        height: 100%;
        border: 1px dashed gainsboro;
        textarea.textarea-el{
            width: 100%;
            height: 100%;
        }
    }
    .paste-editor-save{
        float: right;
    }

</style>
