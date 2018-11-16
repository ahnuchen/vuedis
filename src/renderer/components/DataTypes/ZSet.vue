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
            <label class="zset-score-ipt">
                Score:
                <Input v-model="rowScore"/>
            </label>
            <Editor v-if="rowContent" value-title="value:" :content="rowContent" :onSave="onSave"/>
        </div>
        <div class="footer"></div>
    </div>
</template>

<script>
    import ActionHeader from './components/actionHeader'
    import Editor from "./components/editor/Editor";
    import {debounce} from "../../utils/utils";

    export default {
        name: "ZSet",
        components: {
            Editor,
            ActionHeader
        },
        props: {
            panelContent: {
                type: Object,
                required: true
            }
        },
        data() {
            // let rowDatas = this.panelContent.content.map((item, index) => ({item, index}))
            let rowDatas = [];
            for (let i = 0; i < this.panelContent.content.length - 1; i+=2) {
                let item = this.panelContent.content[i]
                let score = this.panelContent.content[i + 1]
                rowDatas.push({
                    item, score, index: i
                })
            }

            return {
                rowDatasBak: rowDatas,
                rowDatas,
                rowContent: "",
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
                        title: 'score',
                        key: 'score'
                    }
                ]
            }
        },
        methods: {
            onSave(v) {
                console.log(v);
                console.log(this.rowScore);
            },
            currentChange({index, item, score}) {
                this.rowContent = item
                this.rowScore = score
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
    .zset-score-ipt{
        margin-left: 10px;
    }
</style>