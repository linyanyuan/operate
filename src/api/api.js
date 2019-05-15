let jq = $;
const base = configAll.serviceUrl.base;
const base1 = configAll.serviceUrl.base1;
let cookie = jq.cookie('CsrfRandomToken');
function getCookie() {
    console.log('准备发cookie');
    if(!cookie){
        console.log('准备发cookie');
        jq.ajax({
            type:'get',
            url:`${base}/payroll-maintenance/cookieCon/addCookies`,
            async:false,
            success:function (res) {
                cookie = jq.cookie('CsrfRandomToken');
                console.log(cookie,'设置Token成功!')
                return cookie
                //alert('获取到cookie了');
            }
        });
        //alert('cookie是否获取到了');
        return false
    }else{
        //alert('有cookie');
    }
}
getCookie();
//设置header加密
jq.ajaxSetup({
    beforeSend: getHeaderInfo,
    global: true,
    timeout:30000,
    complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
       // console.log(XMLHttpRequest,status)
        if(status==='timeout'){//超时,status还有success,error等值的情况
            Vue.prototype.$message({
               type:'error',
               message:'请求超时'
           })
        }else if(status === 'error'){
            Vue.prototype.$message({
                type:'error',
                message:'出错了，请稍后再试'
            })
        }
    }
});

let key = true;
//header加密方法
function getHeaderInfo(XMLHttpRequest) {
    let sessionid = "CsrfRandomToken";
    cookie = jq.cookie('CsrfRandomToken');
    if(!cookie){
        if(!key){
            return false
        }
        key = false;
        jq.ajax({
            type:'get',
            url:`${base}/payroll-maintenance/cookieCon/addCookies`,
            async:false,
            beforeSend:function () {
                XMLHttpRequest.setRequestHeader(sessionid, '');
            },
            success:function (res) {
                cookie = jq.cookie('CsrfRandomToken');
                key = true;
            },
            complete:function () {
                key = true;
            }
        });
        //alert('cookie是否获取到了');
    }
    XMLHttpRequest.setRequestHeader(sessionid, cookie);
    cookie = '';
}

//在获取到未登录退出
jq( document ).ajaxSuccess(function( event, request, settings ) {
    let code;
    if(request.responseJSON && request.responseJSON.code){
        code = request.responseJSON.code;
    }
    if(code === '00000'){
        console.log(request.responseJSON);
        location.hash = "#/login";
        return false
    }
});
//全局监测返回状态
jq( document ).ajaxError(function( event, request, settings ) {
   // / console.log(request);
    if (request.status !== 200) {
        // alert("服务异常,请稍后重试");
        console.error("服务异常,请稍后重试",request)
    }
    if(request.status === 403){
        console.log('403');
        getCookie()
    }
});

//路由跳转  发送cookie
export const getCookies = () =>{
    jq.ajax({
        type:'get',
        url:`${base}/payroll-maintenance/cookieCon/addCookies`,
        beforeSend:function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("CsrfRandomToken", '');
        },
        async:false,
        success:function (res) {
            cookie = jq.cookie('CsrfRandomToken');
            return cookie
        }
    });
};
/*export const findChildCompanyLists = (callback) =>{
    jq.ajax({
        type:'get',
        url:`${base}/payroll-maintenance/companyCon/findCompanyList`,
        success:function (res) {
            let temp = res;
            callback(temp);
        }
    });
};*/
/*
* 查询公司名称
* */
export const findCompanyList = params => {return jq.get(`${base}/payroll-maintenance/companyCon/findCompanyMessage?cType=1`, params)};

export const getCompany = params => {return jq.get(`${base}/companyCon/findList`, params)};

/*
登陆模块
* */
export const loginOut = params => { return jq.get(`${base}/payroll-maintenance/user/logout`, params).then(res => res); };//登出
//图片验证码接口
export const defaultKaptcha = `${base}/payroll-maintenance/kaptchaCon/defaultKaptcha`;
//发送短信验证码
export const sendLoginCode = params => {return jq.get(`${base}/payroll-maintenance/companyUser/sendLoginCode`, params)};
//登录
export const requestLogin = params => { return jq.post(`${base}/payroll-maintenance/user/login`, params)};

