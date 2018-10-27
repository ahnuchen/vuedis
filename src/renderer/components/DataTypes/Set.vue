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
                    <Button class="set-opt-btn" long>插入行</Button>
                    <Button class="set-opt-btn" long>删除行</Button>
                    <Input class="set-opt-btn" type="text" placeholder="页面搜索..." @input="searchInPage"/>
                    <Page class="set-opt-btn" :total="100" :page-size="30" show-elevator/>
                </Col>
            </Row>
            <Editor v-if="rowContent" value-title="value:" :content="rowContent" @onSave="onSave"/>
        </div>
        <div class="footer"></div>
    </div>
</template>

<script>
    import ActionHeader from './components/actionHeader'
    import Editor from "./components/editor/Editor";
    import {debounce} from "../../utils/utils";

    export default {
        name: "Set",
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
            let rowDatas = this.panelContent.content[1].map((item, index) => ({item, index}))
            return {
                rowDatasBak: rowDatas,
                rowDatas,
                rowContent: "",
                columns: [
                    {
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: 'value',
                        key: 'item'
                    }
                ]
            }
        },
        methods: {
            onSave(v) {
                console.log(v);
            },
            currentChange({index, item}) {
                this.rowContent = item
            },
            searchInPage(v) {
                return debounce(() => {
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
    .set-opt-btn{
        width: 90%;
        margin-left: 5%;
        margin-top: 25px;
    }
</style>