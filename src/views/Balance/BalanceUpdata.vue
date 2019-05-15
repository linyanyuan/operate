<template>
    <div class="box">
        <topTool
                :toolData="toolData"
                v-on:updatas="updatas"
        ></topTool>
        <searchPanle
                @statesChange="statesChange"
                @search="search"
                @ordersCompanyChange="ordersCompanyChange"
                :searchData="searchData"></searchPanle>
        <div class="totle_all" v-if="tablesData.status === 10051">
            <div class="totle_item">
                <span>{{tablesData.message}}</span>
            </div>
        </div>
        <div class="tableList">
            <tableList
                    :columns="columns"
                    :tableData="tableData"
                    :data-source="tableProps"></tableList>
        </div>

        <!--工具条-->
        <paginations
                @currentClick="currentClick"
                @pageClick="pageClick"
                @submitOrder="submitOrder"
                :paginationDatas="paginationDatas" :tableProps="tableProps"></paginations>

    </div>
</template>

<script>
    const topTool = r => require.ensure([], () => r(require('../../components/topTool.vue')), 'topTool');//工具按钮组件
    const searchPanle = r => require.ensure([], () => r(require('../../components/search.vue')), 'searchPanle');//搜索组件
    const tableList = r => require.ensure([], () => r(require('../../components/tableList.vue')), 'tableList');//列表组件
    const paginations = r => require.ensure([], () => r(require('../../components/pagination.vue')), 'pagination');//分页组件
    import pagination from '../../utils/pagination';
    import {
        submitUpdateOrderData
    } from '../../api/api';
    export default {
        name: "balance-updata",
        components:{
            searchPanle,
            tableList,
            topTool,
            paginations
        },
        data(){
            return{
                searchData:{
                    selected:{
                        company:true,
                        state:true,
                        search_input:true,
                    },
                    typeDatas:[
                        {name:'全部',value:''},
                        {name:'成功',value:'5'},
                        {name:'未上传',value:'1'},
                    ],
                    props:{
                        holder:'输入收款人姓名、身份证号或手机号'
                    }
                },
                tableData:{
                    xuhao:true
                },
                //分页组件
                paginationDatas:{
                    total:20,
                    currentPage: 1,
                    submitBtn:true,
                    isDis:false
                },
                //按钮
                toolData:{
                    tools:{
                        update:true
                    }
                },
                columns: [
                    {
                        text: '收款人姓名',
                        dataIndex: 'coiUserName',
                        type:'text',
                        width:'100'
                    },
                    {
                        text: '收款人身份证号',
                        dataIndex: 'coiIdCard',
                        type:'text',
                        width:'170'
                    },
                    {
                        text: '收款人手机号',
                        dataIndex: 'coiUserPhone',
                        type:'text',
                        width:'150'
                    },
                    {
                        text: '收款人银行卡账号',
                        dataIndex: 'coiBankCard',
                        type:'text',
                        width:'170'
                    },
                    {
                        text: '收款账号开户行名称',
                        dataIndex: 'coiOpenBankName',
                        type:'text',
                        width:'200'
                    },
                    {
                        text: '收款账号开户行名称分行（支行）',
                        dataIndex: 'coiBankName',
                        type:'text',
                        width:'240'
                    },
                    {
                        text: '应发额（元）',
                        dataIndex: 'coiGrantPrice',
                        type:'text',
                        width:'120'
                    },
                    {
                        text: '个税（元）',
                        dataIndex: 'coiPersonTaxTemp',
                        type:'text',
                        width:'120'
                    },
                    {
                        text: '实发额（元）',
                        dataIndex: 'coiSalary',
                        type:'text',
                        width:'120'
                    },
                    {
                        text: '错误提示',
                        dataIndex: 'message',
                        type:'text',
                        fixed:'right',
                        color:'red',
                        width:'170'
                    }
                ],
                //控制器
                loading:false,
                /*存储器*/
                tableProps:[],
                tablesData:{},//上传明细数据
                //分页
                currentPage: 1,
                pageSize: 20,
                /*参数*/
                updataMounth:'',//上传结算月
            }
        },
        methods:{
            //预览结算表单
            updatas(response,datas){
                //保存上传结算月
               // this.updataMounth = datas.shouldGrantDate;
                if(response.status === 10051){
                    this.paginationDatas.isDis = false;
                    let arr = response.data.sheetDataList[0].orderIdList;
                    this.$confirm('有'+arr.length+'未充值订单，无法进行结果回传，是否进行充值?', '提示', {
                        confirmButtonText: '是',
                        cancelButtonText: '否',
                        type: 'info'
                    }).then(() => {
                        this.$router.push({
                            path:'/home/balanceIndex/balance',
                            name:'结算列表',
                            params:{
                                arr:arr
                            }
                        });
                        return false;

                    }).catch(() => {

                    });

                }else{
                    this.paginationDatas.isDis = true
                }
                this.$message({
                    type:'success',
                    message:response.message
                });

                this.tablesData = response;
              //  console.log(response)
                let tableData = response.data.sheetDataList[0];
                this.users = tableData;
                //this.tableProps = this.tablesData.sheetDataList[0].totalList;
                let tempsData = tableData.failList.concat(tableData.diffList);
                this.pagination = new pagination.Pagination(tempsData,this.pageSize,this.currentPage);//实例分页工具
                this.tableProps = this.pagination.getCurrentDatas(this.currentPage-1);
                this.paginationDatas.total = this.pagination.getTotalNum();
            },
            //查询
            search(datas){
                this.searchCondition = datas.search_input;//公司编号
                this.getUsers();
            },
            //提交
            submitOrder(){
                if(this.users.sendNoMatchNum == 0 && this.users.sendFailNum == 0){

                    let DataList = [];
                    DataList = JSON.stringify(this.users.failList.concat(this.users.successList));
                    let para = {
                        DataList:DataList
                    };
                    submitUpdateOrderData(para).then(res =>{
                        if(res.status === 200){
                            this.$message({
                                message: res.message,
                                type: 'success'
                            });
                            this.$router.push({ path: '/home/balanceIndex/balance' });
                        }
                    }, error =>{
                    })
                }else{
                    let str = '上传结算单与原始表单数据不符人数'+this.users.sendNoMatchNum+'人，发薪失败'+this.users.sendFailNum+'人，是否继续?';
                    let DataList = [];
                    this.$confirm(str, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        DataList = JSON.stringify(this.users.failList.concat(this.users.successList));
                        let para = {
                            DataList:DataList
                        };
                        submitUpdateOrderData(para).then(res =>{
                            if(res.status === 200){
                                this.$message({
                                    message: res.message,
                                    type: 'success'
                                });
                                this.$router.push({ path: '/home/balanceIndex/balance' });
                            }
                        }, error =>{
                        })

                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消'
                        });
                    });
                }

                /*let DataList = '';
                for(let i = 0,l = this.tablesData.sheetDataList.length;i<l;i++){
                    DataList += '#'+JSON.stringify(this.tablesData.sheetDataList[i].totalList)
                }
                DataList = DataList.substring(1);*/
            },
            //分页
            currentClick(val) {
                this.currentPage = val;
                this.tableProps = this.pagination.getCurrentDatas(this.currentPage-1);
                // this.getUsers();
            },
            //每页多少条
            pageClick(val){
                this.pageSize = val;
                this.pagination.changePageSize(this.pageSize);
                this.tableProps = this.pagination.getCurrentDatas(this.currentPage-1);
                // this.getUsers();
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
        /*background: #f4f4f4;*/
        margin-bottom:5px ;
        margin-top: 5px;
        background: #fff;
        box-sizing: border-box;
    }
    .totle_all{
        float: left;
        width: 100%;
        border: 1px solid #d4d4d4;
        border-radius: 3px;
        background: #fff;
        box-sizing: border-box;
        margin-bottom: 5px;
        margin-top: 5px;
        padding: 0 30px;
        .totle_item{
            float: left;
            height: 40px;
            line-height: 40px;
            padding-right: 20px;
            margin-right: 20px;
            span{
                font-size: 15px;
                font-weight: 600;
                color: #f60;
            }
            strong{
                color:#f60;
            }
        }
    }
</style>
