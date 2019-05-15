const Login = () => import('./views/Login/Login.vue');//登陆
const NotFound = r => require.ensure([], () => r(require('./views/other/404.vue')), 'NotFound');//404
const forgetPwd = r => require.ensure([], () => r(require('./views/other/forgetPwd.vue')), 'forgetPwd');//忘记密码

/*首页部分*/
const Home = r => require.ensure([], () => r(require('./views/Home.vue')), 'Home');//主路由
const Index = r => require.ensure([], () => r(require('./views/Home/Index.vue')), 'Index');
/*企业管理*/
const EnterpriseIndex = r => require.ensure([], () => r(require('./views/EnterpriseManage/EnterpriseIndex.vue')), 'EnterpriseIndex');
//企业统计
const EnterpriseStatistical = r => require.ensure([], () => r(require('./views/EnterpriseManage/EnterpriseStatistical.vue')), 'EnterpriseStatistical');
//实体企业详细信息
const EnterpriseReal = r => require.ensure([], () => r(require('./views/EnterpriseManage/EnterpriseReal.vue')), 'EnterpriseReal');
//企业组详情
const EnterpriseGroupReal = r => require.ensure([], () => r(require('./views/EnterpriseManage/EnterpriseGroupReal.vue')), 'EnterpriseGroupReal');
//添加企业
const addEnterprise = r => require.ensure([], () => r(require('./views/EnterpriseManage/addEnterprise.vue')), 'addEnterprise');
//添加合同
const addContract = r => require.ensure([], () => r(require('./views/EnterpriseManage/addContract.vue')), 'addContract');
//编辑企业
const aditEnterprise = r => require.ensure([], () => r(require('./views/EnterpriseManage/aditEnterprise.vue')), 'aditEnterprise');
//编辑企业组
const aditEnterpriseGroup = r => require.ensure([], () => r(require('./views/EnterpriseManage/aditEnterpriseGroup.vue')), 'aditEnterpriseGroup');
//合同详情
const contractReal = r => require.ensure([], () => r(require('./views/EnterpriseManage/contractReal.vue')), 'contractReal');
//历史合同
const historyContract =  r => require.ensure([], () => r(require('./views/EnterpriseManage/historyContract.vue')), 'historyContract');


