<template>
    <div>
        <Tabs :value="tabPane">
            <TabPane label="连接设置" name="name1">
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                    <FormItem label="连接名称" prop="title">
                        <Input v-model="formValidate.title" placeholder="输入连接名称"></Input>
                    </FormItem>
                    <FormItem label="连接地址" prop="address">
                        <Input v-model="formValidate.address" placeholder="输入地址"></Input>
                    </FormItem>
                    <FormItem label="连接端口" prop="port">
                        <Input v-model="formValidate.port" placeholder="输入端口"></Input>
                    </FormItem>
                    <FormItem label="验证" prop="interest">
                        <Row>
                            <Col span="18">
                                <Input type="text" v-show="showPassword" v-model="formValidate.password"
                                       placeholder="(可选)输入密码"></Input>
                                <Input type="password" v-show="!showPassword" v-model="formValidate.password"
                                       placeholder="(可选)输入密码"></Input>
                            </Col>
                            <Col span="2">&nbsp;</Col>
                            <Col span="4">
                                <CheckboxGroup>
                                    <Checkbox label="显示密码" v-model="showPassword"></Checkbox>
                                </CheckboxGroup>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" @click="handleSubmit('formValidate')">确定</Button>
                        <Button @click="$emit('hideModal')" style="margin-left: 8px">取消</Button>
                    </FormItem>
                </Form>
            </TabPane>
            <TabPane label="SSH" name="name2">
                <Form ref="sshConfig" :label-width="80" :model="sshConfig" :rules="sshRuleValidate">
                    <FormItem label="连接地址" prop="sshHost">
                        <Row>
                            <Col span="12">
                                <Input v-model="sshConfig.sshHost" placeholder="ssh远程服务器"></Input>
                            </Col>
                            <Col span="1">&nbsp;&nbsp;&nbsp;：</Col>
                            <Col span="4">
                                <InputNumber v-model="sshConfig.sshPort" placeholder="输入端口"></InputNumber>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem label="用户" prop="sshUser">
                        <Input v-model="sshConfig.sshUser" placeholder="输入用户名"></Input>
                    </FormItem>
                    <CheckboxGroup>
                        <Checkbox label="私钥" v-model="sshConfig.usePrivateKeyPath"></Checkbox>
                    </CheckboxGroup>
                    <FormItem :label-width="1" prop="privateKeyPath">
                        <Input @on-click="openPemFile" icon="ios-folder-open-outline"
                               :disabled="!sshConfig.usePrivateKeyPath" v-model="sshConfig.privateKeyPath"
                               placeholder="输入PEM文件路径"></Input>
                    </FormItem>
                    <CheckboxGroup>
                        <Checkbox label="密码" v-model="sshConfig.useSSHPassword"></Checkbox>
                    </CheckboxGroup>
                    <FormItem :label-width="1" prop="sshPassword">
                        <Row>
                            <Col span="18">
                                <Input :disabled="!sshConfig.useSSHPassword" type="text"
                                       v-show="sshConfig.sshPasswordShow" v-model="sshConfig.sshPassword"
                                       placeholder="(可选)输入密码"></Input>
                                <Input :disabled="!sshConfig.useSSHPassword" type="password"
                                       v-show="!sshConfig.sshPasswordShow" v-model="sshConfig.sshPassword"
                                       placeholder="(可选)输入密码"></Input>
                            </Col>
                            <Col push="2" span="4">
                                <CheckboxGroup>
                                    <Checkbox :disabled="!sshConfig.useSSHPassword" label="显示密码"
                                              v-model="sshConfig.sshPasswordShow"></Checkbox>
                                </CheckboxGroup>
                            </Col>
                        </Row>
                    </FormItem>
                    <CheckboxGroup>
                        <Checkbox label="使用SSH通道" v-model="sshConfig.useSSH"></Checkbox>
                    </CheckboxGroup>
                    <FormItem>
                        <Button :loading="sshTestLoading" type="primary" @click="handleTestSSH('formValidate')">测试连接
                        </Button>
                    </FormItem>
                </Form>
            </TabPane>
        </Tabs>
    </div>
</template>

