<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button
                    v-if="paginationDatas.submitBtn"
                    size="small"
                    @click="submitOrder"
                    :disabled="!paginationDatas.isDis"
                    type="primary">提交</el-button>
            <el-pagination
                    @current-change="handleCurrentChange"
                    @size-change="handleSizeChange"
                    :current-page="paginationDatas.currentPage"
                    :pager-count="5"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="20"
                    layout="total, sizes,prev, pager, next, jumper"
                    :total="paginationDatas.total"
                    style="float:right;">
            </el-pagination>
        </el-col>
    </section>
</template>

<script>
    export default {
        name: "pagination",
        props:{
            paginationDatas:{
                type:Object,
                default:function(){
                    return{}
                }
            },
            tableProps:{
                type:Array,
                default:function () {
                    return []
                }
            }
        },
        data(){
            return{

            }
        },
        methods:{
            submitOrder(){
                this.$emit('submitOrder');
            },
            //分页
            handleCurrentChange(val) {
                // this.currentPage = val;
                this.$emit('currentClick',val);
            },
            //每页多少条
            handleSizeChange(val){
                // this.pageSize = val;
                this.$emit('pageClick',val);
            },
        }
    }
</script>

<style scoped lang="scss">
    .toolbar {
        border: 1px solid #d4d4d4;
        border-radius: 3px;
        /* background: #f4f4f4;*/
        background: #fff;
        padding: 5px;
        .el-form-item {
            margin-bottom: 10px;
        }
    }
    section{
        width: 100%;
        float: left;
    }
</style>
