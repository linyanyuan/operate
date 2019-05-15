import App from './App';
import store from './vuex/store';
import Vuex from 'vuex';
import routes from './router';
Vue.use(Vuex);
import { findCompanyList ,getCookies} from './api/api';
import {detectionMenu} from './utils/mUtils';
const router = new VueRouter({
    routes
});

router.beforeEach((to, from, next) => {

    const value = to.query.src ? to.query.src : to.path;
    const label = to.query.titleName ? to.query.titleName : to.name;
    if (to.path === '/login') {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('order');
    }
    /*
    * 菜单权限检测 and 获取公司列表
    * */
    // console.log(to)
    if(to.path !== '/login' && to.path !== '/forgetPwd' && to.path !== '/404'  ){
       let isTo =  detectionMenu(to);
       if(isTo.toNone){
           next({ path: '/404' });
           return;
       }
       if(isTo.toLogin){
           //缓存的菜单数据 清空 去往Login
           next({ path: '/login' });
           return;
       }else{
           if(!isTo.isCanTo){
               //没有权限
               Vue.prototype.$message({
                   type:'error',
                   message:isTo.message
               });
               return;
           }
       }
        getCookies();
        let companyList = JSON.parse(sessionStorage.getItem('companyList'));//获取公司列表 是否存在
        if(companyList && companyList.length && companyList.length>0){

        }else{
            findCompanyList().then((res)=>{
                if(res){
                    sessionStorage.setItem('companyList', JSON.stringify(res.data));
                }
            });
        }
    }
    /**
     * 如果用户刷新页面,导致存入vuex中的菜单数据清空,需要从缓存获取;如果缓存也不存在 需要从新登陆
     */
    const menuData = JSON.parse(sessionStorage.getItem('menuData'));
    if(menuData){
        store.commit('MENUDATA', menuData)    // ?? commit or dispatch ,将缓存数据注入到store中
    }
    /*设置active*/
    if(to.path.indexOf('contractIndex') !== -1){
       // this.actives = '/home/invoiceIndex/invoice';
        store.commit('ACTIVE', '/home/contractIndex')
    }else if(to.path.indexOf('balanceIndex') !== -1){
       // this.actives = '/home/Safe'
        store.commit('ACTIVE', '/home/balanceIndex/balance')
    }else if(to.path.indexOf('EnterpriseIndex') !== -1){
        store.commit('ACTIVE', '/home/EnterpriseIndex')
    }else if(to.path.indexOf('invoiceIndex') !== -1){
        store.commit('ACTIVE', '/home/invoiceIndex/invoice')
    }else if(to.path.indexOf('invoiceIns_apply') !== -1){
        store.commit('ACTIVE', '/home/invoiceIns_apply/invoice_apply')
    }else{
        store.commit('ACTIVE', to.path)
    }

    let user = JSON.parse(sessionStorage.getItem('user'));
    let order = JSON.parse(sessionStorage.getItem('order'));
    let jump;
    if(!configAll.control.jump){
        jump = user || order;
    }else{
        jump = true;
    }

    if (!jump && to.path !== '/login' && to.path !== '/forgetPwd') {
        next({ path: '/login' })
    }else if(!jump  && to.path === '/forgetPwd'){
        next()
    }else {
        next()
    }
});

new Vue({
    //el: '#app',
    //template: '<App/>',
    router,
    store,
    render: h => h(App),
    data: {
        // 空的实例放到根组件下，所有的子组件都能调用
        Bus: new Vue()
    }
}).$mount('#app');
