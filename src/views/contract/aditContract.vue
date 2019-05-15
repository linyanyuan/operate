<template>
    <div class="box">
        <div class="container_contract">
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
                                <strong v-text="companyMessage.companyName"></strong>
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
            <!--签约信息-->
            <div class="company_item baseMes">
                <el-row>
                    <el-col :span="24">
                        <div class="title_head">签约信息</div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-form label-width="100px"
                             :rules="rules"
                             :model="ruleForm"
                             ref="forms1"
                             label-position="left">
                        <el-col :span="12">
                            <el-form-item style="padding: 0 20px;" label="签署日期" prop="ccSignTime">
                                <el-date-picker
                                        v-model="ruleForm.ccSignTime"
                                        type="date"
                                        size="small"
                                        value-format="yyyy-MM-dd"
                                        placeholder="选择签署日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item style="padding: 0 20px;" label="签约主体" prop="signTheme">
                                <el-select
                                        size="small"
                                        clearable
                                        @visible-change="visChange"
                                        @change="itemSelect1"
                                        v-model="ruleForm.signTheme"
                                        placeholder="企业组(可搜索)"
                                        filterable>
                                    <el-option
                                            v-for="item in SubjectData"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.name">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item style="padding: 0 20px;" label="有效期" prop="timeRange">
                                <el-date-picker
                                        v-model="ruleForm.timeRange"
                                        size="small"
                                        unlink-panels
                                        @change="timeRangeChange"
                                        value-format="yyyy-MM-dd"
                                        type="daterange"
                                        range-separator="至"
                                        start-placeholder="有效开始日期"
                                        end-placeholder="有效开始日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24" style="padding: 0 20px;">
                            <el-form-item label="到账通知" >
                                <el-radio-group v-model="ruleForm.ccToAccountNotice">
                                    <el-radio :label="0">否</el-radio>
                                    <el-radio :label="1">是</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </el-row>
            </div>
            <!--业务信息-->
            <div class="company_item baseMes">
                <el-row>
                    <el-col :span="24">
                        <div class="title_head">业务信息</div>
                    </el-col>
                </el-row>

                <el-row>
                    <el-form label-width="120px"
                             :rules="rules"
                             :model="ruleForm"
                             ref="forms2"
                             label-position="left">
                        <el-col :span="12" style="padding: 0 20px;">
                            <el-form-item label="个税率"  prop="ccPersonTaxRate">
                                <el-input size="small" style="width:180px;" v-model="ruleForm.ccPersonTaxRate"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" style="padding: 0 20px;">
                            <el-form-item label="个税承担主体" >
                                <el-radio-group v-model="ruleForm.ccTaxBear">
                                    <el-radio :label="0">个人</el-radio>
                                    <el-radio :label="1">企业</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" style="padding: 0 20px;">
                            <el-form-item label="服务费率"  prop="ccPersonServicePriceRate">
                                <el-input size="small" style="width:180px;" v-model="ruleForm.ccPersonServicePriceRate"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" style="padding: 0 20px;">
                            <el-form-item  label="服务费承担主体">
                                <el-radio-group v-model="ruleForm.ccServiceBear">
                                    <el-radio :label="0">个人</el-radio>
                                    <el-radio :label="1">企业</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" style="padding: 0 20px;">
                            <el-form-item label="发票抵扣税率" prop="ccInvoice">
                                <el-input size="small" style="width:180px;" v-model="ruleForm.ccInvoice"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" style="padding: 0 20px;">
                            <el-form-item label="发票个人承担者">
                                <el-radio-group v-model="ruleForm.ccInvoceBear">
                                    <el-radio :label="0">个人</el-radio>
                                    <el-radio :label="1">企业</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <!--<el-col :span="12" style="padding: 0 20px;">
                            <el-form-item label="服务总费率" prop="ccServiceTotalRate">
                                <el-input size="small" style="width:180px;" v-model="ruleForm.ccServiceTotalRate"></el-input>
                            </el-form-item>
                        </el-col>-->
                    </el-form>
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
                <el-row >
                    <el-col :span="24">
                        <el-form inline
                                 label-width="100px"
                                 label-position="left"
                                 :rules="rules"
                                 :model="contactList[index]"
                                 :ref="'formsR'+index"
                                 v-for="(val,index) in contactList"
                                 :key="index">
                            <div class="body_left">
                                <el-form-item label="联系人姓名" prop="name">
                                    <el-input size="mini" class="addClass" v-model="val.name"></el-input>
                                </el-form-item>
                            </div>
                            <div class="body_left">
                                <el-form-item label="联系方式" prop="phone">
                                    <el-input size="mini" class="addClass" v-model="val.phone"></el-input>
                                </el-form-item>
                            </div>
                            <div class="body_left">
                                <el-form-item label="邮箱" prop="email">
                                    <el-input size="mini" class="addClass" v-model="val.email"></el-input>
                                </el-form-item>
                                <el-button type="text" size="mini" @click="addContract">添加</el-button>
                                <el-button v-if="index>0" type="text" size="mini" @click="delContract(index)">删除</el-button>
                            </div>

                        </el-form>
                    </el-col>
                </el-row>
                <!--内部联系人-->
                <el-row>
                    <el-col :span="24">
                        <h4>乙方</h4>
                    </el-col>
                </el-row>
                <el-row >
                    <el-col :span="24">
                        <el-form inline
                                 label-width="100px"
                                 label-position="left"
                                 :rules="rules"
                                 :model="contactList1[index]"
                                 :ref="'formsM'+index"
                                 v-for="(val,index) in contactList1"
                                 :key="index">
                            <el-col :span="10">
                                <div class="body_left">
                                    <el-form-item label="公司职位" prop="jobTitile">
                                        <el-input size="mini" class="addClass1" v-model="val.jobTitile"></el-input>
                                    </el-form-item>
                                </div>

                            </el-col>
                            <el-col :span="14">
                                <div class="body_left">
                                    <el-form-item label="联系人姓名" prop="name">
                                        <el-input size="mini" class="addClass1" v-model="val.name"></el-input>
                                    </el-form-item>
                                </div>

                            </el-col>
                            <el-col :span="10">
                                <div class="body_left">
                                    <el-form-item label="联系方式" prop="phone">
                                        <el-input size="mini" class="addClass1" v-model="val.phone"></el-input>
                                    </el-form-item>
                                </div>

                            </el-col>
                            <el-col :span="14">
                                <div class="body_left">
                                    <el-form-item label="邮箱" prop="email">
                                        <el-input size="mini" class="addClass1" v-model="val.email"></el-input>
                                    </el-form-item>
                                    <el-button type="text" size="mini" @click="addContract1">添加</el-button>
                                    <el-button v-if="index>0" type="text" size="mini" @click="delContract1(index)">删除</el-button>
                                </div>

                            </el-col>
                        </el-form>
                    </el-col>
                </el-row>

            </div>
            <!--补充协议 == 销售-->
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

            <div class="tool">
                <el-button type="primary"  :loading="btnLoading" @click="submitContract" size="small"  style="width: 100px;">提交</el-button>
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
    import {mapState,mapActions} from 'vuex';
    import {
        findCompanyContractById,//查询合同详细信息
        findSubject,//查询签约主体
        addContract,//提交合同


    } from '../../api/api';
   const pdf  = r => require.ensure([], () => r(require('vue-pdf')), 'pdf');//pdf组件
    import util from '../../utils/util';
    let validPhone=(rule, value,callback)=>{
        if (!value){
            callback(new Error('联系方式必填'));
        }else  if (!util.isvalidPhone(value)){
            callback(new Error('请输入正确的11位手机号码'))
        }else {
            callback()
        }
    };
    let validEmail=(rule, value,callback)=>{
        if (!value){
            callback(new Error('邮箱必填'));
        }else  if (!util.isvalidEmail(value)){
            callback(new Error('请输入正确格式邮箱'))
        }else {
            callback()
        }
    };
    export default {
        name: "adit-contract",
        data(){
            return{
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
                /*合同相关*/
                reUploadData:{
                    ccId:''
                },

                /*rule*/
                rules:{
                    ccSignTime: [
                        { required: true, message: '请选择签署日期', trigger: 'blur' }
                    ],
                    signTheme: [
                        { required: true, message: '请选择签署主体', trigger: 'blur' }
                    ],
                    timeRange: [
                        { required: true, message: '请选择有效期', trigger: 'blur' }
                    ],
                    ccPersonTaxRate: [
                        { required: true, message: '请输入个税率', trigger: 'blur' }
                    ],
                    ccPersonServicePriceRate: [
                        { required: true, message: '请输入服务费率', trigger: 'blur' }
                    ],
                    ccInvoice: [
                        { required: true, message: '请输入发票折扣税率', trigger: 'blur' }
                    ],
                    ccServiceTotalRate: [
                        { required: true, message: '请输入总费率', trigger: 'blur' }
                    ],
                    name: [
                        { required: true,trigger: 'blur', message: '请输入联系人姓名'}
                    ],
                    phone: [
                        { required: true,trigger: 'blur',validator: validPhone}
                    ],
                    email: [
                        { required: true,trigger: 'blur', validator: validEmail}
                    ],
                    jobTitile: [
                        { required: true,trigger: 'blur', message: '请输入公司职位'}
                    ],


                },
                /*动态添加联系人*/
                contactList:[
                    {name:'',phone:'',email:''}
                ],
                contactList1:[
                    {jobTitile:'',name:'',phone:'',email:''}
                ],
                resultArr:[],
                /*v-model-提交参数*/
                ruleForm:{
                    ccId:'',//合同ID
                    ccName:'',//合同名称
                    ccCompanyId:'',//企业编号
                    ccSignTime:'',//签署时间 格式： yyyy-MM-dd
                    signTheme:'',//签约主ti
                    timeRange:'',
                    ccStartDate:'',//开始日期
                    ccEndDate:'',//结束日期
                    ccToAccountNotice:0,//到账通知: 0不通知，1通知，默认0
                    ccPersonTaxRate:'',//个税率
                    ccTaxBear:0,//个税承担者：0：个人承担  1：企业承担
                    ccPersonServicePriceRate:'',//个人服务费率
                    ccServiceBear:0,//个人服务费承担着 0：个人承担 * 1：企业承担
                    ccInvoice:'',//发票率
                    ccInvoceBear:0,//发票个人承担者；0：个人承担，1：企业承担
                    ccServiceTotalRate:'',//服务总费率
                    companyContactsStr:'',//企业联系人集合字符串
                    xdlContactsStr:'',//小福联系人集合字符串
                },
                /*合同详情数据*/
                menuDatas:{},//权限数据
                /*接口返回*/
                SubjectData:[],//签约主体信息
                companyContract:{},//企业合同基本信息
                companyContacts:{},//企业对接人信息
                companyContractAgreementPaths:[],//上传的合同补充协议路径集合
                companyContractPath:'',//上传的合同路径
                companyMessage:{},//企业基本信息
                xdlContacts:{},//薪动力对接人信息
            }
        },
        computed:{
            //映射State
            ...mapState({
                contractRealData: state => state.contractRealData,//合同详情
                subjects: state => state.Subject,//签约主体
                menuData:state => state.menuData,//权限生成后的菜单
            }),
        },
        components:{
            pdf
        },
        mounted(){
            this.getMenuDatas();
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
                        this.contactList = this.contractRealData.companyContacts;//企业对接人信息
                        this.companyContractAgreementPaths = this.contractRealData.companyContractAgreementPaths;//上传的合同补充协议路径集合
                        this.companyContractPath = this.contractRealData.companyContractPath;//上传的合同路径
                        this.companyMessage = this.contractRealData.companyMessage;//企业基本信息
                        this.contactList1 = this.contractRealData.xdlContacts;//薪动力对接人信息
                        let temps = this.contractRealData;
                        this.setRuleForm(temps)
                    }else{
                        //无数据  需要请求接口获取数据
                        this.getFindCompanyContractById(contractId)
                    }

                }else{
                    //无数据  需要请求接口获取数据
                    this.getFindCompanyContractById(contractId)
                }
            }else{
                this.reUploadData.ccId = contractCcId;
                if(this.$route.params&&!this.$route.params.contractCCId){
                    //$route不存在 说明为刷新  vuex缓存肯定没有合同详情数据了=> 请求接口
                    this.getFindCompanyContractById(contractCcId)
                }else{
                    //不是刷新 session存在 contractId  说明是父又一次进来的
                    let contractId = this.$route.params.contractCCId;
                    sessionStorage.setItem('contractCcId', JSON.stringify(contractId));
                    if(this.contractRealData.companyContract){
                        //有数据
                        if(contractId === this.contractRealData.companyContract.ccId){
                            this.companyContract = this.contractRealData.companyContract;//企业合同基本信息
                            this.contactList = this.contractRealData.companyContacts;//企业对接人信息
                            this.companyContractAgreementPaths = this.contractRealData.companyContractAgreementPaths;//上传的合同补充协议路径集合
                            this.companyContractPath = this.contractRealData.companyContractPath;//上传的合同路径
                            this.companyMessage = this.contractRealData.companyMessage;//企业基本信息
                            this.contactList1 = this.contractRealData.xdlContacts;//薪动力对接人信息
                            let temps = this.contractRealData;
                            this.setRuleForm(temps)
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
            //查找内存是否有 签约主体数据
            if(this.subjects.length > 0){
                this.SubjectData = this.subjects;
            }else{
                this.getFindSubject()
            }

        },
        methods:{
            //映射vuex方法
            ...mapActions(["setContractRealData","setSubject","setMenuData"]),
            //根据企业合同id查询合同详情
            getFindCompanyContractById(contractId){
                let para = {
                    ccId:contractId
                };
                findCompanyContractById(para).then(res =>{
                    if(res.code == '0'){
                        this.companyContract = res.companyContract;//企业合同基本信息
                        this.contactList = res.companyContacts;//企业对接人信息
                        this.companyContractAgreementPaths = res.companyContractAgreementPaths;//上传的合同补充协议路径集合
                        this.companyContractPath = res.companyContractPath;//上传的合同路径
                        this.companyMessage = res.companyMessage;//企业基本信息
                        this.contactList1 = res.xdlContacts;//薪动力对接人信息
                        let temps = res;
                        this.setRuleForm(temps);
                        /*把获取的企业合同详情数据 存入内存缓存vuex中*/
                        this.setContractRealData(res);
                    }
                })
            },
            //添加上传合同
            submitContract(){
                let formArr=['forms1','forms2'],PartyA = [],PartyB = [],datasA = this.contactList,datasB = this.contactList1;
                for(let i = 0,l = datasA.length;i < l;i++){
                    formArr.push('formsR'+i);
                    PartyA.push({
                        name:datasA[i].name,
                        phone:datasA[i].phone,
                        email:datasA[i].email,
                    })
                }
                for(let k = 0,m = datasB.length;k < m;k++){
                    formArr.push('formsM'+k);
                    PartyB.push({
                        name:datasB[k].name,
                        phone:datasB[k].phone,
                        email:datasB[k].email,
                        jobTitile:datasB[k].jobTitile,
                    })
                }
                this.ruleForm.companyContactsStr = JSON.stringify(PartyA);
                this.ruleForm.xdlContactsStr = JSON.stringify(PartyB);
                this.ruleForm.ccCompanyId = this.companyMessage.id;
                this.ruleForm.ccId = this.companyContract.ccId;//合同ID
                this.ruleForm.ccName = this.companyContract.ccName;//合同ID
                this.resultArr = [];
                formArr.forEach(item => { //根据表单的ref校验
                    this.checkForm(item)
                });
                let selfs = this;
                Promise.all(this.resultArr).then(function(res) {
                    //都通过了
                    //验证全部通过的时候
                    let results = res,isSubmit = true;
                    results.forEach(val =>{
                        if(!val){
                            isSubmit = false;
                            return false;
                        }
                    });
                    if(isSubmit){
                        selfs.btnLoading = true;
                        let tempsArr = [new Promise(function(resolve){
                            selfs.submitContractMes(resolve)
                        })];
                        Promise.all(tempsArr).then(function(result){
                            selfs.btnLoading = false;
                            let submitSuccess = result,isSubmitOk = true;
                            submitSuccess.forEach(val =>{
                                if(val.code != '0'){
                                    isSubmitOk = false;
                                    selfs.$message({
                                        type:'error',
                                        message:res.message
                                    });
                                    return false;
                                }
                            });
                            if(isSubmitOk){
                               // sessionStorage.removeItem('contractCcId');
                                selfs.setContractRealData('');
                                selfs.$message({
                                    type:'success',
                                    message:'修改成功'
                                });
                                selfs.$router.push({
                                    path:'/home/contractIndex/contract',
                                    name:'合同列表'
                                });
                            }

                        });
                    }
                })
            },
            //提交合同信息
            submitContractMes(callback){
                let para = {
                    ccId:this.ruleForm.ccId,//合同id（编辑时必填）N
                    ccName:this.ruleForm.ccName,//合同名称
                    ccCompanyId:this.ruleForm.ccCompanyId,//企业id Y
                    ccCompanyName:this.companyMessage.companyName,//企业名称 Y
                    ccStartDate:this.ruleForm.ccStartDate,//开始日期Y
                    ccEndDate:this.ruleForm.ccEndDate,//结束日期
                    ccToAccountNotice:this.ruleForm.ccToAccountNotice,//到账通知: 0不通知，1通知，默认0
                    ccSignTime:this.ruleForm.ccSignTime,//签署时间 格式： yyyy-MM-dd
                    signTheme:this.ruleForm.signTheme,//签约主题
                    ccPersonTaxRate:this.ruleForm.ccPersonTaxRate,//个税率
                    ccInvoice:this.ruleForm.ccInvoice,//发票率
                    ccInvoceBear:this.ruleForm.ccInvoceBear,//发票个人承担者；0：个人承担，1：企业承担
                    ccTaxBear:this.ruleForm.ccTaxBear,//个税承担者：0：个人承1：企业承担
                    ccServiceBear:this.ruleForm.ccServiceBear,//个人服务费承担着
                    ccPersonServicePriceRate:this.ruleForm.ccPersonServicePriceRate,//个人服务费率
                    ccServiceTotalRate:this.ruleForm.ccServiceBear,//服务总费率
                    companyContactsStr:this.ruleForm.companyContactsStr,//企业联系人集合字符串
                    xdlContactsStr:this.ruleForm.xdlContactsStr,//小福联系人集合字符串
                };
                addContract(para).then(res =>{
                    if(res.code == '0'){
                        callback(res)
                    }else{
                        this.$message({
                            type:'error',
                            message:res.message
                        });
                    }
                },err =>{
                    this.btnLoading = false;
                })
            },

            checkForm(formName) {
                //封装验证表单的函数
                let _self = this;
                let result = new Promise(function(resolve, reject) {
                    if(_self.$refs[formName].length>0){
                        _self.$refs[formName][0].validate((valid) => {
                            if (valid) {
                                resolve(valid);
                            } else { reject() }
                        })
                    }else{
                        _self.$refs[formName].validate((valid) => {
                            if (valid) {
                                resolve(valid);
                            } else { reject() }
                        })
                    }

                });
                this.resultArr.push(result); //push 得到promise的结果
            },
            //查询签约主体
            getFindSubject(){
                findSubject().then(res =>{
                    if(res){
                        this.SubjectData = res;
                        this.setSubject(res);
                    }
                })
            },
            //获取 权限信息
            getMenuDatas(){
                if(this.menuData.length>0){
                    //当内存有缓存的时候  直接提取store里面菜单
                    this.menuDatas =  this.menuData.resources[0];
                }else{
                    //当刷新的时候  store内存清空了
                    let temps =  JSON.parse(sessionStorage.getItem('menuData'));
                    if(temps){
                        this.setMenuData(temps);
                        this.menuDatas =   temps.resources[0];
                    }
                }
            },
            //回显 数据
            setRuleForm(temps){
                this.ruleForm = {
                    ccId:temps.companyContract.ccId,//合同ID
                    ccName:temps.companyContract.ccName,//合同名称
                    ccCompanyId:temps.companyContract.ccCompanyId,//企业编号
                    ccSignTime:temps.companyContract.ccSignTime,//签署时间 格式： yyyy-MM-dd
                    signTheme:temps.companyContract.signTheme,//签约主ti
                    timeRange:[temps.companyContract.ccStartDate,temps.companyContract.ccEndDate],
                    ccStartDate:temps.companyContract.ccStartDate,//开始日期
                    ccEndDate:temps.companyContract.ccEndDate,//结束日期
                    ccToAccountNotice:temps.companyContract.ccToAccountNotice,//到账通知: 0不通知，1通知，默认0
                    ccPersonTaxRate:temps.companyContract.ccPersonTaxRate*100,//个税率
                    ccTaxBear:temps.companyContract.ccTaxBear,//个税承担者：0：个人承担  1：企业承担
                    ccPersonServicePriceRate:temps.companyContract.ccPersonServicePriceRate*100,//个人服务费率
                    ccServiceBear:temps.companyContract.ccServiceBear,//个人服务费承担着 0：个人承担 * 1：企业承担
                    ccInvoice:temps.companyContract.ccInvoice*100,//发票率
                    ccInvoceBear:temps.companyContract.ccInvoceBear,//发票个人承担者；0：个人承担，1：企业承担
                    ccServiceTotalRate:temps.companyContract.ccServiceTotalRate,//服务总费率
                    companyContactsStr:temps.companyContactsStr,//企业联系人集合字符串
                    xdlContactsStr:temps.xdlContactsStr,//小福联系人集合字符串
                };
            },
            //日期改变
            timeRangeChange(){
                this.ruleForm.ccStartDate = this.ruleForm.timeRange[0];
                this.ruleForm.ccEndDate = this.ruleForm.timeRange[1];
            },
            //添加对接人
            addContract(){
                let cope = {
                    name:'',
                    phone:'',
                    email:''
                };
                this.contactList.push(cope);
            },
            //删除对接人
            delContract(index){
                this.contactList.splice(index,1);
            },
            addContract1(){
                let cope = {
                    jobTitile:'',
                    name:'',
                    phone:'',
                    email:''
                };
                this.contactList1.push(cope);
            },
            //删除对接人
            delContract1(index){
                this.contactList1.splice(index,1);
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
    .company_phone{
        border-bottom: none;
        h4{
            margin: 10px 0;
            padding: 0 20px;
            font-weight: normal;
        }
        .addClass{
            width: 150px;
        }

    }
    .container_contract{
        float: left;
        background-color: #fff;
        padding: 0 20px;
        box-sizing: border-box;
    }
    .pannel_head {
        padding: 12px 48px 12px 10px;
        border-bottom: 1px solid #0000001c;
        font-size: 16px;
        line-height: 20px;
    }

    .title_head{
        font-size: 15px;
        padding: 12px 0 15px 15px;
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
    .company_item{
        float: left;
        width: 100%;
        border-bottom: 1px solid #dcd4d4;
        padding: 10px 0;
        /*.el-form-item {
            margin-bottom: 10px;
        }*/
        .preview{
            color: #4c6eff;
        }
    }
    .body_left{
        float: left;
        padding: 0 20px;
        margin-right: 50px;
       /* width: 300px;*/
        width: auto;
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
