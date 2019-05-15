<template>
    <div class="box">
        <div class="container_contract">
            <!--基本信息-->
            <div class="totle_all" v-if="companyContract.ccCancellationStatus === 0">
                <div class="totle_item">
                    <strong>作废原因：</strong>
                    <span v-text="companyContract.ccRemark"></span>
                </div>
            </div>
            <div class="company_item">
                <el-row>
                    <el-col :span="24">
                        <div class="title_head">基本信息</div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <div class="body_left">
                            <p>
                                <span>企业名称：</span>
                                <strong >{{companyMessage.companyName}}</strong>
                            </p>
                            <p>
                                <span>公司地址：</span>
                                <el-tooltip class="item" effect="dark" :content="companyMessage.province+companyMessage.city+companyMessage.area+companyMessage.address" placement="top">
                                    <strong>{{companyMessage.province+companyMessage.city+companyMessage.area+companyMessage.address}}</strong>
                                </el-tooltip>
                            </p>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="body_left"><img :src="companyMessage.ccOneCertificatesCopyUrl?'data:image/jpeg;base64,'+companyMessage.ccOneCertificatesCopyUrl:''" alt="营业执照" width="128" height="128"></div>
                    </el-col>
                </el-row>
            </div>
            <!--签约-->
            <div class="company_item">
                <el-row>
                    <el-col :span="24">
                        <div class="title_head">签约信息</div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <div class="body_left">
                            <p>
                                <span>签署日期：</span>
                                <strong>{{companyContract.ccSignTime}}</strong>
                            </p>
                            <p>
                                <span>签约主体：</span>
                                <strong>{{companyContract.signTheme}}</strong>
                            </p>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="body_left">
                            <p>
                                <span>有效期：</span>
                                <strong>{{companyContract.ccStartDate}} - {{companyContract.ccEndDate}}</strong>
                            </p>
                            <p>
                                <span>到账通知：</span>
                                <strong v-text="companyContract.ccToAccountNotice === 0?'不通知':'通知'"></strong>
                            </p>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <!--业务-->
            <div class="company_item">
                <el-row>
                    <el-col :span="24">
                        <div class="title_head">业务信息</div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <div class="body_left">
                            <p>
                                <span>个税率：</span>
                                <strong v-if="companyContract.ccPersonTaxRate" v-text="companyContract.ccPersonTaxRate*100+' %'"></strong>
                            </p>
                            <p>
                                <span>服务费率：</span>
                                <strong v-if="companyContract.ccPersonServicePriceRate" v-text="companyContract.ccPersonServicePriceRate*100+' %'"></strong>
                            </p>
                            <p>
                                <span>发票抵扣率：</span>
                                <strong v-if="companyContract.ccInvoice" v-text="companyContract.ccInvoice*100+' %'"></strong>
                            </p>
                            <p>
                                <span>服务总费率：</span>
                                <strong v-if="companyContract.ccServiceTotalRate" v-text="companyContract.ccServiceTotalRate*100+' %'"></strong>
                            </p>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="body_left">
                            <p>
                                <span>承担者：</span>
                                <strong v-text="companyContract.ccTaxBear === 0?'个人承担':'企业承担'"></strong>
                            </p>
                            <p>
                                <span>服务费承担者：</span>
                                <strong v-text="companyContract.ccServiceBear === 0?'个人承担':'企业承担'"></strong>
                            </p>
                            <p>
                                <span>发票个人承担者：</span>
                                <strong v-text="companyContract.ccInvoceBear === 0?'个人':'企业'"></strong>
                            </p>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <!--对接人信息-->
            <div class="company_item company_phone">
                <el-row>
                    <el-col :span="24">
                        <div class="title_head">对接人信息</div>
                    </el-col>
                </el-row>
                <el-row >
                    <el-col :span="24">
                        <h4>甲方：</h4>
                    </el-col>
                </el-row>
                <el-row style="padding: 0 20px;">
                    <el-col :span="24" v-for="(val,index) in companyContacts" :key="index">
                        <el-col :span="8" >
                            <p>
                                <span>联系人姓名：</span>
                                <strong v-text="val.name"></strong>
                            </p>
                        </el-col>
                        <el-col :span="8">
                            <p>
                                <span>联系方式：</span>
                                <strong v-text="val.phone"></strong>
                            </p>
                        </el-col>
                        <el-col :span="8">
                            <p>
                                <span>邮箱：</span>
                                <strong v-text="val.email"></strong>
                            </p>
                        </el-col>
                    </el-col>
                </el-row>
                <!--内部联系人-->
                <el-row>
                    <el-col :span="24">
                        <h4>乙方：</h4>
                    </el-col>
                </el-row>
                <el-row style="padding: 0 20px;">
                    <el-col :span="24" v-for="(val,index) in xdlContacts" :key="index">
                        <el-col :span="8">
                            <p>
                                <span>公司职位：</span>
                                <strong v-text="val.jobTitile"></strong>
                            </p>
                        </el-col>
                        <el-col :span="8">
                            <p>
                                <span>联系人姓名：</span>
                                <strong v-text="val.name"></strong>
                            </p>
                        </el-col>
                        <el-col :span="8">
                            <p>
                                <span>联系方式：</span>
                                <strong v-text="val.phone"></strong>
                            </p>
                        </el-col>
                        <el-col :span="8">
                            <p>
                                <span>邮箱：</span>
                                <strong v-text="val.email"></strong>
                            </p>
                        </el-col>
                    </el-col>
                </el-row>

            </div>
            <!--补充协议-->
            <div class="company_item" v-if="companyContract.ccUploadStatus === 1">
                <el-row>
                    <el-col :span="24">
                        <div class="title_head">合同协议</div>
                    </el-col>
                </el-row>
                <el-row style="padding: 0 20px;">
                    <el-col :span="24">
                        <p>
                            <span>合同：</span>
                            <a href="javascript:;" class="preview" @click="previewContract(companyContractPath)">预览</a>
                        </p>
                    </el-col>
                    <el-col :span="24">
                        <p v-for="(val,index) in companyContractAgreementPaths" :key="index">
                            <span v-text="'补充协议'+index+':'"></span>
                            <a href="javascript:;" class="preview" @click="previewContract(val)">预览</a>
                        </p>
                    </el-col>
                </el-row>
            </div>
        </div>
        <!--预览合同-->
        <el-dialog
                @close="handleClose"
                :loading="isLoading"
                :visible.sync="showReadResult">
            <pdf :src="pdf_path" @error="pdfError"
                 @num-pages="pageCount = $event"
                 @page-loaded="currentPages = $event" :page="page"></pdf>
            <div v-if="pageCount > 1" class="leftBtn el-icon-arrow-left" @click="pervPage"></div>
            <div v-if="pageCount > 1" class="rightBtn el-icon-arrow-right" @click="nextPage"></div>

        </el-dialog>
    </div>
