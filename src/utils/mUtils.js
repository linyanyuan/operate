let menuIcon = [
    {path:'/home/index',icon:'fa fa-home fa-lg',title:'首页'},
    {path:'/home/EnterpriseIndex',icon:'fa fa-building',title:'企业管理'},
    {path:'/home/contractIndex',icon:'fa fa-calendar-minus-o',title:'合同管理'},
    {path:'/home/Account',icon:'fa fa-money',title:'账号管理'},
    {path:'/home/Task',icon:'fa fa-tasks',title:'任务管理'},
    {path:'/home/balanceIndex/balance',icon:'fa fa-database',title:'结算管理'},
    {path:'/home/invoiceIndex/invoice',icon:'fa fa-list-ul',title:'发票管理'},
    {path:'/home/invoiceIns_apply/invoice_apply',icon:'fa fa-list-ul',title:'申请开票'},
    {path:'/home/password',icon:'fa fa-unlock-alt',title:'修改密码'},

];

/*
* 处理登录返回的菜单权限数据@params menuData 菜单数据
* */
export const generateMenuData  = (menuData = [], routes = []) =>{
    let menuList,k,p;
    for(let i = 0,l = menuData.length; i < l; i++){
        menuList = menuData[i];
        for(k = 0,p = menuIcon.length; k < p; k++){
            if(menuList.path === menuIcon[k].path){
                //权限存在这个菜单
                menuList.icon = menuIcon[k].icon;
                menuList.title = menuIcon[k].title;
            }
        }
    }
    return menuData;
};
/*
* 菜单权限检测  @params to
* */
export const detectionMenu = (to) =>{
    let menus = to.matched,k,p;
    //console.log(to)
    let callBackObj = {
        isCanTo:false,
        message:'',
        toLogin:false,
        toNone:false
    };
    if(menus.length === 0 || menus[0].path === '/404'){
        //说明路由中不存在 此路由
        callBackObj.toNone = true;
        return callBackObj;
    }
    let temps =  JSON.parse(sessionStorage.getItem('menuData'));
    if(temps){
        let datas = temps.resources[0].children;
        for(let i = 1,l = menus.length;i<l;i++){
            for(k = 0,p = datas.length; k < p; k++){
                if(menus[i].name === datas[k].title){
                    //去往的路由有权限
                    callBackObj.isCanTo = true;
                    callBackObj.message = '';
                    break;
                }else {
                    callBackObj.message = '没有权限';
                }
            }
        }
    }else{
        callBackObj.toLogin = true;
    }

    return callBackObj;
};
