<template>
    <div class="box">
        <searchPanle
                @ordersCompanyChange="ordersCompanyChange"
                @normalDate="normalDate"
                @search="search"
                @timerChange="timerChange"
                @statesChange="statesChange"
                :searchData="searchData"></searchPanle>
        <div class="tableList">
            <el-tabs v-model="activeName" @tab-click="handleClick" style="padding: 0 20px;">
                <el-tab-pane
                        v-for="(val,index) in contractTypes"
                        :key="val.value"
                        :label="val.label"
                        :name="val.value" ></el-tab-pane>
            </el-tabs>
            <tableList
                    @invalidContract="invalidContract"
                    @details="details"
                    @edit="edit"
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
        <el-dialog
            @close="handleClose"
            title="请填写作废原因"
            :visible.sync="invalidReason">
            <!--作废合同-->
            <div class="checkSuccess_box">
                <el-form :rules="rules"
                         :model="invalid"
                         ref="forms2">
                    <el-form-item prop="remark">
                        <el-input
                                style="width: 95%;"
                                type="textarea"
                                :rows="3"
                                placeholder="请输入作废原因"
                                v-model="invalid.remark">
                        </el-input>
                    </el-form-item>
                </el-form>

                <div class="check_tools">
                    <el-button type="primary" size="small" @click="sunmitRemrk">提交</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    const searchPanle = r => require.ensure([], () => r(require('../../components/search.vue')), 'searchPanle');//搜索组件
    const tableList = r => require.ensure([], () => r(require('../../components/tableList.vue')), 'tableList');//列表组件
    const pagination = r => require.ensure([], () => r(require('../../components/pagination.vue')), 'pagination');//分页组件
    import {mapState,mapActions} from 'vuex';
    import util from '../../utils/util';
    import {
        findContractPage,
        disablerCompanyContract,//废弃合同
    } from '../../api/api';
    export default {
        name: "contract",
        data(){
            return{
                //搜索
                searchData:{
                    selected:{
                        company:true,
                        normalDate:true,
                        state:true,
                        timer:true,
                        holder1:'签署开始时间',
                        holder2:'签署结束时间'
                    },
                    typeDatas:[
                        {name:'全部',value:''},
                        {name:'失效',value:'2'},
                        {name:'生效',value:'1'},
                        {name:'作废',value:'3'},
                        {name:'待生效',value:'0'},
                    ],
                    props:{
                        holder:'合同状态'
                    }
                },
                //分页组件
                paginationDatas:{
                    total:20,
                    currentPage: 1,
                },
                tableData:{
                    contract:true,
                    role:''
                },
                listLoading:false,
                invalidReason:false,
                /*合同作废*/
                invalid:{
                    remark:'',
                    ccIds:''
                },
                rules:{
                    remark: [
                        { required: true, message: '作废原因必填', trigger: 'blur' }
                    ],
                },
                /*存储器*/
                menuDatas:{},//权限数据
                columns: [
                    {
                        text: '合同编号',
                        dataIndex: 'ccContractNumber',
                        type:'text',
                        width:'200'
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
                        width:'120'
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
                activeName: '2',
                contractTypes:[
                    {label:'全部',value:'2'},
                    {label:'待上传',value:'0'},
                    {label:'已上传',value:'1'},
                ],
                //分页
                currentPage: 1,
                pageSize: 20,
                payStatus:null,//订单状态
                shouldEndDate:'',//结束时间
                shouldStartDate:'',//开始时间
                endDate:'',//到期时间
                defaultCompany:'',//默认公司
                companyIdStr:'',//多个编号
                opStatus:'',//上传状态
                cancellationStatus:'',//作废状态
                uploadStatus:'',
                companyList:[]
            }
        },
        components:{
            searchPanle,
            tableList,
            pagination
        },
        computed:{
            //映射State
            ...mapState({
                menuData:state => state.menuData,//权限生成后的菜单
            }),
        },
        mounted(){
            //获取 路由跳转过来的 是否有params
            let payStatus = this.$route.params.payStatus;//从首页跳转过来的  带有payStatus
            if(payStatus){
                switch (payStatus){
                    case '签约总数':
                        break;
                    case '本月新增':
                        let date = new Date();
                        let a = new Date(date.getFullYear(), date.getMonth(), 1);
                        let b = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                         this.shouldStartDate = util.dateToNormal(a);
                        this.shouldEndDate = util.dateToNormal(b);
                       // this.$refs.searchPanle.searchDate.valueTimeNormal = [a,b];
                        break;
                    case '待上传':
                        this.activeName = '0';
                        this.uploadStatus = '0';
                        break;
                    case '待上传合同数':
                        this.activeName = '0';
                        this.uploadStatus = '0';
                        break;
                    case '已上传合同数':
                        this.activeName = '1';
                        this.uploadStatus = '1';
                        break;
                    case '本月上传合同数':
                        break;
                    default:
                        break;
                }
            }
            this.getMenuDatas();
            this.getUsers();
        },
        methods:{
            //映射vuex方法
            ...mapActions(["setMenuData"]),
            //获取 权限信息
            getMenuDatas(){
                if(this.menuData.length>0){
                    //当内存有缓存的时候  直接提取store里面菜单
                    this.menuDatas =  this.menuData.resources[0];
                    this.tableData.role = this.menuDatas.name;
                }else{
                    //当刷新的时候  store内存清空了
                    let temps =  JSON.parse(sessionStorage.getItem('menuData'));
                    if(temps){
                        this.setMenuData(temps);
                        this.menuDatas =   temps.resources[0];
                        this.tableData.role = temps.resources[0].name;
                    }
                }
            },
            //获取账号列表
            getUsers() {
                 let para = {
                     companyId:this.defaultCompany,//公司编号
                     signStartDate:this.shouldStartDate,//开始签署时间
                     singEndDate:this.shouldEndDate,//结束签署时间
                     endDate:this.endDate,//到期时间
                     cancellationStatus:this.cancellationStatus,//作废状态
                     loseEfficacyStatus:this.opStatus,//失效状态
                     uploadStatus:this.uploadStatus,//上传状态
                     current_page:this.currentPage,
                     page_size:this.pageSize,
                 };
                 this.listLoading = true;
                findContractPage(para).then((res) => {
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
                 });
            },
            //查询
            search(datas){
                this.defaultCompany = datas.slsect_company;//公司编号
                this.getUsers();
            },
            //到期时间改变
            timerChange(date){
                if(date){
                    let dates;
                    if(date === 1){
                        //一个月
                        const start = new Date();
                        start.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
                        dates = start.toLocaleDateString().split('/').join('-');
                    }else if(date === 2){
                        //半个月
                        const start = new Date();
                        start.setTime(start.getTime() + 3600 * 1000 * 24 * 15);
                        dates = start.toLocaleDateString().split('/').join('-');
                    }else if(date === 3){
                        //一周
                        const start = new Date();
                        start.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
                        dates = start.toLocaleDateString().split('/').join('-');
                    }
                    this.endDate = dates;
                }else{
                    this.endDate = '';
                }
                this.getUsers();
            },
            //合同状态改变
            statesChange(data){
                this.cancellationStatus = '';
                this.opStatus = '';
                if(data){
                    if(data === '3'){
                        //作废状态
                        this.cancellationStatus = '0';
                    }else{
                        //失效状态
                        this.opStatus = data;
                    }
                    this.getUsers();
                }else{
                    this.opStatus = '';
                    this.getUsers();
                }

            },
            //合同作废
            invalidContract(row){
                this.invalidReason = true;
                this.invalid.ccIds = row.ccId;

            },
            //作废原因
            sunmitRemrk(){
                this.$refs['forms2'].validate((valid) =>{
                    let para = {
                        remark:this.invalid.remark,//作废备注
                        ccIds:this.invalid.ccIds,//企业合同id 集合  支持批次操作
                    };
                    disablerCompanyContract(para).then(res =>{
                        if(res.code == '0'){
                            this.$message({
                                type:'success',
                                message:res.message
                            });
                            this.invalidReason = false;
                            this.getUsers();
                        }
                    })
                });

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
               // this.getUsers();
            },
            //公司改变
            ordersCompanyChange(a){
                this.defaultCompany = a;
                this.getUsers();
            },
            //tab切换
            handleClick(tab, event){
                if(tab.name === '2'){
                    this.uploadStatus = '';
                }else{
                    this.uploadStatus = tab.name;
                }
                this.getUsers();
            },
            //合同详情
            details(row){
                this.$router.push({
                    path:'/home/contractIndex/contractDetails',
                    name:'合同详情',
                    params:{
                        contractCCId:row.ccId
                    }
                })
            },
            //修改
            edit(row){
                if(this.menuDatas.name === '客服'){
                    this.$router.push({
                        path:'/home/contractIndex/aditContractKf',
                        name:'上传合同补充协议',
                        params:{
                            contractCCId:row.ccId
                        }
                    })
                }else if(this.menuDatas.name === '销售'){
                    this.$router.push({
                        path:'/home/contractIndex/aditContract',
                        name:'修改合同',
                        params:{
                            contractCCId:row.ccId
                        }
                    })
                }

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
    .checkSuccess_box{
        .check_tools{
            text-align: center;
            height: 40px;
            padding-top: 20px;
            width: 100%;
        }
        .checkSuccess{
            position: relative;
            margin: 0 auto 50px;
            background: #fff;
            border-radius: 2px;
            -webkit-box-shadow: 0 1px 3px rgba(0,0,0,.3);
            box-shadow: 0 1px 3px rgba(0,0,0,.3);
            box-sizing: border-box;
            width: 300px;
            height: 200px;
            text-align: center;
            padding-top: 2px;
            margin-top: 30vh;
            .check_hd{
                font-size: 20px;
                margin: 15px 0 15px 0;
            }
            .check_bd{
                margin: 10px 0;
                margin-top: 30px;
            }
        }
    }
</style>
