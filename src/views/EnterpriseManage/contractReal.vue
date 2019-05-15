<template>
    <div class="box">
        <div class="pannel_head">
            <span>合同详情</span>
            <span style="float: right;color: #409EFF;cursor: pointer;" @click="historyContract">历史合同</span>
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
                        <p>
                            <span>企业名称：</span>
                            <strong v-text="conCompanyMessage.companyName?conCompanyMessage.companyName:''"></strong>
                        </p>
                        <p>
                            <span>签署日期：</span>
                            <strong>{{conCompanyContract.ccSignTime}}</strong>
                        </p>
                        <p>
                            <span>到账通知：</span>
                            <strong v-text="conCompanyContract.ccToAccountNotice === 0?'不通知':'通知'"></strong>
                        </p>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="body_left">
                        <p>
                            <span>有效期：</span>
                            <strong v-text="conCompanyContract.ccStartDate+'-'+conCompanyContract.ccEndDate"></strong>
                        </p>
                        <p>
                            <span>签约主体：</span>
                            <strong v-text="conCompanyContract.signTheme"></strong>
                        </p>
                    </div>
                </el-col>
            </el-row>
        </div>
        <!--业务信息-->
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
                            <strong v-text="conCompanyContract.ccPersonTaxRate*100+'%'"></strong>
                        </p>
                        <p>
                            <span>服务费率：</span>
                            <strong v-text="conCompanyContract.ccPersonServicePriceRate*100+'%'"></strong>
                        </p>
                        <p>
                            <span>发票抵扣率：</span>
                            <strong v-text="conCompanyContract.ccInvoice*100+'%'"></strong>
                        </p>
                        <p>
                            <span>服务总费率：</span>
                            <strong v-text="conCompanyContract.ccServiceTotalRate*100+'%'"></strong>
                        </p>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="body_left">
                        <p>
                            <span>个税承担者：</span>
                            <strong v-text="conCompanyContract.ccTaxBear === 0?'个人':'企业'"></strong>
                        </p>
                        <p>
                            <span>服务费承担者：</span>
                            <strong v-text="conCompanyContract.ccServiceBear === 0?'个人':'企业'"></strong>
                        </p>
                        <p>
                            <span>发票个人承担者：</span>
                            <strong v-text="conCompanyContract.ccInvoceBear === 0?'个人':'企业'"></strong>
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
            <el-row>
                <el-col :span="24">
                    <h4>甲方</h4>
                </el-col>
            </el-row>
            <el-row style="padding: 0 20px;">
                <el-col :span="24" v-for="(val,index) in conCompanyContacts" :key="index">
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
            <!--内部联系人-->
            <el-row>
                <el-col :span="24">
                    <h4>乙方</h4>
                </el-col>
            </el-row>
            <el-row style="padding: 0 20px;" >
                <el-col :span="24" v-for="(val,index) in xdlContacts" :key="index">
                    <el-col :span="6">
                        <p>
                            <span>公司职位：</span>
                            <strong v-text="val.jobTitile"></strong>
                        </p>
                    </el-col>
                    <el-col :span="6">
                        <p>
                            <span>联系人姓名：</span>
                            <strong v-text="val.name"></strong>
                        </p>
                    </el-col>
                    <el-col :span="6">
                        <p>
                            <span>联系方式：</span>
                            <strong v-text="val.phone"></strong>
                        </p>
                    </el-col>
                    <el-col :span="6">
                        <p>
                            <span>邮箱：</span>
                            <strong v-text="val.email"></strong>
                        </p>
                    </el-col>
                </el-col>
            </el-row>

        </div>
        <!--补充协议-->
        <div class="company_item" v-if="conCompanyContract.ccUploadStatus === 1">
            <el-row>
                <el-col :span="24">
                    <div class="title_head">合同协议</div>
                </el-col>
            </el-row>
            <el-row style="padding: 0 20px;">
                <el-col :span="24">
                    <p>
                        <span>合同：</span>
                        <a href="javascript:;" class="preview" @click="previewContract(conCompanyContractPath)">预览</a>
                    </p>
                </el-col>
                <el-col :span="24">
                    <p v-for="(val,index) in conCompanyContractAgreementPaths" :key="index">
                        <span v-text="'补充协议'+index+':'"></span>
                        <a href="javascript:;" class="preview" @click="previewContract(val)">预览</a>
                    </p>
                </el-col>
            </el-row>
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
    import {
        findCompanyContractById,//查询企业合同信息接口

    } from '../../api/api';
    export default {
        data(){
            return{
                /*params*/
                ccId:'',//公司信息
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
                conCompanyContract:{},
                conCompanyContacts:[],
                xdlContacts:[],
                conCompanyContractAgreementPaths:'',
                conCompanyContractPath:'',
                conCompanyMessage:{},
            }
        },
        components:{
            pdf
        },
        mounted(){
            //合同id  存入session
            let ccId =  sessionStorage.getItem('ccId');
            if(!ccId){
                //第一次 进入合同详情
                sessionStorage.setItem('ccId', JSON.stringify(this.$route.params.ccId));
                this.ccId = this.$route.params.ccId;
            }else{
                if(this.$route.params&&!this.$route.params.ccId){
                    //$route不存在 说明为刷新
                    this.ccId = JSON.parse(ccId);
                }else{
                    //不是刷新  是父进来的
                    this.ccId = this.$route.params.ccId;
                    sessionStorage.setItem('ccId', JSON.stringify(this.$route.params.ccId));
                }
            }
            this.getFindCompanyContractById();
        },
        methods:{
            getFindCompanyContractById(){
                let para = {
                    ccId:this.ccId
                };
                findCompanyContractById(para).then(res =>{
                    if(res.code == '0'){
                        this.conCompanyContract = res.companyContract;
                        this.conCompanyContacts = res.companyContacts;
                        this.conCompanyContractAgreementPaths = res.companyContractAgreementPaths;
                        this.conCompanyContractPath = res.companyContractPath;
                        this.conCompanyMessage = res.companyMessage;
                        this.xdlContacts = res.xdlContacts;
                    }
                })
            },
            //历史合同
            historyContract(){
                this.$router.push({
                    path:'/home/historyContract',
                    name:'历史合同'
                });
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
