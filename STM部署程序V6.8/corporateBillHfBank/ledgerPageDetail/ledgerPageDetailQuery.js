/**
 * @file 账页明细查询
 * @author ZhangAXiong
 * @version 1.0
 * Create On
 * Last Updated 2021-01-19
 * 1.账页明细的条件查询
 * 2.查询区间三个月
 * 3.查询时间不能超过当前时间
 */
function ledgerPageDetailQueryHF() {
}
ledgerPageDetailQueryHF.prototype = {
    init: function (data) {
    	data = data || {};
    	if(data.accNo){
    		$('.accountNo').text(data.accNo);
    	}else if(data.Cst_AccNo){
    		$('.accountNo').text(data.Cst_AccNo);
    		data.accNo = data.Cst_AccNo;
    	}
    	
    	var responseData = data.resData;// @critical 卡下所有的账户
    	var flag = -1;// 用于虚拟键盘
    	
    	/*var accArr = new Array();// @critical 账户下拉框数据
    	// @critical 设置账户下拉框初始数据
    	var initSelectedData = {};
    	initSelectedData.name = '-1';
    	initSelectedData.desc = '--请选择查询账号--';
    	accArr.push(initSelectedData);
    	
    	// 账户下拉框数据写入
    	
    	if(responseData && responseData.Reg_GRP && responseData.Reg_GRP.length){
    		for(var i = 0; i < responseData.Reg_GRP.length; i++){
    			var accNo = responseData.Reg_GRP[i].Cst_AccNo;
    			if(accNo){
    				var row = {};// 用于所属计划下拉框
    				row.desc = accNo;
    				row.name = accNo;
    				accArr.push(row);
    			}
    		}
    	}
    	*/
    	
    	// 初始化label标签
    	new PJF.ui.label({
            doms: ['queryAccount','ledgerPage','dealStartDate','dealEndDate','queryStatus'],
            values: ["查询账号","账页页码","交易起始日期","交易截止日期","查询状态"],
            width: 180
        });
    	
		// 查询账号
		/*
		 * var accountNo = new PJF.ui.select({
			dom: 'accountNo',
	        data: accArr,
	        width: 440,
			onChange: function(){
			}
		});
		*/
    	
    	// 账页状态
    	var selectStatus = new PJF.ui.checkbox({
			dom : 'selectStatus',
			singleSelect : true,
			data : [ {
				desc : '全部',
				value : '2'
			}, {
				desc : '未打印',
				value : '0'
			}, {
				desc : '已打印',
				value : '1'
			} ],
			type : "horizontal",// 水平分布
			onClick : function() {
			}
		});
    	
    	// 交易起始时间
		/*var startTime = new PJF.ui.date({
			dom : "startTime",
			startYear : '2010'
		});

		// 交易截止时间
		var endTime = new PJF.ui.date({
			dom : "endTime",
			startYear : '2010'
		});*/
        /*var currentYear = new Date().getFullYear();//当前年
        var currentMonth = new Date().getMonth();//当前月
        var currentDay = new Date().getDate();//当前日*/
		var currentServerDate = PJF.communication.getServerTime("yyyy/MM/dd");
		console.log("》》》服务器当前时间："+currentServerDate);
		
		//开始时间为当前时间往前92天
		//var lastDate = new Date().setDate(new Date().getDate() - 92);
		var lastDate = new Date(new Date(currentServerDate)-(1000 * 60 * 60 * 24 * 92));
		//var begin_date = PJF.util.formatDate(new Date(lastDate),"yyyy/MM/dd");
		
        var startTime = new PJF.ui.calendar({
            dom : "startTime",
            //defaultDate:new Date(new Date(currentServerDate)-(1000 * 60 * 60 * 24 * 92))
            //defaultDate:new Date(currentServerDate)
            defaultDate:new Date(PJF.util.formatDate(lastDate,"yyyy/MM/dd"))
        });
        var endTime = new PJF.ui.calendar({
            dom : "endTime",
            defaultDate:new Date(currentServerDate)
        });

		// 起始页
		var startPage = new PJF.ui.textfield({
			dom : 'startPage',
			width : 180,
			datatype : 'number'
		});

		// 截止页
		var endPage = new PJF.ui.textfield({
			dom : 'endPage',
			width : 180,
			datatype : 'number'
		});
		
		// 返回按钮
		var returnBtn = new PJF.ui.linkButton({
			dom : 'returnBtn',
			style : 'main',
			name : '返回',
			onClick : function() {
				/*if(data.menu){
					template.loadPage(data.menu, data);
				}else{
					template.loadPage('entryIndex', {accNo:data.accNo});
				}*/
				template.loadPage('entryIndex', {accNo:data.accNo});
			}
		});
		
		// @critical结果页面返回初始化查询页面
		if(data.condition){
			//accountNo.setValue(data.Cst_AccNo ? data.Cst_AccNo : '-1');
			selectStatus.setValue(data.Prt_Ind ? data.Prt_Ind : '2');
            var stdt = data.StDt;
            var codt = data.CODt;
            var stdt_utc = new Date(stdt.substr(0,4),stdt.substr(4,2)-1,stdt.substr(6,2));
            var codt_utc = new Date(codt.substr(0,4),codt.substr(4,2)-1,codt.substr(6,2));
            startTime.setValue(stdt_utc);
			endTime.setValue(codt_utc);
			startPage.setValue(data.Min_Val);
			endPage.setValue(data.Max_Val);
		} else {
			//accountNo.setValue('-1');// 默认选择全部账号
			selectStatus.setValue('2');// 默认打印类型选全部
		}
		
		//@critical请设置查询条件，点击确认查询
		PJF.communication.player.PlaySoundByUrl("app/corporateBill/01.wav");
		
		// 确认按钮
		var confirmBtn = new PJF.ui.linkButton({
			dom : 'confirmBtn',
			style : 'main',
			appendStyle : 'confirm',
			name : '确认',
			onClick : function() {
				// 获取服务器时间并且转为Date格式
				//var nowDate = new Date();
				var nowDate = new Date(currentServerDate);
				// @critical 获取起始时间字符串
				var begin_date_new = startTime.getValue();
				// @critical 获取结束时间字符串
				var end_date_new = endTime.getValue();
                //@critical 后台传入时间类型yyyyMMdd
                var startDate = PJF.util.formatDate(begin_date_new,"yyyyMMdd");
                var endDate = PJF.util.formatDate(end_date_new,"yyyyMMdd");
				// @critical 防止年份不同导致二月28和29天差异--返回值可能只有六位
				var reg = /^\d{8}$/;
				if(startDate && reg.test(startDate) == false){
					STM.corporateBill.showAlertMsg('起始日期格式错误，请检查选择的起始日期是否正确');
					return;
				}
				if(endDate && reg.test(endDate) == false){
					STM.corporateBill.showAlertMsg('截止日期格式错误，请检查选择的截止日期是否正确');
					return;
				}
				
				// 将字符串转为Date格式
				var begin_Date = new Date(startDate.substring(0,4),(parseInt(startDate.substring(4,6))-1),startDate.substring(6,8));
				var end_Date = new Date(endDate.substring(0,4),(parseInt(endDate.substring(4,6))-1),endDate.substring(6,8));
				var tempDate = new Date(endDate.substring(0,4),(parseInt(endDate.substring(4,6))-1),endDate.substring(6,8));
				tempDate.setDate(tempDate.getDate() - 92);
				if(begin_Date > nowDate){
					STM.corporateBill.showAlertMsg('起始日期不能晚于当前时间!');
					return;
				}
				if(end_Date > nowDate){
					STM.corporateBill.showAlertMsg('截止日期不能晚于当前时间!');
					return;
				}
				if(begin_Date > end_Date){
					STM.corporateBill.showAlertMsg('起始日期不能大于截止日期!');
					return;
				}
//				if(startDate.substring(0,4) != endDate.substring(0,4)){
//					STM.corporateBill.showAlertMsg('起始日期和截止日期之间不能跨年!');
//					return;
//				}
				if(tempDate > begin_Date){
					STM.corporateBill.showAlertMsg('截止日期不能超过起始日期92天!');
					return;
				}
				if(startPage.getValue() && endPage.getValue() && (parseInt(startPage.getValue()) > parseInt(endPage.getValue()))){
					STM.corporateBill.showAlertMsg('起始页不能大于截止页');
					return;
				}
				
				/*var accNo = accountNo.getValue();// 获取下拉框选中的账号
				accNo = (accNo == '-1') ? '' : accNo;// -1表示所有的账号
				*/
				var accNo = data.accNo;
				accNo = (accNo == '-1') ? '' : accNo;// -1表示所有的账号
				var param = {};
				param.Txn_CardNo = data.Txn_CardNo;// 卡号
				param.Cst_AccNo = accNo;// 客户账号
				param.StDt = startDate;// 开始日期
				param.CODt = endDate;// 截止日期
				param.Min_Val = startPage.getValue() || '';// 起始帐页页码
				param.Max_Val = endPage.getValue() || '';// 截止帐页页码
				//param.Cur_Pg_CD = '1',// 当前页码
				param.Prt_Ind = ('2' == selectStatus.getValue()) ? '' : selectStatus.getValue()[0];// @critical 打印标志
				param.condition = true;// 自定义查询
				param.resData = responseData;
				console.log('卡号：'+param.Txn_CardNo+'；账号：'+accNo+'；打印状态：'+param.Prt_Ind);
				template.loadPage('ledgerPageDetailListHF', param);
			}
		});
    },
	destroy : function() {
	}
};