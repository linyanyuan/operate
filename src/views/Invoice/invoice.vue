<template>
    <div class="box">
        <searchPanle
                @statesChange="statesChange"
                @normalDate="normalDate"
                @ordersCompanyChange="ordersCompanyChange"
                v-on:search="search"
                :searchData="searchData"></searchPanle>
        <div class="tableList">
            <el-tabs v-model="activeName" @tab-click="handleClick" style="padding: 0 20px;">
                <el-tab-pane
                        v-for="val in contractTypes"
                        :key="val.value"
                        :label="val.label"
                        :name="val.value" ></el-tab-pane>
            </el-tabs>
            <div class="totle">
                <div class="totle_item" >
                    <el-button
                            :disabled="this.sels.length===0"
                            icon="el-icon-download"
                            type="warning"
                            size="small"
                            @click="exportInviceMes"
                            plain>批量导出开票信息</el-button>

                </div>
                <div class="totle_item" v-if="activeName === '0'">
                    <el-button
                            icon="el-icon-download"
                            type="warning"
                            size="small"
                            @click="dialogFormVisible = true"
                            plain>上传邮寄单号</el-button>

                </div>
            </div>
            <tableList
                    @balanceRoute="balanceRoute"
                    @handleSelectionChange="handleSelectionChange"
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

        <!--上传邮寄单号-->
        <el-dialog
                @close="closeEdited"
                title="上传邮寄单号"
                :visible.sync="dialogFormVisible">
            <el-upload
                    style="width: 370px;margin: 0 auto"
                    class="upload-demo"
                    drag
                    name="file"
                    :action="importSalaryOrdersViews"
                    :headers="headers"
                    :before-upload="beforeUpload"
                    :on-remove="handleRemove"
                    :on-success="success"
                    :on-error="errors"
                    :file-list="fileList"
                    multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">
                    只能上传excel文件
                </div>
            </el-upload>
            <div style="width: 370px;margin: 0 auto" v-show="uploading">
                <div data-v-fbc4c2ec="" class="el-upload__tip" v-if="upload">数据处理中...</div>
                <!-- <div data-v-fbc4c2ec="" class="el-upload__tip" v-if="!upload">上传完成，成功 <span style="color: #0f0;font-size: 26px">{{succeeNum}}</span>人，失败 <span style="color: #f00;font-size: 26px">{{faileNum}}</span>人</div>-->
               <!-- <div data-v-fbc4c2ec="" class="el-upload__tip" v-if="error"><a :href="errorUrl">点击下载错误文件</a></div>-->
            </div>
        </el-dialog>
    </div>
</template>

