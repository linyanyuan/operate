<template>
    <div class="box">
        <searchPanle
                @search="search"
                @statesChange="statesChange"
                @creatAccount="creatAccount"
                @normalDate="normalDate"
                :searchData="searchData"></searchPanle>
        <div class="tableList">
            <tableList
                    @edit="edit"
                    @resetPassword="resetPassword"
                    @startAccount="startAccount"
                    @stopAccount="stopAccount"
                    @copyAccount="copyAccount"
                    :loading="listLoading"
                    :columns="columns"
                    :tableData="tableData"
                    :data-source="users"></tableList>
        </div>
        <!--工具条-->
        <pagination
                @currentClick="currentClick"
                @pageClick="pageClick"
                :paginationDatas="paginationDatas"></pagination>

        <!--创建账号-->
        <el-dialog  @close="closeEdited"
                   title="创建账号"
                   :visible.sync="dialogFormVisible">
                <el-row>
                    <el-col :span="12">
                        <el-form
                                :rules="rules"
                                :model="creat_account"
                                ref="accountForm"
                                label-position="right" label-width="120px">
                            <el-form-item
                                    label="公司名称：" prop="cuCompanyId">
                                <el-select
                                        style="margin-top: 1px;"
                                        v-model="creat_account.cuCompanyId"
                                        size="small"
                                        clearable
                                        @visible-change="visChange"
                                        @change="addAccountLoadCompany"
                                        placeholder="公司名称"
                                        filterable
                                        class="smSreen">
                                    <el-option
                                            v-for="item in companyList"
                                            :key="item.cId"
                                            :label="item.cName"
                                            :value="item.cId">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="姓名：">
                                <el-span size="small">{{creat_account.cuUserName}}</el-span>
                            </el-form-item>
                            <el-form-item label="手机号：">
                                <el-span size="small">{{creat_account.cuUserPhone}}</el-span>
                            </el-form-item>
                            <el-form-item label="地址：">
                                <el-span size="small">{{creat_account.cuCompanyAddress}}</el-span>
                            </el-form-item>
                            <el-form-item label="账号名称：" prop="cuLoginName">
                                <el-input v-model="creat_account.cuLoginName" size="small"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :span="12" v-if="creat_account.ccOneCertificatesCopyUrl">
                            <img :src="creat_account.ccOneCertificatesCopyUrl?'data:image/jpeg;base64,'+creat_account.ccOneCertificatesCopyUrl:''" class="avatar">
                    </el-col>
                </el-row>
            <div class="tool" >
                <el-button type="primary" @click="addCompanyUser()" size="small" style="width: 100px;">提交</el-button>
            </div>
        </el-dialog>

        <!--编辑-->
        <el-dialog  @close="closeEdited"
                    title="编辑"
                    :visible.sync="dialogFormEditAccount">
            <el-form
                    :rules="rulesEditAccount"
                    :model="creat_account"
                    ref="editForm"
                    label-position="right" label-width="120px">

                <el-form-item label="姓名：" prop="cuUserName">
                    <el-input v-model="creat_account.cuUserName" size="small"></el-input>
                </el-form-item>

                <el-form-item label="手机号：" prop="cuUserPhone">
                    <el-input v-model="creat_account.cuUserPhone" size="small"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button
                            size="small"
                            @click="editCompanyUser"
                            type="primary">
                        提交
                    </el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog  @close="closeEdited"
                    title="重置密码"
                    :visible.sync="dialogFormResetPassword">
                    <el-form
                            :rules="rulesPassword"
                            :model="res_set_password"
                            ref="passwordForm"
                            label-position="right" label-width="120px">

                        <el-form-item label="密码生成策略">
                            <el-radio v-model="res_set_password.random" @change="changePasswordType" label="0">系统随机生成</el-radio>
                            <el-radio v-model="res_set_password.random" @change="changePasswordType" label="1">手动输入</el-radio>
                        </el-form-item>
                        <el-form-item label="输入新密码" prop="newPassword">
                            <el-input
                                    size="small"
                                    :maxlength="20"
                                    type="password"
                                    v-model="res_set_password.newPassword"
                                    v-bind:disabled="res_set_password.dis"
                                    placeholder="6-20位字符，包含字母和数字"></el-input>
                        </el-form-item>
                        <el-form-item label="再次确认新密码" prop="againPassword">
                            <el-input
                                    size="small"
                                    :maxlength="20"
                                    type="password"
                                    v-model="res_set_password.againPassword"
                                    v-bind:disabled="res_set_password.dis"
                                    placeholder="6-20位字符，包含字母和数字"></el-input>
                        </el-form-item>

                        <el-form-item>
                            <el-button
                                    size="small"
                                    @click="updatePassword"
                                    type="primary">
                                提交
                            </el-button>
                        </el-form-item>
                    </el-form>
        </el-dialog>

        <el-dialog  @close="closeEdited"
                    title="账户信息"
                    :visible.sync="dialogCopyAccount">
            <el-form
                    :model="account_copy"
                    ref="passwordForm"
                    label-position="right" label-width="120px">
                <el-form-item label="企业账户信息">
                    <el-input
                            size="small"
                            type="textarea"
                            :rows="4"
                            v-model="account_copy.message"
                            ></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button
                            size="small"
                            v-clipboard:copy="account_copy.message"
                            v-clipboard:success="onCopySuccess"
                            v-clipboard:error="onCopyError"
                            type="primary">
                        copy
                    </el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

    </div>
