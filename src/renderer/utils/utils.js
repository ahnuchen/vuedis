import os from 'os'
export const selectAndScanDb = ({client, dbIndex = 0, callback}) => {
    client.select(dbIndex, (err, res) => {
        client.scan('0', 'match', '*', 'count', '1000', function (err, res) {
            let redisKeys = res[1]
            let cbArr = redisKeys.map(item => {
                let obj = {
                    title: item,
                    isValue: true,
                    keyname: item,
                }
                client.type(item, (err, res) => {
                    obj.type = res
                })
                return obj
            })
            callback(cbArr)
        })
    })
}

export const getDatabasesOfConnect = ({client, callback}) => {
    client.info('Keyspace', function (err, res) {
        let databases = res.split(os.EOL)
        databases.shift()
        databases.pop()
        let hasKeysDatabases = {}
        for (let database of databases) {
            let arr = database.split(',')
            let key = arr[0].split(':')[0].replace('db', '')
            hasKeysDatabases[key] = {name: arr[0].split(':')[0], num: arr[0].split('=')[1]}
        }
        client.config('get', 'databases', function (err, res) {
            let dbCount = +res[1]
            let databases = []
            for (let i = 0; i < dbCount; i++) {
                let db = {
                    name: 'db' + i,
                    num: 0
                }
                if (hasKeysDatabases[i]) {
                    db = hasKeysDatabases[i]
                }
                databases.push(db)
            }
            databases = databases.map((item, index) => ({
                title: `${item.name}（${item.num}）`,
                expand: false,
                isdb: true,
                children: [],
                index: index,
                loading: false,
                keyNum: item.num,
                client
            }))
            callback(databases)
        })
    })
}

export const typeTags = {
    "string": "green",
    "hash": "cyan",
    "set": "blue",
    "zset": "geekblue",
    "list": "purple"
}