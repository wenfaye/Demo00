/**
 * @file  账单自助功能的公共文件
 * @author ZhangAXiong
 * @version 1.0
 * Create on
 * Last Updated 2021-01-19
 * 主要包含：
 * 1.回单打印的中间变量以及参数的初始化
 * 2.回单的文件查询、下载、打印机预热、打印功能
 * 3.提示弹窗以及错误弹窗、打印机报错的方法
 * 4.自助对账及明细打印里面拼接打印的html文件
 */
PJF.namespace("STM.corporateBill");
STM.corporateBill={
		LP_PRT_FEEAMT : 0.00,// @critical 打印账页需要总金额
		url : 'http://' + location.host + '/ecpweb/getLocalFile.action?relativePath=resp&fileName=',//@critical 服务端文件地址
        existUrl : 'http://' + location.host +'/ecpweb/ecpJson.action?_fw_service_id=localFileExists&relativePath=resp&fileName=',//@critical 判断服务端文件是否存在地址
		localUrl : PJF.communication.fileSystem.getAppStorageFolder().result + '/temp/',//@critical 下载文件本地地址
		loading : null,//@critical 全局遮罩
		limitDecs : "本渠道暂时不支持一次性超过100页的打印，请重新选择打印范围",//@critical 打印100张限制描述
		Txn_CardNo : null,//@critical 卡号
		ValArray : new Array(),//@critical 注册需要用的唯一编号数组对象
		newValArray : new Array(),//@critical T004登记需要用的唯一编号数组对象
		ValHtmlArray : new Array(),//@critical 注册需要用的唯一编号数组对象(针对html类型)
		ValVoucherArray : new Array(),//@critical 注册需要用的唯一编号数组对象(针对统一凭证类型)
		huiDCardNo:null,//@critical 回单卡号
		initT001Param :null,//@critical T001初始数据
		resArr:null,//@critical 回单继续打印循环数组
		totalNum:0,//@critical 回单查询结果总条数
		balCurNum:0,//@critical 账页当前打印条数
		priAllCB:null,//@critical 是否打印全部回单
		priAllBL:null,//@critical 是否打印全部账页
	    orgName:'330000000,370000000,371000000,410000000,140000000,630000000',//@critical 浙江(330000000)、山东(370000000)、青岛(371000000)、河南(410000000)、山西(140000000)、青海(630000000)
		ifCluOrg:null,
		debugWindow:null,
		VchrCtlgStr : 'pos,fhtsattach',//@critical 目前支持的附件打印：hrhk
		dealNum : 30,//@critical 20条数据做一次登记
		orgCode : {"442000034":"分行营业部",
				"442000018":"田背支行",
				"442000100":"天健世纪支行",
				"442000002":"福田支行",
				"442000047":"横岗支行"},//@critical 回单试点行（两个章）
		jsonCMST00003:{//@critical STM回单下载服务
			TxCode : 'CMST00003',
			chanl_cust_no : ''
		},
		jsonCMST00004:{//@critical STM下载登记服务:00-回单 02-对账单 03-附件 04-账单清单
			TxCode : 'CMST00004',
			chanl_cust_no : '',
			Vchr_Ctlg_No:null,
			prt_Ind:null
		},
		jsonCMST00014:{//@critical STM对账清单下载服务
			TxCode : 'CMST00014',
			chanl_cust_no : ''
		},
		jsonCMST00016:{//@critical STM附件下载服务
			TxCode : 'CMST00016',
			chanl_cust_no : ''
		},
		curAccount:null,//当前登录账户
		// 弹出错误提示框
    /**
     * @function showErrorMsg
     * @param {Object}data 提示信息
     * @param {String}content 提示内容
     * 弹出错误提示框
     */
    showErrorMsg : function(data, content) {
			/*if(!content || null == content || '' == content){
				content = data.BK_DESC;
			}
			var detail = "错误码：" + data.BK_CODE + "<br>全局跟踪号：" + data._COMMON.SYS_EVT_TRACE_ID + "<br>错误描述：" + data.BK_DESC;
			*/
			if (data.BK_CODE) {
				var msgBox = new PJF.ui.errorMessageBox({
					//content : content,
					//detailMsg: detail,
					data:data,
					buttonConfs : [ {
						name : '确定',
						style : 'main',
						appendStyle : 'confirm',
						onClick : function() {
						}
					} ]
				});
			} else {
				var msgBox = new PJF.ui.errorMessageBox({
					content : content,
					buttonConfs : [ {
						name : '确定',
						style : 'main',
						appendStyle : 'confirm',
						onClick : function() {
						}
					} ]
				});
			}
		},
		// 弹出消息提示框
    /**
     * @function showAlertMsg
     * @param {Object}data 提示信息
     * 弹出消息提示框
     */
		showAlertMsg : function(data) {
			var msgBox = new PJF.ui.errorMessageBox({
				content : data,
				//detailMsg: detail,
				buttonConfs : [ {
					name : '确定',
					style : 'main',
					appendStyle : 'confirm',
					onClick : function() {
					}
				} ]
			});
		},
		// 弹出打印机错误消息提示框
    /**
     * @function showPrintErrorMsg
     * @param {String}msg 错误信息
     * @param {String}code 错误码
     * 弹出打印机错误消息提示框
     */
		showPrintErrorMsg : function(msg, code) {
			if(code){
				var msgBox = new PJF.ui.errorMessageBox({
					content : msg+"。错误码：" + code,
					//detailMsg: "错误码：" + code,
					buttonConfs : [ {
						name : '确定',
						style : 'main',
						appendStyle : 'confirm',
						onClick : function() {
							template.loadPage('homepage');
						}
					} ]
				});
			} else {
				var msgBox = new PJF.ui.errorMessageBox({
					content : msg,
					//detailMsg: "错误码：" + data.errorCode,
					buttonConfs : [ {
						name : '确定',
						style : 'main',
						appendStyle : 'confirm',
						onClick : function() {
							//template.loadPage('homepage');
						}
					} ]
				});
			}
		},
		// 弹出打印机错误消息提示框
    /**
     * @function showPrintErrorMsgAndGetPaper
     * @param {String}msg 提示信息
     * @param {Object}startPrintRes 错误信息
     * @param {Object}func 点击的回调方法
     * 弹出打印机错误消息提示框
     */
		showPrintErrorMsgAndGetPaper : function(msg, startPrintRes, func) {
			if(startPrintRes){
				var msgBox = new PJF.ui.errorMessageBox({
					content : msg+"。错误码：" + startPrintRes.errorCode + "<br>错误描述：" + startPrintRes.errorMsg,
					//detailMsg: "错误码：" + startPrintRes.errorCode + "<br>错误描述：" + startPrintRes.errorMsg,
					buttonConfs : [ {
						name : '确定',
						style : 'main',
						appendStyle : 'confirm',
						onClick : func
					} ]
				});
			} else {
				var msgBox = new PJF.ui.errorMessageBox({
					content : msg,
					//detailMsg: "错误码：" + data.errorCode,
					buttonConfs : [ {
						name : '确定',
						style : 'main',
						appendStyle : 'confirm',
						onClick : func
					} ]
				});
			}
		},
		//获取全路径中的文件全名
    /**
     * @function cutOutFilePath
     * @param {String}filePath 文件路径
     * 获取全路径中的文件全名
     */
		cutOutFilePath : function(filePath) {
			return filePath.substring(filePath.lastIndexOf('/')+1, filePath.length);
		},
		//判断文件是否存在
    /**
     * @function isFileExist
     * @param {String}fileUrl 文件路径
     * 判断文件是否存在
     */
		isFileExist : function(fileUrl) {
			var existFlag = false;
			PJF.communication.ajax({
				url : fileUrl,
				async : false,
				safe:true,
				success : function(data){
					if(data.fileExists){
						existFlag = true;
					}
				},
				failure : function(data){
					console.log("P2服务器文件是否存在判断失败");
					existFlag = false;
				}
			});
			
			if(!existFlag){
				console.log("P2服务器文件不存在，文件下载地址：" + fileUrl);
			}
			return existFlag;
		},
		
		debug: function(message){
			/*$('.pjf_stm_content').before('<p>'+message + '</p>');
			$('.pjf_stm_content').append('<p>'+message + '</p>');
			 * var debugWindow = STM.corporateBill.debugWindow;
			if(!debugWindow || debugWindow.closed){
				debugWindow = window.open('','debugWindow','width=400,height=600');
				debugWindow.document.bgColor = '#eeeeee';
			}
			debugWindow.opener.focus();
			debugWindow.document.body.innerHTML += '>' + message + '<br/>';
			debugWindow.scroll(0,5000000);
			var msgBox = new PJF.ui.errorMessageBox({
				content : message,
				buttonConfs : [ {
					name : '确定',
					style : 'main',
					appendStyle : 'confirm',
					onClick : function() {
					}
				} ]
			});
			*/
		},
		
		//收取费用 对账清单，账页共用
    /**
     * @function confirmDeductMoney
     * @param {String}pageNo 本次打印张数
     * @param {String}money 收取费用
     * @param {Object}func 回调
     * 收取费用 对账清单，账页共用
     */
		confirmDeductMoney : function(pageNo, money, func) {
			//@critical 取出打印条数之后，计算还剩打印条数
			var unPrtNum = 0;
			console.log("是否点击账页打印全部按钮："+STM.corporateBill.priAllBL);
			if(STM.corporateBill.priAllBL == true){
				console.log("剩余打印账页数据："+PJF.util.json2str(STM.corporateBill.resArr));
				if(STM.corporateBill.resArr && STM.corporateBill.resArr.length){
					for(var i=0;i<STM.corporateBill.resArr.length;i++){
						var inArr = STM.corporateBill.resArr[i];
						for(var j=0;j<inArr.length;j++){
							unPrtNum = unPrtNum + inArr[j].split(',').length;
						}
					}
				}
			}
			console.log("未打印条数unPrtNum："+unPrtNum);
			var content = '';
			if(money && money > 0){
				content = '您本次即将打印' + pageNo + '张，收费' + money + '元，是否继续打印？';
				//@critical 第二次循环的时候，pageNo是总数，balCurNum才是本次的打印数，而如果不支持续打，那么pageNo既是总数也是本次打印数
				if(STM.corporateBill.priAllBL == true){
					content = '您本次即将打印' + STM.corporateBill.balCurNum + '张，收费' + money + '元，是否继续打印？';
				}
				//@critical 如果大于0，说明数组有值，即是回单、账页打印
				if(unPrtNum > 0){
					content = '查询结果' + pageNo + '张，本次即将打印'+STM.corporateBill.balCurNum+'张，本次费用是' + money + '元，是否继续打印？'
				}
			} else {
				content = '您本次即将打印' + pageNo + '张，是否继续打印？';
				if(STM.corporateBill.priAllBL == true){
					content = '您本次即将打印' + STM.corporateBill.balCurNum + '张，是否继续打印？';
				}
				if(unPrtNum > 0){
					content = '查询结果' + pageNo + '张，本次即将打印'+STM.corporateBill.balCurNum+'张，是否继续打印？';
				}
			}
			//STM.corporateBill.debug(func);
			var confirm_Box = new PJF.ui.errorMessageBox({
				content : content,
				buttonConfs : [ {
					name : '取消',
					style : 'main',
					onClick : function() {
						STM.corporateBill.loading.destroy();
						return;
					}
				}, {
					name : '确定',
					style : 'main',
					appendStyle : 'confirm',
					onClick : func
				}]
			});
		},
		//收取费用（回单，附件）
    /**
     * @function confirmDeductMoneyByCB
     * @param {String}pageNo 本次打印张数
     * @param {String}money 收取费用
     * @param {Object}func 回调
     * 收取费用（回单，附件）
     */
		confirmDeductMoneyByCB : function(pageNo, money, func) {
			//@critical 取出打印条数之后，计算还剩打印条数
			var unPrtNum = 0;
			if(STM.corporateBill.priAllCB == true){
				console.log("剩余打印回单数据："+PJF.util.json2str(STM.corporateBill.resArr));
				if(STM.corporateBill.resArr && STM.corporateBill.resArr.length){
					for(var i=0;i<STM.corporateBill.resArr.length;i++){
						var inArr = STM.corporateBill.resArr[i];
						for(var j=0;j<inArr.length;j++){
							var tempVal = inArr[j].vchIDs;
							unPrtNum = unPrtNum + tempVal.split(',').length;
						}
					}
				}
			}
			console.log("未打印条数unPrtNum："+unPrtNum);
			var content = '';
			if(money && money > 0){
				content = '您本次即将打印' + pageNo + '条，收费' + money + '元，是否继续打印？';
				//@critical 如果大于0，说明数组有值，即是回单、账页打印
				if(unPrtNum > 0){
					console.log("未打印条数："+unPrtNum);
					content = '查询结果' + STM.corporateBill.totalNum + '条，本次即将打印'+pageNo+'条，本次费用是' + money + '元，是否继续打印？';
				}
			} else {
				content = '您本次即将打印' + pageNo + '条，是否继续打印？';
				if(unPrtNum > 0){
					console.log("未打印条数："+unPrtNum);
					content = '查询结果' + STM.corporateBill.totalNum + '条，本次即将打印'+pageNo+'条，是否继续打印？';
				}
			}
			var confirm_Box = new PJF.ui.errorMessageBox({
				content : content,
				buttonConfs : [ {
					name : '取消',
					style : 'main',
					onClick : function() {
						if(STM.corporateBill.loading){
							STM.corporateBill.loading.destroy();
						}
						return;
					}
				}, {
					name : '确定',
					style : 'main',
					appendStyle : 'confirm',
					onClick : function(){func()}
				}]
			});
		},

		// 预览回单 11.16CMST00003=>A0782T003
    /**
     * @function previewCB
     * @async
     * @param {String}vchID 预览回单的凭证ID
     * 预览回单
     */
		previewCB : function(vchID) {
			/*var conf = {};
			conf.Stmp_Bsn_Ctlg_ID = "001";//默认传001
			conf.Stmp_Blng_InsID = PJF.roleInfo.orgCode;
			conf.VchID = "MXDY0CCMS00000000000000000000002";//回单
			conf.Mnplt_TpCd="03";//默认03：客户端查询
			STM.corporateBill.getElecChapter(conf,function(elec_flag){
				continuePreviewCB(vchID,elec_flag);
			});*/
			(function(vchID){
				
				//var Crd_ID = STM.corporateBill.Txn_CardNo?STM.corporateBill.Txn_CardNo:STM.corporateBill.curAccount;
				var Crd_ID = STM.corporateBill.Txn_CardNo?STM.corporateBill.Txn_CardNo:'';
				var sendA07824603Data = {
						Hd_Prt_Grp:[{
							VchID:vchID
						}],
						Fdbk_Chnl_ID:'1',
						Crd_ID:Crd_ID
						}
				var sendA07824602Data = {
						VchID:vchID,
						StMd_SN:'1',
						Crd_ID:Crd_ID
						}
				PJF.communication.cpsJsonReq({
		            fwServiceId: "simpleTransaction",
		            fwTranId: 'A07824602-HF',//A07824603-HF
		            async:true,
		            maskAll : true,
		            jsonData: PJF.util.json2str(sendA07824602Data),//sendData
		            success: function(responseData){
		            	console.log("预览回单（A07824602-stm）文件下载交易成功：" + PJF.util.json2str(responseData));
		            	var preUrl = '';
						//var preUrl = STM.corporateBill.url + STM.corporateBill.cutOutFilePath(responseData.File_List[0].File_Rte_FullNm);
						if(responseData._COMMON && responseData._COMMON.FILE_LIST_PACK && responseData._COMMON.FILE_LIST_PACK.FILE_INFO){
							preUrl = STM.corporateBill.url + STM.corporateBill.cutOutFilePath(responseData._COMMON.FILE_LIST_PACK.FILE_INFO[0].FILE_NAME);
							//FILE_NAME: "01A4442000034_01000000_0412171335_465147_single.pdf"
								//FILE_PATH: "/home/ap/appoper/pdf/HD/00000/20210520/442000034"
						}
		            	
		            	var printerArgs ={
							readButtonText : '关闭预览'
						};
						PJF.communication.OpenDocOnline(preUrl, false, printerArgs, function(){});
		            },
		            failure : function(responseData) {
						STM.corporateBill.showErrorMsg(responseData, '预览失败');
					}
		            })
				
			})(vchID);
			//@critical 20200703去掉预览电子印章
            //continuePreviewCB(vchID,0);
			function continuePreviewCB(vchID,elec_flag) {
				STM.corporateBill.jsonCMST00003.List_Val = vchID;
				//11.16新增字段
				STM.corporateBill.jsonCMST00003.VchId_Grp = [{VchID:vchID}];
				STM.corporateBill.jsonCMST00003.Fee_Ind = "0";
				STM.corporateBill.jsonCMST00003.Txn_CardNo = STM.corporateBill.Txn_CardNo;
				STM.corporateBill.jsonCMST00003.CCBIns_ID = PJF.roleInfo.orgCode;
				STM.corporateBill.jsonCMST00003.MsgRp_Prt_Tm=STM.corporateBill.printServiceTime||PJF.communication.getServerTime("yyyy-MM-dd HH:mm:ss");//@critical 打印时间
				STM.corporateBill.jsonCMST00003.OPR_NO = PJF.otherInfo.devId;
				if(elec_flag == 1){
					STM.corporateBill.jsonCMST00003.Eltc_Stmp_Wthr_Us_Ind = 1;
				}else{
					STM.corporateBill.jsonCMST00003.Eltc_Stmp_Wthr_Us_Ind = 0;
				}
				PJF.communication.cpsJsonReq({
					fwServiceId : "simpleTransaction",
					fwTranId : "A0782T003-stm",
					maskAll : true,
					jsonData : PJF.util.json2str(STM.corporateBill.jsonCMST00003),
					success : function(responseData) {
						console.log("预览回单（A0782T003-stm）文件下载交易成功：------------------------" + PJF.util.json2str(responseData));
						var preUrl = STM.corporateBill.url + STM.corporateBill.cutOutFilePath(responseData.File_List[0].File_Rte_FullNm);
						var printerArgs ={
							readButtonText : '关闭预览'
						};
						PJF.communication.OpenDocOnline(preUrl, false, printerArgs, function(){});
					},
					failure : function(responseData) {
						STM.corporateBill.showErrorMsg(responseData, '预览失败');
					}
				});
			}
		},
		// 预览附件
    /**
     * @function previewAttachment
     * @async
     * @param {String}vchID 预览附件的凭证ID
     * 预览附件
     */
		previewAttachment : function(vchID) {
			/*var conf = {};
			conf.Stmp_Bsn_Ctlg_ID = "001";//默认传001
			conf.Stmp_Blng_InsID = PJF.roleInfo.orgCode;
			conf.VchID = "MXDY0CCMS00000000000000000000002";//回单
			conf.Mnplt_TpCd="03";//默认03：客户端查询
			STM.corporateBill.getElecChapter(conf,function(elec_flag){
				continuePreviewAttachment(vchID,elec_flag);
			});*/
            continuePreviewAttachment(vchID,0);
			function continuePreviewAttachment(vchID,elec_flag) {
				STM.corporateBill.jsonCMST00016.List_Val = vchID;
				//@critical 11.16新增字段
				STM.corporateBill.jsonCMST00016.VchId_Grp = [{VchID:vchID}];
				STM.corporateBill.jsonCMST00016.Fee_Ind = "0"
				STM.corporateBill.jsonCMST00016.Txn_CardNo = STM.corporateBill.Txn_CardNo;
				STM.corporateBill.jsonCMST00016.CCBIns_ID = PJF.roleInfo.orgCode;
				STM.corporateBill.jsonCMST00016.MsgRp_Prt_Tm=STM.corporateBill.printServiceTime||PJF.communication.getServerTime("yyyy-MM-dd HH:mm:ss");//@critical 打印时间
				STM.corporateBill.jsonCMST00016.OPR_NO = PJF.otherInfo.devId;
				if(elec_flag == 1){
					STM.corporateBill.jsonCMST00016.Eltc_Stmp_Wthr_Us_Ind = 1;
				}else{
					STM.corporateBill.jsonCMST00016.Eltc_Stmp_Wthr_Us_Ind = 0;
				}
				PJF.communication.cpsJsonReq({
					fwServiceId : "simpleTransaction",
					fwTranId : "A0782T016-stm", //@critical 11.16 CMST00016=>A0782T016
					maskAll : true,
					jsonData : PJF.util.json2str(STM.corporateBill.jsonCMST00016),
					success : function(responseData) {
						console.log("预览附件（A0782T016-stm）文件下载交易成功：" + PJF.util.json2str(responseData));
						//@critical 判读下载文件是否存在
						var existFlag = false;
						var fileName = STM.corporateBill.cutOutFilePath(responseData.File_List[0].File_Rte_FullNm);
						var fileExistUrl = STM.corporateBill.existUrl + fileName;

						if(!STM.corporateBill.isFileExist(fileExistUrl)){
							STM.corporateBill.showPrintErrorMsg('回单附件预览文件不存在，下载失败', null);
							return;
						}
						var printerArgs ={
							readButtonText : '关闭预览'
						};
						var preUrl = STM.corporateBill.url + fileName;
						PJF.communication.OpenDocOnline(preUrl, false, printerArgs, function(){});
						/*//先清空隐藏内容
                        PJF.html.empty('preview_content');

                        var pageInfos = STM.corporateBill.analysisAttatchContent(fileName);
                        var pages = pageInfos['pages'];
                        var displayset;//分行特色显示格式

                        //预览只有一个
                        var page = pages[0];
                        var type = page.type;
                        var tmpHtml;
                        switch(type){
                        case 'pos':// pos清单（附件）
                            tmpHtml = STM.corporateBill.createPOSHTML(page);
                            break;
                        case 'fhtsattach':// 分行特色（附件）
                            displayset = pageInfos[page.format_id];
                            page.head = displayset;
                            tmpHtml = STM.corporateBill.createFHTSHTML(page);
                            break;
                        case 'hrhk':// 汇入汇款（附件）
                            console.log('hrhk参数值' + PJF.util.json2str(page));

                            break;
                        default:
                            break;
                        }

                        PJF.html.append('preview_content', tmpHtml);
                        document.getElementById('content_id').style.display = 'none';
                        document.getElementById('preview_id').style.display = '';*/
					},
					failure : function(responseData) {
						STM.corporateBill.showErrorMsg(responseData, '预览失败');
					}
				});
			}
		},
		// 预览对账清单
    /**
     * @function previewBillList
     * @async
     * @param {String}vchID 预览对账清单的凭证ID
     * 预览对账清单
     */
		previewBillList : function(vchID) {
			/*var conf = {};
			conf.Stmp_Bsn_Ctlg_ID = "001";//默认传001
			conf.Stmp_Blng_InsID = PJF.roleInfo.orgCode;
			conf.VchID = "MXDY0CCMS00000000000000000000003";//对账单
			conf.Mnplt_TpCd="03";//默认03：客户端查询
			STM.corporateBill.getElecChapter(conf,function(elec_flag){
				continuePreviewBillList(vchID,elec_flag);
			});*/
            continuePreviewBillList(vchID,0);
			function continuePreviewBillList(vchID, elec_flag) {
				STM.corporateBill.jsonCMST00014.VchId_Grp = [{VchID:vchID}];
				STM.corporateBill.jsonCMST00014.Fee_Ind="0";
				STM.corporateBill.jsonCMST00014.MsgRp_Prt_Tm =STM.corporateBill.printServiceTime||PJF.communication.getServerTime("yyyy-MM-dd HH:mm:ss");//@critical 打印时间
				STM.corporateBill.jsonCMST00014.OPR_NO = PJF.otherInfo.devId;
				if(elec_flag == 1){
					STM.corporateBill.jsonCMST00014.Eltc_Stmp_Wthr_Us_Ind = 1;
				}else{
					STM.corporateBill.jsonCMST00014.Eltc_Stmp_Wthr_Us_Ind = 0;
				}
				PJF.communication.cpsJsonReq({
					fwServiceId : "simpleTransaction",
					fwTranId : "A0782T014-stm",
					maskAll : true,
					jsonData : PJF.util.json2str(STM.corporateBill.jsonCMST00014),
					success : function(responseData) {
						console.log("预览对账清单（A0782T014-stm）文件下载交易成功：" + PJF.util.json2str(responseData));
						var FILE_INFO = responseData._COMMON.FILE_LIST_PACK.FILE_INFO;
						var fileName = FILE_INFO[0].FILE_NAME;// 文件全路径
						var fileExistUrl = STM.corporateBill.existUrl + fileName;// 服务器上文件路径
						var downUrl = STM.corporateBill.url + fileName;
						// @critical 判断文件是否传送到服务器上
						if(!fileName || !STM.corporateBill.isFileExist(fileExistUrl)){
							STM.corporateBill.showPrintErrorMsg('回单系统返回文件不存在，下载失败', null);
						}else{
							var printerArgs ={
								readButtonText : '关闭预览'
							};
							PJF.communication.OpenDocOnline(downUrl, false, printerArgs, function(){});

						}
						/*//判读下载文件是否存在
                        var existFlag = false;
                        var fileExistUrl = STM.corporateBill.existUrl + STM.corporateBill.cutOutFilePath(responseData.File_Rte_FullNm);

                        if(!STM.corporateBill.isFileExist(fileExistUrl)){
                            STM.corporateBill.showPrintErrorMsg('对账清单预览文件不存在，下载失败', null);
                            return;
                        }

                        //先清空隐藏内容
                        PJF.html.empty('preview_content');
                        var tmpHtml = STM.corporateBill.createBillList(STM.corporateBill.cutOutFilePath(responseData.File_Rte_FullNm));
                        PJF.html.append('preview_content', tmpHtml);

                        document.getElementById('content_id').style.display = 'none';
                        document.getElementById('preview_id').style.display = '';*/

					},
					failure : function(responseData) {
						STM.corporateBill.showErrorMsg(responseData, '预览对账清单出错！');
					}
				});
			}
		},
	//20200717不用代码 涉及到PJF.communication.ajax 注释
		createBillList :function (xmlPath){
			var xmlData = STM.corporateBill.getXmlData(xmlPath);
			if(null == xmlData){
				return;
			}
			
			var tmpHtml;
			var tmp;
			var time;
			var array;
			$(xmlData).find('page').each(function(){
				
				var content = 'branch-czdzqd-' + $(this).find('head').attr('id') + '-' + (parseInt($(this).find('head').attr('print_cnts')) + 1)
				+ '-' + PJF.util.formatDate(new Date(),"yyyy") + '-' + $(this).find('head').attr('qr_str');
				var codeImage = STM.corporateBill.createQRCode(content);
				
				tmpHtml = '';
				//表头
				tmpHtml += '<div id="cbHtml_1">';
				tmpHtml += '<div style="font-size: 13px;">';
				tmpHtml += '<table width="100%" >';
				tmpHtml += '<tr>';
				tmpHtml += '<td width="30%" colspan=3><h3 align="center" style="font-size: 22px;padding-left:170px;">集团流动性管理账户对账清单</h3></td>';
				tmpHtml += '<td width="55%"></td>';
				tmpHtml += '<td width="10%"></td>';
				tmpHtml += '<td width="5%" rowspan=3><img style="padding-top: 20px;" src="' + codeImage + '" alt="" align="left" height="95" width="80" /></td>';
				tmpHtml += '</tr>';
				tmpHtml += '<tr style="line-height: 17px;">';
				tmpHtml += '<td width="30%" align="left">币别：' + $(this).find('head').attr('cur_code') + '</td>';
				tmpHtml += '<td width="55%" align="left">钞汇鉴别：' + $(this).find('head').attr('cur_iden') + '</td>';
				tmpHtml += '<td width="10%"></td>';
				tmpHtml += '<td width="5%"></td>';
				tmpHtml += '</tr>';
				tmpHtml += '<tr style="line-height: 17px;">';
				tmpHtml += '<td width="30%" align="left">账号：' + $(this).find('head').attr('acct_no') + '</td>';
				tmpHtml += '<td width="55%" align="left">账户名称：' + $(this).find('head').attr('fs_acctname') + '</td>';
				tmpHtml += '<td width="10%" align="left">页码：' + $(this).find('head').attr('page_no') + '</td>';
				tmpHtml += '<td width="5%"></td>';
				tmpHtml += '</tr>';
				tmpHtml += '</table>';
				tmpHtml += '<table width="100%" border=1 cellpadding=0 cellspacing=0 >';
				tmpHtml += '<tr style="line-height: 30px;">';
				tmpHtml += '<th width="5%" style="border-bottom: 1;border-left: 0;border-right: 1;border-top: 0;">交易日期</th>';
				tmpHtml += '<th width="6%" style="border-bottom: 1;border-left: 0;border-right: 1;border-top: 0;">凭证种类</th>';
				tmpHtml += '<th width="11%" style="border-bottom: 1;border-left: 0;border-right: 1;border-top: 0;">交易流水号</th>';
				tmpHtml += '<th width="10%" style="border-bottom: 1;border-left: 0;border-right: 1;border-top: 0;">摘要</th>';
				tmpHtml += '<th width="10%" style="border-bottom: 1;border-left: 0;border-right: 1;border-top: 0;">借方发生额</th>';
				tmpHtml += '<th width="10%" style="border-bottom: 1;border-left: 0;border-right: 1;border-top: 0;">贷方发生额</th>';
				tmpHtml += '<th width="11%" style="border-bottom: 1;border-left: 0;border-right: 1;border-top: 0;">余额</th>';
				tmpHtml += '<th width="15%" style="border-bottom: 1;border-left: 0;border-right: 1;border-top: 0;">对方账号</th>';
				tmpHtml += '<th width="22%" style="border-bottom: 1;border-left: 0;border-right: 0;border-top: 0;">对方户名</th>';
				tmpHtml += '</tr>';
				
				//表内容
				time = 0;
				$(this).find('item').each(function(){
					tmpHtml += '<tr style="line-height: 16.5px;">';
					
					tmp = $(this).text();
					array = tmp.split(' ■ ');
					
					tmpHtml += '<td style="border-bottom: 0;border-left: 0;border-right: 1;border-top: 0;text-align:left;padding-left:2px;">' + array[2].trim() + '</td>';
					tmpHtml += '<td style="border-bottom: 0;border-left: 0;border-right: 1;border-top: 0;text-align:left;padding-left:2px;">' + array[5].trim() + '</td>';
					tmpHtml += '<td style="border-bottom: 0;border-left: 0;border-right: 1;border-top: 0;text-align:left;padding-left:2px;">' + array[3].trim() + '</td>';
					tmpHtml += '<td style="border-bottom: 0;border-left: 0;border-right: 1;border-top: 0;text-align:left;padding-left:2px;white-space:nowrap;overflow-x:hidden;max-width:10px;">' + array[6].trim() + '</td>';
					tmpHtml += '<td style="border-bottom: 0;border-left: 0;border-right: 1;border-top: 0;text-align:right;padding-right:2px;">' + STM.corporateBill.getJE(array[7].trim()) + '</td>';
					tmpHtml += '<td style="border-bottom: 0;border-left: 0;border-right: 1;border-top: 0;text-align:right;padding-right:2px;">' + STM.corporateBill.getJE(array[8].trim()) + '</td>';
					tmpHtml += '<td style="border-bottom: 0;border-left: 0;border-right: 1;border-top: 0;text-align:right;padding-right:2px;">' + STM.corporateBill.getJE(array[9].trim()) + '</td>';
					tmpHtml += '<td style="border-bottom: 0;border-left: 0;border-right: 1;border-top: 0;text-align:left;padding-left:2px;">' + array[14].trim() + '</td>';
					tmpHtml += '<td style="border-bottom: 0;border-left: 0;border-right: 0;border-top: 0;text-align:left;padding-left:2px;white-space:nowrap;overflow-x:hidden;max-width:10px;">' + array[15].trim() + '</td>';
					
					tmpHtml += '</tr>';
					time ++;
				});
				
				//不足30行需补空行
				if(time < 30){
					for(var j=0; j<(30 - time); j++){
						tmpHtml += '<tr style="line-height: 16.5px;" height="16.5px">';
						tmpHtml += '<td style="border-bottom: 0;border-left: 0;border-right: 1;border-top: 0;text-align:left;padding-left:2px;"></td>';
						tmpHtml += '<td style="border-bottom: 0;border-left: 0;border-right: 1;border-top: 0;text-align:left;padding-left:2px;"></td>';
						tmpHtml += '<td style="border-bottom: 0;border-left: 0;border-right: 1;border-top: 0;text-align:left;padding-left:2px;"></td>';
						tmpHtml += '<td style="border-bottom: 0;border-left: 0;border-right: 1;border-top: 0;text-align:left;padding-left:2px;white-space:nowrap;overflow-x:hidden;max-width:10px;"></td>';
						tmpHtml += '<td style="border-bottom: 0;border-left: 0;border-right: 1;border-top: 0;text-align:right;padding-right:2px;"></td>';
						tmpHtml += '<td style="border-bottom: 0;border-left: 0;border-right: 1;border-top: 0;text-align:right;padding-right:2px;"></td>';
						tmpHtml += '<td style="border-bottom: 0;border-left: 0;border-right: 1;border-top: 0;text-align:right;padding-right:2px;"></td>';
						tmpHtml += '<td style="border-bottom: 0;border-left: 0;border-right: 1;border-top: 0;text-align:left;padding-left:2px;"></td>';
						tmpHtml += '<td style="border-bottom: 0;border-left: 0;border-right: 0;border-top: 0;text-align:left;padding-left:2px;white-space:nowrap;overflow-x:hidden;max-width:10px;"></td>';
						tmpHtml += '</tr>';
					}
				}
				
				//表尾
				tmpHtml += '</table>';
				tmpHtml += '<table width="100%">';
				tmpHtml += '<tr style="line-height: 17px;">';
				tmpHtml += '<td width="25%" align="left">打印时间：' + $(this).find('head').attr('print_time') + '</td>';
				tmpHtml += '<td width="35%" align="left">打印机构：恒丰银行</td>';
				tmpHtml += '<td width="20%" align="left">打印柜员：' + PJF.otherInfo.devId + '</td>';
				
				if(STM.corporateBill.Txn_CardNo && STM.corporateBill.Txn_CardNo.length){
					tmpHtml += '<td width="20%" align="left">打印卡号：' + STM.corporateBill.Txn_CardNo + '</td>';
				}else{
					tmpHtml += '<td width="20%" align="left">&nbsp;</td>';
				}
				
				tmpHtml += '</tr>';
				tmpHtml += '</table>';
				
				tmpHtml += STM.corporateBill.addClientNoticeNew();
				
				tmpHtml += '</div>';
				tmpHtml += '</div>';
			});
			
			return tmpHtml;
		},
		// 预览对账清单
	//20200717不用代码 涉及到PJF.communication.ajax 注释
	/**
	 * @fucntion previewBillByXmlPath
	 * @param {String}xmlPath 文件内容
	 * 预览对账清单
	 */
		previewBillByXmlPath : function(xmlPath) {
			//先清空隐藏内容
			PJF.html.empty('preview_content');
			var tmpHtml = STM.corporateBill.createBillList(xmlPath);
			PJF.html.append('preview_content', tmpHtml);
			
			document.getElementById('content_id').style.display = 'none';
			document.getElementById('preview_id').style.display = '';
		},
		// 预览POS交易报表
	//20200717 不用代码 涉及到PJF.communication.ajax 注释
	/**
	 * @function previewPOS
	 * @param {String} xmlPath 文件
	 * 预览POS交易报表
	 */
		previewPOS : function(xmlPath) {
			var pages = STM.corporateBill.decoratePOSData(xmlPath);
			if(pages.length > 0){
				//先清空隐藏内容
				PJF.html.empty('preview_content');
				var posHTML = STM.corporateBill.createPOSHTML(pages[0]);
				PJF.html.append('preview_content', posHTML);
				
				document.getElementById('content_id').style.display = 'none';
				document.getElementById('preview_id').style.display = '';
			}
		},
		// 预览分行特色
	//20200717 不用代码 涉及到PJF.communication.ajax 注释
	/**
	 * @function previewFHTS
	 * @param {String}xmlPath 文件
	 * 预览分行特色
	 */
		previewFHTS : function(xmlPath) {
			var data = STM.corporateBill.decorateFHTSData(xmlPath);
			if(data.pages.length > 0){
				var page = data.pages[0];
				var formatId = page.formatId;
				if(data[formatId]){
					//先清空隐藏内容
					PJF.html.empty('preview_content');
					page.head = data[formatId];
					var fhtsHTML = STM.corporateBill.createFHTSHTML(page);
					PJF.html.append('preview_content', fhtsHTML);
					
					document.getElementById('content_id').style.display = 'none';
					document.getElementById('preview_id').style.display = '';
				}
			}
		},
		/*
		 * 根据xml路径预览账页
		 * xmlPath 账页xml路径
		 */
	//20200717 不用代码 涉及到PJF.communication.ajax 注释
	/**
	 * @function previewLPByXMLPath
	 * @param {String}xmlPath 账页xml路径
	 * 根据xml路径预览账页
	 */
		previewLPByXMLPath : function(xmlPath) {
			var pages = STM.corporateBill.decorateLPData(xmlPath);
			if(pages.length > 0){
				//先清空隐藏内容
				PJF.html.empty('preview_content');
				var ledgerPageHTML = STM.corporateBill.createLPHTML(pages[0], 1);
				PJF.html.append('preview_content', ledgerPageHTML);
				
				document.getElementById('content_id').style.display = 'none';
				document.getElementById('preview_id').style.display = '';
			}
		},
		/*
		 * 根据账页编号预览账页
		 * vchId 账页编号
		 */
	/**
	 * @function previewLPByID
	 * @param {String}vchId 账页编号
	 * 根据账页编号预览账页
	 */
		previewLPByID : function(vchId) {
			/*var conf = {};
			conf.Stmp_Bsn_Ctlg_ID = "001";//默认传001
			conf.Stmp_Blng_InsID = PJF.roleInfo.orgCode;
			conf.VchID = "MXDY0CCMS00000000000000000000003";//对账单
			conf.Mnplt_TpCd="03";//默认03：客户端查询
			STM.corporateBill.getElecChapter(conf,function(elec_flag){
				continuePreviewLPByID(vchId,elec_flag);
			});*/
            continuePreviewLPByID(vchId,0);
			function continuePreviewLPByID(vchId, elec_flag) {
			// 账页下载请求参数
				var reqData = {};
				reqData.List_Val = vchId;// 列表值
				//reqData.CCBIns_ID = '330000000';// 建行机构号
				//reqData.Txn_CardNo = '123213';// 交易卡号
				reqData.CCBIns_ID = PJF.roleInfo.orgCode;// 建行机构号
				reqData.Txn_CardNo = STM.corporateBill.Txn_CardNo;// 交易卡号
				reqData.TxCode = 'A0782T011';//1026改造CMST00011->A0782T011
				reqData.OPR_NO = PJF.otherInfo.devId, // 柜员号
				reqData.chanl_cust_no = '';
				reqData.MsgRp_Prt_Tm =STM.corporateBill.printServiceTime||PJF.communication.getServerTime("yyyy-MM-dd HH:mm:ss");//打印时间
				var isLoadSucc = false;// 下载xml文件是否成功
				var fileName = '';// 下载xml文件名称
				//reqData.Fee_Ind = "1";
				reqData.Fee_Ind = "0";
				var VchId_Grp = [];
				var VchId_GrpList = reqData.List_Val.split(',');
				for(var i=0;i<VchId_GrpList.length;i++){
					VchId_Grp.push({VchID:VchId_GrpList[i]});
				}
				reqData.VchId_Grp = VchId_Grp;
				if(elec_flag == 1){
					reqData.Eltc_Stmp_Wthr_Us_Ind = 1;
				}else{
					reqData.Eltc_Stmp_Wthr_Us_Ind = 0;
				}
				var sendA07824614Obj = {
						Fdbk_Chnl_ID : 1,
						Txn_CardNo : STM.corporateBill.Txn_CardNo,
						Page_Prt_Grp:VchId_Grp
				}
				PJF.communication.cpsJsonReq({
					fwServiceId : "simpleTransaction",
					fwTranId : "A07824614-HF",//1026改造CMST00011->A0782T011 A0782T011-stm A0782T011-HF
					maskAll : true,
					async: true,
					jsonData : PJF.util.json2str(sendA07824614Obj),//reqData
					success : function(responseData) {
						console.log("预览账页（A07824614-HF）文件下载交易成功：" + PJF.util.json2str(responseData));
						var fileFullName = responseData.File_Rte_FullNm;// 文件全路径
						// 截断文件全路径获取文件名
//					fileName = fileFullName ? STM.corporateBill.cutOutFilePath(fileFullName) : fileName;
						if(responseData._COMMON.FILE_LIST_PACK.FILE_INFO.length > 0){
							fileName = responseData._COMMON.FILE_LIST_PACK.FILE_INFO[0].FILE_NAME;
						}else{
							fileName = "";
						}
						var fileExistUrl = STM.corporateBill.existUrl + fileName;// 服务器上文件路径
						// 判断文件是否传送到服务器上
						if(!fileName || !STM.corporateBill.isFileExist(fileExistUrl)){
							STM.corporateBill.showPrintErrorMsg('回单附件预览文件不存在，下载失败', null);
							return;
						}
						var preUrl = STM.corporateBill.url + fileName;
						var printerArgs ={
							readButtonText : '关闭预览'
						};
						PJF.communication.OpenDocOnline(preUrl, false, printerArgs, function(){});
//    				var pages = STM.corporateBill.decorateLPData(fileName);
//        			if(pages.length > 0){
//        				//先清空隐藏内容
//    					PJF.html.empty('preview_content');
//        				var ledgerPageHTML = STM.corporateBill.createLPHTML(pages[0], 1);
//        				PJF.html.append('preview_content', ledgerPageHTML);
//
//        				document.getElementById('content_id').style.display = 'none';
//        				document.getElementById('preview_id').style.display = '';
//        			}
					},
					failure : function(responseData) {
						STM.corporateBill.showErrorMsg(responseData, '下载账页文件到P2出错');
						return;
					}
				});
			}
		},
		//获取币种
    /**
     * @function getCoinType
     * @param {String} val 币种代码
     * @returns {*} 返回对应描述
     * 获取币种
     */
		getCoinType : function(val) {
			var coin = {
				"156":"人民币",
				"840":"美元",
				"978":"欧元",
				"344":"港币",
				"826":"英镑",
				"392":"日元",
				"036":"澳大利亚元",
				"554":"新西兰元",
				"702":"新加坡元",
				"124":"加拿大元",
				"446":"澳门元",
				"764":"泰铢",
				"756":"瑞士法郎",
				"752":"瑞典克朗",
				"208":"丹麦克朗",
				"578":"挪威克朗",
				"410":"韩元",
				"643":"卢布",
				"398":"哈萨克斯坦坚戈",
				"710":"南非兰特",
				"458":"马来西亚吉特",
				"985":"波兰兹罗提",
				"936":"加纳塞地",
				"704":"越南盾",
				"524":"NPRNIBOER",
				"144":"马尔代夫卢比"
			};
			return coin[val];
		},
		//获取账户类型
    /**
     * @function getDepType
     * @param val 代码标识
     * @returns {string} 返回对应描述
     * 获取账户类型
     */
		getDepType : function(val) {
			var bak='';
			if('1' == val){
				bak = '活期';
			} else if('2' == val){
				bak = '定期';
			} else if('3' == val){
				bak = '贷款';
			}
			return bak;
		},

		//获取回签结果
    /**
	 * @function getAccFlag
	 * @param val 标识位
	 * @returns {string} 对应描述
	 * 获取回签结果
	 */
		getAccFlag : function(val) {
			var bak='';
			if('1' == val){
				bak = '相符';
			} else if('2' == val){
				bak = '不相符';
			}
			return bak;
		},
		// 预览回签账单
    /**
     * @function previewHQZD
     * @param {String}slcData 选中回签数据
     * @param {String}name 单位名称
     * @param {String}date 对账截止日期
     * @param {String}code 打印机构
     * 预览回签账单
     */
		previewHQZD : function(slcData,name,date,code) {
			//判断是否使用电子印章
			var imgSrc="";//电子印章图片本地地址
			/*
			var conf = {};
			conf.Stmp_Bsn_Ctlg_ID = "001";//默认传001
			conf.Stmp_Blng_InsID = PJF.roleInfo.orgCode;
			conf.VchID = "MXDY0CCMS00000000000000000000003";//对账单
			conf.Mnplt_TpCd="03";//默认03：客户端查询
			STM.corporateBill.getElecChapter(conf,function(elec_flag){
				console.log("btn3的全局跟踪号："+STM.corporateBill.balanceSelfNo);
				if(elec_flag == 1){
				}else{
					continuePreviewHQZD(slcData,name,date,code,imgSrc);
				}
			});
			"VchID":"MXDY0CCMS00000000000000000000003",
			"Stmp_Bsn_Ctlg_ID":"002",
			*/
			
			var args = {};
			var Vchr_Grp=[];
			Vchr_Grp.push({"Ovrlsttn_Trck_No":STM.corporateBill.balanceSelfNo,
				"VchID":"MXDY0CCMS00000000000000000000007",
				"Stmp_Bsn_Ctlg_ID":"002",
				"Clmn_Opt_Dsc":"001:类型:恒丰银行对账业务回单"+"" +
					"&amp;&amp;002:单位名称:"+name+"" +
					"&amp;&amp;003:账号:"+slcData[0].Cst_AccNo+"" +
					"&amp;&amp;004:对账截止日期:"+date+"" +
					"&amp;&amp;005:币种:"+STM.corporateBill.getCoinType(slcData[0].CcyCd)+"" +
					"&amp;&amp;006:打印机构:"+PJF.roleInfo.orgCode+"" +
					"&amp;&amp;007:打印柜员:"+ PJF.otherInfo.devId+""});
					//"&amp;&amp;007:打印柜员:"+ PJF.otherInfo.devId+"" +
					//"&amp;&amp;008:打印卡号:"+STM.corporateBill.Txn_CardNo+""});
			args.Vchr_Grp = Vchr_Grp;
			args.Txn_InsID = PJF.roleInfo.orgCode;
			args.Txn_TrID =  PJF.otherInfo.devId;
			args.Txn_Dt_Tm = PJF.communication.getServerTime("yyyyMMddHHmmssSSS");
			args.CALLOUT_TXN_CD = "MXDYDIY09";//虚拟交易号
			args.Vchr_RePrt_Cnt = 0;//0：初次打印1：重新打印
			args.Txn_Chnl_Cd = '02';//智慧柜员机
			args.Txn_TpDs = "ZDZZ";
			STM.corporateBill.getTransSeal(args,function(result){
                console.log("调用电子印章图片方法返回结果："+PJF.util.json2str(result));
                if(result.success == true){
                    STM.corporateBill.ifUseChapter = 1;
                    imgSrc = result.imgSrc;
                }else{
                    STM.corporateBill.ifUseChapter = 0;
                }
				continuePreviewHQZD(slcData,name,date,code,imgSrc);
            });
			
			//critical 拼接预览对账单
			function continuePreviewHQZD(slcData, name, date, code, imgSrc) {
				console.log("是否使用电子印章ifUseChapter："+ STM.corporateBill.ifUseChapter);
				//先清空隐藏内容
				PJF.html.empty('preview_content');
				//var content = '测试自助账单回签打印';
				var codeImage = STM.corporateBill.createQRCode(code);
				//tmpHead += '<div id="cbHtml_1">';
				var tmpHtml = '';
				//统一样式
				tmpHtml += '<style>';
				tmpHtml += '.table_font{font-family: "SimSun","宋体",sans-serif}';
				tmpHtml += '</style>';
				//表头
				if(STM.corporateBill.ifUseChapter == 1){
					tmpHtml += '<div id="cbHtml_1" style="position: absolute;left:1%;right: 1%">';
				}else{
					tmpHtml += '<div id="cbHtml_1">';
				}
				tmpHtml += '<div style="font-size: 13px;">';
				tmpHtml += '<table width="100%" >';
				tmpHtml += '<tr>';
				tmpHtml += '<td width="50%" colspan=3><h3 align="center" class="table_font" style="font-size: 22px;padding-left:30px;">恒丰银行股份有限公司银企对账业务(回单)</h3></td>';
				tmpHtml += '<td width="35%"></td>';
				tmpHtml += '<td width="10%"></td>';
//			tmpHtml += '<td width="5%" rowspan=3><img id="HQZD_img_id" style="padding-top: 20px;" src="' + codeImage + '" alt="" align="left" height="95" width="80" /></td>';
				tmpHtml += '<td width="5%" rowspan=3></td>';
				tmpHtml += '</tr>';
				tmpHtml += '<tr style="line-height: 19px;">';
				tmpHtml += '<td class="table_font" width="50%" align="left">单位名称：' + name + '</td>';
				tmpHtml += '<td class="table_font" width="35%" align="left">对账截止日期：' + date + '</td>';
				tmpHtml += '<td width="10%"></td>';
				tmpHtml += '<td width="5%"></td>';
				tmpHtml += '</tr>';
				/*tmpHtml += '<tr style="line-height: 19px;">';
				tmpHtml += '<td width="50%" align="left"></td>';
				tmpHtml += '<td width="35%" align="left"></td>';
				tmpHtml += '<td width="10%" align="left"></td>';
				tmpHtml += '<td width="5%"></td>';
				tmpHtml += '</tr>';*/
				tmpHtml += '</table>';
				tmpHtml += '<table width="100%" border=1 cellpadding=0 cellspacing=0 >';
				tmpHtml += '<tr style="line-height: 30px;">';
				tmpHtml += '<th width="30%" class="table_font" style="border-bottom: 1;border-left: 0;border-right: 1;border-top: 0;">账号</th>';
				tmpHtml += '<th width="10%" class="table_font" style="border-bottom: 1;border-left: 0;border-right: 1;border-top: 0;">币种</th>';
				tmpHtml += '<th width="20%" class="table_font" style="border-bottom: 1;border-left: 0;border-right: 1;border-top: 0;">余额（元）</th>';
				tmpHtml += '<th width="10%" class="table_font" style="border-bottom: 1;border-left: 0;border-right: 1;border-top: 0;">核对结果</th>';
				tmpHtml += '<th width="20%" class="table_font" style="border-bottom: 1;border-left: 0;border-right: 1;border-top: 0;">账单编号</th>';
				tmpHtml += '<th width="10%" class="table_font" style="border-bottom: 1;border-left: 0;border-right: 0;border-top: 0;">打印次数</th>';
				tmpHtml += '</tr>';

				//表内容
				var time = 0;
				for(var i=0;i<slcData.length;i++){
					tmpHtml += '<tr style="line-height: 17px;">';
					tmpHtml += '<td class="table_font" style="border-bottom: 0;border-left: 0;border-right: 1;border-top: 0;text-align:left;padding-left:2px;">' + slcData[i].Cst_AccNo + '</td>';
					tmpHtml += '<td class="table_font" style="border-bottom: 0;border-left: 0;border-right: 1;border-top: 0;text-align:center;padding-left:2px;">' + STM.corporateBill.getCoinType(slcData[i].CcyCd) + '</td>';
					tmpHtml += '<td class="table_font" style="border-bottom: 0;border-left: 0;border-right: 1;border-top: 0;text-align:right;padding-right:2px;">' + STM.corporateBill.getJE(slcData[i].Rglr_PnAmt) + '</td>';
					tmpHtml += '<td class="table_font" style="border-bottom: 0;border-left: 0;border-right: 1;border-top: 0;text-align:center;padding-left:2px;">' + STM.corporateBill.getAccFlag(slcData[i].Cur_Pcsg_StCd) + '</td>';
					tmpHtml += '<td class="table_font" style="border-bottom: 0;border-left: 0;border-right: 1;border-top: 0;text-align:center;padding-left:2px;">' + slcData[i].PdAr_ID + '</td>';
					tmpHtml += '<td class="table_font" style="border-bottom: 0;border-left: 0;border-right: 0;border-top: 0;text-align:center;padding-left:2px;white-space:nowrap;overflow-x:hidden;max-width:10px;">' + slcData[i].Prt_Cnt + '</td>';
					tmpHtml += '</tr>';
					time ++;
				}
				//不足30行需补空行
				if(time < 34){
					for(var j=0; j<(34 - time); j++){
						tmpHtml += '<tr style="line-height: 17px;" height="17px">';
						tmpHtml += '<td style="border-bottom: 0;border-left: 0;border-right: 1;border-top: 0;text-align:left;padding-left:2px;"></td>';
						tmpHtml += '<td style="border-bottom: 0;border-left: 0;border-right: 1;border-top: 0;text-align:center;padding-left:2px;"></td>';
						tmpHtml += '<td style="border-bottom: 0;border-left: 0;border-right: 1;border-top: 0;text-align:right;padding-right:2px;"></td>';
						tmpHtml += '<td style="border-bottom: 0;border-left: 0;border-right: 1;border-top: 0;text-align:center;padding-left:2px;"></td>';
						tmpHtml += '<td style="border-bottom: 0;border-left: 0;border-right: 1;border-top: 0;text-align:center;padding-left:2px;"></td>';
						tmpHtml += '<td style="border-bottom: 0;border-left: 0;border-right: 0;border-top: 0;text-align:center;padding-left:2px;white-space:nowrap;overflow-x:hidden;max-width:10px;"></td>';
						tmpHtml += '</tr>';
					}
				}
				//表尾
				tmpHtml += '</table>';
				tmpHtml += '<table width="100%">';
				tmpHtml += '<tr style="line-height: 17px;">';
				tmpHtml += '<td width="25%" class="table_font">打印时间：' + PJF.communication.getServerTime("yyyy-MM-dd HH:mm:ss") + '</td>';
				tmpHtml += '<td width="35%" class="table_font">打印机构：'+PJF.roleInfo.orgCode+'</td>';
				tmpHtml += '<td width="20%" class="table_font">打印柜员：' + PJF.otherInfo.devId + '</td>';
				

				if(STM.corporateBill.Txn_CardNo && STM.corporateBill.Txn_CardNo.length){
					tmpHtml += '<td width="20%" class="table_font">打印卡号：' + STM.corporateBill.Txn_CardNo + '</td>';
				}else{
					tmpHtml += '<td width="20%" class="table_font">&nbsp;</td>';
				}
				
				tmpHtml += '</tr>';
				tmpHtml += '</table>';
				tmpHtml += '<table width="100%">';
				tmpHtml += '<tr style="line-height: 17px;">';
				tmpHtml += '<td class="table_font" width="60%" align="left">注：本对账单仅限于银企双方核对账务使用，不作任何证明用途。</td>';
				tmpHtml += '</tr>';
				tmpHtml += '</table>';
				//tmpHtml += STM.corporateBill.addClientNoticeNew();
				//tmpHtml += STM.corporateBill.addClientNoticeEmpty();
				tmpHtml += '</div>';
				tmpHtml += '</div>';
				if(STM.corporateBill.ifUseChapter == 1){
					//电子印章
					tmpHtml += '<img id="elecImg" src="'+imgSrc+'" style="width: 152px;margin-top: 46%;margin-left: 77%;">';
				}
				PJF.html.append('preview_content', tmpHtml);
				document.getElementById('content_id').style.display = 'none';
				document.getElementById('preview_id').style.display = '';
			}
		},
		//处理数据并调用注册服务
    /**
     * @function divideDataAndReg
	 * @async
     * @param {String} num 打印成功数
     * @param {String}tmpArray 打印ID数组
     * 处理数据并调用注册服务
     */
		divideDataAndReg : function(num, tmpArray){
			//var tmpArray = STM.corporateBill.ValArray;
			var len = tmpArray.length;
			if(len > num){
				len = num;
			}
			var dealNum = STM.corporateBill.dealNum;
			var tmp;
			if(len > 0){
    			// 计算请求次数
    			var reqNum = (len % dealNum == 0)?len / dealNum:(Math.floor(len / dealNum))+1
				for(var i=0; i<reqNum; i++){
    				if(i == (reqNum-1)){
    					tmp = tmpArray.slice(i*dealNum, len);
    				} else {
    					tmp = tmpArray.slice(i*dealNum, (i + 1)*dealNum);
    				}
    				
    				//STM.corporateBill.jsonCMST00004.List_Val=tmp.join(',');
                    //11.16 CMST00004 ==> A0782T004
    				/*
                    STM.corporateBill.jsonCMST00004.VchId_Grp = tmp;
					STM.corporateBill.jsonCMST00004.OPR_NO = PJF.otherInfo.devId;
                    var succFuc = function(responseData) {
        				console.log('第' + (i+1) + '次打印登记成功');
        			};
        			STM.corporateBill.downLoadRegister(STM.corporateBill.jsonCMST00004,succFuc);VchID
        			*/
    				var succFuc = function(responseData) {
        				console.log('1206,第' + (i+1) + '次打印登记成功');
        			};
        			console.log('1208',PJF.util.json2str(tmp));
    				var Hd_Reg_Grp = tmp.map(function(item,i){
    					if(item.VchID){
    						return {VchID:item.VchID}
    					}else{
    						return {VchID:item}
    					}
    					
    					
    				});
    				var sendA07824604Data = {
    						Fdbk_Chnl_ID :'1',
    						Rgs_Opr_ID :'',
    						Mnplt_Dt_Tm :STM.corporateBill.printServiceTime||PJF.communication.getServerTime("yyyy-MM-dd HH:mm:ss"),
    						DpBkInNo :'',
    						Hd_Reg_Grp:Hd_Reg_Grp
    						}
    				console.log(1220,PJF.util.json2str(sendA07824604Data));
    				STM.corporateBill.downLoadRegister(sendA07824604Data,succFuc);
    			}
    			//清空数据
    			//STM.corporateBill.ValArray = new Array();
				if(STM.corporateBill.newValArray.length > 0){
					STM.corporateBill.newValArray = new Array();
					console.log("登记成功后清空STM.corporateBill.newValArray:"+PJF.util.json2str(STM.corporateBill.newValArray));
				}
			}
		},
		//下载登记服务
	/**
	 * @function downLoadRegister
	 * @async
	 * @param {String} jsonData 登记数据
	 * @param {Object} succFuc 登记成功回调
	 * 下载登记服务
	 */
		downLoadRegister : function(jsonData,succFuc){
			var fwTranId = STM.corporateBill.ledgerReg?'A07824615-HF':'A07824604-HF';//账页打印登记服务
			if(STM.corporateBill.ledgerReg){
				STM.corporateBill.ledgerReg = 0;
				if(jsonData.Hd_Reg_Grp){
					jsonData.Page_Reg_Grp = jsonData.Hd_Reg_Grp;
				}
				
			}else{
				
			}
			PJF.communication.cpsJsonReq({
				fwServiceId : "simpleTransaction",
				fwTranId : fwTranId,
				maskAll : true,
				jsonData : PJF.util.json2str(jsonData),
				success : succFuc,
				failure : function(responseData) {
					var msg = "A07824604-stm登记服务失败，错误码：" + responseData.BK_CODE + "<br>错误描述：" + responseData.BK_DESC+'<br>全局跟踪号:'+responseData._COMMON.SYS_EVT_TRACE_ID;
					console.log(msg);
					//STM.corporateBill.showErrorMsg(responseData, 'STM下载登记服务出错');
				}
			});
			/*
			jsonData.Txn_CardNo=STM.corporateBill.Txn_CardNo;
			jsonData.TrID=PJF.otherInfo.devId;//设备编号
            jsonData.Fee_Ind = "1";
			jsonData.MsgRp_Prt_Tm=STM.corporateBill.printServiceTime||PJF.communication.getServerTime("yyyy-MM-dd HH:mm:ss");//打印时间
            console.log("扫描时间为：------::"+jsonData.MsgRp_Prt_Tm);
            jsonData.CCBIns_ID=PJF.roleInfo.orgCode;
            //11.16 CMST00004 ==> A0782T004
            PJF.communication.cpsJsonReq({
				fwServiceId : "simpleTransaction",
				fwTranId : "A0782T004-stm",
				maskAll : true,
				jsonData : PJF.util.json2str(jsonData),
				success : succFuc,
				failure : function(responseData) {
					var msg = "A0782T004-stm登记服务失败，错误码：" + responseData.BK_CODE + "<br>错误描述：" + responseData.BK_DESC;
					console.log(msg);
					//STM.corporateBill.showErrorMsg(responseData, 'STM下载登记服务出错');
				}
			});*/
		},

	//查询所有回单数据并打印 11.16 CMST00002=>A0782T002
	/**
	 * @function queryAndPrintAllData
	 * @async
	 * @param {Object}jsonCMST00002 回单查询参数
	 * @param {Object}allData 存放数组
	 * @param {Object}vchIDs 回单凭证ID
	 * @param {String}times 循环次数
	 * @param {String}i 下标
	 * @param {String}fileSum 循环几次
	 * @param {String}j 下标
	 * 递归调用回单查询
	 */
		queryAndPrintAllData : function(jsonCMST00002, allData, vchIDs, times, i, fileSum, j,sendA07824601Data){
			jsonCMST00002._pagination = {'REC_IN_PAGE':'30','PAGE_JUMP': i + 1};
			sendA07824601Data._pagination = {'REC_IN_PAGE':'30','PAGE_JUMP': i + 1};
			//jsonCMST00002._pagination.PAGE_JUMP = i + 1;
			var tmpData = {};
			console.log("查询所有回单数据，循环第" + (i + 1) + "次A07824601-stm交易！");
			PJF.communication.cpsJsonReq({
				fwServiceId : "simpleTransaction",
				//fwTranId : "A0782T002-stm",
				//jsonData : PJF.util.json2str(jsonCMST00002),
				fwTranId : "A07824601-HF",
				jsonData : PJF.util.json2str(sendA07824601Data),
				success : function(responseData) {
					if(responseData.Hd_Grp){
						if(responseData.Hd_Grp.length){
							console.log('Hd_Grp长度:',responseData.Hd_Grp.length);
							var hdList = responseData.Hd_Grp;
								
							for(var t=0;t < hdList.length;t++){
								if(hdList[t].VchID){
									vchIDs += hdList[t].VchID + ',';
								}
							}
						}
                        tmpData.vchIDs = vchIDs.substring(0,vchIDs.length - 1);
                        tmpData.num = 30;
                        tmpData.pageNo = i;
                        allData[j]=tmpData;
                        vchIDs='';
                        j = j+1;
					}
					if(i+1 < times){
						STM.corporateBill.queryAndPrintAllData(jsonCMST00002, allData, vchIDs, times, i+1, fileSum, j,sendA07824601Data);
					} else {
						if(j < fileSum && '' != vchIDs){
							tmpData.vchIDs = vchIDs.substring(0,vchIDs.length - 1);
							tmpData.num = vchIDs.split(",").length - 1;
							tmpData.pageNo = (tmpData.num % 3 == 0)?tmpData.num / 3:(Math.floor(tmpData.num / 3))+1;
							allData[j]=tmpData;
						}
                        STM.corporateBill.printServiceTime = PJF.communication.getServerTime("yyyy-MM-dd HH:mm:ss");
                        console.log(1344,i,allData.length);
                        console.log("是否点击回单打印全部按钮："+STM.corporateBill.priAllCB);
                        if(STM.corporateBill.priAllCB == true){
							//@critical todo 这里处理继续打印数组 begin
							var len = 0;//回单截取长度
							if(STM.corporateBill.ifCluOrg == true){
								len = 10;
							}else{
								len = 20;
							}
							console.log("回单续打截取长度："+len);
							//@critical 组装循环打印数组
							STM.corporateBill.mergePrintArray(allData,len);
							if(STM.corporateBill.resArr && STM.corporateBill.resArr.length){
								var allDataCon = STM.corporateBill.resArr.shift();
								console.log("首次打印数据："+PJF.util.json2str(allDataCon));
								STM.corporateBill.printAllCBCon(allDataCon);
							}
						}else{
							STM.corporateBill.printAllCBCon(allData);
						}

						//end

                       /* //20200526修改为120笔回单40页pdf,保持以前逻辑不变，进行数组处理
						var number = 150;//150笔回单，一个pdf50页
						var allDataNew = STM.corporateBill.mergeSearchArray(number,allData,'');
						//STM.corporateBill.printAllCB(allData, prepareData, 0, 0.00, 0);
						STM.corporateBill.printAllCB(allDataNew, prepareData, 0, 0.00, 0);*/
					}
				},
				failure : function(responseData) {
					console.log("查询所有回单数据，循环第" + (i + 1) + "次A0782T002-stm交易报错！" + PJF.util.json2str(responseData));
					STM.corporateBill.showErrorMsg(responseData, '打印出错！');
					STM.corporateBill.loading.destroy();
					return;
				}
			});
		},
		//打印全部回单 11.16 CMST00003=>A0782T003
	/**
	 * @function printAllCB
	 * @async
	 * @param {Object}data 打印成功数据
	 * @param {Object}prepareData 准备接受数据
	 * @param {String}i 小标
	 * @param {String}money 收取费用
	 * @param {String}pageNo 打印成功张数
	 * 递归调用下载回单
	 */
		printAllCB : function(data, prepareData, i, money, pageNo) {
			var conf = {};
			conf.Stmp_Bsn_Ctlg_ID = "001";//默认传001
			conf.Stmp_Blng_InsID = PJF.roleInfo.orgCode;
			conf.VchID = "MXDY0CCMS00000000000000000000002";//回单
			conf.Mnplt_TpCd="03";//默认03：客户端查询
			STM.corporateBill.getElecChapter(conf,function(elec_flag){
				continuePrintAllCB(data, prepareData, i, money, pageNo,elec_flag);
			});
			function continuePrintAllCB(data, prepareData, i, money, pageNo,elec_flag) {
				
				console.log('continuePrintAllCB调用次数:'+i+',vchIDs长度:'+data[i].vchIDs.split(',').length+',elec_flag:'+elec_flag);
				var sendData = {
						Crd_ID: STM.corporateBill.Txn_CardNo,
						Fdbk_Chnl_ID: '1'
				}
				
				if(data[i] && data[i].vchIDs && data[i].vchIDs.length){
					sendData.Hd_Prt_Grp = data[i].vchIDs.split(',').map(function(item,i){
						return {
							VchID : item
						};
					});
					console.log('Hd_Prt_Grp:'+sendData.Hd_Prt_Grp.length);
					if(sendData.Hd_Prt_Grp.length && sendData.Hd_Prt_Grp.length>30){
						console.log('warn1432长度超过30:'+sendData.Hd_Prt_Grp.length);
						sendData.Hd_Prt_Grp = sendData.Hd_Prt_Grp.slice(0,30);
					}
					
					if(!STM.corporateBill.ValArray){
						STM.corporateBill.ValArray = new Array();
					}
					STM.corporateBill.ValArray = STM.corporateBill.ValArray.concat(sendData.Hd_Prt_Grp);
					//console.log(1409,PJF.util.json2str(STM.corporateBill.ValArray));
					console.log(1409);
				}else{
					/*sendData.Hd_Prt_Grp = data.map(function(item,i){
						return {
							VchID : item.vchIDs
						};
					});*/
				}
				
				if(sendData.Hd_Prt_Grp){
					pageNo += sendData.Hd_Prt_Grp.length;
				}
								
				PJF.communication.cpsJsonReq({
					fwServiceId : "simpleTransaction",
					fwTranId : "A07824603-HF",
					jsonData : PJF.util.json2str(sendData),
					success : function(responseData) {
						//console.log("（A07824603-stm）文件循环下载第" + (i+1) + "次交易成功：---------------------" + PJF.util.json2str(responseData));
						if(!responseData.Ths_FeeAmt){
							responseData.Ths_FeeAmt = 0;
						}
						money += parseFloat(responseData.Ths_FeeAmt);

						//tmpJson.fileName = STM.corporateBill.cutOutFilePath(responseData.File_Rte_FullNm);
						if(responseData._COMMON && responseData._COMMON.FILE_LIST_PACK && responseData._COMMON.FILE_LIST_PACK.FILE_INFO && responseData._COMMON.FILE_LIST_PACK.FILE_INFO.length){
							prepareData = prepareData.concat(responseData._COMMON.FILE_LIST_PACK.FILE_INFO) ;
							//console.log('prepareData-------------------'+PJF.util.json2str(prepareData))
						}
						//prepareData = prepareData.concat(responseData.File_List) ;
						if((i + 1) < data.length){
							STM.corporateBill.printAllCB(data, prepareData, i + 1, money, pageNo,elec_flag);
						} else {
							//@critical 下载文件到本地并打印
							//STM.corporateBill.doDownload(prepareData, 0, money, pageNo,elec_flag);
							var loadArray = prepareData.map(function(item,j){
								item.VchId_Grp = data[i].vchIDs.split(',').map(function(item,k){
									return {
										VchID : item
									};
								});
								return item;
							});
							//console.log('-----------loadArray-------------'+PJF.util.json2str(loadArray));
							STM.corporateBill.doDownload(loadArray, 0, money, pageNo,elec_flag);
						}
					},
					failure : function(responseData) {
						STM.corporateBill.showErrorMsg(responseData, '下载回单文件到P2出错');
						STM.corporateBill.loading.destroy();
						return;
					}
				});
				
				/*
				//请求发交易接收文件到P2服务器
				var list_val = data[i].vchIDs;
				STM.corporateBill.jsonCMST00003.MsgRp_Prt_Tm=STM.corporateBill.printServiceTime||PJF.communication.getServerTime("yyyy-MM-dd HH:mm:ss");//打印时间
				STM.corporateBill.jsonCMST00003.List_Val = list_val.split(',');
				STM.corporateBill.jsonCMST00003.Txn_CardNo = STM.corporateBill.Txn_CardNo;
				STM.corporateBill.jsonCMST00003.CCBIns_ID = PJF.roleInfo.orgCode;
				//STM.corporateBill.ValArray = STM.corporateBill.ValArray.concat(list_val.split(','));
				//11.16 改变登记传入参数
				var VchId_Grp = [];
				for(var j=0;j<STM.corporateBill.jsonCMST00003.List_Val.length;j++){
					VchId_Grp.push({VchID:STM.corporateBill.jsonCMST00003.List_Val[j]});
				}
				//STM.corporateBill.ValArray = STM.corporateBill.ValArray.concat(list_val.split(','));
				STM.corporateBill.ValArray = STM.corporateBill.ValArray.concat(VchId_Grp);
				STM.corporateBill.jsonCMST00003.VchId_Grp = VchId_Grp;
				//是否费用预算
				STM.corporateBill.jsonCMST00003.Fee_Ind="1";
				STM.corporateBill.jsonCMST00003.OPR_NO = PJF.otherInfo.devId;
				if(elec_flag == 1){
					STM.corporateBill.jsonCMST00003.Eltc_Stmp_Wthr_Us_Ind = 1;
				}else{
					STM.corporateBill.jsonCMST00003.Eltc_Stmp_Wthr_Us_Ind = 0;
				}
				pageNo += VchId_Grp.length;
				PJF.communication.cpsJsonReq({
					fwServiceId : "simpleTransaction",
					fwTranId : "A0782T003-stm",
					jsonData : PJF.util.json2str(STM.corporateBill.jsonCMST00003),
					success : function(responseData) {
						console.log("打印全部回单（A0782T003-stm）文件循环下载第" + (i+1) + "次交易成功：" + PJF.util.json2str(responseData));
						money += parseFloat(responseData.Ths_FeeAmt);

						//tmpJson.fileName = STM.corporateBill.cutOutFilePath(responseData.File_Rte_FullNm);
						prepareData = prepareData.concat(responseData.File_List) ;
						if((i + 1) < data.length){
							STM.corporateBill.printAllCB(data, prepareData, i + 1, money, pageNo,elec_flag);
						} else {
							//@critical 下载文件到本地并打印
							STM.corporateBill.doDownload(prepareData, 0, money, pageNo,elec_flag);
						}
					},
					failure : function(responseData) {
						STM.corporateBill.showErrorMsg(responseData, '下载回单文件到P2出错');
						STM.corporateBill.loading.destroy();
						return;
					}
				});*/
			}
		},
		//下载文件
	/**
	 * @function doDownload
	 * @param {Object}data 回单数据
	 * @param {String}i 小标
	 * @param {String}money 收取费用
	 * @param {String}pageNo 打印成功张数
	 * @param {String}elec_flag 是否使用电子印章
	 * 递归调用回单下载
	 */
		doDownload : function(data, i, money, pageNo,elec_flag) {
			
			var fileName = STM.corporateBill.cutOutFilePath(data[i].FILE_NAME);
            var fileExistUrl = STM.corporateBill.existUrl + fileName;
			var downUrl = STM.corporateBill.url + fileName;
            //@critical 判读下载文件是否存在
            if(!STM.corporateBill.isFileExist(fileExistUrl)){
                STM.corporateBill.showPrintErrorMsg('回单文件不存在，下载失败', null);
                STM.corporateBill.loading.destroy();
                return;
            }
			//@critical 文件下载路径
			var locUrl = STM.corporateBill.localUrl + fileName;
			data[i].locUrl = locUrl;
			//console.log('-------------'+PJF.util.json2str(data)+'------------');
            PJF.util.simpleDownload(locUrl, downUrl, function(d){
                console.log(i,"下载返回成功！！！" + PJF.util.json2str(d));
                if(d.success){//成功
                	console.log(1526,i,data.length);
                    if(i == (data.length - 1)){//最后一次下载文件成功
                        STM.corporateBill.loading.destroy();
                        var func = function(){
                            //@critical 预热打印机
                        	console.log(1532)
                            PJF.stm.HDP.preparePrinter({}, function(prepareRes){
                            	console.log('-----------------elec_flag:'+elec_flag,prepareRes.status);
                                if('1' == prepareRes.status){//预热成功
                                	// @critical 如果使用电子印章则无需发此交易
									if(elec_flag == 1){
										STM.corporateBill.doPrintFile(data, 0, 0,elec_flag);
									}else{
										console.log(1539);
										PJF.communication.cpsJsonReq({
											fwServiceId:'stm.queryApplicationParam',
											fwTranId:"stm.queryApplicationParam",
											jsonData:PJF.util.json2str({param_id:"STM_BILL_SELF",ins_id:PJF.roleInfo.orgCode,device_id:PJF.otherInfo.devId}),
											url:'ecpJson.action',
											success:function(respData){
												console.log(1546,elec_flag,JSON.stringify(respData));
												data.iChapterType ="2";
												if(respData.RESULT_DATA&&respData.RESULT_DATA.length>0){
													if(respData.RESULT_DATA[0].stampType=="01"){
														data.iChapterType=7;//盖章模式（详见说明文档）
													}
												}else{
													data.iChapterType=7;//盖章模式（详见说明文档）
												}
												//console.log(1589,PJF.util.json2str(data));
												STM.corporateBill.doPrintFile(data, 0, 0,elec_flag);

											},
											failure : function(responseData) {
												STM.corporateBill.showErrorMsg(responseData);
											}
										});
									}
                                } else {
                                	
                                	STM.corporateBill.showPrintErrorMsg(prepareRes.errorMsg+"，请退卡后呼叫工作人员处理", prepareRes.errorCode);	
                                	console.log(1602,'打印无callback',data.length,i);
                                }
                            });
                        };
                        console.log(1603,pageNo);
                        STM.corporateBill.confirmDeductMoneyByCB(pageNo, money, func);
                    } else {// @critical 递归调用下载
                        STM.corporateBill.doDownload(data, i+1, money, pageNo,elec_flag);
                    }
                }else{//失败
                    STM.corporateBill.loading.destroy();
                    console.log("回单文件循环第" + (i+1) + "次下载回调失败");
                    STM.corporateBill.showPrintErrorMsg('回单文件下载回调失败', null);
                }
            });
            /*//下载
			PJF.communication.FileDownload.Add(locUrl, downUrl);
			//去掉下载监听
			PJF.event.removeSubscriber(PJF.PadClientEvents.download.completed);
			PJF.event.removeSubscriber(PJF.PadClientEvents.download.failed);
			//下载回调成功处理
			PJF.event.addSubscriber(PJF.PadClientEvents.download.completed, function(fileName, a, b, status) {
				if(i == (data.length - 1)){//最后一次下载文件成功
					STM.corporateBill.loading.destroy();
					
					var func = function(){
						//预热打印机
						PJF.stm.HDP.preparePrinter({}, function(prepareRes){
							if('1' == prepareRes.status){//预热成功
								STM.corporateBill.doPrintFile(data, 0, 1);
							} else {
								STM.corporateBill.showPrintErrorMsg(prepareRes.errorMsg, prepareRes.errorCode);
							}
						});
					};
					STM.corporateBill.confirmDeductMoneyByCB(pageNo, money, func);
				} else {//递归调用下载
					STM.corporateBill.doDownload(data, i+1, money, pageNo);
				}
			});
			//下载回调失败处理
			PJF.event.addSubscriber(PJF.PadClientEvents.download.failed, function(fileName, a, b, status) {
				STM.corporateBill.loading.destroy();
				console.log("回单文件循环第" + (i+1) + "次下载回调失败");
				STM.corporateBill.showPrintErrorMsg('回单文件下载回调失败', null);
			});*/
		},
		//打印文件
	/**
	 * @function doPrintFile
	 * @param {Object}data 打印回单数据
	 * @param {String}i 下标
	 * @param {String}printSuccNum 打印成功张数
	 * @param {String}elec_flag 是否使用电子印章
	 * 打印文件
	 */
		doPrintFile: function(data, i, printSuccNum,elec_flag){
			console.log(1657,data.length,i);
			
			/*if(data.length == 2){
				i = 1;
			}*/
			/*var startArgs={};
			startArgs.iTotalPaperNum=data[i].pageNo;//指定预期打印的回单张数
			startArgs.iSlotType=2;//修改为盖横章2;//指定需要使用的纸槽
								  //1－1号纸槽（单联回单纸）
								  //2－2号纸槽（三联回单纸，尺寸同A4纸）
								  //3－3号纸槽（账页纸，尺寸同A4纸）
								  //4－4号纸槽（1/2 A4大小回单，尺寸同1/2 A4纸）预留
			startArgs.iChapterType=7;//盖章模式（详见说明文档）
			startArgs.pchChapterPos='60|155|245';//盖章位置（详见说明文档）
			startArgs.iChapterNum=data[i].num;//一共盖章的个数
			startArgs.printFilePath = data[i].locUrl;//打印文件路径
			
			var preCode = PJF.roleInfo.orgCode.substr(0,3);
			if((preCode != '442') || STM.corporateBill.orgCode[PJF.roleInfo.orgCode]){
				startArgs.iChapterType=2;//盖章模式（详见说明文档）
			}*/
			var File_Rte_FullNm = data[i].File_Rte_FullNm ? data[i].File_Rte_FullNm : data[i].FILE_NAME;
			console.log('File_Rte_FullNm-----------------' + File_Rte_FullNm);
            var dwurl= STM.corporateBill.localUrl + File_Rte_FullNm;
            var startArgs={};
            //startArgs.iTotalPaperNum=1;//pageNo;//指定预期打印的回单张数
            //11.16 支持多个打印方式
            //var ppr_Type = data[i].Ppr_TpCd;
            var ppr_Type = File_Rte_FullNm.substr(0,2);
            var printNum = data[i].VchId_Grp.length;
            console.log("打印类型数据=="+i+"=="+ppr_Type);
			console.log("是否使用电子印章elec_flag："+elec_flag);
            if(elec_flag == 1){
				if(ppr_Type=="01"){ //01:1/3 A4
					//@critical1/3A4例外，盖章模式要给1，但盖章个数给0，这样如果某些厂商没有升级那么就会盖两个章
					startArgs.iSlotType=1;
					startArgs.iChapterType=1;
					startArgs.pchChapterPos='0';
					startArgs.iChapterNum=0;
					startArgs.iTotalPaperNum = printNum;
				}
				if(ppr_Type=="02"){ //A4
					startArgs.iSlotType=3;
					startArgs.iChapterType=6;//不盖章横向打印
					startArgs.pchChapterPos='0';
					startArgs.iChapterNum=0;
					startArgs.iTotalPaperNum = printNum;
				}
				if(ppr_Type=="03"){ //03:带折痕A4,
					startArgs.iSlotType=2;
					startArgs.iChapterType=0;//不盖章纵向打印
					startArgs.pchChapterPos='0';
					startArgs.iChapterNum=0;
					startArgs.iTotalPaperNum = (printNum % 3 == 0)?printNum / 3:(Math.floor(printNum / 3))+1;
				}
			}else{
				if(ppr_Type=="01"){ //01:1/3 A4
					startArgs.iSlotType=1;
					startArgs.iChapterType=1;
					//startArgs.pchChapterPos='155';
					//startArgs.iChapterNum=printNum;
					startArgs.pchChapterPos='0';
					startArgs.iChapterNum=0;
					startArgs.iTotalPaperNum = printNum;
				}
				if(ppr_Type=="02"){ //01:1/3 A4
					startArgs.iSlotType=3;
					startArgs.iChapterType=4;
					startArgs.pchChapterPos='245';
					startArgs.iChapterNum=printNum;
					startArgs.iTotalPaperNum = printNum;
				}
				if(ppr_Type=="03"){ //03:带折痕A4
					startArgs.iSlotType=2;
					startArgs.iChapterType=data.iChapterType||"7";
					startArgs.pchChapterPos='60|155|245';
					startArgs.iChapterNum=printNum;
					startArgs.iTotalPaperNum = (printNum % 3 == 0)?printNum / 3:(Math.floor(printNum / 3))+1;
				}
			}
            startArgs.printFilePath=dwurl;//打印文件路径
            var preCode = PJF.roleInfo.orgCode.substr(0,3);
            console.log("打印返回数据"+i+"=="+JSON.stringify(startArgs));
            //@critical1开始打印回单
            PJF.stm.HDP.startPrintReceipt(startArgs, function(startPrintRes){
            	console.log(1739,'进入回调',startPrintRes.status);
                if('1' == startPrintRes.status){//@critical1打印成功
                	console.log("打印成功凭证号："+JSON.stringify(data[i].VchId_Grp),data.length,i);
					STM.corporateBill.newValArray = STM.corporateBill.newValArray.concat(data[i].VchId_Grp);
					if(i == (data.length - 1)){//@critical1最后一次打印成功
						console.log('分支1');
                        printSuccNum = STM.corporateBill.ValArray.length;// 记录打印成功次数
                        console.log(1706,PJF.util.json2str(STM.corporateBill.ValArray),printSuccNum);
                        if(STM.corporateBill.ValArray.length > 0 && printSuccNum > 0){
                            STM.corporateBill.divideDataAndReg(printSuccNum, STM.corporateBill.ValArray);
                        }
                        //@critical1打印完成，登记之后，直到打印全部回单，继续打印完成之后才去结束页面
						console.log("是否是点击了回单打印全部按钮："+STM.corporateBill.priAllCB);
						if(STM.corporateBill.priAllCB == true){
							if(STM.corporateBill.resArr && STM.corporateBill.resArr.length){
								var allDataCon = STM.corporateBill.resArr.shift();
								console.log("继续打印回单条数："+PJF.util.json2str(allDataCon));
								//@critical1继续打印,loading继续,在最后一次文件下载完成时被destory()掉，重新new一个遮罩。
								//即时destory()掉之后，这个对象还在
								if(STM.corporateBill.loading){
									STM.corporateBill.loading = null;
								}
								STM.corporateBill.loading = new PJF.ui.loading({msg:'业务正在处理中，请稍候……'});
								STM.corporateBill.printAllCBCon(allDataCon);
							}else{
								STM.corporateBill.finishPrint();
							}
						}else{
							STM.corporateBill.finishPrint();
						}
                    } else {//@critical1递归调用打印
                    	console.log('分支2');
                        //printSuccNum = printSuccNum + (parseInt(startPrintRes.info.printProgressData) || 0)*3;// 记录打印成功次数
                        //var ppr_Type = data[i].Ppr_TpCd;
                    	var File_Rte_FullNm = data[i].File_Rte_FullNm ? data[i].File_Rte_FullNm : data[i].FILE_NAME;
                    	var ppr_Type = File_Rte_FullNm.File_Rte_FullNm.substr(0,2);
                        //var printSuccNum =0;
                        if(ppr_Type=="01"){ //01:1/3 A4
                            printSuccNum += parseInt(startPrintRes.info.printProgressData)||0;
                        }
                        if(ppr_Type=="02"){ //01:1/3 A4
                            printSuccNum += parseInt(startPrintRes.info.printProgressData)||0;
                        }
                        if(ppr_Type=="03"){ //03:带折痕A4
                            printSuccNum += (parseInt(startPrintRes.info.printProgressData) || 0)*3
                        }
                        console.log('递归调用打印',ppr_Type,printSuccNum);
                        STM.corporateBill.doPrintFile(data, i+1, printSuccNum,elec_flag);
                    }
                } else {
                	if((data.length==2) && (i==0)){
                		var File_Rte_FullNm = data[1].File_Rte_FullNm ? data[1].File_Rte_FullNm : data[1].FILE_NAME;
                		var fileExistUrl = STM.corporateBill.existUrl + File_Rte_FullNm;
                		console.log(1796,STM.corporateBill.isFileExist(fileExistUrl));
                		var ppr_Type = File_Rte_FullNm.substr(0,2);
                        if(ppr_Type=="01"){ //01:1/3 A4
                            printSuccNum += parseInt(startPrintRes.info.printProgressData)||0;
                        }
                        if(ppr_Type=="02"){ //01:1/3 A4
                            printSuccNum += parseInt(startPrintRes.info.printProgressData)||0;
                        }
                        if(ppr_Type=="03"){ //03:带折痕A4
                            printSuccNum += (parseInt(startPrintRes.info.printProgressData) || 0)*3
                        }
                        console.log('打印第二张',ppr_Type,printSuccNum,elec_flag);
                        //STM.corporateBill.doPrintFile(data, i+1, 0, elec_flag);
                	}else if((data.length==2) && (i==1)){
						console.log('分支3');
                        printSuccNum = STM.corporateBill.ValArray.length;// 记录打印成功次数
                        if(STM.corporateBill.ValArray.length > 0 && printSuccNum > 0){
                            STM.corporateBill.divideDataAndReg(printSuccNum, STM.corporateBill.ValArray);
                        }
                        //@critical1打印完成，登记之后，直到打印全部回单，继续打印完成之后才去结束页面
						console.log("是否是点击了回单打印全部按钮："+STM.corporateBill.priAllCB);
						if(STM.corporateBill.priAllCB == true){
							if(STM.corporateBill.resArr && STM.corporateBill.resArr.length){
								var allDataCon = STM.corporateBill.resArr.shift();
								console.log("继续打印回单条数："+PJF.util.json2str(allDataCon));
								//@critical1继续打印,loading继续,在最后一次文件下载完成时被destory()掉，重新new一个遮罩。
								//即时destory()掉之后，这个对象还在
								if(STM.corporateBill.loading){
									STM.corporateBill.loading = null;
								}
								STM.corporateBill.loading = new PJF.ui.loading({msg:'业务正在处理中，请稍候……'});
								STM.corporateBill.printAllCBCon(allDataCon);
							}else{
								STM.corporateBill.finishPrint();
							}
						}else{
							STM.corporateBill.finishPrint();
						}
                	}
                	else{
                    console.log('打印出错：' + PJF.util.json2str(startPrintRes));
                    var ppr_Type = data[i].Ppr_TpCd;
                    var printProNum = 0;
                    if(ppr_Type=="01"){ //01:1/3 A4
                        printSuccNum += parseInt(startPrintRes.info.printProgressData)||0;
						printProNum = parseInt(startPrintRes.info.printProgressData)||0;
                    }
                    if(ppr_Type=="02"){ //01:1/3 A4
                        printSuccNum += parseInt(startPrintRes.info.printProgressData)||0;
						printProNum = parseInt(startPrintRes.info.printProgressData)||0;
                    }
                    if(ppr_Type=="03"){ //03:带折痕A4
                        printSuccNum += (parseInt(startPrintRes.info.printProgressData) || 0)*3;
						printProNum = (parseInt(startPrintRes.info.printProgressData) || 0)*3
                    }
                    if(printSuccNum > 0){
                    	if(printProNum != 0){
							console.log("打印出错,要打印的凭证号："+JSON.stringify(data[i].VchId_Grp));
							console.log("事件返回已打印的凭证数："+printProNum);
							var arr_VchId_Grp = data[i].VchId_Grp;
							STM.corporateBill.newValArray = STM.corporateBill.newValArray.concat(arr_VchId_Grp.slice(0,printProNum));
						}
						console.log("打印失败，已打印的凭证id:"+JSON.stringify(STM.corporateBill.newValArray));
                        //11.16 不同的打印方式打印成功的张数不同

                        //var printSuccNum =0;
                        //printSuccNum = printSuccNum + (parseInt(startPrintRes.info.printProgressData) || 0)*3;// 记录打印成功次数
                        if(STM.corporateBill.newValArray.length > 0 && printSuccNum > 0){
                            //STM.corporateBill.divideDataAndReg(printSuccNum,STM.corporateBill.ValArray);
							//@critical1报错，有失败就用后台返回组装的去登记
							STM.corporateBill.divideDataAndReg(printSuccNum,STM.corporateBill.newValArray);
                        }
                        var errorMsg = '打印过程中出错，已打印' + printSuccNum
                            + '条，未打印' + (STM.corporateBill.ValArray.length - printSuccNum) + '条，请退卡后呼叫工作人员处理';
                        var fuc = function(){
                            STM.corporateBill.finishPrint();
                        };
                        STM.corporateBill.showPrintErrorMsgAndGetPaper(errorMsg, startPrintRes, fuc);
                    } else {
                        STM.corporateBill.showPrintErrorMsg(startPrintRes.errorMsg+"，请退卡后呼叫工作人员处理", startPrintRes.errorCode);
                        console.log(1830,'打印无callback',data.length,i);
                    }
                }
                }
            });
		},
		//查询所有附件数据并打印
	/**
	 * @function  queryAndPrintAllAttachment
	 * @async
	 * @param {Object}jsonCMST00015 附件查询条件
	 * @param {Object}allData 接收数组
	 * @param {Object}vchIDs 附件凭证ID
	 * @param {String}times 查询次数
	 * @param {String}i 下标
	 * @param {String}fileSum查询次数
	 * @param {String}j 下标
	 * 递归调用附件查询
	 */
		queryAndPrintAllAttachment : function(jsonCMST00015, allData, vchIDs, times, i, fileSum, j){
			jsonCMST00015._pagination = {'REC_IN_PAGE':'30','PAGE_JUMP': i + 1};
			var tmpData = {};
			console.log("查询所有附件数据，循环第" + (i + 1) + "次，A0782T015-stm交易！");
			PJF.communication.cpsJsonReq({
				fwServiceId : "simpleTransaction",
                fwTranId : 'A0782T015-stm',   //11.16 CMST00015=>A0782T015
				jsonData : PJF.util.json2str(jsonCMST00015),
				success : function(responseData) {
					if(responseData.Qry_GRP){
						if(responseData.Qry_GRP.length){
							for(var t=0;t<responseData.Qry_GRP.length;t++){
								if(responseData.Qry_GRP[t].VchID){
									vchIDs += responseData.Qry_GRP[t].VchID + ',';
								}
							}
						} else {
							if(responseData.Qry_GRP.VchID){
								vchIDs += responseData.Qry_GRP.VchID + ',';
							}
						}
						
						if(31 == vchIDs.split(",").length){//30条数据收集一下
							tmpData.vchIDs = vchIDs.substring(0,vchIDs.length - 1);
							allData[j]=tmpData;
							
							vchIDs='';
							j = j+1;
						}
					}
					
					if(i+1 < times){
						STM.corporateBill.queryAndPrintAllAttachment(jsonCMST00015, allData, vchIDs, times, i+1, fileSum, j);
					} else {
						if(j < fileSum && '' != vchIDs){
							tmpData.vchIDs = vchIDs.substring(0,vchIDs.length - 1);
							allData[j]=tmpData;
						}
						
						STM.corporateBill.ValArray = new Array();
						var prepareData = new Array();
						console.log("A0782T015-stm交易返回vchIDs："+PJF.util.json2str(allData));
						//STM.corporateBill.printAllAttachment(allData, prepareData, 0, 0.00,0);
						var number = 150;
						var allDataNew = STM.corporateBill.mergeSearchArray(number,allData,'');
						STM.corporateBill.printAllAttachment(allDataNew, prepareData, 0, 0.00,0);
					}
				},
				failure : function(responseData) {
					console.log("查询所有附件数据，循环第" + (i + 1) + "次A0782T015-stm交易报错！" + PJF.util.json2str(responseData));
					STM.corporateBill.showErrorMsg(responseData, '打印出错！');
					STM.corporateBill.loading.destroy();
					return;
				}
			});
		},
	/**
	 * @function printAllAttachment
	 * @async
	 * @param {Object}data 附件数据
	 * @param {Object}prepareData 接收数据
	 * @param {String}i 下标
	 * @param {String}money 收取费用
	 * @param {String}pageNo 打印成功数
	 * 递归调用下载附件
	 */
		printAllAttachment : function(data, prepareData, i, money,pageNo) {
			var conf = {};
			conf.Stmp_Bsn_Ctlg_ID = "001";//默认传001
			conf.Stmp_Blng_InsID = PJF.roleInfo.orgCode;
			conf.VchID = "MXDY0CCMS00000000000000000000002";//回单
			conf.Mnplt_TpCd="03";//默认03：客户端查询
			STM.corporateBill.getElecChapter(conf,function(elec_flag){
				continuePrintAllAttachment(data, prepareData, i, money, pageNo,elec_flag);
			});
			function continuePrintAllAttachment(data, prepareData, i, money, pageNo, elec_flag) {
				//@critical请求发交易接收文件到P2服务器
				var list_val = data[i].vchIDs;
				STM.corporateBill.jsonCMST00016.List_Val = list_val.split(',');
				STM.corporateBill.jsonCMST00016.MsgRp_Prt_Tm=STM.corporateBill.printServiceTime||PJF.communication.getServerTime("yyyy-MM-dd HH:mm:ss");//打印时间
				console.log("附件下载时间为：------::"+STM.corporateBill.jsonCMST00016.MsgRp_Prt_Tm);
				STM.corporateBill.jsonCMST00016.Txn_CardNo = STM.corporateBill.Txn_CardNo;
				STM.corporateBill.jsonCMST00016.CCBIns_ID = PJF.roleInfo.orgCode;

				//STM.corporateBill.ValArray = STM.corporateBill.ValArray.concat(list_val.split(','));
				//11.16 改变登记传入参数
				var VchId_Grp = [];
				for(var j=0;j<STM.corporateBill.jsonCMST00016.List_Val.length;j++){
					VchId_Grp.push({VchID:STM.corporateBill.jsonCMST00016.List_Val[j]});
				}
				//STM.corporateBill.ValArray = STM.corporateBill.ValArray.concat(list_val.split(','));
				STM.corporateBill.ValArray = STM.corporateBill.ValArray.concat(VchId_Grp);
				STM.corporateBill.jsonCMST00016.VchId_Grp=VchId_Grp;
				STM.corporateBill.jsonCMST00016.Fee_Ind = "1";
				STM.corporateBill.jsonCMST00016.OPR_NO = PJF.otherInfo.devId;
				if(elec_flag == 1){
					STM.corporateBill.jsonCMST00016.Eltc_Stmp_Wthr_Us_Ind = 1;
				}else{
					STM.corporateBill.jsonCMST00016.Eltc_Stmp_Wthr_Us_Ind = 0;
				}
				//var tmpJson = {};
				pageNo += VchId_Grp.length;
				PJF.communication.cpsJsonReq({
					fwServiceId : "simpleTransaction",
					fwTranId : "A0782T016-stm",//CMST00016=>A0782T016
					jsonData : PJF.util.json2str(STM.corporateBill.jsonCMST00016),
					success : function(responseData) {
						console.log("打印全部回单（A0782T016-stm）文件循环下载第" + (i+1) + "次交易成功：" + PJF.util.json2str(responseData));
						money += parseFloat(responseData.Ths_FeeAmt);
						prepareData = prepareData.concat(responseData.File_List) ;
						if((i + 1) < data.length){
							STM.corporateBill.printAllAttachment(data, prepareData, i + 1, money,pageNo,elec_flag);
						} else {
							//@critical下载文件到本地并打印
							STM.corporateBill.doDownload(prepareData, 0, money, pageNo,elec_flag);
						}
						/*if((i + 1) < data.length){
                            STM.corporateBill.printAllAttachment(data, prepareData, i + 1, money);
                        } else {
                            //先清空隐藏内容
                            PJF.html.empty('printCBHtml');
                            //下载文件到本地并打印
                            var htmlData = new Array();
                            //凭证数据
                            var voucherArray = new Array();
                            STM.corporateBill.ValHtmlArray = new Array();
                            STM.corporateBill.ValVoucherArray = new Array();
                            STM.corporateBill.createAllAttachmentHtml(prepareData, 0, htmlData, money, 0, voucherArray);
                        }*/
					},
					failure : function(responseData) {
						STM.corporateBill.showErrorMsg(responseData, '下载回单文件到P2出错');
						STM.corporateBill.loading.destroy();
						return;
					}
				});
			}


		},
		//创建回单附件html文件
	/**
	 * @function createAllAttachmentHtml
	 * @param {Object}data 打印数据
	 * @param {String}i 下标
	 * @param {Object}htmlData 接收数组
	 * @param {String}money 收取费用
	 * @param {String}pageNo 打印成功张数
	 * @param {Object}voucherArray 接收数组
	 * 创建回单附件html文件
	 * 预热打印
	 */
		createAllAttachmentHtml : function(data, i, htmlData, money, pageNo, voucherArray) {
			if(i == (data.length - 1)){//最后一次下载文件成功
				var func = function(){
					STM.corporateBill.loading.destroy();
					htmlData.push(PJF.util.saveHtml("printCBHtml"));
					PJF.stm.HDP.preparePrinter({}, function(prepareRes){
						if('1' == prepareRes.status){
							STM.corporateBill.doPrintCBHtmlAndVoucher(htmlData, 0, pageNo, voucherArray);
						} else {
							STM.corporateBill.showPrintErrorMsg(prepareRes.errorMsg, prepareRes.errorCode);
						}
					});
				};
				STM.corporateBill.confirmDeductMoney(pageNo, money, func);
			} else {//递归调用下载
				STM.corporateBill.createAllAttachmentHtml(data, i+1, htmlData, money, pageNo, voucherArray);
			}
		},
		//获取xml文件内容
	//20200717 不用代码 涉及到PJF.communication.ajax 注释
	/**
	 * @function getXmlData
	 * @param {Object}xmlPath 文件名
	 * @returns {Object} bak 请求回来的文件数据
	 * 获取xml文件内容
	 */
		getXmlData : function(xmlPath){
			var bak = null;
			var uuid = PJF.communication.GetUniqueNo().result;
			PJF.communication.ajax({
	            url: 'getLocalFile.action?relativePath=stm/bill&fileName=' + xmlPath + '&ATCH_BTCH_NO=' + uuid,
	            dataType: 'xml',
	            async: false,
				safe:true,
	            success: function (data) {
	            	bak = data;
	            },
	            failure: function (data) {
	            	STM.corporateBill.showErrorMsg(data, '读取xml文件内容出错');
	            	bak = null;
	            }
	        });
			return bak;
		},
		//生成对账清单html内容
	/**
	 * @function createCMST00014Html
	 * @param this_ js对象
	 * @returns {string} 返回拼接的html
	 * 生成对账清单html内容
	 */
		createCMST00014Html : function(this_){
			var tmp;
			var time;
			var array;
			var tmpHtml = '';
			
			var content = 'branch-czdzqd-' + $(this_).find('head').attr('id') + '-' + (parseInt($(this_).find('head').attr('print_cnts')) + 1)
			+ '-' + PJF.util.formatDate(new Date(),"yyyy") + '-' + $(this_).find('head').attr('qr_str');
			var codeImage = STM.corporateBill.createQRCode(content);
			
			//统一样式
			tmpHtml += '<style>';
			tmpHtml += '.th_left{border-bottom: 1;border-left: 0;border-right: 1;border-top: 0;}';
			tmpHtml += '.th_right{border-bottom: 1;border-left: 0;border-right: 0;border-top: 0;}';
			tmpHtml += '.td_left{border-bottom: 0;border-left: 0;border-right: 1;border-top: 0;}';
			tmpHtml += '.td_right{border-bottom: 0;border-left: 0;border-right: 0;border-top: 0;}';
			tmpHtml += '.text_left{padding-left:2px;}';
			tmpHtml += '.text_right{text-align:right;padding-right:2px;}';
			tmpHtml += '.td_jq{white-space:nowrap;overflow-x:hidden;max-width:10px;}';
			tmpHtml += '</style>';
			
			//表头
			tmpHtml += '<div style="font-size: 13px;">';
			tmpHtml += '<table width="100%" >';
			tmpHtml += '<tr>';
			tmpHtml += '<td width="30%" colspan=3><h3 align="center" style="font-size: 22px;padding-left:170px;">集团流动性管理账户对账清单</h3></td>';
			tmpHtml += '<td width="55%"></td>';
			tmpHtml += '<td width="10%"></td>';
			tmpHtml += '<td width="5%" rowspan=3><img style="padding-top: 20px;" src="' + codeImage + '" alt="" align="left" height="80" width="80" /></td>';
			tmpHtml += '</tr>';
			tmpHtml += '<tr style="line-height: 17px;">';
			tmpHtml += '<td width="30%">币别：' + $(this_).find('head').attr('cur_code') + '</td>';
			tmpHtml += '<td width="55%">钞汇鉴别：' + $(this_).find('head').attr('cur_iden') + '</td>';
			tmpHtml += '<td width="10%"></td>';
			tmpHtml += '<td width="5%"></td>';
			tmpHtml += '</tr>';
			tmpHtml += '<tr style="line-height: 17px;">';
			tmpHtml += '<td width="30%">账号：' + $(this_).find('head').attr('acct_no') + '</td>';
			tmpHtml += '<td width="55%">账户名称：' + $(this_).find('head').attr('fs_acctname') + '</td>';
			tmpHtml += '<td width="10%">页码：' + $(this_).find('head').attr('page_no') + '</td>';
			tmpHtml += '<td width="5%"></td>';
			tmpHtml += '</tr>';
			tmpHtml += '</table>';
			tmpHtml += '<table width="100%" border=1 cellpadding=0 cellspacing=0 >';
			tmpHtml += '<tr style="line-height: 30px;">';
			tmpHtml += '<th width="5%" class="th_left">交易日期</th>';
			tmpHtml += '<th width="6%" class="th_left">凭证种类</th>';
			tmpHtml += '<th width="11%" class="th_left">交易流水号</th>';
			tmpHtml += '<th width="10%" class="th_left">摘要</th>';
			tmpHtml += '<th width="10%" class="th_left">借方发生额</th>';
			tmpHtml += '<th width="10%" class="th_left">贷方发生额</th>';
			tmpHtml += '<th width="11%" class="th_left">余额</th>';
			tmpHtml += '<th width="15%" class="th_left">对方账号</th>';
			tmpHtml += '<th width="22%" class="th_right">对方户名</th>';
			tmpHtml += '</tr>';
			
			//表内容
			time = 0;
			$(this_).find('item').each(function(){
				tmpHtml += '<tr style="line-height: 16.7px;">';
				
				tmp = $(this).text();
				array = tmp.split(' ■ ');
				
				tmpHtml += '<td class="td_left text_left">' + array[2].trim() + '</td>';
				tmpHtml += '<td class="td_left text_left td_jq">' + array[5].trim() + '</td>';
				tmpHtml += '<td class="td_left text_left td_jq">' + array[3].trim() + '</td>';
				tmpHtml += '<td class="td_left text_left td_jq">' + array[6].trim() + '</td>';
				tmpHtml += '<td class="td_left text_right td_jq">' + STM.corporateBill.getJE(array[7].trim()) + '</td>';
				tmpHtml += '<td class="td_left text_right td_jq">' + STM.corporateBill.getJE(array[8].trim()) + '</td>';
				tmpHtml += '<td class="td_left text_right td_jq">' + STM.corporateBill.getJE(array[9].trim()) + '</td>';
				tmpHtml += '<td class="td_left text_left td_jq">' + array[14].trim() + '</td>';
				tmpHtml += '<td class="td_right text_left td_jq">' + array[15].trim() + '</td>';
				
				tmpHtml += '</tr>';
				time ++;
			});
			
			//@critical 不足30行需补空行
			if(time < 30){
				for(var j=0; j<(30 - time); j++){
					tmpHtml += '<tr style="line-height: 16.7px;">';
					tmpHtml += '<td class="td_left">&nbsp;</td>';
					tmpHtml += '<td class="td_left">&nbsp;</td>';
					tmpHtml += '<td class="td_left">&nbsp;</td>';
					tmpHtml += '<td class="td_left">&nbsp;</td>';
					tmpHtml += '<td class="td_left">&nbsp;</td>';
					tmpHtml += '<td class="td_left">&nbsp;</td>';
					tmpHtml += '<td class="td_left">&nbsp;</td>';
					tmpHtml += '<td class="td_left">&nbsp;</td>';
					tmpHtml += '<td class="td_right">&nbsp;</td>';
					tmpHtml += '</tr>';
				}
			}
			
			//表尾
			tmpHtml += '</table>';
			tmpHtml += '<table width="100%">';
			tmpHtml += '<tr style="line-height: 17px;">';
			tmpHtml += '<td width="25%">打印时间：' + $(this_).find('head').attr('print_time') + '</td>';
			tmpHtml += '<td width="35%">打印机构：恒丰银行</td>';
			tmpHtml += '<td width="20%">打印柜员：' + PJF.otherInfo.devId + '</td>';
			//tmpHtml += '<td width="20%">打印卡号：' + STM.corporateBill.Txn_CardNo + '</td>';

			if(STM.corporateBill.Txn_CardNo && STM.corporateBill.Txn_CardNo.length){
				tmpHtml += '<td width="20%">打印卡号：' + STM.corporateBill.Txn_CardNo + '</td>';
			}else{
				tmpHtml += '<td width="20%">&nbsp;</td>';
			}
			
			tmpHtml += '</tr>';
			tmpHtml += '</table>';
			
			tmpHtml += STM.corporateBill.addClientNoticeNew();
			
			tmpHtml += '</div>';
			
			return tmpHtml;
		},
		// 添加明细注意事项
	/**
	 * @function addClientNotice
	 * @returns {string} 返回拼接的通知html
	 * 添加明细注意事项
	 */
		addClientNotice : function(){
			var htm = '<table style="font-size: 13px;" width="100%" border="1" cellspacing="0" cellpadding="0">';
			htm += '<tbody style="text-align:left;">';
			htm += '<tr style="line-height: 17px;"><td style="border: 0;padding-left: 2px;">客户须知：</td></tr>';
			htm += '<tr style="line-height: 17px;"><td style="border: 0;padding-left: 2px;">1．此账单以客户在恒丰银行的实际交易为依据，由客户通过恒丰银行网点柜台或自助设备打印，手写或自行打印无效。</td></tr>';
			htm += '<tr style="line-height: 17px;"><td style="border: 0;padding-left: 2px;">2．此账单加盖“恒丰银行业务专用章”，除明细账单外均打印二维码，可通过恒丰银行自助设备扫描二维码校验真伪。</td></tr>';
			htm += '<tr style="line-height: 17px;"><td style="border: 0;padding-left: 2px;">3．账单遗失可补制，并打印补打次数，请勿重复记账。</td></tr>';
			htm += '</tbody>';
			htm += '</table>';
			return htm;
		},
		// 添加明细注意事项
	/**
	 * @function addClientNoticeNew
	 * @returns {string} 返回拼接的通知html
	 * 添加明细注意事项
	 */
		addClientNoticeNew : function(){
			var htm = '<table style="font-size: 13px;" width="100%" border="1" cellspacing="0" cellpadding="0">';
			htm += '<tbody style="text-align:left;">';
			htm += '<tr style="line-height: 17px;"><td class="table_font" style="border: 0;padding-left: 2px;">客户须知：</td></tr>';
			htm += '<tr style="line-height: 17px;"><td class="table_font" style="border: 0;padding-left: 2px;">1．此账单以客户在恒丰银行的实际交易为依据，由客户通过恒丰银行网点柜台或自助设备打印，手写或自行打印无效。</td></tr>';
			htm += '<tr style="line-height: 17px;"><td class="table_font" style="border: 0;padding-left: 2px;">2．此账单加盖“恒丰银行业务专用章”，除明细账单外均打印二维码，可通过恒丰银行自助设备或手机银行扫描二维码校验真伪。</td></tr>';
			htm += '<tr style="line-height: 17px;"><td class="table_font" style="border: 0;padding-left: 2px;">3．账单遗失可补制，并打印补打次数，请勿重复记账。</td></tr>';
			htm += '</tbody>';
			htm += '</table>';
			return htm;
		},
		
		/**
		 * @function addClientNoticeEmpty
		 * @returns {string} 返回拼接的通知html
		 * 添加空白明细注意事项
		 */
		addClientNoticeEmpty :function(){
			var noticeStr = '<div style="height: 70px;">&nbsp;</div>';
			//var noticeStr = '<div style="page-break-after:always;">&nbsp;</div>';
			return noticeStr;
		},
		
		//打印对账清单的html内容
	//20200717 不用代码 涉及到PJF.communication.ajax 注释
	/**
	 * @function printHtmlDataByCMST00014
	 * @param {String}xmlPath 文件路径
	 * @param {String}money 费用
	 * 打印对账清单的html内容
	 */
		printHtmlDataByCMST00014 : function(xmlPath, money){
			var xmlData = STM.corporateBill.getXmlData(xmlPath);
			if(null == xmlData){
				return;
			}
			
			var tmpHtml;
			var pages = 0;//打印张数
			//先清空隐藏内容
			PJF.html.empty('printCBHtml');
			//打印
			var htmlPaths = new Array();//html文件路径
			$(xmlData).find('page').each(function(){
				
				tmpHtml = STM.corporateBill.createCMST00014Html(this);
				
				if(pages > 0){
					PJF.html.append('printCBHtml', '<div style="page-break-after:always;padding-top:1px;">' + tmpHtml + '</div>');
				} else {
					PJF.html.append('printCBHtml', '<div style="page-break-after:always;">' + tmpHtml + '</div>');
				}
				
				pages ++;
			});
			
			var func = function(){
				htmlPaths[0] = PJF.util.saveHtml("printCBHtml");
				PJF.stm.HDP.preparePrinter({}, function(prepareRes){
					if('1' == prepareRes.status){
						STM.corporateBill.doPrintCBHtml(htmlPaths, 0, pages);
					} else {
						STM.corporateBill.showPrintErrorMsg(prepareRes.errorMsg, prepareRes.errorCode);
					}
				});
			};
			STM.corporateBill.confirmDeductMoney(pages, money, func);
		},
		//查询所有对账清单数据并打印
	/**
	 * @function queryAndPrintAllBillListData
	 * @async
	 * @param {Object}jsonCMST00013 对账清单查询参数
	 * @param {Object}allData 接收数组
	 * @param {Object}vchIDs 对账清单凭证ID
	 * @param {String}times 请求次数
	 * @param {String}i 下标
	 * @param {String}fileSum 请求次数
	 * @param j 下标
	 * 查询所有对账清单数据并打印
	 */
		queryAndPrintAllBillListData : function(jsonCMST00013, allData, vchIDs, times, i, fileSum, j){
			jsonCMST00013._pagination = {};
			jsonCMST00013._pagination.PAGE_JUMP = i + 1;
			var tmpData = {};
			console.log("查询所有对账清单数据，循环第" + (i + 1) + "CMST00013-stm交易！");
			PJF.communication.cpsJsonReq({
				fwServiceId : "simpleTransaction",
				fwTranId : "CMST00013-stm",
				jsonData : PJF.util.json2str(jsonCMST00013),
				success : function(responseData) {
					if(responseData.Qry_GRP){
						if(responseData.Qry_GRP.length){
							for(var t=0;t<responseData.Qry_GRP.length;t++){
								if(responseData.Qry_GRP[t].VchID){
									vchIDs += responseData.Qry_GRP[t].VchID + ',';
								}
							}
						} else {
							if(responseData.Qry_GRP.VchID){
								vchIDs += responseData.Qry_GRP.VchID + ',';
							}
						}
						
						if(31 == vchIDs.split(",").length){//18条数据收集一下
							tmpData.vchIDs = vchIDs.substring(0,vchIDs.length - 1);
							allData[j]=tmpData;
							
							vchIDs='';
							j = j+1;
						}
					}
					
					if(i+1 <= times){
						STM.corporateBill.queryAndPrintAllBillListData(jsonCMST00013, allData, vchIDs, times, i+1, fileSum, j);
					} else {
						if(j < fileSum && '' != vchIDs){
							tmpData.vchIDs = vchIDs.substring(0,vchIDs.length - 1);
							allData[j]=tmpData;
						}
						
						STM.corporateBill.ValArray = new Array();
						var prepareData = new Array();
						console.log(PJF.util.json2str(allData));
						STM.corporateBill.printAllBillList(allData, prepareData, 0, 0.00);
					}
				},
				failure : function(responseData) {
					console.log("查询所有对账清单数据，循环第" + (i + 1) + "次CMST00013-stm交易报错！" + PJF.util.json2str(responseData));
					STM.corporateBill.showErrorMsg(responseData, '打印出错！');
                    if(STM.corporateBill.loading){
                        STM.corporateBill.loading.destroy();
                    }
					return;
				}
			});
		},
	/**
	 * @function printAllBillList
	 * @async
	 * @param {Object}data 下载参数
	 * @param {Object}prepareData 接收数组
	 * @param {String}i 下标
	 * @param {String}money 收取费用
	 * 递归调用，下载对账清单
	 */
		printAllBillList : function(data, prepareData, i, money) {
			var conf = {};
			conf.Stmp_Bsn_Ctlg_ID = "001";//默认传001
			conf.Stmp_Blng_InsID = PJF.roleInfo.orgCode;
			conf.VchID = "MXDY0CCMS00000000000000000000003";//对账单
			conf.Mnplt_TpCd="03";//默认03：客户端查询
			STM.corporateBill.getElecChapter(conf,function(elec_flag){
				continuePrintAllBillList(data, prepareData, i, money,elec_flag);
			});
			function continuePrintAllBillList(data, prepareData, i, money,elec_flag) {
				//@critical请求发交易接收文件到P2服务器
				var list_val = data[i].vchIDs;
				STM.corporateBill.jsonCMST00014.VchId_Grp = list_val;
				STM.corporateBill.ValArray = STM.corporateBill.ValArray.concat(list_val);
				STM.corporateBill.jsonCMST00014.Fee_Ind="1";
				STM.corporateBill.jsonCMST00014.MsgRp_Prt_Tm =STM.corporateBill.printServiceTime||PJF.communication.getServerTime("yyyy-MM-dd HH:mm:ss");//打印时间
				STM.corporateBill.jsonCMST00014.OPR_NO = PJF.otherInfo.devId;
				if(elec_flag == 1){
					STM.corporateBill.jsonCMST00014.Eltc_Stmp_Wthr_Us_Ind = 1;
				}else{
					STM.corporateBill.jsonCMST00014.Eltc_Stmp_Wthr_Us_Ind = 0;
				}
				var tmpJson = {};
				PJF.communication.cpsJsonReq({
					fwServiceId : "simpleTransaction",
					fwTranId : "A0782T014-stm",
					jsonData : PJF.util.json2str(STM.corporateBill.jsonCMST00014),
					success : function(responseData) {
						console.log("打印全部对账清单（A0782T014-stm）文件循环下载第" + (i+1) + "次交易成功：" + PJF.util.json2str(responseData));
						money += parseFloat(responseData.Ths_FeeAmt);
						prepareData =prepareData.concat([{fileName:responseData._COMMON.FILE_LIST_PACK.FILE_INFO[0].FILE_NAME,pageNum:list_val.length}]);
						/*//判读下载文件是否存在
                        var existFlag = false;
                        var fileName = STM.corporateBill.cutOutFilePath(responseData.File_Rte_FullNm);
                        var fileExistUrl = STM.corporateBill.existUrl + fileName;

                        if(!STM.corporateBill.isFileExist(fileExistUrl)){
                            STM.corporateBill.showPrintErrorMsg('对账清单数据文件不存在，下载失败', null);
                            STM.corporateBill.loading.destroy();
                            return;
                        }
                        tmpJson.fileName = fileName;
                        prepareData[i] = tmpJson;*/

						if((i + 1) < data.length){
							STM.corporateBill.printAllBillList(data, prepareData, i + 1, money);
						} else {
							//@critical先清空隐藏内容
							PJF.html.empty('printCBHtml');
							//@critical下载文件到本地并打印
							var htmlData = new Array();
							STM.corporateBill.createAllBillListHtml(prepareData, money,0,htmlData,elec_flag);
						}
					},
					failure : function(responseData) {
						STM.corporateBill.showErrorMsg(responseData, '下载对账清单文件到P2出错');
						if(STM.corporateBill.loading){
							STM.corporateBill.loading.destroy();
						}
						return;
					}
				});
			}


		},
		//创建对账清单html文件
	/**
	 * @function createAllBillListHtml
	 * @param {Object}FILE_INFO 文件数据
	 * 	@param {String}fileName 文件名
	 * @param {String}money 收取费用
	 * @param {String}i 下标
	 * @param {String}printFilePath 接收数组
	 * @param {String}elec_flag 是否使用电子印章
	 * 创建对账清单html文件
	 * 递归调用下载对账清单
	 */
		createAllBillListHtml : function(FILE_INFO,money,i,printFilePath,elec_flag) {
            if(FILE_INFO.length == 0 ){
                STM.corporateBill.showPrintErrorMsg('明细打印文件不存在，下载失败', null);
                if(STM.corporateBill.loading){
                    STM.corporateBill.loading.destroy();
                }
                return;
            }
                var fileName = FILE_INFO[i].fileName;// 文件全路径
                var fileExistUrl = STM.corporateBill.existUrl + fileName;// 服务器上文件路径
                var downUrl = STM.corporateBill.url + fileName;
                var locUrl = STM.corporateBill.localUrl + fileName;
                // @critical判断文件是否传送到服务器上
                if(!fileName || !STM.corporateBill.isFileExist(fileExistUrl)){
                    STM.corporateBill.showPrintErrorMsg('回单系统返回文件不存在，下载失败', null);
                    if(STM.corporateBill.loading){
                        STM.corporateBill.loading.destroy();
                    }
                }else{
                    PJF.util.simpleDownload(locUrl, downUrl, function(d){
                        console.log("下载返回成功！！！" + PJF.util.json2str(d));
                        if(d.success){//成功
                            printFilePath.push({printUrl:locUrl,pageNum:FILE_INFO[i].pageNum});
                            if(i == (FILE_INFO.length - 1)){//@critical最后一次下载文件成功
                                if(STM.corporateBill.loading){
                                    STM.corporateBill.loading.destroy();
                                }
                                if(money>0){
                                    STM.corporateBill.confirmDeductMoney(STM.corporateBill.ValArray.length, money, function(){STM.corporateBill.doPrintCBHtml(printFilePath,0,0,elec_flag);});
                                }else{
                                    STM.corporateBill.doPrintCBHtml(printFilePath,0,0,elec_flag);
                                }
                            }else{
                                STM.corporateBill.createAllBillListHtml(FILE_INFO, money,i+1,printFilePath,elec_flag);
                            }
                        }else{//失败
                            console.log("回单文件循环第" + (i+1) + "次下载回调失败");
                            if(STM.corporateBill.loading){
                                STM.corporateBill.loading.destroy();
                            }
                            STM.corporateBill.showPrintErrorMsg('回单文件下载回调失败', null);
                        }
                    });

                }


			/*var xmlData = STM.corporateBill.getXmlData(data[i].fileName);
			if(null == xmlData){
				return;
			}
			
			var tmpHtml;
			var tmp;
			var time;
			var array;
			//打印
			var htmlPaths = new Array();//html文件路径
			$(xmlData).find('page').each(function(){
				
				tmpHtml = STM.corporateBill.createCMST00014Html(this);
				
				if(pageNo > 0){
					PJF.html.append('printCBHtml', '<div style="page-break-after:always;padding-top:1px;">' + tmpHtml + '</div>');
				} else {
					PJF.html.append('printCBHtml', '<div style="page-break-after:always;">' + tmpHtml + '</div>');
				}
				
				pageNo ++;
			});
			
			if(i == (data.length - 1)){//最后一次下载文件成功
				var func = function(){
					STM.corporateBill.loading.destroy();
					htmlData.push(PJF.util.saveHtml("printCBHtml"));
					PJF.stm.HDP.preparePrinter({}, function(prepareRes){
						if('1' == prepareRes.status){
							STM.corporateBill.doPrintCBHtml(htmlData, 0, pageNo);
						} else {
							STM.corporateBill.showPrintErrorMsg(prepareRes.errorMsg, prepareRes.errorCode);
						}
					});
				};
				STM.corporateBill.confirmDeductMoney(pageNo, money, func);
			} else {//递归调用下载
				STM.corporateBill.createAllBillListHtml(data, i+1, htmlData, money, pageNo);
			}*/
		},
		//打印活期、定期、贷款、全量、过滤、对账单明细数据
	//20200717 不用代码 涉及到PJF.communication.ajax 注释
	/**
	 * @function printHtmlDataByTxCode
	 * @param {String}xmlPath 文件路径
	 * @param {String}txCode 交易码
	 * 打印活期、定期、贷款、全量、过滤、对账单明细数据
	 */
		printHtmlDataByTxCode : function(xmlPath, txCode){
			var xmlData = STM.corporateBill.getXmlData(xmlPath);
			if(null == xmlData){
				return;
			}
			
			var tmpFoot ='';
			var tmpContent ='';
			var tmp;
			var time;
			var array;
			var pages = 0;//打印张数
			var pageInfo;
			//打印
			var htmlPaths = new Array();//html文件路径
			$(xmlData).find('page').each(function(){
				//先清空隐藏内容
				PJF.html.empty('printCBHtml');
				
				pageInfo = $(this);
				//表头
				var getTmpHead = function(pageInfo, pageNo, txCode){
					var tmpHead ='';
					//tmpHead += '<div id="cbHtml_1">';
					//统一样式
					tmpHead += '<style>';
					tmpHead += '.th_left{border-bottom: 1;border-left: 0;border-right: 1;border-top: 0;}';
					tmpHead += '.th_right{border-bottom: 1;border-left: 0;border-right: 0;border-top: 0;}';
					tmpHead += '.td_left{border-bottom: 0;border-left: 0;border-right: 1;border-top: 0;}';
					tmpHead += '.td_right{border-bottom: 0;border-left: 0;border-right: 0;border-top: 0;}';
					tmpHead += '.text_left{padding-left:2px;}';
					tmpHead += '.text_right{text-align:right;padding-right:2px;}';
					tmpHead += '.td_jq{white-space:nowrap;overflow-x:hidden;max-width:10px;}';
					tmpHead += '</style>';
					
					tmpHead += '<div style="font-size: 13px;">';
					tmpHead += '<table width="100%" >';
					if('CMST00018' == txCode) {
						/*tmpHead += '.td_pzzl{white-space:nowrap;overflow-x:hidden;max-width:10px;}';//74px
						tmpHead += '.td_pzhm{white-space:nowrap;overflow-x:hidden;max-width:10px;}';//102px
						tmpHead += '.td_zy{white-space:nowrap;overflow-x:hidden;max-width:10px;}';//98px
						tmpHead += '.td_dfhm{white-space:nowrap;overflow-x:hidden;max-width:10px;}';//235px
						tmpHead += '.td_jf{white-space:nowrap;overflow-x:hidden;max-width:10px;}';//104px
						tmpHead += '.td_df{white-space:nowrap;overflow-x:hidden;max-width:10px;}';//104px
						tmpHead += '.td_ye{white-space:nowrap;overflow-x:hidden;max-width:10px;}';//116px
						tmpHead += '.td_lsh{white-space:nowrap;overflow-x:hidden;max-width:10px;}';//118px*/

						tmpHead += '<tr>';
						tmpHead += '<h3 align="center" style="font-size: 22px;">恒丰银行股份有限公司活期存款明细账</h3>';
						tmpHead += '</tr>';
						tmpHead += '<tr style="line-height: 21px;">';
						tmpHead += '<td width="10%">币别：' + pageInfo.find('head').attr('cur_code') + '</td>';
						tmpHead += '<td width="20%">账号：' + pageInfo.find('head').attr('acct_no') + '</td>';
						tmpHead += '<td width="45%">账户名称：' + pageInfo.find('head').attr('fs_acctname') + '</td>';
						tmpHead += '<td width="20%">日期：' + pageInfo.find('head').attr('start_date') + ' - ' + pageInfo.find('head').attr('end_date') + '</td>';
						tmpHead += '<td width="5%">第' + pageNo + '页</td>';
						tmpHead += '</tr>';
						tmpHead += '</table>';
						tmpHead += '<table width="100%" border=1 cellpadding=0 cellspacing=0 >';
						tmpHead += '<tr style="line-height: 17px;">';
						tmpHead += '<th width="5%" class="th_left" rowspan=2>日期</th>';
						tmpHead += '<th width="7%" class="th_left" rowspan=2>凭证种类</th>';
						tmpHead += '<th width="10%" class="th_left" rowspan=2>凭证号码</th>';
						tmpHead += '<th width="10%" class="th_left" rowspan=2>摘要</th>';
						tmpHead += '<th width="23%" class="th_left" rowspan=2>对方户名</th>';
						tmpHead += '<th width="10%" class="th_left" colspan=2>发生额</th>';
						tmpHead += '<th width="3%" class="th_left" rowspan=2>借贷</th>';
						tmpHead += '<th width="11%" class="th_left" rowspan=2>余额</th>';
						tmpHead += '<th width="11%" class="th_right" rowspan=2>交易流水号</th>';
						tmpHead += '</tr>';
						tmpHead += '<tr style="line-height: 17px;">';
						tmpHead += '<th width="10%" class="th_left">借方</th>';
						tmpHead += '<th width="10%" class="th_left">贷方</th>';
						tmpHead += '</tr>';
					} else if('CMST00019' == txCode){
						tmpHead += '<tr>';
						tmpHead += '<h3 align="center" style="font-size: 22px;">恒丰银行股份有限公司定期存款明细账</h3>';
						tmpHead += '</tr>';
						tmpHead += '<tr style="line-height: 21px;">';
						tmpHead += '<td width="25%">账号：' + pageInfo.find('head').attr('acct_no') + '</td>';
						tmpHead += '<td width="50%">账户名称：' + pageInfo.find('head').attr('fs_acctname') + '</td>';
						tmpHead += '<td width="20%">日期：' + pageInfo.find('head').attr('start_date') + ' - ' + pageInfo.find('head').attr('end_date') + '</td>';
						tmpHead += '<td width="5%">第' + pageNo + '页</td>';
						tmpHead += '</tr>';
						tmpHead += '</table>';
						tmpHead += '<table width="100%" border=1 cellpadding=0 cellspacing=0 >';
						tmpHead += '<tr style="line-height: 34px;">';
						tmpHead += '<th width="6%" class="th_left">日期</th>';
						tmpHead += '<th width="11%" class="th_left">交易金额</th>';
						tmpHead += '<th width="7%" class="th_left">存期</th>';
						tmpHead += '<th width="7%" class="th_left">借贷</th>';
						tmpHead += '<th width="24%" class="th_left">摘要</th>';
						tmpHead += '<th width="7%" class="th_left">册号</th>';
						tmpHead += '<th width="7%" class="th_left">笔号</th>';
						tmpHead += '<th width="7%" class="th_left">币种</th>';
						tmpHead += '<th width="7%" class="th_left">钞汇鉴别</th>';
						tmpHead += '<th width="17%" class="th_right">交易流水号</th>';
						tmpHead += '</tr>';
					} else if('CMST00020' == txCode){
						tmpHead += '<tr>';
						tmpHead += '<h3 align="center" style="font-size: 22px;">恒丰银行股份有限公司贷款明细账</h3>';
						tmpHead += '</tr>';
						tmpHead += '<tr style="line-height: 21px;">';
						tmpHead += '<td width="25%">账号：' + pageInfo.find('head').attr('acct_no') + '</td>';
						tmpHead += '<td width="50%">账户名称：' + pageInfo.find('head').attr('fs_acctname') + '</td>';
						tmpHead += '<td width="20%">日期：' + pageInfo.find('head').attr('start_date') + ' - ' + pageInfo.find('head').attr('end_date') + '</td>';
						tmpHead += '<td width="5%">第' + pageNo + '页</td>';
						tmpHead += '</tr>';
						tmpHead += '</table>';
						tmpHead += '<table width="100%" border=1 cellpadding=0 cellspacing=0 >';
						tmpHead += '<tr style="line-height: 34px;">';
						tmpHead += '<th width="8%" class="th_left">日期</th>';
						tmpHead += '<th width="11%" class="th_left">交易代码</th>';
						tmpHead += '<th width="13%" class="th_left">本金/利息标志</th>';
						tmpHead += '<th width="17%" class="th_left">借方发生额</th>';
						tmpHead += '<th width="17%" class="th_left">贷方发生额</th>';
						tmpHead += '<th width="17%" class="th_left">贷款余额</th>';
						tmpHead += '<th width="17%" class="th_right">收息金额</th>';
						tmpHead += '</tr>';
					} else if('CMST00023' == txCode){
						tmpHead += '<h3 align="center" style="font-size: 22px;">集团流动性管理账户对账单</h3>';
						tmpHead += '</tr>';
						tmpHead += '<tr style="line-height: 21px;">';
						tmpHead += '<td width="10%">币别：' + pageInfo.find('head').attr('cur_code') + '</td>';
						tmpHead += '<td width="20%">账号：' + pageInfo.find('head').attr('acct_no') + '</td>';
						tmpHead += '<td width="45%">账户名称：' + pageInfo.find('head').attr('fs_acctname') + '</td>';
						tmpHead += '<td width="20%">日期：' + pageInfo.find('head').attr('start_date') + ' - ' + pageInfo.find('head').attr('end_date') + '</td>';
						tmpHead += '<td width="5%">第' + pageNo + '页</td>';
						tmpHead += '</tr>';
						tmpHead += '</table>';
						tmpHead += '<table width="100%" border=1 cellpadding=0 cellspacing=0 >';
						tmpHead += '<tr style="line-height: 34px;">';
						tmpHead += '<th width="5%" class="th_left">交易日期</th>';
						tmpHead += '<th width="12%" class="th_left">交易流水号</th>';
						tmpHead += '<th width="7%" class="th_left">凭证种类</th>';
						tmpHead += '<th width="10%" class="th_left">凭证号码</th>';
						tmpHead += '<th width="16%" class="th_left">摘要</th>';
						tmpHead += '<th width="11%" class="th_left">借方发生额</th>';
						tmpHead += '<th width="11%" class="th_left">贷方发生额</th>';
						tmpHead += '<th width="11%" class="th_left">余额</th>';
						tmpHead += '<th width="12%" class="th_left">积数</th>';
						tmpHead += '<th width="5%" class="th_right">起息日期</th>';
						tmpHead += '</tr>';
					}
					
					return tmpHead;
				};
				
				//表尾
				tmpFoot += '</table>';
				tmpFoot += '<table width="100%">';
				tmpFoot += '<tr style="line-height: 17px;">';
				tmpFoot += '<td width="25%">打印时间：' + pageInfo.find('head').attr('print_time') + '</td>';
				tmpFoot += '<td width="35%">打印机构：恒丰银行</td>';
				tmpFoot += '<td width="20%">打印柜员：' + PJF.otherInfo.devId + '</td>';
				

				if(STM.corporateBill.Txn_CardNo && STM.corporateBill.Txn_CardNo.length){
					tmpFoot += '<td width="20%">打印卡号：' + STM.corporateBill.Txn_CardNo + '</td>';
				}else{
					tmpFoot += '<td width="20%">&nbsp;</td>';
				}
				
				tmpFoot += '</tr>';
				tmpFoot += '</table>';
				
				tmpFoot += STM.corporateBill.addClientNoticeNew();
				
				tmpFoot += '</div>';
				//tmpFoot += '</div>';
				
				//表内容
				time = 0;
				$(this).find('item').each(function(){
					tmpContent += '<tr style="line-height: 17px;">';
					
					tmp = $(this).text();
					array = tmp.split(' ■ ');
					
					if('CMST00018' == txCode) {
						tmpContent += '<td class="td_left text_left">' + array[0].trim() + '</td>';
						tmpContent += '<td class="td_left text_left td_jq">' + array[1].trim() + '</td>';
						tmpContent += '<td class="td_left text_left td_jq">' + array[2].trim() + '</td>';
						tmpContent += '<td class="td_left text_left td_jq">' + array[3].trim() + '</td>';
						tmpContent += '<td class="td_left text_left td_jq">' + array[5].trim() + '</td>';
						tmpContent += '<td class="td_left text_right td_jq">' + STM.corporateBill.getJE(array[6].trim()) + '</td>';
						tmpContent += '<td class="td_left text_right td_jq">' + STM.corporateBill.getJE(array[7].trim()) + '</td>';
						tmpContent += '<td class="td_left" align="center">' + array[8].trim() + '</td>';
						tmpContent += '<td class="td_left text_right td_jq">' + STM.corporateBill.getJE(array[9].trim()) + '</td>';
						tmpContent += '<td class="td_right text_left td_jq">' + array[10].trim() + '</td>';
					} else if('CMST00019' == txCode){
						tmpContent += '<td class="td_left text_left">' + array[0].trim() + '</td>';
						tmpContent += '<td class="td_left text_right td_jq">' + STM.corporateBill.getJE(array[2].trim()) + '</td>';
						tmpContent += '<td class="td_left" align="center">' + array[3].trim() + '</td>';
						tmpContent += '<td class="td_left" align="center">' + array[4].trim() + '</td>';
						tmpContent += '<td class="td_left text_left td_jq">' + array[5].trim() + '</td>';
						tmpContent += '<td class="td_left" align="center">' + array[7].trim() + '</td>';
						tmpContent += '<td class="td_left" align="center">' + array[6].trim() + '</td>';
						tmpContent += '<td class="td_left" align="center">' + array[8].trim() + '</td>';
						tmpContent += '<td class="td_left" align="center">' + array[9].trim() + '</td>';
						tmpContent += '<td class="td_right text_left td_jq">' + array[1].trim() + '</td>';
					} else if('CMST00020' == txCode){
						tmpContent += '<td class="td_left text_left">' + array[1].trim() + '</td>';
						tmpContent += '<td class="td_left text_left td_jq">' + array[2].trim() + '</td>';
						tmpContent += '<td class="td_left text_left td_jq">' + array[3].trim() + '</td>';
						tmpContent += '<td class="td_left text_right td_jq">' + STM.corporateBill.getJE(array[4].trim()) + '</td>';
						tmpContent += '<td class="td_left text_right td_jq">' + STM.corporateBill.getJE(array[5].trim()) + '</td>';
						tmpContent += '<td class="td_left text_right td_jq">' + STM.corporateBill.getJE(array[6].trim()) + '</td>';
						tmpContent += '<td class="td_right text_right td_jq">' + STM.corporateBill.getJE(array[7].trim()) + '</td>';
					} else if('CMST00023' == txCode){
						tmpContent += '<td class="td_left text_left">' + array[0].trim() + '</td>';
						tmpContent += '<td class="td_left text_left td_jq">' + array[1].trim() + '</td>';
						tmpContent += '<td class="td_left text_left td_jq">' + array[2].trim() + '</td>';
						tmpContent += '<td class="td_left text_left td_jq">' + array[3].trim() + '</td>';
						tmpContent += '<td class="td_left text_left td_jq">' + array[4].trim() + '</td>';
						tmpContent += '<td class="td_left text_right td_jq">' + STM.corporateBill.getJE(array[5].trim()) + '</td>';
						tmpContent += '<td class="td_left text_right td_jq">' + STM.corporateBill.getJE(array[6].trim()) + '</td>';
						tmpContent += '<td class="td_left text_right td_jq">' + STM.corporateBill.getJE(array[7].trim()) + '</td>';
						tmpContent += '<td class="td_left text_right td_jq">' + STM.corporateBill.getJE(array[8].trim()) + '</td>';
						tmpContent += '<td class="td_right text_left td_jq">' + array[9].trim() + '</td>';
					}
					
					tmpContent += '</tr>';
					time ++;
					
					
					if(30 == time){
						if(pages > 0){
							PJF.html.append('printCBHtml', '<div style="page-break-after:always;padding-top:1px;">' + getTmpHead(pageInfo, pages + 1, txCode) + tmpContent + tmpFoot + '</div>');
						} else {
							PJF.html.append('printCBHtml', '<div style="page-break-after:always;">' + getTmpHead(pageInfo, pages + 1, txCode) + tmpContent + tmpFoot + '</div>');
						}
						
						//htmlPaths[pages] = PJF.util.saveHtml("cbHtml_1");
						pages ++;
						
						time = 0;
						tmpContent = '';
						//先清空隐藏内容
						//PJF.html.empty('printCBHtml');
					}
				});
				
				//不足30行需补空行
				if(time > 0 && time < 30){
					for(var j=0; j<(30 - time); j++){
						if('CMST00018' == txCode) {
							tmpContent += '<tr style="line-height: 17px;">';
							tmpContent += '<td class="td_left">&nbsp;</td>';
							tmpContent += '<td class="td_left">&nbsp;</td>';
							tmpContent += '<td class="td_left">&nbsp;</td>';
							tmpContent += '<td class="td_left">&nbsp;</td>';
							tmpContent += '<td class="td_left">&nbsp;</td>';
							tmpContent += '<td class="td_left">&nbsp;</td>';
							tmpContent += '<td class="td_left">&nbsp;</td>';
							tmpContent += '<td class="td_left">&nbsp;</td>';
							tmpContent += '<td class="td_left">&nbsp;</td>';
							tmpContent += '<td class="td_right">&nbsp;</td>';
						} else if('CMST00019' == txCode){
							tmpContent += '<tr style="line-height: 17px;">';
							tmpContent += '<td class="td_left">&nbsp;</td>';
							tmpContent += '<td class="td_left">&nbsp;</td>';
							tmpContent += '<td class="td_left">&nbsp;</td>';
							tmpContent += '<td class="td_left">&nbsp;</td>';
							tmpContent += '<td class="td_left">&nbsp;</td>';
							tmpContent += '<td class="td_left">&nbsp;</td>';
							tmpContent += '<td class="td_left">&nbsp;</td>';
							tmpContent += '<td class="td_left">&nbsp;</td>';
							tmpContent += '<td class="td_left">&nbsp;</td>';
							tmpContent += '<td class="td_right">&nbsp;</td>';
						} else if('CMST00020' == txCode){
							tmpContent += '<tr style="line-height: 17px;">';
							tmpContent += '<td class="td_left">&nbsp;</td>';
							tmpContent += '<td class="td_left">&nbsp;</td>';
							tmpContent += '<td class="td_left">&nbsp;</td>';
							tmpContent += '<td class="td_left">&nbsp;</td>';
							tmpContent += '<td class="td_left">&nbsp;</td>';
							tmpContent += '<td class="td_left">&nbsp;</td>';
							tmpContent += '<td class="td_right">&nbsp;</td>';
						} else if('CMST00023' == txCode){
							tmpContent += '<tr style="line-height: 17px;">';
							tmpContent += '<td class="td_left">&nbsp;</td>';
							tmpContent += '<td class="td_left">&nbsp;</td>';
							tmpContent += '<td class="td_left">&nbsp;</td>';
							tmpContent += '<td class="td_left">&nbsp;</td>';
							tmpContent += '<td class="td_left">&nbsp;</td>';
							tmpContent += '<td class="td_left">&nbsp;</td>';
							tmpContent += '<td class="td_left">&nbsp;</td>';
							tmpContent += '<td class="td_left">&nbsp;</td>';
							tmpContent += '<td class="td_left">&nbsp;</td>';
							tmpContent += '<td class="td_right">&nbsp;</td>';
						}
						tmpContent += '</tr>';
					}
					
					if(pages > 0){
						PJF.html.append('printCBHtml', '<div style="page-break-after:always;padding-top:1px;">' + getTmpHead(pageInfo, pages + 1, txCode) + tmpContent + tmpFoot + '</div>');
					} else {
						PJF.html.append('printCBHtml', '<div style="page-break-after:always;">' + getTmpHead(pageInfo, pages + 1, txCode) + tmpContent + tmpFoot + '</div>');
					}
					
					pages ++;
					
					//htmlPaths[pages] = PJF.util.saveHtml("cbHtml_1");
				}
				htmlPaths[0] = PJF.util.saveHtml("printCBHtml");
				//清空隐藏内容
				//PJF.html.empty('printCBHtml');
			});
			console.log('>>>>>>明细下载文件路径>>>>>>' + PJF.util.json2str(htmlPaths));
			
			PJF.stm.HDP.preparePrinter({}, function(prepareRes){
				if('1' == prepareRes.status){
					STM.corporateBill.doPrintCBHtml(htmlPaths, 0, pages);
				} else {
					STM.corporateBill.showPrintErrorMsg(prepareRes.errorMsg, prepareRes.errorCode);
				}
			});
		},
		//打印所有html
		doPrintCBHtml_MXCX : function(htmlPaths, i, pageNo, ifUseChapter){
			var startArgs={};
			startArgs.iTotalPaperNum=pageNo;
			startArgs.iSlotType=3;
			if(ifUseChapter){
				startArgs.iChapterType=6;
				startArgs.pchChapterPos='0';
				startArgs.iChapterNum=0;
			}else{
				startArgs.iChapterType=4;
				startArgs.pchChapterPos='240';
				startArgs.iChapterNum=pageNo;
			}
			startArgs.printFilePath=htmlPaths[i];
			PJF.stm.HDP.startPrintReceipt(startArgs, function(startPrintRes){
				var printSuccNum = parseInt(startPrintRes.info.printProgressData) || 0;// 记录打印成功次数
				
				if(STM.corporateBill.ValArray.length > 0 && printSuccNum > 0){
					STM.corporateBill.divideDataAndReg(printSuccNum, STM.corporateBill.ValArray);
				}
				
				if('1' == startPrintRes.status){
	            	window.removeEventListener('click',window.eventHander,false);
	        		if(window.logoutFlag){
	        			$('div[id=billNavbtn]').remove();
	        			$('.template_navbtn').show();
	        			clearTimeout(window.logoutFlag);
	        		}
					if(i == (htmlPaths.length - 1)){
						STM.corporateBill.finishPrint();
					} else {
						//STM.corporateBill.doPrintCBHtml(htmlPaths, i+1);
					}
				} else {
					console.log('打印出错：' + PJF.util.json2str(startPrintRes));
					if(printSuccNum > 0){
						var errorMsg = '打印过程中出错，已打印' + printSuccNum 
						+ '张，未打印' + (pageNo - printSuccNum) + '张，请退卡后呼叫工作人员处理';
						var fuc = function(){
							STM.corporateBill.finishPrint();
						};
            			STM.corporateBill.showPrintErrorMsgAndGetPaper(errorMsg, startPrintRes, fuc);
					} else {
						STM.corporateBill.showPrintErrorMsg(startPrintRes.errorMsg + '，请退卡后呼叫工作人员处理', startPrintRes.errorCode);
						console.log(2878,'打印无callback',data.length,i);
					}
				}
			});
		},
		//打印所有html
	/**
	 * @function doPrintCBHtml
	 * @param {Object}htmlPaths 打印数据
	 * @param {String}i 下标
	 * @param {String}printSuccNum 打印成张数
	 * @param {String}elec_flag 是否使用电子印章
	 * 打印对账清单
	 */
		doPrintCBHtml : function(htmlPaths, i, printSuccNum,elec_flag){
			console.log("是否使用电子印章elec_flag："+elec_flag);
			if(elec_flag == 1){
				var startArgs={};
				startArgs.iTotalPaperNum=htmlPaths[i].pageNum;
				startArgs.iSlotType=3;
				startArgs.iChapterType=6;//不盖章横向打印
				startArgs.iChapterNum=0;
				startArgs.pchChapterPos='0';
				startArgs.printFilePath=htmlPaths[i].printUrl;
			}else{
				var startArgs={};
				startArgs.iTotalPaperNum=htmlPaths[i].pageNum;
				startArgs.iSlotType=3;
				startArgs.iChapterType=4;
				startArgs.iChapterNum=htmlPaths[i].pageNum;
				startArgs.pchChapterPos='240';
				startArgs.printFilePath=htmlPaths[i].printUrl;
			}
			PJF.stm.HDP.startPrintReceipt(startArgs, function(startPrintRes){
				if('1' == startPrintRes.status){
                    printSuccNum += parseInt(startPrintRes.info.printProgressData) || 0;// 记录打印成功次数
					if(i == (htmlPaths.length - 1)){
                        if(STM.corporateBill.ValArray.length > 0 && printSuccNum > 0){
                            printSuccNum = STM.corporateBill.ValArray.length;
                            STM.corporateBill.divideDataAndReg(printSuccNum, STM.corporateBill.ValArray);
                        }
						STM.corporateBill.finishPrint();
					} else {
						STM.corporateBill.doPrintCBHtml(htmlPaths, i+1,printSuccNum,elec_flag);
					}
				} else {
					console.log('打印出错：' + PJF.util.json2str(startPrintRes));
                    printSuccNum += parseInt(startPrintRes.info.printProgressData) || 0;// 记录打印成功次数
                    if(printSuccNum > 0){
						var errorMsg = '打印过程中出错，已打印' + printSuccNum 
						+ '张，未打印' + (STM.corporateBill.ValArray.length - printSuccNum) + '张，请退卡后呼叫工作人员处理';
						var fuc = function(){
                            STM.corporateBill.divideDataAndReg(printSuccNum, STM.corporateBill.ValArray);
							STM.corporateBill.finishPrint();
						};
            			STM.corporateBill.showPrintErrorMsgAndGetPaper(errorMsg, startPrintRes, fuc);
					} else {
						STM.corporateBill.showPrintErrorMsg(startPrintRes.errorMsg+"，请退卡后呼叫工作人员处理", startPrintRes.errorCode);
						}
				}
			});
		},
		//打印所有html和凭证
	/**
	 * @function doPrintCBHtmlAndVoucher
	 * @param {Object}htmlPaths 打印数据
	 * @param {String}i 下标
	 * @param {String}pageNo 打印成功张数
	 * @param {Object}voucherArray
	 * 打印所有html和凭证
	 */
		doPrintCBHtmlAndVoucher : function(htmlPaths, i, pageNo, voucherArray){
			var startArgs={};
			startArgs.iTotalPaperNum=pageNo;
			startArgs.iSlotType=3;
			startArgs.iChapterType=4;
			startArgs.iChapterNum=pageNo;
			startArgs.pchChapterPos='240';
			startArgs.printFilePath=htmlPaths[i];
			PJF.stm.HDP.startPrintReceipt(startArgs, function(startPrintRes){
				var printSuccNum = parseInt(startPrintRes.info.printProgressData) || 0;// 记录打印成功次数
				
				if(STM.corporateBill.ValHtmlArray.length > 0 && printSuccNum > 0){
					STM.corporateBill.divideDataAndReg(printSuccNum, STM.corporateBill.ValHtmlArray);
				}
				
				if('1' == startPrintRes.status){
					if(i == (htmlPaths.length - 1)){
						STM.corporateBill.finishPrint();
						//doPrintVoucher(voucherArray,0,0);
					} else {
						//STM.corporateBill.doPrintCBHtml(htmlPaths, i+1);
					}
				} else {
					console.log('打印出错：' + PJF.util.json2str(startPrintRes));
					if(printSuccNum > 0){
						var errorMsg = '打印过程中出错，已打印' + printSuccNum 
						+ '张，未打印' + (STM.corporateBill.ValHtmlArray.length - printSuccNum) + '张';
						var fuc = function(){
							STM.corporateBill.finishPrint();
						};
            			STM.corporateBill.showPrintErrorMsgAndGetPaper(errorMsg, startPrintRes, fuc);
					} else {
						STM.corporateBill.showPrintErrorMsg(startPrintRes.errorMsg, startPrintRes.errorCode);
					}
				}
			});
		},
		//
	/**
	 * @function doPrintVoucher
	 * @param {Object}data 打印数据
	 * @param {String}i 下标
	 * @param {String}printSuccNum 打印成功张数
	 * 打印文件
	 */
		doPrintVoucher : function(data, i, printSuccNum){
			var printContent = data[i];
			PJF.stm.HDP.printUniVoucher({
                iSlotType: "3", // 1－1号纸槽（单联回单纸），2－2号纸槽（三联回单纸，尺寸同A4纸），3－3号纸槽（账页纸，尺寸同A4纸），4－4号纸槽（1/2 A4大小回单，尺寸同1/2 A4纸）	预留
                pchPrintStr: printContent, // JSON格式，统一凭证打印字符串，驱动解析，并按照打印字符串中的各字段含义完成打印。
                pchTempltPath: "" // 凭证底板图片格式为JPG格式。如果此参数为空，表示不需要进行底板合成
            }, function(prnResp) {
                if ('1' == prnResp.status) {
                	if(i == (data.length - 1)){//@critical最后一次打印成功
						printSuccNum = STM.corporateBill.ValVoucherArray.length;// 记录打印成功次数
						
						if(STM.corporateBill.ValArray.length > 0 && printSuccNum > 0){
							STM.corporateBill.divideDataAndReg(printSuccNum, STM.corporateBill.ValVoucherArray);
						}
						
						STM.corporateBill.finishPrint();
					} else {//@critical递归调用打印
						printSuccNum = printSuccNum + 1;// 记录打印成功次数
						STM.corporateBill.doPrintVoucher(data, i+1, printSuccNum);
					}
                } else {
                	if(printSuccNum > 0){
						if(STM.corporateBill.ValArray.length > 0 && printSuccNum > 0){
							STM.corporateBill.divideDataAndReg(printSuccNum, STM.corporateBill.ValVoucherArray);
						}
						var errorMsg = '打印附件过程中出错，已打印' + printSuccNum + '张';
            			STM.corporateBill.showErrorMsg(prnResp, errorMsg);
            			STM.corporateBill.finishPrint();
        				
					} else {
						STM.corporateBill.showErrorMsg(prnResp, '打印附件失败');
					}
                }
            });
		},
		//完成打印，请去文件
	/**
	 * @function finishPrint
	 * 完成打印，请取文件,清空全局变量参数
	 */
		finishPrint : function(){
			var tmp = {
				publicBusiness:true,//营销页面显示对公结算卡专用图片
				cdbEjectSound:'app/debitCard/11.wav'//11请取回您的单位结算卡
			};
			template.loadPage('takeCBHF',tmp);
			//清空数据
			STM.corporateBill.ValArray = new Array();
			STM.corporateBill.ValHtmlArray = new Array();
			STM.corporateBill.ValVoucherArray = new Array();
			STM.corporateBill.resArr = new Array();
			STM.corporateBill.totalNum = 0;
			STM.corporateBill.priAllCB = false;
		},
		/**
		 * @function createQRCode
    	 * @param {String}content 二维码内容
		 * 根据打印内容生成二维码图片
    	 */
		createQRCode : function (content){
			return PJF.util.qrCode(content);
			
			/*var imgSrc = '';
    		var param = {
    			_fw_service_id : "createQRCode",
    			content : content,
    			width : 300,
    			height : 300,
    			type : "png"
    		};
    		PJF.communication.ajax({
    			url : "ecpJson.action",
    			data : param,
    			async : false,// 同步
    			success : function(data){
    				//console.log(PJF.util.json2str(data));
    				var imgPrefix = "data:image/png;base64,";
    				imgSrc = imgPrefix + data;
    			},
    			failure : function(response){
    				console.log('创建二维码图片数据失败');
    			}
    		});
    		
    		return imgSrc;*/
    	},
		/*
		 * 装饰账页数据
		 * xmlPath xml文件路径
		 */ 
	//20200717 不用代码 涉及到PJF.communication.ajax 注释
	/**
	 * @function decorateLPData
	 * @param {Stirng}xmlPath 文件路径
	 * @returns {any[]} 账页数据
	 * 装饰账页数据
	 */
		decorateLPData : function(xmlPath){
			// 根据XML文件路径获取打印数据
			var startT = new Date().getTime();
    		var xmlData = STM.corporateBill.getXmlData(xmlPath);
    		var endT = new Date().getTime();
    		console.log('解析xml文件所用时间：' + (endT - startT) + '毫秒');
    		var pages = new Array();
    		if(xmlData){
    			$(xmlData).find('page').each(function(){
    				var page = {};
        			page.id = $(this).find('head').attr('id');// 账页唯一标识
        			page.qr_str = $(this).find('head').attr('qr_str');// 用于生成二维码
        			page.cur_code = $(this).find('head').attr('cur_code');// 币种
        			page.cur_iden = $(this).find('head').attr('cur_iden');// 钞汇鉴别
        			page.acct_no = $(this).find('head').attr('acct_no');// 账号
        			page.fs_acctname = $(this).find('head').attr('fs_acctname');// 户名
        			page.start_date = $(this).find('head').attr('start_date');// 账页开始日期
        			page.end_date = $(this).find('head').attr('end_date');// 账页截止日期
        			page.page_no = $(this).find('head').attr('page_no');// 页号
        			page.print_time = $(this).find('head').attr('print_time');// 打印时间
        			page.print_inst = '恒丰银行';// 打印机构
        			page.print_teller = PJF.otherInfo.devId;// 打印柜员
        			page.print_cnts = $(this).find('head').attr('print_cnts');// 打印次数
        			page.print_cardNo = STM.corporateBill.Txn_CardNo || '';// 打印卡号
        			
        			var content = 'branch-page-' + page.id + '-' + (parseInt(page.print_cnts) + 1);
        			content += '-' + PJF.util.formatDate(new Date(),"yyyy") + '-' + page.qr_str;
        			var startTime = new Date().getTime();
        			page.imgSrc = STM.corporateBill.createQRCode(content);// 获取二维码图片资源
        			var endTime = new Date().getTime();
        			console.log('创建二维码所用时间：' + (endTime - startTime) + '毫秒');
        			if(!page.imgSrc){// 生成二维码失败则结束打印任务
        				pages = [];
        				return false;
        			}
        			
        			var list = new Array();
        			$(this).find('item').each(function(){
        				var tmp = $(this).text();
        				var array = tmp.split(' ■ ');// 消除所有的空格后根据“ ■ ”划分数据
        				list.push(array);
        			});
        			page.list = list;
        			
        			pages.push(page);
    			});
    		}
    		
    		return pages;
		},
		/*
		 * 处理混合附件内容xml文件
		 * xmlData xml文件内容
		 */
	//20200717 不用代码 涉及到PJF.communication.ajax 注释
	/**
	 * @function analysisAttatchContent
	 * @param {String}xmlPath 文件路径
	 * 处理混合附件内容xml文件
	 */
		analysisAttatchContent : function(xmlPath){
			var xmlData = STM.corporateBill.getXmlData(xmlPath);
			if(null == xmlData){
				return;
			}
			
			var data = {};// 所有数据
			var pages = new Array();// 清单数据
			data['pages'] = pages;
			// 解析displayset
			var displayset = $(xmlData).find('displayset');
			if(displayset){
				var itemsArray = new Array();
				displayset.find('items').each(function(){
					var formatId = $(this).attr('id');
					if(formatId){
						var head = {};
						var list = new Array();// 表头列表
						var totalLen = 0;// 总长度
						$(this).find('item').each(function(){
							var headArg = {};
							headArg.colNum = $(this).attr('en_name').split('col')[1];
							headArg.colName = $(this).attr('ch_name');
							headArg.length = $(this).attr('en_length');
							headArg.align = $(this).attr('align');
							totalLen += parseInt(headArg.length);
							list.push(headArg);
						});
						head.totalLen = totalLen;
						head.colsData = list;
						
						data[formatId] = head;
					}
				});
			}
			
			// 解析page
			$(xmlData).find('page').each(function(){
				var page = {};
				var type = $(this).attr('type');
				page.type = type;
				page.id = $(this).attr('id');// 附件唯一标识
				page.qr_str = $(this).find('head').attr('qr_str');// 用于生成二维码
				page.print_time = $(this).find('head').attr('print_time');// 打印时间
				page.print_inst = '恒丰银行';// 打印机构
				page.print_teller = PJF.otherInfo.devId;// 打印柜员
				page.print_cnts = $(this).find('head').attr('print_cnts');// 打印次数
				page.print_cardNo = STM.corporateBill.Txn_CardNo || '';// 打印卡号
				
				switch(type){
				case 'pos':// pos清单（附件）
					page.acct_no = $(this).find('head').attr('acct_no');// 账号
					page.shop_no = $(this).find('head').attr('shop_no');// 商户编号
					page.shop_name = $(this).find('head').attr('shop_name');// 商户名称
					page.pos_no = $(this).find('head').attr('pos_no');// pos编号
					page.tot_tranamt = $(this).find('head').attr('tot_tranamt');// 总交易金额
					page.tot_feeamt = $(this).find('head').attr('tot_feeamt');// 总手续费金额
					page.tot_rzamt = $(this).find('head').attr('tot_rzamt');// 总入账金额
					break;
				case 'fhtsattach':// 分行特色（附件）
					page.format_id = $(this).attr('format_id');// 分行特色附件格式
					page.attach_name = $(this).find('head').attr('attach_name');// 附件标题
					page.sa_acct_no = $(this).find('head').attr('sa_acct_no');// 账号
					page.acct_name = $(this).find('head').attr('acct_name');// 户名
					page.sa_tx_dt = $(this).find('head').attr('sa_tx_dt');// 日期
					page.sa_tx_log_no = $(this).find('head').attr('sa_tx_log_no');// 流水号
					page.page_info = $(this).find('head').attr('page_info');// 页码信息
					break;
				case 'hrhk':// 汇入汇款（附件）
					page.re_in_dt = $(this).find('head').attr('re_in_dt');// 交易日期
					page.sa_tx_log_no = $(this).find('head').attr('sa_tx_log_no');// 流水号
					page.re_number_in = $(this).find('head').attr('re_number_in');// 汇款单号
					page.trans_code = $(this).find('head').attr('trans_code');// 汇款编号
					page.payee_name = $(this).find('head').attr('payee_name');// 收款人户名
					page.payee_acctno = $(this).find('head').attr('payee_acctno');// 收款人账号
					page.sa_tx_amt= $(this).find('head').attr('curr_name') + ' ' + $(this).find('head').attr('sa_tx_amt');//币种及金额
					page.payer_name= $(this).find('head').attr('payer_name');//付款人户名
					page.payer_acctno= $(this).find('head').attr('payer_acctno');//收款人账号
					page.post_script= $(this).find('head').attr('post_script');//附言
					page.memo1= $(this).find('head').attr('memo1');//发报行编码
					page.memo2= $(this).find('head').attr('memo2');//起息日
					page.sa_tx_dt= $(this).find('head').attr('sa_tx_dt');//汇款日期
					page.memo3= $(this).find('head').attr('memo3');//相关编号
					page.memo4= $(this).find('head').attr('memo4');//付款人开户行名
					page.memo5= $(this).find('head').attr('memo5');//中间行
					page.memo6= $(this).find('head').attr('memo6');//收款人开户行名
					page.memo7= $(this).find('head').attr('memo7');//附言
					page.cc_cur_amt= $(this).find('head').attr('cc_cur_amt');//发报行费用金额
					page.print_org= '恒丰银行';//打印机构
					page.print_oper= PJF.otherInfo.devId;// 打印柜员
					page.print_cardNo= STM.corporateBill.Txn_CardNo || '';//打印卡号
					//page.QR_code= $(this).find('head').attr('QR_code');//二维码
					break;
				default:
					break;
				}
				
				// 获取二维码图片资源
				var content = 'branch-attach-' + page.id + '-' + (parseInt(page.print_cnts) + 1);
				content += '-' + PJF.util.formatDate(new Date(),"yyyy") + '-' + page.qr_str;
				
				if('hrhk' == type){
					page.QR_code = content;
				} else {
					page.imgSrc = STM.corporateBill.createQRCode(content);
					if(!page.imgSrc){// 生成二维码失败则结束打印任务
	    				pages = [];
	    				return false;
	    			}
					// 表格数据
					var list = new Array();
					$(this).find('item').each(function(){
						var tmp = $(this).text();
						var array = tmp.split(' ■ ');// 消除所有的空格后根据“■”划分数据
						list.push(array);
					});
					page.list = list;
				}
				
				pages.push(page);
			});
			
			return data;
		},
		/*
		 * 装饰POS交易报表数据
		 * xmlPath xml文件路径
		 */ 
	//20200717 不用代码 涉及到PJF.communication.ajax 注释
	/**
	 * @function decoratePOSData
	 * @param {String}xmlPath   xml文件路径
	 * @returns {any[]} POS交易报表数据
	 * 装饰POS交易报表数据
	 */
		decoratePOSData : function(xmlPath){
			var pages = new Array();
			// 根据XML文件路径获取打印数据
    		var xmlData = STM.corporateBill.getXmlData(xmlPath);
    		if(xmlData){
    			$(xmlData).find('page').each(function(){
    				var printData = {};
    				printData.id = $(this).find('head').attr('id');// 附件唯一标识
    				printData.qr_str = $(this).find('head').attr('qr_str');// 用于生成二维码
    				printData.acct_no = $(this).find('head').attr('acct_no');// 账号
    				printData.shop_no = $(this).find('head').attr('shop_no');// 商户编号
    				printData.shop_name = $(this).find('head').attr('shop_name');// 商户名称
    				printData.pos_no = $(this).find('head').attr('pos_no');// pos编号
    				printData.tot_tranamt = $(this).find('head').attr('tot_tranamt');// 总交易金额
    				printData.tot_feeamt = $(this).find('head').attr('tot_feeamt');// 总手续费金额
    				printData.tot_rzamt = $(this).find('head').attr('tot_rzamt');// 总入账金额
    				printData.print_time = $(this).find('head').attr('print_time');// 打印时间
    				printData.print_inst = '恒丰银行';// 打印机构
    				printData.print_teller = PJF.otherInfo.devId;// 打印柜员
    				printData.print_cnts = $(this).find('head').attr('print_cnts');// 打印次数
    				printData.print_cardNo = STM.corporateBill.Txn_CardNo || '';// 打印卡号
    				
    				var content = 'branch-attach-' + printData.id + '-' + (parseInt(printData.print_cnts) + 1);
    				content += '-' + PJF.util.formatDate(new Date(),"yyyy") + '-' + printData.qr_str;
    				printData.imgSrc = STM.corporateBill.createQRCode(content);// 获取二维码图片资源
    				if(!printData.imgSrc){// 生成二维码失败则结束打印任务
        				pages = [];
        				return false;
        			}
    				
    				var list = new Array();
    				$(this).find('item').each(function(){
    					var tmp = $(this).text();
    					var array = tmp.split(' ■ ');// 消除所有的空格后根据“ ■ ”划分数据
    					list.push(array);
    				});
    				printData.list = list;
    				
    				pages.push(printData);
    			});
    		}
			
			return pages;
		},
		/*
		 * 装饰分行特色附件数据
		 * xmlPath xml文件路径
		 */ 
	//20200717 不用代码 涉及到PJF.communication.ajax 注释
	/**
	 * @function decorateFHTSData
	 * @param {String}xmlPath xml文件路径
	 * 装饰分行特色附件数据
	 */
		decorateFHTSData : function(xmlPath){
			var data = {};// 所有数据
			var pages = new Array();// 清单数据
			data['pages'] = pages;
			// 根据XML文件路径获取打印数据
    		var xmlData = STM.corporateBill.getXmlData(xmlPath);
    		if(xmlData){
    			var temp = {};
    			// 解析page
    			$(xmlData).find('page').each(function(){
    				var page = {};
    				var formatId = $(this).attr('format_id');
    				page.formatId = formatId;// 表头id
    				page.id = $(this).find('head').attr('id');// 附件唯一标识
    				page.attach_name = $(this).find('head').attr('attach_name');// 附件标题
    				page.qr_str = $(this).find('head').attr('qr_str');// 用于生成二维码
    				page.sa_acct_no = $(this).find('head').attr('sa_acct_no');// 账号
    				page.acct_name = $(this).find('head').attr('acct_name');// 户名
    				page.sa_tx_dt = $(this).find('head').attr('sa_tx_dt');// 日期
    				page.sa_tx_log_no = $(this).find('head').attr('sa_tx_log_no');// 流水号
    				page.page_info = $(this).find('head').attr('page_info');// 页码信息
    				page.print_time = $(this).find('head').attr('print_time');// 打印时间
    				page.print_inst = '恒丰银行';// 打印机构
    				page.print_teller = PJF.otherInfo.devId;// 打印柜员
    				page.print_cnts = $(this).find('head').attr('print_cnts');// 打印次数
    				page.print_cardNo = STM.corporateBill.Txn_CardNo || '';// 打印卡号
    				
    				var content = 'branch-attach-' + page.id + '-' + (parseInt(page.print_cnts) + 1);
    				content += '-' + PJF.util.formatDate(new Date(),"yyyy") + '-' + page.qr_str;
    				page.imgSrc = STM.corporateBill.createQRCode(content);// 获取二维码图片资源
    				if(!page.imgSrc){// 生成二维码失败则结束打印任务
        				pages = [];
        				return false;
        			}
    				
    				var list = new Array();
    				$(this).find('item').each(function(){
    					var tmp = $(this).text();
    					var array = tmp.split(' ■ ');// 消除所有的空格后根据“ ■ ”划分数据
    					list.push(array);
    				});
    				page.list = list;
    				pages.push(page);
    			});
    			// 解析displayset
    			var displayset = $(xmlData).find('displayset');
    			displayset.find('items').each(function(){
    				var formatId = $(this).attr('id');
    				if(formatId){
    					var head = {};
						var list2 = new Array();// 表头列表
						var totalLen = 0;// 总长度
						$(this).find('item').each(function(){
							var headArg = {};
							headArg.colNum = $(this).attr('en_name').split('col')[1];
							headArg.colName = $(this).attr('ch_name');
							headArg.length = $(this).attr('en_length');
							headArg.align = $(this).attr('align');
							totalLen += parseInt(headArg.length);
							
							list2.push(headArg);
						});
						
						head.totalLen = totalLen;
						head.colsData = list2;
						data[formatId] = head;
    				}
    			});
    		}
			
			return data;
		},
		/**
		 * @function createLPHTML
		 * @param {Object}data 页面数据
		 * @parma {String}pageCount 第几页
		 *  创建账页明细HTML页面内容
		 */
		createLPHTML : function(data, pageCount){
			var textHTML = '';
			//@critical 连续打印设置
			if(pageCount == 1){
				textHTML += '<div style="page-break-after:always;">';
			}else{
				textHTML += '<div style="page-break-after:always;padding-top:1px;">';
			}
			textHTML += '<style>';
			textHTML += '.leger_preview_mid{font-size:13px;border:1px solid black;}';
			textHTML += '.leger_preview_mid tr{line-height:17px;}';
			textHTML += '.qr_img{position:absolute;right:1%;top:0%;}';
			textHTML += '.th_left{border-top:0;border-right:1px solid black;border-bottom:1px solid black;border-left:0;}';
			textHTML += '.th_right{border-top:0;border-right:0;border-bottom:1px solid black;border-left:0;}';
			textHTML += '.td_left{border-top:0;border-right:1px solid black;border-bottom:0;border-left:0;}';
			textHTML += '.td_right{border-top:0;border-right:0;border-bottom:0;border-left:0;}';
			// 隐藏每一列超出的内容
			textHTML += '.td_hide{white-space:nowrap;overflow-x:hidden;max-width:10px;}';
			/*textHTML += '.td_zy{white-space:nowrap;overflow-x:hidden;max-width:103px;}';
			textHTML += '.td_hm{white-space:nowrap;overflow-x:hidden;max-width:207px;}';
			textHTML += '.td_lsh{white-space:nowrap;overflow-x:hidden;max-width:124px;}';
			textHTML += '.td_pzlx{white-space:nowrap;overflow-x:hidden;max-width:64px;}';
			textHTML += '.td_pzhm{white-space:nowrap;overflow-x:hidden;max-width:107px;}';*/
			textHTML += '</style>';
			textHTML += '<div style="width:100%;margin:0 auto;position:relative;">';
			// --头部start
			textHTML += '<div class="qr_img">';// 二维码
			textHTML += '<img src="'+data.imgSrc+'" width="80px" height="80px" alt="" style="margin-top:10px;"/>';
			textHTML += '</div>';
			textHTML += '<h3 align="center" style="font-size:22px;margin:20px auto;">恒丰银行股份有限公司活期存款明细账</h3>';
			textHTML += '<table width=100% cellpadding=0 cellspacing=0 border=0 style="font-size:13px;">';
			textHTML += '<tr style="line-height:25px;">';
			textHTML += '<td width="29%" style="padding-left:15px;" align="left">币别：' + data.cur_code + '</td>';
			textHTML += '<td width="32%" align="left">钞汇鉴别：' + data.cur_iden + '</td>';
			textHTML += '<td width="23%" align="left">&nbsp;</td>';
			textHTML += '<td width="16%" align="left">&nbsp;</td>';
			textHTML += '</tr>';
			textHTML += '<tr style="line-height:25px;">';
			textHTML += '<td style="padding-left:15px;" align="left">账号：' + data.acct_no + '</td>';
			textHTML += '<td align="left">账户名称：' + data.fs_acctname  + '</td>';
			textHTML += '<td align="left">日期：' + data.start_date + '&nbsp;-&nbsp;' + data.end_date + '</td>';
			textHTML += '<td align="left">页码：' + data.page_no + '</td>';
			textHTML += '</tr>';
			textHTML += '</table>';
			// --头部end
			// --表头start
			textHTML += '<table width=100% border=0 cellpadding=0 cellspacing=0 class="leger_preview_mid">';
			textHTML += '<tr>';
			textHTML += '<th class="th_left" width="5%" rowspan="2">日期</th>';
			textHTML += '<th class="th_left" width="6%" rowspan="2">凭证类型</th>';
			textHTML += '<th class="th_left" width="10%" rowspan="2">凭证号码</th>';
			textHTML += '<th class="th_left" width="10%" rowspan="2">摘要</th>';
			textHTML += '<th class="th_left" width="20%" rowspan="2">对方户名</th>';
			textHTML += '<th class="th_left" width="24%" colspan="2">发生额</th>';
			textHTML += '<th class="th_left" width="3%" rowspan="2">借贷</th>';
			textHTML += '<th class="th_left" width="12%" rowspan="2">余额</th>';
			textHTML += '<th class="th_right" width="10%" rowspan="2">交易流水号</th>';
			textHTML += '</tr>';
			textHTML += '<tr>';
			textHTML += '<th class="th_left" width="12%">借方</th>';
			textHTML += '<th class="th_left" width="12%">贷方</th>';
			textHTML += '</tr>';
			// --表头end
			// --中间数据start
			var time = 0;
			if(data.list && data.list.length && data.list.length > 0){
				time = data.list.length;
				for(var i = 0; i < data.list.length; i++){
					textHTML += '<tr>';
					textHTML += '<td class="td_left td_hide">' + data.list[i][0].trim() + '</td>';
					textHTML += '<td class="td_left td_hide">' + data.list[i][1].trim() + '</td>';
					textHTML += '<td class="td_left td_hide">' + data.list[i][2].trim() + '</td>';
					textHTML += '<td class="td_left td_hide">' + data.list[i][3].trim() + '</td>';
					textHTML += '<td class="td_left td_hide">' + data.list[i][4].trim() + '</td>';
					textHTML += '<td class="td_left td_hide" align="right">' + STM.corporateBill.getJE(data.list[i][5].trim()) + '</td>';
					textHTML += '<td class="td_left td_hide" align="right">' + STM.corporateBill.getJE(data.list[i][6].trim()) + '</td>';
					textHTML += '<td class="td_left td_hide" align="center">' + data.list[i][7].trim() + '</td>';
					textHTML += '<td class="td_left td_hide" align="right">' + STM.corporateBill.getJE(data.list[i][8].trim()) + '</td>';
					textHTML += '<td class="td_right td_hide" align="left">' + data.list[i][9].trim() + '</td>';
					textHTML += '</tr>';
				}
			}
			if(time < 30){
				for(var k = 0; k < (30 - time); k++){
					textHTML += '<tr>';
					textHTML += '<td class="td_left">&nbsp;</td>';
					textHTML += '<td class="td_left">&nbsp;</td>';
					textHTML += '<td class="td_left">&nbsp;</td>';
					textHTML += '<td class="td_left">&nbsp;</td>';
					textHTML += '<td class="td_left">&nbsp;</td>';
					textHTML += '<td class="td_left">&nbsp;</td>';
					textHTML += '<td class="td_left">&nbsp;</td>';
					textHTML += '<td class="td_left">&nbsp;</td>';
					textHTML += '<td class="td_left">&nbsp;</td>';
					textHTML += '<td class="td_right">&nbsp;</td>';
					textHTML += '</tr>';
				}
			}
			textHTML += '</table>';
			// --中间数据end
			// --尾部start
			textHTML += '<table width=100% cellpadding=0 cellspacing=0 border=0  style="font-size:13px;">';
			textHTML += '<tr style="line-height:17px;">';
			textHTML += '<td width="22%" style="padding-left:15px;" align="left">打印时间：' + data.print_time + '</td>';
			textHTML += '<td width="26%" align="left">打印机构：' + data.print_inst + '</td>';
			textHTML += '<td width="16%" align="left">打印柜员：' + data.print_teller + '</td>';
			textHTML += '<td width="11%" align="left">补打次数：' + data.print_cnts + '</td>';
			textHTML += '<td width="25%" align="left">打印卡号：' + data.print_cardNo + '</td>';
			textHTML += '</tr>';
			textHTML += '</table>';
			// --尾部end
			
			textHTML += STM.corporateBill.addClientNoticeNew();
			
			textHTML += '</div></div>';
			
			return textHTML;
		},
		/**
		 * @function createPOSHTML
		 *  @param {Object}data 页面数据
		 *  创建POS清单HTML页面内容
		 */
		createPOSHTML : function(data){
			var textHTML = '<div><style>';
			textHTML += '.pos_preview_mid{font-size:13px;border:1px solid black;}';
			textHTML += '.pos_preview_mid tr{line-height:17px;}';
			textHTML += '.qr_img{position:absolute;right:1%;top:0%;}';
			textHTML += '.th_left{border-top:0;border-right:1px solid black;border-bottom:1px solid black;border-left:0;}';
			textHTML += '.th_right{border-top:0;border-right:0;border-bottom:1px solid black;border-left:0;}';
			textHTML += '.td_left{border-top:0;border-right:1px solid black;border-bottom:0;border-left:0;}';
			textHTML += '.td_right{border-top:0;border-right:0;border-bottom:0;border-left:0;}';
			// 隐藏每一列超出的内容
			textHTML += '.td_hide{white-space:nowrap;overflow-x:hidden;max-width:10px;}';
			textHTML += '</style>';
			textHTML += '<div style="width:100%;margin:0 auto;position:relative;">';
			// -- 二维码图片
			textHTML += '<div class="qr_img"><img src="'+data.imgSrc+'" width="70px" height="70px" alt="" style="margin-top:10px;"/></div>';
			// -- 头部start
			textHTML += '<h3 align="center" style="font-size:22px;margin:20px auto;">恒丰银行股份有限公司POS交易报表</h3>';
			textHTML += '<table width=100% cellpadding=0 cellspacing=0 border=0 style="font-size:13px;">';
			textHTML += '<tr style="line-height:25px;">';
			textHTML += '<td width="27%" style="padding-left:15px;" align="left">账号：'+data.acct_no+'</td>';
			textHTML += '<td width="22%" align="left">商户编号：'+data.shop_no+'</td>';
			textHTML += '<td width="51%" align="left" colspan="2">'+data.shop_name+'</td>';
			textHTML += '</tr>';
			textHTML += '<tr style="line-height:25px;">';
			textHTML += '<td width="27%" style="padding-left:15px;" align="left">POS编号：'+data.pos_no+'</td>';
			textHTML += '<td width="22%" align="left">'+data.tot_tranamt+'</td>';
			textHTML += '<td width="25%" align="left">'+data.tot_feeamt+'</td>';
			textHTML += '<td width="26%" align="left">'+data.tot_rzamt+'</td>';
			textHTML += '</tr>';
			textHTML += '</table>';
			// -- 头部end
			// -- 中间数据start
			textHTML += '<table width=100% border=0 cellpadding=0 cellspacing=0 class="pos_preview_mid">';
			textHTML += '<tr>';
			textHTML += '<th class="th_left" width="10%">卡号</th>';
			textHTML += '<th class="th_left" width="7%">交易金额</th>';
			textHTML += '<th class="th_left" width="6%">手续费</th>';
			textHTML += '<th class="th_left" width="7%">入账金额</th>';
			textHTML += '<th class="th_left" width="8%">外卡DCC返佣</th>';
			textHTML += '<th class="th_left" width="8%">POS结账日期</th>';
			textHTML += '<th class="th_left" width="6%">交易日期</th>';
			textHTML += '<th class="th_left" width="5%">交易时间</th>';
			textHTML += '<th class="th_left" width="5%">批次号</th>';
			textHTML += '<th class="th_left" width="5%">授权号</th>';
			textHTML += '<th class="th_left" width="8%">POS交易序号</th>';
			textHTML += '<th class="th_left" width="6%">交易类型</th>';
			textHTML += '<th class="th_left" width="4%">卡类型</th>';
			textHTML += '<th class="th_left" width="4%">发卡组织标示</th>';
			textHTML += '<th class="th_left" width="4%">分期消费期数</th>';
			textHTML += '<th class="th_left" width="4%">降级交易标志</th>';
			textHTML += '<th class="th_right" width="3%">卡序列号</th>';
			textHTML += '</tr>';
			var time = 0;
			if(data.list && data.list.length && data.list.length > 0){
				time = data.list.length;
				for(var i = 0; i < data.list.length; i++){
					textHTML += '<tr>';
					textHTML += '<td class="td_left td_hide" align="left">'+data.list[i][0].trim()+'</td>';
					textHTML += '<td class="td_left td_hide" align="right">'+data.list[i][1].trim()+'</td>';
					textHTML += '<td class="td_left td_hide" align="right">'+data.list[i][2].trim()+'</td>';
					textHTML += '<td class="td_left td_hide" align="right">'+data.list[i][3].trim()+'</td>';
					textHTML += '<td class="td_left td_hide" align="right">'+data.list[i][13].trim()+'</td>';
					textHTML += '<td class="td_left td_hide" align="left">'+data.list[i][10].trim()+'</td>';
					textHTML += '<td class="td_left td_hide" align="left">'+data.list[i][5].trim()+'</td>';
					textHTML += '<td class="td_left td_hide" align="left">'+data.list[i][6].trim()+'</td>';
					textHTML += '<td class="td_left td_hide" align="left">'+data.list[i][8].trim()+'</td>';
					textHTML += '<td class="td_left td_hide" align="left">'+data.list[i][11].trim()+'</td>';
					textHTML += '<td class="td_left td_hide" align="left">'+data.list[i][7].trim()+'</td>';
					textHTML += '<td class="td_left td_hide" align="left">'+data.list[i][9].trim()+'</td>';
					textHTML += '<td class="td_left td_hide" align="left">'+data.list[i][4].trim()+'</td>';
					textHTML += '<td class="td_left td_hide" align="left">'+data.list[i][12].trim()+'</td>';
					textHTML += '<td class="td_left td_hide" align="left">'+data.list[i][14].trim()+'</td>';
					textHTML += '<td class="td_left td_hide" align="left">'+data.list[i][16].trim()+'</td>';
					textHTML += '<td class="td_right td_hide" align="left">'+(data.list[i][15].trim() || '&nbsp;')+'</td>';
    				textHTML += '</tr>';
				}
			}
			if(time < 30){
				for(var k = 0; k < (30 - time); k++){
					textHTML += '<tr>';
					textHTML += '<td class="td_left" align="left">&nbsp;</td>';
					textHTML += '<td class="td_left" align="right">&nbsp;</td>';
					textHTML += '<td class="td_left" align="right">&nbsp;</td>';
					textHTML += '<td class="td_left" align="right">&nbsp;</td>';
					textHTML += '<td class="td_left" align="right">&nbsp;</td>';
					textHTML += '<td class="td_left" align="left">&nbsp;</td>';
					textHTML += '<td class="td_left" align="left">&nbsp;</td>';
					textHTML += '<td class="td_left" align="left">&nbsp;</td>';
					textHTML += '<td class="td_left" align="left">&nbsp;</td>';
					textHTML += '<td class="td_left" align="left">&nbsp;</td>';
					textHTML += '<td class="td_left" align="left">&nbsp;</td>';
					textHTML += '<td class="td_left" align="left">&nbsp;</td>';
					textHTML += '<td class="td_left" align="left">&nbsp;</td>';
					textHTML += '<td class="td_left" align="left">&nbsp;</td>';
					textHTML += '<td class="td_left" align="left">&nbsp;</td>';
					textHTML += '<td class="td_left" align="left">&nbsp;</td>';
					textHTML += '<td class="td_right" align="left">&nbsp;</td>';
    				textHTML += '</tr>';
				}
			}
			textHTML += '</table>';
			// -- 中间数据end
			// -- 尾部start
			textHTML += '<table width=100% cellpadding=0 cellspacing=0 border=0 style="font-size:13px;">';
			textHTML += '<tr style="line-height:17px;">';
			textHTML += '<td width="22%" style="padding-left:15px;" align="left">打印时间：'+data.print_time+'</td>';
			textHTML += '<td width="26%" align="left">打印机构：'+data.print_inst+'</td>';
			textHTML += '<td width="22%" align="left">打印柜员：'+data.print_teller+'</td>';
			textHTML += '<td width="30%" align="left">打印卡号：'+data.print_cardNo+'</td>';
			textHTML += '</tr>';
			textHTML += '</table>';
			// -- 尾部end
			
			textHTML += STM.corporateBill.addClientNoticeNew();
			
			textHTML += '</div></div>';
			
			return textHTML;
		},
		/**
		 * @function createFHTSHTML
		 * @param {String}page 页面数据
		 * 创建分行特色HTML页面内容
		 */
		createFHTSHTML : function(page){
			var textHTML = '<div><style>';
			textHTML += '.fhts_preview_mid{font-size:13px;border:1px solid black;}';
			textHTML += '.fhts_preview_mid tr{line-height:17px;}';
			textHTML += '.qr_img{position:absolute;right:3%;top:1%;}';
			textHTML += '.th_left{border-top:0;border-right:1px solid black;border-bottom:1px solid black;border-left:0;}';
			textHTML += '.th_right{border-top:0;border-right:0;border-bottom:1px solid black;border-left:0;}';
			textHTML += '.td_left{border-top:0;border-right:1px solid black;border-bottom:0;border-left:0;}';
			textHTML += '.td_right{border-top:0;border-right:0;border-bottom:0;border-left:0;}';
			// 隐藏每一列超出的内容
			textHTML += '.td_hide{white-space:nowrap;overflow-x:hidden;max-width:10px;}';
			textHTML += '</style>';
			textHTML += '<div style="width:100%;margin:0 auto;position:relative;">';
			// -- 二维码图片
			textHTML += '<div class="qr_img"><img src="'+page.imgSrc+'" width="70px" height="70px" alt="" style="margin-top:10px;"/></div>';
			// -- 头部start
			//textHTML += '<h3 align="center" style="font-size:22px;margin:8px auto;">清单式附件：广东直联POS商户清单</h3>';
			textHTML += '<h3 align="center" style="font-size:22px;margin:20px auto;">'+page.attach_name+'</h3>';
			textHTML += '<table width=100% cellpadding=0 cellspacing=0 border=0 style="font-size:13px;">';
			textHTML += '<tr style="line-height:25px;">';
			textHTML += '<td width="18%">&nbsp;</td>';
			textHTML += '<td width="37%">&nbsp;</td>';
			textHTML += '<td width="10%">&nbsp;</td>';
			textHTML += '<td width="20%">&nbsp;</td>';
			textHTML += '<td width="15%">&nbsp;</td>';
			textHTML += '</tr>';
			textHTML += '<tr style="line-height:25px;">';
			textHTML += '<td>&nbsp;</td>';
			textHTML += '<td>&nbsp;</td>';
			textHTML += '<td>&nbsp;</td>';
			textHTML += '<td>&nbsp;</td>';
			textHTML += '<td>&nbsp;</td>';
			textHTML += '</tr>';
			textHTML += '<tr style="line-height:25px;">';
			textHTML += '<td  style="padding-left:10px;" align="left">账号：'+page.sa_acct_no+'</td>';
			textHTML += '<td align="left">账户名称：'+page.acct_name+'</td>';
			textHTML += '<td align="left">日期：'+page.sa_tx_dt+'</td>';
			textHTML += '<td align="left">流水号：'+page.sa_tx_log_no+'</td>';
			textHTML += '<td align="left">页码：'+page.page_info+'</td>';
			textHTML += '</tr>';
			textHTML += '</table>';
			// -- 头部end
			// -- 中间数据start
			textHTML += '<table width=100% border=0 cellpadding=0 cellspacing=0 class="fhts_preview_mid">';
			// ---- 表头start
			var head = page.head;// 获取表头信息
			var totalLen = parseFloat(head.totalLen);// 表头总长度
			var colsData = head.colsData;// 表头每列数据
			var temPercent = 4;// 记录每列所占百分比之和
			textHTML += '<tr>';
			textHTML += '<th class="th_left" width="4%">序号</th>';
			for(var i = 0; i < colsData.length; i++){
				if(i < (colsData.length - 1)){// 不是最后一列
					var length = parseFloat(colsData[i].length);// 列长度
					var percent = parseInt(length / totalLen * 96.00);
					temPercent += percent;
					textHTML += '<th class="th_left td_hide" width="'+percent+'%">'+colsData[i].colName+'</th>';
				}else{// 最后一列
					textHTML += '<th class="th_right td_hide" width="'+(100 - temPercent)+'%">'+colsData[i].colName+'</th>';
				}
			}
			textHTML += '</tr>';
			// ---- 表头end
			var time = 0;
			if(page.list && page.list.length && page.list.length > 0){
				time = page.list.length;
				for(var j = 0; j < page.list.length; j++){
					textHTML += '<tr>';
					textHTML += '<td class="td_left" align="left">'+page.list[j][0].trim()+'</td>';
					for(var k = 0; k < colsData.length; k++){
						if(k < (colsData.length - 1)){
							textHTML += '<td class="td_left" align="'+colsData[k].align+'">'+page.list[j][k+1].trim()+'</td>';
						}else{
							textHTML += '<td class="td_right" align="'+colsData[k].align+'">'+page.list[j][k+1].trim()+'</td>';
						}
					}
					textHTML += '</tr>';
				}
			}
			if(time < 30){
				for(var m = 0; m < (30 - time); m++){
					textHTML += '<tr>';
					textHTML += '<td class="td_left" align="left">&nbsp;</td>';
					for(var n = 0; n < colsData.length; n++){
						if(n < (colsData.length - 1)){
							textHTML += '<td class="td_left" align="'+colsData[n].align+'">&nbsp;</td>';
						}else{
							textHTML += '<td class="td_right" align="'+colsData[n].align+'">&nbsp;</td>';
						}
					}
    				textHTML += '</tr>';
				}
			}
			textHTML += '</table>';
			// -- 中间数据end
			// -- 尾部start
			textHTML += '<table width=100% cellpadding=0 cellspacing=0 border=0 style="font-size:13px;">';
			textHTML += '<tr style="line-height:17px;">';
			textHTML += '<td width="22%" style="padding-left:15px;" align="left">打印时间：'+page.print_time+'</td>';
			textHTML += '<td width="26%" align="left">打印机构：'+page.print_inst+'</td>';
			textHTML += '<td width="22%" align="left">打印柜员：'+page.print_teller+'</td>';
			textHTML += '<td width="30%" align="left">打印卡号：'+page.print_cardNo+'</td>';
			textHTML += '</tr>';
			textHTML += '</table>';
			// -- 尾部end
			
			textHTML += STM.corporateBill.addClientNoticeNew();
			
			textHTML += '</div></div>';
		
			return textHTML;
		},
		//打印活期、定期、贷款、全量、过滤、对账单明细数据
		printHtmlDataByTxCode_queryCBResultNew : function(xmlPath, txCode){
			console.log('line3707');
			var xmlPathDataRows = [];
			//去掉无效数据
			if(!xmlPath||!(xmlPath.allRows&&xmlPath.allRows.length)){
				STM.corporateBill.showAlertMsg('无明细数据可打印');
				return;
			}
			//判断是否使用电子印章
			var imgSrc="";//电子印章图片本地地址
			var ifUseChapter = false;//是否使用电子印章标志
			var conf = {};
			conf.Stmp_Bsn_Ctlg_ID = "001";//默认传001
			conf.Stmp_Blng_InsID = PJF.roleInfo.orgCode;
			conf.VchID = "MXDY0CCMS00000000000000000000001";//明细查询
			conf.Mnplt_TpCd="03";//默认03：客户端查询
			/*STM.corporateBill.getElecChapter(conf,function(elec_flag){
				console.log("明晰查询跟踪号："+xmlPath.SYS_EVT_TRACE_ID);
				if(elec_flag == 1){

				}else{
					ifUseChapter = false;
					continuePreviewqueryCBResultNew(xmlPath, txCode, imgSrc, ifUseChapter);
				}
			});*/
			var queryCBType='';
			if('A0181S405' == txCode.TxCode && '1' == txCode.TpCd) {
				queryCBType = '恒丰银行股份有限公司活期存款明细账';
			} else if('A0181T703' == txCode.TxCode){
				queryCBType = '恒丰银行股份有限公司定期存款明细账';
			} else if('A02111050' == txCode.TxCode){
				queryCBType = '恒丰银行股份有限公司贷款明细账';
			}else if('A05820113' == txCode.TxCode) {
				queryCBType = '恒丰银行股份有限公司活期存款明细账';
			}else if('A05820114' == txCode.TxCode) {
				queryCBType = '恒丰银行股份有限公司活期存款明细账';
			} else if('A0181S405' == txCode.TxCode && '4' == txCode.TpCd){
				queryCBType = '集团流动性管理账户对账单';
			}
			var Clmn_Opt_Dsc = '001:类型:' + queryCBType +
				'&amp;&amp;002:账号:' + txCode.Cst_AccNo + 
				'&amp;&amp;003:账户名称:' + txCode.Acc_AccNm +
				'&amp;&amp;004:日期:' +  txCode.StDt + ' - ' + txCode.EdDt +
				'&amp;&amp;005:打印机构:恒丰银行' +
				'&amp;&amp;006:打印柜员:' + PJF.otherInfo.devId ;
				//'&amp;&amp;006:打印柜员:' + PJF.otherInfo.devId +
				//'&amp;&amp;007:打印卡号:' + STM.corporateBill.Txn_CardNo;
			var args = {};
			var Vchr_Grp=[];
			Vchr_Grp.push({
		   		"Ovrlsttn_Trck_No":xmlPath.SYS_EVT_TRACE_ID,
				"VchID":"MXDY0CCMS00000000000000000000001",
		   		//"VchID":"MXDY0CCMS00000000000000000000002",
				"Stmp_Bsn_Ctlg_ID":"001",
				"Clmn_Opt_Dsc":Clmn_Opt_Dsc
			});
			args.Vchr_Grp = Vchr_Grp;
			args.Txn_InsID = PJF.roleInfo.orgCode;
			args.Txn_TrID =  PJF.otherInfo.devId;
			args.Txn_Dt_Tm = PJF.communication.getServerTime("yyyyMMddHHmmssSSS");
			args.CALLOUT_TXN_CD = "MXDYDIY09";//虚拟交易号
			args.Vchr_RePrt_Cnt = 0;//0：初次打印1：重新打印
			args.Txn_Chnl_Cd = '02';//智慧柜员机
			args.Txn_TpDs = "ZDZZ";
			STM.corporateBill.getTransSeal(args,function(result){
                console.log("调用电子印章图片方法返回结果："+PJF.util.json2str(result));
                if(result.success == true){
                	ifUseChapter = true;
                    imgSrc = result.imgSrc;
                }else{
                	ifUseChapter = false;
                }
				continuePreviewqueryCBResultNew(xmlPath, txCode, imgSrc, ifUseChapter);
            });
			
			function continuePreviewqueryCBResultNew(xmlPath, txCode, imgSrc, ifUseChapter){

				for(var i=0;i<xmlPath.allRows.length;i++){

					if('A0181S405' == txCode.TxCode && '1' == txCode.TpCd) {
						if(!('' == xmlPath.allRows[i].Txn_Dt && ('0.00' == xmlPath.allRows[i].Dep_Cr_HpnAm || '' == xmlPath.allRows[i].Dep_Cr_HpnAm) && ('0.00' == xmlPath.allRows[i].Dep_DHAmt || '' == xmlPath.allRows[i].Dep_DHAmt))){
							xmlPathDataRows.push(xmlPath.allRows[i]);
						}
					} else if('A0181T703' == txCode.TxCode){
						if(!('' == xmlPath.allRows[i].Txn_Dt && ('0.00' == xmlPath.allRows[i].Dep_TxnAmt || '' == xmlPath.allRows[i].Dep_TxnAmt))){
							xmlPathDataRows.push(xmlPath.allRows[i]);
						}
					} else if('A02111050' == txCode.TxCode){
						if(!('' == xmlPath.allRows[i].Txn_Dt && ('0.00' == xmlPath.allRows[i].Mdf_Amt || '' == xmlPath.allRows[i].Mdf_Amt))){
							xmlPathDataRows.push(xmlPath.allRows[i]);
						}
					}else if('A05820113' == txCode.TxCode) {
						if(!('' == xmlPath.allRows[i].Txn_Dt && ('0.00' == xmlPath.allRows[i].Dbt_Txn_HpnAm || '' == xmlPath.allRows[i].Dbt_Txn_HpnAm) && ('0.00' == xmlPath.allRows[i].Cr_Txn_HpnAm || '' == xmlPath.allRows[i].Cr_Txn_HpnAm))){
							xmlPathDataRows.push(xmlPath.allRows[i]);
						}
					}else if('A05820114' == txCode.TxCode) {
						if(!('' == xmlPath.allRows[i].Txn_Dt && ('0.00' == xmlPath.allRows[i].Dbt_Txn_HpnAm || '' == xmlPath.allRows[i].Dbt_Txn_HpnAm) && ('0.00' == xmlPath.allRows[i].Cr_Txn_HpnAm || '' == xmlPath.allRows[i].Cr_Txn_HpnAm))){
							xmlPathDataRows.push(xmlPath.allRows[i]);
						}
					} else if('A0181S405' == txCode.TxCode && '4' == txCode.TpCd){
						if(!('' == xmlPath.allRows[i].Txn_Dt && ('0.00' == xmlPath.allRows[i].Dep_Cr_HpnAm || '' == xmlPath.allRows[i].Dep_Cr_HpnAm) && ('0.00' == xmlPath.allRows[i].Dep_DHAmt || '' == xmlPath.allRows[i].Dep_DHAmt))){
							xmlPathDataRows.push(xmlPath.allRows[i]);
						}
					}
				}
				if(xmlPathDataRows.length < 1){
					STM.corporateBill.showAlertMsg('无明细数据可打印');
					return;
				}
				
				var tmpFoot ='';
				var tmpContent ='';
				var tmp;
				var time;
				var array;
				var pages = 0;//打印张数
				var pageInfo;
				var page_div0 = '';
				var page_div1 = '';
				if(ifUseChapter){
					page_div0 = '<div style="page-break-after:always;position: relative;transform:translateX(-4px)">';
					page_div1 = '<div style="page-break-after:always;padding-top:1px;position: relative;transform:translateX(-4px)">';
				}else{
					page_div0 = '<div style="page-break-after:always;position: relative;transform:translateX(-4px)">';
					page_div1 = '<div style="page-break-after:always;padding-top:1px;position: relative;transform:translateX(-4px)">';
				}
				//打印
				var htmlPaths = new Array();//html文件路径
					//先清空隐藏内容
					PJF.html.empty('printCBHtml');
					
					pageInfo = $(this);
					//表头
					var getTmpHead = function(pageInfo, pageNo, txCode){
						var tmpHead ='';
						//tmpHead += '<div id="cbHtml_1">';
						//统一样式
						tmpHead += '<style>';
						tmpHead += '.th_left{font-family: "SimSun","宋体",sans-serif;font-weight:normal;border-bottom: 1;border-left: 0;border-right: 1;border-top: 0;}';
						tmpHead += '.th_right{font-family: "SimSun","宋体",sans-serif;font-weight:normal;border-bottom: 1;border-left: 0;border-right: 0;border-top: 0;}';
						tmpHead += '.td_left{font-family: "SimSun","宋体",sans-serif;font-weight:normal;border-bottom: 0;border-left: 0;border-right: 1;border-top: 0;}';
						tmpHead += '.td_right{font-family: "SimSun","宋体",sans-serif;font-weight:normal;border-bottom: 0;border-left: 0;border-right: 0;border-top: 0;}';
						tmpHead += '.text_left{font-family: "SimSun","宋体",sans-serif;font-weight:normal;padding-left:2px;}';
						tmpHead += '.text_right{font-family: "SimSun","宋体",sans-serif;font-weight:normal;text-align:right;padding-right:2px;}';
						tmpHead += '.td_jq{font-family: "SimSun","宋体",sans-serif;font-weight:normal;white-space:nowrap;overflow-x:hidden;max-width:10px;}';
						tmpHead += '.table_font{font-family: "SimSun","宋体",sans-serif;font-weight:normal;}';
						tmpHead += '</style>';
						
						tmpHead += '<div style="font-size: 13px;">';
						tmpHead += '<table width="100%" >';
						if('A0181S405' == txCode.TxCode && '1' == txCode.TpCd) {
							/*tmpHead += '.td_pzzl{white-space:nowrap;overflow-x:hidden;max-width:10px;}';//74px
							tmpHead += '.td_pzhm{white-space:nowrap;overflow-x:hidden;max-width:10px;}';//102px
							tmpHead += '.td_zy{white-space:nowrap;overflow-x:hidden;max-width:10px;}';//98px
							tmpHead += '.td_dfhm{white-space:nowrap;overflow-x:hidden;max-width:10px;}';//235px
							tmpHead += '.td_jf{white-space:nowrap;overflow-x:hidden;max-width:10px;}';//104px
							tmpHead += '.td_df{white-space:nowrap;overflow-x:hidden;max-width:10px;}';//104px
							tmpHead += '.td_ye{white-space:nowrap;overflow-x:hidden;max-width:10px;}';//116px
							tmpHead += '.td_lsh{white-space:nowrap;overflow-x:hidden;max-width:10px;}';//118px*/
							
							tmpHead += '<tr>';
							tmpHead += '<h3 align="center" class="table_font" style="font-size: 22px;font-weight:bold;">恒丰银行股份有限公司活期存款明细账</h3>';
							tmpHead += '</tr>';
							tmpHead += '<tr style="line-height: 21px;">';
							tmpHead += '<td width="13%" class="table_font">币别：' + txCode.CcyCd_DESC + '</td>';
							tmpHead += '<td width="25%" class="table_font">账号：' + txCode.Cst_AccNo + '</td>';
							tmpHead += '<td width="40%" class="table_font">账户名称：' + txCode.Acc_AccNm + '</td>';
							tmpHead += '<td width="17%" class="table_font">日期：' + txCode.StDt + ' - ' + txCode.EdDt + '</td>';
							tmpHead += '<td width="5%" class="table_font">第' + pageNo + '页</td>';
							tmpHead += '</tr>';
							tmpHead += '</table>';
							tmpHead += '<table width="99.5%" border=1 cellpadding=0 cellspacing=0 >';
							tmpHead += '<tr style="line-height: 17px;">';
							tmpHead += '<th width="5%" class="th_left" rowspan=2>日期</th>';
							tmpHead += '<th width="7%" class="th_left" rowspan=2>凭证种类</th>';
							tmpHead += '<th width="10%" class="th_left" rowspan=2>凭证号码</th>';
							tmpHead += '<th width="10%" class="th_left" rowspan=2>摘要</th>';
							tmpHead += '<th width="23%" class="th_left" rowspan=2>对方户名</th>';
							tmpHead += '<th width="10%" class="th_left" colspan=2>发生额</th>';
							tmpHead += '<th width="3%" class="th_left" rowspan=2>借贷</th>';
							tmpHead += '<th width="11%" class="th_left" rowspan=2>余额</th>';
							tmpHead += '<th width="11%" class="th_right" rowspan=2>交易流水号</th>';
							tmpHead += '</tr>';
							tmpHead += '<tr style="line-height: 17px;">';
							tmpHead += '<th width="10%" class="th_left">借方</th>';
							tmpHead += '<th width="10%" class="th_left">贷方</th>';
							tmpHead += '</tr>';
						} else if('A0181T703' == txCode.TxCode){
							tmpHead += '<tr>';
							tmpHead += '<h3 align="center" class="table_font" style="font-size: 22px;font-weight:bold;">恒丰银行股份有限公司定期存款明细账</h3>';
							tmpHead += '</tr>';
							tmpHead += '<tr style="line-height: 21px;">';
							tmpHead += '<td width="25%" class="table_font">账号：' + txCode.Cst_AccNo + '</td>';
							tmpHead += '<td width="50%" class="table_font">账户名称：' + txCode.Acc_AccNm + '</td>';
							tmpHead += '<td width="20%" class="table_font">日期：' +  txCode.StDt + ' - ' + txCode.EdDt  + '</td>';
							tmpHead += '<td width="5%" class="table_font">第' + pageNo + '页</td>';
							tmpHead += '</tr>';
							tmpHead += '</table>';
							tmpHead += '<table width="100%" border=1 cellpadding=0 cellspacing=0 >';
							tmpHead += '<tr style="line-height: 34px;">';
							tmpHead += '<th width="6%" class="th_left">日期</th>';
							tmpHead += '<th width="11%" class="th_left">交易金额</th>';
							tmpHead += '<th width="7%" class="th_left">存期</th>';
							tmpHead += '<th width="7%" class="th_left">借贷</th>';
							tmpHead += '<th width="24%" class="th_left">摘要</th>';
							tmpHead += '<th width="7%" class="th_left">册号</th>';
							tmpHead += '<th width="7%" class="th_left">笔号</th>';
							tmpHead += '<th width="7%" class="th_left">币种</th>';
							tmpHead += '<th width="7%" class="th_left">钞汇鉴别</th>';
							tmpHead += '<th width="17%" class="th_right">交易流水号</th>';
							tmpHead += '</tr>';
						} else if('A02111050' == txCode.TxCode){
							tmpHead += '<tr>';
							tmpHead += '<h3 align="center" class="table_font" style="font-size: 22px;font-weight:bold;">恒丰银行股份有限公司贷款明细账</h3>';
							tmpHead += '</tr>';
							tmpHead += '<tr style="line-height: 21px;">';
							tmpHead += '<td width="25%" class="table_font">账号：' +  txCode.Cst_AccNo  + '</td>';
							tmpHead += '<td width="50%" class="table_font">账户名称：' + txCode.Acc_AccNm  + '</td>';
							tmpHead += '<td width="20%" class="table_font">日期：' + txCode.StDt + ' - ' + txCode.EdDt + '</td>';
							tmpHead += '<td width="5%" class="table_font">第' + pageNo + '页</td>';
							tmpHead += '</tr>';
							tmpHead += '</table>';
							tmpHead += '<table width="100%" border=1 cellpadding=0 cellspacing=0 >';
							tmpHead += '<tr style="line-height: 34px;">';
							tmpHead += '<th width="8%" class="th_left">日期</th>';
							tmpHead += '<th width="11%" class="th_left">交易代码</th>';
							tmpHead += '<th width="13%" class="th_left">本金/利息标志</th>';
							tmpHead += '<th width="17%" class="th_left">借方发生额</th>';
							tmpHead += '<th width="17%" class="th_left">贷方发生额</th>';
							tmpHead += '<th width="17%" class="th_left">贷款余额</th>';
							tmpHead += '<th width="17%" class="th_right">收息金额</th>';
							tmpHead += '</tr>';
						}else if('A05820113' == txCode.TxCode) {
							/*tmpHead += '.td_pzzl{white-space:nowrap;overflow-x:hidden;max-width:10px;}';//74px
							tmpHead += '.td_pzhm{white-space:nowrap;overflow-x:hidden;max-width:10px;}';//102px
							tmpHead += '.td_zy{white-space:nowrap;overflow-x:hidden;max-width:10px;}';//98px
							tmpHead += '.td_dfhm{white-space:nowrap;overflow-x:hidden;max-width:10px;}';//235px
							tmpHead += '.td_jf{white-space:nowrap;overflow-x:hidden;max-width:10px;}';//104px
							tmpHead += '.td_df{white-space:nowrap;overflow-x:hidden;max-width:10px;}';//104px
							tmpHead += '.td_ye{white-space:nowrap;overflow-x:hidden;max-width:10px;}';//116px
							tmpHead += '.td_lsh{white-space:nowrap;overflow-x:hidden;max-width:10px;}';//118px*/
							
							tmpHead += '<tr>';
							tmpHead += '<h3 align="center" class="table_font" style="font-size: 22px;font-weight:bold;">恒丰银行股份有限公司活期存款明细账</h3>';
							tmpHead += '</tr>';
							tmpHead += '<tr style="line-height: 21px;">';
							tmpHead += '<td width="15%" class="table_font">币别：' + txCode.CcyCd_DESC + '</td>';
							tmpHead += '<td width="20%" class="table_font">账号：' + txCode.Cst_AccNo + '</td>';
							tmpHead += '<td width="40%" class="table_font">账户名称：' + txCode.Acc_AccNm + '</td>';
							tmpHead += '<td width="20%" class="table_font">日期：' + txCode.StDt + ' - ' + txCode.EdDt + '</td>';
							tmpHead += '<td width="5%" class="table_font">第' + pageNo + '页</td>';
							tmpHead += '</tr>';
							tmpHead += '</table>';
							tmpHead += '<table width="99.5%" border=1 cellpadding=0 cellspacing=0 >';
							tmpHead += '<tr style="line-height: 17px;">';
							tmpHead += '<th width="5%" class="th_left" rowspan=2>日期</th>';
							tmpHead += '<th width="7%" class="th_left" rowspan=2>凭证种类</th>';
							tmpHead += '<th width="10%" class="th_left" rowspan=2>凭证号码</th>';
							tmpHead += '<th width="10%" class="th_left" rowspan=2>摘要</th>';
							tmpHead += '<th width="23%" class="th_left" rowspan=2>对方户名</th>';
							tmpHead += '<th width="10%" class="th_left" colspan=2>发生额</th>';
							tmpHead += '<th width="3%" class="th_left" rowspan=2>借贷</th>';
							tmpHead += '<th width="11%" class="th_left" rowspan=2>余额</th>';
							tmpHead += '<th width="11%" class="th_right" rowspan=2>交易流水号</th>';
							tmpHead += '</tr>';
							tmpHead += '<tr style="line-height: 17px;">';
							tmpHead += '<th width="10%" class="th_left">借方</th>';
							tmpHead += '<th width="10%" class="th_left">贷方</th>';
							tmpHead += '</tr>';
						}else if('A05820114' == txCode.TxCode) {
							/*tmpHead += '.td_pzzl{white-space:nowrap;overflow-x:hidden;max-width:10px;}';//74px
							tmpHead += '.td_pzhm{white-space:nowrap;overflow-x:hidden;max-width:10px;}';//102px
							tmpHead += '.td_zy{white-space:nowrap;overflow-x:hidden;max-width:10px;}';//98px
							tmpHead += '.td_dfhm{white-space:nowrap;overflow-x:hidden;max-width:10px;}';//235px
							tmpHead += '.td_jf{white-space:nowrap;overflow-x:hidden;max-width:10px;}';//104px
							tmpHead += '.td_df{white-space:nowrap;overflow-x:hidden;max-width:10px;}';//104px
							tmpHead += '.td_ye{white-space:nowrap;overflow-x:hidden;max-width:10px;}';//116px
							tmpHead += '.td_lsh{white-space:nowrap;overflow-x:hidden;max-width:10px;}';//118px*/
							
							tmpHead += '<tr>';
							tmpHead += '<h3 align="center" class="table_font" style="font-size: 22px;font-weight:bold;">恒丰银行股份有限公司活期存款明细账</h3>';
							tmpHead += '</tr>';
							tmpHead += '<tr style="line-height: 21px;">';
							tmpHead += '<td width="15%" class="table_font">币别：' + txCode.CcyCd_DESC + '</td>';
							tmpHead += '<td width="20%" class="table_font">账号：' + txCode.Cst_AccNo + '</td>';
							tmpHead += '<td width="40%" class="table_font">账户名称：' + txCode.Acc_AccNm + '</td>';
							tmpHead += '<td width="20%" class="table_font">日期：' + txCode.StDt + ' - ' + txCode.EdDt + '</td>';
							tmpHead += '<td width="5%" class="table_font">第' + pageNo + '页</td>';
							tmpHead += '</tr>';
							tmpHead += '</table>';
							tmpHead += '<table width="99.5%" border=1 cellpadding=0 cellspacing=0 >';
							tmpHead += '<tr style="line-height: 17px;">';
							tmpHead += '<th width="5%" class="th_left" rowspan=2>日期</th>';
							tmpHead += '<th width="7%" class="th_left" rowspan=2>凭证种类</th>';
							tmpHead += '<th width="10%" class="th_left" rowspan=2>凭证号码</th>';
							tmpHead += '<th width="10%" class="th_left" rowspan=2>摘要</th>';
							tmpHead += '<th width="23%" class="th_left" rowspan=2>对方户名</th>';
							tmpHead += '<th width="10%" class="th_left" colspan=2>发生额</th>';
							tmpHead += '<th width="3%" class="th_left" rowspan=2>借贷</th>';
							tmpHead += '<th width="11%" class="th_left" rowspan=2>余额</th>';
							tmpHead += '<th width="11%" class="th_right" rowspan=2>交易流水号</th>';
							tmpHead += '</tr>';
							tmpHead += '<tr style="line-height: 17px;">';
							tmpHead += '<th width="10%" class="th_left">借方</th>';
							tmpHead += '<th width="10%" class="th_left">贷方</th>';
							tmpHead += '</tr>';
						} else if('A0181S405' == txCode.TxCode && '4' == txCode.TpCd){
							tmpHead += '<h3 align="center" class="table_font" style="font-size: 22px;font-weight:bold;">集团流动性管理账户对账单</h3>';
							tmpHead += '</tr>';
							tmpHead += '<tr style="line-height: 21px;">';
							tmpHead += '<td width="10%" class="table_font">币别：' + txCode.CcyCd_DESC + '</td>';
							tmpHead += '<td width="20%" class="table_font">账号：' + txCode.Cst_AccNo + '</td>';
							tmpHead += '<td width="45%" class="table_font">账户名称：' + txCode.Acc_AccNm + '</td>';
							tmpHead += '<td width="20%" class="table_font">日期：' + txCode.StDt + ' - ' + txCode.EdDt + '</td>';
							tmpHead += '<td width="5%" class="table_font">第' + pageNo + '页</td>';
							tmpHead += '</tr>';
							tmpHead += '</table>';
							tmpHead += '<table width="100%" border=1 cellpadding=0 cellspacing=0 >';
							tmpHead += '<tr style="line-height: 34px;">';
							tmpHead += '<th width="5%" class="th_left">交易日期</th>';
							tmpHead += '<th width="12%" class="th_left">交易流水号</th>';
							tmpHead += '<th width="7%" class="th_left">凭证种类</th>';
							tmpHead += '<th width="10%" class="th_left">凭证号码</th>';
							tmpHead += '<th width="16%" class="th_left">摘要</th>';
							tmpHead += '<th width="11%" class="th_left">借方发生额</th>';
							tmpHead += '<th width="11%" class="th_left">贷方发生额</th>';
							tmpHead += '<th width="11%" class="th_left">余额</th>';
							tmpHead += '<th width="12%" class="th_left">积数</th>';
							tmpHead += '<th width="5%" class="th_right">起息日期</th>';
							tmpHead += '</tr>';
						}
						
						return tmpHead;
					};
					
					//表尾
					tmpFoot += '</table>';
					tmpFoot += '<table width="100%">';
					tmpFoot += '<tr style="line-height: 17px;">';
					tmpFoot += '<td width="25%" class="table_font">打印时间：' + PJF.communication.getServerTime() + '</td>';
					tmpFoot += '<td width="35%" class="table_font">打印机构：恒丰银行</td>';
					tmpFoot += '<td width="20%" class="table_font">打印柜员：' + PJF.otherInfo.devId + '</td>';
					//tmpFoot += '<td width="20%" class="table_font">打印卡号：' + STM.corporateBill.Txn_CardNo + '</td>';
					
					if(STM.corporateBill.Txn_CardNo && STM.corporateBill.Txn_CardNo.length){
						tmpFoot += '<td width="20%" class="table_font">打印卡号：' + STM.corporateBill.Txn_CardNo + '</td>';
					}else{
						tmpFoot += '<td width="20%" class="table_font">&nbsp;</td>';
					}
					
					tmpFoot += '</tr>';
					tmpFoot += '</table>';
					
					//tmpFoot += STM.corporateBill.addClientNoticeNew();
					//tmpFoot += STM.corporateBill.addClientNoticeEmpty();
					
					tmpFoot += '</div>';
					//tmpFoot += '</div>';
					
					//表内容
					time = 0;
					for(var i=0;i<xmlPathDataRows.length;i++){
						var allRowsData = xmlPathDataRows;
					//xmlPath.allRows.each(function(){
						tmpContent += '<tr style="line-height: 17px;">';
						
						tmp = $(this).text();
						array = tmp.split(' ■ ');
						
						if('A0181S405' == txCode.TxCode && '1' == txCode.TpCd) {
							
							if(!('' == allRowsData[i].Txn_Rmrk.trim() && '0100' != allRowsData[i].Smy_Cd)){
								allRowsData[i].Smy_Cd_DESC = allRowsData[i].Txn_Rmrk;
							}
							function trim(str){
								return str?str.replace(/^\s*|\s*$/g,''):'';
							}
							function getBill_CtCd_DESC(Bill_CtCd){
								switch(trim(Bill_CtCd)){
								case '0301':
									return '业务处理手续费';
								case '0405':
									return '扫描业务汇划费';
								default:
									return '';
								}
							}
						    var type = STM.corporateBill.comareBigger(trim(allRowsData[i].Dep_DHAmt), trim(allRowsData[i].Dep_Cr_HpnAm))?'借' : '贷';
							tmpContent += '<td class="td_left text_left">' + trim(allRowsData[i].Txn_Dt) + '</td>';
							tmpContent += '<td class="td_left text_left td_jq">' + getBill_CtCd_DESC(allRowsData[i].Bill_CtCd) + '</td>';
							tmpContent += '<td class="td_left text_left td_jq">' + trim(allRowsData[i].Bill_No)+ '</td>';
							tmpContent += '<td class="td_left text_left td_jq" style="font-size:10px;">' + trim(allRowsData[i].Smy_Cd_DESC) + '</td>';
							tmpContent += '<td class="td_left text_left td_jq">' +trim(allRowsData[i].Cntrprt_Txn_AccNo_Nm) + '</td>';
							tmpContent += '<td class="td_left text_right td_jq">' + STM.corporateBill.getJE(trim(allRowsData[i].Dep_DHAmt)) + '</td>';
							tmpContent += '<td class="td_left text_right td_jq">' + STM.corporateBill.getJE(trim(allRowsData[i].Dep_Cr_HpnAm)) + '</td>';
							tmpContent += '<td class="td_left" align="center">' + type  + '</td>';
							tmpContent += '<td class="td_left text_right td_jq">' + STM.corporateBill.getJE(trim(allRowsData[i].Dep_AcBa)) + '</td>';
							tmpContent += '<td class="td_right text_left td_jq">' + trim(allRowsData[i].Ovrlsttn_EV_Trck_No) + '</td>';
						}else if('A05820113' == txCode.TxCode) {
							if(!('' == allRowsData[i].Txn_Rmrk.trim() && '0100' != allRowsData[i].Smy_Cd)){
								allRowsData[i].Smy_Cd_DESC = allRowsData[i].Txn_Rmrk;
							}
                            var type = STM.corporateBill.comareBigger(allRowsData[i].Dbt_Txn_HpnAm.trim(), allRowsData[i].Cr_Txn_HpnAm.trim())?'借' : '贷';
							tmpContent += '<td class="td_left text_left">' + allRowsData[i].Txn_Dt.trim() + '</td>';
							tmpContent += '<td class="td_left text_left td_jq">' + allRowsData[i].Bill_CtCd_DESC.trim() + '</td>';
							tmpContent += '<td class="td_left text_left td_jq">' + allRowsData[i].Bill_No.trim() + '</td>';
							tmpContent += '<td class="td_left text_left td_jq" style="font-size:10px;">' + allRowsData[i].Smy_Cd_DESC.trim() + '</td>';
							tmpContent += '<td class="td_left text_left td_jq">' + allRowsData[i].Cntrprt_Txn_AccNo_Nm.trim() + '</td>';
							tmpContent += '<td class="td_left text_right td_jq">' + STM.corporateBill.getJE(allRowsData[i].Dbt_Txn_HpnAm.trim()) + '</td>';
							tmpContent += '<td class="td_left text_right td_jq">' + STM.corporateBill.getJE(allRowsData[i].Cr_Txn_HpnAm.trim()) + '</td>';
							tmpContent += '<td class="td_left" align="center">' + type + '</td>';
							tmpContent += '<td class="td_left text_right td_jq">' + STM.corporateBill.getJE(allRowsData[i].Dep_AcBa.trim()) + '</td>';
							tmpContent += '<td class="td_right text_left td_jq">' + allRowsData[i].Cmpt_TrcNo.trim() + '</td>';
						}else if('A05820114' == txCode.TxCode) {
							if(!('' == allRowsData[i].Txn_Rmrk.trim() && '0100' != allRowsData[i].Smy_Cd)){
								allRowsData[i].Smy_Cd_DESC = allRowsData[i].Txn_Rmrk;
							}
                            var type = STM.corporateBill.comareBigger(allRowsData[i].Dbt_Txn_HpnAm.trim(), allRowsData[i].Cr_Txn_HpnAm.trim())?'借' : '贷';
							tmpContent += '<td class="td_left text_left">' + allRowsData[i].Txn_Dt.trim() + '</td>';
							tmpContent += '<td class="td_left text_left td_jq">' + allRowsData[i].Bill_CtCd_DESC.trim() + '</td>';
							tmpContent += '<td class="td_left text_left td_jq">' + allRowsData[i].Bill_No.trim() + '</td>';
							tmpContent += '<td class="td_left text_left td_jq" style="font-size:10px;">' + allRowsData[i].Smy_Cd_DESC.trim() + '</td>';
							tmpContent += '<td class="td_left text_left td_jq">' + allRowsData[i].Cntrprt_Txn_AccNo_Nm.trim() + '</td>';
							tmpContent += '<td class="td_left text_right td_jq">' + STM.corporateBill.getJE(allRowsData[i].Dbt_Txn_HpnAm.trim()) + '</td>';
							tmpContent += '<td class="td_left text_right td_jq">' + STM.corporateBill.getJE(allRowsData[i].Cr_Txn_HpnAm.trim()) + '</td>';
							tmpContent += '<td class="td_left" align="center">' + type + '</td>';
							tmpContent += '<td class="td_left text_right td_jq">' + STM.corporateBill.getJE(allRowsData[i].Dep_AcBa.trim()) + '</td>';
							tmpContent += '<td class="td_right text_left td_jq">' + allRowsData[i].Cmpt_TrcNo.trim() + '</td>';
						} else if('A0181T703' == txCode.TxCode){
							if(!('' == allRowsData[i].Txn_Rmrk.trim() && '0100' != allRowsData[i].Smy_Cd)){
								allRowsData[i].Smy_Cd_DESC = allRowsData[i].Txn_Rmrk;
							}
							var type = allRowsData[i].DbtCrDrcCd.trim() == '1'?'借' : (allRowsData[i].DbtCrDrcCd.trim() == '2' ? '贷' : '');
							tmpContent += '<td class="td_left text_left">' + allRowsData[i].Txn_Dt.trim() + '</td>';
							tmpContent += '<td class="td_left text_right td_jq">' + STM.corporateBill.getJE(allRowsData[i].Dep_TxnAmt.trim()) + '</td>';
							tmpContent += '<td class="td_left" align="center">' + txCode.A0181T703_printDta.Dep_Trm_Cd_DESC.trim() + '</td>';
							tmpContent += '<td class="td_left" align="center">' + type + '</td>';
							tmpContent += '<td class="td_left text_left td_jq" style="font-size:10px;">' + allRowsData[i].Smy_Cd_DESC.trim() + '</td>';
							tmpContent += '<td class="td_left" align="center">' + txCode.A0181T703_printDta.Trm_DepSeqNo.trim() + '</td>';
							tmpContent += '<td class="td_left" align="center">' + txCode.A0181T703_printDta.Trm_DepSeqNo.trim() + '</td>';
							tmpContent += '<td class="td_left" align="center">' + txCode.A0181T703_printDta.CcyCd_DESC.trim() + '</td>';
							tmpContent += '<td class="td_left" align="center">' + txCode.A0181T703_printDta.CshEx_Cd_DESC.trim() + '</td>';
							tmpContent += '<td class="td_right text_left td_jq">' + allRowsData[i].Cmpt_TrcNo.trim() + '</td>';
						} else if('A02111050' == txCode.TxCode){
							var type = (allRowsData[i].Ln_TxnAmt_Sbdvsn_TpCd.trim()) == '006'?'本金':'利息';
							tmpContent += '<td class="td_left text_left">' + allRowsData[i].Txn_Dt.trim() + '</td>';
							tmpContent += '<td class="td_left text_left td_jq">' + allRowsData[i].Loan_Txn_CgyCd_DESC.trim() + '</td>';
							tmpContent += '<td class="td_left text_left td_jq">' + type + '</td>';
							tmpContent += '<td class="td_left text_right td_jq">' + STM.corporateBill.getJE(allRowsData[i].Mdf_Amt.trim()) + '</td>';
							tmpContent += '<td class="td_left text_right td_jq">' + STM.corporateBill.getJE(allRowsData[i].Mdf_Amt.trim()) + '</td>';
							tmpContent += '<td class="td_left text_right td_jq">' + STM.corporateBill.getJE(allRowsData[i].AfMd_Pnp_Bal.trim()) + '</td>';
							tmpContent += '<td class="td_right text_right td_jq">' + STM.corporateBill.getJE(allRowsData[i].AfMd_Coll_Int_Bal.trim()) + '</td>';
						} else if('A0181S405' == txCode.TxCode && '4' == txCode.TpCd){
							if(!('' == allRowsData[i].Txn_Rmrk.trim() && '0100' != allRowsData[i].Smy_Cd)){
								allRowsData[i].Smy_Cd_DESC = allRowsData[i].Txn_Rmrk;
							}
							tmpContent += '<td class="td_left text_left">' + allRowsData[i].Txn_Dt.trim() + '</td>';
							tmpContent += '<td class="td_left text_left td_jq">' + allRowsData[i].Cmpt_TrcNo.trim() + '</td>';
							tmpContent += '<td class="td_left text_left td_jq">' + allRowsData[i].Bill_CtCd_DESC.trim() + '</td>';
							tmpContent += '<td class="td_left text_left td_jq">' + allRowsData[i].Bill_No.trim() + '</td>';
							tmpContent += '<td class="td_left text_left td_jq" style="font-size:10px;">' + allRowsData[i].Smy_Cd_DESC.trim() + '</td>';
							tmpContent += '<td class="td_left text_right td_jq">' + STM.corporateBill.getJE(allRowsData[i].Dep_DHAmt.trim()) + '</td>';
							tmpContent += '<td class="td_left text_right td_jq">' + STM.corporateBill.getJE(allRowsData[i].Dep_Cr_HpnAm.trim()) + '</td>';
							tmpContent += '<td class="td_left text_right td_jq">' + STM.corporateBill.getJE(allRowsData[i].Dep_AcBa.trim()) + '</td>';
							tmpContent += '<td class="td_left text_right td_jq">' + STM.corporateBill.getJE(allRowsData[i].Dep_Acm.trim()) + '</td>';
							tmpContent += '<td class="td_right text_left td_jq">' + allRowsData[i].ValDt.trim() + '</td>';
						}
						
						tmpContent += '</tr>';
						time ++;
						
						//if(34 == time){
						if(0 == time%34){
							var imgStr = ifUseChapter?'<img id="elecImg" src="'+imgSrc+'" style="width: 152px;height: 152px;position: absolute;bottom: 9%;right: 12%;">':'';
							
							if(pages > 0){
								PJF.html.append('printCBHtml', page_div1 + getTmpHead(pageInfo, pages + 1, txCode) + tmpContent + tmpFoot + imgStr + '</div>');
							} else {
								PJF.html.append('printCBHtml', page_div0 + getTmpHead(pageInfo, pages + 1, txCode) + tmpContent + tmpFoot + imgStr + '</div>');
							}
							
							/*
							if(ifUseChapter){
								//电子印章
								PJF.html.append('printCBHtml', '<img id="elecImg" src="'+imgSrc+'" style="width: 152px;height: 152px;margin-top: 48%;margin-left: 77%;">');
							}*/
							//htmlPaths[pages] = PJF.util.saveHtml("cbHtml_1");
							pages ++;
							
							time = 0;
							tmpContent = '';
							//先清空隐藏内容
							//PJF.html.empty('printCBHtml');
						}
					};
					
					//不足33行需补空行
					if(time > 0 && time < 34){
						for(var j=0; j<(34 - time); j++){
							if('A0181S405' == txCode.TxCode && '1' == txCode.TpCd) {
								tmpContent += '<tr style="line-height: 17px;">';
								tmpContent += '<td class="td_left">&nbsp;</td>';
								tmpContent += '<td class="td_left">&nbsp;</td>';
								tmpContent += '<td class="td_left">&nbsp;</td>';
								tmpContent += '<td class="td_left">&nbsp;</td>';
								tmpContent += '<td class="td_left">&nbsp;</td>';
								tmpContent += '<td class="td_left">&nbsp;</td>';
								tmpContent += '<td class="td_left">&nbsp;</td>';
								tmpContent += '<td class="td_left">&nbsp;</td>';
								tmpContent += '<td class="td_left">&nbsp;</td>';
								tmpContent += '<td class="td_right">&nbsp;</td>';
							}else if('A05820113' == txCode.TxCode) {
								tmpContent += '<tr style="line-height: 17px;">';
								tmpContent += '<td class="td_left">&nbsp;</td>';
								tmpContent += '<td class="td_left">&nbsp;</td>';
								tmpContent += '<td class="td_left">&nbsp;</td>';
								tmpContent += '<td class="td_left">&nbsp;</td>';
								tmpContent += '<td class="td_left">&nbsp;</td>';
								tmpContent += '<td class="td_left">&nbsp;</td>';
								tmpContent += '<td class="td_left">&nbsp;</td>';
								tmpContent += '<td class="td_left">&nbsp;</td>';
								tmpContent += '<td class="td_left">&nbsp;</td>';
								tmpContent += '<td class="td_right">&nbsp;</td>';
							}else if('A05820114' == txCode.TxCode) {
								tmpContent += '<tr style="line-height: 17px;">';
								tmpContent += '<td class="td_left">&nbsp;</td>';
								tmpContent += '<td class="td_left">&nbsp;</td>';
								tmpContent += '<td class="td_left">&nbsp;</td>';
								tmpContent += '<td class="td_left">&nbsp;</td>';
								tmpContent += '<td class="td_left">&nbsp;</td>';
								tmpContent += '<td class="td_left">&nbsp;</td>';
								tmpContent += '<td class="td_left">&nbsp;</td>';
								tmpContent += '<td class="td_left">&nbsp;</td>';
								tmpContent += '<td class="td_left">&nbsp;</td>';
								tmpContent += '<td class="td_right">&nbsp;</td>';
							} else if('A0181T703' == txCode.TxCode){
								tmpContent += '<tr style="line-height: 17px;">';
								tmpContent += '<td class="td_left">&nbsp;</td>';
								tmpContent += '<td class="td_left">&nbsp;</td>';
								tmpContent += '<td class="td_left">&nbsp;</td>';
								tmpContent += '<td class="td_left">&nbsp;</td>';
								tmpContent += '<td class="td_left">&nbsp;</td>';
								tmpContent += '<td class="td_left">&nbsp;</td>';
								tmpContent += '<td class="td_left">&nbsp;</td>';
								tmpContent += '<td class="td_left">&nbsp;</td>';
								tmpContent += '<td class="td_left">&nbsp;</td>';
								tmpContent += '<td class="td_right">&nbsp;</td>';
							} else if('A02111050' == txCode.TxCode){
								tmpContent += '<tr style="line-height: 17px;">';
								tmpContent += '<td class="td_left">&nbsp;</td>';
								tmpContent += '<td class="td_left">&nbsp;</td>';
								tmpContent += '<td class="td_left">&nbsp;</td>';
								tmpContent += '<td class="td_left">&nbsp;</td>';
								tmpContent += '<td class="td_left">&nbsp;</td>';
								tmpContent += '<td class="td_left">&nbsp;</td>';
								tmpContent += '<td class="td_right">&nbsp;</td>';
							} else if('A0181S405' == txCode.TxCode && '4' == txCode.TpCd){
								tmpContent += '<tr style="line-height: 17px;">';
								tmpContent += '<td class="td_left">&nbsp;</td>';
								tmpContent += '<td class="td_left">&nbsp;</td>';
								tmpContent += '<td class="td_left">&nbsp;</td>';
								tmpContent += '<td class="td_left">&nbsp;</td>';
								tmpContent += '<td class="td_left">&nbsp;</td>';
								tmpContent += '<td class="td_left">&nbsp;</td>';
								tmpContent += '<td class="td_left">&nbsp;</td>';
								tmpContent += '<td class="td_left">&nbsp;</td>';
								tmpContent += '<td class="td_left">&nbsp;</td>';
								tmpContent += '<td class="td_right">&nbsp;</td>';
							}
							tmpContent += '</tr>';
						}
						
						var imgStr = ifUseChapter?'<img id="elecImg" src="'+imgSrc+'" style="width: 152px;height: 152px;position: absolute;bottom: 9%;right: 12%;">':'';
						
						if(pages > 0){
							PJF.html.append('printCBHtml', page_div1 + getTmpHead(pageInfo, pages + 1, txCode) + tmpContent + tmpFoot + imgStr + '</div>');
						} else {
							PJF.html.append('printCBHtml', page_div0 + getTmpHead(pageInfo, pages + 1, txCode) + tmpContent + tmpFoot + imgStr + '</div>');
						}
						/*if(ifUseChapter){
							//电子印章
							PJF.html.append('printCBHtml', '<img id="elecImg" src="'+imgSrc+'" style="width: 152px;height: 152px;margin-top: 48%;margin-left: 77%;">');
						}	*/			
						pages ++;
						
						//htmlPaths[pages] = PJF.util.saveHtml("cbHtml_1");
					}
					console.log('>>>>>>pages>>>>>>' + pages);
					console.log('>>>>>>src>>>>>>' + imgSrc);
					htmlPaths[0] = PJF.util.saveHtml("printCBHtml");
					//清空隐藏内容
					//PJF.html.empty('printCBHtml');
				console.log('>>>>>>明细下载文件路径>>>>>>' + PJF.util.json2str(htmlPaths));
				
        		if(window.logoutFlag){
        			$('div[id=billNavbtn]').remove();
        			$('.template_navbtn').show();
        			clearTimeout(window.logoutFlag);
        		}
				PJF.stm.HDP.preparePrinter({}, function(prepareRes){
					if('1' == prepareRes.status){
						STM.corporateBill.doPrintCBHtml_MXCX(htmlPaths, 0, pages, ifUseChapter);
					} else {
						STM.corporateBill.showPrintErrorMsg(prepareRes.errorMsg, prepareRes.errorCode);
					}
				});
			}
			
		},
    /**
     * 查询交易所有数据,暂只支持p6,仅支持300页数据
     * jsonData传入对象reqConfig
     * reqConfig有以下属性：
     * rowsPath：rows对应返回报文的路径，默认"rows"，eg："TXN" ,"rows"
     * vrcPath：Vld_Rcrd_Cnt对应返回报文的路径，默认"Vld_Rcrd_Cnt"，eg："Vld_Rcrd_Cnt","TXN.Vld_Rcrd_Cnt"
     * isCCBS：是否走CCBS分页。默认true.
     * 注：通常情况下只需要传入rowsPath。 eg：jsonData.reqConfig = {rowsPath:"RLTV_ACC_LIST"};
     * sucFunc返回的数据：Vld_Rcrd_Cnt返回总条数，rows列表返回整合查询出的所有数据
     */
    cpsJsonReqP6AllData:function(printPages, printPageVals, serviceID, jsonData, sucFunc, failFun, asyncFlag) {
    	console.log('打印总页数++++++++++++++++++++++++++++++++++++' + printPages);
        var szData = [];
        var num = 0;
        var reqConfig = (jsonData.reqConfig == undefined||null) ? {} : jsonData.reqConfig;
        var Vld_Rcrd_Cnt = (reqConfig.vrcPath == undefined||null) ? "Vld_Rcrd_Cnt" : reqConfig.vrcPath;
        var rowsPath = (reqConfig.rowsPath == undefined||null) ? "rows" : reqConfig.rowsPath;
        var isCCBS = (reqConfig.isCCBS == undefined||null) ? true : reqConfig.isCCBS;
        //递归查询
        //REC_IN_PAGE：每页条数；PAGE_JUMP：跳转页码
        //CCBS_Info:翻页信息{CCBS_Info:{"PAGE_UP_DOWN":"1","PAGE_STA_KEY:"???","PAGE_END_KEY":"???"}}
        function queryReq(REC_IN_PAGE,PAGE_JUMP,CCBS_Info){
            num ++;
            console.log('请求页数++++++++++++++++++++++++++++++++++++' + num);
            if(isCCBS){
                jsonData.CCBS_Info = CCBS_Info;
            }else{
                var _pagination = {};
                _pagination.REC_IN_PAGE = REC_IN_PAGE;//页面查询条数
                _pagination.PAGE_JUMP = PAGE_JUMP;//跳转页码，从1开始
                jsonData._pagination = _pagination;
            }

            STM.corporate.cpsJsonReq(jsonData, serviceID, function(responseData){
                console.log('每页返回++++++++++++++++++++++++++++++++++++' + PJF.util.json2str(responseData));
                if(num > printPages){
                    if ((typeof failFun) == "function") {
                        failFun(responseData, serviceID);
                    }else{
                        new PJF.ui.messageBox({
                            content: "查询结果超过" + printPageVals + "条，将为您打印前" + printPageVals + "条。剩余打印条数请重新查询打印。请确认是否打印？",
                            buttonConfs: [
                                {
                                    style: 'main',
                                    name: '确认',
                                    onClick: function () {
                                        responseData['allRows'] = szData;
                                        responseData[Vld_Rcrd_Cnt] = szData.length;
                                        sucFunc(responseData);
                                    }
                                },{
                                        style: 'main',
                                        name: '取消',
                                        onClick: function () {
                                        return;
                                    }
                                }
                            ]
                        });

                    }
                    return;
                }
                var Vld_Rcrd_Cnt_Value = responseData[Vld_Rcrd_Cnt];
                var rows = responseData[rowsPath];
                console.log('Vld_Rcrd_Cnt_Value++++++++++++++++++++++++++++++++++++' + Vld_Rcrd_Cnt_Value);
                console.log('rows++++++++++++++++++++++++++++++++++++' + rows.length);
                if((isCCBS && (responseData._COMMON.COMA.CONV_NO_DATA == "Y"
                    || responseData._COMMON.COMA.PAGE_STA_KEY == ""
                    || responseData._COMMON.COMA.PAGE_END_KEY == ""))
                    || (!isCCBS && Vld_Rcrd_Cnt_Value < REC_IN_PAGE)){
                    for (var i=0;i<Vld_Rcrd_Cnt_Value; i++){
                        szData.push(rows[i]);
                    }
                    responseData['allRows'] = szData;
                    responseData[Vld_Rcrd_Cnt] = szData.length;
                    sucFunc(responseData);
                }else{
                    for (var i=0;i<Vld_Rcrd_Cnt_Value;i++){
                        szData.push(rows[i]);

                    }
                    CCBS_Info.PAGE_UP_DOWN = 2;
                    CCBS_Info.PAGE_STA_KEY = responseData._COMMON.COMA.PAGE_STA_KEY;
                    CCBS_Info.PAGE_END_KEY = responseData._COMMON.COMA.PAGE_END_KEY;
                    CCBS_Info.FLOW_STATUS = responseData._COMMON.COMA.FLOW_STATUS;
                    CCBS_Info.FLOW_ITI_ID = responseData._COMMON.COMA.FLOW_ITI_ID;
                    queryReq(REC_IN_PAGE,PAGE_JUMP+1,CCBS_Info);
                }
            },failFun, asyncFlag);
        }
        var CCBS_Info = {};
        CCBS_Info = {
            "PAGE_UP_DOWN":"",
            "PAGE_STA_KEY":"",
            "PAGE_END_KEY":"",
            "FLOW_STATUS":"00000000",
            "FLOW_ITI_ID":""
        };
        queryReq(10,1,CCBS_Info);
    },
    /**
     * 比较数字型字符串的大小
     */
    comareBigger:function(num1, num2){
        var numA = num1;
        var numB = num2;
        if(numA > numB){
            return true;
        }else{
            return false
        }
    },
		/*
		 * 将金额转换为每三位以，相隔
		 * str 金额字符串
		 */
	/**
	 * @function getJE
	 * @param str 金额字符串
	 * @returns {String}格式化后的金额
	 * 将金额转换为每三位以，相隔
	 */
		getJE : function (str){
			var km = str;
		    if(typeof str == 'string' && !isNaN(parseFloat(str)) && str.indexOf(',') < 0){ 
		    	str  = parseFloat(str) + "";
				var s = str.match(/^\d+/) != null ? str.match(/^\d+/)[0] : str;
				var neg = s.match(/^\-\d+/) != null ? s.match(/^\-\d+/)[0] : null;
				if(neg){
					s = neg.split('\-')[1];
				}
				var ns1 = "";
				var ns2 = "";
				var ns3 = km.match(/\.\d+/) != null ? km.match(/\.\d+/)[0] : ".00";
				var index = 0;
				for(var i = s.length; i > 0; i--){
				   index++;
				   if(index%3 == 0){
					  ns2 = s[i-1] +  s[i] + s[i+1] + (ns2 == "" ? "" : ",") + ns2;
				   }   
				}
				if(ns2 != ''){
					var len = index%3;
					index = 0;
					while((len--) > 0){
					   ns1 = ns1 + s[index++];
					   if(len == 0){
						  ns1 += ",";
					   }
					}
					return neg ? ('-' + ns1 + ns2 + ns3) : (ns1 + ns2 + ns3);
				}else {
					return neg ? ('-' + s + ns3) : (s + ns3);
				}
		    }
		    return str;
		},
		/**
		 * 对账清单打印（心跳）
		 * jsonCMST00013 交易参数
		 * times 查询次数
		 * cbSum 总条数
		 */
	//20200717 不用代码 涉及到PJF.communication.ajax 注释
	/**
	 * @function queryAndPrintAllBillListData2
	 * @param {Object}jsonCMST00013 交易参数
	 * @param {String}times 查询次数
	 * @param {String}cbSum 总条数
	 * 对账清单打印（心跳）
	 */
		queryAndPrintAllBillListData2 : function(jsonCMST00013, times, cbSum){
			var countAct = 0;// 执行交易个数
			var queryData = {};// 所有查询数据
			var errorData = '';//错误返回
			for(var i = 0; i < times; i++){
				+function() {
					jsonCMST00013._pagination = {};
					jsonCMST00013._pagination.PAGE_JUMP = i + 1;

					var tmpKey = 'querykey_' + i;//queryData的key值
					
					PJF.communication.cpsJsonReq({
						fwServiceId : "simpleTransaction",
						fwTranId : "CMST00013-stm",
						jsonData : PJF.util.json2str(jsonCMST00013),
						success : function(responseData) {
							var vchIDs = '';//queryData的value值
							if(responseData.Qry_GRP){
								if(responseData.Qry_GRP.length){
									for(var t=0;t<responseData.Qry_GRP.length;t++){
										if(responseData.Qry_GRP[t].VchID){
											vchIDs += responseData.Qry_GRP[t].VchID + ',';
										}
									}
								} else {
									if(responseData.Qry_GRP.VchID){
										vchIDs += responseData.Qry_GRP.VchID + ',';
									}
								}
							}
							
							if(vchIDs){
								vchIDs = vchIDs.substring(0,vchIDs.length - 1);
								queryData[tmpKey] = vchIDs;
							}
						},
						failure : function(responseData) {
							/*STM.corporateBill.showErrorMsg(responseData, '打印出错！');
							STM.corporateBill.loading.destroy();
							return;*/
							console.log('CMST00013-stm交易失败。<br>全局跟踪号:'+responseData._COMMON.SYS_EVT_TRACE_ID
                            		+'，错误码:'+responseData.BK_CODE+'，错误描述:'+responseData.BK_DESC);
							errorData = responseData;
						},
                		complete: function() {
                			countAct++;
                        }
					});
				}();
			}
			//心跳
			var n = 0;
        	var pig = setInterval(function() {
        		n++;
        		if(n > 30){
        			clearInterval(pig);
        			STM.corporateBill.showAlertMsg('交易超时了，请稍后再试！');
					STM.corporateBill.loading.destroy()
 	        		return;
        		}else{
        			if(errorData){
        				clearInterval(pig);
        				STM.corporateBill.showErrorMsg(errorData, '打印出错！');
						STM.corporateBill.loading.destroy();
						return;
        			}
        			
        			if (countAct == times) {
                        clearInterval(pig);
                        console.log("CMST00013对账清单查询接口集：" + PJF.util.json2str(queryData));
                        //执行下一步，下载文件
                        STM.corporateBill.downLoadBillListFile(queryData, times, cbSum);
                    }
        		}
        	},1000);
        	//心跳 end
		},
		/**
		 * 下载所有对账清单文件
		 * queryData 所有对账清单数据
		 * times 查询次数
		 * cbSum 总条数
		 */
	//20200717 不用代码 涉及到PJF.communication.ajax 注释
	/**
	 * @function downLoadBillListFile
	 * @param {Object}queryData 所有对账清单数据
	 * @param {String}times 查询次数
	 * @param {String}cbSum  总条数
	 * 下载所有对账清单文件
	 */
		downLoadBillListFile : function(queryData, times, cbSum){
			STM.corporateBill.ValArray = new Array();
			var countAct = 0;// 执行交易个数
			var downData = {};// 所有查询数据
			var flag = true;//判断文件是否存在
			var errorData = '';//错误返回
			var money = 0.00;//打印金额
			var list_val = '';
			for(var i = 0; i < times; i++){
				+function() {
					var tmpKey = 'downkey_' + i;//downData的key值
					
					list_val = queryData['querykey_' + i];
					STM.corporateBill.jsonCMST00014.List_Val = list_val;
					STM.corporateBill.ValArray = STM.corporateBill.ValArray.concat(list_val.split(','));
					STM.corporateBill.jsonCMST00014.OPR_NO = PJF.otherInfo.devId;
					PJF.communication.cpsJsonReq({
						fwServiceId : "simpleTransaction",
						fwTranId : "CMST00014-stm",
						jsonData : PJF.util.json2str(STM.corporateBill.jsonCMST00014),
						success : function(responseData) {
							money += parseFloat(responseData.Ths_FeeAmt);
							
							//判读下载文件是否存在
							var existFlag = false;
							var fileName = STM.corporateBill.cutOutFilePath(responseData.File_Rte_FullNm);
							var fileExistUrl = STM.corporateBill.existUrl + fileName;
							flag = STM.corporateBill.isFileExist(fileExistUrl);
							downData[tmpKey] = fileName;
						},
						failure : function(responseData) {
							/*STM.corporateBill.showErrorMsg(responseData, '下载对账清单文件到P2出错');
							STM.corporateBill.loading.destroy();
							return;*/
							console.log('CMST00014-stm交易失败。<br>全局跟踪号:'+responseData._COMMON.SYS_EVT_TRACE_ID
                            		+'，错误码:'+responseData.BK_CODE+'，错误描述:'+responseData.BK_DESC);
							errorData = responseData;
							
						},
                		complete: function() {
                			countAct++;
                        }
					});
				}();
			}
			//心跳
			var n = 0;
        	var pig = setInterval(function() {
        		n++;
        		if(n > 30){
        			clearInterval(pig);
        			STM.corporateBill.showAlertMsg('交易超时了，请稍后再试！');
					STM.corporateBill.loading.destroy()
 	        		return;
        		}else{
        			if(errorData){
        				clearInterval(pig);
        				STM.corporateBill.showErrorMsg(errorData, '下载对账清单文件到P2出错！');
						STM.corporateBill.loading.destroy();
						return;
        			}
        			
        			if(!flag){
        				clearInterval(pig);
        				STM.corporateBill.showAlertMsg('对账清单数据文件不存在，下载失败！');
						STM.corporateBill.loading.destroy();
						return;
        			}
        			
        			if (countAct == times) {
                        clearInterval(pig);
                        console.log("CMST00014对账清单下载接口集：" + PJF.util.json2str(downData));
                        //执行下一步，下载文件
                        STM.corporateBill.analysisBillListFile(downData, times, cbSum, money);
                    }
        		}
        	},1000);
        	//心跳 end
		},
		/**
		 * 解析所有对账清单文件
		 * downData 所有对账清单数据
		 * times 查询次数
		 * cbSum 总条数
		 * money 打印确认金额
		 */
	//20200717 不用代码 涉及到PJF.communication.ajax 注释
	/**
	 * @function analysisBillListFile
	 * @param {Object}downData 所有对账清单数据
	 * @param {String}times 查询次数
	 * @param {Stirng}cbSum 总条数
	 * @param {String}money 打印确认金额
	 * 解析所有对账清单文件
	 */
		analysisBillListFile : function(downData, times, cbSum, money){
			var countAct = 0;// 执行交易个数
			var printData = {};// 所有查询数据
			var flag = false;
			
			var xmlData;
			for(var i = 0; i < times; i++){
				xmlData = STM.corporateBill.getXmlData(downData['downkey_' + i]);
				var j=0;
				$(xmlData).find('page').each(function(){
					+function() {
						var tmp = this;
						var content = 'branch-czdzqd-' + $(this).find('head').attr('id') + '-' + (parseInt($(this).find('head').attr('print_cnts')) + 1)
							+ '-' + PJF.util.formatDate(new Date(),"yyyy") + '-' + $(this).find('head').attr('qr_str');
						
						var tmpKey = 'printkey_' + (i * 10 + j);//printData的key值
						var param = {
			    			_fw_service_id : "createQRCode",
			    			content : content,
			    			width : 300,
			    			height : 300,
			    			type : "png"
			    		};
			    		PJF.communication.ajax({
			    			url : "ecpJson.action",
			    			data : param,
			    			//async : false,// 同步
							safe:true,
			    			success : function(data){
			    				var imgPrefix = "data:image/png;base64,";
			    				imgSrc = imgPrefix + data;
			    				
			    				var tmpVal = STM.corporateBill.createCMST00014Html2(tmp, imgSrc);//printData的value值
			    				printData[tmpKey] = tmpVal;
			    				
			    				countAct ++;
			    			},
			    			failure : function(response){
			    				console.log('创建二维码图片数据失败');
			    				flag = true;
			    				countAct ++;
			    			}
			    		});
						
						j ++;
					}();
				});
			}
			//心跳
			var n = 0;
        	var pig = setInterval(function() {
        		n++;
        		if(n > 30){
        			clearInterval(pig);
        			STM.corporateBill.showAlertMsg('交易超时了，请稍后再试！');
					STM.corporateBill.loading.destroy()
 	        		return;
        		}else{
        			if(flag){
        				clearInterval(pig);
        				STM.corporateBill.showAlertMsg('创建二维码图片数据失败');
						STM.corporateBill.loading.destroy();
						return;
        			}
        			
        			if (countAct == cbSum) {
                        clearInterval(pig);
                        //console.log("CMST00013对账清单查询接口集：" + PJF.util.json2str(queryData));
                        //执行下一步，打印文件
                        var tmpHtml;
                        for(var t = 0; t < cbSum; t++){
                        	tmpHtml = printData['printkey_' + t];
                        	if(t > 0){
                        		PJF.html.append('printCBHtml', '<div style="page-break-after:always;padding-top:1px;">' + tmpHtml + '</div>');
            				} else {
            					PJF.html.append('printCBHtml', '<div style="page-break-after:always;">' + tmpHtml + '</div>');
            				}
                        }
                        
                        var func = function(){
        					STM.corporateBill.loading.destroy();
        					var htmlData = new Array();
        					htmlData.push(PJF.util.saveHtml("printCBHtml"));
        					PJF.stm.HDP.preparePrinter({}, function(prepareRes){
        						if('1' == prepareRes.status){
        							STM.corporateBill.doPrintCBHtml(htmlData, 0, cbSum);
        						} else {
        							STM.corporateBill.showPrintErrorMsg(prepareRes.errorMsg, prepareRes.errorCode);
        						}
        					});
        				};
        				STM.corporateBill.confirmDeductMoney(cbSum, money, func);
                    }
        		}
        	},1000);
        	//心跳 end
		},
		/**
		 * @function createCMST00014Html2
		 * @param {String}this_ xml文件内容
		 * @param {String}codeImage 二维码图片
		 * 生成对账清单html内容
		 */
		createCMST00014Html2 : function(this_, codeImage){
			var tmp;
			var time;
			var array;
			var tmpHtml = '';
			
			/*var content = 'branch-czdzqd-' + $(this_).find('head').attr('id') + '-' + (parseInt($(this_).find('head').attr('print_cnts')) + 1)
			+ '-' + PJF.util.formatDate(new Date(),"yyyy") + '-' + $(this_).find('head').attr('qr_str');
			var codeImage = STM.corporateBill.createQRCode(content);*/
			
			//统一样式
			tmpHtml += '<style>';
			tmpHtml += '.th_left{border-bottom: 1;border-left: 0;border-right: 1;border-top: 0;}';
			tmpHtml += '.th_right{border-bottom: 1;border-left: 0;border-right: 0;border-top: 0;}';
			tmpHtml += '.td_left{border-bottom: 0;border-left: 0;border-right: 1;border-top: 0;}';
			tmpHtml += '.td_right{border-bottom: 0;border-left: 0;border-right: 0;border-top: 0;}';
			tmpHtml += '.text_left{padding-left:2px;}';
			tmpHtml += '.text_right{text-align:right;padding-right:2px;}';
			tmpHtml += '.td_jq{white-space:nowrap;overflow-x:hidden;max-width:10px;}';
			tmpHtml += '</style>';
			
			//表头
			tmpHtml += '<div style="font-size: 13px;">';
			tmpHtml += '<table width="100%" >';
			tmpHtml += '<tr>';
			tmpHtml += '<td width="30%" colspan=3><h3 align="center" style="font-size: 22px;padding-left:170px;">集团流动性管理账户对账清单</h3></td>';
			tmpHtml += '<td width="55%"></td>';
			tmpHtml += '<td width="10%"></td>';
			tmpHtml += '<td width="5%" rowspan=3><img style="padding-top: 20px;" src="' + codeImage + '" alt="" align="left" height="80" width="80" /></td>';
			tmpHtml += '</tr>';
			tmpHtml += '<tr style="line-height: 17px;">';
			tmpHtml += '<td width="30%">币别：' + $(this_).find('head').attr('cur_code') + '</td>';
			tmpHtml += '<td width="55%">钞汇鉴别：' + $(this_).find('head').attr('cur_iden') + '</td>';
			tmpHtml += '<td width="10%"></td>';
			tmpHtml += '<td width="5%"></td>';
			tmpHtml += '</tr>';
			tmpHtml += '<tr style="line-height: 17px;">';
			tmpHtml += '<td width="30%">账号：' + $(this_).find('head').attr('acct_no') + '</td>';
			tmpHtml += '<td width="55%">账户名称：' + $(this_).find('head').attr('fs_acctname') + '</td>';
			tmpHtml += '<td width="10%">页码：' + $(this_).find('head').attr('page_no') + '</td>';
			tmpHtml += '<td width="5%"></td>';
			tmpHtml += '</tr>';
			tmpHtml += '</table>';
			tmpHtml += '<table width="100%" border=1 cellpadding=0 cellspacing=0 >';
			tmpHtml += '<tr style="line-height: 30px;">';
			tmpHtml += '<th width="5%" class="th_left">交易日期</th>';
			tmpHtml += '<th width="6%" class="th_left">凭证种类</th>';
			tmpHtml += '<th width="11%" class="th_left">交易流水号</th>';
			tmpHtml += '<th width="10%" class="th_left">摘要</th>';
			tmpHtml += '<th width="10%" class="th_left">借方发生额</th>';
			tmpHtml += '<th width="10%" class="th_left">贷方发生额</th>';
			tmpHtml += '<th width="11%" class="th_left">余额</th>';
			tmpHtml += '<th width="15%" class="th_left">对方账号</th>';
			tmpHtml += '<th width="22%" class="th_right">对方户名</th>';
			tmpHtml += '</tr>';
			
			//表内容
			time = 0;
			$(this_).find('item').each(function(){
				tmpHtml += '<tr style="line-height: 16.7px;">';
				
				tmp = $(this).text();
				array = tmp.split(' ■ ');
				
				tmpHtml += '<td class="td_left text_left">' + array[2].trim() + '</td>';
				tmpHtml += '<td class="td_left text_left td_jq">' + array[5].trim() + '</td>';
				tmpHtml += '<td class="td_left text_left td_jq">' + array[3].trim() + '</td>';
				tmpHtml += '<td class="td_left text_left td_jq">' + array[6].trim() + '</td>';
				tmpHtml += '<td class="td_left text_right td_jq">' + STM.corporateBill.getJE(array[7].trim()) + '</td>';
				tmpHtml += '<td class="td_left text_right td_jq">' + STM.corporateBill.getJE(array[8].trim()) + '</td>';
				tmpHtml += '<td class="td_left text_right td_jq">' + STM.corporateBill.getJE(array[9].trim()) + '</td>';
				tmpHtml += '<td class="td_left text_left td_jq">' + array[14].trim() + '</td>';
				tmpHtml += '<td class="td_right text_left td_jq">' + array[15].trim() + '</td>';
				
				tmpHtml += '</tr>';
				time ++;
			});
			
			//不足30行需补空行
			if(time < 30){
				for(var j=0; j<(30 - time); j++){
					tmpHtml += '<tr style="line-height: 16.7px;">';
					tmpHtml += '<td class="td_left">&nbsp;</td>';
					tmpHtml += '<td class="td_left">&nbsp;</td>';
					tmpHtml += '<td class="td_left">&nbsp;</td>';
					tmpHtml += '<td class="td_left">&nbsp;</td>';
					tmpHtml += '<td class="td_left">&nbsp;</td>';
					tmpHtml += '<td class="td_left">&nbsp;</td>';
					tmpHtml += '<td class="td_left">&nbsp;</td>';
					tmpHtml += '<td class="td_left">&nbsp;</td>';
					tmpHtml += '<td class="td_right">&nbsp;</td>';
					tmpHtml += '</tr>';
				}
			}
			
			//表尾
			tmpHtml += '</table>';
			tmpHtml += '<table width="100%">';
			tmpHtml += '<tr style="line-height: 17px;">';
			tmpHtml += '<td width="25%">打印时间：' + $(this_).find('head').attr('print_time') + '</td>';
			tmpHtml += '<td width="35%">打印机构：恒丰银行</td>';
			tmpHtml += '<td width="20%">打印柜员：' + PJF.otherInfo.devId + '</td>';
			tmpHtml += '<td width="20%">打印卡号：' + STM.corporateBill.Txn_CardNo + '</td>';
			tmpHtml += '</tr>';
			tmpHtml += '</table>';
			
			tmpHtml += STM.corporateBill.addClientNoticeNew();
			
			tmpHtml += '</div>';
			
			return tmpHtml;
		},
	/**
	 * @function getElecChapter
	 * @async
	 * @param {Object}conf 参数，集合
	 * Stmp_Bsn_Ctlg_ID//印章种类（电子印章）默认传001
	  Stmp_Blng_InsID//印章所属机构编号
	  OutbndCall_Svc_Txn_CD//外呼服务交易码 不传
	  VchID//凭证ID（32位）  MXDY0CCMS00000000000000000000001/2/3  明细/回单/对账单
	  Mnplt_TpCd//操作类型代码 01：查询02：导出03：客户端查询
	 * @return {String}resultBack;//1-电子印章开启，0-电子印章关闭
	 * 获取电子印章开关标志
	 * */
		getElecChapter:function(conf,resultBack){
		var elec_switch = PJF.roleInfo._elec_seal_switch;
		function ifUseElecChapter(elec_switch,conf,callback) {
			PJF.communication.cpsJsonReq({
				fwServiceId : "simpleTransaction",
				fwTranId : "A0161M538-HF",
				maskAll : true,
				jsonData : PJF.util.json2str(conf),
				success : function(responseData) {
					console.log("电子印章开关A0161M538-stm交易成功：" + PJF.util.json2str(responseData));
					if(responseData.LIST1) {
						var wthr_Us_Ind = responseData.LIST1[0].Eltc_Stmp_Wthr_Us_Ind;
						//@critical 01-电子开关打开
						if (wthr_Us_Ind == "01") {
							callback(1);
						} else {
							console.log("电子印章缓存开关elec_switch：" + elec_switch + ",但A0161M538-stm交易开关标志为wthr_Us_Ind：" + wthr_Us_Ind);
							callback(0);
						}
					}else{
						console.log("没有返回值LIST1数组,认为电子印章关闭");
						callback(0);
					}
				},
				failure : function(responseData) {
					console.log("电子印章开关A0161M538-stm交易失败：" + PJF.util.json2str(responseData));
					STM.corporateBill.debug(conf);
					if(responseData._COMMON){
						STM.corporateBill.debug(responseData._COMMON.SYS_EVT_TRACE_ID);
					}
					callback(0);
				}
			});
		}
		if(elec_switch == true){
			console.log("电子印章开关缓存elec_switch："+elec_switch);
			//@critical 缓存开关打开，再去调A0161M538，是否打开
			ifUseElecChapter(elec_switch,conf,function(flag){
				if(flag == 1){
					resultBack(1);
				}else{
					resultBack(0);
				}
			});
		}else{
			//@critical 电子缓存开关未开
			resultBack(0);
			console.log("电子印章开关缓存elec_switch："+elec_switch);
		}
	},
		/**
		 * @function 异步方法
		 * @param locCreateFileConf A0161M539请求参数。
		 * @returns {success:true/false,imgSrc:''} success:是否调用电子印章 true调用；imgSrc 电子印章路径，可以直接用img的src属性获取
		 * @author 罗兴旺
		 * 获取电子印章
		 */
		getTransSeal : function(locCreateFileConf,callBack){
			PJF.communication.cpsJsonReq({//发送存折请求交易
 	    		fwServiceId : "simpleTransaction", // 调用通用交易原子服务
 	    		fwTranId : "A0161M539-HF", // 外呼交易码
 	    		maskAll:true,
	    	    async:false,
 	    		jsonData : PJF.util.json2str(locCreateFileConf), // 请求参数json数据对象
 	    		success : function(dataInfo) {
 	    		    console.log("A0161M539-stm交易请求成功，返回数据："+PJF.util.json2str(dataInfo));
 	    			if(dataInfo && dataInfo.Vchr_Grp && dataInfo.Vchr_Grp.length>0 && 'Y' == dataInfo.Vchr_Grp[0].Eltc_Stmp_Wthr_Us_Ind){
						//var fileName = STM.corporateBill.cutOutFilePath(dataInfo.Vchr_Grp[0].Seal_Pic_P8_File_Rte);
 	    				
 	    				var Seal_Pic_P8_File_Rte = dataInfo.Vchr_Grp[0].Seal_Pic_P8_File_Rte;
 	    				//Seal_Pic_P8_File_Rte = '/home/ap/nas/share/file/input/bsmp/export/20211031/6100/610011001/002_447950YJNRJX.png';
 	    				//var fileName = dataInfo.Vchr_Grp[0].Seal_Pic_P8_File_Rte;
						//var fileExistUrl = STM.corporateBill.existUrl + fileName;
						//var downUrl = STM.corporateBill.url + fileName;

						var fileName = STM.corporateBill.cutOutFilePath(dataInfo.Vchr_Grp[0].Seal_Pic_P8_File_Rte);
						var fileExistUrl = STM.corporateBill.existUrl + fileName;
						var downUrl = STM.corporateBill.url + fileName;
						console.log(4989,fileName,fileExistUrl,downUrl);
						//判读下载文件是否存在
						 if(!STM.corporateBill.isFileExist(fileExistUrl))
							{
							console.log("文件不存在");
							var obj = {};
							obj.success = 0;
							//obj.imgSrc = STM.corporateBill.localUrl + fileName;
							obj.imgSrc = null;
							callBack(obj)
							return {"success":false};
							}
						
						
						//文件下载路径
						var locUrl = STM.corporateBill.localUrl + fileName;
						console.log(5006,locUrl);
						PJF.util.simpleDownload(locUrl, downUrl, function(d){
							console.log("下载图片返回数据！！！" + PJF.util.json2str(d));
							if(d.success){
								console.log("下载图片成功！！！");
								var obj = {};
								obj.success = true;
								obj.imgSrc = STM.corporateBill.localUrl + fileName;
								callBack(obj)
							}else{//失败
								console.log("下载图片失败！！！");
								return {"success":false};
							}
						});
 	    			}else{
						callBack({"success":false});
					}
 	    		},
 	    		failure : function(responseData) {
                    console.log("A0161M539-stm交易请求失败，返回数据："+PJF.util.json2str(responseData));
                    callBack({"success":false});
 	    		}
 	       });
		},
	/**
	 * @function mergeSearchArray
	 * @param {String}number 每组多少条
	 * @param {Object}allData 存放数组
	 * @param {String}fg 标志
	 * @returns {any[]} 返回处理数组
	 * 对账清单，帐页明细，回单打印的凭证id进行处理
	 */
	mergeSearchArray: function (number,allData,fg) {
		//新增逻辑处理开始
		//@critical 将原数组处理,单个凭证一个数组
		var allDataNew = new Array();
		var allDataLen = allData.length;
		var ids = '';
		for(var r=0;r<allDataLen;r++){
            if('DZQD' == fg){
                //@critical 对账清单小数组里面还是单个凭证数组
                var idArray = allData[r].vchIDs;
                for(var s=0;s<idArray.length;s++){
                    var id = idArray[s].VchID;
                    ids += id + ',';
                }
                if(r == allDataLen -1){
                    ids = ids.substring(0,ids.length - 1);//@critical 去掉最后一个逗号
                }
            }else if('ZYMX' == fg){
            	//@critical账页明细纯数组，无集合
				var id = allData[r];
				if(r == allDataLen - 1){
					ids += id;
				}else{
					ids += id + ',';
				}
			}else {
                var id = allData[r].vchIDs;
                if(r == allDataLen - 1){
                    ids += id;
                }else{
                    ids += id + ',';
                }
            }
		}
		var idsArr = ids.split(",");
		var idsArrLen = idsArr.length;
		var timesNew = (idsArrLen % number == 0) ? idsArrLen / number:(Math.floor(idsArrLen / number))+1;
		var k = 0;
		var tempArray = [];
		var tempArrTwo = [];
		//@critical 将allData数据进行截取
		for(var n=0; n<timesNew; n++) {
			if (n == (timesNew - 1)) {
				tempArray = idsArr.slice(n * number, idsArrLen);
			} else {
				tempArray = idsArr.slice(n * number, (n + 1) * number);
			}
			tempArrTwo[n] = tempArray;
		}
		console.log("截取的数组tempArrTwo："+PJF.util.json2str(tempArrTwo));
		//循环截取的数据
		//@critical 账页明细无次组装
		if('ZYMX' != fg){
			for(var q=0;q<tempArrTwo.length;q++){
				var tmpDataNew = {};
				var vchIDsNew = '';
				//@critical里面是小数组
				var vchArr = tempArrTwo[q];
				for(var p=0;p<vchArr.length;p++){
					vchIDsNew += vchArr[p] + ',';
				}
				tmpDataNew.vchIDs = vchIDsNew.substring(0,vchIDsNew.length - 1);
				tmpDataNew.num = number;
				tmpDataNew.pageNo = q;
				allDataNew[k]=tmpDataNew;
				k = k + 1;
			}
		}
		//@critical 对账清单是个数组,账页没必要在这样处理了，因为下载的代码里面处理了
        if('DZQD' == fg){
            var arrDZQDBigArr = new Array();
            for(var t = 0;t<allDataNew.length;t++){
                var arrDZQDArr = new Array();
                var arrDZQDbig = {};
                var vchIDsDZQD = allDataNew[t].vchIDs;
                var vchIDsDZQDArr = vchIDsDZQD.split(",");
                for(var v = 0;v<vchIDsDZQDArr.length;v++){
                    var tempDZQQD = {};
                    tempDZQQD.VchID = vchIDsDZQDArr[v];
                    arrDZQDArr[v] = tempDZQQD;
                }
                arrDZQDbig.vchIDs = arrDZQDArr;
                arrDZQDBigArr[t] = arrDZQDbig;
            }
            console.log("处理完的数组："+PJF.util.json2str(arrDZQDBigArr));
            return arrDZQDBigArr;
        }else if('ZYMX' == fg){
			for(var q=0;q<tempArrTwo.length;q++){
				var vchIDsNew = '';
				//@critical 里面是小数组
				var vchArr = tempArrTwo[q];
				for(var p=0;p<vchArr.length;p++){
					vchIDsNew += vchArr[p] + ',';
				}
				allDataNew[q]=vchIDsNew.substring(0,vchIDsNew.length - 1);
			}
			console.log("处理完的数组："+PJF.util.json2str(allDataNew));
			return allDataNew;
		}else{
            console.log("处理完的数组："+PJF.util.json2str(allDataNew));
            return allDataNew;
        }
		//新增逻辑处理完毕
	},
	/**
	 *@function mergePrintArray
	 * @param {Object}allData 请求结果组装数组
	 * @param {String}len 循环打印截取长度,回单20，账页20
	 * 根据len 处理打印的凭证ID
	 */
	mergePrintArray:function(allData,len){
		if(allData && allData.length){
			STM.corporateBill.resArr = new Array();
			var adLen = allData.length;
			//@critical 循环次数
			var times = (adLen % len == 0) ? adLen / len:(Math.floor(adLen / len))+1;
			for(var i=0;i<times;i++){
				var tempArray = [];
				if (i == (adLen - 1)) {
					tempArray = allData.slice(i * len, adLen);
				} else {
					tempArray = allData.slice(i * len, (i + 1) * len);
				}
				//@critical 重新组装
				STM.corporateBill.resArr.push(tempArray);
			}
		}
	},
	/**
	 * @function printAllCBCon
	 * @param allDataCon 每次打印的凭证数组
	 */
	printAllCBCon:function (allDataCon) {
		//@critical 20200526修改为120笔回单40页pdf,保持以前逻辑不变，进行数组处理
		var prepareData = [];
        STM.corporateBill.ValArray = new Array();// @critical在这里初始化继续打印全部回单时重新计数
		var number = 150;//@critical 150笔回单，一个pdf50页
		var allDataNew = STM.corporateBill.mergeSearchArray(number,allDataCon,'');
		console.log(5223,allDataCon.length,allDataNew.length);
		//STM.corporateBill.printAllCB(allData, prepareData, 0, 0.00, 0);
		//STM.corporateBill.printAllCB(allDataNew, prepareData, 0, 0.00, 0);
		STM.corporateBill.printAllCB(allDataCon, prepareData, 0, 0.00, 0);
	},
	/**
	 * @function initParamBeforeOper
	 * 中途报错，再次进入清空中间变量值
	 */
	initParamBeforeOper:function(){
		STM.corporateBill.resArr = null;
		STM.corporateBill.priAllBL = false;
		STM.corporateBill.priAllCB = false;
	}
};
