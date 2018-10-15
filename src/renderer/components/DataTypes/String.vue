<template slot="string">
    <div>
        <div class="header">
            <div class="first">
                <span>{{panelContent.type.toUpperCase()}}：</span>
                <input v-bind:value="panelContent.value.title" disabled/>
                <span>TTL：{{panelContent.ttl}}</span>
                <Button>重命名</Button>
                <Button icon="ios-trash-outline" type="error" ghost>删除</Button>
                <Button>刷新</Button>
                <Button>set ttl</Button>
            </div>
            <div class="second">
                <div>value:</div>
                <div>
                    <Label>view as:</Label>
                    <Select  class="select" v-model="viewAs" @on-change="viewAsChange">
                        <Option value="plain text">plain text</Option>
                        <Option value="json">json</Option>
                    </Select>
                </div>
            </div>
        </div>
        <div class="content">
            <textarea name="" id="" cols="30" rows="10">
                {{panelContent.content}}
            </textarea>
        </div>
        <div class="footer"></div>
    </div>
</template>

<script>
    export default {
        name: "Set",
        props: {
            panelContent: {
                dataType: Object,
                required: true
            }
        },
        data(){
            return {
                viewAs:"plain text"
            }
        },
        methods:{
            viewAsChange(v){
                console.log(v)
            }
        }
    }
</script>

<style scoped lang="scss">
    .header{
        width: 100%;
        height: 80px;
        border-bottom: 1px solid #19be6b;

        .second{
            display: flex;
            justify-content: space-between;
        }
        .select{
            width: 100px;
        }
    }

    .content{
        height: 60vh;
    }
    .footer{

    }
</style>