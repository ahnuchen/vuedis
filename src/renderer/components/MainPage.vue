<template>
    <Layout>
        <header>
            <Tag>
                <router-link to="/index">iview组件</router-link>
            </Tag>
        </header>
        <Content>
            <Row>
                <Col span="8">
                    <Tree :data="data1" :load-data="loadTreeNodeData" :render="renderContent"/>
                </Col>
                <Col span="16">
                    <div ref="redisTerminal"></div>
                </Col>
            </Row>
        </Content>
    </Layout>
</template>
<script>
    import Redis from 'redis'
    import os from 'os'
    import {Icon, Button} from 'iview'
    import { Terminal } from 'xterm';

    let client;
    export default {
        name: "MainPage",
        components: {Icon, Button},
        data() {
            let _this = this
            return {
                databases: [],
                data1: [{
                    title: '本地连接',
                    expand: false,
                    children: [],
                    isConnect: true,
                    loading: false
                }],
                buttonProps: {
                    type: 'default',
                    size: 'small',
                },
                activeKeyNode: -1
            }
        },
        mounted(){
            let term = new Terminal();
            term.open(this.$refs.redisTerminal);
        },
        methods: {
            viewRedis() {
                client = Redis.createClient({
                    password: 123456
                });
                console.log(client);
            },
            viewInfo() {
                let _this = this

            },
            loadTreeNodeData(node, callback) {
                let _this = this
                let currentNode = node
                // if (currentNode.selected) return false
                // currentNode.selected = true
                if (currentNode.isdb) {
                    console.log(currentNode);
                    client.select(currentNode.index, (err, res) => {
                        console.log('select' + currentNode.index);
                        console.log(err, res);
                        client.scan('0', 'match', '*', 'count', '1000', function (err, res) {
                            console.log('scan 0 match * count 100');
                            console.log(err, res);
                            let redisKeys = res[1]
                            let cbArr = redisKeys.map(item => ({
                                title: item,
                                // expand: false,
                                isvalue: true,
                                keyname: item,
                                // loading:false
                            }))
                            callback(cbArr)
                        })
                    })
                }
                else if (currentNode.isConnect) {
                    if (!client) this.viewRedis();
                    if (_this.databases.length > 0) return false
                    client.info('Keyspace', function (err, res) {
                        let databases = res.split(os.EOL)
                        databases.shift()
                        databases.pop()
                        console.log(databases);
                        let hasKeysDatabases = {}

                        for (let database of databases) {
                            // 'db0:keys=7'
                            let arr = database.split(',')
                            let key = arr[0].split(':')[0].replace('db', '')
                            hasKeysDatabases[key] = {name: arr[0].split(':')[0], num: arr[0].split('=')[1]}
                        }
                        client.config('get', 'databases', function (err, res) {
                            let dbCount = +res[1]
                            for (let i = 0; i < dbCount; i++) {
                                let db = {
                                    name: 'db' + i,
                                    num: 0
                                }
                                if (hasKeysDatabases[i]) {
                                    db = hasKeysDatabases[i]
                                }
                                _this.databases.push(db)
                            }
                            let databases = _this.databases.map((item, index) => ({
                                title: `${item.name}（${item.num}）`,
                                expand: false,
                                isdb: true,
                                children: [],
                                index: index,
                                loading: false,
                                keyNum: item.num
                            }))
                            callback(databases)
                        })
                    })
                }
            },
            clickRedisRow(data) {
                this.activeKeyNode = data.nodeKey
            },
            renderContent(h, {root, node, data}) {
                let _this = this
                let style = {display: "inline-block", width: "400px", cursor: "pointer"}
                if (data.nodeKey === _this.activeKeyNode) style.backgroundColor = "#D5e8Fc"
                return <span style={{...style}}
                             onClick={() => {
                                 _this.clickRedisRow(data)
                             }}
                >
                    <span>
                        <Icon type={data.isdb ? "md-key" : "ios-keypad"} style={{marginRight: '8px'}}/>
                        <span>{data.title}{data.iskey && `（${data.num}）`}</span>
                    </span>
                    {data.isvalue && data.nodeKey === _this.activeKeyNode && <span style={{
                        display: 'inline-block', float: 'right', marginRight: '32px'
                    }}
                    >
                        <Button style={{marginRight: '8px'}} {..._this.buttonProps} icon='ios-copy' title="复制键名"
                                onClick={() => _this.copy(data)}/>
                        <Button style={{marginRight: '8px'}} {..._this.buttonProps} icon='ios-trash' title="删除"
                                onClick={() => _this.remove(root, node, data)}/>
                    </span>}
                    {data.isdb && data.nodeKey === _this.activeKeyNode && <span style={{
                        display: 'inline-block', float: 'right', marginRight: '32px'
                    }}
                    >
                        <Button style={{marginRight: '8px'}} {..._this.buttonProps} icon='ios-copy' title="刷新"
                                onClick={() => _this.refreshDb(data)}/>
                        <Button style={{marginRight: '8px'}} {..._this.buttonProps} icon='ios-trash' title="添加"
                                onClick={() => _this.addKey(root, node, data)}/>
                        <Button style={{marginRight: '8px'}} {..._this.buttonProps} icon='ios-trash' title="清空"
                                onClick={() => _this.flushDb(root, node, data)}/>
                    </span>}

                    {data.isConnect && data.nodeKey === _this.activeKeyNode && <span style={{
                        display: 'inline-block', float: 'right', marginRight: '32px'
                    }}
                    >
                        <Button style={{marginRight: '8px'}} {..._this.buttonProps} icon='ios-copy' title="刷新"
                                onClick={() => _this.refreshDb(data)}/>
                        <Button style={{marginRight: '8px'}} {..._this.buttonProps} icon='ios-trash' title="添加"
                                onClick={() => _this.addKey(root, node, data)}/>
                        <Button style={{marginRight: '8px'}} {..._this.buttonProps} icon='ios-trash' title="清空"
                                onClick={() => _this.flushDb(root, node, data)}/>
                    </span>}

                </span>
            },
            refreshDb(data) {
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
            },
            mouseKeyEvent(event) {
                console.log(event);
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "~xterm/dist/xterm.css";
</style>