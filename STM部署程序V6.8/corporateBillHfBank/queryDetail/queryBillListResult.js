/**
 * @file 对账清单
 * @author ZhangAXiong
 * @version 1.0
 * create
 * Last Updated 2021-01-19
 * 1.在明细查询的财资账户下面
 * 2.对账清单的查询展示以及预览、paf打印
 */
function queryBillListResultHF() {

}

// 在prototype里渲染各个页面组件
queryBillListResultHF.prototype = {
	init : function(data) {
		if (!data) {
			return;
		}
		STM.corporateBill.Txn_CardNo = data.Txn_CardNo;
		
		PJF.html.content('acctNo',data.Cst_AccNo);//@critical 主账户账号
		PJF.html.content('acctName',data.Acc_AccNm);//@critical 主账户户名

		STM.corporateBill.jsonCMST00004.Vchr_Ctlg_No='02';
		STM.corporateBill.jsonCMST00004.prt_Ind='1';//@critical 0-非补打，1-补打

		var cbSum = 0;
		
		//@critical 预览、打印赋值
		STM.corporateBill.jsonCMST00014.CCBIns_ID = PJF.roleInfo.orgCode;/* PJF.orgInfo.instLevel1BranchId;*///建行机构编号
		STM.corporateBill.jsonCMST00014.Txn_CardNo = data.Txn_CardNo;
		STM.corporateBill.jsonCMST00014.Cst_AccNo = data.Cst_AccNo;
		
		var	fwTranId = 'A0782T013-stm';
		var	columns = [[
            {title : "",field:"checkbox",checkbox:true,align : 'center'},
			{
				title : '操作&nbsp;&nbsp;',
				field : 'opert',
			    width : 100,
			    align : 'right',
			    formatter : function(value, rowData, rowIndex) {
			        return '<a onclick="STM.corporateBill.previewBillList(\'' + rowData.VchID
			        		+ '\');" ><img style="vertical-align:middle;height: .35rem" src="/ecpweb/page/stm/common/icon/previewCB.png"/></a>';
			    }
			},
			{title : "交易日期",field : "Txn_Dt",align : 'center',width:140},
			{title : "账号",field : "Cst_AccNo",align : 'center',width:300 },
			{title : "币种",field : "Ccy_Nm",align : 'center',width:120},
			{title : "钞汇鉴别",field : "CshEx_Ind",align : 'center',width:80,
				formatter : function(value) {
					if(1 == value){
						return '钞';
					} else if(2 == value){
						return '汇';
					}
				}
			},
			{title : "打印次数",field : "Prt_Cnt",align : 'center',width:120 }
		]];
		
		data.TxCode = 'A0782T013';
		data.OPR_NO = PJF.otherInfo.devId, // 柜员号
		data.chanl_cust_no = '';
		
		var queryCB_grid = new PJF.ui.grid({
			dom:'queryCB_grid',
			width:'auto',
			height:570,
            totalPath:'_COMMON.COMB.TOTAL_REC',
			//currentPath:'Cur_Pg_CD',
			pageSize:'10',
			//pageNumberParamName:'Cur_Pg_CD',
			isAppendMode: false,
			rownumbers:true,
			singleSelect : false,
			rowsPath:'Qry_GRP',
			url:PJF.constants.DEFAULT_ACTION,
			queryParams:{
				'fwServiceId':'simpleTransaction',
				'fwTranId':fwTranId,
				'jsonData':PJF.util.json2str(data)
			},
			columns:columns,
			loadFilter:function (data) {
				if(null != data && '' != data && '00' != data.BK_STATUS){
					STM.corporateBill.showErrorMsg(data, '');
					return null;
				}
				cbSum = data._COMMON.COMB.TOTAL_REC;//总笔数
				return data;
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
		
		queryCB_grid.addPaginationBar(cb_prePage, cb_nextPage, "desc");
		
		// 返回按钮
		var returnBtn = new PJF.ui.linkButton({
			dom : 'returnBtn',
			style : 'main',
			name : '返回',
			onClick : function() {
				template.loadPage("queryBillListDetailHF",data);
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
				//@critical 清空预览内容
				PJF.html.empty('preview_content');
			}
		});



		// 打印选中按钮
		var printBtn = new PJF.ui.linkButton({
			dom : 'printBtn',
			style : 'main',
			appendStyle : 'confirm',
			name : '打印选中',
			onClick : function() {
				STM.corporateBill.printServiceTime = PJF.communication.getServerTime("yyyy-MM-dd HH:mm:ss");
				var slcData = queryCB_grid.getSelectedRows();
				var vchIDs = '';
				if(slcData){
					for(var i=0;i<slcData.length;i++){
						if(i < (slcData.length - 1)){
							vchIDs += slcData[i].VchID + ',';
						} else {
							vchIDs += slcData[i].VchID;
						}
					}
				}

				if('' == vchIDs){
					STM.corporateBill.showAlertMsg("请选择您需要打印的对账清单");
					//@critical 请选择您需要打印的回单
					PJF.communication.player.PlaySoundByUrl("app/corporateBill/02.wav");
					return;
				} else {
                    var VchId_Grp = [];
					//STM.corporateBill.jsonCMST00014.List_Val = vchIDs;
                    var idList = vchIDs.split(',')
                     for(var i in idList){
                         VchId_Grp.push({VchID:idList[i]});
                     }
                    STM.corporateBill.jsonCMST00014.VchId_Grp=VchId_Grp;
					STM.corporateBill.ValArray = new Array();
					STM.corporateBill.ValArray = VchId_Grp;
                    STM.corporateBill.jsonCMST00014.Fee_Ind="1";
                    STM.corporateBill.loading = new PJF.ui.loading({msg:'业务正在处理中，请稍候……'});
                    STM.corporateBill.jsonCMST00014.MsgRp_Prt_Tm =STM.corporateBill.printServiceTime||PJF.communication.getServerTime("yyyy-MM-dd HH:mm:ss");//打印时间
					STM.corporateBill.jsonCMST00014.OPR_NO = PJF.otherInfo.devId;
					//判断是否使用电子印章
					var conf = {};
					conf.Stmp_Bsn_Ctlg_ID = "001";//默认传001
					conf.Stmp_Blng_InsID = PJF.roleInfo.orgCode;
					conf.VchID = "MXDY0CCMS00000000000000000000003";//对账单
					conf.Mnplt_TpCd="03";//默认03：客户端查询
					STM.corporateBill.getElecChapter(conf,function(elec_flag){
						continuePrintChecked(VchId_Grp,elec_flag);
					});
				}
			}
		});

        /**
         * @function continuePrintChecked
         * @async
         * @param {Object} VchId_Grp 打印对账清单的凭证ID
         * @param {String} elec_flag 是否使用电子印章
         */
		function continuePrintChecked(VchId_Grp,elec_flag) {
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
					//判读下载文件是否存在
					var FILE_INFO = [{fileName:responseData._COMMON.FILE_LIST_PACK.FILE_INFO[0].FILE_NAME,pageNum:VchId_Grp.length}]
					/* var printFilePath = [];
                     if(FILE_INFO.length == 0 ){
                         STM.corporateBill.showPrintErrorMsg('明细打印文件不存在，下载失败', null);
                         return;
                     }
                     for(var i in FILE_INFO){
                         var fileName = FILE_INFO[0].FILE_NAME;// 文件全路径
                         var fileExistUrl = STM.corporateBill.existUrl + fileName;// 服务器上文件路径
                         var downUrl = STM.corporateBill.url + fileName;
                         var locUrl = STM.corporateBill.localUrl + fileName;
                         // 判断文件是否传送到服务器上
                         if(!fileName || !STM.corporateBill.isFileExist(fileExistUrl)){
                             STM.corporateBill.showPrintErrorMsg('回单系统返回文件不存在，下载失败', null);
                         }else{
                             PJF.util.simpleDownload(locUrl, downUrl, function(d){
                                 console.log("下载返回成功！！！" + PJF.util.json2str(d));
                                 if(d.success){//成功
                                     printFilePath.push(locUrl);
                                 }else{//失败
                                     STM.corporateBill.loading.destroy();
                                     console.log("回单文件循环第" + (i+1) + "次下载回调失败");
                                     STM.corporateBill.showPrintErrorMsg('回单文件下载回调失败', null);
                                 }
                             });

                         }
                     }*/
					//@critical 下载文件到本地并打印
					var htmlData = new Array();
					STM.corporateBill.createAllBillListHtml(FILE_INFO,responseData.Ths_FeeAmt,0,htmlData,elec_flag);
					/*console.log("对账清单（A0782T014-stm）文件下载交易成功：" + PJF.util.json2str(responseData));
                    var existFlag = false;
                    var fileExistUrl = STM.corporateBill.existUrl + STM.corporateBill.cutOutFilePath(responseData.File_Rte_FullNm);
                    console.log("对账清单（A0782T014-stm）文件下载交易成功：P2服务器存放地址：" + fileExistUrl);
                    PJF.communication.ajax({
                        url : fileExistUrl,
                        async : false,
                        success : function(data){
                            if(data.fileExists){
                                existFlag = true;
                            }
                        },
                        failure : function(data) {
                            STM.corporateBill.showPrintErrorMsg('判断文件是否存在出错', null);
                            return;
                        }
                    });

                    if(!existFlag){
                        console.log("对账清单（CMST00014-stm）文件下载交易成功：P2服务器没有对应的文件，交易成功，文件传输失败！");
                        STM.corporateBill.showPrintErrorMsg('明细打印文件不存在，下载失败', null);
                        return;
                    }

                    //STM.corporateBill.loading = new PJF.ui.loading({msg:'业务正在处理中，请稍候……'});
                    STM.corporateBill.printHtmlDataByCMST00014(slcData,responseData.Ths_FeeAmt);*/
				},
				failure : function(responseData) {
					STM.corporateBill.showErrorMsg(responseData, '打印对账清单明细出错！');
					if(STM.corporateBill.loading){
						STM.corporateBill.loading.destroy();
					}
				}
			});
		}
		var numLimit = 0;//@critical 限制打印条数
		var tipAlt = '';//@critical 限制打印提示
		if(STM.corporateBill.ifCluOrg == true){
			numLimit = 100;
			tipAlt = '将为您先打印前100页，剩下打印条数请重新查询再打印';
		}else{
			numLimit =200;
			tipAlt = '将为您先打印前200页，剩下打印条数请重新查询再打印';
		}
		console.log("是否在范围内："+STM.corporateBill.ifCluOrg+",true-300条，false-600条:"+numLimit);

		// 打印全部按钮
		var printAllBtn = new PJF.ui.linkButton({
			dom : 'printAllBtn',
			style : 'main',
			appendStyle : 'confirm',
			name : '打印全部',
			onClick : function() {
				STM.corporateBill.printServiceTime = PJF.communication.getServerTime("yyyy-MM-dd HH:mm:ss");
				if(0 == cbSum){
                    STM.corporateBill.showAlertMsg("当前账户没有可打印的对账清单!");
					return;
				}
				if(cbSum > numLimit){
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
								//cbSum = 100;
                                //todo 确认对账清单T013可否一次返回200条
                                //cbSum = 200;
								cbSum = numLimit;
								data._pagination = {'REC_IN_PAGE':cbSum,'PAGE_JUMP':1};
								PJF.communication.cpsJsonReq({
									fwServiceId : "simpleTransaction",
									fwTranId : "A0782T013-stm",
									jsonData : PJF.util.json2str(data),
									success : function(responseData) {
										if(responseData.Qry_GRP&&responseData.Qry_GRP.length>0){
											var printData = [];
											var vchIDs =[];
											for(var i in responseData.Qry_GRP){
												vchIDs.push({VchID:responseData.Qry_GRP[i].VchID});

												if(vchIDs.length == 10){
													printData.push({vchIDs:vchIDs});
													vchIDs = [];
												}
											}
											if(vchIDs.length>0){
												printData.push({vchIDs:vchIDs});
											}
											STM.corporateBill.ValArray=[];
											STM.corporateBill.loading = new PJF.ui.loading({msg:'业务正在处理中，请稍候……'});
											//STM.corporateBill.printAllBillList(printData,[],0,0.00);
                                            var number =50;
                                            var allDataNew = STM.corporateBill.mergeSearchArray(number,printData,'DZQD');
                                            STM.corporateBill.printAllBillList(allDataNew,[],0,0.00);
										}

									},
									failure : function(responseData) {
										STM.corporateBill.showErrorMsg(responseData, '打印出错！');
										return;
									}
								});
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
					var maxNo = 10;
					var confirmAll_Box = new PJF.ui.errorMessageBox({
						content : '请确认是否打印所有对账清单',
						buttonConfs : [ {
							name : '取消',
							style : 'main',
							onClick : function() {
								return;
							}
						}, {
							name : '确定',
							style : 'main',
							appendStyle : 'confirm',
							onClick : function() {
								/*STM.corporateBill.loading = new PJF.ui.loading({msg:'业务正在处理中，请稍候……'});
                                var times = (cbSum % maxNo == 0)?cbSum / maxNo:(Math.floor(cbSum / maxNo))+1;
                                var fileSum = (cbSum % 10 == 0)?cbSum / 10:(Math.floor(cbSum / 10))+1;
                                var vchIDs = '';
                                var allData = new Array();//30条数据一组;
                                STM.corporateBill.queryAndPrintAllBillListData(data, allData, vchIDs, times, 0, fileSum, 0);
                                //STM.corporateBill.queryAndPrintAllBillListData2(data, times, cbSum);*/
								data._pagination = {'REC_IN_PAGE':cbSum,'PAGE_JUMP':1};
								PJF.communication.cpsJsonReq({
									fwServiceId : "simpleTransaction",
									fwTranId : "A0782T013-stm",
									jsonData : PJF.util.json2str(data),
									success : function(responseData) {
										if(responseData.Qry_GRP&&responseData.Qry_GRP.length>0){
											var printData = [];
											var vchIDs =[];
											for(var i in responseData.Qry_GRP){
												vchIDs.push({VchID:responseData.Qry_GRP[i].VchID});

												if(vchIDs.length == 10){
													printData.push({vchIDs:vchIDs});
													vchIDs = [];
												}
											}
											if(vchIDs.length>0){
												printData.push({vchIDs:vchIDs});
											}
											STM.corporateBill.ValArray=[];
											STM.corporateBill.loading = new PJF.ui.loading({msg:'业务正在处理中，请稍候……'});
											//STM.corporateBill.printAllBillList(printData,[],0,0.00);
                                            var number =50;
                                            var allDataNew = STM.corporateBill.mergeSearchArray(number,printData,'DZQD');
                                            STM.corporateBill.printAllBillList(allDataNew,[],0,0.00);
										}

									},
									failure : function(responseData) {
										STM.corporateBill.showErrorMsg(responseData, '打印出错！');
										return;
									}
								});
							}
						}]
					});
				}
			}
		});

	},
	destroy : function() {
	}
}