<template>
    <div class="add-key-modal">
        <Form ref="formValidata" :model="formValidata" :rules="ruleValidate" :label-width="80">
            <FormItem label="键名" prop="name">
                <Input v-model="formValidata.name" placeholder=""></Input>
            </FormItem>
            <FormItem label="类型" prop="type">
                <Select v-model="formValidata.type" placeholder="" label="类型" :style="{color:typeTags[formValidata.type]}">
                    <Option v-for="item in Object.keys(typeTags)" :value="item" :style="{color:typeTags[item]}">{{item}}</Option>
                </Select>
            </FormItem>
            <FormItem v-if="formValidata.type === 'zset'" label="score" prop="score">
                <InputNumber v-model="formValidata.score" placeholder=""></InputNumber>
            </FormItem>
            <FormItem v-if="formValidata.type === 'hash'" label="key" prop="key">
                <Input v-model="formValidata.key" placeholder="" :rows="4" type="textarea"></Input>
            </FormItem>
            <FormItem label="value" prop="value">
                <Input v-model="formValidata.value" placeholder="" :rows="10" type="textarea"></Input>
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
                formValidata: {
                    name:"",
                    key:"",
                    value:"",
                    score:null,
                    type:"string"
                },
                showPassword: false,
                ruleValidate: {
                    key: [
                        {required: true, message: '请输入key', trigger: 'blur'}
                    ],
                    value: [
                        {required: true, message: '请输入value', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '请输入键名', trigger: 'blur'}
                    ]
                },
                typeTags
            }
        },
        methods:{
            async handleSubmit(name) {
                let valid = await this.$refs[name].validate()
                if(valid)return this.formValidata
                return valid
            },
        }
    }
</script>

<style scoped>
    .add-key-modal{
        padding-top: 30px;
    }

</style>