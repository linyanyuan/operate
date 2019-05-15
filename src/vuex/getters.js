import * as types from "./types";
//active
export const getActive = state =>{
    return state.active;
};
//获取 totle 总未读条数
export const getTotle = state =>{
    return state.totle;
};
//获取菜单权限数据
export const getMenuData = state =>{
  return state.menuData;
};

//企业合同详情
export const getContractRealData = state =>{
    return state.contractRealData;
};
//签约主体
export const getSubject = state =>{
    return state.Subject;
};
