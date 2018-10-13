<template>
    <div class="add-key-modal">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
            <FormItem label="键名" prop="name">
                <Input v-model="formValidate.key" placeholder=""></Input>
            </FormItem>
            <FormItem label="类型" prop="type">
                <Select v-model="formValidate.type" placeholder="" label="类型" :style="{color:typeTags[formValidate.type]}">
                    <Option v-for="item in Object.keys(typeTags)" :value="item" :style="{color:typeTags[item]}">{{item}}</Option>
                </Select>
            </FormItem>
            <FormItem v-if="formValidate.type === 'zset'" label="score" prop="score">
                <Input v-model="formValidate.score" placeholder=""></Input>
            </FormItem>
            <FormItem v-if="formValidate.type === 'hash'" label="key" prop="key">
                <Input v-model="formValidate.key" placeholder="" :rows="4" type="textarea"></Input>
            </FormItem>
            <FormItem label="value" prop="value">
                <Input v-model="formValidate.value" placeholder="" :rows="10" type="textarea"></Input>
            </FormItem>
        </Form>
    </div>
</template>

<script>
    import {typeTags} from "../utils/utils";

    export default {
        name: "AddKeyModal",
        data() {
            return {
                formValidate: {
                    name:"",
                    key:"",
                    value:"",
                    score:0,
                    type:"string"
                },
                showPassword: false,
                ruleValidate: {
                    key: [
                        {required: true, message: '请输入key', trigger: 'change'}
                    ],
                    value: [
                        {required: true, message: '请输入value', trigger: 'change'}
                    ],
                    score: [
                        {required: true, message: '请输入score', trigger: 'change'}
                    ],
                    name: [
                        {required: true, message: '请输入键名', trigger: 'change'}
                    ]
                },
                typeTags
            }
        },
        methods:{
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Message.success('Success!');
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            },
        }
    }
</script>

<style scoped>
    .add-key-modal{
        padding-top: 30px;
    }

</style>