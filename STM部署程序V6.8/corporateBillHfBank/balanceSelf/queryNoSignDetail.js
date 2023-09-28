/**
 * @file 未回签对账单查询
 * @author ZhangAXiong
 * @version 1.0
 * Create On
 * * Last Updated 2021-01-19
 * 获取查询条件，账号，时间，账单类型进行查询
 */
function queryNoSignDetailHF() {

}
var accNo = null;
// 在prototype里渲染各个页面组件
queryNoSignDetailHF.prototype = {
	init : function(data) {
		data = data || {};
		accNo = data.accNo?data.accNo:STM.corporateBill.curAccount;
		var responseData = data.resData;// 卡下所有的账户
		var cardData = [];// 账户下拉内容
//		cardData.push({name:"0",desc:""});
		
//		var cardData = data.ptData;
		if(data.ptData){// @critical 普通账户
			for(var i=0; i<data.ptData.length; i++){
				var ta = data.ptData[i].name.split("_");
				if(ta[3] == "1"){
					cardData.push(data.ptData[i]);
				}
				
			}
		}
		if(data.czData){// @critical 财资账户
			for(var i=0; i<data.czData.length; i++){
				var ta = data.czData[i].name.split("_");
				if(ta[3] == "1"){
					cardData.push(data.czData[i]);
				}
			}
		}
		
		
		/*账号*/
		/*var accountNo = new PJF.ui.select({
			dom: 'accountNo',
			data: cardData,
			width : 483,
			onChange: function(){
				var tp = accountNo.getValue().split("_");
				accountType.setValue(tp[1]);
			}
		});*/
		$('#accountNo').text(data.accNo);
		/*/!*起始账单日*!/
		var startTime = new PJF.ui.date({
			dom : "startTime",
			startYear:"2010"
		});
		/!*截止账单日*!/
		var endTime = new PJF.ui.date({
			dom : "endTime",
			startYear:"2010"
		});*/
        /*var currentYear = new Date().getFullYear();//当前年
        var currentMonth = new Date().getMonth();//当前月
        var currentDay = new Date().getDate();//当前日*/
		var currentServerDate = PJF.communication.getServerTime("yyyy/MM/dd");
		console.log("》》》服务器当前时间："+currentServerDate);
        var startTime = new PJF.ui.calendar({
            dom : "startTime",
            defaultDate:new Date(currentServerDate)
        });
        var endTime = new PJF.ui.calendar({
            dom : "endTime",
            defaultDate:new Date(currentServerDate)
        });
		/*账户类型*/
		var accountType = new PJF.ui.select({
			dom: 'accountType',
			data : [ {
				desc : '全部',
				name : '-1'
			}, {
				desc : '活期',
				name : '1'
			}, {
				desc : '定期',
				name : '2'
			}, {
				desc : '贷款',
				name : '3'
			}],
			width : 423,
			onChange: function(){
			}
		});
		accountType.readOnly(true);
		//accountType.disabled();
		
		/*if(accountNo.getValue()){
			var tp = accountNo.getValue().split("_");
			accountType.setValue(tp[1]);
		}*/
		
		/*币种*/
		var moneyType = new PJF.ui.select({
			dom: 'moneyType',
			data :[{"name":"156","desc":"人民币","index":"156"},
			   {"name":"840","desc":"美元","index":"840"},
		       {"name":"978","desc":"欧元","index":"978"},
		       {"name":"344","desc":"港币","index":"344"},
		       {"name":"826","desc":"英镑","index":"826"},
		       {"name":"392","desc":"日元","index":"392"},
		       {"name":"036","desc":"澳大利亚元","index":"036"},
		       {"name":"554","desc":"新西兰元","index":"554"},
		       {"name":"702","desc":"新加坡元","index":"702"},
		       {"name":"124","desc":"加拿大元","index":"124"},
		       {"name":"446","desc":"澳门元","index":"446"},
		       {"name":"764","desc":"泰铢","index":"764"},
		       {"name":"764","desc":"泰铢","index":"764"},
		       {"name":"756","desc":"瑞士法郎","index":"756"},
		       {"name":"752","desc":"瑞典克朗","index":"752"},
		       {"name":"208","desc":"丹麦克朗","index":"208"},
		       {"name":"578","desc":"挪威克朗","index":"578"},
		       {"name":"410","desc":"韩元","index":"410"},
		       {"name":"643","desc":"卢布","index":"643"},
		       {"name":"398","desc":"哈萨克斯坦坚戈","index":"398"},
		       {"name":"710","desc":"南非兰特","index":"710"},
		       {"name":"458","desc":"马来西亚吉特","index":"458"},
		       {"name":"985","desc":"波兰兹罗提","index":"985"},
		       {"name":"936","desc":"加纳塞地","index":"936"},
		       {"name":"704","desc":"越南盾","index":"704"},
		       {"name":"524","desc":"NPRNIBOER","index":"524"},
		       {"name":"144","desc":"马尔代夫卢比","index":"144"}
    		],
			width : 483,
			defaultValue:"156",
			onChange: function(){
			}
		});
		
		//请设置查询条件，点击确认查询
		PJF.communication.player.PlaySoundByUrl("app/corporateBill/01.wav");
		
		// 确认按钮
		var confirmBtn = new PJF.ui.linkButton({
			dom : 'confirmBtn',
			style : 'main',
			appendStyle : 'confirm',
			name : '确认',
			onClick : function() {
				/*var tmp = accountNo.getValue().split("_");
				var accNo = tmp[0];// 账号*/
				var accNo = data.accNo;
				var begin_date_new = startTime.getValue();// 起始账单日
				var end_date_new = endTime.getValue();// 截止账单日
                var startDate = PJF.util.formatDate(begin_date_new,"yyyyMMdd");
                var endDate = PJF.util.formatDate(end_date_new,"yyyyMMdd");
				//var accType = tmp[1] != "4" ? tmp[1]:"";//accountType.getValue();// 账户类型
                var accType = '-1';
				var coinType = moneyType.getValue();// 币种
				// 将字符串转为Date格式
				//var nowDate = new Date();// 当前时间
				var nowDate = new Date(currentServerDate);

				var begin_Date = new Date(startDate.substring(0,4),(parseInt(startDate.substring(4,6))-1),startDate.substring(6,8));
				var end_Date = new Date(endDate.substring(0,4),(parseInt(endDate.substring(4,6))-1),endDate.substring(6,8));
				var tempDate = new Date(endDate.substring(0,4),(parseInt(endDate.substring(4,6))-1),endDate.substring(6,8));
				tempDate.setDate(tempDate.getDate() - 92);
				if(begin_Date > nowDate){
					STM.corporateBill.showAlertMsg('起始账单日不能晚于当前时间!');
					return;
				}
				if(end_Date > nowDate){
					STM.corporateBill.showAlertMsg('截止账单日不能晚于当前时间!');
					return;
				}
				if(begin_Date > end_Date){
					STM.corporateBill.showAlertMsg('起始账单日不能大于截止账单日!');
					return;
				}
//				if(startDate.substring(0,4) != endDate.substring(0,4)){
//					STM.corporateBill.showAlertMsg('起始账单日和截止账单日之间不能跨年!');
//					return;
//				}
				if(tempDate > begin_Date){
					STM.corporateBill.showAlertMsg('截止账单日不能超过起始账单日92天!');
					return;
				}
				
				/*var jsonData = {
					'Version':'01',// 信息格式版本
					'TxCode':'CMST00024',// 交易代码
					'chanl_cust_no':'STM',// 渠道客户号
					'SYS_EVT_TRACE_ID':PJF.otherInfo.SVC_ID,// 全局流水跟踪号
					'OPR_NO':PJF.otherInfo.devId,// 操作员号
					//'PAGE_NO':'1',// 当前页码
					'INQUIRE_NUM':'9',// 查询条数
					'PRT_FLAG':'1'// 打印标志：2自助设备打印
				};*/
                var jsonData = {
                    'Enqr_StDt':startDate,// 查询起始日期
                    'Enqr_CODt':endDate,//查询截止日期
                    'Btch_Vchr_Blg_AccNo':accNo,
                    'DpBkInNo':'',
                	'Sign_St':'0',
                    'Cur_Pcsg_StCd':'0',//0 所有未回签1 相符2 不相符3 所有已回签送空默认查全部
                    'PdAr_ID':'',//产品合约编号  对应老接口字段：BILL_NO  对应账单编号
                    'Pcs_StCd':'2'//过程状态代码 对应查询标志1 查账单 2 查账单明细
                };
				
				jsonData._pagination = {};
				jsonData._pagination.PAGE_JUMP = '1';
                jsonData._pagination.REC_IN_PAGE = '9';//多页查询每页笔数

				/*var record = [{
					'ACCT_NO':accNo,// 账号
					'ACC_FLAG':'0',// 回签结果0 所有未回签1 相符2 不相符3 所有已回签
					'DEP_TYPE':accType,// 账户类型1 活期2 定期3 贷款
					'BEGIN_DATE':startDate,// 开始日期
					'END_DATE':endDate,// 结束日期
					'COIN_TYPE':coinType// 币种
				}];*/
                accType = data.accType ? data.accType : 1;
                var record = [{
                    'Cst_AccNo':accNo,// 客户账号
                    'Acc_Tp_ID':accType,// 账户类型:1 活期2 定期3 贷款
                    'CcyCd':coinType// 币种
                }];
				jsonData.Acc_Record = record;
				data.jsonData = jsonData;
				data.targetFlag = '1';
				data.btnId = 'btn2';
				template.loadPage("balanceSelfHF",data);
			}
		});
		
		// 返回按钮
		var returnBtn = new PJF.ui.linkButton({
			dom : 'returnBtn',
			style : 'main',
			name : '返回',
			onClick : function() {
				//template.loadPage('balanceSelfHF',data);
				template.loadPage('entryIndex',{accNo:accNo});
			}
		});

	},
	destroy : function() {
	}
}