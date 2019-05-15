<template>
    <div class="box">
        <div class="pannel_head">实体企业详情</div>
        <div class="topBtns" v-if="menuData.resources[0].name === '销售'">
            <el-button
                    type="primary"
                    size="mini"
                    plain
                    @click="routerAdit">编辑</el-button>
            <el-button
                    v-if="companyContractStatus.addContract === 1"
                    type="primary"
                    size="mini"
                    plain
                    @click="seeContract">查看合同</el-button>
            <el-button
                    v-if="companyContractStatus.addContract === 0 || companyContractStatus.ccOpStatus === 0"
                    type="primary"
                    size="mini"
                    plain
                    @click="routerAddContract">添加合同</el-button>
        </div>
        <div class="company_item_head">
            <el-row>
                <el-col :span="12">
                    <div class="body_left">
                        <p>
                            <span>创建日期：</span>
                            <strong v-text="companyMessage.createDateStr"></strong>
                        </p>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="body_left">
                        <p>
                            <span>创建人：</span>
                            <strong v-text="companyMessage.createUserName"></strong>
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
                <el-col :span="12">
                    <div class="body_left">
                        <p v-if="companyMessage.companyGroupName">
                            <span>企业组：</span>
                            <strong  v-text="companyMessage.companyGroupName"></strong>
                        </p>
                        <p>
                            <span>企业名称：</span>
                            <strong v-text="companyMessage.companyName"></strong>
                        </p>
                        <p>
                            <span>公司地址：</span>
                            <el-tooltip class="item" effect="dark" :content="companyMessage.province+companyMessage.city+companyMessage.area+companyMessage.address" placement="top">
                                <strong  v-text="companyMessage.province+companyMessage.city+companyMessage.area+companyMessage.address"></strong>
                            </el-tooltip>
                        </p>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="body_left"><img :src="companyMessage.ccOneCertificatesCopyUrl?'data:image/jpeg;base64,'+companyMessage.ccOneCertificatesCopyUrl:''" alt="营业执照" width="128" height="128"></div>
                </el-col>
            </el-row>
        </div>
        <!--开票信息-->
        <div class="company_item">
            <el-row>
                <el-col :span="24">
                    <div class="title_head">开票信息</div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <div class="body_left">
                        <p>
                            <span>开票方式：</span>
                            <strong v-text="companyInvoice.ciOpenWay === 0 ? '正常开票':'预开票'"></strong>
                        </p>
                        <p>
                            <span>开票内容：</span>
                            <strong v-text="companyInvoice.ciDefaultOpenInvoiceContent"></strong>
                        </p>
                        <p>
                            <span>企业名称：</span>
                            <strong v-text="companyInvoice.ciCompanyName"></strong>
                        </p>
                        <p>
                            <span>注册地址：</span>
                            <strong v-text="companyInvoice.ciCompanyAddress"></strong>
                        </p>
                        <p>
                            <span>开户行：</span>
                            <strong v-text="companyInvoice.ciOpenBank"></strong>
                        </p>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="body_left">
                        <p>
                            <span>开票类型：</span>
                            <strong v-text="companyInvoice.ciType == 0 ? '专用发票':'普通发票'"></strong>
                        </p>
                        <!--<p>
                            <span>开票内容：</span>
                            <strong v-text="companyInvoice.ciOpenInvoiceContent"></strong>
                        </p>-->
                        <p>
                            <span>电话：</span>
                            <strong  v-text="companyInvoice.ciPhone"></strong>
                        </p>
                        <p>
                            <span>税号：</span>
                            <strong  v-text="companyInvoice.ciTaxpayer"></strong>
                        </p>
                        <p>
                            <span>账号：</span>
                            <strong v-text="companyInvoice.ciBankCard"></strong>
                        </p>
                    </div>
                </el-col>
            </el-row>
        </div>
        <!--邮寄信息-->
        <div class="company_item">
            <el-row>
                <el-col :span="24">
                    <div class="title_head">邮寄信息</div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <div class="body_left">
                        <p>
                            <span>企业名称：</span>
                            <strong v-text="companyMailAddress.caCompanyName"></strong>
                        </p>
                        <p>
                            <span>收件人姓名：</span>
                            <strong  v-text="companyMailAddress.caName"></strong>
                        </p>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="body_left">
                        <p>
                            <span>通讯地址：</span>
                            <strong  v-text="companyMailAddress.caProvince+companyMailAddress.caCity+companyMailAddress.caArea+companyMailAddress.caAddress"></strong>
                        </p>
                        <p>
                            <span>电话：</span>
                            <strong  v-text="companyMailAddress.caPhone"></strong>
                        </p>
                    </div>
                </el-col>
            </el-row>
        </div>
        <!--账号信息-->
        <div class="company_item1">
            <el-row>
                <el-col :span="24">
                    <div class="title_head">账号信息</div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <div class="body_left">
                        <p>
                            <span>账号使用人姓名：</span>
                            <strong v-text="companyMessage.accountName"></strong>
                        </p>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="body_left">
                        <p>
                            <span>手机号：</span>
                            <strong v-text="companyMessage.accountPhone"></strong>
                        </p>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    import {
        getCompanyMessage,//查询企业组或者企业详情
        findCompanyStatus,//查询企业状态
    } from '../../api/api';
    import { mapState} from "vuex";
    export default {
        name: "enterprise-real",
        data(){
            return{
                companyIds:this.$route.params.companyIds,//公司id
                /*接口数据*/
                companyContractStatus:{},//该企业 合同状态
                companyDatas:{},
                companyMessage:{},//基本信息
                companyInvoice:{},//开票信息
                companyMailAddress:{},//邮寄信息
            }
        },
        computed:{
            //映射State
            ...mapState({
                menuData:state => state.menuData,//权限生成后的菜单
            })
        },
        mounted(){

            //保存企业ID到sessionStorage
            let companyIds =  sessionStorage.getItem('companyIds');
            if(!companyIds){
                //第一次 进入
                sessionStorage.setItem('companyIds', JSON.stringify(this.$route.params.companyIds));
                this.companyIds = this.$route.params.companyIds;
            }else{
                if(this.$route.params&&!this.$route.params.companyIds){
                    //$route不存在 说明为刷新
                    this.companyIds = JSON.parse(companyIds);
                }else{
                    //不是刷新  是父进来的
                    this.companyIds = this.$route.params.companyIds;
                    sessionStorage.setItem('companyIds', JSON.stringify(this.$route.params.companyIds));
                }
            }

            this.routerContractReal();
            this.findGetCompanyMessage();
        },
        watch:{
            $route:function(){
                this.companyIds = this.$route.params.companyIds;
                this.routerContractReal();
                this.findGetCompanyMessage();
            }
        },
        methods:{
            findGetCompanyMessage(){
                let para = {
                    companyId:this.companyIds,
                    selectGroup:false
                };
                getCompanyMessage(para).then(res =>{
                    if(res.code == '0'){
                        this.companyDatas = res;
                        this.companyMessage = res.companyMessage;
                        this.companyInvoice = res.companyInvoice;
                        this.companyMailAddress = res.companyMailAddress;
                    }else{
                        this.$message({
                            type:'warning',
                            message:res.message
                        })
                    }
                })
            },
            routerAdit(){
                this.$router.push({
                    path:'/home/EnterpriseIndex/aditEnterprise',
                    name:'编辑企业',
                    params:{
                        type:'aditA',
                        aditCompany:this.companyDatas
                    }
                })
            },
            //添加合同
            routerAddContract(){
                this.$router.push({
                    path:'/home/EnterpriseIndex/addContract',
                    name:'添加合同',
                    params:{
                        addContract:this.companyDatas
                    }
                })
            },
            //查看合同
            seeContract(){
               this.$router.push({
                   path:'/home/EnterpriseIndex/contractReal',
                   name:'查看合同',
                   params:{
                       ccId:this.companyContractStatus.ccId
                   }
               })
            },
            //合同详情
            routerContractReal(){
                let para = {
                    companyId:this.companyIds
                };
                findCompanyStatus(para).then(res =>{
                    if(res.code == '0'){
                        this.companyContractStatus = res;
                    }
                });

            }
        }
    }
</script>

<style scoped lang="scss">
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
        width: 300px;
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
