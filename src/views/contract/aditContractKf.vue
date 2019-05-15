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
                                <strong>{{companyContract.ccPersonTaxRate*100}} %</strong>
                            </p>
                            <p>
                                <span>服务费率：</span>
                                <strong>{{companyContract.ccPersonServicePriceRate*100}} %</strong>
                            </p>
                            <p>
                                <span>发票抵扣率：</span>
                                <strong>{{companyContract.ccInvoice*100}} %</strong>
                            </p>
                            <p>
                                <span>服务总费率：</span>
                                <strong>{{companyContract.ccServiceTotalRate*100}} %</strong>
                            </p>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="body_left">
                            <p>
                                <span>个税承担者：</span>
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
            <!--补充协议 == 客服（客服修改时  肯定有合同）-->
            <div class="company_item">
                <el-row>
                    <el-col :span="24">
                        <div class="title_head">合同协议</div>
                    </el-col>
                </el-row>
                <el-row style="padding: 0 20px;">
                    <el-col :span="24">
                        <p>
                            <span>合同：</span>
                            <a href="javascript:;"
                               v-if="companyContract.ccOpStatus === 0"
                               class="preview" @click="isShowUpLoad = true">上传合同</a>

                            <a href="javascript:;"
                               class="preview"
                               v-if="companyContractPath"
                               @click="previewContract(companyContractPath)">预览</a>

                            <a href="javascript:;"
                               class="preview"
                               v-if="companyContract.ccOpStatus === 1"
                               @click="isShowUpLoad = true">重新上传</a>
                            <a href="javascript:;" class="preview" @click="isShowUpLoad1 = true">上传补充协议</a>
                        </p>
                    </el-col>
                    <el-col :span="24">
                        <p v-for="(val,index) in companyContractAgreementPaths" :key="index">
                            <span v-text="'补充协议'+index+'：'"></span>
                            <a href="javascript:;" class="preview" @click="previewContract(val)">预览</a>
                            <a href="javascript:;" class="preview" @click="deleteContract(index)">删除</a>
                        </p>
                    </el-col>
                </el-row>
            </div>
            <div class="tool">
                <el-button type="primary"  :loading="btnLoading" @click="submitContractOther" size="small"  style="width: 100px;">提交</el-button>
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
        <!--重新上传合同 （只有客服角色有权限）-->
        <el-dialog
                @close="closeEdited"
                class="main"
                title="上传合同"
                :visible.sync="isShowUpLoad">
            <el-upload
                    :headers="headers"
                    drag
                    class="avatar-uploader"
                    :data="reUploadData"
                    :action="upload"
                    :show-file-list="false"
                    :multiple=true
                    :file-list="fileList"
                    :before-upload="beforeUpload"
                    :on-success="success">
                <i  class="el-icon-plus avatar-uploader-icon">点击上传</i>
            </el-upload>
        </el-dialog>
        <!--上传补充协议 （只有客服角色有权限）-->
        <el-dialog
                @close="closeEdited"
                class="main"
                title="上传补充协议"
                :visible.sync="isShowUpLoad1">
            <el-upload
                    :headers="headers"
                    drag
                    class="avatar-uploader"
                    :data="reUploadData"
                    :action="upload"
                    :show-file-list="false"
                    :multiple=true
                    :file-list="fileList1"
                    :before-upload="beforeUpload"
                    :on-success="success1">
                <i  class="el-icon-plus avatar-uploader-icon">点击上传</i>
            </el-upload>
        </el-dialog>
        <!--生成账号-->
        <el-dialog
                   class="main"
                   title="企业账号"
                   :visible.sync="companyAccount">
            <el-row>
                <el-col :span="12">
                    <div class="body_left" style="width: 100%;">
                        <p>
                            <span>企业组：</span>
                            <strong >{{companyMessage.companyGroupName}}</strong>
                        </p>
                        <p>
                            <span>账号使用人姓名：</span>
                            <strong >{{companyMessage.accountName}}</strong>
                        </p>
                        <p>
                            <span>手机号：</span>
                            <strong >{{companyMessage.accountPhone}}</strong>
                        </p>
                        <p>
                            <span>地址：</span>
                            <el-tooltip class="item" effect="dark" :content="companyMessage.province+companyMessage.city+companyMessage.area+companyMessage.address" placement="top">
                                <strong>{{companyMessage.province+companyMessage.city+companyMessage.area+companyMessage.address}}</strong>
                            </el-tooltip>
                        </p>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="body_left"  style="text-align: center;margin-top: 30px;"><img :src="companyMessage.ccOneCertificatesCopyUrl?'data:image/jpeg;base64,'+companyMessage.ccOneCertificatesCopyUrl:''" alt="营业执照" width="128" height="128"></div>
                </el-col>
                <el-col :span="24">
                    <el-form
                            style="padding: 0 20px;"
                            :rules="rules"
                            :model="ruleForm"
                            ref="forms2"
                            inline
                            label-position="left">
                        <el-form-item label="输入账号名称：" prop="accountName">
                            <el-input size="small" v-model="ruleForm.accountName"></el-input>
                        </el-form-item>
                    </el-form>
                </el-col>

            </el-row>
            <el-row style="text-align: center">
                <el-button type="primary"  @click="creatAccount" size="small"  style="width: 100px;">生成账号</el-button>
            </el-row>


        </el-dialog>
    </div>
