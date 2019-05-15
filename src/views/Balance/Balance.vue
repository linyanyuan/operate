<template>
    <div class="box">
        <topTool
                :toolData="toolData"
                v-on:updataRoute="updataRoute"></topTool>
        <searchPanle
                @statesChange="statesChange"
                @search="search"
                @timeChange="timeChange"
                @ordersCompanyChange="ordersCompanyChange"
                ref="searchPanle"
                :model="model"
                :searchData="searchData"></searchPanle>
        <div class="tableList">
            <tableList
                    v-on:balanceRoute="balanceRoute"
                    @topUp="topUp"
                    @downLoadUpload="getUsers"
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
    </div>
</template>

<script>
    const searchPanle = r => require.ensure([], () => r(require('../../components/search.vue')), 'searchPanle');//搜索组件
    const tableList = r => require.ensure([], () => r(require('../../components/tableList.vue')), 'tableList');//列表组件
    const pagination = r => require.ensure([], () => r(require('../../components/pagination.vue')), 'pagination');//分页组件
    const topTool = r => require.ensure([], () => r(require('../../components/topTool.vue')), 'topTool');//工具按钮组件
    import {
        findBalanceOrders,
        findCompanyList,
        orderAddAccount,//订单充值
    } from '../../api/api'

    export default {
        name: "balance",
        data(){
            return{
                //按钮
                toolData:{
                    tools:{
                        updateForm:true
                    }
                },
                searchData:{
                    selected:{
                        company:true,
                        date:true,
                        state:true,
                        month1:'开始时间',
                        month2:'结束时间'
                    },
                    typeDatas:[
                        {name:'全部',value:''},
                        {name:'已结算',value:'5'},
                        {name:'待结算',value:'1,2,3'},
                        {name:'结算中',value:'4'},
                        {name:'开票中',value:'11'},
                        {name:'已开票',value:'12'},
                    ],
                    props:{
                        holder:'结算状态'
                    }
                },
                tableData:{
                    balance:true,
                },
                listLoading:false,
                //分页组件
                paginationDatas:{
                    total:20,
                    currentPage: 1,
                },
                /*控制器*/
                /*存储器*/
                columns: [
                    {
                        text: '结算单号',
                        dataIndex: 'coBusNo',
                        type:'text',
                        width:'200'
                    },
                    {
                        text: '上传日期',
                        dataIndex: 'createTime',
                        type:'text',
                        sortable:true,
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
                        text: '应发金额（元）',
                        dataIndex: 'coTotalPrice',
                        type:'text',
                        width:'120'
                    },
                    {
                        text: '转账金额（元）',
                        dataIndex: 'coTransAccount',
                        type:'text',
                        width:'120'
                    },
                    {
                        text: '发薪人数（人）',
                        dataIndex: 'coTotalCount',
                        type:'text',
                        width:'120'
                    },
                    {
                        text: '服务费（元）',
                        dataIndex: 'coServicePrice',
                        type:'text',
                        width:'120'
                    },
                    {
                        text: '状态',
                        dataIndex: 'PayStatus',
                        type:'text',
                        width:'120',
                    },
                   /* {
                        text: '创建人',
                        dataIndex: 'coPeople',
                        type:'text',
                        width:'120'
                    },*/
                    {
                        text: '备注',
                        dataIndex: 'remark',
                        type:'text',
                        width:'100'
                    }
                ],
                users: [],
                total:0,
                pdf_path:'',
                /*PDF*/
                show: true,
                currentPages:1,
                pageCount: 0,
                loadedRatio: 0,
                page: 1,
                numPages: 0,
                rotate: 0,
                datas:{},
                //分页
                currentPage: 1,
                pageSize: 20,
                /*上传结果*/

                fileList:[],//上传的文件列表
                dialogFormVisible:false,//上传任务结果
                imageUrl: '',
                /*修改*/
                reason:'的书法大赛郭德纲的噶杀手',//不通过原因
                model:'',
                //参数
                /*结算列表参数*/
                coIds:'',
                payStatus:'',//订单状态
                shouldEndDate:'',//结束时间
                shouldStartDate:'',//开始时间
                defaultCompany:'',//默认公司
                companyList:[]
            }
        },
        components:{
            searchPanle,
            tableList,
            pagination,
            topTool
        },
        mounted(){
            //获取 路由跳转过来的 是否有params
            let payStatus = this.$route.params.payStatus;//从首页跳转过来的  带有payStatus
            if(payStatus){
                switch (payStatus){
                    case '已结算':
                        this.payStatus = '5';
                        this.model = '5';
                        break;
                    case '待结算':
                        this.payStatus = '1,2,3';
                        this.model = '1,2,3';
                        break;
                    case '结算中':
                        this.payStatus = '4';
                        this.model = '4';
                        break;
                    case '未充值':
                        this.payStatus = '1,4';
                        this.model = '1,4';
                        break;
                    case '已申请开票':
                        this.payStatus = '12';
                        this.model = '12';
                        break;
                    case '当月已结算':
                        this.payStatus = '5';
                        this.model = '5';
                        break;
                    default:
                        break;
                }
            }

            let arr = this.$route.params.arr;//从上传结算单跳转过来的  arr
            if(arr){
                let str = '';
                for(let i = 0,l = arr.length;i<l;i++){
                    str += ','+ arr[i];
                }
                str = str.substring(1);
                this.coIds = str;
            }

            let companyList =  JSON.parse(sessionStorage.getItem('companyList'));
            if(!companyList){
                //不存在的情况
                findCompanyList().then((res)=>{
                    if(res){
                        //不存在的时候 重新保存一下
                        sessionStorage.setItem('companyList', JSON.stringify(res.data));
                        companyList =  JSON.parse(sessionStorage.getItem('companyList'));
                        this.companyList = companyList;
                    }
                });

            }else{
                //存在
                this.companyList = companyList;
            }
            this.getUsers();
        },
        methods:{
            getUsers() {
                 let para = {
                     companyId:this.defaultCompany,//公司编号
                     shouldStartDate:this.shouldStartDate,//开始时间
                     shouldEndDate:this.shouldEndDate,//结束时间
                     payStatusStr:this.payStatus,//订单状态
                     current_page:this.currentPage,
                     page_size:this.pageSize,
                     coIds:this.coIds
                 };
                 this.listLoading = true;
                findBalanceOrders(para).then((res) => {
                     if(res){
                         this.paginationDatas.total = res.total_count;
                         let temps = res.list?res.list:[],status,k,p,companyId='',companyList = this.companyList;
                         for(let i = 0,l = temps.length;i<l;i++){
                             status = temps[i].coPayStatus;
                             companyId = temps[i].coCompanyId;//公司ID
                             if(status === 1){
                                 temps[i].PayStatus = '待结算';
                             }else if(status === 4 || status === 2){
                                 temps[i].PayStatus = '结算中';
                             }else if(status === 5){
                                 temps[i].PayStatus= '已结算';
                             }else if(status=== 7){
                                 temps[i].PayStatus= '订单删除';
                             }else if(status === 11){
                                 temps[i].PayStatus= '开票中';
                             }else if(status === 12){
                                 temps[i].PayStatus= '已开票';
                             }
                             if(status === 1){
                                 temps[i].remark = '余额不足';
                             }
                             /*循环加上公司名称*/
                             //  companyList = this.companyList;

                             for(k = 0,p = companyList.length;k<p;k++){
                                // console.log(companyId,companyList[k].cId)
                                 if(companyId === companyList[k].cId){
                                     temps[i].companyName = companyList[k].cName;
                                 }
                             }
                         }
                         this.users = temps;
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
            //开票类别状态改变
            statesChange(data){
               if(data){
                   this.payStatus = data;
                   this.getUsers();
               }else{
                   this.payStatus = '';
                   this.getUsers();
               }

            },
            //公司改变
            ordersCompanyChange(a){
                this.defaultCompany = a;
                this.getUsers();
            },
            //结算单 改变
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
            //查询
            search(datas){
                this.defaultCompany = datas.slsect_company;//公司编号
                this.getUsers();
            },
            //跳转上传结算单
            updataRoute(){
              /*  let temps = this.users;
                for(let i = 0,l = temps.length;i<l;i++){
                    if(temps[i].coPayStatus === 4){
                        //结算中  需要充值
                        let str = "您有未填写的转账金额，无法上传结算单，请先充值";
                        this.$confirm(str, '', {
                            confirmButtonText: '是',
                            showCancelButton:false,
                            center: true
                        }).then(() => {

                        }).catch(() => {

                        });
                        return false;
                    }
                }*/
                this.$router.push({ path: '/home/balanceIndex/balanceUpdata' });
            },
            //充值
            topUp(row){
                let price = Number(row.coTotalPrice)+Number(row.coServicePrice);
                let str = "转账金额："+price;
                this.$alert(str, '转账金额', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(({ value }) => {
                    let para = {
                        coId:row.coId,
                        orderPayPrice:price
                    };
                    orderAddAccount(para).then(res =>{
                        if(res.status === 200){
                            this.$message({
                                type: 'success',
                                message: res.message
                            });
                            this.getUsers();
                        }else{
                            this.$message({
                                type: 'error',
                                message: res.message
                            });
                        }
                    },err =>{
                        this.$message({
                            type: 'error',
                            message: res.message
                        });
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消充值'
                    });
                });
            },
            //跳转至结算详情
            balanceRoute(row){
                let status;
                if(row.coPayStatus === 5){
                    status = 1;
                    //已结算
                }else{
                    status = 0;
                }
                row.status = status;
                this.$router.push({
                    name:'结算单详情',
                    path: '/home/balanceIndex/balanceDetails',
                    params:{
                        coBusNo:row
                    }
                });
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

<style  lang="scss" scoped>
    .tableList{
        width: 100%;
        float: left;
        border: 1px solid #d4d4d4;
        border-radius: 3px;
        background: #f4f4f4;
        margin: 10px 0;
        box-sizing: border-box;
    }
</style>
