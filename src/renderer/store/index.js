import Vue from 'vue'
import Vuex from 'vuex'
import Redis from 'redis'

Vue.use(Vuex)

const state = {
    connects: [{
        client: null,
        config: {
            title: '本地连接1',
            password: 123456
        },
        expand: false,
        children: [],
        isConnect: true,
        loading: false
    }],
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
        let {index} = payload
        state.connects.splice(index, 1)
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
                let client = Redis.createClient(config,);
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