</template>

<script>
    const pdf  = r => require.ensure([], () => r(require('vue-pdf')), 'pdf');//pdf组件
    import { mapState,mapActions } from 'vuex';
    import {
        findCompanyContractById,//查询合同详细信息
        submitCompanyContract,//上传合同、补充协议
        uploadCompanyContract,//上传合同,
        companyUserConCopyCompanyUserMessage,//根据企业账户Id查询复制信息
        companyUserConAddCompanyUser
    } from '../../api/api';

    export default {
        name: "aditContractKf",
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
                /*重新上传合同*/
                upload_pdf_path:'',//合同地址
                isShowUpLoad:false,
                upload:uploadCompanyContract,
                headers:{
                    CsrfRandomToken:''
                },
                fileList:[],//上传的文件列表
                /*上传补充协议*/
                isShowUpLoad1:false,
                fileList1:[],
                /*合同相关*/
                reUploadData:{
                    ccId:''
                },
                /*企业账号*/
                companyAccount:false,
                ruleForm:{
                    accountName:''
                },
                rules:{
                    accountName: [
                        { required: true, message: '请输入账号名称', trigger: 'blur' }
                    ],
                },
                /*接口返回*/
                companyContract:{},//企业合同基本信息
                companyContacts:[],//企业对接人信息
                companyContractAgreementPaths:[],//上传的合同补充协议路径集合
                companyContractPath:'',//上传的合同路径
                companyMessage:{},//企业基本信息
                xdlContacts:[],//薪动力对接人信息
            }
        },
        components:{
            pdf
        },
        computed:{
            //映射State
            ...mapState({
                contractRealData: state => state.contractRealData,//合同详情
            }),
        },
        mounted(){
            //保存合同Id到sessionStorage
            let contractCcId =  JSON.parse(sessionStorage.getItem('contractCcId'));
            if(!contractCcId){
                //第一次 进入
                let contractId = this.$route.params.contractCCId;
                this.reUploadData.ccId = contractId;
                //存储一下合同Id 避免刷新时 没数据
                sessionStorage.setItem('contractCcId', JSON.stringify(contractId));
                //第一次进入查询 缓存中有 此ccid的合同详情数据么
                if(this.contractRealData.companyContract){
                    if(contractId === this.contractRealData.companyContract.ccId){
                        //有数据
                        this.companyContract = this.contractRealData.companyContract;//企业合同基本信息
                       // this.contactList = this.contractRealData.companyContacts;//企业对接人信息
                        if(this.companyContractAgreementPaths){
                            this.companyContractAgreementPaths =this.contractRealData.companyContractAgreementPaths;//上传的合同补充协议路径集合
                        }
                        this.companyContractPath = this.contractRealData.companyContractPath;//上传的合同路径
                        this.companyMessage = this.contractRealData.companyMessage;//企业基本信息
                       // this.contactList1 = this.contractRealData.xdlContacts;//薪动力对接人信息

                    }else{
                        //无数据  需要请求接口获取数据
                        this.getFindCompanyContractById(contractId)
                    }

                }else{
                    //无数据  需要请求接口获取数据
                    this.getFindCompanyContractById(contractId)
                }
            }else {
                //this.reUploadData.ccId = contractCcId;//保存合同ID
                if(this.$route.params&&!this.$route.params.contractCCId){
                    //$route不存在 说明为刷新  vuex缓存肯定没有合同详情数据了=> 请求接口
                    this.reUploadData.ccId = contractCcId;//保存合同ID
                    this.getFindCompanyContractById(contractCcId)
                }else{
                    //you params 不是刷新 session存在 contractId  说明是父又一次进来的
                    let contractId = this.$route.params.contractCCId;
                    this.reUploadData.ccId = contractId;//保存合同ID
                    sessionStorage.setItem('contractCcId', JSON.stringify(contractId));
                    if(this.contractRealData.companyContract){
                        //有数据
                        if(contractId === this.contractRealData.companyContract.ccId){
                            this.companyContract = this.contractRealData.companyContract;//企业合同基本信息
                            //this.contactList = this.contractRealData.companyContacts;//企业对接人信息
                            if(this.companyContractAgreementPaths){
                                this.companyContractAgreementPaths = this.contractRealData.companyContractAgreementPaths;//上传的合同补充协议路径集合
                            }
                            this.companyContractPath = this.contractRealData.companyContractPath;//上传的合同路径
                            this.companyMessage = this.contractRealData.companyMessage;//企业基本信息
                            //this.contactList1 = this.contractRealData.xdlContacts;//薪动力对接人信息
                        }else{
                            //无数据  需要请求接口获取数据
                            this.getFindCompanyContractById(contractId)
                        }
                    }else{
                        //无数据  需要请求接口获取数据
                        this.getFindCompanyContractById(contractId)
                    }
                }
            }
        },
        methods:{
            //映射vuex方法
            ...mapActions(["setContractRealData"]),
            //根据企业合同id查询合同详情
            getFindCompanyContractById(contractId){
                let para = {
                    ccId:contractId
                };
                findCompanyContractById(para).then(res =>{
                    if(res.code == '0'){
                        this.companyContract = res.companyContract;//企业合同基本信息
                        this.companyContacts = res.companyContacts;//企业对接人信息
                        if(res.companyContractAgreementPaths){
                            this.companyContractAgreementPaths = res.companyContractAgreementPaths;//上传的合同补充协议路径集合
                        }
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
            //生成账号
            creatAccount(){
                this.$refs['forms2'].validate((valid) =>{
                    if (valid) {
                        let para = {
                            cuCompanyId:this.companyContract.ccCompanyId,
                            cuLoginName:this.ruleForm.accountName,
                            cuUserName:this.companyMessage.accountName,
                            cuUserPhone:this.companyMessage.accountPhone,
                        };
                        companyUserConAddCompanyUser(para).then(res =>{
                            if(res){
                                if(res.code === '0'){
                                    this.$message({
                                        type:'success',
                                        message:'生成账号成功'
                                    });
                                    this.companyAccount = false;
                                    this.$router.push({
                                        path:'/home/contractIndex/contract',
                                        name:'合同列表'
                                    })
                                }
                            }else{
                                this.$message({
                                    type:'error',
                                    message:res.message
                                });
                            }
                        })
                    } else {
                        return false;
                    }
                });

            },
            creatCompanyAccount(){
                this.$confirm('是否生成账号?', '提示', {
                    confirmButtonText: '是',
                    cancelButtonText: '否',
                    type: 'info'
                }).then(() => {
                    //生成账号
                    this.companyAccount = true;

                }).catch(() => {
                    this.companyAccount = false;
                     this.$router.push({
                         path:'/home/contractIndex/contract',
                         name:'合同列表'
                     })
                });
            },
            //提交合同、补充协议信息
            submitContractOther(){
                //处理补充协议集合
                let contractArr = this.companyContractAgreementPaths,str = '';
                for(let i = 0,l = contractArr.length;i < l;i++){
                    str += ','+contractArr[i];
                }
                str = str.substring(1);
                let para = {
                    ccId:this.reUploadData.ccId,//企业合同Id
                    companyContractPath:this.companyContractPath,//合同路径
                    companyContractAgreementPaths:str,//合同补充协议路径集合，多个使用,分隔
                };
                submitCompanyContract(para).then(res =>{
                    if(res.code == '0'){
                        this.$message({
                            type:'success',
                            message:'上传成功'
                        });
                        this.creatCompanyAccount();
                    }else{
                        this.$message({
                            type:'error',
                            message:res.message
                        });
                    }
                })
            },
            //删除补充协议
            deleteContract(index){
                this.companyContractAgreementPaths.splice(index,1);
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
            /*
            * 上传合同、上传补充协议
            * */
            //初始化数据
            closeEdited(data) {
                //关闭dialog框
                this.fileList = [];
                this.fileList1 = [];
            },
            /*
           * 重新上传合同
           * */
            //获取cookie
            getCookie() {
                let cookie = $.cookie('CsrfRandomToken'), _this = this;
                if(!cookie){
                    $.ajax({
                        type:'get',
                        url:configAll.serviceUrl.base+'/payroll-enterprise/cookieCon/addCookies',
                        beforeSend:function (XMLHttpRequest) {
                            XMLHttpRequest.setRequestHeader("CsrfRandomToken", '');
                        },
                        async:false,
                        success:function (res) {
                            _this.cookie = $.cookie('CsrfRandomToken');
                        }
                    });
                }else{
                    _this.cookie = cookie;
                }
            },
            beforeUpload(file){
                const isPdf = (
                    file.type ==  file.type == 'application/pdf'  || file.name.indexOf(".pdf") > 0);

                if (!isPdf) {
                    this.$message.error('只能上传PDF文件!');
                    return false;
                }
                this.getCookie();
                this.headers.CsrfRandomToken =  this.cookie;
            },
            success(response, file, fileList){
                this.fileList = fileList;
                this.upload_pdf_path = response.path;
                this.companyContractPath = response.path;
                this.isShowUpLoad = false;
                this.$message({
                    type:'success',
                    message:response.message
                })
            },
            success1(response, file, fileList){
                this.fileList1 = fileList;
                console.log(this.companyContractAgreementPaths)
                this.companyContractAgreementPaths.push(response.path);
                this.$message({
                    type:'success',
                    message:response.message
                });
                this.isShowUpLoad1 = false;
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
    .tool {
        text-align: center;
        height: 40px;
        width: 100%;
        float: left;
        margin-top: 20px;
        margin-bottom: 20px;
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
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;

        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader{
        display: flex;
        justify-content: center;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 300px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>
