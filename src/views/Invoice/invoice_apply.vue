<template>
    <div class="box">
        <searchPanle
                @ordersCompanyChange="ordersCompanyChange"
                @updataTask="updataTask"
                v-on:timeChange="timeChange"
                v-on:search="search"
                :searchData="searchData"></searchPanle>
        <div class="tableList">
            <el-tabs v-model="activeName" @tab-click="handleClick" style="padding: 0 20px;">
                <el-tab-pane
                        v-for="(val,index) in contractTypes"
                        :key="val.value"
                        :label="val.label"
                        :name="val.value" ></el-tab-pane>
            </el-tabs>
            <div class="totle">
                <div class="totle_item">
                    <el-button
                            :disabled="this.sels.length===0"
                            type="warning"
                            size="small"
                            @click="applyInvoice"
                            plain>申请开票</el-button>

                </div>
            </div>
            <tableList
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
        <!--申请开票表格-->
        <el-dialog title="开票信息" :visible.sync="dialogTableVisible" class="apply_tool">
            <el-table :data="gridData">
                <el-table-column align="center" property="companyName" label="企业名称" ></el-table-column>
                <el-table-column align="center" property="coTransactionPrice" label="开票金额（元）" ></el-table-column>
                <el-table-column align="center" property="coIds" label="关联订单数" :formatter="formatter"></el-table-column>
            </el-table>
            <div class="tool">
                <el-button size="small" type="primary" @click="updataInvoice">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    const tableList = r => require.ensure([], () => r(require('../../components/tableList.vue')), 'tableList');//列表组件
    const pagination = r => require.ensure([], () => r(require('../../components/pagination.vue')), 'pagination');//分页组件
    const searchPanle = r => require.ensure([], () => r(require('../../components/search.vue')), 'searchPanle');//搜索组件

    import {
        findCompanyOrders,//开票列表
        saveInvoice,//点击申请开票
    } from '../../api/api'
    export default {
        name: "invoice",
        components:{
            searchPanle,
            tableList,
            pagination
        },
        data(){
            return{
                /*props*/
                searchData:{
                    selected:{
                        company:true,
                        date:true,
                        month1:'结算开始日期',
                        month2:'结算结束日期'
                    },
                },
                //分页组件
                paginationDatas:{
                    total:20,
                    currentPage: 1,
                },
                tableData:{
                    selected:true,
                },
                //工具
                toolData:{
                    tools:{
                        invoice_apply:true
                    }
                },
                /*存储器*/
                columns: [
                    {
                        text: '结算单号',
                        dataIndex: 'coBusNo',
                        type:'text',
                        width:'200'
                    },

                    {
                        text: '企业名称',
                        dataIndex: 'companyName',
                        type:'text',
                        width:'200'
                    },
                    {
                        text: '结算月',
                        dataIndex: 'coShouldGrantDate',
                        type:'text',
                        sortable:true,
                        width:'170'
                    },
                    {
                        text: '充值金额（元）',
                        dataIndex: 'coTransAccount',
                        type:'text',
                        width:'170'
                    },
                    {
                        text: '应发金额（元）',
                        dataIndex: 'coTotalPrice',
                        type:'text',
                        width:'170'
                    },
                    {
                        text: '服务费（元）',
                        dataIndex: 'coServicePrice',
                        type:'text',
                        width:'170'
                    },
                    {
                        text: '发薪人数（人）',
                        dataIndex: 'coTotalCount',
                        type:'text',
                        width:'170'
                    },
                    {
                        text: '结算日期',
                        dataIndex: 'grantTime',
                        type:'text',
                        sortable:true,
                        width:'170'
                    },
                    {
                        text: '状态',
                        dataIndex: 'PayStatus',
                        type:'text',
                        width:'120',
                        fixed:'right'
                    }
                ],
                users: [],
                total:0,

                contractTypes:[
                    {label:'正常开票',value:'5'},
                    {label:'预开票',value:'2'}
                ],
                //分页
                currentPage: 1,
                pageSize: 20,
                /*发票列表*/
                shouldStartDate:'',
                shouldEndDate:'',
                activeName: '5',
                ciiIssueType:'5',
                ciiIssueTypes:'2',
                defaultCompany:'',
                upDataDatas:{
                    ciiIssueType:0,
                },
                /*申请开票*/
                sels:[],
                dialogTableVisible:false,
                gridData:[]
            }
        },
        mounted(){
            //获取 路由跳转过来的 是否有params
            let payStatus = this.$route.params.payStatus;//从首页跳转过来的  带有payStatus
            if(payStatus){
                switch (payStatus){
                    case '已申请开票':
                        this.payStatus = '5';
                        this.model = '5';
                        break;
                    case '未申请开票':
                        this.payStatus = '1,2,3';
                        this.model = '1,2,3';
                        break;
                    default:
                        break;
                }
            }
            this.getUsers();
        },
        methods:{
            //获取申请列表
            getUsers(obj) {
                let para;
                if(obj){
                    para = obj;
                }else{
                    para = {
                        //ciiIssueType:this.upDataDatas.ciiIssueType,//发票开具类型0正常开票,1预开票
                        companyId:this.defaultCompany,//公司编号
                        startTime:this.shouldStartDate,//开始时间
                        endTime:this.shouldEndDate,//结束时间
                        payStatusStr:this.ciiIssueType,//发票开具类型 0 正常开票 1预开票
                        current_page:this.currentPage,
                        page_size:this.pageSize,
                    };
                }
                this.listLoading = true;
                findCompanyOrders(para).then(res => {
                    if(res){
                        this.listLoading = false;
                        this.paginationDatas.total = res.total_count;
                        let datas = res.list?res.list:[];
                        let k,p,companyId='',status,companyList = JSON.parse(sessionStorage.getItem('companyList'))
                        for(let i = 0,l = datas.length;i<l;i++){
                            /*循环加上公司名称*/
                            //  companyList = this.companyList;
                            companyId = datas[i].coCompanyId;//公司ID
                            status = datas[i].coPayStatus;
                            for(k = 0,p = companyList.length;k<p;k++){
                                if(companyId === companyList[k].cId){
                                    datas[i].companyName = companyList[k].cName;
                                }
                                if(status === 1){
                                    datas[i].PayStatus = '待结算';
                                }else if(status === 4 || status === 2){
                                    datas[i].PayStatus = '结算中';
                                }else if(status === 5){
                                    datas[i].PayStatus= '已结算';
                                }else if(status=== 7){
                                    datas[i].PayStatus= '订单删除';
                                }else if(status === 11){
                                    datas[i].PayStatus= '开票中';
                                }else if(status === 12){
                                    datas[i].PayStatus= '已开票';
                                }
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
                this.activeName = tab.name;
               // this.ciiIssueType = Number(this.activeName);
                if(this.activeName == '1,4,5'){
                    this.ciiIssueTypes = '0';
                }else{
                    this.ciiIssueTypes = this.activeName;
                }
                this.ciiIssueType = this.activeName;
                this.currentPage = 1;
                this.pageSize = 20;
                this.getUsers();
            },
            //select选择
            handleSelectionChange(sels){
               this.sels = sels;
            },
            //申请开票
            applyInvoice(){
                let ids = '';
                for(let i = 0,l = this.sels.length;i<l;i++){
                    ids += ','+ this.sels[i].coId;
                }
                ids = ids.substring(1);
                let para = {
                    coIds:ids,
                    ciiIssueType:this.ciiIssueTypes,
                    boo:false
                };
                saveInvoice(para).then(res =>{
                    if(res.status === 200 && res.data){
                        this.gridData = res.data?res.data:[];
                        let k,p,companyId='',companyList = JSON.parse(sessionStorage.getItem('companyList'));
                        for(let i = 0,l = this.gridData.length;i<l;i++){
                            /*循环加上公司名称*/
                            //  companyList = this.companyList;
                            companyId = this.gridData[i].coCompanyId;//公司ID
                            for(k = 0,p = companyList.length;k<p;k++){
                                if(companyId === companyList[k].cId){
                                    this.gridData[i].companyName = companyList[k].cName;
                                }
                            }
                        }
                        this.dialogTableVisible = true;

                    }
                })
            },
            //提交开票信息
            updataInvoice(){
                let ids = '';
                for(let i = 0,l = this.sels.length;i<l;i++){
                    ids += ','+ this.sels[i].coId;
                }
                ids = ids.substring(1);
                let para = {
                    coIds:ids,
                    ciiIssueType:this.ciiIssueType,
                    boo:true
                };
                saveInvoice(para).then(res =>{
                    if(res.status === 200){
                        this.dialogTableVisible = false;
                        this.getUsers();
                        this.sels = [];
                        this.$message({
                            type:'success',
                            message:res.message
                        })
                    }else{
                        this.$message({
                            type:'warning',
                            message:res.message
                        })
                    }
                })
            },
            formatter(row, column){
                if(row.coIds.indexOf(',') === -1){
                    //单条关联
                    return 1;
                }else{
                    return row.coIds.split(',').length;
                }
            },
            //公司改变
            ordersCompanyChange(a){
                this.defaultCompany = a;
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

                //this.getUsers();
            },
            //查询
            search(datas){
                this.defaultCompany = datas.slsect_company;//公司编号
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
        }
    }
</script>

<style scoped lang="scss">
    .apply_tool .tool{
        text-align: center;
        height: 40px;
        padding-top: 20px;
        width: 100%;
    }
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
        }
    }
</style>
