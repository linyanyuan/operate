<template>
    <section>
        <indexCount :indexDatas="indexDatasBalance" @routeTo="routeTo"></indexCount>
        <indexCount :indexDatas="indexDatasBalance1"></indexCount>
    </section>
</template>

<script>
    import indexCount from '../../components/indexCount';
    import {
        findTotalMoney,//结算金额
        findStatistics,//开票统计
        findExpressageCount,
        findAuditNumber,
        findMoney
    } from '../../api/api';
    export default {
        name: "finance-index",
        data(){
            return{
                /*财务-待处理*/
                indexDatasBalance:{
                    title:'待处理',
                    colSpan:8,
                    cursor:true,
                    datas:[
                        {name:'待开票',value:0,iconfont:'icon-daikaipiao'},
                        {name:'待上传快递单',value:0,iconfont:'icon-jindutiaodaishangchuan'},
                        {name:'邮寄信息变更确认',value:0,iconfont:'icon-jiesuantixing'}
                    ]

                },
                /*财务-开票金额统计*/
                indexDatasBalance1:{
                    title:'开票金额统计',
                    colSpan:12,
                    datas:[
                        {name:'开票总金额（元）',value:0,iconfont:'icon-zongshouyi'},
                        {name:'本月开票金额（元）',value:0,iconfont:'icon-leijishouyi'}
                    ]

                },
            }
        },
        components:{
            indexCount
        },
        mounted(){
            this.getFindMoney();
            this.getUser();
        },
        methods:{
            getUser(){
                let selfs = this;
                Promise.all([
                    new Promise(function(resolve, reject){
                        findStatistics().then(res =>{
                            if(res.code == '0'){
                                resolve(res)
                            }
                        })
                    }), new Promise(function(resolve, reject){
                        findExpressageCount().then(res =>{
                            if(res.code == '0'){
                                resolve(res)
                            }
                        })
                    }), new Promise(function(resolve, reject){
                        findAuditNumber().then(res =>{
                            if(res.code == '0'){
                                resolve(res)
                            }
                        })
                    })]).then(result =>{
                    let arrData = [
                        {name:'待开票',value:result[0].data.noMakeInvoiceCount,iconfont:'icon-daikaipiao'},
                        {name:'待上传快递单',value:result[1].data.expressageCount,iconfont:'icon-jindutiaodaishangchuan'},
                        {name:'邮寄信息变更确认',value:result[2].data,iconfont:'icon-jiesuantixing'}
                    ];
                    selfs.indexDatasBalance.datas  = arrData;
                    if(result[2].data > 0){
                        this.$confirm('您有未确认的邮寄地址变更，请先确认', '', {
                            confirmButtonText: '是',
                            showCancelButton:false,
                            center: true
                        }).then(() => {
                            this.$router.push({
                                path:'/home/invoiceIndex/addressConfirm',
                                name:'地址信息变更确认'
                            })
                        }).catch(() => {

                        });
                    }
                })
            },
            //开票统计
            getFindMoney(){
                findMoney().then(res =>{
                    if(res.code == '0'){
                        let arrData = [
                            {name:'开票总金额（元）',value:res.data.allMoney,iconfont:'icon-zongshouyi'},
                            {name:'本月开票金额（元）',value:res.data.nowMonthMoney,iconfont:'icon-leijishouyi'}
                        ];
                        this.indexDatasBalance1.datas  = arrData;
                    }
                })
            },
            routeTo(data,datas){
                switch (datas.title){
                    case '待处理':
                        if(data.name =='待开票' || data.name =='待上传快递单'){
                            this.$router.push({
                                path:'home/invoiceIndex/invoice',
                                name:'发票列表',
                                params:{
                                    payStatus:data.name
                                }
                            });
                        }else{
                            this.$router.push({
                                path:'/home/invoiceIndex/addressConfirm',
                                name:'地址信息变更确认'
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