/*
*任务管理
* */
//任务列表
export const findTaskPage = params => { return jq.post(`${base}/baseservice/resultAppearCon/findPage`, params)};
//上传任务pdf
export const uploadPdf = `${base}/payroll-maintenance/fileUploadCon/uploadPdf`;//上传结算单
//上传结果
export const addTaskResult = params => { return jq.post(`${base}/payroll-maintenance/resultAppearCon/add`, params)};
//详情PDF
export const getResultAppearFileById = params => { return jq.post(`${base}/payroll-maintenance/resultAppearCon/findListFilePath`, params)};

/*
* 发票管理
* */
//发票列表 （财务）
export const findPageFinancial = params => { return jq.get(`${base}/payroll-maintenance/inviceCon/findPage`, params)};
export const exportInvice = `${base}/payroll-maintenance/inviceCon/exportInvice`;//批量导出开票信息
//上传邮寄单号
export const importInvoiceMessage = `${base}/payroll-maintenance/inviceCon/importInvoiceMessage`;
//申请开票（结算）
//查询订单列表
export const findCompanyOrders = params => { return jq.get(`${base}/payroll-maintenance/companyOrderCon/findCompanyOrders`, params)};
//申请开票
export const saveInvoice = params => { return jq.post(`${base}/payroll-maintenance/inviceCon/save`, params)};
//物流详情
export const kuaidiCon = params => { return jq.post(`${base}/baseservice/kuaidiCon/getLogisticsMessageByNumber`, params)};
/*
* 结算管理
* */
//结算列表
export const findBalanceOrders = params => { return jq.get(`${base}/payroll-maintenance/companyOrderCon/findCompanyOrders`, params)};
export const findCompanyOrdersDetail = params => { return jq.get(`${base}/payroll-maintenance/companyOrderCon/findCompanyOrdersDetail`, params)};
export const findCompanyOrdersItems = params => { return jq.get(`${base}/payroll-maintenance/companyOrderCon/findCompanyOrdersItems`, params)};//获取子订单明细信息
//下载表单
export const exportOrderData = `${base}/payroll-maintenance/orders/exportOrderData`;//批量导出开票信息
//订单充值
export const orderAddAccount = params => { return jq.post(`${base}/payroll-maintenance/companyOrderCon/orderAddAccount`, params)};
export const consoleUpdatePayResultPreView = `${base}/payroll-maintenance/orders/consoleUpdatePayResultPreView`;//上传结算单
//提交
export const submitUpdateOrderData = params => { return jq.post(`${base}/payroll-maintenance/orders/submitUpdateOrderData`, params)};


/*
* 企业管理
* */
//企业tree
export const findCompanyTree = params => { return jq.get(`${base}/payroll-maintenance/companyCon/findCompanyTree`, params)};
//4.3.2	查询企业组接口
export const findClientGroup = params => { return jq.get(`${base}/payroll-maintenance/companyCon/findClientGroup`, params)};
//4.3.3	添加或修改企业组接口
export const updateClientGroup = params => { return jq.post(`${base}/payroll-maintenance/companyCon/updateClientGroup`, params)};
//4.3.5	上传企业营业执照
export const updateStudioImg = `${base}/payroll-maintenance/companyStudioCon/updateStudioImg`;
//4.3.4	提交企业信息
export const submitCompanyMessage = params => { return jq.post(`${base}/payroll-maintenance/companyCon/submitCompanyMessage`, params)};
//4.3.9	企业数统计
export const findCompanyStatistics = params => { return jq.get(`${base}/payroll-maintenance/companyCon/findCompanyStatistics`, params)};
//4.3.7	删除企业
export const delCompany = params => { return jq.post(`${base}/payroll-maintenance/companyCon/delCompany`, params)};
//4.3.6	获取企业信息
export const getCompanyMessage = params => { return jq.get(`${base}/payroll-maintenance/companyCon/getCompanyMessage`, params)};

