const {Client} = require('ssh2')
const net = require('net')
const Redis = require('redis')

const conn = new Client();
let config = {
    title: "默认连接",
    host: '127.0.0.1',
    port: '6379',
    password: '123456',
    sshHost: "47.254.22.32",
    sshPort: "22",
    sshUser: "root",
    sshPassword: ""
}

const sshConfig = {
    host: config.sshHost,
    port: config.sshPort || 22,
    username: config.sshUser,
    // keepaliveInterval: 60 * 60 * 1000
}


function handleRedis(param) {
    let redisConfig = {...config, ...param}
    console.log({redisConfig})
    const redisClient = Redis.createClient(redisConfig)
    redisClient.on("connect", function (err, res) {
        console.log('redis connected...')

    });
    redisClient.on("error", function (err) {
        console.log("Error " + err);
    });
    redisClient.get("name", (err, getNameRes) => {
        console.log({err})
        console.log({getNameRes})
    })
    redisClient.get("pwd", (err, getPwdRes) => {
        console.log({err})
        console.log({getPwdRes})
    })
}


conn.on('ready', () => {
    const server = net.createServer(function (sock) {
        console.log('remoteAddress', sock.remoteAddress)
        console.log('remotePort', sock.remotePort)
        conn.forwardOut(sock.remoteAddress, sock.remotePort, config.host, config.port, (err, stream) => {
            if (err) {
                sock.end()
            } else {
                sock.pipe(stream).pipe(sock)
            }
        })
    }).listen(0, function (listenRes) {
        console.log({listenRes})
        console.log(server.address().port)
        handleRedis({host: '127.0.0.1', port: server.address().port})
    })
}).on('error', err => {
    console.log('ssh error...', err)
}).connect(Object.assign(sshConfig, {
    password: config.sshPassword
}))