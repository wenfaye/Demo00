function emidCardPwd() {
}

emidCardPwd.prototype = {
		init : function(data) {
			data = data || {};
			
			
			var passwordStr = '';
			var sendData = {};
			//密码
			var inputPwd = new PJF.ui.password({
				dom:'inputPwdDiv',
				//encryptType: 'base64',
				success : function(pwd){
					passwordStr = pwd;
					console.log('emidCardPwd:》》》》》',passwordStr,pwd);
			    },
			    failure : function(errorCode){
					var messageBox = new PJF.ui.messageBox({
						title: "提示信息",
						content: errorCode.errorMsg || '设备故障,请重新输入密码',
						buttonConfs: [{
							bgColor: 'blue',
							name: '输入密码',
							style:'main',
							width: 200,
							height: 80,
							onClick: function() {
								inputPwd.triggerReadCard();
							}
						},{
							bgColor: 'rgb(121,198,30)',
							name:'返回首页',
							style:'main',
							width: 200,
							height: 80,
							onClick: function() {
								//PJF.stm.ICMaker.ejectCard(function(){
									template && template.loadPage('homepage');
								//});
							}
						}]
					});
					console.log("emidCardPwd.js读取密码错误，错误信息为：" + JSON.stringify(errorCode));
			    }
					/*
				labelText: '密码：',
				textWidth:"188px",
				textBt : '验密',
				readOnly:true,
				textRequired:true,
				//disabled:true,
				times:'1',
				textOnBlur:function(){},
				successful : function(result){
					
			    },
			    failure : function(result){
				    return ;
			    }*/
			});
			
			//返回
	        var returnBtn = new PJF.ui.linkButton({
	            dom: 'backBtn',
	            name: '返回',
	            style: 'main',
	            onClick: function () {
	            	
	            	//template.loadPage('emidCardNo', 'CPB20008');data.accNo
	            	/*template.loadPage('emidCardNo');*/
	            	
	            	template.loadPage('emidCardNo',{
	            		accNo:data.accNo
	            	});
	            	/*STM.corporateBill.curAccount = data.accNo;
	            	STM.corporateBill.Txn_CardNo = data.accNo; 
	            	template.loadPage('entryIndex',data);*/
	            }
	            	
	                
	        });
	        
	        //确认
	        var confirmBtn = new PJF.ui.linkButton({
	            dom: 'confirmBtn',
	            style : 'main',
				appendStyle : 'confirm',
		        name: '确认',
		        fontSize: '30',
	            onClick: function () {
	            	//template.loadPage('entryIndex','CPB20008');
	            	//template.loadPage('entryIndex',data);
	            	//passwordStr = '888888';
	            	//passwordStr = 'NjY2NjY2';
	            	/*if(inputPwd && inputPwd.inputText1 && inputPwd.inputText1.value && inputPwd.inputText1.value.length){
	            		passwordStr = inputPwd.inputText1.value;
	            		console.log(99,passwordStr);
	            	}*/
	            	
	            	if(passwordStr.length){
	            		/*if(passwordStr.length == 6){
	            		/*sendData.Eqmt_Land_Pswd = passwordStr;
	            		sendData.Btch_Vchr_Blg_AccNo = data.accNo;*/
	            	if(passwordStr.length >= 6){
	            		sendData.DbCrd_MsgRp_Ecrp_Pswd = passwordStr;
	            		sendData.Btch_Vchr_Blg_AccNo = data.accNo;
	            		PJF.communication.cpsJsonReq({
							fwServiceId: "simpleTransaction",
							fwTranId: "A07824616-HF",
							maskAll: true,
							async: false,
							jsonData: PJF.util.json2str(sendData),
							success: function (resData) {
								
								if(resData && resData.Mnplt_StCd){
									if(resData.Mnplt_StCd == '00'){
										STM.corporateBill.curAccount = data.accNo;
										STM.corporateBill.Txn_CardNo = data.accNo; 
										template.loadPage('entryIndex',data);
									}
									else{
										STM.corporateBill.showAlertMsg('账号或密码错误!');
										console.log('账号或密码错误:'+ PJF.util.json2str(resData));
									}
								}
							},
							failure: function (arg) {
								STM.corporateBill.showAlertMsg(arg.BK_DESC);
								console.log('A07824616交易失败。账号：'+data.accNo+'<br>全局跟踪号:'+arg._COMMON.SYS_EVT_TRACE_ID
                                		+'，错误码:'+arg.BK_CODE+'，错误描述:'+arg.BK_DESC);
							}
						});
	            	}else{
	            		STM.corporateBill.showAlertMsg('请输入正确的密码!');
	            	}
	            	}else{
	            		STM.corporateBill.showAlertMsg('请输入密码!');
	            	}
	            }
	        });
		},
		destroy : function() {
		}
}