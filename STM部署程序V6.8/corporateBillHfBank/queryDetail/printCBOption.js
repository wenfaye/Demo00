/**
 * @file 选择打印条件页面
 * @authorZhangAXiong
 * @version 1.0
 * Last Updated 2021-01-19
 *  选择打印条件页面
 * 没有使用
 */
function printCBOptionHF() {

}

// 在prototype里渲染各个页面组件
printCBOptionHF.prototype = {
	init : function(data) {
		var json = {};
		var sum = '';
		var page = '';
		var cbpagesum = '';
		var flag = -1;
		if(data){
			json = data.tdata;
			sum = parseInt(data.sum);
			page = parseInt(data.page);
			cbpagesum = (sum % page == 0)?sum / page:(Math.floor(sum / page))+1;
		}
		PJF.html.content('cbsum',sum);//@critical 总条数
		PJF.html.content('cbpagesum',cbpagesum);//@critical 总页数
		
		var minPage = new PJF.ui.textfield({
			dom : 'minPage',
			width : 180,
			onFocus : function() {
				flag = 1;
				if (null == minPage.getValue() || '' == minPage.getValue()) {
					cardNO_Board.setValue('');
				} else {
					cardNO_Board.setValue(minPage.getValue());
				}
			}
		});

		var maxPage = new PJF.ui.textfield({
			dom : 'maxPage',
			width : 180,
			onFocus : function() {
				flag = 2;
				if (null == maxPage.getValue() || '' == maxPage.getValue()) {
					cardNO_Board.setValue('');
				} else {
					cardNO_Board.setValue(maxPage.getValue());
				}
			}
		});

		// @critical 输入卡号键盘
		var cardNO_Board = new PJF.ui.virtualKeyboard({
			dom : 'cardNO_Board',
			onClick : function() {
				if (-1 == flag) {
					STM.corporateBill.showAlertMsg("请先定位要输入的文本框");
				} else if (1 == flag) {
					if (cardNO_Board.getValue().length < 5) {
						minPage.setValue(cardNO_Board.getValue());
					}
				} else if (2 == flag) {
					if (cardNO_Board.getValue().length < 5) {
						maxPage.setValue(cardNO_Board.getValue());
					}
				}
			}
		});

		// 返回按钮
		var returnBtn = new PJF.ui.linkButton({
			dom : 'returnBtn',
			style : 'main',
			name : '返回',
			onClick : function() {
				template.loadPage('queryCBResultHF',json);
			}
		});

		// 确认按钮
		var confirmBtn = new PJF.ui.linkButton({
			dom : 'confirmBtn',
			style : 'main',
			appendStyle : 'confirm',
			name : '确认',
			onClick : function() {
				var innerNos = '';
				var min = parseInt(minPage.getValue());
				var max = parseInt(maxPage.getValue());
				if(min > max) {
					STM.corporateBill.showAlertMsg("页码最小值不能大于最大值！");
				} else if((max - min) >2) {
					STM.corporateBill.showAlertMsg("页码间的差值不能大于2！");
				} else {
					for(var i=min; i<=max; i++){
						json.PAGE_NO = i;
						PJF.communication.cpsJsonReq({
							fwServiceId : "simpleTransaction",
							fwTranId : "CMSB00001-stm",
							maskAll : true,
							async : false,
							jsonData : PJF.util.json2str(json),
							success : function(responseData) {
								if(responseData.Record){
									if(responseData.Record.length){
										for(var i=0;i<responseData.Record.length;i++){
											if(responseData.Record[i].INNER_NO){
												innerNos += responseData.Record[i].INNER_NO + ',';
											}
										}
									} else {
										if(responseData.Record.INNER_NO){
											innerNos += responseData.Record.INNER_NO + ',';
										}
									}
								}
							},
							failure : function(responseData) {
								STM.corporateBill.showErrorMsg(responseData, '打印出错！');
								return;
							}
						});
					}
				}
				
				if('' != innerNos){
					innerNos = innerNos.substring(0, innerNos.length -1);
					STM.corporateBill.jsonCMSB00009.DOWNLOAD_NOS = innerNos;
					STM.corporateBill.printCB(STM.corporateBill.jsonCMSB00009);
				}
			}
		});

	},
	destroy : function() {
	}
}