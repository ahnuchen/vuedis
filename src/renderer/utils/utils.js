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
        if(err){
            console.log('get keyspace error',err.message)
            return
        }
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

/**
 * @description 绑定事件 on(element, event, handler)
 */
export const on = (function () {
    if (document.addEventListener) {
        return function (element, event, handler) {
            if (element && event && handler) {
                element.addEventListener(event, handler, false)
            }
        }
    } else {
        return function (element, event, handler) {
            if (element && event && handler) {
                element.attachEvent('on' + event, handler)
            }
        }
    }
})()


/**
 * @description 解绑事件 off(element, event, handler)
 */
export const off = (function () {
    if (document.removeEventListener) {
        return function (element, event, handler) {
            if (element && event) {
                element.removeEventListener(event, handler, false)
            }
        }
    } else {
        return function (element, event, handler) {
            if (element && event) {
                element.detachEvent('on' + event, handler)
            }
        }
    }
})()

/**
 * @param {String|Number} value 要验证的字符串或数值
 * @param {*} validList 用来验证的列表
 */
export function oneOf(value, validList) {
    for (let i = 0; i < validList.length; i++) {
        if (value === validList[i]) {
            return true
        }
    }
    return false
}

function cached(fn) {
    let cache = Object.create(null);
    return (function cachedFn(str) {
        let hit = cache[str];
        return hit || (cache[str] = fn(str))
    })
}

export const tryFormatJSON = cached((jsonString) => {
    try {
        const o = JSON.parse(jsonString)
        if (o && typeof o === 'object' && o !== null) {
            return JSON.stringify(o, null, '\t')
        }
    } catch (e) { /**/
    }
    return false
})

export const debounce = (func, wait, immediate) => {
    let timeout, args, context, timestamp, result;
    let later = function () {
        let last = Date.now() - timestamp;
        if (last < wait && last >= 0) {
            timeout = setTimeout(later, wait - last);
        } else {
            timeout = null;
            if (!immediate) {
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            }
        }
    };
    return function () {
        context = this;
        args = arguments;
        timestamp = Date.now();
        let callNow = immediate && !timeout;
        if (!timeout) timeout = setTimeout(later, wait);
        if (callNow) {
            result = func.apply(context, args);
            context = args = null;
        }
        return result;
    };
}