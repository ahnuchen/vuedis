<template>
    <div>
        <div class="header">
            <ActionHeader :panelContent="panelContent"/>
        </div>
        <div class="content">
            <Row>
                <Col span="18">
                    <Table disabled-hover height="400" size="small" highlight-row :columns="columns"
                           :data="rowDatas" @on-current-change="currentChange"></Table>
                </Col>
                <Col span="6">
                    <Button class="zset-opt-btn" long>插入行</Button>
                    <Button class="zset-opt-btn" long>删除行</Button>
                    <Input class="zset-opt-btn" type="text" placeholder="页面搜索..." @input="searchInPage"/>
                    <Page class="zset-opt-btn" :total="100" :page-size="30" show-elevator/>
                </Col>
            </Row>
            <Editor class="hash-key-editor" v-if="rowKey" value-title="key:" :content="rowKey" :onSave="onKeySave"/>
            <Editor class="hash-content-editor" v-if="rowContent" value-title="value:" :content="rowContent" @onSave="onSave"/>
        </div>
        <div class="footer"></div>
    </div>
</template>

<script>
    import ActionHeader from './components/actionHeader'
    import Editor from "./components/editor/Editor";
    import {debounce} from "../../utils/utils";

    export default {
        name: "Hash",
        components: {
            Editor,
            ActionHeader
        },
        props: {
            panelContent: {
                dataType: Object,
                required: true
            }
        },
        data() {
            // let rowDatas = this.panelContent.content.map((item, index) => ({item, index}))
            let rowDatas = [];
            for (let i = 0; i < this.panelContent.content[1].length - 1; i+=2) {
                let key = this.panelContent.content[1][i]
                let item = this.panelContent.content[1][i + 1]
                rowDatas.push({
                    item, key, index: i
                })
            }

            return {
                rowDatasBak: rowDatas,
                rowDatas,
                rowContent: "",
                rowKey: "",
                rowScore:null,
                columns: [
                    {
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: 'value',
                        key: 'item'
                    },
                    {
                        title: 'key',
                        key: 'key'
                    }
                ]
            }
        },
        methods: {
            onSave(v) {
                console.log(v);
            },
            onKeySave(v) {
                console.log(v);
            },
            currentChange({index, item, key}) {
                this.rowContent = item
                this.rowKey = key
            },
            searchInPage(v) {
                debounce(() => {
                    if (v) {
                        this.rowDatas = this.rowDatasBak.filter(item => item.item.includes(v))
                    } else {
                        this.rowDatas = this.rowDatasBak
                    }
                }, 100)();
            }
        },
        created() {
            console.log(this.panelContent.content);
        }
    }
</script>

<style scoped>
    .header {
        width: 100%;
        height: 40px;
        border-bottom: 1px solid #727272;
    }

    .content {
        width: 100%;
    }

    .zset-opt-btn {
        width: 90%;
        margin-left: 5%;
        margin-top: 25px;
    }
    .hash-key-editor{
    }
    .hash-content-editor{
        margin-top: 25px;
    }
</style>