</template>

<script>
    const pdf  = r => require.ensure([], () => r(require('vue-pdf')), 'pdf');//pdf组件
    import { mapActions } from 'vuex';
    import {
        findCompanyContractById,//查询合同详细信息
    } from '../../api/api';

    export default {
        name: "contract-details",
        data(){
            return{
                //params
                contractDatas:'',
                /*pdf*/
                pdf_path:'',
                show: true,
                isLoading:false,
                currentPages:1,
                pageCount: 0,
                showReadResult:false,//预览
                loadedRatio: 0,
                page: 1,
                numPages: 0,
                rotate: 0,
                datas:{},
                /*接口返回*/
                companyContract:{},//企业合同基本信息
                companyContacts:{},//企业对接人信息
                companyContractAgreementPaths:[],//上传的合同补充协议路径集合
                companyContractPath:'',//上传的合同路径
                companyMessage:{},//企业基本信息
                xdlContacts:{},//薪动力对接人信息
            }
        },
        components:{
            pdf
        },
        mounted(){
            //保存合同详情到sessionStorage
            let contractDetails =  JSON.parse(sessionStorage.getItem('contractDetails'));
            if(!contractDetails){
                //第一次 进入
                sessionStorage.setItem('contractDetails', JSON.stringify(this.$route.params.contractCCId));
                this.contractDatas = this.$route.params.contractCCId;
            }else{
                if(this.$route.params&&!this.$route.params.contractCCId){
                    //$route不存在 说明为刷新
                    this.contractDatas = contractDetails;
                }else{
                    //不是刷新  是父进来的
                    this.contractDatas = this.$route.params.contractCCId;
                    sessionStorage.setItem('contractDetails', JSON.stringify(this.$route.params.contractCCId));
                }
            }
            this.getFindCompanyContractById();
        },
        methods:{
            //映射vuex方法
            ...mapActions(["setContractRealData"]),
            //根据企业合同id查询合同详情
            getFindCompanyContractById(){
                let para = {
                    ccId:this.contractDatas
                };
                findCompanyContractById(para).then(res =>{
                    if(res.code == '0'){

                        this.companyContract = res.companyContract;//企业合同基本信息
                        this.companyContacts = res.companyContacts;//企业对接人信息
                        this.companyContractAgreementPaths = res.companyContractAgreementPaths;//上传的合同补充协议路径集合
                        this.companyContractPath = res.companyContractPath;//上传的合同路径
                        this.companyMessage = res.companyMessage;//企业基本信息
                        this.xdlContacts = res.xdlContacts;//薪动力对接人信息

                        /*把获取的企业合同详情数据 存入内存缓存vuex中*/
                        this.setContractRealData(res);
                    }
                })
            },
            //预览合同
            previewContract(path){
                this.pdf_path = '';
                if(path){
                    this.pdf_path = path;
                    this.showReadResult = true;
                }else{
                    this.$message({
                        type:'error',
                        message:'暂无合同'
                    })
                }

            },
            nextPage(){
                if(this.page === this.pageCount){
                    this.$message({
                        type:'warning',
                        message:'当前为最后一页'
                    });
                    return false
                }else{
                    this.page++;
                }

            },
            pervPage(){
                if(this.page === 1){
                    this.$message({
                        type:'warning',
                        message:'当前为第一页'
                    });
                    return false;
                }else{
                    this.page--;
                }

            },
            pdfError(obj){
                if(obj){
                    this.$message({
                        type:'error',
                        message:'文件加载出错'
                    })
                }
            },
            //关闭遮罩层
            handleClose(done) {
                this.pdf_path = '';
                this.page = 1;
                this.currentPages = 1;
                this.pageCount = 0;
            },
        }
    }
