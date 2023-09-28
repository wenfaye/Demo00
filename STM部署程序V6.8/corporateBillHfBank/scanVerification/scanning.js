/**
 * @file 扫描二维码
 * @author ZhangAXiong
 * @version 1.0
 * create
 * Last Updated 2021-01-19
 * 扫描二维码
 */
function CPBScanningHF() {
}
CPBScanningHF.prototype = {
    init: function (data) {
    	
    	data = data || {};
    	
    	// 根据二维码字符串查询回单信息
        /**
         * @function queryCPBMsg
         * @async
         * @param {String} codeStr 二维码字符串
         * 根据二维码字符串查询回单信息
         */
		var queryCPBMsg = function(codeStr){
			var json = {};
			json.CCBIns_ID = PJF.roleInfo.orgCode;//@critical  建行机构号
			json.Txn_CardNo = '0000';// @critical 交易卡号
			json.Msg_Smy = codeStr;//@critical  二维码字符串
			json.TxCode = 'A0782T017';// @critical 交易码
    		json.OPR_NO = PJF.otherInfo.devId; //@critical  柜员号
    		json.chanl_cust_no = '';// 
			//11.16 CMST00017=>A0782T017
			PJF.communication.cpsJsonReq({
				fwServiceId : "simpleTransaction",
				fwTranId : "A0782T017-stm",
				maskAll : true,
				async : true,
				jsonData : PJF.util.json2str(json),
				success : function(responseData) {
					var validateSys = responseData.Vld_ScsInd;// @critical 验证成功标志
					if(validateSys != '1'){
						STM.corporateBill.showPrintErrorMsg('该凭证不是回单系统生成的，无法进行验证', null);
						return;
					}
                    var FILE_INFO = responseData._COMMON.FILE_LIST_PACK.FILE_INFO;
                    if(FILE_INFO.length == 0 ){
                        STM.corporateBill.showPrintErrorMsg('回单系统返回文件不存在，下载失败', null);
                        return;
                    }
					var fileFullName = FILE_INFO[0].FILE_NAME;// @critical 文件全路径
					console.log('回单系统返回文件路径：' + fileFullName);
					// 截断文件全路径获取文件名
				//	var fileName = fileFullName ? STM.corporateBill.cutOutFilePath(fileFullName) : '';
                    var fileName = fileFullName;
    				var fileExistUrl = STM.corporateBill.existUrl + fileName;// @critical 服务器上文件路径
    				// 判断文件是否传送到服务器上
    				if(!fileName || !STM.corporateBill.isFileExist(fileExistUrl)){
						STM.corporateBill.showPrintErrorMsg('回单系统返回文件不存在，下载失败', null);
					}else{
                        var preUrl = STM.corporateBill.url + fileName;
                        var printerArgs ={
                            readButtonText : '关闭预览'
                        };
                        PJF.communication.OpenDocOnline(preUrl, false, printerArgs, function(){});
						/*var fileMode = fileName.split('\.')[1];
						if('pdf' == fileMode){// 回单系统验证返回附件是pdf格式
							var preUrl = STM.corporateBill.url + fileName;
							var printerArgs ={
								readButtonText : '关闭预览'
							};
							PJF.communication.OpenDocOnline(preUrl, false, printerArgs, function(){});
						}else if('xml' == fileMode){// 非回单系统验证返回附件是xml格式
							// 按照模板展示
							var xmlData = STM.corporateBill.getXmlData(fileName);
							if(xmlData){// 读取xml文件成功
								var pageData = $(xmlData).find('page');
								//var $pageData = $(pageData);
								var fileType = pageData.attr('type');// xml文件所属类型
								console.log('回单系统返回文件类型：' + fileType);
								pageData = null;
								xmlData = null;
								switch(fileType){
								case 'page_current':// 账页
									STM.corporateBill.previewLPByXMLPath(fileName);
									break;
								case 'page_czdzqd':// 对账清单
									STM.corporateBill.previewBillByXmlPath(fileName);
									break;
								case 'pos':// pos清单（附件）
									STM.corporateBill.previewPOS(fileName);
									break;
								case 'fhtsattach':// 分行特色（附件）
									STM.corporateBill.previewFHTS(fileName);
									break;
								default:
									break;
								}
							}
						}*/
					}
				},
				failure : function(responseData) {
					STM.corporateBill.showErrorMsg(responseData, '根据二维码查询回单信息失败');
					
				}
			});
		}
		
		//queryCPBMsg('branch-page-61020160000182095612-1-2016-7152d4f919f241632a7f1daa213e3c46');
    	
    	// 调用二维码扫描仪
        /**
         * @function scanQRCode
         *  调用二维码扫描仪
         */
    	var scanQRCode = function(){
    		PJF.stm.TDC.getTDCode(
	    		{loadingConf:{noLayer:true}},//@critical  默认30秒超时
	    		function(args){// 返回函数
	    			console.log(PJF.util.json2str(args));
	    			if(1 == args.status){
	    				var qrCodeStr = args.info.pchData;//@critical  获取扫描二维码字符串
	    				queryCPBMsg(qrCodeStr);
	    			}else{
	    				var msgBox = new PJF.ui.errorMessageBox({
							content : '二维码扫描执行失败。错误码：' + args.errorCode + '错误描述：' + args.errorMsg,
							//detailMsg: "错误码：" + args.errorCode + "<br>错误描述：" + args.errorMsg,
							buttonConfs : [ {
								name : '确定',
								style : 'main',
								appendStyle : 'confirm',
								onClick : function() {
								}
							} ]
	    				});
	    				//console.log('二维码扫描执行失败，错误代码：' + args.errorCode + '，错误信息：' + args.errorMsg);
	    			}
	    		}
	    	);
    	}
    	
    	// 继续扫描按钮
		var continueToScanBtn = new PJF.ui.linkButton({
			dom : 'continueToScanBtn',
			style : 'main',
			name : '继续扫描',
			onClick : function() {
				scanQRCode();
			}
		});

    	// 返回按钮
		var returnBtn = new PJF.ui.linkButton({
			dom : 'returnBtn',
			style : 'main',
			name : '返回',
			onClick : function() {
				//template.loadPage('subMenuPage','CPB20008');
				template.loadPage('entryIndex',{accNo:data.accNo});
			}
		});
		//预览界面返回按钮
		var preview_returnBtn = new PJF.ui.linkButton({
			dom : 'preview_returnBtn',
			style : 'main',
			name : '返回',
			onClick : function() {
				document.getElementById('content_id').style.display = '';
				document.getElementById('preview_id').style.display = 'none';
				//清空预览内容
				PJF.html.empty('preview_content');
			}
		});
		
		scanQRCode();
    },
	destroy : function() {
	}
};