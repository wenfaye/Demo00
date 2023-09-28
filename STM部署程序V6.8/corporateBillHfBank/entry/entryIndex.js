function entryIndex() {
}
var logoutFlag ;
var seconds = 120;
//var seconds = 1200000;
entryIndex.prototype = {
		init : function(data) {
			
			/*function eventHander(){
				console.log('eventHander');
				clearTimeout(logoutFlag);
				logoutFlag = setTimeout(function(){
					clearTimeout(logoutFlag);
					console.log(seconds + '秒未操作');
					STM.corporateBill.curAccount = null;
					STM.corporateBill.Txn_CardNo = null;
					delete STM.corporateBill.Cst_AccNo_Nm;
					template.loadPage("emidCardNo");
				},seconds*1000);
			}
			$(document).delegate('.stm-btn','click',eventHander);*/
			
			window.eventHander = function (){
				clearTimeout(logoutFlag);
				console.log('click keyup',logoutFlag);
				
				logoutFlag = setTimeout(function(){
					console.log(seconds + '秒未操作');
					clearTimeout(logoutFlag);
					STM.corporateBill.curAccount = null;
					STM.corporateBill.Txn_CardNo = null;
					delete STM.corporateBill.Cst_AccNo_Nm;
					//window.removeEventListener('click',function(e){console.log('click');template.loadPage("emidCardNo");},true);
					template.loadPage("emidCardNo");
				},seconds*1000);
			}
			
			/*
			$(document).delegate('.stm-btn','click',window.eventHander);
			
			logoutFlag = setTimeout(function(){
				console.log(seconds + '秒未操作');
				clearTimeout(logoutFlag);
				STM.corporateBill.curAccount = null;
				STM.corporateBill.Txn_CardNo = null;
				delete STM.corporateBill.Cst_AccNo_Nm;
				//window.removeEventListener('click',function(e){console.log('click');template.loadPage("emidCardNo");},true);
				template.loadPage("emidCardNo");
			},seconds*1000);*/
			
			//keyup
			/*if(window.addEventListener){
				
				//touchstart
				window.addEventListener('click',window.eventHander,false);
				//window.addEventListener('keyup',window.eventHander,false);
			}else if(window.attachEvent){
				window.attachEvent('onclick',window.eventHander);
				//window.attachEvent('onkeyup',window.eventHander);
			}
			
			logoutFlag = setTimeout(function(){
				STM.corporateBill.curAccount = null;
				STM.corporateBill.Txn_CardNo = null;
				delete STM.corporateBill.Cst_AccNo_Nm;
				template.loadPage("emidCardNo");
			},seconds*1000);*/
			
			data = data || {};
			var accType = '1';
			var cstNm = '';
			if(data.accNo && data.accNo.length){
				
				/*var sendA0782D520Data = {
					Cst_Accno: data.accNo
				}
				
				PJF.communication.cpsJsonReq({
					fwServiceId: "simpleTransaction",
					fwTranId: "A0782D520-HF",
					maskAll: true,
					async: false,
					jsonData: PJF.util.json2str(sendA0782D520Data),
					success: function (resData) {
						console.log('A0782D520 success:' + resData.Acc_Tp_ID + ',' + resData.Cst_AccNo_Nm);
						accType = resData.Acc_Tp_ID;
						cstNm = resData.Cst_AccNo_Nm;
					},
					failure: function (arg) {
						STM.corporateBill.showAlertMsg(arg.BK_DESC);
						console.log('A0782D520交易失败。账号：'+ data.accNo +'<br>全局跟踪号:'+arg._COMMON.SYS_EVT_TRACE_ID
                        		+'，错误码:'+arg.BK_CODE+'，错误描述:'+arg.BK_DESC);
					}
				});*/
				
			}
			STM.corporateBill.Txn_CardNo = '';
			
			var balanceQueryBtn = new PJF.ui.linkButton({
		        dom: 'balanceQueryBtn',
		        style: 'metro',
		        name: '余额查询',
		        fontSize: '30',
		        width: '180',
		        height: '180',
		        textColor: 'rgb(0,102,179)',
		        iconUrl: '/ecpweb/page/stm/common/icon/bill_card_js.png',
		        onClick: function() {
		        	data.param = {};
		        	data.param.accNo = data.accNo;
		        	data.param.accType = accType;
		        	template.loadPage('CPBBalanceResultHF',data);
		        	}
		        });
			
			var printCBDetailBtn = new PJF.ui.linkButton({
		        dom: 'printCBDetailBtn',
		        style: 'metro',
		        name: '回单查询打印',
		        fontSize: '30',
		        width: '180',
		        height: '180',
		        textColor: 'rgb(0,102,179)',
		        onClick: function() {
		        	//data.Rprnt_Cnt = '00';
		        	template.loadPage('printCBCondtionHF',{
		        		accNo:data.accNo,
		        		Rprnt_Cnt: '0'
		        	});
		        	//printCBDetailNew Rprnt_Cnt: '00'
		        	}
		        });
			
			var printPatchCBDetailBtn = new PJF.ui.linkButton({
		        dom: 'printPatchCBDetailBtn',
		        style: 'metro',
		        name: '回单查询补打',
		        fontSize: '30',
		        width: '180',
		        height: '180',
		        textColor: 'rgb(0,102,179)',
		        onClick: function() {
		        	data.Rprnt_Cnt = '99';
		        	template.loadPage('printCBCondtionHF',data);//printCBDetailNew 00-全部 99-补打 其他数字直接查询打印次数为输入数字
		        	}
		        });
			
			var ledgerPageDetailQueryBtn = new PJF.ui.linkButton({
		        dom: 'ledgerPageDetailQueryBtn',
		        style: 'metro',
		        name: '分户账打印',
		        fontSize: '30',
		        width: '180',
		        height: '180',
		        textColor: 'rgb(0,102,179)',
		        onClick: function() {
		        	template.loadPage('ledgerPageDetailQueryHF',data);
		        	}
		        });
			
			var balanceSelfBtn = new PJF.ui.linkButton({
		        dom: 'balanceSelfBtn',
		        style: 'metro',
		        name: '自助机具银企对账',
		        fontSize: '30',
		        width: '180',
		        height: '180',
		        textColor: 'rgb(0,102,179)',
		        onClick: function() {
		        	data.accType = accType;
		        	data.cstNm = cstNm;
		        	template.loadPage('balanceSelfHF',data);
		        	}
		        });
			
			var pwdChangeBtn = new PJF.ui.linkButton({
		        dom: 'pwdChangeBtn',
		        style: 'metro',
		        name: '密码修改',
		        fontSize: '30',
		        width: '180',
		        height: '180',
		        textColor: 'rgb(0,102,179)',
		        onClick: function() {
		        	data.emidCardNo = data.accNo;
		        	data.menu = 'pwdChange';
		        	template.loadPage('inputEmidCardPwdHF',data);
		        	}
		        });
			
			var queryCBDetailBtn = new PJF.ui.linkButton({
		        dom: 'queryCBDetailBtn',
		        style: 'metro',
		        name: '明细查询打印',
		        fontSize: '30',
		        width: '180',
		        height: '180',
		        textColor: 'rgb(0,102,179)',
		        onClick: function() {
		        	template.loadPage('queryCBDetailHF',{
		        		accNo:data.accNo,
		        		accountType: '0',
		        		prevMenu:'entryIndex'
		        	});//queryCBDetailHF
		        	}
		        });
			
			var scanningBtn = new PJF.ui.linkButton({
		        dom: 'scanningBtn',
		        style: 'metro',
		        name: '回单验证',
		        fontSize: '30',
		        width: '180',
		        height: '180',
		        textColor: 'rgb(0,102,179)',
		        onClick: function(event) {
		        	console.log(event)
		        	template.loadPage('validatorCBIndex',data);
		        	}
		        });

			
		},
		
		destroy : function() {
			//clearTimeout(logoutFlag);
		}
		
}