<template>
    <div>
        <Tabs value="name1">
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
                    <FormItem label="显示密码" prop="interest">
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
                        <Button type="primary" @click="handleSubmit('formValidate')">Submit</Button>
                        <Button @click="handleReset('formValidate')" style="margin-left: 8px">Reset</Button>
                    </FormItem>
                </Form>
            </TabPane>
            <TabPane label="高级设置" name="name2">
                高级设置
            </TabPane>
        </Tabs>
    </div>
</template>

<script>
    export default {
        name: "SettingModal",
        data() {
            return {
                formValidate: {
                    title: '',
                    address: '127.0.0.1',
                    password: '',
                    port: '6379'
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
                }
            }
        },
        methods: {
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$store.dispatch('connectRedisClient',this.formValidate)
                        this.$Message.success('Success!');
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            },
            handleReset(name) {
                this.$refs[name].resetFields();
            }
        }
    }
</script>

<style scoped>

</style>