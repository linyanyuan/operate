
//用户 页数  条数
import * as types from './types';
/*export const actions = {
    setCompanyList({commit}, status){
        commit(types.COMPANYLIST, status)
    }
};*/
export const setCompanyList = ({commit}, status) =>{
    commit(types.COMPANYLIST, status)
};
export const setActive = ({commit}, status) =>{
    commit(types.ACTIVE, status)
};
//更新未读条数
export const upDataTotle = ({commit}, status) =>{
    commit(types.TOTLE, status)
};
//更新菜单权限数据
export const setMenuData = ({commit}, status) =>{
    commit(types.MENUDATA, status)
};
//企业合同详情
export const setContractRealData = ({commit}, status) =>{
    commit(types.CONTRACTREAL, status)
};
//签约主体
export const setSubject = ({commit}, status) =>{
    commit(types.SUBJECT, status)
};
