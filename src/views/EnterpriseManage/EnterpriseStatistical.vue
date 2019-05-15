<template>
    <div class="box">
        <div class="pannel_head">企业统计</div>
        <div class="dataAll">
            <el-row style="width: 100%;height: 100%;" class="row_pan">
                <!--<el-col :span="indexDatas1.colSpan" v-for="val in indexDatas1.datas" :key="index">
                    <div class="items_data">
                        <i class="iconfont iconImg" :class="val.iconfont"></i>
                        <div class="list_money">
                            <div class="item_title">{{val.name}}</div>
                            <h5>{{val.value}}</h5>
                        </div>
                    </div>
                    <div class="new_add">

                    </div>
                </el-col>-->
                <el-col :span="12" class="first_content">
                    <div class="items_data">
                        <i class="iconfont icon-kehu iconImg"></i>
                        <div class="list_money">
                            <div class="item_title">客户组总数</div>
                            <h5>{{companyGroupStatistice.totalNum}}</h5>
                        </div>

                    </div>
                    <div class="add_new">
                        <p><span>本季度新增：</span><span>{{companyGroupStatistice.quarterNum}}</span></p>
                        <p><span>本月新增：</span><span>{{companyGroupStatistice.monthNum}}</span></p>
                        <p><span>本周度新增：</span><span>{{companyGroupStatistice.weekNum}}</span></p>
                    </div>
                </el-col>
                <el-col :span="12" >
                    <div class="items_data1">
                        <i class="iconfont icon-kehu1 iconImg"></i>
                        <div class="list_money">
                            <div class="item_title">客户总数</div>
                            <h5>{{companyStatistice.totalNum}}</h5>
                        </div>

                    </div>
                    <div class="add_new">
                        <p><span>本季度新增：</span><span>{{companyStatistice.quarterNum}}</span></p>
                        <p><span>本月新增：</span><span>{{companyStatistice.monthNum}}</span></p>
                        <p><span>本周度新增：</span><span>{{companyStatistice.weekNum}}</span></p>
                    </div>
                </el-col>
            </el-row>
        </div>

    </div>
</template>

<script>
    import {
        findCompanyStatistics
    } from '../../api/api';
    export default {
        name: "enterprise-statistical",
        data(){
            return{
                indexDatas1:{
                    colSpan:12,
                    datas:[
                        {name:'客户组总数',value:43,iconfont:'icon-kehu'},
                        {name:'客户总数',value:23,iconfont:'icon-kehu1'},
                    ],


                },
                companyGroupStatistice:{},//企业组
                companyStatistice:{},//企业统计
            }
        },
        mounted(){
            this.getFindCompanyStatistics()
        },
        methods:{
            getFindCompanyStatistics(){
                let para = {
                    selectTotalNum:true,
                    selectMonthNum:true,
                    selectQuarterNum:true,
                    selectWeekNum:true,
                };
                findCompanyStatistics(para).then(res =>{
                    if(res.code === '0'){
                        this.companyGroupStatistice = res.companyGroupStatistice;
                        this.companyStatistice = res.companyStatistice;
                    }

                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .pannel_head{
        padding: 12px 48px 12px 10px;
        border-bottom: 1px solid #0000001c;
        font-size: 16px;
        line-height: 20px;
    }
    .dataAll{
        /*height: 170px;*/
        width: 100%;
        float: left;
        /*padding: 0 15px;*/
        box-sizing: border-box;
        margin: 100px 0;
        background-color: #fff;
        .double{
            width: 49.5%;
        }
    }
    .add_new{
        text-align: center;
        p{
            line-height: 20px;
            span:first-child{
                text-align: right;
                width: 55%;
                display: inline-block;
            }
            span:last-child{
                text-align: left;
                width: 40%;
                display: inline-block;
            }
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
    .items_data1{
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
    .item_title{
        font-size: 18px;
        line-height: 20px;
        margin-bottom: 5px;
    }
    .row_pan>.el-col{
        min-width: 184px;
    }
    @media only screen and (min-width: 1170px){

        .first_content{
           /* height: 100px;*/
            border-right: 1px solid #d4d4d4;
        }
    }
    @media only screen and (max-width: 1170px) and (min-width: 768px){
        .row_pan>[class*="el-col"].el-col-12 {
            width: 50% !important;
        }
        .items_data{
            padding: 0;
            margin: 0 auto;
            border-right: none;
        }
        .first_content{
          /*  height: 90px;*/
            border-right: 1px solid #d4d4d4;
        }
    }
    @media only screen and (max-width: 980px){
        .row_pan>[class*="el-col"].el-col-12 {
            width: 100% !important;
        }
        .items_data{
            padding: 0;
            margin: 0 auto;
            justify-content: flex-start;
        }
        .items_data1{
            padding: 0;
            margin: 0 auto;
            justify-content: flex-start;
        }
        .first_content{
          /*  height: 90px;*/
            border-right: none;
        }
        .add_new{
            text-align: left;
            text-indent: 20px;
        }
    }
</style>
