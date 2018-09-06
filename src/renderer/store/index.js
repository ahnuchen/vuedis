import Vue from 'vue'
import Vuex from 'vuex'
import Redis from 'redis'

Vue.use(Vuex)

const state = {
    connects: [],
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
    DELETE_CONNECT(state, payload) {
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
    }
}

const store = new Vuex.Store({
    state,
    mutations,
    actions
})

export default store
