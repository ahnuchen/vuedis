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
        <Content class="content">
            <split-pane v-model="offset" @on-moving="handleMoving">
                <div slot="left" class="pane left-pane">
                    <Tree :data="$store.state.connects"
                          :render="renderContent"
                          :load-data="loadTreeNodeData"
                    />
                </div>
                <div slot="right" class="pane right-pane">
                    <Tabs v-bind:value="$store.state.keyContents[$store.state.keyContents.length - 1].title"
                          v-if="$store.state.keyContents.length > 0"
                          type="card"
                          closable
                          @on-tab-remove="removeTab">
                        <TabPane :name="item.title" v-for="item of $store.state.keyContents" :label="item.title">
                            <DataTypePanel  :panelContent="item" />
                        </TabPane>
                    </Tabs>
                </div>
            </split-pane>
<!--            <Row>
                <Col span="8" style="height: 100vh;overflow-y: scroll;">
                <Tree :data="$store.state.connects"
                      :render="renderContent"
                      :load-data="loadTreeNodeData"
                />
                </Col>
                <Col span="16">
                <Tabs v-bind:value="$store.state.keyContents[$store.state.keyContents.length - 1].title"
                      v-if="$store.state.keyContents.length > 0"
                      type="card"
                      closable
                      @on-tab-remove="removeTab">
                    <TabPane :name="item.title" v-for="item of $store.state.keyContents" :label="item.title">
                        <DataTypePanel  :panelContent="item" />
                    </TabPane>
                </Tabs>
                </Col>
            </Row>-->
            <Modal
                    v-model="settingModal.show"
                    title="新建连接"
                    :loading="settingModal.loading"
                    @on-ok="asyncOK"
                    width="800"
            >
                <SettingModal/>
            </Modal>

            <Modal
                    v-model="addKeyModal.show"
                    width="800"
                    @on-ok="asyncAddkeyOk"
                    :loading="addKeyModal.loading"
            >
                <AddKeyModal></AddKeyModal>
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
    import DeleteKeyPoptip from "./DeleteKeyPoptip";
    import AddKeyModal from "./AddKeyModal";
    import DataTypePanel from './DataTypes/DataTypePanel'
    import SplitPane from './split-pane'

    export default {
        name: "MainPage",
        components: {
            DataTypePanel,
            AddKeyModal,
            DeleteKeyPoptip,
            Icon,
            Button,
            SettingModal,
            Tag,
            Poptip,
            FlushDbPoptip,
            TypeTag,
            SplitPane
        },
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
                nodeValueContent: "",
                addKeyModal: {
                    show: false,
                    loading: true
                },
                offset:0.3
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
            handleMoving(){},
            asyncOK() {
                setTimeout(() => {
                    this.settingModal.show = false
                }, 2000)
            },
            asyncAddkeyOk() {
                setTimeout(() => {
                    this.addKeyModal.show = false
                }, 2000)
            },
            removeTab(tabIndex) {
                this.$store.commit('REMOVE_KEY_CONTENTS', tabIndex)
                this.$forceUpdate()
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
                    this.$store.dispatch('getKeyContent', {root, node})
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
                        {data.isValue && <TypeTag type={data.type}/>}
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
                        <DeleteKeyPoptip node={node} root={root}/>
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
                        <FlushDbPoptip node={node}/>

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
                this.addKeyModal.show = true
            },
            flushDb(data) {
            },
            copy(data) {
                this.$electron.clipboard.writeText(data.keyname)
                this.$Message.success('复制成功');
            },
            remove(root, node) {
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
        height: 30px;
    }
    .content{
        height: calc(100vh - 30px);
    }
    .pane{
        height: 100%;
        overflow-y: scroll;
        &.right-pane{
            padding-left: 10px;
        }
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