/**
 * @file 卡类型选择
 * @author ZhangAXiong
 * @version 1.0
 * Last Updated 2021-01-19
 * 回单卡、结算卡、无卡登陆选择页面
 * 1.选择相应的登录方式进行登录
 * 2.无卡登陆只对自助对账菜单进入时起作用，其他菜单进入时隐藏
 */
function cardTypeHF(){

}

//在prototype里渲染各个页面组件
cardTypeHF.prototype = {
	init:function(data){
		if(!data){
			data = {};
		}
		
		// @critical 结算卡
		var ptBtn = new PJF.ui.linkButton({
	        dom: 'ptBtn',
	        style: 'metro',
	        name: '单位<br>结算卡',
	        fontSize: '30',
	        width: '180',
	        height: '180',
	        iconUrl: '/ecpweb/page/stm/common/icon/bill_card_js.png',
	        textColor: 'rgb(0,102,179)',
	        onClick: function() {
	        	var tpData={};
	    		tpData.pwdNextStep = function(args){
	    			var tmpData = {};
	    			tmpData.type = '01';
	    			tmpData.cardNo = PJF.stm.IC_CARD_INFO_COR.resInfo.accountNo;//@critical 结算卡卡号
	    			tmpData.menu = data.menu;
	        		console.log("结算卡卡号：" + tmpData.cardNo);
					STM.corporateBillNew.readCardNext.bizNextStep(tmpData);
					//@critical 经过一次结算卡，那无论下次是结算卡还是回单卡都要进行选卡，清空回单卡号
					if(STM.corporateBill.huiDCardNo){
						STM.corporateBill.huiDCardNo = "";
					}
	        	};
	        	template.loadPage("CPBinsertIcCard", tpData);
	        }
		});
		
		// @critical 回单卡
		var czBtn = new PJF.ui.linkButton({
	        dom: 'czBtn',
	        style: 'metro',
	        name: '单位<br>回单卡',
	        fontSize: '30',
	        width: '180',
	        height: '180',
	        iconUrl: '/ecpweb/page/stm/common/icon/bill_card_hd.png',
	        textColor: 'rgb(0,102,179)',
	        onClick: function() {
				console.log("点击回单卡STM.corporateBill.initT001Param:"+PJF.util.json2str(STM.corporateBill.initT001Param));
	        	template.loadPage('readEmidCardHF', data);
	        }
		});
        // @critical 无卡登陆
        var ncBtn = new PJF.ui.linkButton({
            dom: 'ncBtn',
            style: 'metro',
            name: '无卡<br>登陆',
            fontSize: '30',
            width: '180',
            height: '180',
            iconUrl: '/ecpweb/page/stm/common/icon/bbyqy.png',
            textColor: 'rgb(0,102,179)',
            onClick: function() {
                //@critical 直接进入无卡登陆的列表展示页面
                console.log("进入无卡登陆未回签账单页面，，，");
                template.loadPage('inputAuthCode', data);
                //@critical 无卡登陆  清空有卡操作数据
				STM.corporateBill.initT001Param = null;
				STM.corporateBill.huiDCardNo = null;
            }
        });
        var noCardLog = data.noCardLog;
        console.log(">>>noCardLog:"+noCardLog);
        if(noCardLog == true){
            PJF.html.getDom("ncBtn").style.display = "";
            PJF.html.getDom("czBtn").style.marginRight = "-1.8rem";
        }else{
            PJF.html.getDom("ncBtn").style.display = "none";
        }
		//返回
		var returnBtn = new PJF.ui.linkButton({
		        dom: 'returnBtn',
		        style:'main',
		        name: '返回',
		        onClick: function() {
                    if(data && data.menu && "selfServiceHints" == data.menu){
                        template.loadPage('homepage');
                    }else{
                        template.loadPage('subMenuPage','CPB20008');
                    }

		        }
		});
	},
	destroy:function(){}
}