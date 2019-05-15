<template>
    <section>
        <indexCount :indexDatas="indexDatasBalance"  @routeTo="routeTo"></indexCount>
    </section>
</template>

<script>
    import indexCount from '../../components/indexCount';
    import {
        findCompanyContractStatistics,//合同统计
    } from '../../api/api';
    export default {
        name: "customer-index",
        data(){
            return{
                /*客服-合同统计*/
                indexDatasBalance:{
                    title:'合同统计',
                    colSpan:8,
                    cursor:true,
                    datas:[
                        {name:'待上传合同数',value:0,iconfont:'icon-jindutiaodaishangchuan'},
                        {name:'已上传合同数',value:0,iconfont:'icon-hetongpingshen'},
                        {name:'本月上传合同数',value:0,iconfont:'icon-hetong'},
                    ]

                }
            }
        },
        components:{
            indexCount
        },
        mounted(){
            this.getFindCompanyContractStatistics();
        },
        methods:{
            //合同统计
            getFindCompanyContractStatistics(){
                findCompanyContractStatistics().then(res =>{
                    if(res.status === 200){
                        let arrData = [
                            {name:'待上传合同数',value:res.stayUpload,iconfont:'icon-jindutiaodaishangchuan'},
                            {name:'已上传合同数',value:res.alreadyUpload,iconfont:'icon-hetongpingshen'},
                            {name:'本月上传合同数',value:res.alreadyMonthUpload,iconfont:'icon-hetong'},
                        ];
                        this.indexDatasBalance.datas  = arrData;
                    }
                })
            },
            routeTo(data,datas){
                switch (datas.title){
                    case '合同统计':
                        this.$router.push({
                            path:'home/contractIndex/contract',
                            name:'合同列表',
                            params:{
                                payStatus:data.name
                            }
                        });
                        return;
                    default:
                        return
                }

            }
        }
    }
</script>

<style scoped>

</style>
