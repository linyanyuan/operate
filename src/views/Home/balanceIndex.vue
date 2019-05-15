<template>
    <section>
        <indexCount :indexDatas="indexDatasBalance" @routeTo="routeTo"></indexCount>
        <indexCount :indexDatas="indexDatasBalance1" @routeTo="routeTo"></indexCount>
        <indexCount :indexDatas="indexDatasBalance2" @routeTo="routeTo"></indexCount>
        <indexCount :indexDatas="indexDatasBalance3" @routeTo="routeTo"></indexCount>
        <indexCount :indexDatas="indexDatasBalance4"></indexCount>
    </section>
</template>

<script>
    import indexCount from '../../components/indexCount';
    import {
        findCalcCount,//结算
        findTotalMoney,//结算金额
        findCompanyContractStatistics,//合同统计
        findCompanyStatistics,//客户总书
        findStatistics,//开票统计
    } from '../../api/api';
    export default {
        name: "balance-index",
        data(){
            return{
                /*结算-结算统计*/
                indexDatasBalance:{
                    title:'结算统计',
                    colSpan:6,
                    cursor:true,
                    datas:[
                        {name:'已结算',value:0,iconfont:'icon-zhijiandan-'},
                        {name:'待结算',value:0,iconfont:'icon-jiesuanshenpi'},
                        {name:'结算中',value:0,iconfont:'icon-jiesuantixing'},
                        {name:'未充值',value:0,iconfont:'icon-chongzhi'},
                    ]

                },
                /*结算-合同统计*/
                indexDatasBalance1:{
                    title:'合同统计',
                    classes:'width:49.5%',
                    colSpan:12,
                    cursor:true,
                    datas:[
                        {name:'签约总数',value:0,iconfont:'icon-hetong'},
                        {name:'当月新增',value:0,iconfont:'icon-zengchang'}
                    ]

                },
                /*结算-本月客户结算情况统计*/
                indexDatasBalance2:{
                    title:'本月客户结算情况统计',
                    classes:'width:49.5%;margin-left:1%;',
                    colSpan:12,
                    datas:[
                        {name:'客户组总数',value:0,iconfont:'icon-kehu'},
                        {name:'客户总数',value:0,iconfont:'icon-kehu1'},
                    ]

                },
                /*结算-开票统计*/
                indexDatasBalance3:{
                    title:'开票统计',
                    classes:'width:49.5%;',
                    colSpan:12,
                    cursor:true,
                    datas:[
                        {name:'已申请开票',value:0,iconfont:'icon-kaipiaoshenqing'},
                        {name:'未申请开票',value:0,iconfont:'icon-daikaipiao'},
                    ]

                },
                /*结算-结算金额统计*/
                indexDatasBalance4:{
                    title:'结算金额统计',
                    classes:'width:49.5%;margin-left:1%;',
                    colSpan:12,
                    datas:[
                        {name:'累计结算金额（元）',value:0,iconfont:'icon-zongshouyi'},
                        {name:'本月结算金额（元）',value:0,iconfont:'icon-leijishouyi'},
                    ]

                },
            }
        },
        components:{
            indexCount
        },
        mounted(){
            this.getFindCalcCount();
            this.getFindTotalMoney();
            this.getFindCompanyContractStatistics();
            this.getFindCompanyStatistics();
            this.getFindStatistics();
        },
        methods:{
            //结算单情况统计
            getFindCalcCount(){
                findCalcCount().then(res =>{
                    if(res.status === 200){
                        let arrData = [
                            {name:'已结算',value:res.data.paiedCount,iconfont:'icon-zhijiandan-'},
                            {name:'待结算',value:res.data.noSettlementCount,iconfont:'icon-jiesuanshenpi'},
                            {name:'结算中',value:res.data.settlementCount,iconfont:'icon-jiesuantixing'},
                            {name:'未充值',value:res.data.noPayCount,iconfont:'icon-chongzhi'},
                        ];
                        this.indexDatasBalance.datas  = arrData;
                    }
                })
            },
            //合同统计
            getFindCompanyContractStatistics(){
                findCompanyContractStatistics().then(res =>{
                    if(res.status === 200){
                        let arrData = [
                            {name:'签约总数',value:res.totalNum,iconfont:'icon-hetong'},
                            {name:'当月新增',value:res.alreadyMonthUpload,iconfont:'icon-zengchang'}
                        ];
                        this.indexDatasBalance1.datas  = arrData;
                    }
                })
            },
            //结算金额
            getFindTotalMoney(){
                findTotalMoney().then(res =>{
                    if(res.status === 200){
                        let arrData = [
                            {name:'累计结算金额（元）',value:res.data.totalPrice,iconfont:'icon-zongshouyi'},
                            {name:'本月结算金额（元）',value:res.data.monthPrice,iconfont:'icon-leijishouyi'},
                        ];
                        this.indexDatasBalance4.datas  = arrData;
                    }
                })
            },
            //客户组
            getFindCompanyStatistics(){
                let para = {
                    selectTotalNum:true,
                    selectMonthNum:true,
                    selectQuarterNum:false,
                    selectWeekNum:false,
                };
                findCompanyStatistics(para).then(res =>{
                    if(res.code === '0'){
                        let arrData = [
                            {name:'客户组总数',value:res.companyGroupStatistice.monthNum,iconfont:'icon-kehu'},
                            {name:'客户总数',value:res.companyStatistice.monthNum,iconfont:'icon-kehu1'},
                        ];
                        this.indexDatasBalance2.datas  = arrData;
                    }

                })
            },
            //开票统计
            getFindStatistics(){
                findStatistics().then(res =>{
                    if(res.code == '0'){
                        let arrData = [
                            {name:'已申请开票',value:res.data.makeInvoiceCount,iconfont:'icon-kaipiaoshenqing'},
                            {name:'未申请开票',value:res.data.noMakeInvoiceCount,iconfont:'icon-daikaipiao'},
                        ];
                        this.indexDatasBalance3.datas  = arrData;
                    }
                })
            },
            routeTo(data,datas){
                switch (datas.title){
                    case '结算统计':
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
                    case '开票统计':
                        if(data.name =='已申请开票'){
                            this.$router.push({
                                path:'home/balanceIndex/balance',
                                name:'结算列表',
                                params:{
                                    payStatus:data.name
                                }
                            });
                        }else{
                            this.$router.push({
                                path:'home/invoiceIns_apply/invoice_apply',
                                name:'开票列表'
                            });
                        }

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
