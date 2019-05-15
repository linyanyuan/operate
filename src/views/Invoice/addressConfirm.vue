<template>
    <div class="box">
        <div class="tableList">
            <tableList
                    @addressConfirm="addressConfirm"
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
        <el-dialog
                title="邮寄地址变更"
                :visible.sync="addressChange">
            <!--邮寄地址变更-->
            <div class="checkSuccess_box">
                <el-row>
                    <el-col :span="24">
                        <el-form>
                            <el-form-item label="企业名称：">
                                <el-span size="small">{{addressDatas.companyNames}}</el-span>
                            </el-form-item>
                            <el-form-item label="企业地址：">
                                <el-span size="small">{{addressDatas.address}}</el-span>
                            </el-form-item>
                            <el-form-item label="收件人姓名：">
                                <el-span size="small">{{addressDatas.name}}</el-span>
                            </el-form-item>
                            <el-form-item label="收件人电话：">
                                <el-span size="small">{{addressDatas.phone}}</el-span>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
                <div class="check_tools">
                    <el-button type="primary" size="small" @click="submitAddress">确定</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    const tableList = r => require.ensure([], () => r(require('../../components/tableList.vue')), 'tableList');//列表组件
    const pagination = r => require.ensure([], () => r(require('../../components/pagination.vue')), 'pagination');//分页组件
    import {
        findAddressPage,
        auditAddress
    } from '../../api/api';
    export default {
        name: "address-confirm",
        data(){
            return{
                //分页组件
                paginationDatas:{
                    total:20,
                    currentPage: 1,
                },
                listLoading:false,
                tableData:{
                    addressConfirm:true
                },
                //分页
                currentPage: 1,
                pageSize: 20,
                auditStatus:2,//类型；1已确认，2未确认
                addressChange:false,
                addressDatas:{},
                /*存储器*/
                columns: [
                    {
                        text: '变更日期',
                        dataIndex: 'updateDate',
                        type:'text',
                        sortable:true,
                        width:'170'
                    },
                    {
                        text: '企业名称',
                        dataIndex: 'companyNames',
                        type:'text',
                        width:'200'
                    },
                    {
                        text: '确认人',
                        dataIndex: 'updateUserName',
                        type:'text',
                        width:'170'
                    }
                ],
                users: [],
                total:0,
                companyList:[]
            }
        },
        components:{
            tableList,
            pagination,
        },
        mounted(){
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
                    auditStatus:this.auditStatus,//类型；1已确认，2未确认
                    current_page:this.currentPage,
                    page_size:this.pageSize,
                };
                this.listLoading = true;
                findAddressPage(para).then((res) => {
                    if(res){
                        this.paginationDatas.total = res.total_count;
                        let temps = res.list?res.list:[],status,k,p,companyId='',companyList = this.companyList;
                        for(let i = 0,l = temps.length;i<l;i++){
                            companyId = temps[i].companyId;//公司ID
                            /*循环加上公司名称*/
                            for(k = 0,p = companyList.length;k<p;k++){
                                if(companyId === companyList[k].cId){
                                    temps[i].companyNames = companyList[k].cName;
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
            submitAddress(){
                let para = {
                    caIds:this.addressDatas.id
                };
                auditAddress(para).then(res =>{
                    if(res.code == '0'){
                        this.$message({
                            type:'success',
                            message:res.message
                        });
                        this.addressChange = false;
                        this.getUsers();
                    }
                })
            },
            addressConfirm(row){
                this.addressChange = true;
                this.addressDatas = row;
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
        background: #f4f4f4;
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
    }
</style>