/*合同管理*/
const contractIndex = r => require.ensure([], () => r(require('./views/contract/contractIndex.vue')), 'contractIndex');
const Contract = r => require.ensure([], () => r(require('./views/contract/contract.vue')), 'Contract');
const contractDetails = r => require.ensure([], () => r(require('./views/contract/contractDetails.vue')), 'contractDetails');//详情
const aditContract = r => require.ensure([], () => r(require('./views/contract/aditContract.vue')), 'aditContract');//修改合同
const aditContractKf = r => require.ensure([], () => r(require('./views/contract/aditContractKf.vue')), 'aditContractKf');//客服修改合同
/*账号管理*/
const Account = r => require.ensure([], () => r(require('./views/Account/Account.vue')), 'Account');
/*任务管理*/
const Task = r => require.ensure([], () => r(require('./views/Task/Task.vue')), 'Task');
/*结算管理*/
const Balance = r => require.ensure([], () => r(require('./views/Balance/Balance.vue')), 'Balance');
const BalanceIndex = r => require.ensure([], () => r(require('./views/Balance/BalanceIndex.vue')), 'BalanceIndex');
//结算单详情
const BalanceDetails = r => require.ensure([], () => r(require('./views/Balance/BalanceDetails.vue')), 'BalanceDetails');
//结算表单上传
const BalanceUpdata = r => require.ensure([], () => r(require('./views/Balance/BalanceUpdata.vue')), 'BalanceUpdata');
/*发票管理*/
const invoiceIndex = r => require.ensure([], () => r(require('./views/invoice/invoiceIndex.vue')), 'invoiceIndex');
const invoiceIndexApply = r => require.ensure([], () => r(require('./views/invoice/invoiceIndex_apply')), 'invoiceIndexApply');
const invoice = r => require.ensure([], () => r(require('./views/invoice/invoice.vue')), 'invoice');
const logistics = r => require.ensure([], () => r(require('./views/invoice/logistics.vue')), 'logistics');//物流详情
const invoice_apply = r => require.ensure([], () => r(require('./views/invoice/invoice_apply')), 'invoice_apply');//申请开票
const addressConfirm = r => require.ensure([], () => r(require('./views/invoice/addressConfirm')), 'addressConfirm');
/*忘记密码*/
const Safe = r => require.ensure([], () => r(require('./views/password/Safe.vue')), 'Safe');//安全设置
const Password = r => require.ensure([], () => r(require('./views/password/Password.vue')), 'Password');//修改密码
let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/forgetPwd',
        component: forgetPwd,
        name: '忘记密码',
        hidden: true
    },
    {
        path: '/home',
        component: Home,
        name: '首页',
        redirect: { path: '/home/index' },
        children: [
            { path: '/home/index', component: Index, name: '首页'},
            {
                path: '/home/EnterpriseIndex',
                component: EnterpriseIndex,
                name: '企业管理',
                redirect: { path: '/home/EnterpriseIndex/EnterpriseStatistical' },
                children:[
                    {
                        path: '/home/EnterpriseIndex/EnterpriseStatistical',
                        component: EnterpriseStatistical,
                        name: '企业统计'
                    },
                    {
                        path: '/home/EnterpriseIndex/EnterpriseGroupReal/:groupId',
                        component: EnterpriseGroupReal,
                        name: '企业组详情'
                    },
                    {
                        path: '/home/EnterpriseIndex/aditEnterpriseGroup',
                        component: aditEnterpriseGroup,
                        name: '企业组编辑'
                    },
                    {
                        path: '/home/EnterpriseIndex/EnterpriseReal/:companyIds',
                        component: EnterpriseReal,
                        name: '企业详情'
                    },
                    {
                        path: '/home/EnterpriseIndex/addEnterprise',
                        component: addEnterprise,
                        name: '添加企业'
                    },
                    {
                        path: '/home/EnterpriseIndex/aditEnterprise',
                        component: aditEnterprise,
                        name: '编辑企业'
                    },
                    {
                        path: '/home/EnterpriseIndex/addContract',
                        component: addContract,
                        name: '添加合同'
                    },
                    {
                        path: '/home/EnterpriseIndex/contractReal',
                        component: contractReal,
                        name: '查看合同'
                    },


                ]
            },
            /*{ path: '/home/historyContract', component: historyContract, name: '历史合同'},*/
            {
                path: '/home/contractIndex',
                component: contractIndex,
                name: '合同管理',
                redirect: { path: '/home/contractIndex/contract' },
                children: [
                    {
                        path: '/home/contractIndex/contract',
                        component: Contract,
                        name: '合同列表'
                    },
                    {
                        path: '/home/contractIndex/contractDetails',
                        component: contractDetails,
                        name: '合同详情'
                    },
                    {
                        path: '/home/contractIndex/aditContract',
                        component: aditContract,
                        name: '修改合同'
                    },
                    {
                        path: '/home/contractIndex/aditContractKf',
                        component: aditContractKf,
                        name: '上传合同补充协议'
                    },
                    {
                        path: '/home/contractIndex/historyContract',
                        component: historyContract,
                        name: '历史合同'
                    },
                ]

            },
            { path: '/home/Account', component: Account, name: '账号管理'},
            { path: '/home/Task', component: Task, name: '任务管理'},
            {
                path: '/home/balanceIndex',
                component: BalanceIndex,
                name: '结算管理',
                redirect: { path: '/home/balanceIndex/balance' },
                children: [
                    {
                        path: '/home/balanceIndex/balance',
                        component: Balance,
                        name: '结算列表'
                    },
                    {
                        path: '/home/balanceIndex/balanceDetails',
                        component: BalanceDetails,
                        name: '结算单详情'
                    },
                    {
                        path: '/home/balanceIndex/balanceUpdata',
                        component: BalanceUpdata,
                        name: '结算单详情'
                    },
                ]
            },
            {
                path: '/home/invoiceIndex',
                component: invoiceIndex,
                name: '发票管理',
                redirect: { path: '/home/invoiceIndex/invoice' },
                children: [
                    {
                        path: '/home/invoiceIndex/invoice',
                        component: invoice,
                        name: '发票列表'
                    },
                    {
                        path: '/home/invoiceIndex/logistics',
                        component: logistics,
                        name: '物流信息'
                    },
                    {
                        path: '/home/invoiceIndex/addressConfirm',
                        component: addressConfirm,
                        name: '地址信息变更确认'
                    }
                ]
            },
            {
                path: '/home/invoiceIns_apply',
                component: invoiceIndexApply,
                name: '申请开票',
                redirect: { path: '/home/invoiceIns_apply/invoice_apply' },
                children: [
                    {
                        path: '/home/invoiceIns_apply/invoice_apply',
                        component: invoice_apply,
                        name: '开票列表'
                    }
                ]
            },
            {
                path: '/home/password',
                component: Safe,
                name: '安全设置',
                redirect: { path: '/home/password/password' },
                children: [
                    {
                        path: '/home/password/password',
                        component: Password,
                        name: '修改密码'
                    }
                ]
            },
        ]
    },
    {
        path: '/',
        component: Home,
        redirect: { path: '/login' }
    },
    {
        path: '/404',
        component: NotFound,
        name: '404',
        hidden: true
    },
];
export default routes;