</script>

<style scoped lang="scss">
    .container_contract{
        float: left;
        background-color: #fff;
        padding: 0 20px;
        box-sizing: border-box;
    }
    .leftBtn{
        font-size: 50px;position: absolute;left:10px;top: 50%;cursor: pointer;
        &:hover{
            background-color: #1f2d3d;
            opacity: .5;
            color: #fff;
        }
    }
    .rightBtn{
        font-size: 50px;position: absolute;right:10px;top: 50%;cursor: pointer;
        &:hover{
            background-color: #1f2d3d;
            opacity: .5;
            color: #fff;
        }
    }
    .pannel_head {
        padding: 12px 48px 12px 10px;
        border-bottom: 1px solid #0000001c;
        font-size: 16px;
        line-height: 20px;
    }

    .title_head{
        font-size: 15px;
        padding: 12px 0 0 15px;
        box-sizing: border-box;
    }

    .company_item{
        float: left;
        width: 100%;
        border-bottom: 1px solid #dcd4d4;
        padding: 10px 0;
        .el-form-item {
            margin-bottom: 10px;
        }
        .preview{
            color: #4c6eff;
        }
    }
    .totle_all{
        float: left;
        width: 100%;
        box-sizing: border-box;
        margin-bottom: 5px;
        margin-top: 5px;
        .totle_item{
            float: left;
            height: 40px;
            line-height: 40px;
            margin-right: 20px;
            padding: 12px 0 0 15px;
            span{
                font-size: 15px;
                font-weight: 600;
                color: #fc3a14;
            }
            strong{
                color:#000;
            }
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
    .company_phone{
        p{
            margin: 10px 0;

        }
        h4{
            margin: 10px 0;
            padding: 0 20px;
            font-weight: normal;
        }
        strong{
            color: #000;
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
