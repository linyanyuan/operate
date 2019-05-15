<template>
    <div class="box">
        <searchPanle
                @updataTask="updataTask"
                @statesChange="statesChange"
                @timeChange="timeChange"
                @search="search"
                @ordersCompanyChange="ordersCompanyChange"
                :searchData="searchData"></searchPanle>
        <div class="tableList">
            <tableList
                    v-on:readResult="readResult"
                    @aditResult="aditResult"
                    :columns="columns"
                    :loading="listLoading"
                    :tableData="tableData"
                    :data-source="users"></tableList>
        </div>
        <!--工具条-->
        <pagination
                @currentClick="currentClick"
                @pageClick="pageClick"
                :paginationDatas="paginationDatas"></pagination>
        <!--上传任务结果-->
        <el-dialog
                @close="closeEdited"
                class="main_upload"
                title="上传结果"
                :visible.sync="dialogFormVisible">
            <div>
                <el-form style="width: 500px;margin: 0 auto"
                         :model="upDataData"
                         :rules="rules"
                         ref="ruleForm"
                         label-position="right"
                         label-width="85px">
                    <el-form-item
                            v-if="reason"
                            label="不通过原因">
                        <el-input
                                disabled
                                v-model="reason"
                                style="margin-top: 1px;"
                                @keydown.native.enter="eventClick('search')"
                                size="small"></el-input>
                    </el-form-item>
                    <el-form-item
                            label="公司名称"  prop="companyId">
                        <el-select
                                size="small"
                                clearable
                                @visible-change="visChange"
                                @change="itemSelect1"
                                v-model="upDataData.companyId"
                                placeholder="公司名称(可搜索)"
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
                    <el-form-item label="任务周期" required>
                        <el-col :span="11">
                            <el-form-item prop="valueMonth1">
                                <el-date-picker
                                        style="width:170px;"
                                        v-model="upDataData.valueMonth1"
                                        :placeholder="searchData.selected.month1"
                                        size="small"
                                        value-format="yyyy-MM"
                                        @change="timeChange1"
                                        type="month">
                                </el-date-picker>
                            </el-form-item>

                        </el-col>
                        <el-col :span="2">—</el-col>
                        <el-col :span="11">
                            <el-form-item prop="valueMonth2">
                                <el-date-picker
                                        style="width:170px;"
                                        @change="timeChange2"
                                        v-model="upDataData.valueMonth2"
                                        :placeholder="searchData.selected.month2"
                                        size="small"
                                        value-format="yyyy-MM"
                                        type="month">
                                </el-date-picker>
                            </el-form-item>

                        </el-col>

                    </el-form-item>
                    <el-form-item label="任务名称" prop="name">
                        <el-input
                                placeholder="输入任务名称"
                                v-model="upDataData.name"
                                @keydown.native.enter="eventClick('search')"
                                size="small"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <el-upload
                    :headers="headers"
                    drag
                    class="avatar-uploader"
                    :action="upDataTask"
                    :show-file-list="false"
                    :multiple=true
                    :file-list="fileList"
                    :before-upload="beforeUpload"
                    :on-success="success">
               <!-- <img v-if="pdf_path" :src="imageUrl" class="avatar">-->
                <el-scrollbar style="height: 100%"  v-if="pdf_path">
                    <pdf :src="pdf_path" @error="pdfError"
                         v-if="pdf_path"
                         @num-pages="pageCount = $event"
                         @page-loaded="currentPage = $event" :page="page"></pdf>
                </el-scrollbar>
                <i v-if="pdf_path === ''" class="el-icon-plus avatar-uploader-icon">上传任务</i>
            </el-upload>
            <div class="tool" >
                <el-button type="primary" @click="btnClick(2)" size="small"  style="width: 100px;">重新上传</el-button>
                <el-button type="primary" @click="btnClick(1)" size="small" style="width: 100px;">确认</el-button>
            </div>
        </el-dialog>

        <!--任务详情预览-->
        <el-dialog
                @close="handleClose"
                :loading="isLoading"
                :visible.sync="showReadResult">
            <pdf :src="pdf_path_real" @error="pdfError"
                 @num-pages="pageCount_real = $event"
                 @page-loaded="currentPage_real = $event" :page="page_real"></pdf>
            <div v-if="pageCount_real > 1" class="leftBtn el-icon-arrow-left" @click="pervPage"></div>
            <div v-if="pageCount_real > 1" class="rightBtn el-icon-arrow-right" @click="nextPage"></div>
        </el-dialog>
    </div>
