/**
 * @file  回单打印查询页面
 * @author ZhangAXiong
 * @version 1.0
 * Create On
 * Last Updated 2021-01-19
 * 1.查询时间三个月内
 * 2.查询时间不能大于当前时间
 */
var accNo = '';

function printCBCondtionHF() {

}

// 在prototype里渲染各个页面组件
printCBCondtionHF.prototype = {
	init : function(data) {
		/**if (!data) {
			return;
		}*/
		data = data || {};
		data.SgAcc_TpCd = 1;
		accNo = data.accNo?data.accNo: data.Txn_CardNo;
		
		if(!data.accNo || !data.accNo.length){
			data.accNo = data.Txn_CardNo;
			STM.corporateBill.showAlertMsg('accNo丢失');
		}else if(!data.Txn_CardNo || !data.Txn_CardNo.length){
			data.Txn_CardNo = data.accNo;
		}
		
		var cardData = [];
		if(1 == data.SgAcc_TpCd){//@critical 普通账户才有附件打印
			cardData = data.ptData;
		} else if (4 == data.SgAcc_TpCd){//@critical 财资账户
			cardData = data.czData;
		}
		
		if(accNo && accNo.length){
			$('.accountNo').text(accNo);
		}
		/*
		var accountNo = new PJF.ui.select({
			dom: 'accountNo',
			data: cardData,
			width : 480,
			onChange: function(){}
		}); 

		var startTime = new PJF.ui.date({
			dom : "startTime",
			startYear:"2010"
		});

		var endTime = new PJF.ui.date({
			dom : "endTime",
			startYear:"2010"
		});*/
		/*var currentYear = new Date().getFullYear();//当前年
		var currentMonth = new Date().getMonth();//当前月
		var currentDay = new Date().getDate();//当前日
        console.log(currentYear+','+currentMonth+','+currentDay);*/
		var currentServerDate = PJF.communication.getServerTime("yyyy/MM/dd");
		console.log("》》》服务器当前时间："+currentServerDate);
        var startTime = new PJF.ui.calendar({
            dom : "startTime",
            defaultDate:new Date(new Date(currentServerDate)-(1000 * 60 * 60 * 24 * 92))
        });
        var endTime = new PJF.ui.calendar({
            dom : "endTime",
            defaultDate:new Date(currentServerDate)
        });
		var minNo = new PJF.ui.textfield({
			dom : 'minNo',
			width : 180,
			datatype : 'money'
		});

		var maxNo = new PJF.ui.textfield({
			dom : 'maxNo',
			width : 180,
			datatype : 'money'
		});
		
		if(data.condition){
			var stdt = data.StDt;
            var codt = data.CODt;
            var stdt_utc = new Date(stdt.substr(0,4),stdt.substr(4,2)-1,stdt.substr(6,2));
            var codt_utc = new Date(codt.substr(0,4),codt.substr(4,2)-1,codt.substr(6,2));
            startTime.setValue(stdt_utc);
			endTime.setValue(codt_utc);
		}
		// 返回按钮
		var returnBtn = new PJF.ui.linkButton({
			dom : 'returnBtn',
			style : 'main',
			name : '返回',
			onClick : function() {
				template.loadPage('entryIndex',{
					accNo:accNo
				});
				/*
				 * if(data.menu){
					if(!data.conditionData){
						data.conditionData = {}
						data.conditionData.Btch_Vchr_Blg_AccNo = data.accNo?data.accNo:data.Txn_CardNo;
						data.conditionData.prevMenu = data.menu;
						data.conditionData.Enqr_CODt = data.end_date?data.end_date:data.CODt;
						data.conditionData.Enqr_StDt = data.begin_date?data.begin_date:data.StDt;
					}
					
					template.loadPage(data.menu,data);
				}else{
					template.loadPage('entryIndex',{
						accNo:accNo
					});
				}*/
				
			}
		});

		// 确认按钮
		var confirmBtn = new PJF.ui.linkButton({
			dom : 'confirmBtn',
			style : 'main',
			appendStyle : 'confirm',
			name : '确认',
			onClick : function() {
				var begin_date_new = startTime.getValue();
				var end_date_new = endTime.getValue();
				var begin_date = PJF.util.formatDate(begin_date_new,"yyyyMMdd");
				var end_date = PJF.util.formatDate(end_date_new,"yyyyMMdd");
				//var nowTime = PJF.util.formatDate(new Date(),"yyyy-MM-dd");
				var nowDate = new Date(currentServerDate);
				//@critical 获取开始时间
				var startDate = new Date(begin_date.substr(0,4),begin_date.substr(4,2)-1,begin_date.substr(6,2));
                //@critical 获取结束时间
				var endDate = new Date(end_date.substr(0,4),end_date.substr(4,2)-1,end_date.substr(6,2));
                if(endDate < startDate){
					STM.corporateBill.showAlertMsg('结束时间必须晚于开始时间!');
					return;
				}
				if(((endDate - startDate)/(1000 * 60 * 60 * 24)) > 92){
					STM.corporateBill.showAlertMsg('查询时间必须在92天内!');
					return;
				}
				var lastDate = new Date(end_date.substr(0,4),end_date.substr(4,2)-1,end_date.substr(6,2));
					lastDate.setFullYear(lastDate.getFullYear()-1);
				if(startDate < lastDate){
					STM.corporateBill.showAlertMsg('查询时间必须在一年内!');
					return;
				}
				if(startDate > nowDate){
					STM.corporateBill.showAlertMsg('查询开始时间不能晚于当前时间!');
					return;
				}
				if(endDate > nowDate){
					STM.corporateBill.showAlertMsg('查询结束时间不能晚于当前时间!');
					return;
				}

				
				if(minNo.getValue() && maxNo.getValue() && (parseFloat(minNo.getValue()) > parseFloat(maxNo.getValue()))){
					STM.corporateBill.showAlertMsg('发生额最小值不能大于最大值');
					return;
				}
				
				var jsonData = {};
				
				//var tmp = accountNo.getValue();
				//jsonData.Cst_AccNo = tmp.split("_")[0];
				jsonData.Btch_Vchr_Blg_AccNo = accNo;
				jsonData.Enqr_StDt = begin_date;
				jsonData.Enqr_CODt = end_date;
				jsonData.Rng_Min_Amt = minNo.getValue();
				jsonData.Rng_Max_Amt = maxNo.getValue();
				jsonData.Rprnt_Cnt = data.Rprnt_Cnt;
				jsonData.prevMenu = 'printCBCondtionHF';

				data.conditionData = jsonData;
				
				//@critical 放到第二个界面去做请求交易
				//template.loadPage(data.menu,data);
				//data.Txn_CardNo = data.accNo;
				data.Txn_CardNo = '';
				data.prevMenu = 'printCBCondtionHF';
				if(data.Rprnt_Cnt == '0'){
					template.loadPage("printCBDetailHF",data);
				}else{
					template.loadPage("printPatchCBDetailHF",data);
				}
				
			}
		});

	},
	destroy : function() {
		accNo = '';
	}
}