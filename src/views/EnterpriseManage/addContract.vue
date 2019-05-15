<template>
    <div class="addContract">
        <div class="pannel_head">添加合同</div>
        <div class="company_item baseMes">
            <el-row>
                <el-col :span="24">
                    <div class="title_head">基本信息</div>
                </el-col>
            </el-row>

            <el-row>
                <el-form label-width="120px"
                         :rules="rules"
                         :model="ruleForm"
                         ref="forms1"
                         label-position="right">
                    <el-col :span="24">
                        <el-form-item label="企业名称">
                            <span v-text="companyDatas.companyMessage?companyDatas.companyMessage.companyName:''"></span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="签署日期" prop="ccSignTime">
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
                        <el-form-item label="签约主体" prop="signTheme">
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
                        <el-form-item label="有效期" prop="timeRange">
                            <el-date-picker
                                    v-model="ruleForm.timeRange"
                                    size="small"
                                    unlink-panels
                                    type="daterange"
                                    @change="timeRangeChange"
                                    value-format="yyyy-MM-dd"
                                    range-separator="至"
                                    start-placeholder="有效开始日期"
                                    end-placeholder="有效开始日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
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
                         label-position="right">
                    <el-col :span="12" style="height: 62px">
                        <div class="body_left">
                            <el-form-item label="个税率" prop="ccPersonTaxRate">
                                <el-input size="small" style="width:180px;" v-model="ruleForm.ccPersonTaxRate"></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="body_left">
                            <el-form-item label="个税承担者">
                                <el-radio-group v-model="ruleForm.ccTaxBear">
                                    <el-radio :label="0">个人</el-radio>
                                    <el-radio :label="1">企业</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </div>

                    </el-col>
                    <el-col :span="12" style="height: 62px">
                        <div class="body_left">
                            <el-form-item label="服务费率" prop="ccPersonServicePriceRate">
                                <el-input size="small" style="width:180px;" v-model="ruleForm.ccPersonServicePriceRate"></el-input>
                            </el-form-item>
                        </div>

                    </el-col>
                    <el-col :span="12">
                        <div class="body_left">
                            <el-form-item label="服务费承担者">
                                <el-radio-group v-model="ruleForm.ccServiceBear">
                                    <el-radio :label="0">个人</el-radio>
                                    <el-radio :label="1">企业</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </div>

                    </el-col>
                    <el-col :span="12" style="height: 62px">
                        <div class="body_left">
                            <el-form-item label="发票抵扣率" prop="ccInvoice">
                                <el-input size="small" style="width:180px;"  v-model="ruleForm.ccInvoice"></el-input>
                            </el-form-item>
                        </div>

                    </el-col>
                    <el-col :span="12">
                        <div class="body_left">
                            <el-form-item label="发票个人承担者">
                                <el-radio-group v-model="ruleForm.ccInvoceBear">
                                    <el-radio :label="0">个人</el-radio>
                                    <el-radio :label="1">企业</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </div>

                    </el-col>
                    <el-col :span="12">
                         <p style="color: red;margin-left: 80px;">说明：此模块信息与结算付薪表单关联，请如实填写</p>
                    </el-col>
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
                    <el-form
                            inline
                            label-width="120px"
                            label-position="right"
                            :rules="rules"
                            :model="contactList[index]"
                            :ref="'formsR'+index"
                            v-for="(val,index) in contactList"
                            :key="index">
                        <el-form-item label="联系人姓名" prop="name">
                            <el-input size="mini" class="addClass" v-model="val.name"></el-input>
                        </el-form-item>
                        <el-form-item label="联系方式" prop="phone">
                            <el-input size="mini" class="addClass" v-model="val.phone"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱" prop="email">
                            <el-input size="mini" class="addClass" v-model="val.email"></el-input>
                        </el-form-item>
                        <el-button type="text" size="mini" @click="addContract">添加</el-button>
                        <el-button v-if="index>0" type="text" size="mini" @click="delContract(index)">删除</el-button>
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
                    <el-form
                            inline
                            label-width="120px"
                            label-position="right"
                            :rules="rules"
                            :model="contactList1[index]"
                            :ref="'formsM'+index"
                            v-for="(val,index) in contactList1"
                            :key="index">
                        <el-col :span="10">
                            <el-form-item label="公司职位" prop="jobTitile">
                                <el-input size="mini" class="addClass1" v-model="val.jobTitile"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="14">
                            <el-form-item label="联系人姓名" prop="name">
                                <el-input size="mini" class="addClass1" v-model="val.name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="联系方式" prop="phone">
                                <el-input size="mini" class="addClass1" v-model="val.phone"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="14">
                            <el-form-item label="邮箱" prop="email">
                                <el-input size="mini" class="addClass1" v-model="val.email"></el-input>
                            </el-form-item>
                            <el-button type="text" size="mini" @click="addContract1">添加</el-button>
                            <el-button v-if="index>0" type="text" size="mini" @click="delContract1(index)">删除</el-button>
                        </el-col>
                    </el-form>
                </el-col>
            </el-row>

        </div>
        <div class="tool">
            <el-button type="primary"  :loading="btnLoading" @click="submitContract" size="small"  style="width: 100px;">提交</el-button>
        </div>
    </div>
