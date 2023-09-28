/**
 * @file 账页明细
 * @author ZhangAXiong
 * @version 1.0
 * Create On
 * Last Updated 2021-01-19
 * 账页明细的查询、打印、登记
 */
function ledgerPageDetailListHF() {
}

var Acc_Tp_ID_obj = {
		'1':'活期',
		'2':'定期',
		'3':'贷款'
}

ledgerPageDetailListHF.prototype = {
    init: function (data) {
    	$this = this;
        $this.selectInfo=[];
        var VchId_GrpALL = [];
    	data = data || {};
    	STM.corporateBill.Txn_CardNo =  data.Txn_CardNo?data.Txn_CardNo:null;
    	var registLPData = null;//  @critical 记录需要登记的账页信息（编号+打印标志）
    	var pageCount = 0;// @critical  判断是否是打印的第一页
    	var downLoadTimes = 0;//  @critical 全部打印需要调用账页下载接口次数（每次最多10笔，相当于分页一页）
    	var dealNum = 30;//  @critical 一次请求登记笔数
    	var totalNum = 0;// @critical  总笔数
    	
    	var PDFPrintPath = null;// @critical 存放PDF下载路径
    	STM.corporateBill.jsonCMST00004.Vchr_Ctlg_No='01';
    	STM.corporateBill.jsonCMST00004.prt_Ind='1';// @critical 0-非补打，1-补打
		STM.corporateBill.jsonCMST00004.OPR_NO = PJF.otherInfo.devId;
		/**
         * @function getBeginDateStr
		 * 获取默认开始日期字符串（格式：yyyyMMdd）
		 */
		var getBeginDateStr = function(){
			// 获取服务器时间并且转为Date格式
			
			var nowDate = new Date();// 获取系统时间
//			var nowTimeStr = PJF.util.formatDate(nowDate,'yyyyMMdd');// 系统当前时间字符串1214改造服务器日期
			var nowTimeStr = PJF.communication.getServerTime('yyyyMMdd');// 服务器日期
			
//			var tempDate = new Date();
//			tempDate.setDate(tempDate.getDate() - 92);// 当前日期减去92天
//			var tempTimeStr = PJF.util.formatDate(tempDate,'yyyyMMdd');// 获取减去92天后的年月日
			var dateNext = new Date(PJF.communication.getServerTime('yyyy/MM/dd HH:mm:ss'));
			dateNext.setTime(dateNext.getTime()-92*24*60*60*1000);
			var tempTimeStr = PJF.util.formatDate(new Date(dateNext));
			
			// 截止日期与起始日期之间的日期间隔不能超过92天
//			return (tempTimeStr.substr(0,4) == nowTimeStr.substr(0,4) ? 
//					tempTimeStr : (nowTimeStr.substr(0,4) + '0101'));
			return tempTimeStr;
		}
		
		var param = {};
		param.TxCode = 'A0782T010';//1026改造CMST00010->A0782T010
		param.OPR_NO = PJF.otherInfo.devId, // 柜员号
		param.chanl_cust_no = '';
		param.CCBIns_ID = PJF.roleInfo.orgCode;// 建行机构编号
		param.Txn_CardNo = data.Txn_CardNo;// 交易卡卡号
		param.Cur_Pg_CD = '';// 当前页码
		if(!data.condition){// 默认查询
			param.Cst_AccNo = '';// 客户账号
			param.StDt = getBeginDateStr();// 默认开始日期
			param.CODt = PJF.communication.getServerTime('yyyyMMdd');//1214服务器日期PJF.util.formatDate(new Date(),'yyyyMMdd');// 默认截止日期
			param.Min_Val = '';// 起始帐页页码
			param.Max_Val = '';// 截止帐页页码
			param.Prt_Ind = '0';// 打印标志
		}else{// 条件查询
			param.Cst_AccNo = data.Cst_AccNo;// 客户账号
			param.StDt = data.StDt;// 默认开始日期
			param.CODt = data.CODt;// 默认截止日期
			param.Min_Val = data.Min_Val;// 起始帐页页码
			param.Max_Val = data.Max_Val;// 截止帐页页码
			param.Prt_Ind = data.Prt_Ind;// 打印标志
		}
    	
    	$this = this;
    	
    	/**
		 * @function editRegData
    	 * @param {OBject} regData 封装后数据
    	 * @param {Object} arr 补打/非补打的账页数据
    	 * @param {String}isPrt 是否是补打 1-是 0-不是
         * 每dealNum笔做一次编辑（一次请求登记dealNum笔账页）
    	 */
    	function editRegData(regData, arr, isPrt){
    		if(arr.length > 0){
    			// 计算请求次数
    			var t = parseInt(arr.length / dealNum);
    			var reqNum = (arr.length % dealNum == 0) ? t : (t + 1);
    			
        		for(var m = 1; m <= reqNum; m++){
        			var startNum = (m - 1) * dealNum;//  @critical 开始下标
            		var endNum = (m == reqNum) ? arr.length : (startNum + dealNum);//  @critical 截止下标
            		var vchIDStr = '';
        			for(var n = startNum; n < endNum; n++){
            			if(n < (endNum - 1)){//  @critical 不是最后一个
            				vchIDStr += arr[n] + ',';
            			}else{
            				vchIDStr += arr[n];
            			}
            		}
        			var regObj = {};
        			regObj.List_Val = vchIDStr;
        			regObj.prt_Ind = isPrt ? '1' : '0';
        			
        			regData.push(regObj);
        		}
    		}
    	}
    	
    	/**
		 * @function divideRegData
    	 * @param {Object} printSuccNum 打印成功总张数
         * 区分账页登记信息方便后续登记 （区分补打和非补打）
    	 */
    	function divideRegData(printSuccNum){
    		var regData = new Array();// @critical  封装后数据
    		var unPrtArray = new Array();//  @critical 非补打
    		var prtArray = new Array();//  @critical 补打
    		for(var i = 0; i < printSuccNum; i++){
    			if(registLPData[i].Prt_Ind == '0'){// 非补打
    				unPrtArray.push(registLPData[i].VchID);
    			}else{// 补打
    				prtArray.push(registLPData[i].VchID);
    			}
    		}
    		editRegData(regData, unPrtArray, false);
    		editRegData(regData, prtArray, true);
    		
    		return regData;
    	}
    	
    	/**
		 *  @function downLoadReg
    	 * @param{String} printSuccNum 打印成功总张数
         * @param{Object}VchId_Grp 账页ID
         * 打印后登记成功打印的账页
    	 */
    	function downLoadReg(printSuccNum,VchId_Grp){
    		//  @critical 获取封装后的请求参数
    		var regData = divideRegData(printSuccNum);
    		console.log('打印登记总请求次数：' + regData.length);
    		for(var m = 0; m < regData.length; m++){
    			var jsonData = STM.corporateBill.jsonCMST00004;
    			jsonData.Vchr_Ctlg_No = '01';// 凭证种类号-账页
    			jsonData.List_Val = regData[m].List_Val;// 账页id字符串
    			jsonData.prt_Ind = regData[m].prt_Ind;// 0-非补打，1-补打
    			jsonData.VchId_Grp = VchId_Grp;
    			console.log('downLoadReg->VchId_Grp' + PJF.util.json2str(VchId_Grp));
        		var succFunc = function(responseData) {
    				console.log('第' + m + '次账页打印登记成功');
    				/*if(m == totalReqNum){//最后一次打印登记成功
    					var tmp = {
    						publicBusiness:true,//营销页面显示对公结算卡专用图片
    						cdbEjectSound:'app/debitCard/11.wav'//11请取回您的单位结算卡
    					};
    					template.loadPage('ledgerPageDetailListHF', data);
    				}*/
    			};
    			STM.corporateBill.downLoadRegister(jsonData, succFunc);
    		}
    	}
        /**
		 * @function getFilePathCon
         * @param{Object}vchIDStrArray 账页ID
         * 组装打印帐页参数
         */
		function getFilePathCon(vchIDStrArray) {
			var xmlFilePaths = new Array();
			var number =50;
			var allDataNew = STM.corporateBill.mergeSearchArray(number,vchIDStrArray,'ZYMX');
			STM.corporateBill.balCurNum = 0;//下一次续打的时候初始0，重新计算
			VchId_GrpALL = [];//账页下载，打印的数组
            PDFPrintPath = new Array();//PDF下载路径
            STM.corporateBill.LP_PRT_FEEAMT = 0.00;//本次打印账页费用
			getFilePath(allDataNew, xmlFilePaths, 0);
		}

		/**
		 * @function getLedPageData
         * @async
         * @param {String}pageNum 第几页
         * @param {String} vchIDStrArray 账页编号字符串数组
         * 递归调用获取账页信息
         */
		function getLedPageData (vchIDStrArray, pageNum){
			//param.Cur_Pg_CD = pageNum;// 当前页码
			param._pagination = {};
			param._pagination.REC_IN_PAGE = '10';// @critical  每页个数新接口改造必须送
			param._pagination.PAGE_JUMP = pageNum;//  @critical 解决xml配置分页默认查第一页问题
			
			var sendA07824613Data = {
					Btch_Vchr_Blg_AccNo:param.Cst_AccNo,
	        		Enqr_StDt:param.StDt,
	        		Enqr_CODt:param.CODt,
	        		Beg_Pg_CD:param.Min_Val,
	        		Cur_Pg_CD:param.Max_Val,
	        		CcyCd:param.Prt_Ind, //需要改
	        		_pagination:{
						'REC_IN_PAGE': '10',
						'PAGE_JUMP': '1'
	        		}
			}
			PJF.communication.cpsJsonReq({
    			fwServiceId : "simpleTransaction",
    			//fwTranId : "A0782T010-stm",//1026改造CMST00010->A0782T010
    			fwTranId : "A07824613-HF",
    			jsonData : PJF.util.json2str(sendA07824613Data),
    			//maskAll : true,
    			//jsonData : PJF.util.json2str(param),
    			success : function(responseData){
    			    console.log("》》》打印全部，获取账页信息第"+pageNum+"次成功");
    				/*if(responseData.Qry_GRP){
    					var vchIDStr = '';
    					for(var i = 0; i < responseData.Qry_GRP.length; i++){
    						var registLP = {};// 用于打印登记
    						registLP.VchID = responseData.Qry_GRP[i].VchID;// 账页编号
    						registLP.Prt_Ind = responseData.Qry_GRP[i].Prt_Ind;// 打印状态
    						registLPData.push(registLP);
    						if(i < (responseData.Qry_GRP.length - 1)){
    							vchIDStr += responseData.Qry_GRP[i].VchID + ',';
    						} else {
    							vchIDStr += responseData.Qry_GRP[i].VchID;
    						}
    					}
    					vchIDStrArray.push(vchIDStr);
    				}*/
    			    var Page_Grp = responseData.Page_Grp;
    			    if(Page_Grp && Page_Grp.length){
    			    	var vchIDStr = '';
    			    	Page_Grp.forEach(function(item,i){
        			    	registLPData.push({
        			    		VchID:item.VchID,
        			    		Prt_Ind:item.Rprnt_Cnt,
        			    	});
        			    	if(i < (Page_Grp.length - 1)){
    							vchIDStr += Page_Grp[i].VchID + ',';
    						} else {
    							vchIDStr += Page_Grp[i].VchID;
    						}
        			    });
        			    vchIDStrArray.push(vchIDStr);
    			    }
    			  
    			    
    				if(pageNum < downLoadTimes){
    					getLedPageData(vchIDStrArray, ++pageNum);
    				}else{
    					//var xmlFilePaths = new Array();
    					//STM.corporateBill.LP_PRT_FEEAMT = 0.00;
    					//getFilePath(vchIDStrArray, xmlFilePaths, 0);
                        console.log("是否点击账页打印全部按钮："+STM.corporateBill.priAllBL);
                        if(STM.corporateBill.priAllBL == true){
                            var len = 0;//账页截取长度
							if(STM.corporateBill.ifCluOrg == true){
								len = 10;
							}else{
								len = 20;
							}
							console.log("账页续打截取长度："+len);
                            STM.corporateBill.mergePrintArray(vchIDStrArray,len);
                            if(STM.corporateBill.resArr && STM.corporateBill.resArr.length){
                                var vchIDStrArrayCon = STM.corporateBill.resArr.shift();
                                console.log("首次打印数据："+PJF.util.json2str(vchIDStrArrayCon));
                                getFilePathCon(vchIDStrArrayCon);
                            }
                        }else{
                            getFilePathCon(vchIDStrArray);
                        }

                        /*var number =50;
                        var allDataNew = STM.corporateBill.mergeSearchArray(number,vchIDStrArray,'ZYMX');
                        getFilePath(allDataNew, xmlFilePaths, 0);*/
    				}
    			},
    			failure : function(responseData){
    				STM.corporateBill.showErrorMsg(responseData, '打印出错');
    				if(STM.corporateBill.loading){
						STM.corporateBill.loading.destroy();
					}
					return;
    			}
    		});
		}
		
    	/**
		 * @function getFilePath
    	 * 根据账页编码列表值获取返回的账页明细xml文件
    	 * @param {Object}vchIDStrArray 账页编码列表数组 ，列表字符串用","隔开
    	 * @param {String}xmlFilePaths 每一页账页下载文件的路径数组
         * @param {String}getFilePathi 获取第几个文件路径
    	 * 递归调用每一页
    	 */
		function getFilePath (vchIDStrArray, xmlFilePaths, getFilePathi){
			var conf = {};
			conf.Stmp_Bsn_Ctlg_ID = "001";// @critical 默认传001
			conf.Stmp_Blng_InsID = PJF.roleInfo.orgCode;
			conf.VchID = "MXDY0CCMS00000000000000000000003";// @critical 对账单
			conf.Mnplt_TpCd="03";//默认03：客户端查询
			STM.corporateBill.getElecChapter(conf,function(elec_flag){
				continueGetFilePath(vchIDStrArray, xmlFilePaths, getFilePathi,elec_flag);
			});
			function continueGetFilePath(vchIDStrArray, xmlFilePaths, getFilePathi, elec_flag) {
				// 账页下载请求参数
				var reqData = {};
				reqData.List_Val = vchIDStrArray[getFilePathi];// 列表值
				reqData.CCBIns_ID = PJF.roleInfo.orgCode;// 建行机构号
				reqData.Txn_CardNo = data.Txn_CardNo;// 交易卡号
				reqData.TxCode = 'A0782T011';//CMST00011=>A0782T011
				reqData.OPR_NO = PJF.otherInfo.devId, // 柜员号
				reqData.chanl_cust_no = '';
				reqData.Fee_Ind = "1";
				reqData.MsgRp_Prt_Tm =STM.corporateBill.printServiceTime||PJF.communication.getServerTime("yyyy-MM-dd HH:mm:ss");//打印时间
				if(elec_flag == 1){
					reqData.Eltc_Stmp_Wthr_Us_Ind = 1;
				}else{
					reqData.Eltc_Stmp_Wthr_Us_Ind = 0;
				}
				//@critical 1026改造CMST00011->A0782T011增加VchId_Grp//VchID 账单编号
				var VchId_Grp = [];
				var VchId_GrpList = reqData.List_Val.split(',');
				//计算本次打印的条数
				STM.corporateBill.balCurNum = STM.corporateBill.balCurNum +VchId_GrpList.length;
				for(var g = 0;g < VchId_GrpList.length; g++){
					VchId_Grp.push({VchID:VchId_GrpList[g]});
					VchId_GrpALL.push({VchID:VchId_GrpList[g]});
				}
				reqData.VchId_Grp = VchId_Grp;
				
				var Crd_ID = data.Cst_AccNo?data.Cst_AccNo:data.Txn_CardNo;
				var sendA07824614Obj = {
						Fdbk_Chnl_ID:'1',
						Crd_ID: data.Cst_AccNo
				}
				sendA07824614Obj.Page_Prt_Grp = VchId_GrpList.map(function(item,i){
					return {VchID:item}
				});
				PJF.communication.cpsJsonReq({
					fwServiceId : "simpleTransaction",
					//fwTranId : "A0782T011-stm",//CMST00011=>A0782T011
					fwTranId : 'A07824614-HF',
					//maskAll : true,
					async: true,
					jsonData : PJF.util.json2str(sendA07824614Obj),// PJF.util.json2str(reqData),
					success : function(responseData) {
						console.log("》》》账页明细文件第"+(getFilePathi+1) +"次下载成功");
						if(responseData._COMMON && responseData._COMMON.P2S_EVT_TRACE_ID){
							console.log('A07824614-HF:' + responseData._COMMON.P2S_EVT_TRACE_ID);
							STM.corporateBill.debug('A07824614-HF:' +responseData._COMMON.P2S_EVT_TRACE_ID);
						}
						var feeAmt = parseFloat(responseData.Ths_FeeAmt);// 本次交易的账页打印收费金额
						var fileFullName = responseData.File_Rte_FullNm;// 文件全路径
						// 截断文件全路径获取文件名
//					var fileName = fileFullName ? STM.corporateBill.cutOutFilePath(fileFullName) : '';
						//1026改造CMST00011->A0782T011
						var fileName = "";
						console.log("T011_COMMON.FILE_LIST_PACK.FILE_INFO" + responseData._COMMON.FILE_LIST_PACK.FILE_INFO.length);
						if(responseData._COMMON.FILE_LIST_PACK.FILE_INFO.length > 0){
							fileName = responseData._COMMON.FILE_LIST_PACK.FILE_INFO[0].FILE_NAME;
						}else{
							fileName = "";
						}
						var fileExistUrl = STM.corporateBill.existUrl + fileName;// 服务器上文件路径
						// 判断文件是否传送到服务器上
						if(!fileName || !STM.corporateBill.isFileExist(fileExistUrl)){
							STM.corporateBill.showPrintErrorMsg('回单附件预览文件不存在，下载失败', null);
							if(STM.corporateBill.loading){
								STM.corporateBill.loading.destroy();
							}
							return;
						}
						xmlFilePaths.push({fileName:fileName,pageNo:VchId_Grp.length});
						STM.corporateBill.LP_PRT_FEEAMT += isNaN(feeAmt) ? 0.00 : feeAmt;
						if((getFilePathi + 1) < vchIDStrArray.length){
							// 打印张数及金额确认
							getFilePath(vchIDStrArray, xmlFilePaths, ++getFilePathi);

						} else {
							//var htmlPaths = new Array();
							PJF.html.empty('print_tab');//先清空隐藏内容
							pageCount = 0;
//						STM.corporateBill.confirmDeductMoney(VchId_GrpALL.length, STM.corporateBill.LP_PRT_FEEAMT.toFixed(2), function(){
//    	        			STM.corporateBill.loading = new PJF.ui.loading({msg:'业务正在处理中，请稍候……'});
//
//    	        		});
							downloadPDFPath(xmlFilePaths,0,VchId_GrpALL,elec_flag);
							//createPrintHTML(xmlFilePaths, 0,VchId_Grp);
						}
					},
					failure : function(responseData) {
						STM.corporateBill.showErrorMsg(responseData, '下载账页文件到P2出错');
						if(STM.corporateBill.loading){
							STM.corporateBill.loading.destroy();
						}
						return;
					}
				});
			}
    	}

        /**
         * @function downloadPDFPath
         * @param {String}data 下载账单文件数据
         * @param {String}i 下标
         * @param {Object}VchId_GrpALL 账单ID数组
         * @param {String}elec_flag 是否使用电子印章
         * 1.下载账页
         * 2.打印账页
         */
	    function downloadPDFPath(data,i,VchId_GrpALL,elec_flag){
		    console.log("下载账单文件==");
			//STM.corporateBill.loading = new PJF.ui.loading({msg:'业务正在处理中，请稍候……'});
		    var fileName = data[i].fileName;
		    var fileExistUrl = STM.corporateBill.existUrl + fileName;
		    if(!STM.corporateBill.isFileExist(fileExistUrl)){
		        STM.corporateBill.showPrintErrorMsg('账单文件不存在，下载失败', null);
				if(STM.corporateBill.loading){
					STM.corporateBill.loading.destroy();
				}
		        return;
		    }

//		    var downUrl = STM.corporateBill.url + fileName;
//
//		    //文件下载路径
//		    var dwurl= STM.corporateBill.localUrl + fileName;
		    //下载
//		    PJF.communication.FileDownload.Add(dwurl, downUrl);
//		    //去掉下载监听
//		    PJF.event.removeSubscriber(PJF.PadClientEvents.download.completed);
//		    PJF.event.removeSubscriber(PJF.PadClientEvents.download.failed);
//		    //下载回调成功处理
//		    PJF.event.addSubscriber(PJF.PadClientEvents.download.completed, function(fileName, a, b, status) {
//		        console.log("文件下载！"+dwurl);
//		        if('complete' == status){//下载成功
//		        	console.log("文件下载到本地成功！"+dwurl);
//		        	PDFPrintPath.push(dwurl);
//		        }else{
//		        	STM.corporateBill.showPrintErrorMsg('下载文件失败！', null);
//			        return;
//		        }
//		    });
//		    //下载回调失败处理
//		    PJF.event.addSubscriber(PJF.PadClientEvents.download.failed, function(fileName, a, b, status) {
//		        console.log("文件下载回调失败！");
//		        STM.corporateBill.showPrintErrorMsg('文件下载回调失败', null);
//		    });
		    
//		    var localUrl = PJF.communication.fileSystem.getAppStorageFolder().result + '/Temp/';//下载文件本地地址
//		    var remoteUrl ='http://' + location.host + '/ecpweb/getLocalFile.action?relativePath=filesystem/forever/xyk/protocols&openFile=false&fileName=';//服务端文件地址
		    // @critical 远程文件路径
		    var dwRemoteUrl = STM.corporateBill.url + fileName;
		    // @critical 本地文件下载路径
		    var dwLocalUrl = STM.corporateBill.localUrl + fileName;	 
	
		    PJF.util.simpleDownload(dwLocalUrl, dwRemoteUrl, function(d){
			if(d.success){//成功
			    console.log("文件下载路径！"+dwRemoteUrl);
				console.log("文件本地下载！"+dwLocalUrl);
				console.log("文件下载到本地成功！"+dwLocalUrl);
				if(i==data.length-1){
					if(STM.corporateBill.loading){
						STM.corporateBill.loading.destroy();
					}
					PDFPrintPath.push({dwLocalUrl:dwLocalUrl,pageNo:data[i].pageNo});
	        		var confirmFunc = function(){
	        			//STM.corporateBill.loading = new PJF.ui.loading({msg:'业务正在处理中，请稍候……'});
						// 预热打印机
	        			PJF.stm.HDP.preparePrinter({}, function(prepareRes){
		        			console.log(PJF.util.json2str(prepareRes));
		        			if('1' == prepareRes.status){//  @critical 预热成功
		        				console.log('打印机预热成功');
		        				doPrint(PDFPrintPath,VchId_GrpALL,0,0,elec_flag);
		        				/*for(var d = 0; d < PDFPrintPath.length;d++){
		        					console.log('打印'+PDFPrintPath[d]);
		        					doPrint(PDFPrintPath[d],VchId_GrpALL);
		        				}*/
		        			}else{//  @critical 预热失败
		        				console.log('打印机预热失败');
		        				STM.corporateBill.showPrintErrorMsg(prepareRes.errorMsg+"，请退卡后呼叫工作人员处理", prepareRes.errorCode);
		        			}
		        		});
					};
    				// @critical打印张数及金额确认
					STM.corporateBill.confirmDeductMoney(registLPData.length, STM.corporateBill.LP_PRT_FEEAMT.toFixed(2), confirmFunc);

				}else{
					PDFPrintPath.push({dwLocalUrl:dwLocalUrl,pageNo:data[i].pageNo});
					downloadPDFPath(data,i+1,VchId_GrpALL,elec_flag);
				}
	        	
			}else{//失败
			    console.log("文件下载回调失败！");
				if(STM.corporateBill.loading){
					STM.corporateBill.loading.destroy();
				}
				STM.corporateBill.showPrintErrorMsg('账页文件下载回调失败', null);
			}
		    });	
		};
    	/** @function createPrintHTML
    	 * @param {Object} xmlFilePaths 账页XML文件路径数组
    	 * @param {String} j 递归调用每一页账页的XML文件
         *  生成打印HTML文件，并保存文件路径
    	 */
    	function createPrintHTML (xmlFilePaths, j,VchId_Grp){
        	var xmlPath = xmlFilePaths[j];
//        	var pages = STM.corporateBill.decorateLPData(xmlPath);// 获取账页的页面数据
//        	var htmlPath = '';
//        	if(pages.length > 0){
//        		for(var k = 0; k < pages.length; k++){
//        			pageCount++;
//        			var ledPageHTML = STM.corporateBill.createLPHTML(pages[k], pageCount);// 生成html内容
//    				PJF.html.append('print_tab', ledPageHTML);
//    				ledPageHTML = null;
//        		}
//        		pages = null;
//        		if(j == (xmlFilePaths.length - 1)){// 最后一次
//        			htmlPath = PJF.util.saveHtml("print_tab");
//        			console.log('最终生成的账页总页数：' + pageCount);
//        			console.log('生成HTML文件路径：' + htmlPath);
//        			PJF.html.empty('print_tab');// 清空隐藏内容
//        		}
//        	}else{
//        		STM.corporateBill.loading.destroy();
//        		return;
//        	}
        	downloadPDFPath(xmlPath);
        	if((j + 1) < xmlFilePaths.length){
        		createPrintHTML(xmlFilePaths, ++j,VchId_Grp);
        	}else{
				if(STM.corporateBill.loading){
					STM.corporateBill.loading.destroy();
				}
        		var confirmFunc = function(){
					// 预热打印机
	        		PJF.stm.HDP.preparePrinter({}, function(prepareRes){
	        			console.log(PJF.util.json2str(prepareRes));
	        			if('1' == prepareRes.status){// 预热成功
	        				console.log('打印机预热成功');
	        				for(var d = 0; d < PDFPrintPath.length;d++){
	        					console.log('打印'+PDFPrintPath[d]);
	        					doPrint(PDFPrintPath[d],VchId_Grp);
	        				}
	        			}else{// 预热失败
	        				console.log('打印机预热失败');
	        				STM.corporateBill.showPrintErrorMsg(prepareRes.errorMsg, prepareRes.errorCode);
	        			}
	        		});
				};
        		// 打印张数及金额确认
        		STM.corporateBill.confirmDeductMoney(registLPData.length, STM.corporateBill.LP_PRT_FEEAMT.toFixed(2), confirmFunc);
        	}
        };

        /**
         * @function doPrint
         * @param {Object}htmlPath 打印地址
         * @param {Object}VchId_Grp 打印数组
         * @param {String}i 下标
         * @param {String}printSuccNum 打印成功张数
         * @param {String}elec_flag 是否使用电子印章
         * 1.打印html文件
         * 2.如果使用电子印章则使用，不使用则使用物理盖章
         * 3.打印成功跳转成功页面并进行打印登记
         */
        function doPrint (htmlPath,VchId_Grp,i,printSuccNum,elec_flag){
        	//console.log('doPrint预计打印账页张数：'+(registLPData.length));
        	console.log('doPrint预计打印：'+htmlPath.dwLocalUrl);
        	console.log(PJF.util.json2str(htmlPath));
        	STM.corporateBill.debug(PJF.util.json2str(htmlPath)+','+PJF.util.json2str(VchId_Grp)+','+i+','+printSuccNum+','+elec_flag);
//        	var startArgs = {};
//        	startArgs.iTotalPaperNum = registLPData.length;// 预期打印张数
//        	startArgs.iSlotType = 3;// 3号纸槽（账页A4纸）
//        	startArgs.iChapterType = 4;// 横打+盖章
//        	startArgs.iChapterNum = registLPData.length;// 盖章数量
//        	startArgs.pchChapterPos=240;// 盖章位置
//        	startArgs.printFilePath = htmlPath;// 打印文档路径
			console.log("是否使用电子印章使用elec_flag："+elec_flag);
			if(elec_flag == 1){
				var startArgs={};
				startArgs.iTotalPaperNum = htmlPath[i].pageNo;
				startArgs.iSlotType=3;
				startArgs.iChapterType=6;
				startArgs.pchChapterPos=0;// 盖章位置，不盖章横向打印
				startArgs.iChapterNum=0;//一共盖章的个数
				startArgs.printFilePath=htmlPath[i].dwLocalUrl;//打印文件路径
			}else{
				var startArgs={};
				startArgs.iTotalPaperNum = htmlPath[i].pageNo;//pageNo;//指定预期打印的回单张数
				startArgs.iSlotType=3;//修改为盖横章2;//指定需要使用的纸槽
				//1－1号纸槽（单联回单纸）
				//2－2号纸槽（三联回单纸，尺寸同A4纸）
				//3－3号纸槽（账页纸，尺寸同A4纸）
				//4－4号纸槽（1/2 A4大小回单，尺寸同1/2 A4纸）预留
				startArgs.iChapterType=4;//盖章模式（详见说明文档）
				startArgs.pchChapterPos=240;// 盖章位置
				startArgs.iChapterNum=htmlPath[i].pageNo;//一共盖章的个数
				startArgs.printFilePath=htmlPath[i].dwLocalUrl;//打印文件路径
			}
            console.log(PJF.util.json2str(startArgs));
        	// 开始打印html
        	PJF.stm.HDP.startPrintReceipt(startArgs, function(startPrintRes){
        		console.log(PJF.util.json2str(startPrintRes));
        		STM.corporateBill.debug(PJF.util.json2str(startPrintRes));
        		if('1' == startPrintRes.status){// 打印成功
        			if(i==htmlPath.length-1){
        				if(startPrintRes.info && startPrintRes.info.printProgressData){
            				printSuccNum = VchId_Grp.length;
            				if(printSuccNum > 0){
                    			//downLoadReg(printSuccNum,VchId_Grp);
            					if(STM.corporateBill){
            						STM.corporateBill.ledgerReg = 1;
            					}
            					STM.corporateBill.divideDataAndReg(printSuccNum,VchId_Grp);
                			}
            			}
						if(STM.corporateBill.priAllBL == true){
							if(STM.corporateBill.resArr && STM.corporateBill.resArr.length){
								var vchIDStrArrayCon = STM.corporateBill.resArr.shift();
								console.log("再次打印数据："+PJF.util.json2str(vchIDStrArrayCon));
								//即时destory()掉之后，这个对象还在
								if(STM.corporateBill.loading){
									STM.corporateBill.loading = null;
								}
								STM.corporateBill.loading = new PJF.ui.loading({msg:'业务正在处理中，请稍候……'});
								getFilePathCon(vchIDStrArrayCon);
							}else{
								var tmp = {
									publicBusiness:true,//营销页面显示对公结算卡专用图片
									cdbEjectSound:'app/debitCard/11.wav'//11请取回您的单位结算卡
								};
								template.loadPage('takeCBHF',tmp);
								//清空数据
								STM.corporateBill.resArr = new Array();
								STM.corporateBill.balCurNum = 0;
								STM.corporateBill.priAllBL = false;
							}
						}else{
							var tmp = {
								publicBusiness:true,//营销页面显示对公结算卡专用图片
								cdbEjectSound:'app/debitCard/11.wav'//11请取回您的单位结算卡
							};
							template.loadPage('takeCBHF',tmp);
							// @critical 清空数据
							STM.corporateBill.resArr = new Array();
							STM.corporateBill.balCurNum = 0;
							STM.corporateBill.priAllBL = false;
						}

        			}else{
        				printSuccNum += parseInt(startPrintRes.info.printProgressData) || 0;
        				doPrint(htmlPath,VchId_Grp,i+1,printSuccNum,elec_flag);
        			}

        		}else{
        			printSuccNum += parseInt(startPrintRes.info.printProgressData) || 0;
        			// 打印失败
        			if(printSuccNum > 0){
        				/*var errorMsg = '打印过程中出错，已打印' + printSuccNum
        				+ '张，未打印' + (registLPData.length - printSuccNum) + '张，请退卡后呼叫工作人员处理';*/
						var errorMsg = '打印过程中出错，已打印' + printSuccNum
							+ '张，未打印' + (STM.corporateBill.balCurNum - printSuccNum) + '张，请退卡后呼叫工作人员处理';
        				STM.corporateBill.showPrintErrorMsgAndGetPaper(errorMsg, startPrintRes, function(){
        					//downLoadReg(printSuccNum,VchId_Grp);
        					if(STM.corporateBill){
        						STM.corporateBill.ledgerReg = 1;
        					}
        					STM.corporateBill.divideDataAndReg(printSuccNum,VchId_Grp);
        					var tmp = {
	    						publicBusiness:true,//营销页面显示对公结算卡专用图片
	    						cdbEjectSound:'app/debitCard/11.wav'//11请取回您的单位结算卡
	    					};
	    					template.loadPage('takeCBHF',tmp);
							// @critical 清空数据
							STM.corporateBill.resArr = new Array();
							STM.corporateBill.balCurNum = 0;
        				});
        			}else{
        				STM.corporateBill.showPrintErrorMsg(startPrintRes.errorMsg+"，请退卡后呼叫工作人员处理", startPrintRes.errorCode);
        			}
        		}
        	});
        }
        
        var sendA07824613Data = {
        		Btch_Vchr_Blg_AccNo:param.Cst_AccNo,
        		Enqr_StDt:param.StDt,
        		Enqr_CODt:param.CODt,
        		Beg_Pg_CD:param.Min_Val,
        		Cur_Pg_CD:param.Max_Val,
        		CcyCd:param.Prt_Ind //需要改
        }
        
		// 查询后的账页明细结果表格
        $this.ledgerPageDetailResult = new PJF.ui.grid({
			dom:'ledgerPageDetailResult',
			width:'auto',
			height:570,
			totalPath:'_COMMON.COMB.TOTAL_REC',
//			totalPath:'Dtl_Tdnum',
//			currentPath:'Cur_Pg_CD',
			//pageNumberParamName:'Cur_Pg_CD',
			isAppendMode: false,
			singleSelect: false,
			rownumbers:true,
			rowsPath:'Page_Grp',
			url:PJF.constants.DEFAULT_ACTION,
			queryParams:{
				'fwServiceId':'simpleTransaction',
				/*'fwTranId':'A0782T010-stm',//1026改造CMST00010->A0782T010
				'jsonData':PJF.util.json2str(param)*/
				'fwTranId':'A07824613-HF',
				'jsonData':PJF.util.json2str(sendA07824613Data)
			},
			columns :[[
			    {title : "",field:"checkbox",checkbox:true,align : 'center',width:40},
			    {title : "操作&nbsp;&nbsp;",field : "VchID",align : 'center',width:100,
					formatter : function(value, rowData, rowIndex) {
			            return '<a onclick="STM.corporateBill.previewLPByID(\'' + value
		                		+ '\');" ><img style="vertical-align:middle;height: .35rem" src="/ecpweb/page/stm/common/icon/previewCB.png"/></a>';
			        }
				},
				{title : "账号",field : "Btch_Vchr_Blg_AccNo",align : 'center',width:350},
				{title : "账户类型",field : "Acc_Tp_ID",align : 'center',width:100,
					formatter : function(value, rowData, rowIndex) {
						return Acc_Tp_ID_obj[value]
					}
				},
				{title : "起始时间",field : "Enqr_StDt",align : 'center',width:140},
				{title : "截止时间",field : "Enqr_CODt",align : 'center',width:140}, 
				{title : "页码",field : "Cur_Pg_CD",align : 'center',width:100},
				{title : "满页标识",field : "AcgBok_FlPg_Rplc_Ind",align : 'center',width:100,
					formatter : function(val, rowData, rowIndex) {return val=='1'?'满页':'未满页'}
				}
			]],
			loadFilter:function (respData) {
				if(null != respData && '' != respData && '00' != respData.BK_STATUS){
					STM.corporateBill.showErrorMsg(respData, '');
				}else{
					downLoadTimes = respData._COMMON.COMB.TOTAL_PAGE || downLoadTimes;//respData.Tot_Pg_Num || downLoadTimes;// 总页数 、接口改造 分页总数在COMB域
					console.log('总页数：' + downLoadTimes);
					totalNum = respData._COMMON.COMB.TOTAL_REC || totalNum;//totalNum = respData.Dtl_Tdnum || totalNum;// 总笔数
					console.log('总条数：' + totalNum);
					if(respData.Qry_GRP){
						for(var i = 0; i < respData.Qry_GRP.length; i++){
							var accType = respData.Qry_GRP[i].SgAcc_TpCd;// 账户类型
							var fullPageFlag = respData.Qry_GRP[i].AcgBok_FlPg_Rplc_Ind;// 满页标识
							var printFlag = respData.Qry_GRP[i].Prt_Ind;// 打印标识
							
							switch(accType)
							{
							case '1' :
								respData.Qry_GRP[i].SgAcc_TpCd = '活期';
								break;
							case '2' :
								respData.Qry_GRP[i].SgAcc_TpCd = '定期';
								break;
							case '3' :
								respData.Qry_GRP[i].SgAcc_TpCd = '贷款';
								break;
							case '4' :
								respData.Qry_GRP[i].SgAcc_TpCd = '财资';
								break;
							default :
								respData.Qry_GRP[i].SgAcc_TpCd = '';
							}
							
							switch(fullPageFlag){
							case '0':
								respData.Qry_GRP[i].AcgBok_FlPg_Rplc_Ind = '非满页';
								break;
							case '1':
								respData.Qry_GRP[i].AcgBok_FlPg_Rplc_Ind = '满页';
								break;
							default:
								respData.Qry_GRP[i].AcgBok_FlPg_Rplc_Ind = '';
							}
						}
					}
				}
				
				// @critical 先清空隐藏内容
				PJF.html.empty('ledgerPageNumber');
				if(data.condition){// 自定义打印
					PJF.html.append('ledgerPageNumber', '你当前有'+totalNum+'张满足条件的账页');
				}else{// 默认选择打印
					PJF.html.append('ledgerPageNumber', '你当前有'+totalNum+'张未打印的账页');
				}
				return respData;
	        },
            onCheckRow: function(idx, row) {
//            	if($this.selectInfo.length > 9){
//            		$this.ledgerPageDetailResult.unCheckRow(idx);
//            		STM.corporateBill.showPrintErrorMsg('打印选中同时只能勾选10条记录', null);
//            		return;
//            	}else{
                    if(!$this.selectInfo.some(function(v) {return v.VchID == row.VchID})) {
                        $this.selectInfo.push(row);
                    }
//            	}
            },
            onUnCheckRow: function(idx, row) {
                $this.selectInfo = $this.selectInfo.filter(function(v) {return v.VchID != row.VchID});

            },
            onCheckAll:function(idx, row){
                var allRows = $this.ledgerPageDetailResult.getAllRows();
                allRows.forEach(function(item, i) {
                    if(!$this.selectInfo.some(function(v) {return v.VchID == item.VchID})) {
                        $this.selectInfo.push(item);
                    }
                });
            },
            onUnCheckAll:function(idx, row){
                var allRows = $this.ledgerPageDetailResult.getAllRows();

                allRows.forEach(function(item, i) {
                    $this.selectInfo = $this.selectInfo.filter(function(v) {return v.VchID != item.VchID});
                });

            },
            onLoadSuccess: function() {
                if($this.selectInfo.length == 0) {
                    return;
                }
                var allRows = $this.ledgerPageDetailResult.getAllRows();
                allRows.forEach(function(v, i) {
                    if($this.selectInfo.some(function(x) {return x.VchID == v.VchID})) {
                        $this.ledgerPageDetailResult.checkRow(i);
                    }
                });
            }
        });
		//上一页
		var cb_prePage = new PJF.ui.linkButton({
			dom : 'cb_prePage',
			style: 'main',
			name: '上一页',
			onClick : function() {
			}
		});
		//下一页
		var cb_nextPage = new PJF.ui.linkButton({
			dom : 'cb_nextPage',
			style: 'main',
			name: '下一页',
			onClick : function() {
			}
		});
		// 添加分页条
		$this.ledgerPageDetailResult.addPaginationBar(cb_prePage, cb_nextPage, "desc");
        //打印账页明细
        /**
         * @function printLedgerPageDetail
         * @param {Object}slcData 页面选择的打印数据
         * 1.组装打印账页ID
         * 2.每次打印50账
         */
        function printLedgerPageDetail(slcData) {
            var vchIDs = '';
            if(slcData && (slcData.length > 0)){
				STM.corporateBill.loading = new PJF.ui.loading({msg:'业务正在处理中，请稍候……'});
                PDFPrintPath = new Array();//PDF下载路径
                registLPData = new Array();
                for(var i = 0; i < slcData.length; i++){
                    var registLP = {};// 用于打印登记
                    registLP.VchID = slcData[i].VchID;// 账页编号
                    registLP.Prt_Ind = slcData[i].Prt_Ind;// 打印状态
                    registLPData.push(registLP);
                    if(i < (slcData.length - 1)){
                        vchIDs += slcData[i].VchID + ',';
                    } else {
                        vchIDs += slcData[i].VchID;
                    }
                }
                console.log('账页明细的vchIDs='+vchIDs);
                var vchIDStrArray = new Array();
                if(slcData.length >10){
                    var vchIDsLENG = vchIDs.split(',');
                    var vchID10s = '';
                    for(var g = 0;g < vchIDsLENG.length; g++){
                        //if(g!='9' && g!='19' && g!= '29'&& g!= '39'){
                        if(parseInt((g+1)%10) != 0){
                            if(g+1 == vchIDsLENG.length){
                                vchID10s += vchIDsLENG[g];
                            }else{
                                vchID10s += vchIDsLENG[g]+ ',';
                            }
                        } else {
                            vchID10s += vchIDsLENG[g];
                        }
                        if(parseInt((g+1)%10) == 0){
                            vchIDStrArray.push(vchID10s);
                            vchID10s = '';
                        }
                        if(g==vchIDsLENG.length-1 && parseInt((vchIDsLENG.length)%10) !=0 ){
                            vchIDStrArray.push(vchID10s);
                            vchID10s = '';
                        }
                    }
                }else{
                    vchIDStrArray.push(vchIDs);
                }

                var xmlFilePaths = new Array();

                STM.corporateBill.LP_PRT_FEEAMT = 0.00;
                //getFilePath (vchIDStrArray, xmlFilePaths, 0);
                //@critical 每次打印50账
                var number =50;
                var allDataNew = STM.corporateBill.mergeSearchArray(number,vchIDStrArray,'ZYMX');
                getFilePath (allDataNew, xmlFilePaths, 0);
            }else{
                STM.corporateBill.showAlertMsg("请选择您需要打印的账页");
            }
        }

		var numLimit = 0;// @critical 限制打印条数
		var tipAlt = '';//@critical 限制打印提示
		var splitNum = 0;//@critical 截取长度，上送后端
		var loadTimes = 0;//@critical 打印全部，下载次数
		if(STM.corporateBill.ifCluOrg == true){
			numLimit = 100;
			tipAlt = '将为您先打印前100页，剩下打印条数请重新查询再打印';
			splitNum = 100;
			loadTimes = 10;
		}else{
			numLimit =200;
			tipAlt = '将为您先打印前200页，剩下打印条数请重新查询再打印';
			splitNum = 200;
			loadTimes = 20;
		}
		console.log("是否在范围内："+STM.corporateBill.ifCluOrg+",true-300条，false-600条:"+numLimit+"截取长度："+splitNum+"打印全部下载次数："+loadTimes);

		// 打印选中按钮
		var printBtn = new PJF.ui.linkButton({
			dom : 'printBtn',
			style : 'main',
			appendStyle : 'confirm',
			name : '打印选中',
			onClick : function() {
				STM.corporateBill.initParamBeforeOper();
				STM.corporateBill.printServiceTime = PJF.communication.getServerTime("yyyy-MM-dd HH:mm:ss");
				VchId_GrpALL = [];
				if(downLoadTimes != 0){
					var slcData = $this.selectInfo;
					if(slcData && (slcData.length > numLimit)){
                        new PJF.ui.messageBox({
                            title: "提示信息",
                            content: tipAlt,
                            buttonConfs: [{
                                name: '确认',
                                style: 'main',
                                width: 200,
                                height: 80,
                                appendStyle : 'confirm',
                                onClick: function () {
                                    //打印选中同时只能勾选100条记录,超过了则取前100条
                                    // slcData = slcData.slice(0,100);
                                    slcData = slcData.slice(0,splitNum);
                                    printLedgerPageDetail(slcData);
                                }
                            }, {
                                bgColor: 'rgb(121,198,30)',
                                name: '取消',
                                style: 'main',
                                width: 200,
                                height: 80,
                                onClick: function () {
                                }
                            }]
                        });
					}else{
					    printLedgerPageDetail(slcData);
                    }
				}else{
					STM.corporateBill.showAlertMsg("账页信息为空，不能打印");
				}
			}
		});
		
		// 打印全部按钮
		var printAllBtn = new PJF.ui.linkButton({
			dom : 'printAllBtn',
			style : 'main',
			appendStyle : 'confirm',
			name : '打印全部',
			onClick : function() {
				//@critical 点击打印全部初始参数
				STM.corporateBill.initParamBeforeOper();
				STM.corporateBill.balCurNum = 0;
				STM.corporateBill.printServiceTime = PJF.communication.getServerTime("yyyy-MM-dd HH:mm:ss");
				if(downLoadTimes == 0){
					STM.corporateBill.showAlertMsg("账页信息为空，不能打印全部");
					return;
				}
				STM.corporateBill.loading = new PJF.ui.loading({msg:'业务正在处理中，请稍候……'});
				if(downLoadTimes > loadTimes){// 大于100页提示不能打印重新选择查询范围
                    /*new PJF.ui.messageBox({
                        title: "提示信息",
                        content: '将为您先打印前200页，剩下打印条数请重新查询再打印',
                        buttonConfs: [{
                            name: '确认',
                            style: 'main',
                            width: 200,
                            height: 80,
                            appendStyle : 'confirm',
                            onClick: function () {
                                var vchIDStrArray = new Array();//存放账页编号列表
                                VchId_GrpALL = [];
                                PDFPrintPath = new Array();//PDF下载路径
                                registLPData = new Array();
                                //downLoadTimes = 10;//一次十条，一条一页，十页一个pdf文件
								//有多少页就去查询多少次
                                //downLoadTimes = 20;
                                getLedPageData(vchIDStrArray, 1);
                            }
                        }, {
                            bgColor: 'rgb(121,198,30)',
                            name: '取消',
                            style: 'main',
                            width: 200,
                            height: 80,
                            onClick: function () {
                            }
                        }]
                    });*/
					STM.corporateBill.priAllBL = true;
					var vchIDStrArray = new Array();//存放账页编号列表
					//VchId_GrpALL = [];//账页下载，打印的数组
					//PDFPrintPath = new Array();//PDF下载路径
					registLPData = new Array();
					//downLoadTimes = 10;//一次十条，一条一页，十页一个pdf文件
					//有多少页就去查询多少次
					//downLoadTimes = 20;
					getLedPageData(vchIDStrArray, 1);
				}else if(downLoadTimes != 0){
					var vchIDStrArray = new Array();// 存放账页编号列表
					//VchId_GrpALL = [];
					//PDFPrintPath = new Array();//PDF下载路径
					registLPData = new Array();
					getLedPageData(vchIDStrArray, 1);
				}
			}
		});
		
		// 返回按钮
		var returnBtn = new PJF.ui.linkButton({
			dom : 'returnBtn',
			style : 'main',
			name : '返回',
			onClick : function() {
				/*template.loadPage('subMenuPage','CPB20008');
				template.loadPage('ledgerPageDetailQueryHF',{
					accNo:param.Cst_AccNo
				});*/
				template.loadPage('entryIndex',{
					accNo:param.Cst_AccNo
				});
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
		
		// 自定义打印按钮
		var conditionBtn = new PJF.ui.linkButton({
			dom : 'conditionBtn',
			style : 'main',
			appendStyle : 'confirm',
			name : '自定义打印',
			onClick : function() {
				data.menu = 'ledgerPageDetailListHF';
				template.loadPage('ledgerPageDetailQueryHF', data);
			}
		});
    },
	destroy : function() {
	}
};