<script>
    import {remote} from 'electron'

    const {dialog} = remote
    import {Client} from 'ssh2'
    import net from 'net'
    import fs from 'fs'

    export default {
        name: "SettingModal",
        data() {
            return {
                tabPane: "name1",
                sshTestLoading: false,
                formValidate: {
                    title: '',
                    address: '127.0.0.1',
                    password: '',
                    port: '6379'
                },
                sshConfig: {
                    sshHost: "",
                    sshPort: 22,
                    sshUser: "",
                    privateKeyPath: "",
                    usePrivateKeyPath: false,
                    sshPassword: "",
                    useSSHPassword: false,
                    sshPasswordShow: false,
                    useSSH: false,
                },
                showPassword: false,
                ruleValidate: {
                    title: [
                        {required: true, message: '连接名称不能为空', trigger: 'blur'}
                    ],
                    address: [
                        {required: true, message: '连接地址不能为空', trigger: 'blur'}
                    ],
                    port: [
                        {required: true, message: '端口不能为空', trigger: 'change'}
                    ]
                },
                sshRuleValidate: {
                    sshHost: [
                        {required: true, message: '连接地址不能为空', trigger: 'blur'}
                    ],
                    sshUser: [
                        {required: true, message: '连接用户不能为空', trigger: 'blur'}
                    ]
                },
            }
        },
        methods: {
            handleSubmit(name) {
                let _this = this;
                _this.$refs[name].validate((valid) => {
                    if (valid) {
                        _this.$emit('hideModal')
                        console.log(_this.sshConfig.useSSH);
                        if (!_this.sshConfig.useSSH) {
                            _this.$store.dispatch('connectRedisClient', _this.formValidate)
                            return _this.$Message.success('Success!');
                        }
                        this.$refs.sshConfig.validate(valid => {
                            if (valid) {
                                console.log('use ssh tunnel');
                                const sshConfig = {
                                    host: _this.sshConfig.sshHost,
                                    port: _this.sshConfig.sshPort || 22,
                                    username: _this.sshConfig.sshUser,
                                    keepaliveInterval: 60 * 60 * 1000
                                }
                                if (_this.sshConfig.useSSHPassword) {
                                    sshConfig.password = _this.sshConfig.sshPassword
                                }
                                if (_this.sshConfig.usePrivateKeyPath) {
                                    sshConfig.privateKey = fs.readFileSync(_this.sshConfig.privateKeyPath).toString()
                                }

                                const conn = new Client();
                                conn.connect(sshConfig)
                                conn.on('ready', () => {
                                    console.log('connect ready');
                                    const server = net.createServer(function (sock) {
                                        console.log('server created');
                                        conn.forwardOut(sock.remoteAddress, sock.remotePort, _this.formValidate.address, _this.formValidate.port, (err, stream) => {
                                            console.log({err,stream});
                                            if (err) return sock.end()
                                                sock.pipe(stream).pipe(sock)
                                        })
                                    })
                                    server.listen(0, function () {
                                        console.log('server listening');
                                        _this.$Message.success('ssh连接成功!');
                                        _this.$store.dispatch('connectRedisClient', {
                                            ..._this.formValidate,
                                            port: server.address().port
                                        })
                                    })
                                })
                                conn.on('error', err => {
                                    _this.sshTestLoading = false
                                    _this.$Message.error('ssh连接失败!');
                                    console.log('ssh error...', err)
                                })
                                conn.on('end', () => {
                                    console.log('ssh end...')
                                })
                            } else {
                                _this.tabPane = "name2"
                            }
                        })
                    }
                })
            },
            handleTestSSH() {
                let _this = this;
                this.$refs.sshConfig.validate(valid => {
                    if (valid) {
                        const sshConfig = {
                            host: _this.sshConfig.sshHost,
                            port: _this.sshConfig.sshPort || 22,
                            username: _this.sshConfig.sshUser
                        }
                        if (_this.sshConfig.useSSHPassword) {
                            sshConfig.password = _this.sshConfig.sshPassword
                        }
                        if (_this.sshConfig.usePrivateKeyPath) {
                            sshConfig.privateKey = fs.readFileSync(_this.sshConfig.privateKeyPath).toString()
                        }
                        _this.sshTestLoading = true
                        const conn = new Client();
                        conn.connect(sshConfig)
                        conn.on('ready', () => {
                            console.log('connect ready');
                            _this.$Message.success('连接成功!');
                            _this.sshTestLoading = false
                            conn.end()
                        })
                        conn.on('error', err => {
                            _this.sshTestLoading = false
                            _this.$Message.error('连接失败!');
                            console.log('ssh error...', err)
                        })
                        conn.on('end', () => {
                            console.log('ssh end...')
                        })
                    }
                })
            },
            openPemFile() {
                let _this = this;
                console.log(dialog);
                dialog.showOpenDialog({properties: ['openFile', 'createFile']}, function (filePaths) {
                    if (filePaths) {
                        _this.sshConfig.privateKeyPath = filePaths[0];
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>