</template>

<script>
    const searchPanle = r => require.ensure([], () => r(require('../../components/search.vue')), 'searchPanle');//搜索组件
    const tableList = r => require.ensure([], () => r(require('../../components/tableList.vue')), 'tableList');//列表组件
    const pagination = r => require.ensure([], () => r(require('../../components/pagination.vue')), 'pagination');//分页组件
    import {
        companyUserConFindPage,
        companyConFindCompanyAccountMessage,
        companyUserConAddCompanyUser,
        companyUserConBlockUpOrStartUsing,
        companyUserConResetPassword,
        companyUserConCopyCompanyUserMessage,
        companyConFindAddAccountCompanyList
    } from '../../api/api';
    import util from '../../utils/util';
    import VueClipboard from 'vue-clipboard2'
    let clipboard = Vue.use(VueClipboard);
    let again = false;
    let newPass = false;
    let newPassword = '';
    //let isRandom = false;//密码是否随机
    //新密码
    let validNew=(rule, value,callback)=>{
        if(!value){
            newPass = false;
            callback(new Error('新密码必填'))
        }else if(!util.isvalidPassword(value)){
            newPass = false;
            callback(new Error('6-20位字符，包含字母和数字'))
        }else{
            newPass = true;
            newPassword = value;
            callback()
        }
    };
    //再次新密码
    let validAgain=(rule, value,callback)=>{
        console.log("validAgain:"+value)
        if(!value){
            console.log("validAgain is null ")
            again = false;
            callback(new Error('请输入确认密码'))
        }else if(!newPass){
            again = false;
            callback(new Error('6-20位字符，包含字母和数字'))

        }else if(newPassword !== value){
            again = false;
            callback(new Error('密码不一致'))
        }else{
            again = true;
            newPassword=value;
            callback()
        }
    };
    export default {
        name: "account",
        data(){
            return{
                opStatus:'',
                startTime:'',
                endTime:'',
                //搜索
                searchData:{
                    selected:{
                        company:true,
                        normalDate:true,
                        account:true,
                        state:true,
                        creatAccount:true,
                        holder1:'开始时间',
                        holder2:'结束时间'
                    },
                    typeDatas:[
                        {name:'全部',value:-1},
                        {name:'停用',value:2},
                        {name:'启用',value:1},
                    ],
                    props:{
                        holder:'账号状态'
                    }
                },
                tableData:{
                    account:true,
                    xuhao:true
                },
                //分页组件
                paginationDatas:{
                    total:20,
                    currentPage: 1,
                },
                columns: [
                    {
                        text: '账号名称',
                        dataIndex: 'cuLoginName',
                        type:'text',
                        width:'200'
                    },
                    {
                        text: '手机号',
                        dataIndex: 'cuUserPhone',
                        type:'text',
                        width:'170'
                    },
                    {
                        text: '姓名',
                        dataIndex: 'cuUserName',
                        type:'text',
                        width:'170'
                    },
                    {
                        text: '企业名称',
                        dataIndex: 'cuCompanyName',
                        type:'text',
                        width:'200'
                    },
                    {
                        text: '创建时间',
                        dataIndex: 'cuCreateTimeStr',
                        type:'text',
                        sortable:true,
                        width:'170'
                    },
                    {
                        text: '创建人',
                        dataIndex: 'cuCreateUserName',
                        type:'text',
                        width:'120'
                    },
                    {
                        text: '状态',
                        dataIndex: 'cuOpStatus',
                        type:'text',
                        width:'120'
                    },

                ],
                /*存储数据*/
                users: [],
                /*控制器*/
                //创建账号
                fileList:[],//上传的文件列表
                dialogFormVisible:false,
                dialogFormResetPassword:false,
                dialogCopyAccount:false,
                dialogFormEditAccount:false,
                //分页
                currentPage: 1,
                pageSize: 20,
                /*参数*/
                creat_account:{
                    cuId:'',
                    cuCompanyId:'',
                    cuLoginName:'',
                    cuUserPhone:'',
                    cuUserName:'',
                    cuCompanyAddress:'',
                    ccOneCertificatesCopyUrl:''
                },
                res_set_password:{
                    cuId:'',
                    newPassword:'',
                    againPassword:'',
                    random:'1',
                    dis:false

                },
                account_copy:{
                    message:''
                },
                rules:{
                    cuLoginName:[
                        { required: true, message: '请输入账户名称', trigger: 'blur' }
                    ],
                    cuCompanyId: [
                        { required: true, message: '请选择企业',trigger: 'change'}
                    ]
                },
                rulesPassword:{
                    newPassword:[
                        {  required: true,trigger: 'blur', validator: validNew }//这里需要用到全局变量
                    ],
                    againPassword: [
                        {  required: true,trigger: 'blur', validator: validAgain }//这里需要用到全局变量
                    ]
                },
                rulesEditAccount:{
                    cuUserName:[
                        {  required: true,trigger: 'blur', message: '请输入姓名'}
                    ],
                    cuUserPhone: [
                        {  required: true,trigger: 'blur', message: '请输入手机号'}
                    ]
                }
            }
        },
        components:{
            searchPanle,
            tableList,
            pagination
        },
        mounted(){
            this.getUsers();
            // let companyList =  JSON.parse(sessionStorage.getItem('companyList'));
            // if(!companyList){
                //不存在的情况
            companyConFindAddAccountCompanyList().then((res)=>{
                    if(res){
                        //不存在的时候 重新保存一下
                        // sessionStorage.setItem('companyList', JSON.stringify(res.data));
                        // companyList =  JSON.parse(sessionStorage.getItem('companyList'));
                        this.companyList = res;
                    }
                });

            // }else{
            //     //存在
            //     this.companyList = companyList;
            // }
        },
        methods:{
            //合同状态改变
            statesChange(data){
                this.opStatus = data;
            },
            normalDate(searchDate){
                if(searchDate) {
                    this.startTime = util.dateToNormal(searchDate[0]);
                    this.endTime = util.dateToNormal(searchDate[1]);
                }else{
                    this.startTime = '';
                    this.endTime = '';
                }
            },
            //获取账号列表
            getUsers() {
                let para = {
                    companyId:this.defaultCompany,//公司编号
                    startTime:this.startTime,//开始查询时间
                    endTime:this.endTime,//结束查询时间
                    current_page:this.currentPage,
                    page_size:this.pageSize,
                };
                if(this.opStatus>=0){//状态
                    para.opStatus=this.opStatus;
                }
                this.listLoading = true;
                companyUserConFindPage(para).then((res) => {
                    if(res){
                        this.paginationDatas.total = res.total_count;
                        let datas = res.list?res.list:[];
                        for(let i = 0,l = datas.length;i<l;i++){
                            if(datas[i].cuOpStatus === 2){
                                datas[i].cuOpStatus = '停用';
                            }else if(datas[i].cuOpStatus === 1){
                                datas[i].cuOpStatus = '启用';
                            }
                        }
                        this.users = datas;
                        this.listLoading = false;
                    }

                },error =>{
                    this.listLoading = false;
                    this.$message({
                        type:'error',
                        message:'出错了，请稍后再试'
                    })
                });
            },

            //添加
            addCompanyUser(){
                this.$refs['accountForm'].validate((valid) => {
                    if (valid) {
                        this.submitCompanyUser(0);
                    } else {
                        return false;
                    }
                });
            },
            //编辑
            editCompanyUser(){
                this.$refs['editForm'].validate((valid) => {
                    if (valid) {
                        this.submitCompanyUser(1);
                    } else {
                        return false;
                    }
                });
            },

            //提交
            submitCompanyUser(type){

                let param={
                    cuId:this.creat_account.cuId,
                    cuCompanyId:this.creat_account.cuCompanyId,
                    cuLoginName:this.creat_account.cuLoginName,
                    cuUserName:this.creat_account.cuUserName,
                    cuUserPhone:this.creat_account.cuUserPhone,
                    r:Math.random()
                }
                companyUserConAddCompanyUser(param).then((res) => {
                    if(res){
                        console.info(res);
                        if(res.code==='0'){
                            this.$message({
                                type:'success',
                                message:(type===0?'添加成功':'修改成功')
                            });
                            if(type===0){
                                this.dialogFormVisible = false;
                            }else{
                                this.dialogFormEditAccount = false;
                            }
                            this.getUsers();
                        }else{
                            this.$message({
                                type:'error',
                                message:res.message
                            });
                        }
                    }

                },error =>{
                    this.listLoading = false;
                    this.$message({
                        type:'error',
                        message:'出错了，请稍后再试'
                    })
                })

            },
            //加载企业 --- 添加账户
            addAccountLoadCompany(selectCompany){
                this.creat_account.cuCompanyId = selectCompany;
                //根据id查询企业账户信息
                companyConFindCompanyAccountMessage({companyId:selectCompany}).then((res) => {
                    if(res){
                        // console.info(res);
                        this.creat_account.cuUserName = res.accountName;
                        this.creat_account.cuUserPhone = res.accountPhone;
                        this.creat_account.ccOneCertificatesCopyUrl=res.ccOneCertificatesCopyUrl;
                        this.creat_account.cuCompanyAddress=res.province + res.city + res.area + res.address;
                    }
                },error =>{
                    this.listLoading = false;
                    this.$message({
                        type:'error',
                        message:'出错了，请稍后再试'
                    })
                });

            },

            //查询
            search(datas){
                this.defaultCompany = datas.slsect_company;//公司编号
                this.getUsers();
            },
            //初始化数据
            closeEdited(data) {
                //关闭dialog框
                this.fileList = [];
            },
            //打开创建账号
            creatAccount(){
                this.creat_account.cuLoginName='';
                this.creat_account.cuId='';
                this.creat_account.cuCompanyId='';
                this.creat_account.cuUserName = '';
                this.creat_account.cuUserPhone = '';
                this.creat_account.cuCompanyAddress='';
                this.creat_account.ccOneCertificatesCopyUrl='';
                //加载账户信息
                this.dialogFormVisible = true;
            },
            //复制账户
            copyAccount(obj){
                this.dialogCopyAccount=true;
                companyUserConCopyCompanyUserMessage({cuId:obj.cuId,r:Math.random()}).then((res) => {

                    this.listLoading = false;
                    if(res){
                        if(res.code === '0'){
                            this.account_copy.message = res.data;

                        }else{
                            this.$message.error(res.message)
                        }
                    }
                },error =>{
                    this.listLoading = false;
                    this.$message.error('出错了，请稍后再试')
                });
            },

            onCopySuccess(e){
                this.$message.success('copy成功');
                this.dialogCopyAccount=false;
            },

            onCopyError(e){
                this.$message.error('复制失败，请手动复制')
            },
            //重置密码
            resetPassword(obj){
                this.res_set_password.cuId=obj.cuId;
                this.dialogFormResetPassword = true;
            },
            changePasswordType(selectCreateType){
                this.res_set_password.dis=(selectCreateType==='0'?true:false);
                console.info("====changePasswordType:"+selectCreateType);
            },
            //修改密码
            updatePassword(){

                let isUpdate = true;
                if(this.res_set_password.random==='1'){
                    if(newPass && again){

                    }else{
                        isUpdate = false;
                    }
                }

                if(isUpdate){
                    let para = {
                        cuId:this.res_set_password.cuId,
                        newPassword:this.res_set_password.newPassword,
                        r:Math.random()
                    };

                companyUserConResetPassword(para).then((res) => {

                    this.listLoading = false;
                    if(res){
                        if(res.code === '0'){
                            this.$message.success('重置成功');
                            this.dialogFormResetPassword = false;
                            this.getUsers();
                        }else{
                            this.$message.error(res.message)
                        }
                    }
                },error =>{
                    this.listLoading = false;
                    this.$message.error('出错了，请稍后再试')
                });


                }else{
                    this.$refs['passwordForm'].validateField('newPassword');
                    this.$refs['passwordForm'].validateField('againPassword');
                }
            },
            //启用或停用
            startAccount(obj){
                let id = obj.cuId;
                this.startOrStopAccount(id,1,'');
            },
            //启用或停用
            stopAccount(obj){
                let id = obj.cuId;
                this.startOrStopAccount(id,2,'');
            },
            //启用或停用
            startOrStopAccount(id,opStatus,remark){
                companyUserConBlockUpOrStartUsing({cuId:id,opStatus:opStatus,remark:remark,r:Math.random()}).then((res) => {
                    if(res){
                        if(res.code==='0'){
                            this.$message({
                                type:'success',
                                message:(opStatus==1?"启用成功":"停用成功")
                            });
                            this.getUsers();
                        }else{
                            this.$message({
                                type:'error',
                                message:res.message
                            });
                        }
                    }
                },error =>{
                    this.listLoading = false;
                    this.$message({
                        type:'error',
                        message:'出错了，请稍后再试'
                    })
                });
            },

            //编辑
            edit(editObj){
                let companyId = editObj.cuCompanyId;
                this.creat_account.cuId=editObj.cuId;
                this.creat_account.cuCompanyId=companyId;
                this.creat_account.cuLoginName = editObj.cuLoginName;
                this.creat_account.cuUserName = editObj.cuUserName;
                this.creat_account.cuUserPhone = editObj.cuUserPhone;

                this.dialogFormEditAccount = true;
            },
            //分页
            currentClick(val) {
                this.currentPage = val;
                this.getUsers();
            },
            //每页多少条
            pageClick(val){
                this.pageSize = val;
                this.getUsers();
            },
        }
    }
</script>

<style  lang="scss">
    .tableList{
        width: 100%;
        float: left;
        border: 1px solid #d4d4d4;
        border-radius: 3px;
        background: #fff;
        margin: 10px 0;
        box-sizing: border-box;
    }
    .tool{
        text-align: center;
        height: 40px;
        width: 100%;
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
        width: 219px;
        height: 250px;
        line-height: 250px;
        text-align: center;
    }

    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>
