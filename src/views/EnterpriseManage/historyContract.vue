<template>
    <div class="box">
        <searchPanle
                @search="search"
                @timeChange="timeChange"
                :searchData="searchData"></searchPanle>
        <div class="tableList">
            <tableList
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
    </div>
</template>

<script>
    const searchPanle = r => require.ensure([], () => r(require('../../components/search.vue')), 'searchPanle');//搜索组件
    const tableList = r => require.ensure([], () => r(require('../../components/tableList.vue')), 'tableList');//列表组件
    const pagination = r => require.ensure([], () => r(require('../../components/pagination.vue')), 'pagination');//分页组件
    import {
        findContractPage,//查询合同列表
    } from '../../api/api';
    export default {
        name: "history-contract",
        components:{
            searchPanle,
            tableList,
            pagination
        },
        data(){
            return{
                //搜索
                searchData:{
                    selected:{
                        date:true,
                        month1:'开始时间',
                        month2:'结束时间'
                    },
                },
                tableData:{
                    contract:true
                },
                //分页组件
                paginationDatas:{
                    total:20,
                    currentPage: 1,
                },
                /*存储器*/
                listLoading:false,
                columns: [
                    {
                        text: '合同编号',
                        dataIndex: 'ccCompanyId',
                        type:'text',
                        width:'170'
                    },
                    {
                        text: '甲方',
                        dataIndex: 'ccFirstParty',
                        type:'text',
                        width:'200'
                    },
                    {
                        text: '乙方',
                        dataIndex: 'ccSecondParty',
                        type:'text',
                        width:'200'
                    },
                    {
                        text: '服务费率',
                        dataIndex: 'ccServiceTotalRate',
                        type:'text',
                        width:'100'
                    },
                    {
                        text: '签署日期',
                        dataIndex: 'ccSignTime',
                        type:'text',
                        sortable:true,
                        width:'170'
                    },
                    {
                        text: '有效期',
                        dataIndex: 'taskTime',
                        type:'text',
                        sortable:true,
                        width:'200'
                    },
                    {
                        text: '签署人',
                        dataIndex: 'ccCreateUserName',
                        type:'text',
                        width:'120'
                    },
                    {
                        text: '状态',
                        dataIndex: 'OpStatus',
                        type:'text',
                        width:'120'
                    }
                ],
                users: [],
                total:0,
                /*参数*/
                companyIds:sessionStorage.getItem('companyIds'),//获取企业ID  此时肯定有企业ID的
                //分页
                currentPage: 1,
                pageSize: 20,
                shouldEndDate:'',//结束时间
                shouldStartDate:'',//开始时间
                companyIdStr:'',//多个编号
            }
        },
        mounted(){
            this.getUsers();
        },
        methods:{
            getUsers(){
                let para = {
                    companyId:this.companyIds,//公司编号
                    opStatus:0,
                    signStartDate:this.shouldStartDate,//开始签署时间
                    singEndDate:this.shouldEndDate,//结束签署时间
                    current_page:this.currentPage,
                    page_size:this.pageSize,
                };
                this.listLoading = true;
                findContractPage(para).then(res =>{
                    if(res){
                        this.paginationDatas.total = res.total_count;
                        let datas = res.list?res.list:[];
                        for(let i = 0,l = datas.length;i<l;i++){
                            datas[i].taskTime = datas[i].ccStartDate + ' 至 ' +datas[i].ccEndDate;
                            if(datas[i].ccCancellationStatus === 0){
                                datas[i].OpStatus = '作废';
                            }else{
                                if(datas[i].ccLoseEfficacyStatus === 0){
                                    datas[i].OpStatus = '待生效';
                                }else if(datas[i].ccLoseEfficacyStatus === 1){
                                    datas[i].OpStatus = '生效';
                                }else if(datas[i].ccLoseEfficacyStatus === 2){
                                    datas[i].OpStatus = '失效';
                                }
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
                })
            },
            //查询
            search(datas){
                this.getUsers();
            },
            //签署时间 改变
            timeChange(searchDate){
                if(searchDate.valueMonth1){
                    this.shouldStartDate = searchDate.valueMonth1+'-01';
                }else{
                    this.shouldStartDate = searchDate.valueMonth1
                }
                if(searchDate.valueMonth2){
                    this.shouldEndDate = searchDate.valueMonth2+'-01';
                }else{
                    this.shouldEndDate = searchDate.valueMonth2
                }
                //this.getUsers();
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
    .tableList{
        width: 100%;
        float: left;
        border: 1px solid #d4d4d4;
        border-radius: 3px;
        background: #fff;
        margin: 10px 0;
        box-sizing: border-box;
    }
</style>
