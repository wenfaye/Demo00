/**
 * @file 回单打印查询结果页面
 * @author ZhangAXiong
 * @version 1.0
 * Create On
 * Last Updated 2021-01-19
 * 1.“打印选中”打印选中的回单，一页三十条
 * 2.“打印全部”打印查询的全部回单，一次打印150条，600条以循环，支持循环打印
 * 3. 预览可预览要打印的回单
 */
function printCBDetailHF() {

}
var previewData = {};
function get_CRCYCD_fan() {return [{name:'人民币',desc:'人民币 ( 01 )'},{name:'英镑',desc:'英镑 ( 12 )'},{name:'港币',desc:'港币 ( 13 )'},{name:'美元',desc:'美元 ( 14 )'},{name:'瑞士法郎',desc:'瑞士法郎 ( 15 )'},{name:'新加坡元',desc:'新加坡元 ( 18 )'},{name:'日元',desc:'日元 ( 27 )'},{name:'加元',desc:'加元 ( 28 )'},{name:'澳元',desc:'澳元 ( 29 )'},{name:'欧元',desc:'欧元 ( 38 )'}]}
var CCY_Obj = get_CRCYCD_fan();

// 在prototype里渲染各个页面组件
printCBDetailHF.prototype = {
	$this : this,
	init : function(data) {
		if (!data) {
			data = {};
		}
		
		STM.corporateBill.Txn_CardNo = data.Txn_CardNo?data.Txn_CardNo:null;
		STM.corporateBill.jsonCMST00004.prt_Ind='0';//@critical 0-非补打，1-补打
		
		var titles = [];
		var backgroundColors = [];
		var htmlDomIds = [];
		if(1 == data.SgAcc_TpCd){//@critical 普通账户才有附件打印
			/*titles = [ '回 单 打 印', '附 件 打 印' ];
			backgroundColors = [ '#0066b1', '#0066b1' ];
			htmlDomIds = [ 'bill_div', 'attachment_div' ];*/
			titles = [ '回 单 打 印'];
			backgroundColors = [ '#0066b1'];
			htmlDomIds = [ 'bill_div'];
		} else if (4 == data.SgAcc_TpCd){
			titles = [ '回 单 打 印'];
			backgroundColors = [ '#0066b1'];
			htmlDomIds = [ 'bill_div'];
		}
		
		//@critical开始时间为当前时间往前92天
		var lastDate = new Date().setDate(new Date().getDate() - 92);
		data.begin_date = PJF.util.formatDate(new Date(lastDate),"yyyyMMdd");
		data.end_date = PJF.util.formatDate(new Date(),"yyyyMMdd");
		
		if(!data.indexSelect){
			data.indexSelect = 0;
			data.flag = 0;
		} else {
			data.flag = 1;
		}
		
		$this = this;
        $this.selectInfo=[];//@critical 打印选中回单数
		$this.affixSelectInfo=[];//@critical 打印选中附件数
		$this.cbSum = 0;//回单总数
		$this.affixSum = 0;//附件总数
		var tab = new PJF.ui.tab({
			dom : 'cb_tab',
			titles : titles,
			backgroundColors : backgroundColors,
			iconUrl : [],
			htmlDomIds : htmlDomIds,
			height : 640,
			domLoadedCallBack : function(){
				if(0 == data.flag){
					$this.createBillList(data);
				} else if(1 == data.flag){
					if(1 == data.SgAcc_TpCd){
						$this.createAttachmentList(data);
					}
				}
			},
			onSelect:function(index){
				if(0 == index){
					data.indexSelect = 0;
					document.getElementById('bill_count').style.display = '';
					document.getElementById('attachment_count').style.display = 'none';
					if($this.printCB_grid){
						$this.printCB_grid.resize();
					} else {
						$this.createBillList(data);
					}
				}
				if(1 == data.SgAcc_TpCd && 1 == index){
					data.indexSelect = 1;
					document.getElementById('bill_count').style.display = 'none';
					document.getElementById('attachment_count').style.display = '';
					if($this.printAttachment_grid){
						$this.printAttachment_grid.resize();
					} else {
						$this.createAttachmentList(data);
					}
				}
			}
		});
		
		if(0 == data.flag){
			tab.selectTab('回 单 打 印');
		} else if(1 == data.flag){
			tab.selectTab('附 件 打 印');
		}
		
		// 返回按钮
		var returnBtn = new PJF.ui.linkButton({
			dom : 'returnBtn',
			style : 'main',
			name : '返回',
			onClick : function() {
				/*
				 *if(data.prevMenu){
					var cardData = {};
					cardData.Txn_CardNo = data.Txn_CardNo?data.Txn_CardNo:'';
					cardData.ptData = data.ptData;
					cardData.czData = data.czData;
					cardData.menu = data.menu;
					cardData.accNo = data.accNo ? data.accNo:data.conditionData.Btch_Vchr_Blg_AccNo;
					if(data.conditionData){
						cardData.condition = 1;
						cardData.StDt = data.conditionData.Enqr_StDt;
						cardData.CODt = data.conditionData.Enqr_CODt;
					}
					template.loadPage(data.prevMenu,cardData);
					//template.loadPage(data.prevMenu,data);
				} else {
					//template.loadPage('subMenuPage','CPB20008');
					template.loadPage('entryIndex',{
						accNo:data.accNo
					});
					
				}*/
				template.loadPage('entryIndex',{
					accNo:data.accNo ? data.accNo:data.conditionData.Btch_Vchr_Blg_AccNo
				});
			}
		});
		var numLimit = 0;//@critical 限制打印条数
		var tipAlt = '';//@critical 限制打印提示
		var splitNum = 0;//@critical 截取长度，上送后端
		if(STM.corporateBill.ifCluOrg == true){
			numLimit = 300;
			tipAlt = '将为您先打印前100页，剩下打印条数请重新查询再打印';
			splitNum = 10;
		}else{
			numLimit = 600;
			tipAlt = '将为您先打印前200页，剩下打印条数请重新查询再打印';
			splitNum = 20;
		}
		console.log("是否在范围内："+STM.corporateBill.ifCluOrg+",true-300条，false-600条:"+numLimit+"截取长度："+splitNum);
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
		
		// 打印按钮
		var printBtn = new PJF.ui.linkButton({
			dom : 'printBtn',
			style : 'main',
			appendStyle : 'confirm',
			name : '打印选中',
			onClick : function() {
				STM.corporateBill.remainCBList = null;
				STM.corporateBill.printCBCurTime = 0;
				STM.corporateBill.printRemainCB = false;
				STM.corporateBill.initParamBeforeOper();
				if(STM.corporateBill){
					STM.corporateBill.ledgerReg = 0;
				}
				if(0 == data.indexSelect){//回单
					
					var slcData = $this.selectInfo;
					
					if(slcData.length>3 && (slcData.length%3 != 0)){
						var lastNum = slcData.length - slcData.length%3;
						var remainCBList = slcData.slice(lastNum);
						slcData = slcData.slice(0,lastNum);
						
						var remainVchIDs = '';
						for(var i=0;i<remainCBList.length;i++){
							if(i < (remainCBList.length - 1)){
								remainVchIDs += remainCBList[i].VchID + ',';
							} else {
								remainVchIDs += remainCBList[i].VchID;
							}
                          }
						STM.corporateBill.remainCBList = remainVchIDs;
						console.log(197,slcData.length,remainVchIDs);
					}
					
					var vchIDs = '';
                    var allData = [];
					if(slcData){
						for(var i=0;i<slcData.length;i++){
							if(i < (slcData.length - 1)){
								vchIDs += slcData[i].VchID + ',';
							} else {
								vchIDs += slcData[i].VchID;
							}
							if(slcData.length >30 && (i+1)%30 == 0){
                                vchIDs = vchIDs.substring(0,vchIDs.length - 1);
								allData.push({vchIDs:vchIDs});
								console.log(213,allData.length,vchIDs.split(',').length);
								vchIDs="";
                            }
						}
					}
					
                    if(vchIDs!=""){
                        allData.push({vchIDs:vchIDs});
                    }
					
					//后面Rprnt_Cnt应该会改掉
                    var prntCntBollean = slcData.some(function(item){
                    	var printCnt = Number(item.Rprnt_Cnt);
                    	return printCnt > 0
                    });
                    
					if(!slcData.length){
						STM.corporateBill.showAlertMsg("请选择您需要打印的回单");
						//请选择您需要打印的回单
						PJF.communication.player.PlaySoundByUrl("app/corporateBill/02.wav");
						return;
					}else if(prntCntBollean){
						STM.corporateBill.showAlertMsg('选择的回单打印次数已超限，请使用回单补打功能进行打印');
						PJF.communication.player.PlaySoundByUrl("app/corporateBill/02.wav");
					} else {
						

                        //@critical打印超过100页之后弹出提示，点击确定继续打印

						if(slcData.length > numLimit){
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
										//allData = allData.slice(0,10);//一组30条，截取10组
                                        allData = allData.slice(0,splitNum);//一组30条，截取20组
										console.log("截取的数据："+PJF.util.json2str(allData));
										var prepareData = [];
										STM.corporateBill.ValArray = new Array();
										STM.corporateBill.loading = new PJF.ui.loading({msg:'业务正在处理中，请稍候……'});
										STM.corporateBill.printServiceTime = PJF.communication.getServerTime("yyyy-MM-dd HH:mm:ss");
										// STM.corporateBill.printAllCB(allData, prepareData, 0, 0.00, 0);
										//var number = 150;//150笔回单，一个pdf50页
										var number = 30;
										var allDataNew = STM.corporateBill.mergeSearchArray(number,allData,'');
										STM.corporateBill.printAllCB(allDataNew, prepareData, 0, 0.00, 0);
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
							var prepareData = [];
							STM.corporateBill.ValArray = new Array();
							STM.corporateBill.loading = new PJF.ui.loading({msg:'业务正在处理中，请稍候……'});
							STM.corporateBill.printServiceTime = PJF.communication.getServerTime("yyyy-MM-dd HH:mm:ss");
							//STM.corporateBill.printAllCB(allData, prepareData, 0, 0.00, 0);
							//var number = 150;
							var number = 30;
							var allDataNew = STM.corporateBill.mergeSearchArray(number,allData,'');
							console.log(282,number,allData.length,allDataNew.length);
							console.log(283,PJF.util.json2str(allData),PJF.util.json2str(allDataNew));
							STM.corporateBill.printAllCB(allDataNew, prepareData, 0, 0.00, 0);
						}
					}
					/*
					STM.corporateBill.jsonCMST00004.Vchr_Ctlg_No='00';
					
					var slcData = $this.selectInfo;
					var vchIDs = '';
                    var allData = [];
					if(slcData){
						for(var i=0;i<slcData.length;i++){
							if(i < (slcData.length - 1)){
								vchIDs += slcData[i].VchID + ',';
							} else {
								vchIDs += slcData[i].VchID;
							}
                            if(31 == vchIDs.split(",").length){
                                vchIDs = vchIDs.substring(0,vchIDs.length - 1);
                                allData.push({vchIDs:vchIDs});
                                vchIDs="";
                            }
						}
					}
                    if(vchIDs!=""){
                        allData.push({vchIDs:vchIDs});
                    }
                    
                    //后面Rprnt_Cnt应该会改掉
                    var prntCntBollean = slcData.some(function(item){
                    	return item.Rprnt_Cnt > 0
                    });
                    
					if(slcData.length ==0){
						STM.corporateBill.showAlertMsg("请选择您需要打印的回单");
						//请选择您需要打印的回单
						PJF.communication.player.PlaySoundByUrl("app/corporateBill/02.wav");
						return;
					}else if(prntCntBollean){
						STM.corporateBill.showAlertMsg('选择的回单打印次数已超限，请使用回单补打功能进行打印');
						PJF.communication.player.PlaySoundByUrl("app/corporateBill/02.wav");
						return;
					} else {
						

                        //@critical打印超过100页之后弹出提示，点击确定继续打印

						if(slcData.length > numLimit){
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
										//allData = allData.slice(0,10);//一组30条，截取10组
                                        allData = allData.slice(0,splitNum);//一组30条，截取20组
										console.log("截取的数据："+PJF.util.json2str(allData));
										var prepareData = [];
										STM.corporateBill.ValArray = new Array();
										STM.corporateBill.loading = new PJF.ui.loading({msg:'业务正在处理中，请稍候……'});
										STM.corporateBill.printServiceTime = PJF.communication.getServerTime("yyyy-MM-dd HH:mm:ss");
										// STM.corporateBill.printAllCB(allData, prepareData, 0, 0.00, 0);
										var number = 150;//150笔回单，一个pdf50页
										var allDataNew = STM.corporateBill.mergeSearchArray(number,allData,'');
										STM.corporateBill.printAllCB(allDataNew, prepareData, 0, 0.00, 0);
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
							var prepareData = [];
							STM.corporateBill.ValArray = new Array();
							STM.corporateBill.loading = new PJF.ui.loading({msg:'业务正在处理中，请稍候……'});
							STM.corporateBill.printServiceTime = PJF.communication.getServerTime("yyyy-MM-dd HH:mm:ss");
							//STM.corporateBill.printAllCB(allData, prepareData, 0, 0.00, 0);
							var number = 150;
							var allDataNew = STM.corporateBill.mergeSearchArray(number,allData,'');
							STM.corporateBill.printAllCB(allDataNew, prepareData, 0, 0.00, 0);
						}
					}*/
				} else if(1 == data.indexSelect) {//附件
					STM.corporateBill.jsonCMST00004.Vchr_Ctlg_No='03';
					
					var slcData = $this.affixSelectInfo;
					var vchIDs = '';
                    var allData = [];
					var warnFlag = false;
					if(slcData){
						for(var i=0;i<slcData.length;i++){
							if(i < (slcData.length - 1)){
								vchIDs += slcData[i].VchID + ',';
							} else {
                                vchIDs += slcData[i].VchID;
							}
							if(slcData.length >30 && (i+1)%30 == 0){
                                vchIDs = vchIDs.substring(0,vchIDs.length - 1);
								allData.push({vchIDs:vchIDs});
								console.log(394,allData.length,vchIDs.split(',').length);
								vchIDs="";
                            }
						}
					}
                    if(vchIDs!=""){
                        allData.push({vchIDs:vchIDs});
                    }
					/*if('' == vchIDs && warnFlag){
						STM.corporateBill.showAlertMsg("附件打印目前只支持pos跟分行特色");
						return;
					}*/
					
					if(slcData.length ==0){
						STM.corporateBill.showAlertMsg("请选择您需要打印的附件");
						//请选择您需要打印的附件
						return;
					} else {
						/*if(warnFlag){
							var confirm_Box = new PJF.ui.errorMessageBox({
								content : '附件打印目前只支持pos跟分行特色，请确认是否继续打印',
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
										vchIDs = vchIDs.substring(0,vchIDs.length - 1);
										STM.corporateBill.jsonCMST00016.List_Val = vchIDs;
										
										STM.corporateBill.ValArray = new Array();
										STM.corporateBill.ValArray = STM.corporateBill.ValArray.concat(vchIDs.split(','));
										
										STM.corporateBill.printAttachment(STM.corporateBill.jsonCMST00016);
									}
								}]
							});
						} else {
							vchIDs = vchIDs.substring(0,vchIDs.length - 1);
							STM.corporateBill.jsonCMST00016.List_Val = vchIDs;
							
							STM.corporateBill.ValArray = new Array();
							STM.corporateBill.ValArray = STM.corporateBill.ValArray.concat(vchIDs.split(','));
							
							STM.corporateBill.printAttachment(STM.corporateBill.jsonCMST00016);
						}*/
                        /*vchIDs = vchIDs.substring(0,vchIDs.length - 1);
                        STM.corporateBill.jsonCMST00016.List_Val = vchIDs;

                        STM.corporateBill.ValArray = new Array();
                        STM.corporateBill.ValArray = STM.corporateBill.ValArray.concat(vchIDs.split(','));

                        STM.corporateBill.printAttachment(STM.corporateBill.jsonCMST00016);*/
						if(slcData.length > numLimit){
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
										//allData = allData.slice(0,10);//一组30条，截取10组
                                        allData = allData.slice(0,splitNum);//一组30条，截取20组
										console.log("截取的数据："+PJF.util.json2str(allData));
										var prepareData = [];
										STM.corporateBill.ValArray = new Array();
										STM.corporateBill.loading = new PJF.ui.loading({msg:'业务正在处理中，请稍候……'});
										STM.corporateBill.printServiceTime = PJF.communication.getServerTime("yyyy-MM-dd HH:mm:ss");
										//STM.corporateBill.printAllAttachment(allData, prepareData, 0, 0.00,0);
										var number =150;
										var allDataNew = STM.corporateBill.mergeSearchArray(number,allData,'');
										STM.corporateBill.printAllAttachment(allDataNew, prepareData, 0, 0.00,0);
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
							var prepareData = [];
							STM.corporateBill.ValArray = new Array();
							STM.corporateBill.loading = new PJF.ui.loading({msg:'业务正在处理中，请稍候……'});
							STM.corporateBill.printServiceTime = PJF.communication.getServerTime("yyyy-MM-dd HH:mm:ss");
							//STM.corporateBill.printAllAttachment(allData, prepareData, 0, 0.00,0);
							var number =150;
							var allDataNew = STM.corporateBill.mergeSearchArray(number,allData,'');
							STM.corporateBill.printAllAttachment(allDataNew, prepareData, 0, 0.00,0);
						}
					}
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
				STM.corporateBill.remainCBList = null;
				STM.corporateBill.printRemainCB = false;
				STM.corporateBill.printCBCurTime = 0;
				STM.corporateBill.initParamBeforeOper();
				if(STM.corporateBill){
					STM.corporateBill.ledgerReg = 0;
				}
				if(0 == data.indexSelect){//回单
					STM.corporateBill.jsonCMST00004.Vchr_Ctlg_No='00';
					
					//后面Rprnt_Cnt应该会改掉
					var prntCntBollean = false;
					if($this.printCB_grid.getAllRows().length){
						prntCntBollean = $this.printCB_grid.getAllRows().some(function(item){
	                    	return item.Rprnt_Cnt > 0
	                    });
					}
                    /*var prntCntBollean = slcData.some(function(item){
                    	return item.Rprnt_Cnt > 0
                    });*/
                    
					if(0 == $this.cbSum){
						return;
					}
					if(prntCntBollean){
						STM.corporateBill.showAlertMsg('选择的回单打印次数已超限，请使用回单补打功能进行打印');
						PJF.communication.player.PlaySoundByUrl("app/corporateBill/02.wav");
					}else{
					if($this.cbSum  > numLimit){
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
								    var maxNo = 30;
									STM.corporateBill.loading = new PJF.ui.loading({msg:'业务正在处理中，请稍候……'});
									//超过300条，则只请求10次就行，一次30条。
									//$this.cbSum = 300;
									//回单超过200页支持继续打印，以总数$this.cbSum去请求T002,然后截取T002返回的凭证，循环打印
									$this.cbSum = 600;
									var times = ($this.cbSum % maxNo == 0)?$this.cbSum / maxNo:(Math.floor($this.cbSum / maxNo))+1;
									var fileSum = ($this.cbSum % 30 == 0)?$this.cbSum / 30:(Math.floor($this.cbSum / 30))+1;
									var vchIDs = '';
									var allData = new Array();//30条数据一组;
									STM.corporateBill.printServiceTime = PJF.communication.getServerTime("yyyy-MM-dd HH:mm:ss");
									STM.corporateBill.queryAndPrintAllData($this.jsonCMST00002, allData, vchIDs, times, 0, fileSum, 0);
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
						STM.corporateBill.priAllCB = true;
						STM.corporateBill.totalNum = $this.cbSum;
                        var maxNo = 30;
						STM.corporateBill.loading = new PJF.ui.loading({msg:'业务正在处理中，请稍候……'});
						//@critical 超过300条，则只请求10次就行，一次30条。
						//$this.cbSum = 300;
						//@critical todo 回单超过200页支持继续打印，以总数$this.cbSum去请求T002,然后截取T002返回的凭证，循环打印
						//$this.cbSum = 600;
						var times = ($this.cbSum % maxNo == 0)?$this.cbSum / maxNo:(Math.floor($this.cbSum / maxNo))+1;
						console.log(577,$this.cbSum,times);
						var fileSum = ($this.cbSum % 30 == 0)?$this.cbSum / 30:(Math.floor($this.cbSum / 30))+1;
						var vchIDs = '';
						var allData = new Array();//30条数据一组;
						STM.corporateBill.printServiceTime = PJF.communication.getServerTime("yyyy-MM-dd HH:mm:ss");
						STM.corporateBill.queryAndPrintAllData($this.jsonCMST00002, allData, vchIDs, times, 0, fileSum, 0,data.conditionData);
					}else{
						var maxNo = 30;
						STM.corporateBill.loading = new PJF.ui.loading({msg:'业务正在处理中，请稍候……'});
						var times = ($this.cbSum % maxNo == 0)?$this.cbSum / maxNo:(Math.floor($this.cbSum / maxNo))+1;
						var fileSum = ($this.cbSum % 30 == 0)?$this.cbSum / 30:(Math.floor($this.cbSum / 30))+1;
						var vchIDs = '';
						var allData = new Array();//30条数据一组;
						STM.corporateBill.printServiceTime = PJF.communication.getServerTime("yyyy-MM-dd HH:mm:ss");
						STM.corporateBill.queryAndPrintAllData($this.jsonCMST00002, allData, vchIDs, times, 0, fileSum, 0,data.conditionData);
					}
				}
				} else if(1 == data.indexSelect){//附件
					/*var confirm_Box = new PJF.ui.errorMessageBox({
						content : '附件打印目前只支持pos跟分行特色，请确认是否继续打印',
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
								STM.corporateBill.jsonCMST00004.Vchr_Ctlg_No='03';
								
								if(0 == $this.affixSum){
									return;
								}
								
								if($this.affixSum > 100){
									STM.corporateBill.showAlertMsg(STM.corporateBill.limitDecs);
									return;
								}
								
								var maxNo = 10;
								
								STM.corporateBill.loading = new PJF.ui.loading({msg:'业务正在处理中，请稍候……'});
								var times = ($this.affixSum % maxNo == 0)?$this.affixSum / maxNo:(Math.floor($this.affixSum / maxNo))+1;
								var fileSum = ($this.affixSum % 30 == 0)?$this.affixSum / 30:(Math.floor($this.affixSum / 30))+1;
								var vchIDs = '';
								var allData = new Array();//30条数据一组;
								STM.corporateBill.queryAndPrintAllAttachment($this.jsonCMST00015, allData, vchIDs, times, 0, fileSum, 0);
							}
						}]
					});*/
                    STM.corporateBill.jsonCMST00004.Vchr_Ctlg_No='03';

                    if(0 == $this.affixSum){
                        return;
                    }
					if($this.affixSum  > numLimit){
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
                                    var maxNo = 30;
									STM.corporateBill.loading = new PJF.ui.loading({msg:'业务正在处理中，请稍候……'});
									//@critical超过300条，则只请求10次就行，一次30条。
									//$this.affixSum = 300;
                                    $this.affixSum = numLimit;
									var times = ($this.affixSum % maxNo == 0)?$this.affixSum / maxNo:(Math.floor($this.affixSum / maxNo))+1;
									var fileSum = ($this.affixSum % 30 == 0)?$this.affixSum / 30:(Math.floor($this.affixSum / 30))+1;
									var vchIDs = '';
									var allData = new Array();//30条数据一组;
									STM.corporateBill.printServiceTime = PJF.communication.getServerTime("yyyy-MM-dd HH:mm:ss");
									STM.corporateBill.queryAndPrintAllAttachment($this.jsonCMST00015, allData, vchIDs, times, 0, fileSum, 0);
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
						var maxNo = 30;
						STM.corporateBill.loading = new PJF.ui.loading({msg:'业务正在处理中，请稍候……'});
						var times = ($this.affixSum % maxNo == 0)?$this.affixSum / maxNo:(Math.floor($this.affixSum / maxNo))+1;
						var fileSum = ($this.affixSum % 30 == 0)?$this.affixSum / 30:(Math.floor($this.affixSum / 30))+1;
						var vchIDs = '';
						var allData = new Array();//30条数据一组;
						STM.corporateBill.printServiceTime = PJF.communication.getServerTime("yyyy-MM-dd HH:mm:ss");
						STM.corporateBill.queryAndPrintAllAttachment($this.jsonCMST00015, allData, vchIDs, times, 0, fileSum, 0);
					}
				}
			}
		});
		
		// 自定义打印按钮
		var conditionBtn = new PJF.ui.linkButton({
			dom : 'conditionBtn',
			style : 'main',
			appendStyle : 'confirm',
			name : '自定义打印',
			onClick : function() {
				data.menu = 'printCBDetailHF';
				if(data && data.conditionData && data.conditionData.Btch_Vchr_Blg_AccNo && data.conditionData.Btch_Vchr_Blg_AccNo.length){
					data.accNo = data.conditionData.Btch_Vchr_Blg_AccNo;
					//data.Txn_CardNo = data.conditionData.Btch_Vchr_Blg_AccNo;
					data.Txn_CardNo = '';
				}
				template.loadPage('printCBCondtionHF', data);
			}
		});
	},
    /**
     * @function createBillList
     * @param {Object}data.Txn_CardNo 账号
     * @param {Object}data.SgAcc_TpCd 是否签约自助对账设备
     * @param {Object}data.begin_date 起始日期
     * @param {Object}data.end_date 结束日期
     * 调用A0782T002回单查询交易查询回单
     */
	createBillList:function(data){
		$this.jsonCMST00002 = {};
		$this.jsonCMST00002.TxCode = 'A0782T002';
		$this.jsonCMST00002.OPR_NO = PJF.otherInfo.devId; // 柜员号
		$this.jsonCMST00002.chanl_cust_no = '';
		$this.jsonCMST00002.CCBIns_ID = PJF.roleInfo.orgCode;
		$this.jsonCMST00002.Txn_CardNo = data.Txn_CardNo;
		$this.jsonCMST00002.SgAcc_TpCd = data.SgAcc_TpCd;
		$this.jsonCMST00002.StDt = data.begin_date;
		$this.jsonCMST00002.CODt = data.end_date;
		$this.jsonCMST00002.prt_Ind = '0';//0-非补打，1-补打
		//$this.jsonCMST00002.Cur_Pg_CD = '1';//当前页码
		
		if(data.conditionData && 0 == data.flag){
			//$this.jsonCMST00002.SgAcc_TpCd = '1';
			$this.jsonCMST00002.Cst_AccNo = data.conditionData.Cst_AccNo;
			$this.jsonCMST00002.StDt = data.conditionData.StDt;
			$this.jsonCMST00002.CODt = data.conditionData.CODt;
			$this.jsonCMST00002.Beg_Amt = data.conditionData.Beg_Amt;
			$this.jsonCMST00002.CtOf_Amt = data.conditionData.CtOf_Amt;
		}
		
		
		var sendData = data.conditionData;
		
		$this.printCB_grid = new PJF.ui.grid({
			dom:'printCB_grid',
			width:'auto',
			height:530,
			totalPath:'_COMMON.COMB.TOTAL_REC',
			//currentPath:'Cur_Pg_CD',
			//pageNumberParamName:'Cur_Pg_CD',
            pageSize:"30",
			isAppendMode: false,
			rownumbers:true,
			singleSelect : false,
			rowsPath:'Hd_Grp',
			url: PJF.constants.DEFAULT_ACTION,
			queryParams:{
				'fwServiceId':'simpleTransaction',
				//'fwTranId':'A0782T002-stm',
				'fwTranId':'A07824601-HF',
				'jsonData':PJF.util.json2str(sendData)//$this.jsonCMST00002
			},
			columns :[[
				{title : "",field:"checkbox",checkbox:true,align : 'center'},
				{
					title : '操作&nbsp;&nbsp;',
					field : 'opert',
			        width : 100,
			        align : 'right',
			        formatter : function(value, rowData, rowIndex) {
			            return '<a onclick="STM.corporateBill.previewCB(\'' + rowData.VchID
		                		+ '\');" ><img style="vertical-align:middle;height: .35rem" src="/ecpweb/page/stm/common/icon/previewCB.png"/></a>';
			        }
				},
				{title : "交易日期",field : "Txn_Dt",align : 'center',width:140},
				{title : "账号",field : "Btch_Vchr_Blg_AccNo",align : 'center',width:350 },
				{title : "币种",field : "CcyCd",align : 'center',width:120},
				{title : "借贷",field : "DbtCrDrcCd",align : 'center',width:80},
				{title : "金额",field : "Dep_TxnAmt",align : 'center',width:150},
				{title : "凭证种类",field : "Vchr_Ctlg_Nm",align : 'center',width:180 },
				{title : "摘要",field : "Use_Dsc",align : 'center',width:130 },
				{title : "打印次数",field : "Rprnt_Cnt",align : 'center',width:130,
					formatter : function(val) {
						return val;
				}
					
				/*
					formatter : function(val) {
						if(val){
							return val + 1;
						} else {
							return val;
						}
					}*/
				},
				{title : "回单编号",field : "VchID",align : 'center',hidden:true}
			]],
			loadFilter:function (data) {
				if(null != data && '' != data && '00' != data.BK_STATUS){
					STM.corporateBill.showErrorMsg(data, '');
				} else {
					$this.cbSum = data._COMMON.COMB.TOTAL_REC;
					PJF.html.content('cbCount', '您当前有' + data._COMMON.COMB.TOTAL_REC + '条回单未打印');
				}
				return data;
	        },
            onCheckRow: function(idx, row) {
                if(!$this.selectInfo.some(function(v) {return v.VchID == row.VchID})) {
                    $this.selectInfo.push(row);
                }
            },
            onUnCheckRow: function(idx, row) {
                $this.selectInfo = $this.selectInfo.filter(function(v) {return v.VchID != row.VchID});

            },
            onCheckAll:function(idx, row){
                console.log($this.printCB_grid.getAllRows());
                console.log(row);
                var allRows = $this.printCB_grid.getAllRows();
                allRows.forEach(function(item, i) {
                    if(!$this.selectInfo.some(function(v) {return v.VchID == item.VchID})) {
                        $this.selectInfo.push(item);
                    }
                });
            },
            onUnCheckAll:function(idx, row){
                var allRows = $this.printCB_grid.getAllRows();

                allRows.forEach(function(item, i) {
                    $this.selectInfo = $this.selectInfo.filter(function(v) {return v.VchID != item.VchID});
                });

            },
            onLoadSuccess: function() {
                if($this.selectInfo.length == 0) {
                    return;
                }
                var allRows = $this.printCB_grid.getAllRows();
                allRows.forEach(function(v, i) {
                    if($this.selectInfo.some(function(x) {return x.VchID == v.VchID})) {
                        $this.printCB_grid.checkRow(i);
                    }
                });
            }
		});
		
		//上一页
		var cb_prePage = new PJF.ui.linkButton({
			dom : 'cb_prePage',
			style: 'main',
			name: '上一页',
			onClick : function() {}
		});
		//下一页
		var cb_nextPage = new PJF.ui.linkButton({
			dom : 'cb_nextPage',
			style: 'main',
			name: '下一页',
			onClick : function() {}
		});
		
		$this.printCB_grid.addPaginationBar(cb_prePage, cb_nextPage, "desc");
	},
    /**
     * @function createAttachmentList
     * @param {Object}data.Txn_CardNo 账号
     * @param {Object}data.begin_date 起始日期
     * @param {Object}data.end_date 结束日期
     * 调用A0782T015附件查询交易查询附件
     */
	createAttachmentList:function(data){
		$this.jsonCMST00015 = {};
		$this.jsonCMST00015.TxCode = 'CMST00015';
		$this.jsonCMST00015.OPR_NO = PJF.otherInfo.devId; // 柜员号
		$this.jsonCMST00015.chanl_cust_no = '';
		$this.jsonCMST00015.CCBIns_ID = PJF.roleInfo.orgCode;
		$this.jsonCMST00015.Txn_CardNo = data.Txn_CardNo;
		$this.jsonCMST00015.StDt = data.begin_date;
		$this.jsonCMST00015.CODt = data.end_date;
		$this.jsonCMST00015.Prt_Ind = '0';//0-非补打，1-补打
		//$this.jsonCMST00015.Cur_Pg_CD = '1';//当前页码
		
		if(data.conditionData && 1 == data.flag){
			$this.jsonCMST00015.Cst_AccNo = data.conditionData.Cst_AccNo;
			$this.jsonCMST00015.StDt = data.conditionData.StDt;
			$this.jsonCMST00015.CODt = data.conditionData.CODt;
			$this.jsonCMST00015.Beg_Amt = data.conditionData.Beg_Amt;
			$this.jsonCMST00015.CtOf_Amt = data.conditionData.CtOf_Amt;
		}
		/*
		$this.printAttachment_grid = new PJF.ui.grid({
			dom:'printAttachment_grid',
			width:'auto',
			height:530,
			totalPath:'_COMMON.COMB.TOTAL_REC',
			//currentPath:'Cur_Pg_CD',
			//pageNumberParamName:'Cur_Pg_CD',
            pageSize:"30",
			isAppendMode: false,
			rownumbers:true,
			singleSelect : false,
			rowsPath:'Qry_GRP',
			url: PJF.constants.DEFAULT_ACTION,
			queryParams:{
				'fwServiceId':'simpleTransaction',
                'fwTranId':'A0782T015-stm',   //11.16 CMST00015=>A0782T015
				'jsonData':PJF.util.json2str($this.jsonCMST00015)
			},
			columns :[[
				{title : "",field:"checkbox",checkbox:true,align : 'center'},
				{
					title : '操作&nbsp;&nbsp;',
					field : 'opert',
			        width : 100,
			        align : 'right',
			        formatter : function(value, rowData, rowIndex) {
			            return '<a onclick="STM.corporateBill.previewAttachment(\'' + rowData.VchID
		                		+ '\');" ><img style="vertical-align:middle;height: .35rem" src="/ecpweb/page/stm/common/icon/previewCB.png"/></a>';

			        }
				},
				{title : "交易日期",field : "Txn_Dt",align : 'center',width:140},
				{title : "账号",field : "Cst_AccNo",align : 'center',width:350 },
				{title : "借贷",field : "DbtCrDrcCd",align : 'center',width:80,
					formatter : function(value) {
						if(1 == value){
							return '借';
						} else if(2 == value){
							return '贷';
						}
					}
				},
				{title : "金额",field : "TxnAmt",align : 'center',width:150},
				{title : "凭证种类",field : "Vchr_Ctlg_Nm",align : 'center',width:180 },
				{title : "独立附件",field : "Atch_Ind",align : 'center',width:80,
					formatter : function(value) {
						if(0 == value){
							return '否';
						} else if(1 == value){
							return '是';
						}
					}},
				{title : "回单编号",field : "VchID",align : 'center',hidden:true}
			]],
			loadFilter:function (data) {
				if(null != data && '' != data && '00' != data.BK_STATUS){
					STM.corporateBill.showErrorMsg(data, '');
				} else {
					$this.affixSum = data._COMMON.COMB.TOTAL_REC;
					PJF.html.content('attachmentCount', '您当前有' + data._COMMON.COMB.TOTAL_REC + '条回单附件未打印');
					
					/*var array = new Array();
					if(data.Qry_GRP){
						if(data.Record.length){
							for(var i=0;i<data.Qry_GRP.length;i++){
								if(data.Qry_GRP[i].VchID){
									array.push(data.Qry_GRP[i]);
								}
							}
							data.Qry_GRP = array;
						}
					}
				}
				return data;
	        },
            onCheckRow: function(idx, row) {
                if(!$this.affixSelectInfo.some(function(v) {return v.VchID == row.VchID})) {
                    $this.affixSelectInfo.push(row);
                }
            },
            onUnCheckRow: function(idx, row) {
                $this.affixSelectInfo = $this.affixSelectInfo.filter(function(v) {return v.VchID != row.VchID});

            },
            onCheckAll:function(idx, row){
                var allRows = $this.printAttachment_grid.getAllRows();
                allRows.forEach(function(item, i) {
                    if(!$this.affixSelectInfo.some(function(v) {return v.VchID == item.VchID})) {
                        $this.affixSelectInfo.push(item);
                    }
                });
            },
            onUnCheckAll:function(idx, row){
                var allRows = $this.printAttachment_grid.getAllRows();

                allRows.forEach(function(item, i) {
                    $this.affixSelectInfo = $this.affixSelectInfo.filter(function(v) {return v.VchID != item.VchID});
                });

            },
            onLoadSuccess: function() {
                if($this.affixSelectInfo.length == 0) {
                    return;
                }
                var allRows = $this.printAttachment_grid.getAllRows();
                allRows.forEach(function(v, i) {
                    if($this.affixSelectInfo.some(function(x) {return x.VchID == v.VchID})) {
                        $this.printAttachment_grid.checkRow(i);
                    }
                });
            }
		});
		
		//上一页
		var attachment_prePage = new PJF.ui.linkButton({
			dom : 'attachment_prePage',
			style: 'main',
			name: '上一页',
			onClick : function() {
				
			}
		});
		//下一页
		var attachment_nextPage = new PJF.ui.linkButton({
			dom : 'attachment_nextPage',
			style: 'main',
			name: '下一页',
			onClick : function() {
			}
		});
		
		$this.printAttachment_grid.addPaginationBar(attachment_prePage, attachment_nextPage, "attachment_desc");
		*/
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
	},
	destroy : function() {
	}
}