import Vue from 'vue'
import Vuex from 'vuex'
import Redis from 'redis'
import * as utils from '../utils/utils'
import createLogger from 'vuex/dist/logger'


Vue.use(Vuex)

const state = {
    connects: [{
        client: null,
        config: {
            title: "默认连接",
            address: '127.0.0.1',
            port: '6379',
            password: '123456'
        },
        expand: false,
        children: [],
        isConnect: true,
        loading: false
    }],
    keyContents: []
}

const mutations = {
    ADD_CONNECT(state, {client, config}) {
        state.connects.push({
            client,
            config,
            expand: false,
            children: [],
            isConnect: true,
            loading: false
        })
    },
    DELETE_KEY(state, payload) {
        let {root, node} = payload;
        let dbNodeKey = node.parent
        let connectNodeKey = root.find(item => item.nodeKey === dbNodeKey).parent
        let connect = state.connects.find(item => item.nodeKey === connectNodeKey)
        let db = connect.children.find(item => item.nodeKey === dbNodeKey)
        let value, valueIndex;
        db.children.forEach((item, index) => {
            if (item.nodeKey === node.nodeKey) {
                value = item
                valueIndex = index
            }
        })
        connect.client.del(value.title, (err, res) => {
            console.log('删除key' + value.title);
            console.log({err, res})
        })
        db.children.splice(valueIndex, 1)
        db.title = `${db.title.split('（')[0]}（${db.children.length}）`
    },
    CLOSE_CONNECT(state, payload) {
        let {index} = payload
        let connect = state.connects[index]
        connect.client.quit()
        connect.children = []
    },
    ACTIVE_CONNECT(state, {config}) {
        console.log(state);
        let isExistsConnect = state.connects.find(c => c.title = config.title)
        isExistsConnect.client = Redis.createClient(config)
    },
    RELOAD_DATABASE(state, {config, dbIndex, keySpaces}) {
        let isExistsConnect = state.connects.find(c => c.title = config.title)
        let db = isExistsConnect.children[dbIndex]
        db.children = keySpaces
        db.title = `${db.title.split('（')[0]}（${db.children.length}）`
    },
    ADD_KEY_CONTENTS(state, content) {
        state.keyContents = [content]
    },
    REMOVE_KEY_CONTENTS(state, index) {
        let contents = [...state.keyContents];
        contents.splice(index, 1)
        state.keyContents = contents
    }
}

