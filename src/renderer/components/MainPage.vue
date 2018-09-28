<template>
    <Layout>
        <header class="head">
            <Button size="small" @click="settingModal.show = true">
                <Icon type="md-add-circle" class="add-icon"/>
                新建连接
            </Button>
            <Button size="small" title="导出设置">
                <Icon type="md-cloud-download" class="add-icon"/>
            </Button>
            <Button size="small" title="导入设置">
                <Icon type="md-cloud-upload" class="add-icon"/>
            </Button>
            <Button size="small" class="hd-btn-right">
                <Icon type="md-settings" class="setting-icon"/>
                设置
            </Button>
        </header>
        <Content style="height: 100vh;font-size: 24px">
            <Row>
                <Col span="8" style="height: 100vh;overflow-y: scroll;">
                    <Tree :data="$store.state.connects"
                          :render="renderContent"
                          :load-data="loadTreeNodeData"
                    />
                </Col>
                <Col span="16">
                    <Tabs v-if="$store.state.keyContents.length > 0" type="card" closable @on-tab-remove="removeTab">
                        <TabPane v-for="item of $store.state.keyContents" :label="item.title">{{item.content}}</TabPane>
                    </Tabs>
                </Col>
            </Row>
            <Modal
                    v-model="settingModal.show"
                    title="新建连接"
                    :loading="settingModal.loading"
                    @on-ok="asyncOK"
                    width="800"
            >
                <SettingModal/>
            </Modal>
        </Content>
    </Layout>
</template>
<script>
    import {Icon, Button, Tag, Poptip} from 'iview'
    import SettingModal from './SettingModal'
    import FlushDbPoptip from './FlushDbPoptip'
    import TypeTag from './TypeTag'
    import {selectAndScanDb, getDatabasesOfConnect} from '../utils/utils'

    export default {
        name: "MainPage",
        components: {Icon, Button, SettingModal, Tag,Poptip, FlushDbPoptip, TypeTag},
        data() {
            return {
                buttonProps: {
                    type: 'default',
                    size: 'small',
                },
                title: "新建",
                activeKeyNode: -1,
                settingModal: {
                    show: false,
                    type: 'create',
                    title: "新建连接",
                    loading: true
                },
                nodeValueContent: ""
            }
        },
        created() {
            console.log(this.$store);
        },
        mounted() {
            // let term = new Terminal();
            // term.open(this.$refs.redisTerminal);
        },
        methods: {
            asyncOK() {
                setTimeout(() => {
                    this.settingModal.show = false
                }, 2000)
            },
            removeTab(tabIndex){
                this.$store.commit('REMOVE_KEY_CONTENTS',tabIndex)
            },
            onToggleExpand(nodeData) {
                console.log('onToggleExpand');
                console.log(nodeData);
                this.$store.dispatch('onToggleExpand', nodeData)
            },
            loadTreeNodeData(node, callback) {
                let _this = this
                let currentNode = node
                let {client, config} = node
                if (currentNode.isdb) {//加载db0
                    console.log(currentNode);
                    selectAndScanDb({
                        dbIndex: currentNode.index,
                        client,
                        callback
                    })
                }
                else if (currentNode.isConnect) {//加载连接
                    if (!client) _this.$store.commit('ACTIVE_CONNECT', {config});
                    if (currentNode.children.length > 0) return true;
                    client = _this.$store.state.connects.find(c => c.config.title === config.title).client
                    console.log(client);
                    getDatabasesOfConnect({
                        client,
                        callback
                    })
                }
            },
            clickRedisRow({root, node}) {
                let _this = this
                _this.activeKeyNode = node.nodeKey
                if (node.node.isValue) {
                    this.$store.dispatch('getKeyContent',{root, node})
                }
            },
            renderContent(h, {root, node, data}) {
                let _this = this
                let style = {
                    display: "inline-block",
                    width: "400px",
                    cursor: "pointer",
                    height: "24px",
                    lineHeight: "24px"
                }
                if (data.nodeKey === _this.activeKeyNode) style.backgroundColor = "#ccf5f3"
                return <span style={{...style}}
                             onClick={() => {
                                 _this.clickRedisRow({root, node})
                             }}
                >
                    <span>
                        {!data.isValue &&
                        <Icon type={data.isdb ? "md-key" : "ios-keypad"} style={{marginRight: '8px'}}/>}
                        {data.isValue && <TypeTag type={data.type} />}
                        <span>{data.isConnect ? data.config.title : data.title}{data.iskey && `（${data.num}）`}</span>
                    </span>
                    {data.isValue && data.nodeKey === _this.activeKeyNode && <span style={{
                        display: 'inline-block', float: 'right', marginRight: '32px'
                    }}
                    >
                        <Button size="small" class="option-btn" {..._this.buttonProps} icon='ios-copy' title="复制键名"
                                onClick={e => {
                                    e.stopPropagation()
                                    _this.copy(data)
                                }}/>
                        <Button size="small" class="option-btn" {..._this.buttonProps} icon='ios-trash' title="删除"
                                onClick={() => _this.remove(root, node, data)}/>
                    </span>}
                    {data.isdb && data.nodeKey === _this.activeKeyNode && <span style={{
                        display: 'inline-block', float: 'right', marginRight: '32px'
                    }}
                    >
                        <Button size="small" class="option-btn" {..._this.buttonProps} icon='ios-refresh-circle'
                                title="刷新"
                                onClick={() => _this.refreshDb(node)}/>
                        <Button size="small" class="option-btn" {..._this.buttonProps} icon='md-add-circle' title="添加"
                                onClick={() => _this.addKey(root, node, data)}/>
                        <FlushDbPoptip node={node} />

                    </span>}

                    {data.isConnect && data.nodeKey === _this.activeKeyNode && <span style={{
                        display: 'inline-block', float: 'right', marginRight: '32px'
                    }}
                    >
                        <Button size="small" class="option-btn" {..._this.buttonProps} icon='ios-copy' title="刷新"
                                onClick={() => _this.refreshDb(data)}/>
                        <Button size="small" class="option-btn" {..._this.buttonProps} icon='ios-trash' title="添加"
                                onClick={() => _this.addKey(root, node, data)}/>
                        <Button size="small" class="option-btn" {..._this.buttonProps} icon='ios-trash' title="清空"
                                onClick={() => _this.flushDb(root, node, data)}/>
                    </span>}

                </span>
            },
            refreshDb(node) {
                this.$store.dispatch('refreshDb', node)
            },
            addKey(data) {
            },
            flushDb(data) {
            },
            copy(data) {
                this.$electron.clipboard.writeText(data.keyname)
                this.$Message.success('复制成功');
            },
            remove(root, node, data) {
                this.$store.commit('DELETE_KEY', {root, node})
            },
            mouseKeyEvent(event) {
                console.log(event);
            }
        }
    }
</script>
<style lang="scss">
    @import "~xterm/dist/xterm.css";
    @import "../theme/index.scss";

    .head {
        padding: 2px 5px 2px 5px;
        border-bottom: 1px solid $primary-color;
    }

    .add-icon {
        color: $primary-color;
    }

    .setting-icon {
        color: $warning-color;
    }

    .hd-btn-right {
        float: right;
    }

    .option-btn {
        color: $primary-color;
        margin-right: 8px;
        vertical-align: top;
        height: 24px;
    }
</style>