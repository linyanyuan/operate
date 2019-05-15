<template>
    <div class="groupRealBox">
        <div class="pannel_head">企业组详情</div>
        <div class="topBtns" v-if="menuData.resources[0].name === '销售'">
            <el-button type="primary" plain size="mini" @click="routerAdit">编辑</el-button>
        </div>
        <div class="company_item_head">
            <el-row>
                <el-col :span="12">
                    <div class="body_left">
                        <p>
                            <span>创建日期：</span>
                            <strong>{{groupCompanyDatas.createDateStr}}</strong>
                        </p>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="body_left">
                        <p>
                            <span>创建人：</span>
                            <strong>{{groupCompanyDatas.createUserName}}</strong>
                        </p>
                    </div>
                </el-col>
            </el-row>
        </div>
        <!--基本信息-->
        <div class="company_item">
            <el-row>
                <el-col :span="24">
                    <div class="title_head">基本信息</div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <div class="body_left">
                        <p>
                            <span>企业组名称：</span>
                            <strong >{{groupCompanyDatas.companyGroupName}}</strong>
                        </p>
                        <p>
                            <span>账号使用人：</span>
                            <strong >{{groupCompanyDatas.companyGroupAccountName}}</strong>
                        </p>
                        <p>
                            <span>手机号：</span>
                            <strong >{{groupCompanyDatas.companyGroupAccountPhone}}</strong>
                        </p>
                        <p>
                            <span>公司地址：</span>
                            <el-tooltip class="item" effect="dark" :content="groupCompanyDatas.province + groupCompanyDatas.city + groupCompanyDatas.area + groupCompanyDatas.address" placement="top">
                                <strong v-text="groupCompanyDatas.province + groupCompanyDatas.city + groupCompanyDatas.area + groupCompanyDatas.address"></strong>
                            </el-tooltip>
                        </p>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    import {
        getCompanyMessage
    } from '../../api/api';
    import { mapState} from "vuex";
    export default {
        name: "enterprise-group-real",
        data(){
            return{
                groupId:'',//企业组id
                /*接口返回*/
                groupCompanyDatas:{}
            }
        },
        computed:{
            //映射State
            ...mapState({
                menuData:state => state.menuData,//权限生成后的菜单
            })
        },
        mounted(){
            //保存企业组ID到sessionStorage
            let groupId =  sessionStorage.getItem('groupId');
            if(!groupId){
                //第一次 进入
                sessionStorage.setItem('groupId', JSON.stringify(this.$route.params.groupId));
                this.groupId = this.$route.params.groupId;
            }else{
                if(this.$route.params&&!this.$route.params.groupId){
                    //$route不存在 说明为刷新
                    this.groupId = JSON.parse(groupId);
                }else{
                    //不是刷新  是父进来的
                    this.groupId = this.$route.params.groupId;
                    sessionStorage.setItem('groupId', JSON.stringify(this.$route.params.groupId));
                }
            }
            this.findGetCompanyMessage();
        },
        watch:{
            $route:function(){
                this.groupId = this.$route.params.groupId;
                this.findGetCompanyMessage();
            }
        },
        methods:{
            findGetCompanyMessage(){
                let para = {
                    companyId:this.groupId
                };
                getCompanyMessage(para).then(res =>{
                    if(res.code == '0'){
                        this.groupCompanyDatas = res.companyMessage;
                    }
                })
            },
            routerAdit(){
                this.$router.push({
                    path:'/home/EnterpriseIndex/aditEnterpriseGroup',
                    name:'企业组编辑',
                    params:{
                        type:'aditA',
                        aditData:this.groupCompanyDatas
                    }
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .groupRealBox{
        flex: 1;
        /* padding: 10px; */
        padding: 10px 20px;
        box-sizing: border-box;
        .pannel_head{
            padding: 12px 48px 12px 10px;
            border-bottom: 1px solid #0000001c;
            font-size: 16px;
            line-height: 20px;
        }
    }
    .pannel_head {
        padding: 12px 48px 12px 10px;
        border-bottom: 1px solid #0000001c;
        font-size: 16px;
        line-height: 20px;
    }
    .topBtns{
        float: left;
        width: 100%;
        padding: 10px 0;
    }
    .title_head{
        font-size: 15px;
        padding: 12px 0 0 15px;
        box-sizing: border-box;
    }
    .company_item_head{
        float: left;
        background-color: rgba(242, 242, 242, 1);
        width: 100%;
    }
    .company_item{
        float: left;
        width: 100%;
        border-bottom: 1px solid #dcd4d4;
        padding: 10px 0;
        .el-form-item {
            margin-bottom: 10px;
        }
    }
    .company_item1{
        float: left;
        width: 100%;
        padding: 10px 0;
        .el-form-item {
            margin-bottom: 10px;
        }
    }
    .body_left{
        float: left;
        padding: 0 20px;
        margin-right: 50px;
        min-width: 300px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        p{
            margin: 20px 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        strong{
            color: #000;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
</style>
