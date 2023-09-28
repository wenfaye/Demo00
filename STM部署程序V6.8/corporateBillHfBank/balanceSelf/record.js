/**
 * @file  回签选择不相符明细页面
 * @author ZhangAXiong
 * @version 1.0
 * Create On
 * * Last Updated 2021-01-19
 * 1.选择不相符，进入不相符明细页面进行不相符内容填写
 * 2.不相符记录最多添加20行
 * 3.进行对账单回签
 */
function recordHF() {
}
var total = 0;
recordHF.prototype = {
		init : function(data) {
			if (!data) {
				//return;
			}
			
			// 返回按钮
			var returnBtn = new PJF.ui.linkButton({
				dom : 'returnBtn',
				style : 'main',
				name : '返回',
				onClick : function() {
				    //@ctritical 区分转STM回签还是正常回签对账单
				    if(data.pageFlg == '1'){
                        console.log("跳转进转STM未回签账单回签页面");
                        template.loadPage('unSignedBill',data.baseData);
                    }else{
                        template.loadPage('balanceSelfHF',data.baseData);
                    }
				}
			});
			var i=1;
			// @critical  增加一行按钮
			var addBtn = new PJF.ui.linkButton({
				dom : 'addBtn',
				style : 'main',
				appendStyle : 'confirm',
				name : '增加一行',
				onClick : function() {
					if(total > 19){
						STM.corporateBill.showAlertMsg("不符明细最多添加20行");
						return;
					}
					var newRow='<tr id="trId_' + i +'" style="line-height: 0.48rem;">' + 
								//'<td class="th_class">' + i +'</td>' + 
								'<td class="th_class">' + //时间
								'<span class="selectdate" id="startTime' + i + '"></span>' + 
								'<script>' +
									'var startTime' + i + ' = new PJF.ui.calendar({' +
										'dom : "startTime' + i + '",' +
										'width : 360' +
									'});'+
								'</script>' +
								'</td>' + 
								'<td class="th_class">' + //金额
								'<input style="font-size:0.25rem;margin-top:0.05rem;" id="money' + i + '" type="text" />' + 
								'<script>' +
									'var money' + i + ' = new PJF.ui.textfield({' +
										'dom : "money' + i + '",' +
										'width : 200,' + 
										'precision : 2,' + 
										'datatype : "money"' + 
									'});'+
								'</script>' +
								'</td>' + 
								'<td class="th_class">' + //凭证号
								'<input style="font-size:0.25rem;margin-top:0.05rem;" id="number' + i + '" type="text" />' + 
								'<script>' +
									'var number' + i + ' = new PJF.ui.textfield({' +
										'dom : "number' + i + '",' +
										'width : 200' + 
									'});'+
								'</script>' +
								'</td>' + 
								'<td class="th_class">' + //类型
								'<span id="type' + i + '"></span>' + 
								'<script>' +
									'var type' + i + ' = new PJF.ui.select({' +
										'dom : "type' + i + '",' +
										'data: [{desc: "--&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;", name: "-1"},{desc: "我方有银行方无", name: "0"},{desc: "银行方有我方无", name: "1"}],' + 
										'resizeFontSize : false,' +
										'width : 220,' +
										'onChange: function(){' + 
											'var tmp = type' + i + '.getValue();' + 
											'if("-1" == tmp){' + 
												'flag' + i + '.setData([{desc: "--", name: "-1"}]);' + 
												'flag' + i + '.setValue("-1");' +
											'}else if("0" == tmp){' + 
												'flag' + i + '.setData([{desc: "收", name: "0"},{desc: "付", name: "1"}]);' + 
												'flag' + i + '.setValue("0");' +
											'}else if("1" == tmp){' + 
												'flag' + i + '.setData([{desc: "借", name: "0"},{desc: "贷", name: "1"}]);'+
												'flag' + i + '.setValue("0");' +
											'}' + 
										'}' + 
									'});'+
								'</script>' +
								'</td>' + 
								'<td class="th_class">' + //借贷
								'<span id="flag' + i + '"></span>' + 
								'<script>' +
									'var flag' + i + ' = new PJF.ui.select({' +
										'dom : "flag' + i + '",' +
										'data: [{desc: "--", name: "-1"}],' + 
										'resizeFontSize : false,' +
										'width : 120' + 
									'});'+
								'</script>' +
								'</td>' + 
								'<td><a onclick="bill_delTr(' + i + ');"><img style="vertical-align:middle;height: .35rem" src="/ecpweb/page/stm/common/icon/bill_btn_del.png"/></a></td>'
							 '</tr>';
								
					$("#table_id").append(newRow);
					
					i++;
					total ++;
				}
			});
			
			// 确定按钮
			var confirmBtn = new PJF.ui.linkButton({
				dom : 'confirmBtn',
				style : 'main',
				appendStyle : 'confirm',
				name : '确定',
				onClick : function() {
					//var backVal = '';
					var count = 0;
					var trsfDetail = new Array();
					if(i > 1){
						var time ='';
						var money ='';
						var number ='';
						var type ='';
						var flag ='';
						for(var t=1; t<i; t++){
							if('undefined' != typeof eval('startTime' + t)){
								//time = eval('startTime' + t).getValue();
                                time =  PJF.util.formatDate(eval('startTime' + t).getValue(),"yyyyMMdd");
								money = eval('money' + t).getValue();
								number = eval('number' + t).getValue();
								type = eval('type' + t).getValue();
								flag = eval('flag' + t).getValue();
								
								if(time && money && number && type && flag && '-1'!=type && '-1'!=flag){
									//backVal += time + ',' + money + ',' + number + ',' + type + ',' + flag + ';';
									var row = {
										'TXN_NO':count + 1,// 不符行数（第几行）
										'TRAN_DATE':time,// 交易日期
										'TX_AMT':money,// 金额
										'REMARK':'',// 备注
										'DSCRP_CNTN':'',// 摘要
										'DOC_NO':number,// 凭证号
										'DOC_TYP':'',// 凭证类型
										'UNTALLY_TYPE':type,// 不平类型1 银行方有我方无 0 我方有银行方无
										'CR_COD':flag// 借贷标志:银行方有我方无时 0借1贷  我方有银行方无时 0收1付
									};
									
									trsfDetail.push(row);
									count ++;
								}
							}
						}
					}
					
					if(0 == count){
						STM.corporateBill.showAlertMsg("请至少输入一笔完整的不符明细信息");
						return;
					}
					
					var bfData = data.bfData;
					
					var tmpary = bfData.split('_');
					/*var record = [{
						'ACCT_NO':tmpary[2],// 账号
						'DEP_TYPE':tmpary[1],// 账单编号
						'BILL_NO':tmpary[0],// 账单编号
						'DETL_FLAG':tmpary[3],
						'ACC_FLAG':'2',// 回签结果0 所有未回签1 相符2 不相符3 所有已回签
						'CARD_CAD':data.Txn_CardNo + '|' + PJF.otherInfo.devId,// 设备号(账单正面图像路径)
						'MAX_NO':(count - 1),// 不符交易明细条数
						'Record_1':trsfDetail// 不符交易明细
					}];*/
					var Txn_CardNo = data.Txn_CardNo?data.Txn_CardNo:STM.corporateBill.Txn_CardNo;
                    var record = [{
                        'Cst_AccNo':tmpary[2],// 账号
                        'Acc_Tp_ID':tmpary[1],// 账户类型编号
                        'PdAr_ID':tmpary[0],// 产品合约编号
                        'Parm_Nm':tmpary[3],//册号/笔号/明细
                        'Rcncl_Rslt_Cd':'2',// 回签结果0 所有未回签1 相符2 不相符3 所有已回签
                        'Eqmt_ID': PJF.otherInfo.devId,// 设备号(账单正面图像路径)Txn_CardNo + '|' +
                        'MAX_NO':(count - 1),// 不符交易明细条数
                        'Detl_Record':trsfDetail// 不符交易明细
                    }];
					/*var param = {
							'Version':'01',// 信息格式版本
							'TxCode':'CMST00026',// 交易代码
							'chanl_cust_no':'STM',// 渠道客户号
							'SYS_EVT_TRACE_ID':PJF.otherInfo.SVC_ID,// 全局流水跟踪号
							'OPR_NO':PJF.otherInfo.devId//,// 操作员号
						};*/
                    var param = {};
					param.Acc_Record = record;
                    if(data.pageFlg == '1'){
                        param.OP_TYPE_CD = '1';//转STM回签，不送走老回签
                    }
					PJF.communication.cpsJsonReq({
						fwServiceId: 'simpleTransaction',
						//fwTranId: 'CMST00026-stm',A0782T024-stm
                        fwTranId: 'A0782T024-HF',
						async: false, //默认同步
						jsonData: PJF.util.json2str(param),
						success: function(resp) {
						    if(resp.Mnplt_StCd && resp.Mnplt_StCd == '01' ){
                                new PJF.ui.errorMessageBox({
                                    content : '尊敬的客户，您所选择的对账单已回签成功',
                                    buttonConfs : [ {
                                        name : '确定',
                                        style : 'main',
                                        appendStyle : 'confirm',
                                        onClick : function() {
                                            if(data.pageFlg == '1'){
                                                console.log("跳转进转STM未回签账单回签页面");
                                                template.loadPage('unSignedBill',data.baseData);
                                            }else{
                                                template.loadPage('balanceSelfHF',data.baseData);
                                            }
                                        }
                                    } ]
                                });
                            }else{
                                STM.corporateBill.showErrorMsg('对账单回签失败');
                                return;
                            }
						},
						failure: function(failData) {
							STM.corporateBill.showErrorMsg(failData, '对账单回签失败');
							return;
						}
					});
				}
			});

		},
		destroy : function() {
		}
};

/**
 * @function bill_delTr
 * @param {String} no id号
 * 删除一行
 */
function bill_delTr(no){
	$("#trId_" + no).remove();
	total --;
}