<script>
    const tableList = r => require.ensure([], () => r(require('../../components/tableList.vue')), 'tableList');//列表组件
    const pagination = r => require.ensure([], () => r(require('../../components/pagination.vue')), 'pagination');//分页组件
    const searchPanle = r => require.ensure([], () => r(require('../../components/search.vue')), 'searchPanle');//搜索组件
    import {
        findPageFinancial,//发票列表（财务）
        exportInvice,//批量导出
        importInvoiceMessage,//上传邮寄单号
    } from '../../api/api';
    import util from '../../utils/util';
    export default {
        name: "invoice",
        components:{
            searchPanle,
            tableList,
            pagination,
        },
        data(){
            return{
                /*props*/
                searchData:{
                    selected:{
                        company:true,
                        state:true,
                        normalDate:true,
                        holder1:'申请开始日期',
                        holder2:'申请结束日期'
                    },
                    typeDatas:[
                        {name:'正常开票',value:0},
                        {name:'预开票',value:1},
                    ],
                    props:{
                        holder:'开票类别'
                    }
                },
                listLoading:false,
                //分页组件
                paginationDatas:{
                    total:20,
                    currentPage: 1,
                },
                tableData:{
                    selected:true,
                },
                /*存储器*/
                columns: [
                    {
                        text: '处理状态',
                        dataIndex: 'ciiStatusType',
                        type:'text',
                        width:'100'
                    },
                    {
                        text: '申请日期',
                        dataIndex: 'ciiDate',
                        type:'text',
                        sortable:true,
                        width:'170'
                    },
                    {
                        text: '处理日期',
                        dataIndex: 'ciiUpdateDate',
                        type:'text',
                        sortable:true,
                        width:'170'
                    },
                    {
                        text: '企业名称',
                        dataIndex: 'ciiCompanyName',
                        type:'text',
                        width:'200'
                    },
                    {
                        text: '开票金额（元）',
                        dataIndex: 'ciiPrice',
                        type:'text',
                        width:'170'
                    },
                    {
                        text: '快递单号',
                        dataIndex: 'ciiExpressNumber',
                        type:'text',
                        width:'120'
                    },
                    {
                        text: '申请人',
                        dataIndex: 'ciiCreateUserName',
                        type:'text',
                        width:'100'
                    },
                    {
                        text: '处理人',
                        dataIndex: 'ciiUpdateUserName',
                        type:'text',
                        width:'100'
                    },
                    {
                        text: '开票类别',
                        dataIndex: 'ciiIssueTypeTitle',
                        type:'text',
                        width:'100'
                    }
                ],
                users: [],
                total:0,
                contractTypes:[
                    {label:'已开',value:'1'},
                    {label:'待开',value:'3'},
                    {label:'开票中',value:'0'},

                ],
                //分页
                currentPage: 1,
                pageSize: 20,
                /*接口参数部分*/
                //发票管理（财务）
                shouldStartDate:'',
                shouldEndDate:'',
                activeName: '1',
                upDataDatas:{
                    ciiIssueType:0,
                    companyId:''
                },
                //批量导出
                //批量导出开票信息
                sels:[],
                exportInvoiceMes:exportInvice+'?ciiId=',
                //上传邮寄单号
                dialogFormVisible:false,
                uploading:true,
                upload:false,
                importSalaryOrdersViews:importInvoiceMessage,
                fileList:[],//上传的文件列表
                headers:{
                    CsrfRandomToken:''
                },
            }
        },
        mounted(){
            //获取 路由跳转过来的 是否有params
            let payStatus = this.$route.params.payStatus;//从首页跳转过来的  带有payStatus
            if(payStatus){
                switch (payStatus){
                    case '待开票':
                        this.activeName = '3';
                        break;
                    case '待上传快递单':
                        this.activeName = '0';
                        break;
                    default:
                        break;
                }
            }
            this.getUsers();
        },
        methods:{
            //获取开票列表
            getUsers(obj) {
                let para;
                if(obj){
                    para = obj;
                }else{
                    para = {
                        //ciiIssueType:this.upDataDatas.ciiIssueType,//发票开具类型0正常开票,1预开票
                        ciiIssueTypeStr:'0,1',
                        ciiCompanyId:this.upDataDatas.companyId,//公司编号
                        ciiStartDate:this.shouldStartDate,//开始时间
                        ciiEndDate:this.shouldEndDate,//结束时间
                        ciiStatus:this.activeName,//发票状态0开票中,1已开,2作废,3待开
                        current_page:this.currentPage,
                        page_size:this.pageSize,
                    };
                }
                this.listLoading = true;
                findPageFinancial(para).then(res => {
                    if(res){
                        this.listLoading = false;
                        this.paginationDatas.total = res.total_count;
                        let datas = res.list?res.list:[];
                        for(let i = 0,l = datas.length;i<l;i++){
                            //datas[i].taskTime = datas[i].startDate + ' 至 ' +datas[i].endDate;
                            if(datas[i].ciiStatus === 0){
                                datas[i].ciiStatusType = '开票中';
                            }else if(datas[i].ciiStatus === 1){
                                datas[i].ciiStatusType = '已开票';
                            }else if(datas[i].ciiStatus === 3){
                                datas[i].ciiStatusType = '待开票';
                            }
                            if(datas[i].ciiIssueType === 0){
                                datas[i].ciiIssueTypeTitle = '正常开票';
                            }else if(datas[i].ciiIssueType === 1){
                                datas[i].ciiIssueTypeTitle = '预开票';
                            }
                        }
                        this.users = datas;
                    }

                },error =>{
                    this.listLoading = false;
                });
            },
            //tab切换
            handleClick(tab, event) {
                if(tab.name === '0'){
                    let para  = {
                        ciiExpressStatus:0,
                        ciiCompanyId:this.upDataDatas.companyId,//公司编号
                        ciiStartDate:this.shouldStartDate,//开始时间
                        ciiEndDate:this.shouldEndDate,//结束时间
                        ciiStatus:this.activeName,//发票状态0开票中,1已开,2作废,3待开
                        current_page:this.currentPage,
                        page_size:this.pageSize,
                    };
                    this.activeName = tab.name;
                    this.active = Number(this.activeName);
                    this.currentPage = 1;
                    this.pageSize = 20;
                    this.getUsers(para);
                }else{
                    this.activeName = tab.name;
                    this.active = Number(this.activeName);
                    this.currentPage = 1;
                    this.pageSize = 20;
                    this.getUsers();
                }

            },
            //select选择
            handleSelectionChange(sels){
                this.sels = sels;
            },
            //物流信息
            balanceRoute(row){
                this.$router.push({
                    name:"物流信息",
                    path:'/home/invoiceIndex/logistics',
                    params:{
                        invoice:row
                    }
                })
            },
            //查询
            search(datas){
                this.defaultCompany = datas.slsect_company;//公司编号
                this.getUsers();
            },
            //导出开票信息
            exportInviceMes(){
                let ids = '';
                for(let i = 0,l = this.sels.length;i<l;i++){
                    ids += ','+ this.sels[i].ciiId;
                }
                ids = ids.substring(1);
                window.open(exportInvice+'?ciiId='+ids+'&current_page='+this.currentPage+'&page_size='+this.pageSize,'_self');
            },
            //开票类别状态改变
            statesChange(data){
                if(data === 0 || data === 1){
                    this.upDataDatas.ciiIssueType = data;
                    let para = {
                        ciiIssueType:this.upDataDatas.ciiIssueType,//发票开具类型0正常开票,1预开票
                        ciiCompanyId:this.upDataDatas.companyId,//公司编号
                        ciiStartDate:this.shouldStartDate,//开始时间
                        ciiEndDate:this.shouldEndDate,//结束时间
                        ciiStatus:this.activeName,//发票状态0开票中,1已开,2作废,3待开
                        current_page:this.currentPage,
                        page_size:this.pageSize,
                    };
                    this.getUsers(para);
                }else{
                    this.getUsers();
                }

            },
            //公司改变
            ordersCompanyChange(a){
                this.upDataDatas.companyId = a;
                this.getUsers();
            },
            //改变时间
            normalDate(date){
                if(date){
                    this.shouldStartDate = util.dateToNormal(date[0]);
                    this.shouldEndDate = util.dateToNormal(date[1]);

                }else{
                    this.shouldStartDate = '-1';
                    this.shouldEndDate = '-1';
                }
                this.getUsers();
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
            /*
            * 上传邮寄单号
            * */
            success(response, file, fileList){
                if(response.data){
                    this.fileList = fileList;
                    this.uploading = false;
                    this.upload = false;
                    this.dialogFormVisible = false;
                    this.$message({
                        type:'success',
                        message:response.message
                    });
                    this.getUsers()
                }else{
                    this.$message({
                        type:'error',
                        message:response.message
                    })
                }
            },
            errors(err, file, fileList){
                this.$message({
                    type:'error',
                    message:'文件上传失败'
                })
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
            handleRemove(file, fileList) {
                this.upload = false;
            },
            closeEdited(data) {
                //关闭dialog框
                this.fileList = [];
            },
            beforeUpload(file){
                const isExcel = (
                    file.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type == 'application/vnd.ms-excel'  || file.name.indexOf(".xls") > 0 || file.name.indexOf(".xlsx") > 0);
                if (!isExcel) {
                    this.$message.error('只能上传excel文件!');
                    return false;
                }
                this.getCookie();
                this.headers.CsrfRandomToken =  this.cookie;
                this.uploading = true;
                this.upload = true;
            },
        }
    }
</script>

<style scoped lang="scss">
    .tableList{
        width: 100%;
        float: left;
        border: 1px solid #d4d4d4;
        border-radius: 3px;
        background: #fff;
        margin: 10px 0;
        box-sizing: border-box;
    }
    .totle{
        width: 100%;
        padding: 0 30px 0 20px;
        box-sizing: border-box;
        float: left;
        margin-bottom: 10px;
        .totle_item{
            float: left;
            height: 30px;
            line-height: 30px;
            margin-left: 10px;
        }
    }
</style>
