/**
 * @file  回单卡密码输入
 * @author ZhangAXiong
 * @version 1.0
 * Create On
 * Last Updated 2021-01-19
 * 密码输入错误三次返回首页
 */
function inputEmidCardPwdHF(){
	
}
inputEmidCardPwdHF.prototype={
		//初始化插入银行卡组件
		init:function(data){
			var wrongTime = 0;
			if (!data) {
				data = {};
			}
			/*var tmpData = {};
	    	tmpData.cardNo = data.emidCardNo;
	    	tmpData.base64 = '888888';// @critical 回单卡需要
	    	tmpData.type = '02';// @critical 01-结算卡，02-回单卡
	    	tmpData.menu = data.menu;
	    	tmpData.emidFailure = function(bk_desc) {
	    		console.log("错误信息："+bk_desc);
				wrongTime++;
				// @critical 输错3次吐卡
				if(wrongTime == 3){
					console.log('回单卡连续输错三次密码');
					var messageBox = new PJF.ui.messageBox({
						title: "提示信息",
						content: '连续输错密码三次，退回首页',
						buttonConfs: [{
							bgColor: 'rgb(121,198,30)',
							name:'返回首页',
							style:'main',
							width: 200,
							height: 80,
							onClick: function() {
								template && template.loadPage('homepage');
							}
						}]
					});
					return;							
				} else {
				    // @critical 20201114后台转义提示
                    var conTip = '';
                    if(!bk_desc){
                        conTip = '密码输入错误，请重新输入6位密码。';
                    }else{
                        conTip =bk_desc + '，请重新输入6位密码。';
                    }
					var messageBox = new PJF.ui.messageBox(
                        {content:conTip ,
                        style:'warning',
						buttonConfs:[{
						bgColor: 'blue',
						name: '输入密码',
						style:'main',
						width: 200,
						height: 80,
						onClick: function() {
							inputPwd.triggerReadCard();
						}
					},{
						bgColor: 'red',
						name: '返回首页',
						style:'main',
						width: 200,
						height: 80,
						onClick: function() {
							template && template.loadPage('homepage');
						}
					}]
					})
				}
			}
			STM.corporateBillNew.readCardNext.bizNextStep(tmpData);*/
			
			var inputPwd = new PJF.ui.password({
				dom:"inputPwdDiv",
				//encryptType: 'base64',
				//encryptType: 'e2e',
				success:function(pwd){
					data.PSWD = pwd;
					console.log('》》》》》password-test:》》》》》'+pwd);
					//console.log('》》》》》读取回单卡成功》》》》》卡号：' + data.emidCardNo);
					var tmpData = {};
			    	tmpData.cardNo = data.emidCardNo;
			    	tmpData.base64 = pwd;// @critical 回单卡需要
			    	//tmpData.base64 = '888888';
			    	tmpData.type = '02';// @critical 01-结算卡，02-回单卡
			    	tmpData.menu = data.menu;
			    	tmpData.emidFailure = function(bk_desc) {
			    		console.log("错误信息："+bk_desc);
						wrongTime++;
						// @critical 输错3次吐卡
						if(wrongTime == 3){
							console.log('回单卡连续输错三次密码');
							var messageBox = new PJF.ui.messageBox({
								title: "提示信息",
								content: '连续输错密码三次，退回首页',
								buttonConfs: [{
									bgColor: 'rgb(121,198,30)',
									name:'返回首页',
									style:'main',
									width: 200,
									height: 80,
									onClick: function() {
										template && template.loadPage('homepage');
									}
								}]
							});
							return;							
						} else {
						    // @critical 20201114后台转义提示
                            var conTip = '';
                            if(!bk_desc){
                                conTip = '密码输入错误，请重新输入6位密码。';
                            }else{
                                conTip =bk_desc + '，请重新输入6位密码。';
                            }
							var messageBox = new PJF.ui.messageBox(
                                {content:conTip ,
                                style:'warning',
								buttonConfs:[{
								bgColor: 'blue',
								name: '输入密码',
								style:'main',
								width: 200,
								height: 80,
								onClick: function() {
									inputPwd.triggerReadCard();
								}
							},{
								bgColor: 'red',
								name: '返回首页',
								style:'main',
								width: 200,
								height: 80,
								onClick: function() {
									template && template.loadPage('homepage');
								}
							}]
							})
						}
					}
					STM.corporateBillNew.readCardNext.bizNextStep(tmpData);
				},
				failure:function(errorCode){
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
					console.log("inputEmidCardPwd.js读取密码错误，错误信息为：" + JSON.stringify(errorCode));
				}
			});
		},
		destory:function(){
			inputPwd.destory();
		}
}