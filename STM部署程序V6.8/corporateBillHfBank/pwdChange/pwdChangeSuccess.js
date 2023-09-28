/**
 * @file pwdChangeSuccess
 * @author ZhangAXiong
 * @version 1.0
 * create 2020-01-25
 * Last Updated 2021-01-29
 * 回单卡密码修改成功
 * 打印回执
 */
function pwdChangeSuccess() {
}

pwdChangeSuccess.prototype = {
    /**
     * @function initUI
     * @param {Object}data.printData 打印数据
     * 根据打印数据拼接打印信息
     */
    initUI: function (data) {

        var _self = this;
        
/*        if (!data) {
        	data = {};
        	data.printData = [];
        	data.printData.push([
	                        "回单卡卡卡号：",
	                        "业务内容：回单卡密码修改",
	                        "业务结果：成功",
	                        "交易流水号："]);
        }*/

        var hasSuccess = data.printData.length > 0;
        
		var logoutBtn = new PJF.ui.linkButton({
	        dom: 'logoutBtn',
	        style : 'main',
	        name: '退出',
	        onClick: function() {
				
				new PJF.ui.messageBox({
					title: "提示信息",
					content: '您确认退出?',
					buttonConfs: [{
						appendStyle: 'confirm',
		                style: 'main',
		                name: '确认',
		                width: 200,
		                height: 80,
		                onClick:function () {
		                	STM.corporateBill.curAccount = null;
							STM.corporateBill.Txn_CardNo = null;
							delete STM.corporateBill.Cst_AccNo_Nm;
							$('div[id=billNavbtn]').remove();
							$('.template_navbtn').show();
							if(window.logoutFlag){
								clearTimeout(window.logoutFlag);
							}
							template.loadPage("homepage");
		                }
					},{
						appendStyle: 'confirm',
						style: 'main',
						name: '取消',
						width: 200,
		                height: 80,
						onClick:function(){console.log('点击时间:'+(new Date().toString()));}
					}]						
				});
	        	
	        	}
	        });

        window.transNotPrint = new PJF.ui.linkButton({
            dom: 'transNotPrint',
            name: (hasSuccess ? '不打印回执' : '确认'),
            style: 'main',
            appendStyle: (hasSuccess ? '' : 'confirm'),
            onClick: function() {
            	window.removeEventListener('click',window.eventHander,false);
        		if(window.logoutFlag){
        			$('div[id=billNavbtn]').remove();
        			$('.template_navbtn').show();
        			clearTimeout(window.logoutFlag);
        		}
            	var args = {};
				template.loadPage('isConTrading',args);
            }
        });
        
        hasSuccess && new PJF.ui.linkButton({
            dom: 'dbTransPrint',
            name: '打印回执',
            style: 'main',
            appendStyle:'confirm',
            //bgColor: 'rgb(189,96,164)',
            onClick: function() {
                PJF.stm.ReceiptPrinter.doPrint({
                    pchContent: _self.buildPrintData(data.printData, data.tradName),
                    timeout: 50
                }, function() {
                    // 回调
                    var args = {};
    				template.loadPage('isConTrading',args);
                });
            }
        });
        
        PJF.html.content("printView", this.bulidSnapshot(data.printData, data.tradName));
        PJF.html.content("userCode", PJF.userInfo.userCode);
		PJF.html.content("time", PJF.communication.getServerTime("yyyy年MM月dd日HH时mm分ss秒"));
		PJF.html.content("content",'您的回单卡密码修改业务已成功！');
		PJF.html.content("orgName",PJF.roleInfo.orgName);		
    },

    init: function (data) {
        this.initUI(data);
    },

    destroy: function () {

    },
    /**
     * @function bulidSnapshot
     * @param {Object}d 打印数据
     * @param cont
     * @returns {string} 返回拼接信息
     */
    bulidSnapshot: function(d, cont) {
        var str = "";
        //@critical 拼接字符串
        str += d.map(function(dv, i) {
            return dv.map(function(v) {
                    return "<p>" + v + "</p>";
                }).join("");
        }).join("");
        return str;
    },
    /**
     * @function buildPrintData
     * @param {Object}d 打印数据
     * @param cont
     * @returns {string} 生成打印字符串
     */
    buildPrintData: function(d, cont) {
    	var vhrContent = [];
    	//@critical 循环打印数据
		 d.forEach(function(dv, i) {
		     dv.forEach(function(v) {
		    	 vhrContent.push({content: v, bold: false, indent: true});
		     });
		 });
		 //@critical 调用公共的生成打印字符串方法
        return PJF.util.genPrintContent(vhrContent);
    }
};