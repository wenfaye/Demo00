/**
 * @file 账单自助的配置文件
 * @author ZhangAXiong
 * @version 1.0
 * Last Updated 2021-01-19
 * 1.账单自助菜单的js文件以及html文件的加载
 * 2.公共common.js以及readCardNext.js的加载
 */
PJF.apply(stmRouting,{
	
	validatorCBIndex: {
		html: '../corporateBillHfBank/validatorBill/validatorCBIndex.html',
		js: ['../corporateBillHfBank/validatorBill/validatorCBIndex.js'],
		className: 'validatorCBIndex'
	},
	identifyingCode: {
		html: '../corporateBillHfBank/validatorBill/identifyingCode.html',
		js: ['../corporateBillHfBank/validatorBill/identifyingCode.js'],
		className: 'identifyingCode'
	},
	emidCardNo: {
		html: '../corporateBillHfBank/entryLogin/emidCardNo.html',
		js: ['../corporateBillHfBank/entryLogin/emidCardNo.js'],
		className: 'emidCardNo'
	},
	emidCardPwd: {
		html: '../corporateBillHfBank/entryLogin/emidCardPwd.html',
		js: ['../corporateBillHfBank/entryLogin/emidCardPwd.js'],
		className: 'emidCardPwd'
	},
	entryIndex: {
		html: '../corporateBillHfBank/entry/entryIndex.html',
		js: ['../corporateBillHfBank/entry/entryIndex.js'],
		className: 'entryIndex'
	},
	entry: {
		html: '../corporateBillHfBank/entry/entry.html',
		js: ['../corporateBillHfBank/entry/entry.js'],
		className: 'entry'
	},
	//CB corporateBillNew
	//查询普通账户财资账户（全量明细、过滤明细、对账单）
	queryCBDetailHF: {
		html: '../corporateBillHfBank/queryDetail/queryCBDetail.html',
		js: ['../corporateBillHfBank/queryDetail/queryCBDetail.js'],
		className: 'queryCBDetailHF'
	},
	queryCBResultHF: {
		html: '../corporateBillHfBank/queryDetail/queryCBResult.html',
		js: ['../corporateBillHfBank/queryDetail/queryCBResult.js'],
		className: 'queryCBResultHF'
	},
	//查询财资账户对账清单
	queryBillListDetailHF: {
		html: '../corporateBillHfBank/queryDetail/queryBillListDetail.html',
		js: ['../corporateBillHfBank/queryDetail/queryBillListDetail.js'],
		className: 'queryBillListDetailHF'
	},
	queryBillListResultHF: {
		html: '../corporateBillHfBank/queryDetail/queryBillListResult.html',
		js: ['../corporateBillHfBank/queryDetail/queryBillListResult.js'],
		className: 'queryBillListResultHF'
	},
	printCBOptionHF: {
		html: '../corporateBillHfBank/queryDetail/printCBOption.html',
		js: ['../corporateBillHfBank/queryDetail/printCBOption.js'],
		className: 'printCBOptionHF'
	},
	//打印对公回单
	printCBDetailHF: {
		html: '../corporateBillHfBank/printDetail/printCBDetail.html',
		js: ['../corporateBillHfBank/printDetail/printCBDetail.js'],
		className: 'printCBDetailHF'
	},
	printPatchCBDetailHF: {
		html: '../corporateBillHfBank/printDetail/printPatchCBDetail.html',
		js: ['../corporateBillHfBank/printDetail/printPatchCBDetail.js'],
		className: 'printPatchCBDetailHF'
	},
	takeCBHF: {
		html: '../corporateBillHfBank/printDetail/takeCBNew.html',
		js: ['../corporateBillHfBank/printDetail/takeCBNew.js'],
		className: 'takeCBHF'
	},
	// 扫描二维码
	CPBScanningHF : {
		html: '../corporateBillHfBank/scanVerification/scanning.html',
		js: ['../corporateBillHfBank/scanVerification/scanning.js'],
		className: 'CPBScanningHF'
	},
	// 可查询余额账户
	CPBBalanceQueryHF : {
		html: '../corporateBillHfBank/balanceQuery/balanceQuery.html',
		js: ['../corporateBillHfBank/balanceQuery/balanceQuery.js'],
		className: 'CPBBalanceQueryHF'
	},
	// 余额查询
	CPBBalanceResultHF : {
		html: '../corporateBillHfBank/balanceQuery/balanceResult.html',
		js: ['../corporateBillHfBank/balanceQuery/balanceResult.js'],
		className: 'CPBBalanceResultHF'
	},
	// 账页明细查询页面
	ledgerPageDetailQueryHF : {
		html: '../corporateBillHfBank/ledgerPageDetail/ledgerPageDetailQuery.html',
		js: ['../corporateBillHfBank/ledgerPageDetail/ledgerPageDetailQuery.js'],
		className: 'ledgerPageDetailQueryHF'
	},
	// 账页明细查询列表
	ledgerPageDetailListHF : {
		html: '../corporateBillHfBank/ledgerPageDetail/ledgerPageDetailList.html',
		js: ['../corporateBillHfBank/ledgerPageDetail/ledgerPageDetailList.js'],
		className: 'ledgerPageDetailListHF'
	},
	//账户类型选择
	accountTypeHF : {
		html: '../corporateBillHfBank/accountType/accountType.html',
		js: ['../corporateBillHfBank/accountType/accountType.js'],
		className: 'accountTypeHF'
	},
	//明细类型选择
	detailTypeHF : {
		html: '../corporateBillHfBank/accountType/detailType.html',
		js: ['../corporateBillHfBank/accountType/detailType.js'],
		className: 'detailTypeHF'
	},
	//自定义打印
	printCBCondtionHF : {
		html: '../corporateBillHfBank/printDetail/printCBCondtion.html',
		js: ['../corporateBillHfBank/printDetail/printCBCondtion.js'],
		className: 'printCBCondtionHF'
	},
	//选择卡类型
	cardTypeHF : {
		html: '../corporateBillHfBank/accountType/cardType.html',
		js: [/*'../corporateBillHfBank/common/readCardNext.js',*/'../corporateBillHfBank/accountType/cardType.js'],
		className: 'cardTypeHF'
	},
	//读取回单卡
	readEmidCardHF : {
		html: '../corporateBillHfBank/emidCard/readEmidCard.html',
		js: ['../corporateBillHfBank/emidCard/readEmidCard.js'],
		className: 'readEmidCardHF'
	},
	//输入回单卡密码
	inputEmidCardPwdHF : {
		html: '../corporateBillHfBank/emidCard/inputEmidCardPwd.html',
		js: ['../corporateBillHfBank/emidCard/inputEmidCardPwd.js'],
		className: 'inputEmidCardPwdHF'
	},
	//支付密码校验
	payCheckHF : {
		html: '../corporateBillHfBank/payCheck/payCheck.html',
		js: ['../corporateBillHfBank/payCheck/payCheck.js'],
		className: 'payCheckHF'
	},
	//支付密码校验成功
	payCheckSuccHF : {
		html: '../corporateBillHfBank/payCheck/payCheckSucc.html',
		js: ['../corporateBillHfBank/payCheck/payCheckSucc.js'],
		className: 'payCheckSuccHF'
	},
	//自助对账
	balanceSelfHF : {
		html: '../corporateBillHfBank/balanceSelf/balanceSelf.html',
		js: ['../corporateBillHfBank/balanceSelf/balanceSelf.js'],
		className: 'balanceSelfHF'
	},
	queryNoSignDetailHF : {
		html: '../corporateBillHfBank/balanceSelf/queryNoSignDetail.html',
		js: ['../corporateBillHfBank/balanceSelf/queryNoSignDetail.js'],
		className: 'queryNoSignDetailHF'
	},
	querySignedDetailHF : {
		html: '../corporateBillHfBank/balanceSelf/querySignedDetail.html',
		js: ['../corporateBillHfBank/balanceSelf/querySignedDetail.js'],
		className: 'querySignedDetailHF'
	},
	recordHF : {
		html: '../corporateBillHfBank/balanceSelf/record.html',
		js: ['../corporateBillHfBank/balanceSelf/record.js'],
		className: 'recordHF'
	},
	emptyHF : {
		html: '../corporateBillHfBank/balanceSelf/empty.html',
		js: ['../corporateBillHfBank/balanceSelf/empty.js'],
		className: 'emptyHF'
	},
    //查询通知 2020.01.11
    queryNotice: {
        html: '../corporateBillHfBank/queryNotice/queryNotice.html',
        js: ['../corporateBillHfBank/queryNotice/queryNotice.js'],
        className: 'queryNotice'
    },
	//pwdChange 密码修改2020.01.11
	pwdChange: {
	        html: '../corporateBillHfBank/pwdChange/pwdChange.html',
	        js: ['../corporateBillHfBank/pwdChange/pwdChange.js'],
	        className: 'pwdChange'
	},
	pwdChangeSuccess: {
		html: '../corporateBillHfBank/pwdChange/pwdChangeSuccess.html',
		js: ['../corporateBillHfBank/pwdChange/pwdChangeSuccess.js'],
		className: 'pwdChangeSuccess'
    },
    //自助服务提示 20200324
    selfServiceHints: {
        html: '../corporateBillHfBank/selfServiceHints/selfServiceHints.html',
        js: ['../corporateBillHfBank/selfServiceHints/selfServiceHints.js'],
        className: 'selfServiceHints'
    },
	//未回签对账单回签打印 202009
	inputAuthCode: {
		html: '../corporateBillHfBank/balanceSelf/inputAuthCode.html',
		js: ['../corporateBillHfBank/balanceSelf/inputAuthCode.js'],
		className: 'inputAuthCode'
	},
	unSignedBill: {
		html: '../corporateBillHfBank/balanceSelf/unSignedBill.html',
		js: ['../corporateBillHfBank/balanceSelf/unSignedBill.js'],
		className: 'unSignedBill'
	}
	
});
PJF.apply(process,{
	processChangePwd:{
		data: ["验证旧密码","输入新密码","交易结果"]
	}
	
});
JSLoader.loadJavaScript(STM_CONTEXT_PATH + "corporateBillHfBank/common/common.js");
JSLoader.loadJavaScript(STM_CONTEXT_PATH + "corporateBillHfBank/common/readCardNext.js");
