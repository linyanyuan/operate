<template>
    <div class="add_container">
        <div class="pannel_head">编辑企业</div>
        <div class="company_item_head">
            <el-row>
                <el-col :span="12">
                    <div class="body_left">
                        <p>
                            <span>创建日期：</span>
                            <strong v-text="companyDatas.companyMessage?companyDatas.companyMessage.createDateStr:''"></strong>
                        </p>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="body_left">
                        <p>
                            <span>创建人：</span>
                            <strong v-text="companyDatas.companyMessage?companyDatas.companyMessage.createUserName:''"></strong>
                        </p>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="company_item baseMes">
            <el-row>
                <el-col :span="24">
                    <div class="title_head">基本信息</div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <div class="body_left">
                        <el-form
                                :rules="rules"
                                :model="ruleForm"
                                ref="forms1"
                                label-width="80px"
                                label-position="right">
                            <el-form-item label="企业组">
                                <el-select
                                        size="small"
                                        clearable
                                        @visible-change="visChange"
                                        @change="itemSelect1"
                                        v-model="ruleForm.companyGroup"
                                        placeholder="企业组(可搜索)"
                                        filterable>
                                    <el-option
                                            v-for="item in companyGroupDatas"
                                            :key="item.cId"
                                            :label="item.name"
                                            :value="item.cId">
                                    </el-option>
                                </el-select>
                                <el-button type="text" @click="addCompanyGroup">添加</el-button>
                            </el-form-item>
                            <el-form-item label="企业名称" prop="companyName">
                                <el-input size="small" v-model="ruleForm.companyName"></el-input>
                            </el-form-item>
                            <el-form-item
                                    prop="area"
                                    label="企业地址">
                                <div id="distpicker2" class="form-inline">
                                    <div class="form-group">
                                        <label class="sr-only" for="province5">Province</label>
                                        <select class="form-control" id="province5" v-model="ruleForm.province"></select>
                                    </div>
                                    <div class="form-group">
                                        <label class="sr-only" for="city5">City</label>
                                        <select class="form-control" id="city5" v-model="ruleForm.city"></select>
                                    </div>
                                    <div class="form-group">
                                        <label class="sr-only" for="district5">District</label>
                                        <select class="form-control" id="district5" v-model="ruleForm.area"></select>
                                    </div>
                                </div>

                            </el-form-item>
                            <el-form-item  prop="address">
                                <el-input
                                        type="textarea"
                                        :rows="3"
                                        placeholder="请输入详细地址"
                                        v-model="ruleForm.address">
                                </el-input>
                            </el-form-item>
                        </el-form>
                    </div>

                </el-col>
                <el-col :span="12">
                    <div class="body_left">
                        <el-upload
                                class="avatar-uploader"
                                :action="upDateStadioImg"
                                :show-file-list="false"
                                :headers="headers"
                                :before-upload="beforeUpload"
                                :on-remove="handleRemove"
                                :on-success="success"
                                :file-list="fileList">
                            <img v-if="imageUrl" :src="imageUrl?'data:image/jpeg;base64,'+imageUrl:''" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon">上传营业执照</i>
                        </el-upload>
                    </div>

                </el-col>
            </el-row>
        </div>
        <div class="company_item">
            <el-row>
                <el-col :span="24">
                    <div class="title_head">开票信息</div>
                </el-col>
            </el-row>
            <el-row>
                <el-form label-width="80px"
                         inline
                         :rules="rules"
                         :model="ruleForm"
                         ref="forms2"
                         label-position="right">
                    <el-col :span="12">
                        <div class="body_left">
                            <el-form-item label="开票方式">
                                <el-radio-group v-model="ruleForm.resource">
                                    <el-radio :label="0">正常开票</el-radio>
                                    <el-radio :label="1">预开票</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="body_left">
                            <el-form-item label="开票类型">
                                <el-radio-group v-model="ruleForm.ciType">
                                    <el-radio :label="0">专用发票</el-radio>
                                    <el-radio :label="1">普通发票</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </div>
                    </el-col>
                    <el-col :span="24">
                        <div class="body_left1">
                            <el-form-item label="开票内容" prop="content">
                                <el-input size="small" v-model="ruleForm.content"></el-input>
                            </el-form-item>
                            <el-button type="text" size="small" @click="isAdd = true">添加</el-button>
                        </div>
                    </el-col>
                    <el-col :span="24" v-if="isAdd">
                        <div class="body_left1">
                            <el-form-item label=" " label-width="80px">
                                <el-input size="small" v-model="ruleForm.content1"></el-input>
                            </el-form-item>
                            <el-button type="text" size="small" :style="isDefault?'color:#f60':''" @click="setDefault">设为默认</el-button>
                            <el-button type="text" size="small"  @click="isAdd = false,isDefault = false">删除</el-button>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="body_left">
                            <el-form-item label="企业名称" prop="companyNames">
                                <el-input size="small" v-model="ruleForm.companyNames"></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="body_left">
                            <el-form-item label="注册地址" prop="registeredAddress">
                                <el-input size="small" v-model="ruleForm.registeredAddress"></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="body_left">
                            <el-form-item label="联系电话" prop="phone">
                                <el-input size="small" v-model="ruleForm.phone"></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="body_left">
                            <el-form-item label="税号" prop="taxId">
                                <el-input size="small" v-model="ruleForm.taxId"></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="body_left">
                            <el-form-item label="开户行" prop="bankName">
                                <el-input size="small" v-model="ruleForm.bankName"></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="body_left">
                            <el-form-item label="账号" prop="account">
                                <el-input size="small" v-model="ruleForm.account"></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                </el-form>
            </el-row>
        </div>
        <div class="company_item">
            <el-row>
                <el-col :span="24">
                    <div class="title_head">邮寄信息</div>
                </el-col>
            </el-row>
            <el-row>
                <el-form label-width="80px"
                         :rules="rules"
                         :model="ruleForm"
                         ref="forms3"
                         label-position="right">
                    <el-col :span="12">
                        <div class="body_left">
                            <el-form-item label="邮寄地址" prop="caArea">
                                <div id="distpicker3" class="form-inline">
                                    <div class="form-group">
                                        <label class="sr-only" for="province5">Province</label>
                                        <select class="form-control" id="province6" v-model="ruleForm.caProvince"></select>
                                    </div>
                                    <div class="form-group">
                                        <label class="sr-only" for="city5">City</label>
                                        <select class="form-control" id="city6" v-model="ruleForm.caCity"></select>
                                    </div>
                                    <div class="form-group">
                                        <label class="sr-only" for="district5">District</label>
                                        <select class="form-control" id="district6" v-model="ruleForm.caArea"></select>
                                    </div>
                                </div>
                            </el-form-item>
                            <el-form-item  prop="caAddress" label="详细地址">
                                <el-input
                                        type="textarea"
                                        :rows="3"
                                        placeholder="请输入详细地址"
                                        v-model="ruleForm.caAddress">
                                </el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="body_left">
                            <el-form-item label="企业名称" prop="companyNameYouJi">
                                <el-input size="small" v-model="ruleForm.companyNameYouJi"></el-input>
                            </el-form-item>
                            <el-form-item label="收件人姓名" prop="names">
                                <el-input size="small" v-model="ruleForm.names"></el-input>
                            </el-form-item>
                            <el-form-item label="联系电话" prop="phoneNumber">
                                <el-input size="small"  v-model="ruleForm.phoneNumber"></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                </el-form>
            </el-row>
        </div>
        <div class="company_item">
            <el-row>
                <el-col :span="24">
                    <div class="title_head">账号信息</div>
                </el-col>
            </el-row>
            <el-row>
                <el-form label-width="80px"
                         inline
                         :rules="rules"
                         :model="ruleForm"
                         ref="forms4"
                         label-position="right">
                    <el-col :span="12">
                        <div class="body_left">
                            <el-form-item label="使用人姓名" prop="userName1">
                                <el-input size="small" v-model="ruleForm.userName1"></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="body_left">
                            <el-form-item label="手机号" prop="userPhone1">
                                <el-input size="small" v-model="ruleForm.userPhone1"></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                </el-form>
            </el-row>
            <div class="tool">
                <el-button type="primary" :loading="btnLoading" @click="submitAddCompany" size="small"  style="width: 100px;">提交</el-button>
            </div>
        </div>
        <!--添加企业组-->
        <el-dialog
                @close="closeEdited"
                   title="添加企业组"
                   :visible.sync="dialogFormVisible">
            <el-form style="width: 500px;margin: 0 auto"
                     :rules="rules2"
                     :model="upDataCompanyGroup"
                     ref="forms5"
                     label-position="right"
                     label-width="100px">
                <el-form-item label="企业组名称" prop="name">
                    <el-input
                            v-model="upDataCompanyGroup.name"
                            placeholder="输入企业组名称"
                            size="small"></el-input>
                </el-form-item>
            </el-form>
            <div class="tool" >
                <el-button type="primary" @click="upDataCompany" size="small" style="width: 100px;">确认</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {
        findClientGroup,//查询企业组
        updateClientGroup,//添加企业组
        updateStudioImg,//上传营业执照
        submitCompanyMessage,//提交企业信息
        companyConFindCompanyAccountMessage
    } from '../../api/api';
    import util from '../../utils/util';

    let isPhone = false;
    let validPhone=(rule, value,callback)=>{
        if (!value){
            isPhone = true;
            callback(new Error('联系方式必填'));
        }else  if (!util.isvalidPhone(value)){
            isPhone = false;
            callback(new Error('请输入正确的11位手机号码'))
        }else {
            isPhone = true;
            callback()
        }
    };
    export default {
        name: "add-enterprise",
        data(){
            return{
                /*控制区*/
                dialogFormVisible:false,
                isAdd:false,//是否显示添加一个开票内容
                isDefault:false,
                uploading:true,
                upload:false,
                btnLoading:false,
                fileList:[],
                imageUrl:'',
                headers:{
                    CsrfRandomToken:''
                },
                /*基本信息*/
                upDateStadioImg:updateStudioImg,
                ciDefaultOpenInvoiceContent:'',
                ruleForm:{
                    companyGroupName:'',
                    companyGroup:'',
                    province:'',//省
                    city:'',//市
                    area:'',//区
                    imgUrl:'',
                    companyName:'',//企业名称
                    companyNames:'',//开票企业名称
                    address:'',//详细地址
                    resource:0,//开票方式
                    ciType:0,//开票类型
                    content:"",//开票内容
                    content1:'',//开票内容1
                    registeredAddress:'',//注册地址
                    phone:'',//开票联系电话
                    taxId:'',//开票税号
                    bankName:'',//开票开户行
                    account:'',//开票账号
                    companyNameYouJi:'',//邮寄信息企业名称
                    phoneAddress:'',//邮寄地址
                    phoneYouJi:'',//邮寄电话
                    names:'',//收件人姓名
                    phoneNumber:'',//联系电话
                    caAddress:'',//邮寄详细地址
                    caProvince:'',//邮寄省
                    caCity:'',//邮寄市
                    caArea:'',//邮寄区
                    userName:'',//企业组使用人姓名
                    userPhone:'',//手机号
                    userName1:'',//企业使用人姓名
                    userPhone1:'',//手机号
                },
                upDataCompanyGroup:{
                    name:'',//企业组名称
                },
                /*存储区*/
                companyGroupDatas:[],//接口返回的企业组信息
                selected:'',
                resultArr:[],
                /*rule*/
                rules:{
                    companyName: [
                        { required: true, message: '请输入企业名称', trigger: 'blur' }
                    ],
                    address: [
                        { required: true, message: '请输入详细地址', trigger: 'blur' }
                    ],
                    area: [
                        { required: true,trigger: 'blur', message: '请选择完整地址'}
                    ],
                    //开票内容
                    content: [
                        { required: true,trigger: 'blur', message: '请输入开票内容'}
                    ],
                    //开票企业名称
                    companyNames: [
                        { required: true,trigger: 'blur', message: '请输入开票内容'}
                    ],
                    //注册地址
                    registeredAddress: [
                        { required: true,trigger: 'blur', message: '请输入注册地址'}
                    ],
                    //请输入联系电话
                    phone: [
                        { required: true,trigger: 'blur',validator: validPhone}
                    ],
                    //请输入税号
                    taxId: [
                        { required: true,trigger: 'blur', message: '请输入税号'}
                    ],
                    //请输入开户行
                    bankName: [
                        { required: true,trigger: 'blur', message: '请输入开户行'}
                    ],
                    //请输入开票账号
                    account: [
                        { required: true,trigger: 'blur', message: '请输入开票账号'}
                    ],
                    //邮寄信息企业名称
                    companyNameYouJi: [
                        { required: true,trigger: 'blur', message: '请输入企业名称'}
                    ],
                    //邮寄地址
                    phoneAddress: [
                        { required: true,trigger: 'blur', message: '请输入邮寄地址'}
                    ],
                    names: [
                        { required: true,trigger: 'blur', message: '请输入收件人姓名'}
                    ],
                    //联系电话
                    phoneNumber: [
                        { required: true,trigger: 'blur',validator: validPhone}
                    ],
                    /*企业*/
                    userName: [
                        { required: true,trigger: 'blur', message: '请输入使用人姓名'}
                    ],
                    //联系电话
                    userPhone: [
                        { required: true,trigger: 'blur',validator: validPhone}
                    ],
                    userName1: [
                        { required: true,trigger: 'blur', message: '请输入使用人姓名'}
                    ],
                    //联系电话
                    userPhone1: [
                        { required: true,trigger: 'blur',validator: validPhone}
                    ],

                },
                //企业组
                rules2:{
                    name:[
                        { required: true, message: '请输入企业组名称', trigger: 'blur' }
                    ]
                },
                companyDatas:{}
            }
        },
        mounted(){
            //保存企业组ID到sessionStorage
            let aditCompany =  sessionStorage.getItem('aditCompany');
            if(!aditCompany){
                //第一次 进入
                sessionStorage.setItem('aditCompany', JSON.stringify(this.$route.params.aditCompany));
                this.companyDatas = this.$route.params.aditCompany;
            }else{
                if(this.$route.params&&!this.$route.params.aditCompany){
                    //$route不存在 说明为刷新
                    this.companyDatas = JSON.parse(aditCompany);
                }else{
                    //不是刷新  是父进来的
                    this.companyDatas = this.$route.params.aditCompany;
                    sessionStorage.setItem('aditCompany', JSON.stringify(this.$route.params.aditCompany));
                }
            }
            let temps = this.companyDatas;
            this.ruleForm = {
                id:temps.companyMessage.id,
                companyGroupName:temps.companyMessage.companyGroupName,
                companyGroup:temps.companyMessage.companyGroupId,
                province:temps.companyMessage.province,//省
                city:temps.companyMessage.city,//市
                area:temps.companyMessage.area,//区
                imgUrl:'',
                companyName:temps.companyMessage.companyName,//企业名称
                companyNames:temps.companyInvoice.ciCompanyName,//开票企业名称
                address:temps.companyMessage.address,//详细地址
                resource:temps.companyInvoice.ciOpenWay,//开票方式
                ciType:Number(temps.companyInvoice.ciType),//开票类型
                content:temps.companyInvoice.ciOpenInvoiceContent,//开票内容
                content1:temps.companyInvoice.ciDefaultOpenInvoiceContent,//开票内容1
                registeredAddress:temps.companyInvoice.ciCompanyAddress,//注册地址
                phone:temps.companyInvoice.ciPhone,//开票联系电话
                taxId:temps.companyInvoice.ciTaxpayer,//开票税号
                bankName:temps.companyInvoice.ciOpenBank,//开票开户行
                account:temps.companyInvoice.ciBankCard,//开票账号
                companyNameYouJi:temps.companyMailAddress.caCompanyName,//邮寄信息企业名称
                caAddress:temps.companyMailAddress.caAddress,//邮寄详细地址
                caProvince:temps.companyMailAddress.caProvince,//邮寄省
                caCity:temps.companyMailAddress.caCity,//邮寄市
                caArea:temps.companyMailAddress.caArea,//邮寄区
                phoneYouJi:temps.companyMailAddress.caPhone,//邮寄电话
                names:temps.companyMailAddress.caName,//收件人姓名
                phoneNumber:temps.companyMailAddress.caPhone,//联系电话
                userName1:temps.companyMessage.accountName,//企业使用人姓名
                userPhone1:temps.companyMessage.accountPhone,//手机号
                caId1:temps.companyMessage.caId1,//地址id（编辑必填）
                caId:temps.companyMailAddress.caId,//地址id（编辑必填）
                ciId:temps.companyInvoice.ciId,//证件id（编辑必填）
            };
            this.imageUrl = temps.companyMessage.ccOneCertificatesCopyUrl;
            if(temps.companyMessage.area){
                setTimeout(function(){
                    $('#distpicker2').distpicker({
                        province: temps.companyMessage.province,
                        city: temps.companyMessage.city,
                        district:temps.companyMessage.area
                    });
                },200);
            }else{
                setTimeout(function(){
                    $('#distpicker2').distpicker({
                        province: '所在省',
                        city: '所在市',
                        district:'所在区'
                    });
                    $('#distpicker3').distpicker({
                        province: '所在省',
                        city: '所在市',
                        district:'所在区'
                    });
                },200);
            }
            if(temps.companyMailAddress.caArea){
                setTimeout(function(){
                    $('#distpicker3').distpicker({
                        province: temps.companyMailAddress.caProvince,
                        city: temps.companyMailAddress.caCity,
                        district:temps.companyMailAddress.caArea
                    });
                },200);
            }else{
                $('#distpicker3').distpicker({
                    province: '所在省',
                    city: '所在市',
                    district:'所在区'
                });
            }
            //查询企业组
            this.getFindClientGroup();
        },
        methods:{
            //获取企业组
            getFindClientGroup(){
                findClientGroup().then(res =>{
                    if(res && res.length >0){
                        this.companyGroupDatas = res;
                    }
                })
            },
            //添加企业组
            addCompanyGroup(){
                this.dialogFormVisible = true;
            },
            //提交添加企业
            submitAddCompany(formName){
                let formArr=['forms1','forms2','forms3','forms4'];
                this.resultArr = [];
                formArr.forEach(item => { //根据表单的ref校验
                    this.checkForm(item)
                });
                let selfs = this;
                Promise.all(this.resultArr).then(function(res) {
                    //都通过了
                    //验证全部通过的时候
                    if(res[0]&&res[1]&&res[2]&&res[3]){
                        selfs.btnLoading = true;
                        let para = {
                            id:selfs.ruleForm.id,
                            companyGroupId:selfs.ruleForm.companyGroup,//企业组名称 N
                            companyGroupName:selfs.ruleForm.companyGroupName,
                            companyName:selfs.ruleForm.companyName,//企业名称 Y
                            province:selfs.ruleForm.province,// 省  Y
                            city:selfs.ruleForm.city,// 市 Y
                            area:selfs.ruleForm.area,// 区 Y
                            address:selfs.ruleForm.address,// 详细地址 Y
                            ccOneCertificatesCopyUrl:selfs.ruleForm.imgUrl,//证件路径 N
                            ciOpenWay:selfs.ruleForm.resource,//开票方式： 0正常开票；1预开票 Y
                            ciType:selfs.ruleForm.ciType,//发票类型: 普票/专票Y
                            ciOpenInvoiceContent:selfs.ruleForm.content,//开票内容(多个使用英文逗号隔开) Y
                            ciDefaultOpenInvoiceContent:selfs.ciDefaultOpenInvoiceContent ? selfs.ciDefaultOpenInvoiceContent : selfs.ruleForm.content,//默认开票内容 Y
                            ciCompanyName:selfs.ruleForm.companyNames,//开票公司名称 Y
                            ciCompanyAddress:selfs.ruleForm.registeredAddress,//开票注册地址 Y
                            ciPhone:selfs.ruleForm.phone,//开票电话 Y
                            ciTaxpayer:selfs.ruleForm.taxId,//税号 Y
                            ciOpenBank:selfs.ruleForm.bankName,//开户行 Y
                            ciBankCard:selfs.ruleForm.account,//账号 Y
                            accountName:selfs.ruleForm.userName1,//企业账户名称 Y
                            accountPhone:selfs.ruleForm.userPhone1,//企业账户手机号 y
                            companyGroupAccountName:selfs.ruleForm.userName,//企业组账户名称 n
                            companyGroupAccountPhone:selfs.ruleForm.userPhone,//企业组账户手机号 n
                            caCompanyName:selfs.ruleForm.companyNameYouJi,//收件企业名称 Y
                            caAddress:selfs.ruleForm.caAddress,//详细地址 Y
                            caProvince:selfs.ruleForm.caProvince,//省 Y
                            caCity:selfs.ruleForm.caCity,//市 Y
                            caArea:selfs.ruleForm.caArea,//去Y
                            caName:selfs.ruleForm.names,//收件人 Y
                            caPhone:selfs.ruleForm.phoneNumber,//收件人 Y
                            caId1:selfs.ruleForm.caId1,
                            ciId:selfs.ruleForm.ciId,
                            caId:selfs.ruleForm.caId,
                        };
                        submitCompanyMessage(para).then(res =>{
                            selfs.btnLoading = false;
                            if(res.code == '0'){
                                selfs.$message({
                                    type:'success',
                                    message:'编辑成功'
                                });
                                /*selfs.$router.push({
                                    path:'/home/EnterpriseIndex/EnterpriseStatistical',
                                    name:'企业统计'
                                });*/
                                selfs.$router.push({
                                    path:'/home/EnterpriseIndex/EnterpriseReal',
                                    name:'企业详情',
                                    params:{
                                        companyIds:selfs.ruleForm.id
                                    }
                                });
                                selfs.$parent.callbackFun()
                            }else{
                                selfs.$message({
                                    type:'error',
                                    message:res.message
                                });
                                selfs.$parent.callbackFun()
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
                    _self.$refs[formName].validate((valid) => {
                        if (valid) {
                            resolve(valid);
                        } else {
                            reject(valid)
                        }
                    })
                });
                this.resultArr.push(result); //push 得到promise的结果
            },
            //添加企业组
            upDataCompany(){
                this.$refs['forms5'].validate((valid) => {
                    if (valid) {
                        let para = {
                            name:this.upDataCompanyGroup.name
                        };
                        updateClientGroup(para).then(res =>{
                            if(res.data){
                                this.$message({
                                    type:'success',
                                    message:res.message
                                });
                                this.dialogFormVisible = false;
                                this.getFindClientGroup();
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });

            },

            itemSelect1(a,b){
                if(a){
                    let obj = {};
                    obj = this.companyGroupDatas.find((item)=>{
                        return item.cId === a;//筛选出匹配数据
                    });
                    this.ruleForm.companyGroupName = obj.name;
                    companyConFindCompanyAccountMessage({companyId:a}).then(res =>{
                        if(res && res.loginName){
                            /* this.disabled = true;*/
                            this.ruleForm.userName = res.accountName;
                            this.ruleForm.userPhone = res.accountPhone
                        }
                    })
                }else{
                   this.ruleForm.companyGroup = '';
                    this.ruleForm.companyGroupName = '';
                    this.ruleForm.userName1 = '';
                    this.ruleForm.userPhone1 = '';
                }

            },
            //开票内容设置默认
            setDefault(){
                this.ciDefaultOpenInvoiceContent = this.ruleForm.content1;
                this.isDefault = true;
            },
            //关闭企业组
            closeEdited(data) {
                //关闭dialog框
                // this.dialogFormVisible = false;
            },
            handleRemove(file, fileList) {
                this.upload = false;
            },
            //获取cookie
            getCookie() {
                let cookie = $.cookie('CsrfRandomToken'), _this = this;
                if(!cookie){
                    $.ajax({
                        type:'get',
                        url:configAll.serviceUrl.base+'/payroll-maintenance/cookieCon/addCookies',
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
                const isJPG = file.type === 'image/jpeg';
                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                    return false;
                }
                this.getCookie();
                this.headers.CsrfRandomToken =  this.cookie;
                this.uploading = true;
                this.upload = true;
            },
            success(response, file, fileList){
                if(response){
                    this.fileList = fileList;
                    this.uploading = false;
                    this.upload = false;
                    this.dialogFormVisible = false;
                    this.imageUrl = response.img;
                    this.ruleForm.imgUrl = response.path;
                }else{
                    this.$message({
                        type:'error',
                        message:response.message
                    })
                }
            },
            //添加企业组
            addCompanyGroup(){
                this.dialogFormVisible = true;
            },
            //添加企业组
            btnClick(){
                this.dialogFormVisible = false;
            }
        }
    }
</script>

<style  lang="scss">
    .company_item_head{
        float: left;
        background-color: rgba(242, 242, 242, 1);
        width: 100%;
        margin-top: 5px;
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
    .add_container{
        flex: 1;
        /* padding: 10px; */
        padding: 10px 20px;
        box-sizing: border-box;
    }
    .body_left{
        float: left;
        padding: 0 20px;
        margin-right: 50px;
        /*width: 300px;*/
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
    .pannel_head{
        padding: 12px 48px 12px 10px;
        border-bottom: 1px solid #0000001c;
        font-size: 16px;
        line-height: 20px;
    }
    .tool {
        text-align: center;
        height: 40px;
        width: 100%;
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
    .title_head{
        font-size: 15px;
        padding: 12px 0 12px 15px;
        box-sizing: border-box;
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
        width: 220px;
        height: 225px;
        line-height: 178px;
        text-align: center;
    }

    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
    /*.body_left{
        float: left;
        padding: 0 20px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        p{
            margin: 30px 0;
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
    }*/
    @media (min-width: 1330px){
        .form-inline .form-group {
            display: inline-block;
            margin-bottom: 0;
            vertical-align: middle;
        }
        .form-inline .form-control {
            display: inline-block;
            width:90px;
            vertical-align: middle;
        }
    }
    @media (max-width: 1320px){
        .form-inline .form-group {
            display: inline-block;
            margin-bottom: 0;
            vertical-align: middle;
        }
        .form-inline .form-control {
            display: inline-block;
            width:90px;
            vertical-align: middle;
        }
    }
    @media (max-width: 1220px){
        .baseMes .el-col-12 {
            width: 100% !important;
        }
        .baseMes .avatar-uploader {
            display: flex;
            justify-content: left;
            margin-left: 80px;
        }
    }
    .form-control {
        display: block;
        width: 100%;
        height: 34px;
        padding: 6px 12px;
        font-size: 14px;
        line-height: 1.42857143;
        color: #555;
        background-color: #fff;
        background-image: none;
        border: 1px solid #ccc;
        border-radius: 4px;
        -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
        -webkit-transition: border-color ease-in-out .15s, -webkit-box-shadow ease-in-out .15s;
        -o-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
        transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;

    }

    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        border: 0;
    }
    label {
        display: inline-block;
        max-width: 100%;
        margin-bottom: 5px;
    }
</style>
