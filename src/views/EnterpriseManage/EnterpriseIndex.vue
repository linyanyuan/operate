<template>
    <div class="box">
        <div class="enterprise_box">
            <div class="companyTree">
                <!--这是选择公司-->
                <el-select
                        :style="menuData.resources[0].name === '销售'?'width:170px;':'width:100%;'"
                        v-model="select_company"
                        size="small"
                        clearable
                        @visible-change="visChange"
                        @change="itemSelect1"
                        placeholder="公司名称(可搜索)"
                        filterable
                        class="smSreen">
                    <el-option
                            v-for="item in selectCompanyDatas"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
                <el-tooltip
                        class="item"
                        v-if="menuData.resources[0].name === '销售'"
                        effect="dark"
                        content="添加企业" placement="top">
                    <el-button
                            type="primary"
                            size="mini"
                            icon="el-icon-plus"
                            circle
                            @click="routerToAdd"
                            style="margin-left: 5px;"></el-button>
                </el-tooltip>
                <el-tooltip
                        class="item"
                        v-if="menuData.resources[0].name === '销售'"
                        effect="dark"
                        content="删除企业"
                        placement="top">
                    <el-button
                            type="danger"
                            size="mini"
                            icon="el-icon-delete"
                            circle
                            @click="deleteCompany"
                            style="margin-left: 5px;"></el-button>
                </el-tooltip>
                <el-scrollbar class="elScroll">
                    <div class="company_trees">
                        <el-tree
                                ref="tree2"
                                highlight-current
                                :data="companyDatas"
                                :props="defaultProps"
                                node-key="id"
                                empty-text="暂无数据"
                                default-expand-all
                                :filter-node-method="filterNode"
                                :expand-on-click-node="false"
                                @node-click="handleNodeClick">
                        </el-tree>
                    </div>
                </el-scrollbar>

            </div>
            <div class="right_container">
                <div v-bar style="height: 100%">
                    <div>
                        <router-view></router-view>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        findCompanyList,
        findCompanyTree,//企业tree
        delCompany,//删除企业
    } from '../../api/api';
    import { mapState} from "vuex";
    export default {
        name: "enterprise-index",
        data(){
            return{
                selectCompanyDatas:[],//下拉框
                select_company:'',//选择公司
                selId:'',//选择的id
                selName:{},
                //公司tree
                defaultProps: {
                    label: 'name',
                    children: 'children'
                },
                companyDatas: [{
                    name: '企业',
                    id:'',
                    children: []
                }],
                /*接口返回数据*/
                treeDatas:[]
            }
        },
        watch:{
            select_company(val) {
                this.$refs.tree2.filter(val);
            }
        },
        computed:{
            //映射State
            ...mapState({
                menuData:state => state.menuData,//权限生成后的菜单
            })
        },
        mounted(){
            this.getFindCompanyTree();
        },
        methods:{

            //q获取企业tree
            getFindCompanyTree(){
                findCompanyTree().then(res =>{
                    if(res.code == '0'){
                        let treeData = res.data,k,m;
                        this.companyDatas[0].children = treeData;
                        let arr = [];
                        for(let i = 0,l = treeData.length;i < l; i++){
                            arr.push(treeData[i]);
                            if(treeData[i].children && treeData[i].children.length>0){
                                for(k = 0,m = treeData[i].children.length;k < m;k++){
                                    arr.push(treeData[i].children[k]);
                                }

                            }
                        }
                       this.selectCompanyDatas = arr;
                    }
                },err =>{

                })
            },
            //删除公司
            deleteCompany(){
                if(!this.selId){
                    this.$message({
                        type:'warning',
                        message:'请先选择一个企业或一个企业组'
                    })
                }else{
                    if(this.selName.children.length > 0){
                        this.$message({
                            type:'warning',
                            message:'该企业有子企业，请先删除子企业'
                        })
                    }else{
                        this.$confirm('确定删除'+this.selName.name+'?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            let para = {
                                id:this.selId
                            };
                            delCompany(para).then(res =>{
                                if(res.code == '0'){
                                    this.$message({
                                        type: 'success',
                                        message: '删除成功'
                                    });
                                    this.getFindCompanyTree();
                                    this.$router.push({
                                        path:'/home/EnterpriseIndex/EnterpriseStatistical',
                                        name:'企业统计',
                                    })
                                }else{
                                    this.$message({
                                        type: 'error',
                                        message: res.message
                                    });
                                }
                            });

                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消删除'
                            });
                        });
                    }

                }
            },
            //过滤节点
            filterNode(value, data) {
                if (!value) return true;
                return data.id.indexOf(value) !== -1;
            },
            //添加公司
            routerToAdd(){
                this.$router.push({
                    path:'/home/EnterpriseIndex/addEnterprise',
                    name:'添加企业'
                })
            },
            callbackFun(){
               this.getFindCompanyTree();
            },
            //点击节点
            handleNodeClick(data,node,sel) {
                this.selId = data.id;
                this.selName = data;
                if(data.name == '企业'){
                    this.$router.push({
                        path:'/home/EnterpriseIndex/EnterpriseStatistical',
                        name:'企业统计',
                    })
                }else{
                    if(data.sort === 0){
                        this.$router.push({
                            path:'/home/EnterpriseIndex/EnterpriseReal',
                            name:'企业详情',
                            params:{
                                companyIds:data.id
                            }
                        })
                    }else if(data.sort === 1){
                        this.$router.push({
                            path:'/home/EnterpriseIndex/EnterpriseGroupReal',
                            name:'企业组详情',
                            params:{
                                groupId:data.id
                            }
                        })
                    }
                }
                /*if(!data.parentId){
                    if(data.name == '企业'){
                        this.$router.push({
                            path:'/home/EnterpriseIndex/EnterpriseStatistical',
                            name:'企业统计',
                        })
                    }else{
                        this.$router.push({
                            path:'/home/EnterpriseIndex/EnterpriseGroupReal',
                            name:'企业组详情',
                            params:{
                                groupId:data.id
                            }
                        })
                    }

                }else{
                    this.$router.push({
                        path:'/home/EnterpriseIndex/EnterpriseReal',
                        name:'企业详情',
                        params:{
                            companyIds:data.id
                        }
                    })
                }*/
            },
            //不同订单
            visChange(status,types){
                if(status){
                    this.select_company = '';
                }
            },
            //选择公司
            itemSelect1:function (data) {
                this.select_company = data;
            },
        }
    }
</script>

<style  lang="scss">
    .enterprise_box{
        display: flex;
        height: 100%;
        .companyTree{
            min-width: 250px;
            background-color: #fff;
            border-radius: 4px;
            -webkit-box-shadow: 0 1px 1px rgba(0,0,0,.05), 0 2px 6px 0 rgba(0,0,0,.045);
            box-shadow: 0 1px 1px rgba(0,0,0,.05), 0 2px 6px 0 rgba(0,0,0,.045);
            box-sizing: border-box;
            padding: 10px;
            .elScroll{
                height: calc(100% - 32px);
            }
            .btns{
                text-align: center;
                padding: 10px 0;
            }
            .company_trees{
                margin-top: 20px;
            }
        }
        .right_container{
            flex: 1;
            background-color: #fff;
            border: 1px solid transparent;
            border-radius: 4px;
            -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05), 0 2px 6px 0 rgba(0, 0, 0, 0.045);
            box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05), 0 2px 6px 0 rgba(0, 0, 0, 0.045);
            margin-left: 15px;
          /*  overflow-y: scroll;
            overflow-x: hidden;*/
        }
    }
</style>