const actions = {
    connectRedisClient({commit, state}, config) {
        console.log(config);
        let {connects} = state
        let isExistsConnect = connects.find(c => c.config.title === config.title)
        if (isExistsConnect) {
            console.log(config);
            isExistsConnect.client = Redis.createClient(config)
        } else {
            try {
                let client = Redis.createClient(config);
                commit("ADD_CONNECT", {client, config: {...config}})
            } catch (e) {
                alert(e.message)
            }
        }
    },
    refreshDb({commit, state}, node) {
        let {node: data} = node;
        let connect = state.connects.find(item => item.nodeKey === node.parent)
        utils.selectAndScanDb({
            dbIndex: data.index,
            client: connect.client,
            callback: function (keySpaces) {
                commit('RELOAD_DATABASE', {
                    config: connect.config,
                    dbIndex: data.index,
                    keySpaces
                })
            }
        })
    },
    flushDb({commit, state, dispatch}, node) {
        let {node: data} = node;
        let connect = state.connects.find(item => item.nodeKey === node.parent)
        connect.client.select(data.index, function (err, res) {
            connect.client.flushdb(function (_err, _res) {
                console.log('flushdb');
                console.log(_err, _res);
                if (!_err) {
                    dispatch('refreshDb', node)
                }
            })
        })
    },
    getKeyContent({commit, state}, {root, node}) {
        let dbNodeKey = node.parent
        let connectNodeKey = root.find(item => item.nodeKey === dbNodeKey).parent
        let connect = state.connects.find(item => item.nodeKey === connectNodeKey)
        let db = connect.children.find(item => item.nodeKey === dbNodeKey)
        if (connect.client.selected_db !== db.index) {
            connect.client.select(db.index)
        }
        let value, valueIndex;
        db.children.forEach((item, index) => {
            if (item.nodeKey === node.nodeKey) {
                value = item
                valueIndex = index
            }
        })
        let keyTitle = `${connect.config.title}::${db.title}::${value.title}`
        let keyItem = state.keyContents.find(item => item.title === keyTitle)
        if (keyItem) return false;
        switch (value.type) {
            case 'set':
                connect.client.scard(value.title, (err, res) => {
                    console.log(err, res);
                })
                connect.client.sscan(value.title, '0', 'count', '10000', (err, res) => {
                    connect.client.ttl(value.title, (err, ttl) => {
                        commit('ADD_KEY_CONTENTS', {
                            title: keyTitle,
                            content: res,
                            type: value.type,
                            keyTitle,
                            db,
                            value,
                            connect,
                            scanResult: res,
                            ttl
                        })
                    })

                    console.log(err, res);
                })
                break;
            case 'zset':
                connect.client.zcard(value.title, (_err, size) => {
                    connect.client.zrange(value.title, '0', size-1, 'WITHSCORES', (err, res) => {
                        console.log(err, res);
                        connect.client.ttl(value.title, (err, ttl) => {
                            commit('ADD_KEY_CONTENTS', {
                                title: keyTitle,
                                content: res,
                                type: value.type,
                                keyTitle,
                                db,
                                value,
                                connect,
                                scanResult: res,
                                ttl
                            })
                        })
                    })
                })

                break;
            case 'hash':
                connect.client.hlen(value.title, (err, res) => {
                    console.log(err, res);
                })
                connect.client.hscan(value.title, '0', 'count', '10000', (err, res) => {
                    console.log(err, res);
                    connect.client.ttl(value.title, (err, ttl) => {
                        commit('ADD_KEY_CONTENTS', {
                            title: keyTitle,
                            content: res,
                            type: value.type,
                            keyTitle,
                            db,
                            value,
                            connect,
                            scanResult: res,
                            ttl
                        })
                    })


                })
                break;
            case 'list':
                connect.client.llen(value.title, (_err, _res) => {
                    connect.client.lrange(value.title, '0', _res-1, (err, res) => {
                        console.log(err, res);
                        connect.client.ttl(value.title, (err, ttl) => {
                            commit('ADD_KEY_CONTENTS', {
                                title: keyTitle,
                                content: res,
                                type: value.type,
                                keyTitle,
                                db,
                                value,
                                connect,
                                scanResult: res,
                                ttl
                            })
                        })
                    })
                })
                break;
            case 'string':
                connect.client.get(value.title, (err, res) => {
                    console.log(err, res);
                    connect.client.ttl(value.title, (err, ttl) => {
                        commit('ADD_KEY_CONTENTS', {
                            title: keyTitle,
                            content: typeof res === 'object' ? JSON.stringify(res) : res,
                            type: value.type,
                            keyTitle,
                            db,
                            value,
                            connect,
                            scanResult: res,
                            ttl
                        })
                    })

                })
                break;
            default:
                break;
        }
    },
    addKey({commit, state},{keyCreateContent, dbNode,onOk,onErr}){
        console.log(keyCreateContent);
        console.log(dbNode);
        let {name,key,value,score,type} = keyCreateContent;
        let {client,index} = dbNode.node;
        if(client.selected_db !== index){
            client.select(1)
        }
        switch(type){
            case 'string':
                client.set(name,value,(err,res)=>{
                    console.log(err, res);
                    if(err){
                        onErr && onErr(err)
                        return false;
                    }
                    onOk && onOk(res)
                })
                break;
            case 'set':
                client.sadd(name,value,(err,res)=>{
                    console.log(err, res);
                    if(err){
                        onErr && onErr(err)
                        return false;
                    }
                    onOk && onOk(res)
                })
                break;
            case 'zset':
                client.zadd(name,score,value,(err,res)=>{
                    console.log(err, res);
                    if(err){
                        onErr && onErr(err)
                        return false;
                    }
                    onOk && onOk(res)
                })
                break;
            case 'hash':
                client.hsetnx(name,key,value,(err,res)=>{
                    console.log(err,res);
                    if(err){
                        onErr && onErr(err)
                        return false
                    }
                    onOk && onOk(res)
                })
                break;
            case 'list':
                client.lpush(name,value,(err,res)=>{
                    console.log(err,res);
                    if(err){
                        onErr && onErr(err)
                        return false
                    }
                    onOk && onOk(res)
                })
                break;
        }
    }
}

const store = new Vuex.Store({
    state,
    mutations,
    actions,
    plugins: [createLogger()]
})

export default store
