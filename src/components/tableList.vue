<template>
    <el-table
            :data="data"
            border
            @selection-change="handleSelectionChange"
            v-loading="loading"
            style="width:100%"
            :header-cell-style="headrStyle">
        <el-table-column
                v-if="tableData.xuhao"
                align="center"
                width="70"
                type="index"
                label="序号">
        </el-table-column>
        <el-table-column
                v-if="tableData.selected"
                type="selection"
                width="40">
        </el-table-column>
        <!--<el-table-column
                v-if="tableData.message"
                label="内容"
                min-width="200">
            <template slot-scope="scope">
                <i class="iconfont icon-noread" :class="scope.row.readStatus === 0? 'icon_mes':'icon_mes1'"></i>
                <span style="margin-left: 10px">{{ scope.row.content }}</span>
            </template>
        </el-table-column>-->
       <!-- <el-table-column
                prop="coShouldGrantDate"
                label="日期"
                sortable
                width="180">
        </el-table-column>-->
        <el-table-column
                v-for="(column,index) in columns"
                :align="column.center?column.center:'center'"
                :min-width="column.width"
                :label="column.text"
                :fixed="column.fixed?column.fixed:false"
                :sortable="column.sortable?column.sortable:false"
                :prop="column.sortable?column.dataIndex:''"
                :key="column.dataIndex">
            <template  slot-scope="scope">
                <span
                        v-if="column.dataIndex ==='ciiExpressNumber'"
                        style="text-decoration:underline;cursor: pointer;"
                        @click="eventClick('balanceRoute',scope.row)">
                    {{scope.row[column.dataIndex]}}
                </span>
                <span
                        v-else
                        :style="column.color?'color:'+column.color:''">
                    {{scope.row[column.dataIndex]}}
                </span>
            </template>
        </el-table-column>
        <!--合同管理列表操作==客服-->
        <el-table-column
                v-if="tableData.contract && tableData.role === '客服'"
                align="center"
                min-width="200"
                fixed="right"
                label="操作">
            <template  slot-scope="scope">
                <el-button
                        size="mini"
                        type="text"
                        @click="eventClick('details',scope.row)"
                        icon="el-icon-info">详情</el-button>
                <el-button
                        v-if="scope.row.ccUploadStatus === 0"
                        size="mini"
                        type="text"
                        @click="eventClick('edit',scope.row)"
                        icon="el-icon-upload2">上传合同</el-button>
                <el-button
                        v-if="scope.row.ccUploadStatus === 1"
                        size="mini"
                        type="text"
                        @click="eventClick('edit',scope.row)"
                        icon="el-icon-upload2">补充协议</el-button>
                <el-button
                        v-if="scope.row.OpStatus === '生效'"
                        size="mini"
                        type="text"
                        @click="eventClick('edit',scope.row)"
                        icon="el-icon-edit">修改</el-button>
            </template>
        </el-table-column>
        <!--合同管理列表操作==销售-->
        <el-table-column
                v-if="tableData.contract && tableData.role === '销售'"
                align="center"
                min-width="200"
                fixed="right"
                label="操作">
            <template  slot-scope="scope">
                <el-button
                        size="mini"
                        type="text"
                        @click="eventClick('details',scope.row)"
                        icon="el-icon-info">详情</el-button>
                <el-button
                        v-if="scope.row.OpStatus === '待生效' || scope.row.OpStatus === '生效'"
                        size="mini"
                        type="text"
                        @click="eventClick('edit',scope.row)"
                        icon="el-icon-edit">修改</el-button>
                <el-button
                        v-if="scope.row.OpStatus === '待生效' || scope.row.OpStatus === '生效'"
                        size="mini"
                        type="text"
                        @click="eventClick('invalidContract',scope.row)"
                        icon="el-icon-circle-close-outline">作废</el-button>
            </template>
        </el-table-column>
        <!--合同管理列表操作==结算-->
        <el-table-column
                v-if="tableData.contract && tableData.role === '结算'"
                align="center"
                min-width="100"
                fixed="right"
                label="操作">
            <template  slot-scope="scope">
                <el-button
                        size="mini"
                        type="text"
                        @click="eventClick('details',scope.row)"
                        icon="el-icon-info">详情</el-button>
            </template>
        </el-table-column>
        <!--账号管理列表操作-->
        <el-table-column
                v-if="tableData.account"
                align="center"
                min-width="250"
                fixed="right"
                label="操作">
            <template  slot-scope="scope">
                <el-button
                        v-if="scope.row.cuOpStatus === '停用'"
                        size="mini"
                        type="text"
                        @click="eventClick('startAccount',scope.row)"
                        icon="el-icon-circle-check-outline">启用</el-button>
                <el-button
                        v-if="scope.row.cuOpStatus === '启用'"
                        size="mini"
                        type="text"
                        @click="eventClick('stopAccount',scope.row)"
                        icon="el-icon-circle-close-outline">停用</el-button>
                <el-button
                        size="mini"
                        type="text"
                        @click="eventClick('edit',scope.row)"
                        icon="el-icon-edit">修改</el-button>
                <el-button
                        size="mini"
                        type="text"
                        @click="eventClick('resetPassword',scope.row)"
                        icon="el-icon-refresh">重置密码</el-button>
                <el-button
                        v-if="scope.row.cuOpStatus === '启用' && scope.row.cuInitialPwd!=''"
                        size="mini"
                        type="text"
                        @click="eventClick('copyAccount',scope.row)"
                        icon="el-icon-document">复制</el-button>
            </template>
        </el-table-column>
        <!--//任务管理操作-->
        <el-table-column
                v-if="tableData.task"
                align="center"
                min-width="150"
                fixed="right"
                label="操作">
            <template  slot-scope="scope">
                <el-button
                    v-if="scope.row.checkStatus !== 2"
                    size="mini"
                    type="text"
                    @click="eventClick('readResult',scope.row)"
                    icon="el-icon-info">详情</el-button>
                <el-button
                        v-if="scope.row.checkStatus !== 1"
                        size="mini"
                        type="text"
                        @click="eventClick('aditResult',scope.row)"
                        icon="el-icon-edit">修改</el-button>
            </template>
        </el-table-column>
        <!--//结算管理操作-->
        <el-table-column
                v-if="tableData.balance"
                align="center"
                min-width="200"
                fixed="right"
                label="操作">
            <template  slot-scope="scope">
                <el-popover
                        placement="top"
                        trigger="click">
                    <span class="popClass" @click="downLoad(scope.row,1)">原始表格</span>
                    <span class="popClass" @click="downLoad(scope.row,0)">拆单表格</span>
                    <el-button slot="reference"
                               size="mini"
                               icon="el-icon-goods"
                               type="text" v-if="scope.row.coPayStatus === 2 || scope.row.coPayStatus === 1|| scope.row.coPayStatus === 4">结算</el-button>
                </el-popover>
                <el-popover
                        placement="top"
                        trigger="click">
                    <span class="popClass" @click="downLoad(scope.row,1)">原始表格</span>
                    <span class="popClass" @click="downLoad(scope.row,0)">拆单表格</span>
                    <el-button slot="reference"
                               size="mini"
                               icon="el-icon-download"
                               type="text" v-if="scope.row.coPayStatus === 5 || scope.row.coPayStatus === 11 || scope.row.coPayStatus === 12">下载</el-button>
                </el-popover>
                <el-button
                        v-if="scope.row.coPayStatus === 4"
                        size="mini"
                        type="text"
                        class="add_el-button"
                        @click="eventClick('topUp',scope.row)"
                        icon="el-icon-bell">充值</el-button>
                <el-button
                        size="mini"
                        type="text"
                        class="add_el-button"
                        @click="eventClick('balanceRoute',scope.row)"
                        icon="el-icon-info">详情</el-button>
            </template>
        </el-table-column>
        <!--//地址信息变更确认操作-->
        <el-table-column
                v-if="tableData.addressConfirm"
                align="center"
                min-width="80"
                fixed="right"
                label="操作">
            <template  slot-scope="scope">
                <el-button
                        size="mini"
                        type="text"
                        class="add_el-button"
                        @click="eventClick('addressConfirm',scope.row)"
                        >确认</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
    import {
        exportOrderData
    } from '../api/api'
    export default {
        name: "table-list",
        data(){
            return{
                visible2: false,
                radio:1
            }
        },
        props:{
            //listLoading
            loading:{
                type: Boolean,
                default: function () {
                    return false
                }
            },
            // 这是数据源
            dataSource: {
                type: Array,
                default: function () {
                    return []
                }
            },
            // 这是相应的字段展示
            columns: {
                type: Array,
                default: function () {
                    return []
                }
            },
            //这是控制器
            tableData:{
                type: Object,
                default: function () {
                    return {}
                }
            }
        },
        computed: {
            // 格式化数据源
            data: function () {
                return this.dataSource;

            }
        },
        methods:{
            //头部样式
            headrStyle(){
                return 'background:#f4f4f4';
            },
            /*选中列表 */
            handleSelectionChange(sels) {
                //   this.sels = sels;
                this.$emit('handleSelectionChange',sels);
            },
            btnClick(scope){
                console.log(scope)
            },
            //下载
            downLoad(row,int){
                window.open(exportOrderData+'?coId='+row.coId+'&exportType='+int);
                this.$emit('downLoadUpload');
            },
            eventClick(type,a){
                switch (type){
                    case 'balanceRoute':
                        this.$emit('balanceRoute',a);
                        return;
                    case 'invoiceRoute':
                        this.$emit('invoiceRoute',a);
                        return;
                    case 'delete':
                        this.$emit('delete',a);
                        return;
                    case 'details':
                        this.$emit('details',a);
                        return;
                    case 'edit':
                        this.$emit('edit',a);
                        return;
                    case 'aditResult':
                        this.$emit('aditResult',a);
                        return;
                    case 'readResult':
                        this.$emit('readResult',a);
                        return;
                    case 'topUp':
                        this.$emit('topUp',a);
                        return;
                    case 'invalidContract':
                        this.$emit('invalidContract',a);
                        return;
                    case 'resetPassword':
                        this.$emit('resetPassword',a);
                        return;
                    case 'startAccount':
                        this.$emit('startAccount',a);
                        return;
                    case 'stopAccount':
                        this.$emit('stopAccount',a);
                        return;
                    case 'copyAccount':
                        this.$emit('copyAccount',a);
                        return;
                    case 'addressConfirm':
                        this.$emit('addressConfirm',a);
                        return;
                    default:
                        return
                }
            }
        }
    }
</script>

<style lang="scss">
    .el-button [class*=el-icon-]+span {
        margin-left: 0;
    }
    .icon_mes{

        font-size: 18px;
        line-height: 20px;
        color: #dcdc2e;
        font-weight: 700;
    }

    .add_el-button{
        margin-left: 10px;
    }
    .icon_mes1{

        font-size: 18px;
        line-height: 20px;
        color: #cbd0db;
        font-weight: 700;
    }
    .el-popover{
        text-align: center;
    }
    .popClass{
        width:70px;cursor: pointer;display: inline-block;
        &:hover{
            color: #f60;
        }
    }
</style>
