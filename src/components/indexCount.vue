<template>
    <div class="dataAll" :style="indexDatas.classes">
        <div class="pannel_head" >
            <div class="pannel-title">{{indexDatas.title}}</div>
        </div>
        <el-row style="width: 100%;height: 100%;" class="row_pan">
            <el-col :span="indexDatas.colSpan" v-for="val in indexDatas.datas" :key="index">
                <div class="items_data">
                    <i class="iconfont iconImg"
                       :class="val.iconfont"
                       @click="eventClick(val,indexDatas)"
                       :style="indexDatas.cursor?'cursor:pointer':''"></i>
                    <div class="list_money"
                         @click="eventClick(val,indexDatas)"
                         :style="indexDatas.cursor?'cursor:pointer':''">
                        <div class="item_title">{{val.name}}</div>
                        <h5>{{val.value}}</h5>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>

    export default {
        name: "index-count",
        props:{
            indexDatas:{
                type:Object,
                default:function () {
                    return {}
                }
            }
        },
        data(){
            return{

            }
        },
        methods:{
            eventClick(data,datas){
                this.$emit('routeTo',data,datas)
            }
        }
    }
</script>

<style scoped lang="scss">
    .dataAll{
        /*height: 170px;*/
        width: 100%;
        float: left;
        /*padding: 0 15px;*/
        box-sizing: border-box;
        margin-bottom: 10px;
        background-color: #fff;
        /*border: 1px solid transparent;
        border-radius: 4px;*/
        border: 1px solid #d4d4d4;
        border-radius: 3px;
        -webkit-box-shadow: 0 1px 1px rgba(0,0,0,.05), 0 2px 6px 0 rgba(0,0,0,.045);
        box-shadow: 0 1px 1px rgba(0,0,0,.05), 0 2px 6px 0 rgba(0,0,0,.045);
        .double{
            width: 49.5%;
        }
    }
    .iconImg{
        font-size: 30px;
        color: #cac2c2;
        float: left;
        padding: 20px;
    }
    .items_data{
        /* flex: 1;*/
        border-right: 1px solid #d4d4d4;
        width: 100%;
        height: 70px;
        display: flex;
        justify-content: center;
        h5{
            margin: 0;
            font-size: 18px;
            font-weight: 200;
            line-height: 38px;
            color: #f60;
            /*margin-right: 20px;*/
        }
    }

    .list_money{
        float: left;
        text-align: center;
        padding: 10px;
    }

    .row_pan{
        box-sizing: border-box;
        width: 970px;
        margin: 0 auto;
        /*overflow: hidden;
        white-space: normal;*/
    }
    /*消息样式*/
    .pannel_head{
        padding: 12px 48px 12px 20px;
        border-bottom: 1px solid transparent;
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
        .pannel-title{
            font-size: 14px;
            font-weight: 700;
            line-height: 20px;
        }
    }
    .item_title{
        font-size: 18px;
        line-height: 20px;
        margin-bottom: 5px;
    }
    @media only screen and (min-width: 1170px){

        .row_pan>.el-col{
            height: 100px;
        }
    }
    @media only screen and (max-width: 1170px) and (min-width: 768px){
        .row_pan>[class*="el-col"].el-col-6 {
            width: 50% !important;
        }
        .items_data{
            padding: 0;
            margin: 0 auto;
            border-right: none;
        }
        .row_pan>.el-col{
            height: 90px;
        }
    }
    @media only screen and (max-width: 810px){
        .row_pan>[class*="el-col"].el-col-6 {
            width: 100% !important;
        }
        .items_data{
            padding: 0;
            margin: 0 auto;
            border-right: none;
            justify-content: space-around;
        }
        .row_pan>.el-col{
            height: 90px;
        }
    }
</style>
