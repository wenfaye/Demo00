/**
 * @file  对账清单查询条件页面
 * @author ZhangAXiong
 * @version 1.0
 * create
 * Last Updated 2021-01-19
 * 1.查询时间92天内
 * 2.不能大于当前时间
 */
function queryBillListDetailHF() {

}

// 在prototype里渲染各个页面组件
queryBillListDetailHF.prototype = {
	init : function(data) {
		if (!data) {
			return;
		}
		var serverDate = PJF.communication.getServerTime();//@critical 获取服务器时间
		var cardData = [];
		cardData = data.czData;
		
		var accountNo = new PJF.ui.select({
			dom: 'accountNo',
			data: cardData,
			width : 480,
			onChange: function(){}
		}); 
		
		var begin_date = "";
		var end_date = "";
		var selectTime = new PJF.ui.checkbox({
			dom : 'selectTime',
			singleSelect : true,
			data : [ {
				desc : '本月',
				value : '1'
			}, {
				desc : '上月',
				value : '2'
			}, {
				desc : '自定义',
				value : '3'
			} ],
			type : "horizontal",
			onClick : function() {
				if (1 == selectTime.getValue()) {//@critical 本月
					begin_date = serverDate.substr(0,6) + '01';
					end_date = serverDate;
				} else if (2 == selectTime.getValue()) {//@critical 上月
					var nowYear = serverDate.substr(0,4);
					var nowMonth = serverDate.substr(4,2) -1;
					var lastMonth = nowMonth - 1;
					var lastMonthStartDate = new Date(nowYear, lastMonth, 1);
					var nowMonthStartDate = new Date(nowYear, nowMonth, 1);
					var lastDays = (nowMonthStartDate - lastMonthStartDate)/(1000 * 60 * 60 * 24);
					
					begin_date = PJF.util.formatDate(lastMonthStartDate,"yyyyMMdd");
					end_date = PJF.util.formatDate(lastMonthStartDate,"yyyyMM") + '' + lastDays;
				}

				if (3 == selectTime.getValue()) {//@critical 自定义
					document.getElementById('timeId').style.display = '';
				} else {
					document.getElementById('timeId').style.display = 'none';
				}
			}
		});

		var startTime = new PJF.ui.calendar({
            dom : "startTime",
            defaultDate:new Date(serverDate.substr(0,4), serverDate.substr(4,2)-1, serverDate.substr(6,2))
        });
        var endTime = new PJF.ui.calendar({
            dom : "endTime",
            defaultDate:new Date(serverDate.substr(0,4), serverDate.substr(4,2)-1, serverDate.substr(6,2))
        });

		var stateId = new PJF.ui.checkbox({
			dom : 'stateId',
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
			type : "horizontal"
		});
		
		// 返回按钮
		var returnBtn = new PJF.ui.linkButton({
			dom : 'returnBtn',
			style : 'main',
			name : '返回',
			onClick : function() {
				if(data.prevMenu){
					var cardData = {};
					cardData.Txn_CardNo = data.Txn_CardNo;//@critical 卡号
					cardData.ptData = data.ptData;//@critical 普通账户
					cardData.czData = data.czData;//@critical 财资账户
					cardData.menu = data.menu;//@critical 卡号
					template.loadPage(data.prevMenu,cardData);
				} else {
					template.loadPage('subMenuPageNew','CPB20008');
				}
			}
		});

		// @critical 结果页面返回初始化查询页面
		if(null != data && '' != data && data.select_account){
			accountNo.setValue(data.select_account);
			selectTime.setValue(data.SELECT_FLAG);
			if(3 == data.SELECT_FLAG){
				document.getElementById('timeId').style.display = '';
				startTime.setValue(new Date(data.StDt.substr(0,4), data.StDt.substr(4,2)-1, data.StDt.substr(6,2)));
				endTime.setValue(new Date(data.CODt.substr(0,4), data.CODt.substr(4,2)-1, data.CODt.substr(6,2)));
			} else {
				begin_date = data.StDt;
				end_date = data.CODt;
			}
			stateId.setValue(data.STATE_FLAG);
		} else {
			stateId.setValue('2');
			selectTime.setValue('1');
			begin_date = serverDate.substr(0,6) + '01';
			end_date = serverDate;
		}
		
		//@critical 请设置查询条件，点击确认查询
		PJF.communication.player.PlaySoundByUrl("app/corporateBill/01.wav");
		
		// 确认按钮
		var confirmBtn = new PJF.ui.linkButton({
			dom : 'confirmBtn',
			style : 'main',
			appendStyle : 'confirm',
			name : '确认',
			onClick : function() {
				begin_date = 3 == selectTime.getValue() ? startTime.getValue()
						: begin_date;
				end_date = 3 == selectTime.getValue() ? endTime.getValue() : end_date;

				if(3 == selectTime.getValue()){
					var nowTime = serverDate;
					var nowDate = new Date(nowTime.substr(0,4), nowTime.substr(4,2)-1, nowTime.substr(6,2));
					//@critical 获取开始时间
					var startDate = begin_date;
					
					//@critical 获取结束时间
					var endDate = end_date;
					if(endDate < startDate){
						STM.corporateBill.showAlertMsg('结束时间必须晚于开始时间!');
						return;
					}
					if(((endDate - startDate)/(1000 * 60 * 60 * 24)) > 92){
						STM.corporateBill.showAlertMsg('查询时间必须在92天内!');
						return;
					}
					var lastDate = new Date(end_date);
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
					begin_date = PJF.util.formatDate(begin_date,"yyyyMMdd");
					end_date = PJF.util.formatDate(end_date,"yyyyMMdd");
				}
				
				var jsonData = {};
				
				jsonData.select_account = accountNo.getValue();
				var tmp = accountNo.getValue().split("_");
				jsonData.Cst_AccNo = tmp[0];
				jsonData.TpCd = tmp[1];//@critical 账户类型：1-普通活期；2-普通定期；3-普通贷款；4-财资账户
				jsonData.Acc_AccNm = tmp[2];//账户名称
				jsonData.accountType = data.accountType;//@critical 0-普通账户，1-财资账户（全量明细），2-财资账户（过滤明细），3-财资账户（对账单）
				jsonData.StDt = begin_date;
				jsonData.CODt = end_date;
				jsonData.Prt_Ind = (2 == stateId.getValue())?'':stateId.getValue()[0];
				//jsonData.Cur_Pg_CD = '1';
				jsonData.SELECT_FLAG = selectTime.getValue();
				jsonData.STATE_FLAG = stateId.getValue();
				jsonData.Txn_CardNo = data.Txn_CardNo;
				jsonData.CCBIns_ID = PJF.roleInfo.orgCode;
				
				jsonData.ptData = data.ptData;
				jsonData.czData = data.czData;
				jsonData.prevMenu = data.prevMenu;
				jsonData.menu = data.menu;

				//@critical 放到第二个界面去做请求交易
				template.loadPage("queryBillListResultHF",jsonData);
			}
		});

	},
	destroy : function() {
	}
}