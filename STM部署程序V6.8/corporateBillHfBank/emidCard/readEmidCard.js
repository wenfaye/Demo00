/**
 * @file  读取回单卡
 * @author ZhangAXiong
 * @version 1.0
 * Create On
 * Last Updated 2021-01-19
 * 1.根据前一次读取的回单卡卡号，判断是否是同一回单卡
 * 2.是同一回单卡则跳过密码输入环节
 * 3.不是同一回单卡则进入密码输入环节
 * 4.设备故障则返回首页
 *
 */
function readEmidCardHF(){
	
}
readEmidCardHF.prototype={
	//初始化刷回单卡组件
	init:function(data){
        PJF.communication.player.SpeekText("请放置您的回单卡",100);
		var data = data || {};
		PJF.stm.EMD.getCardNum({loadingConf:{noLayer:true}},function(result){
			if('1' == result.status){
                data.emidCardNo = result.info.pchCardNum;
				if(data.emidCardNo == STM.corporateBill.huiDCardNo){
					console.log("30秒读取回单卡之后是同一回单卡号");
					//@critical 确保参数不会为空，T001交易不会报错
					console.log("STM.corporateBill.initT001Param:"+PJF.util.json2str(STM.corporateBill.initT001Param));
					if(!STM.corporateBill.initT001Param) {
						console.log("30秒读取回单卡之后初始T001参数为空，继续输入密码，，");
						template.loadPage('inputEmidCardPwdHF', data);
					}else{
						//@critical 回单卡再次进入，更新菜单
						console.log("30秒读取回单卡之后同一回单卡再次办理其他业务的初始参数值："+PJF.util.json2str(STM.corporateBill.initT001Param));
						STM.corporateBill.initT001Param.menu = data.menu;
						STM.corporateBillNew.readCardNext.bizNextStep(STM.corporateBill.initT001Param);
					}
				}else{
					console.log("不是同一回单卡号，则继续输入密码");
					template.loadPage('inputEmidCardPwdHF', data);
				}
			} else {
				var messageBox = new PJF.ui.messageBox({
					title: "提示信息",
					content: '设备故障,读取回单卡失败',
					buttonConfs: [{
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
				console.log("readEmidCard.js读取回单卡失败，错误信息为：" + JSON.stringify(result));
			}
		});
	}
}