</template>

<script>
    import {
        addContract,
        findSubject,//查询签约主体
    } from '../../api/api';
    import {mapState,mapActions} from 'vuex';
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
    let validNumber=(rule, value,callback)=>{
        if (!value && value !== 0){
            callback(new Error('请输入个税率'));
        }else  if (!util.isIntegerFloat(value)){
            callback(new Error('请输入数字或小数'))
        }else {
            callback()
        }
    };
    let validNumber1=(rule, value,callback)=>{
        if (!value && value !== 0){
            callback(new Error('请输入发票率'));
        }else  if (!util.isIntegerFloat(value)){
            callback(new Error('请输入数字或小数'))
        }else {
            callback()
        }
    };
    let validNumber2=(rule, value,callback)=>{
        if (!value && value !== 0){
            callback(new Error('请输入发票抵扣率'));
        }else  if (!util.isIntegerFloat(value)){
            callback(new Error('请输入数字或小数'))
        }else {
            callback()
        }
    };
    export default {
        name: "add-contract",
        data(){
            return{
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
                        { required: true, validator: validNumber, trigger: 'blur' }
                    ],
                    ccPersonServicePriceRate: [
                        { required: true, validator: validNumber1,trigger: 'blur' }
                    ],
                    ccInvoice: [
                        { required: true,  validator: validNumber2, trigger: 'blur' }
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
                btnLoading:false,

                /*动态添加联系人*/
                contactList:[
                    {name:'',phone:'',email:''}
                ],
                contactList1:[
                    {jobTitile:'',name:'',phone:'',email:''}
                ],
                resultArr:[],
                /*接口返回*/
                SubjectData:[],//签约主体信息
                /*params*/
                companyDatas:{},//公司信息
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
                    ccPersonTaxRate:null,//个税率
                    ccTaxBear:0,//个税承担者：0：个人承担  1：企业承担
                    ccPersonServicePriceRate:null,//个人服务费率
                    ccServiceBear:0,//个人服务费承担着 0：个人承担 * 1：企业承担
                    ccInvoice:null,//发票率
                    ccInvoceBear:0,//发票个人承担者；0：个人承担，1：企业承担
                    ccServiceTotalRate:'',//服务总费率
                    companyContactsStr:'',//企业联系人集合字符串
                    xdlContactsStr:'',//小福联系人集合字符串
                }
            }
        },
        computed:{
            //映射State
            ...mapState({
                subjects: state => state.Subject,//签约主体
            }),

        },
        mounted(){
            //因为编辑 和添加合同 都是用的 公司基本信息  所以先看session有没有存储
            let aditCompany =  sessionStorage.getItem('aditCompany');
            if(!aditCompany){
                //没进入编辑 或者 第一次 进入添加合同
                sessionStorage.setItem('aditCompany', JSON.stringify(this.$route.params.addContract));
                this.companyDatas = this.$route.params.addContract;
            }else{
                if(this.$route.params&&!this.$route.params.addContract){
                    //$route不存在 说明为刷新
                    this.companyDatas = JSON.parse(aditCompany);
                }else{
                    //不是刷新  是父进来的
                    this.companyDatas = this.$route.params.addContract;
                    sessionStorage.setItem('aditCompany', JSON.stringify(this.$route.params.addContract));
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
            ...mapActions(["setSubject"]),
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
                this.ruleForm.ccCompanyId = this.companyDatas.companyMessage.id;
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
                        let para = {
                            ccId:selfs.ruleForm.ccId,//合同id（编辑时必填）N
                            ccName:selfs.ruleForm.ccName,//合同名称
                            ccCompanyId:selfs.ruleForm.ccCompanyId,//企业id Y
                            ccCompanyName:selfs.companyDatas.companyMessage.companyName,//企业名称 Y
                            ccStartDate:selfs.ruleForm.ccStartDate,//开始日期Y
                            ccEndDate:selfs.ruleForm.ccEndDate,//结束日期
                            ccToAccountNotice:selfs.ruleForm.ccToAccountNotice,//到账通知: 0不通知，1通知，默认0
                            ccSignTime:selfs.ruleForm.ccSignTime,//签署时间 格式： yyyy-MM-dd
                            signTheme:selfs.ruleForm.signTheme,//签约主题
                            ccPersonTaxRate:selfs.ruleForm.ccPersonTaxRate,//个税率
                            ccInvoice:selfs.ruleForm.ccInvoice,//发票率
                            ccInvoceBear:selfs.ruleForm.ccInvoceBear,//发票个人承担者；0：个人承担，1：企业承担
                            ccTaxBear:selfs.ruleForm.ccTaxBear,//个税承担者：0：个人承1：企业承担
                            ccServiceBear:selfs.ruleForm.ccServiceBear,//个人服务费承担着
                            ccPersonServicePriceRate:selfs.ruleForm.ccPersonServicePriceRate,//个人服务费率
                            ccServiceTotalRate:selfs.ruleForm.ccServiceTotalRate,//服务总费率
                            companyContactsStr:selfs.ruleForm.companyContactsStr,//企业联系人集合字符串
                            xdlContactsStr:selfs.ruleForm.xdlContactsStr,//小福联系人集合字符串
                        };
                        addContract(para).then(res =>{
                            selfs.btnLoading = false;
                            if(res.code == '0'){
                                selfs.$message({
                                    type:'success',
                                    message:'添加成功'
                                });
                                selfs.$router.push({
                                    path:'/home/EnterpriseIndex/EnterpriseStatistical',
                                    name:'企业统计'
                                });
                                selfs.$parent.callbackFun()
                            }else{
                                selfs.$message({
                                    type:'error',
                                    message:res.message
                                });

                            }
                        },err =>{
                            selfs.btnLoading = false;
                        })
                    }

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
            }
        }
    }
</script>

<style scoped lang="scss">
    .addContract{
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
    .body_left{
        float: left;
        padding: 0 20px;
        margin-right: 50px;
        /*min-width: 300px;*/
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .body_left1{
        float: left;
        padding: 0 20px;
        margin-right: 50px;
        width: 350px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .tool {
        text-align: center;
        height: 40px;
        width: 100%;
        float: left;
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
       /* .el-form-item {
            margin-bottom: 10px;
        }*/
    }
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
    @media (max-width: 1520px){
        .company_phone .addClass{
            width: 150px;
        }
    }
    @media (max-width: 1435px){
        .company_phone .addClass{
            width: 120px;
        }
    }
    @media (max-width: 1360px){
        .company_phone .addClass{
             width: 100px;
         }
        .company_phone .addClass1{
            width: 130px;
        }
    }
    @media (max-width: 1190px){
        .company_phone .addClass1{
            width: 100%;
        }
        .el-col-12 {
            width: 100%;
        }
        .el-col-10 {
            width: 100%;
        }
        .el-col-14 {
            width: 100%;
        }
    }
</style>
