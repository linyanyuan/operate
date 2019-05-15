import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './types'
import * as actions from './actions'
import * as getters from './getters'
//import { setStore, getStore, removeStore } from '@/util/util'

Vue.use(Vuex);
// 应用初始状态
const state = {
    companyList:[],//公司列表
    active:'/home/index',//路由
    totle:0,//未读消息
    menuData:[],//菜单数据
    contractRealData:{},//企业合同详情数据
    Subject:[],//签约主体
};


// 定义所需的 mutations
const mutations = {
    //签约主体
    [types.SUBJECT](state, status) {
        status.length > 0 ? state.Subject = status : state.Subject = [];
    },
    //企业合同详情
    [types.CONTRACTREAL](state, status) {
        state.contractRealData = status;
    },
    [types.COMPANYLIST](state, status) {
        state.companyList = status;
    },
    //active
    [types.ACTIVE](state, status) {
        state.active = status;
    },
    //未读消息
    [types.TOTLE](state, status) {
        state.totle = status;
    },
    //菜单权限
    [types.MENUDATA](state, status) {
        if(status&&status.length === 0){
            state.menuData = [];
        }else{
            state.menuData = status;
        }
    },
};

// 创建 store 实例
export default new Vuex.Store({
    actions,
    getters,
    state,
    mutations
})
