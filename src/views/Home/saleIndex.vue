<template>
    <section>
        <indexCount :indexDatas="indexDatas" @routeTo="routeTo"></indexCount>
        <indexCount :indexDatas="indexDatas1" @routeTo="routeTo"></indexCount>
        <indexCount :indexDatas="indexDatas2" @routeTo="routeTo"></indexCount>
    </section>
</template>

<script>
    import indexCount from '../../components/indexCount';
    import {
        findCalcCount,//结算单统计
        findCompanyContractStatistics,//合同统计
        findCompanyStatistics,//客户总书
    } from '../../api/api';
    export default {
        name: "sale-index",
        data(){
            return{
                indexDatas:{
                    title:'合同统计',
                    colSpan:8,
                    cursor:true,
                    datas:[
                        {name:'签约总数',value:0,iconfont:'icon-wodeqianyue'},
                        {name:'本月新增',value:0,iconfont:'icon-qianyuejilu'},
                        {name:'待上传',value:0,iconfont:'icon-jindutiaodaishangchuan'},
                    ]

                },
                indexDatas1:{
                    title:'客户统计',
                    classes:'width:49.5%',
                    colSpan:12,
                    cursor:true,
                    datas:[
                        {name:'客户组总数',value:0,iconfont:'icon-kehu'},
                        {name:'客户总数',value:0,iconfont:'icon-kehu1'},
                    ]

                },
                indexDatas2:{
                    title:'结算单情况统计',
                    classes:'width:49.5%;margin-left:1%;',
                    colSpan:12,
                    datas:[
                        {name:'当月已结算',value:0,iconfont:'icon-zhijiandan-'},
                        {name:'待结算',value:0,iconfont:'icon-icon-'},
                    ]

                },
            }
        },
        components:{
            indexCount
        },
        mounted(){
            this.getFindCalcCount();
            this.getFindCompanyContractStatistics();
            this.getFindCompanyStatistics()
        },
        methods:{
            //结算单情况统计
            getFindCalcCount(){
                findCalcCount().then(res =>{
                    if(res.status === 200){
                        let arrData = [
                            {name:'当月已结算',value:res.data.paiedCount,iconfont:'icon-zhijiandan-'},
                            {name:'待结算',value:res.data.noSettlementCount,iconfont:'icon-icon-'},
                        ];
                        this.indexDatas2.datas  = arrData;
                    }
                })
            },
            //合同统计
            getFindCompanyContractStatistics(){
                findCompanyContractStatistics().then(res =>{
                    if(res.status === 200){
                        let arrData = [
                            {name:'签约总数',value:res.totalNum,iconfont:'icon-wodeqianyue'},
                            {name:'本月新增',value:res.alreadyMonthUpload,iconfont:'icon-qianyuejilu'},
                            {name:'待上传',value:res.stayUpload,iconfont:'icon-jindutiaodaishangchuan'},
                        ];
                        this.indexDatas.datas  = arrData;
                    }
                })
            },
            getFindCompanyStatistics(){
                let para = {
                    selectTotalNum:true,
                    selectMonthNum:false,
                    selectQuarterNum:false,
                    selectWeekNum:false,
                };
                findCompanyStatistics(para).then(res =>{
                    if(res.code === '0'){
                        let arrData = [
                            {name:'客户组总数',value:res.companyGroupStatistice.totalNum,iconfont:'icon-kehu'},
                            {name:'客户总数',value:res.companyStatistice.totalNum,iconfont:'icon-kehu1'},
                        ];
                        this.indexDatas1.datas  = arrData;
                    }

                })
            },
            routeTo(data,datas){
                switch (datas.title){
                    case '结算单情况统计':
                        this.$router.push({
                            path:'home/balanceIndex/balance',
                            name:'结算列表',
                            params:{
                                payStatus:data.name
                            }
                        });
                        return;
                    case '合同统计':
                        this.$router.push({
                            path:'home/contractIndex/contract',
                            name:'合同列表',
                            params:{
                                payStatus:data.name
                            }
                        });
                        return;
                    case '客户统计':
                        this.$router.push({
                            path:'home/EnterpriseIndex/EnterpriseStatistical',
                            name:'企业统计'
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