</template>

<script>
    const searchPanle = r => require.ensure([], () => r(require('../../components/search.vue')), 'searchPanle');//搜索组件
    const tableList = r => require.ensure([], () => r(require('../../components/tableList.vue')), 'tableList');//列表组件
    const pagination = r => require.ensure([], () => r(require('../../components/pagination.vue')), 'pagination');//分页组件
    const pdf  = r => require.ensure([], () => r(require('vue-pdf')), 'pdf');//pdf组件
    import {
        findTaskPage,//查询任务列表
        uploadPdf,//上传结果
        addTaskResult,//上传任务结果
        findCompanyList,
        getResultAppearFileById,//详情PDF
    } from '../../api/api'

    export default {
        name: "index",
        data(){
            return{
                searchData:{
                    selected:{
                        company:true,
                        date:true,
                        state:true,
                        taskUpdata:true,
                        month1:'任务周期开始月份',
                        month2:'任务周期结束月份'
                    },
                    typeDatas:[
                        {name:'全部',value:null},
                        {name:'待验收',value:0},
                        {name:'已验收',value:1},
                        {name:'不通过',value:2},
                    ],
                    props:{
                        holder:'任务状态'
                    }
                },
                tableData:{
                    task:true,
                },
                //分页组件
                paginationDatas:{
                    total:20,
                    currentPage: 1,
                },
                /*控制器*/
                /*存储器*/
                columns: [
                    {
                        text: '上传日期',
                        dataIndex: 'createDateStr',
                        type:'text',
                        sortable:true,
                        width:'170'
                    },
                    {
                        text: '企业名称',
                        dataIndex: 'companyName',
                        type:'text',
                        width:'200'
                    },
                    {
                        text: '任务名称',
                        dataIndex: 'title',
                        type:'text',
                        width:'170'
                    },
                    {
                        text: '任务周期',
                        dataIndex: 'taskTime',
                        type:'text',
                        width:'200'
                    },
                    {
                        text: '验收日期',
                        dataIndex: 'checkDate',
                        type:'text',
                        sortable:true,
                        width:'170'
                    },
                    {
                        text: '状态',
                        dataIndex: 'check',
                        type:'text',
                        width:'120'
                    },
                    {
                        text: '创建人',
                        dataIndex: 'createUserName',
                        type:'text',
                        width:'120'
                    }
                ],
                listLoading:false,
                users: [],
                total:0,

                //分页
                currentPage: 1,
                pageSize: 20,
                /*上传结果*/
                //上传校验
                rules: {
                    companyId: [
                        { required: true, message: '请选择公司', trigger: 'blur' },
                    ],
                    valueMonth1: [
                        { required: true, message: '请选择任务周期开始月份', trigger: 'change' }
                    ],
                    valueMonth2: [
                        { required: true, message: '请选择任务周期结束月份', trigger: 'change' }
                    ],
                    name: [
                        { required: true, message: '请输入任务名称', trigger: 'blur' },
                    ],
                },
                fileList:[],//上传的文件列表
                dialogFormVisible:false,//上传任务结果
                /*修改*/
                reason:'',//不通过原因
                //参数
                defaultCompany:'',
                shouldStartDate:'',
                shouldEndDate:'',
                checkStatus:null,//验收状态：1通过，2不通过
                //上传结果参数

                /*PDF*/
                pdf_path:'',
                show: true,
                currentPages:1,
                pageCount: 0,
                loadedRatio: 0,
                page: 1,
                numPages: 0,
                rotate: 0,
                datas:{},
                upDataTask:uploadPdf,
                headers:{
                    CsrfRandomToken:''
                },
                upDataData:{
                    companyId:'',//企业id
                    name:'',
                    valueMonth1:'',
                    valueMonth2:'',
                    id:''
                },
                companyList:[],
                /*任务详情预览模块*/
                isLoading:false,
                showReadResult:false,//是否预览
                pdf_path_real:'',//详情PDF 路径
                currentPage_real:1,
                pageCount_real: 0,
                loadedRatio_real: 0,
                page_real: 1,
            }
        },
        components:{
            searchPanle,
            tableList,
            pagination,
            pdf
        },
        mounted(){
            findCompanyList({cVirtualCompany:0}).then((res)=>{
                if(res){
                    this.companyList = res.data;
                }
            });
            this.getUsers();
        },
        methods:{

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
            //选择公司
            itemSelect1:function (data) {
                this.upDataData.companyId = data;
            },
            beforeUpload(file){
                const isExcel = (
                    file.type ==  file.type == 'application/pdf'  || file.name.indexOf(".pdf") > 0);

                if (!isExcel) {
                    this.$message.error('只能上传PDF文件!');
                    return false;
                }
                this.getCookie();
                this.headers.CsrfRandomToken =  this.cookie;
            },
            success(response, file, fileList){
                console.log(response, file, fileList)
                this.fileList = fileList;
                this.pdf_path = response.data;
               /* this.$emit('updatas',response,this.data);
                this.dialogFormVisible = false;*/
            },
            //初始化数据
            closeEdited(data) {
                //关闭dialog框
                this.fileList = [];
                this.pdf_path = '';
            },
            btnClick(type){
                if(type === 2){
                    //重新上传
                    this.fileList = [];
                    this.pdf_path = '';
                }else{
                    this.$refs['ruleForm'].validate((valid) => {
                        if (valid) {
                            this.upDataTaskResult();
                        } else {
                            return false;
                        }
                    });

                }
            },
            nextPage(){
                if(this.page_real === this.pageCount_real){
                    this.$message({
                        type:'warning',
                        message:'当前为最后一页'
                    });
                    return false
                }else{
                    this.page_real++;
                }

            },
            pervPage(){
                if(this.page_real === 1){
                    this.$message({
                        type:'warning',
                        message:'当前为第一页'
                    });
                    return false;
                }else{
                    this.page_real--;
                }

            },
            //获取任务列表
            getUsers() {
                let para;
                if(this.defaultCompany){
                     para = {
                        companyId:this.defaultCompany,//公司编号
                        startDate:this.shouldStartDate,//开始时间
                        endDate:this.shouldEndDate,//结束时间
                        checkStatus:this.checkStatus,//验收状态0未验收,1验收通过,2验收未通过
                        current_page:this.currentPage,
                        page_size:this.pageSize,
                    };
                }else{
                    para = {
                        companyId:this.defaultCompany,//公司编号
                        startDate:this.shouldStartDate,//开始时间
                        endDate:this.shouldEndDate,//结束时间
                        checkStatus:this.checkStatus,//验收状态0未验收,1验收通过,2验收未通过
                        current_page:this.currentPage,
                        page_size:this.pageSize,
                        findAll:true
                    };
                }
                this.listLoading = true;
                findTaskPage(para).then((res) => {
                    if(res){
                        this.paginationDatas.total = res.total_count;
                        let datas = res.list?res.list:[];
                        for(let i = 0,l = datas.length;i<l;i++){
                            datas[i].taskTime = datas[i].startDate + ' 至 ' +datas[i].endDate;
                            if(datas[i].checkStatus === 0){
                                datas[i].check = '待验收';
                            }else if(datas[i].checkStatus === 1){
                                datas[i].check = '验收通过';
                            }else if(datas[i].checkStatus === 2){
                                datas[i].check = '验收未通过';
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
            //上传任务结果
            upDataTaskResult(){
                if(this.pdf_path == ''){
                    this.$message({
                        type:'warning',
                        message:'请上传PDF结果文件'
                    });
                    return false;
                }
                let para = {
                    companyId:this.upDataData.companyId,//公司编号
                    startDate:this.upDataData.valueMonth1,//开始时间
                    endDate:this.upDataData.valueMonth2,//结束时间
                    title:this.upDataData.name,
                    taskPdfPath:this.pdf_path,
                    id:this.upDataData.id
                };
                addTaskResult(para).then(res =>{
                    if(res.data){
                        this.$message({
                            type:'success',
                            message:res.message
                        });
                        this.dialogFormVisible = false;
                        this.getUsers();
                    }
                })
            },
            //公司改变
            ordersCompanyChange(a){
                this.defaultCompany = a;
                this.getUsers();
            },
            //打开上传结果
            updataTask(){
                this.dialogFormVisible = true;
            },
            //任务状态改变
            statesChange(type){
                this.checkStatus = type;
                this.getUsers();
            },
            //时间 改变
            timeChange(searchDate){
                if(searchDate.valueMonth1){
                    this.shouldStartDate = searchDate.valueMonth1
                }else{
                    this.shouldStartDate = searchDate.valueMonth1
                }
                if(searchDate.valueMonth2){
                    this.shouldEndDate = searchDate.valueMonth2
                }else{
                    this.shouldEndDate = searchDate.valueMonth2
                }
                this.getUsers();
            },
            //关闭遮罩层
            handleClose(done) {
                this.showReadResult = false;//关闭PDF遮罩
            },
            pdfError(obj){
                if(obj){
                    this.$message({
                        type:'error',
                        message:'文件加载出错'
                    })
                }
            },
            //修改
            aditResult(datas){
                this.reason = '';
                if(datas.checkStatus === 2){
                    //不通过
                    this.reason = datas.checkStatus;
                }
                //待验收
                this.upDataData.companyId = datas.companyId;
                this.upDataData.name = datas.title;
                this.upDataData.valueMonth1 = datas.startDate;
                this.upDataData.valueMonth2 = datas.endDate;
                this.upDataData.id = datas.id;
                let para = {
                    foreignKey:datas.id
                };
                getResultAppearFileById(para).then(res =>{
                    if(res && res.length > 0){
                        this.pdf_path = res[0].path;
                    }else if(res.length === 0){
                        this.$message({
                            type:'error',
                            message:'没找到PDF文件'
                        });
                    }else{
                        this.$message({
                            type:'error',
                            message:res.message
                        });
                    }
                    this.dialogFormVisible = true;
                });
            },
            //预览
            readResult(datas){
                //预览PDF地址不存在
                let para = {
                    foreignKey:datas.id
                };
                this.pdf_path_real = '';
                this.isLoading = true;
                getResultAppearFileById(para).then(res =>{
                    if(res){
                        this.isLoading = false;
                        this.showReadResult = true;
                        this.pdf_path_real = res.path;
                    }else if(res.path == ''){
                        this.$message({
                            type:'error',
                            message:'没有PDF文件'
                        })
                    }
                },error =>{
                    this.isLoading = false;
                })
            },
            //查询
            search(datas){
                // this.defaultCompany = datas.slsect_company;//公司编号
                this.getUsers();
            },
            //上传结果任务周期改变
            //时间改变
            timeChange1(a){
                this.upDataData.valueMonth1 = a;
            },
            //时间改变
            timeChange2(a){
                this.upDataData.valueMonth2 = a;
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
    .annotationLayer{
        display: none;
    }
    .main_upload .tool{
        text-align: center;
        height: 40px;
        padding-top: 10px;
        width: 100%;
    }
    .main_upload{
        .el-upload-dragger{
            width: 450px;
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
    .tableList{
        width: 100%;
        float: left;
        border: 1px solid #d4d4d4;
        border-radius: 3px;
        background: #f4f4f4;
        margin: 10px 0;
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
