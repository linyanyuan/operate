<template>
    <div class="box">
        <!--销售权限-->
        <saleIndex v-if="menuData.resources[0].name === '销售'"></saleIndex>
        <!--结算权限-->
        <balanceIndex v-if="menuData.resources[0].name === '结算'"></balanceIndex>
        <!--客服-->
        <customerIndex v-if="menuData.resources[0].name === '客服'"></customerIndex>
        <!--财务-->
        <financeIndex v-if="menuData.resources[0].name === '财务'"></financeIndex>
    </div>
</template>

<script>
    const saleIndex = r => require.ensure([], () => r(require('./saleIndex')), 'saleIndex');//销售
    const balanceIndex = r => require.ensure([], () => r(require('./balanceIndex')), 'balanceIndex');//结算
    const customerIndex = r => require.ensure([], () => r(require('./customerIndex')), 'customerIndex');//客服
    const financeIndex = r => require.ensure([], () => r(require('./financeIndex')), 'financeIndex');//财务
    import {
    } from '../../api/api';
    import { mapState} from "vuex";
    export default {
        name: "index",
        data(){
            return{
                isSale:true,
                isBalance:false,
                isCustomer:false,
                isFinance:false
            }
        },
        components:{
            saleIndex,
            balanceIndex,
            customerIndex,
            financeIndex
        },
        computed:{
            //映射State
            ...mapState({
                menuData:state => state.menuData,//权限生成后的菜单
            }),
            menuDatas:function(){
                console.log(this.menuData)
            }
        },
        created(){
        }
    }
</script>
<style scoped lang="scss">

</style>
