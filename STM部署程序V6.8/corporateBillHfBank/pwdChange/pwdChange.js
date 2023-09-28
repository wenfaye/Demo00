/**
 * @file pwdChange
 * @author ZhangAXiong
 * @version 1.0
 * create 2020-01-25
 * Last Updated 2021-01-29
 * 回单卡密码修改
 */
function pwdChange() {

}

pwdChange.prototype = {
	$this: this,
	init: function (data) {
		$this = this;
		if (!data) {
			data = {};
		}
		var type = data.type;
		type = '02';
		//测试数据type = '01'
		//type = '02';
		if (type) {
			//@critical 01-结算卡 跳转结算卡修改密码页面
			if ('01' == type) {
				PJF.stm.menuInterceptor.menuCPB30006CallBack();
			}
			if ('02' == type) {
				//02-回单卡 进行密码修改
				$this.initUI(data);
			}
		}

	},
    /**
     * @function $this.initUI(data);
     * @param {Object}data
     * @param {String}data.Txn_CardNo_KaNei 卡内号
     * @param {String}data.base64 旧密码
     * @param {String}data.Txn_CardNo 卡外号
     * 外设读取回单卡，进行修改密码
     */
	initUI: function (data) {
		var _newPassWord = '';
		var json = {};
		json.Txn_CardNo = data.Txn_CardNo_KaNei;//@critical 卡内号
		json.Ori_Pswd = data.base64;//@critical 旧密码
		json.Txn_CardNo_KaWai = data.Txn_CardNo;//@critical 卡外号，记录流水号需要
		var sendA07824617Data = {
			//Btch_Vchr_Blg_AccNo: data.accNo,
			Btch_Vchr_Blg_AccNo: data.Txn_CardNo_KaNei,
			//Ctfn_Pswd:data.base64
			DbCrd_MsgRp_Ecrp_Pswd:data.base64,
			Fdbk_Chnl_ID: 0,
			Sel_Sign_Ind: 0
		};
		var inputPwd = new PJF.ui.password({
			dom: 'newFirstPwd',
			//encryptType: 'base64',
			//loadingConf: { noLayer: true },//倒计时遮罩也可以点击返回
			isCheckPwd: true,//输入两次密码，会校验密码复杂度
			success: function (password) {
				console.log(63,password);
				_newPassWord = password;//成功返回加密后的密码
			},
			failure: function (result) {
				var msg = '';
				_newPassWord = null;
					if(result.wrongPwd == true){//密码输入错误
						msg = '两次密码输入不一致，请重新输入';
						STM.corporateBill.showAlertMsg(msg);
					}else if(result.notStrPwd == true){//密码太简单
						msg = '密码太简单，请重新输入';
						STM.corporateBill.showAlertMsg(msg);
					}else{
						//其余情况为外设出错
						var messageBox = new PJF.ui.messageBox({
							title: "提示信息",
							content: result.errorMsg || '设备故障,请重新输入密码',
							buttonConfs: [{
								bgColor: 'blue',
								name: '输入密码',
								style: 'main',
								width: 200,
								height: 80,
								onClick: function () {
									inputPwd.triggerReadCard();
								}
							}, {
								bgColor: 'rgb(121,198,30)',
								name: '返回首页',
								style: 'main',
								width: 200,
								height: 80,
								onClick: function () {
									//返回首页
									template.loadPage('homepage');
								}
							}]
						});	
					}
					
				console.log("pwdChange.js修改密码错误，错误信息为：" + JSON.stringify(result));
				//console.log("pwdChange.js修改密码错误，错误信息为：" + JSON.stringify(errorCode));
			}
		});
		//返回
		var returnBtn = new PJF.ui.linkButton({
			dom: 'returnBtn',
			bgColor: 'blue',
			name: '返回',
			style: 'main',
			onClick: function () {
				//template.loadPage('subMenuPage', 'CPB20008');
				if(data.menu){
					template.loadPage(data.menu, data);
				}else{
					template.loadPage('entryIndex', {accNo:data.accNo});
				}
			}
		});
		//确认
		var confirmBtn = new PJF.ui.linkButton({
			dom: 'confirmBtn',
			bgColor: 'blue',
			name: '确认',
			style: 'main',
			appendStyle: 'confirm',
			onClick: function () {
				//_newPassWord = '888888';
				if (!_newPassWord) {
					return;
				} else {
					//发起交易
					//json.New_Pswd = _newPassWord;//@critical 请设置新的密码
					sendA07824617Data.DbCrdMsgRpEcrpNewPswd = _newPassWord;//@critical 请设置新的密码
					console.log(136,PJF.util.json2str(sendA07824617Data));
					PJF.communication.cpsJsonReq({
						fwServiceId: "simpleTransaction",
						//fwTranId: "A0782T018-stm",
						fwTranId: "A07824617-HF",
						maskAll: true,
						async: false,
						jsonData: PJF.util.json2str(sendA07824617Data),
						success: function (responseData) {
						    //@critical 修改密码成功之后，再次进入账单自助就需要重新登录了
							if(STM.corporateBill.huiDCardNo){
								STM.corporateBill.huiDCardNo = "";
							}
							if(responseData.BK_STATUS == '00'){
								var printData = [];
								printData.push([
									"回单卡卡号："+data.Txn_CardNo_KaNei,
									"业务内容：回单卡密码修改",
									"业务结果：成功",
									"交易流水号：" + responseData._COMMON.SYS_EVT_TRACE_ID
								]);
								console.log('回单卡密码修改成功');
								template.loadPage('pwdChangeSuccess', {
									printData: printData,
									tradName: '密码修改'
								});
							}
							
							/*
							if ('00' == responseData.Mnplt_StCd) {
								//@critical 修改成功，跳转成功页面
								var printData = [];
								printData.push([
									"回单卡卡号：" + STM.transfer.util.hideCardNo(data.Txn_CardNo),
									"业务内容：回单卡密码修改",
									"业务结果：成功",
									"交易流水号：" + responseData._COMMON.SYS_EVT_TRACE_ID
								]);
								console.log('回单卡密码修改成功');
								template.loadPage('pwdChangeSuccess', {
									printData: printData,
									tradName: '密码修改'
								});
							} else {
								//@critical 原密码不正确，修改失败，返回首页（这都是经过验密进来的，所以应该不会有01）
								//template.loadPage('homepage');
								var messageBox = new PJF.ui.messageBox({
									title: "提示信息",
									content: '原密码不正确，修改失败',
									buttonConfs: [{
										bgColor: 'blue',
										name: '输入密码',
										style: 'main',
										width: 200,
										height: 80,
										onClick: function () {
											inputPwd.triggerReadCard();
										}
									}, {
										bgColor: 'rgb(121,198,30)',
										name: '返回首页',
										style: 'main',
										width: 200,
										height: 80,
										onClick: function () {
											//返回首页
											template.loadPage('homepage');
										}
									}]
								});
							}*/

						},
						failure: function (responseData) {
							var msgBox = new PJF.ui.errorMessageBox({
								data: responseData,
								buttonConfs: [{
									name: '确定',
									style: 'main',
									appendStyle: 'confirm',
									onClick: function () {
										//template.loadPage('subMenuPage', 'CPB20008');//返回菜单页面
										if(data.menu){
											template.loadPage(data.menu, data);
										}else{
											template.loadPage('entryIndex', {accNo:data.accNo});
										}
									}
								}]
							});
						}
					});
				}
			}
		});
	},

	destroy: function () {

	}
}