/*
* 账户管理
* */
export const companyUserConFindPage = params => { return jq.get(`${base}/payroll-maintenance/companyUserCon/findPage`, params)};
export const companyUserConAddCompanyUser = params => { return jq.post(`${base}/payroll-maintenance/companyUserCon/addCompanyUser`, params)};
export const companyUserConBlockUpOrStartUsing = params => { return jq.post(`${base}/payroll-maintenance/companyUserCon/blockUpOrStartUsing`, params)};
export const companyUserConResetPassword = params => { return jq.post(`${base}/baseservice/companyUserCon/resetPassword`, params)};
export const companyUserConCopyCompanyUserMessage = params => { return jq.get(`${base}/baseservice/companyUserCon/copyCompanyUserMessage`, params)};
export const companyConFindCompanyAccountMessage = params => { return jq.get(`${base}/payroll-maintenance/companyCon/findCompanyAccountMessage`, params)};
export const companyConFindAddAccountCompanyList = params => { return jq.get(`${base}/payroll-maintenance/companyCon/findAddAccountCompanyList`, params)};


/*
* 合同管理
* */
//合同列表
export const findContractPage = params => { return jq.get(`${base}/payroll-maintenance/companyContractCon/findPage`, params)};
//4.4.2	添加合同
export const addContract = params => { return jq.post(`${base}/payroll-maintenance/companyContractCon/addContract`, params)};
//4.4.3	查询企业合同信息接口
export const findCompanyContractById = params => { return jq.get(`${base}/payroll-maintenance/companyContractCon/findCompanyContractById`, params)};
//4.3.10	查询企业状态
export const findCompanyStatus = params => { return jq.get(`${base}/payroll-maintenance/companyCon/findCompanyStatus`, params)};
//4.4.7	查询签约主体
export const findSubject = params =>{ return jq.get(`${base}/payroll-maintenance/companyCon/findSubject`, params)};
//4.4.5	上传合同或补充协议
export const uploadCompanyContract = `${base}/payroll-maintenance/companyContractCon/uploadCompanyContract`;
//提交合同、补充协议信息
export const submitCompanyContract = params =>  { return jq.post(`${base}/payroll-maintenance/companyContractCon/submitCompanyContract`, params)};
//4.4.4	企业合同作废
export const disablerCompanyContract = params => { return jq.post(`${base}/payroll-maintenance/companyContractCon/disablerCompanyContract`, params)};

/*
* 首页模块
* */
/*销售*/
//4.11 结算-首页结算统计
export const findCalcCount = params =>{ return jq.get(`${base}/payroll-maintenance/companyOrderCon/findCalcCount`, params)};
//4.12 结算-首页结算金额统计
export const findTotalMoney = params =>{ return jq.get(`${base}/payroll-maintenance/companyOrderCon/findTotalMoney`, params)};
export const findCompanyContractStatistics = params =>{ return jq.get(`${base}/payroll-maintenance/companyContractCon/findCompanyContractStatistics`, params)};
export const findStatistics = params =>{ return jq.get(`${base}/payroll-maintenance/inviceCon/findStatistics`, params)};
export const findExpressageCount = params =>{ return jq.get(`${base}/baseservice/companyInvoiceItemsCon/findExpressageCount`, params)};
export const findAuditNumber = params =>{ return jq.get(`${base}/baseservice/companyAddressCon/findAuditNumber`, params)};
export const findMoney = params =>{ return jq.get(`${base}/payroll-maintenance/inviceCon/findMoney`, params)};
export const findAddressPage = params =>{ return jq.get(`${base}/baseservice/companyAddressCon/findPage`, params)};
export const auditAddress = params =>{ return jq.post(`${base}/baseservice/companyAddressCon/auditAddress`, params)};
