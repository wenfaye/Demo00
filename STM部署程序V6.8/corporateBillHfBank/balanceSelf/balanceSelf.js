/**
 * @file  对账单查询结果显示
 * @author ZhangAxiong
 * @version 1.0
 * * Last Updated 2021-01-18
 * 1.未回签/已回签对账单查询结果进行展示
 * 2.未回签对账单选择相应的回签结果（相符/不相符）进行回签
 * 3.已回签对账单进行结果的回显
 * 4.已回签的对账单可以点击“预览并打印”按钮进行预览，在预览页面进行打印
 */
function balanceSelfHF() {
}
var currBtn = '';// @critical 当前按钮
var curPage = '1';// @critical 当前页
var Txn_CardNo = '';// @critical 卡号
var jsonData = {};// @critical 请求参数
var baseData = {};// @critical 本页原始数据
var hqData = '';//
var accNo = '';
balanceSelfHF.prototype = {
		init : function(data) {
			console.log('line21');
			data = data || {};
			accNo = data.accNo?data.accNo:STM.corporateBill.curAccount;
			//PJF.html.content('acctName','尊敬的客户');//主账户户名
			
			baseData = data;
			STM.corporateBill.Txn_CardNo = accNo;
			// @critical 卡号
			Txn_CardNo = data.Txn_CardNo?data.Txn_CardNo:STM.corporateBill.Txn_CardNo;
			console.log(30,Txn_CardNo);
			//STM.corporateBill.Txn_CardNo = null;
			//按钮颜色初始化....begin....
			var btn1Color = 'rgb(59,157,245)';
			var btn2Color = 'rgb(59,157,245)';
			var btn3Color = 'rgb(59,157,245)';
			
			if(data.btnId){
				var tmp = data.btnId + 'Color';
				eval(tmp + " = 'rgb(82,150,47)'");
				currBtn = data.btnId;
			} else {
				btn1Color = 'rgb(82,150,47)';
				currBtn = 'btn1';
			}
			
			/*console.log(btn1Color);
			console.log(btn2Color);
			console.log(btn3Color);*/
			//按钮颜色初始化....end....
            /*
                20200521注释记录
                1.此部分功能按照单账号进行分页，一页9条。
                2.全部未回签账单查询功能会显示全部的账号，里面按照单账号进行分页，第一页显示此账号的9条，其余下一页显示。
                3.全部未回签账单查询功能，由于共用同一个grid,所以分页参数9对于多账号不起作用，所有的数据没有一页9条显示而已。
                20200731备注---修改为新接口后，分页按照所有账号9条来分
             */
			
			var btn1 = new PJF.ui.linkButton({
		        dom: 'btn1',
		        //style: 'small',
		        name: '全部未回签<br>账单查询',
		        fontSize: '20',
		        btnBgColor: btn1Color,
		        onClick: function() {
					data.btnId = 'btn1';
					data.targetFlag = '0';
		        	template.loadPage('emptyHF',data);
		        }
			});
			
			var btn2 = new PJF.ui.linkButton({
		        dom: 'btn2',
		        //style: 'small',
		        name: '按条件查询<br>未回签账单',
		        fontSize: '20',
		        btnBgColor: btn2Color,
		        onClick: function() {
		        	data.curPage = curPage;
		        	template.loadPage("queryNoSignDetailHF",data);
		        }
			});
			
			var btn3 = new PJF.ui.linkButton({
		        dom: 'btn3',
		        //style: 'small',
		        name: '已回签账单查<br>询打印或修改',
		        fontSize: '20',
		        btnBgColor: btn3Color,
		        onClick: function() {
		        	data.curPage = curPage;
		        	template.loadPage("querySignedDetailHF",data);
		        }
			});
			
			var win;
			var btn4 = new PJF.ui.linkButton({
		        dom: 'btn4',
		        //style: 'small',
		        name: '操作说明',
		        fontSize: '25',
		        btnBgColor: 'rgb(59,157,245)',
		        onClick: function() {
		        	win = win || new PJF.ui.window({
                        dom: 'explain_id',
                        id: 'explain_id',
                        width: '1234',
                        height: '868',
                        top: "1",
                        left: "1",
                        href: '/ecpweb/page/stm/corporateBillNew/balanceSelf/explain.html',
                        onLoad: function() {
                        	explainClose.bindClickHandler(function(){
								win.hide();
								document.getElementById('content_id').style.display = '';
                        	});
                        }
                    });
		        	win.show();
		        	document.getElementById('content_id').style.display = 'none';
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
			
			var columns = [[]];
			
			if(data.btnId && 'btn3' == data.btnId){// @critical 已回签列表
				if(data.selectFuc && '1' == data.selectFuc){// @critical 预览打印
					/*columns = [[
						{title : "",field:"checkbox",checkbox:true,align : 'center'},
						{title : "账单编号",field : "BILL_NO",align : 'center',width:300},
						{title : "账号",field : "ACCT_NO",align : 'center',width:300 },
						{title : "账户类别",field : "DEP_TYPE",align : 'center',width:120,
							formatter : function(value, rowData) {
								return STM.corporateBill.getDepType(value);
							}
						},
						{title : "余额截止日",field : "BILL_DATE",align : 'center',width:180 }
					]];*/
					columns = [[
						{title : "",field:"checkbox",checkbox:true,align : 'center'},
						{title : "账单编号",field : "PdAr_ID",align : 'center',width:300},
						{title : "账号",field : "Cst_AccNo",align : 'center',width:300 },
						{title : "账户类别",field : "Acc_Tp_ID",align : 'center',width:120,
							formatter : function(value, rowData) {
								return STM.corporateBill.getDepType(value);
							}
						},
						{title : "余额截止日",field : "Rcncl_Dt",align : 'center',width:180 }
						/*{title : "回单状态",field : "Cur_Pcsg_StCd",align : 'center',width:180,
							formatter : function(value, rowData,rowIndex) {
								var tmp = rowData.PdAr_ID + '_' + rowData.Acc_Tp_ID + '_' + rowData.Cst_AccNo + '_' + rowData.Parm_Nm;
								if(value == '009003'){
									return '<input type="checkbox" value="1" style="height:.25rem;width:.25rem;vertical-align: middle;" checked="checked" disabled="disabled" '
									+ ' name="' + tmp + '" id="' + tmp
									+ '_3"/>&nbsp;相符&nbsp;<input type="checkbox" style="height:.25rem;width:.25rem;vertical-align: middle;" disabled="disabled" value="2" '
									+ ' id="' + tmp + '_4"/>&nbsp;不符';
								}else if(value == '009004'){
									return '<input type="checkbox" value="1" style="height:.25rem;width:.25rem;vertical-align: middle;" disabled="disabled" onclick="showStcdBox(\''
									+ tmp + '\',\'2\')" name="' + tmp + '" id="' + tmp
									+ '_3"/>&nbsp;相符&nbsp;<input type="checkbox" style="height:.25rem;width:.25rem;vertical-align: middle;" disabled="disabled" checked="checked" value="2" onclick="showStcdBox(\''
									+ tmp + '\',\'2\')" id="' + tmp + '_4"/>&nbsp;不符';
								}
							}
						}*/
					]];
				}else if (data.selectFuc && '2' == data.selectFuc){// @critical 回签修改
					/*columns = [[
						{title : "账单编号",field : "BILL_NO",align : 'center',width:300},
						{title : "账号",field : "ACCT_NO",align : 'center',width:300 },
						{title : "子账号",field : "DETL_FLAG",align : 'center',width:80 },
						{title : "类型",field : "DEP_TYPE",align : 'center',width:80,
							formatter : function(value, rowData) {
								return STM.corporateBill.getDepType(value);
								/!*var bak='';
								if('1' == value){
									bak = '活期';
								} else if('2' == value){
									bak = '定期';
								} else if('3' == value){
									bak = '贷款';
								}
								return bak;*!/
							}
						},
						{title : "账单日",field : "BILL_DATE",align : 'center',width:120 },
						{title : "余额",field : "CURR_BAL",align : 'center',width:150},
						{title : "余额核对",field : "BILL_2DCODE",align : 'center',width:180,
							formatter : function(value, rowData) {
								var tmp = rowData.BILL_NO + '_' + rowData.DEP_TYPE + '_' + rowData.ACCT_NO + '_' + rowData.DETL_FLAG;
								
								if('1' == rowData.ACC_FLAG){
									return '<input type="checkbox" value="1" style="height:.25rem;width:.25rem;vertical-align: middle;" checked="checked" disabled="disabled" onclick="checkDetail(\'' 
									+ tmp + '\',\'2\')" name="' + tmp + '" id="' + tmp 
									+ '_1"/>&nbsp;相符&nbsp;<input type="checkbox" style="height:.25rem;width:.25rem;vertical-align: middle;" disabled="disabled" value="2" onclick="checkDetail(\'' 
									+ tmp + '\',\'2\')" id="' + tmp + '_2"/>&nbsp;不符';
								} else {
									return '<input type="checkbox" value="1" style="height:.25rem;width:.25rem;vertical-align: middle;" onclick="checkDetail(\'' 
									+ tmp + '\',\'2\')" name="' + tmp + '" id="' + tmp 
									+ '_1"/>&nbsp;相符&nbsp;<input type="checkbox" style="height:.25rem;width:.25rem;vertical-align: middle;" disabled="disabled" checked="checked" value="2" onclick="checkDetail(\'' 
									+ tmp + '\',\'2\')" id="' + tmp + '_2"/>&nbsp;不符';
								}
								
							}
						},
						{title : "明细",field : "opert",align : 'center',width:120,
							formatter : function(value, rowData) {
								return '<a onclick="queryDetail(\'' + rowData.BILL_DATE + '_' + rowData.ACCT_NO + '_' + rowData.DEP_TYPE + '_' + rowData.ACCT_NAME + '\')" ><img style="vertical-align:middle;height: .35rem" src="/ecpweb/page/stm/common/icon/bill_btn_query.png"/></a>';
							}
						}
					]];*/
					columns = [[
						{title : "账单编号",field : "PdAr_ID",align : 'center',width:300},
						{title : "账号",field : "Cst_AccNo",align : 'center',width:300 },
						{title : "子账号",field : "Parm_Nm",align : 'center',width:200},
						{title : "类型",field : "Acc_Tp_ID",align : 'center',width:80,
							formatter : function(value, rowData) {
								return STM.corporateBill.getDepType(value);
								/*var bak='';
								if('1' == value){
									bak = '活期';
								} else if('2' == value){
									bak = '定期';
								} else if('3' == value){
									bak = '贷款';
								}
								return bak;*/
							}
						},
						{title : "账单日",field : "Rcncl_Dt",align : 'center',width:120 },
						{title : "余额",field : "Rglr_PnAmt",align : 'center',width:150},
						{title : "余额核对",field : "Exst_Stm_PD_Id_CD",align : 'center',width:180,
							formatter : function(value, rowData) {
								var tmp = rowData.PdAr_ID + '_' + rowData.Acc_Tp_ID + '_' + rowData.Cst_AccNo + '_' + rowData.Parm_Nm;
								// @critical 已回签相符
								if('1' == rowData.Cur_Pcsg_StCd){
									return '<input type="checkbox" value="1" style="height:.25rem;width:.25rem;vertical-align: middle;" checked="checked" disabled="disabled" onclick="checkDetail(\''
										+ tmp + '\',\'2\')" name="' + tmp + '" id="' + tmp
										+ '_1"/>&nbsp;相符&nbsp;<input type="checkbox" style="height:.25rem;width:.25rem;vertical-align: middle;" disabled="disabled" value="2" onclick="checkDetail(\''
										+ tmp + '\',\'2\')" id="' + tmp + '_2"/>&nbsp;不符';
								} else {
									return '<input type="checkbox" value="1" style="height:.25rem;width:.25rem;vertical-align: middle;" onclick="checkDetail(\''
										+ tmp + '\',\'2\')" name="' + tmp + '" id="' + tmp
										+ '_1"/>&nbsp;相符&nbsp;<input type="checkbox" style="height:.25rem;width:.25rem;vertical-align: middle;" disabled="disabled" checked="checked" value="2" onclick="checkDetail(\''
										+ tmp + '\',\'2\')" id="' + tmp + '_2"/>&nbsp;不符';
								}

							}
						},
						/*{title : "回单状态",field : "Cur_Pcsg_StCd",align : 'center',width:180,
							formatter : function(value, rowData,rowIndex) {
								var tmp = rowData.PdAr_ID + '_' + rowData.Acc_Tp_ID + '_' + rowData.Cst_AccNo + '_' + rowData.Parm_Nm;
								if(value == '009003'){
									return '<input type="checkbox" value="1" style="height:.25rem;width:.25rem;vertical-align: middle;" checked="checked" disabled="disabled" '
									+ ' name="' + tmp + '" id="' + tmp
									+ '_3"/>&nbsp;相符&nbsp;<input type="checkbox" style="height:.25rem;width:.25rem;vertical-align: middle;" disabled="disabled" value="2" '
									+ ' id="' + tmp + '_4"/>&nbsp;不符';
								}else if(value == '009004'){
									return '<input type="checkbox" value="1" style="height:.25rem;width:.25rem;vertical-align: middle;" disabled="disabled" onclick="showStcdBox(\''
									+ tmp + '\',\'2\')" name="' + tmp + '" id="' + tmp
									+ '_3"/>&nbsp;相符&nbsp;<input type="checkbox" style="height:.25rem;width:.25rem;vertical-align: middle;" disabled="disabled" checked="checked" value="2" onclick="showStcdBox(\''
									+ tmp + '\',\'2\')" id="' + tmp + '_4"/>&nbsp;不符';
								}
							}
						},*/
						{title : "明细",field : "opert",align : 'center',width:120,
							formatter : function(value, rowData) {
								//return '<a onclick="queryDetail(\'' + rowData.Rcncl_Dt + '_' + rowData.Cst_AccNo + '_' + rowData.Acc_Tp_ID + '_' + rowData.Cst_Nm + '\')" ><img style="vertical-align:middle;height: .35rem" src="/ecpweb/page/stm/common/icon/bill_btn_query.png"/></a>';
							
								return '<a onclick="showDetail(\'' + rowData.VchID + '\')" ><img style="vertical-align:middle;height: .35rem" src="/ecpweb/page/stm/common/icon/bill_btn_query.png"/></a>';
								}
						}
					]];
				}
			} else {// @critical 未回签列表
				/*columns = [[
					{title : "账单编号",field : "BILL_NO",align : 'center',width:300},
					{title : "账号",field : "ACCT_NO",align : 'center',width:300 },
					{title : "子账号",field : "DETL_FLAG",align : 'center',width:80 },
					{title : "类型",field : "DEP_TYPE",align : 'center',width:80,
						formatter : function(value, rowData) {
							return STM.corporateBill.getDepType(value);
						}
					},
					{title : "账单日",field : "BILL_DATE",align : 'center',width:120 },
					{title : "余额",field : "CURR_BAL",align : 'center',width:150},
					{title : "余额核对",field : "BILL_2DCODE",align : 'center',width:180,
						formatter : function(value, rowData) {
							var tmp = rowData.BILL_NO + '_' + rowData.DEP_TYPE + '_' + rowData.ACCT_NO + '_' + rowData.DETL_FLAG;
							
							return '<input type="checkbox" value="1" style="height:.25rem;width:.25rem;vertical-align: middle;" onclick="checkDetail(\'' 
									+ tmp + '\',\'1\')" name="' + tmp + '" id="' + tmp 
									+ '_1"/>&nbsp;相符&nbsp;<input type="checkbox" style="height:.25rem;width:.25rem;vertical-align: middle;" value="2" onclick="checkDetail(\'' 
									+ tmp + '\',\'1\')" id="' + tmp + '_2"/>&nbsp;不符';
						}
					},
					{title : "明细",field : "opert",align : 'center',width:120,
						formatter : function(value, rowData) {
							return '<a onclick="queryDetail(\'' + rowData.BILL_DATE + '_' + rowData.ACCT_NO + '_' + rowData.DEP_TYPE + '_' + rowData.ACCT_NAME + '\')" ><img style="vertical-align:middle;height: .35rem" src="/ecpweb/page/stm/common/icon/bill_btn_query.png"/></a>';
						}
					}
				]];*/
				columns = [[
					{title : "账单编号",field : "PdAr_ID",align : 'center',width:300},
					{title : "账号",field : "Cst_AccNo",align : 'center',width:300 },
					{title : "子账号",field : "Parm_Nm",align : 'center',width:200 },
					{title : "类型",field : "Acc_Tp_ID",align : 'center',width:80,
						formatter : function(value, rowData) {
							return STM.corporateBill.getDepType(value);
						}
					},
					{title : "账单日",field : "Rcncl_Dt",align : 'center',width:120 },
					{title : "余额",field : "Rglr_PnAmt",align : 'center',width:150},
					{title : "余额核对",field : "Exst_Stm_PD_Id_CD",align : 'center',width:180,
						formatter : function(value, rowData) {
							var tmp = rowData.PdAr_ID + '_' + rowData.Acc_Tp_ID + '_' + rowData.Cst_AccNo + '_' + rowData.Parm_Nm;

							return '<input type="checkbox" value="1" style="height:.25rem;width:.25rem;vertical-align: middle;" onclick="checkDetail(\''
								+ tmp + '\',\'1\')" name="' + tmp + '" id="' + tmp
								+ '_1"/>&nbsp;相符&nbsp;<input type="checkbox" style="height:.25rem;width:.25rem;vertical-align: middle;" value="2" onclick="checkDetail(\''
								+ tmp + '\',\'1\')" id="' + tmp + '_2"/>&nbsp;不符';
						}
					},
					{title : "明细",field : "opert",align : 'center',width:120,
						formatter : function(value, rowData) {
							//return '<a onclick="queryDetail(\'' + rowData.Rcncl_Dt + '_' + rowData.Cst_AccNo + '_' + rowData.Acc_Tp_ID + '_' + rowData.Cst_Nm + '\')" ><img style="vertical-align:middle;height: .35rem" src="/ecpweb/page/stm/common/icon/bill_btn_query.png"/></a>';
							return '<a onclick="showDetail(\'' + rowData.VchID + '\')" ><img style="vertical-align:middle;height: .35rem" src="/ecpweb/page/stm/common/icon/bill_btn_query.png"/></a>';
						}
					}
				]];
			}
			
			// @critical 封装请求参数
			packageData(data);
			
			var queryCB_grid = new PJF.ui.grid({
				dom:'queryCB_grid',
				width:1000,
				height:520,
				//totalPath:'TOT_PAGE_NUM',
				//currentPath:'PAGE_NO',
				totalPath:'_COMMON.COMB.TOTAL_REC',// @critical 多页查询总笔数
				currentPath:'_COMMON.COMB.CURR_TOTAL_PAGE',// @critical 多页查询当前页数
				pageSize:'9',
				//pageNumberParamName:'Cur_Pg_CD',
				isAppendMode: false,
				rownumbers:false,
				singleSelect:false,
				rowsPath:'Bill_Record', //Sign_Grp
				url:PJF.constants.DEFAULT_ACTION,
				queryParams:{
					'fwServiceId':'simpleTransaction',
					//'fwTranId':'CMST00024-stm',A07824611 A0782T023-stm
					'fwTranId':'A0782T023-HF',
					'jsonData':PJF.util.json2str(jsonData)
				},
				columns:columns,
				/*onBeforeLoad : function(param) {
					var jsonData = param.jsonData;
					// 请求第几页
					//var PAGE_JUMP = jsonData._pagination.PAGE_JUMP;
					//console.log(PAGE_JUMP);
					//请求交易参数jsonData,
					if(data.jsonData && data.jsonData._pagination.PAGE_JUMP > 1){
						jsonData._pagination.PAGE_JUMP = data.jsonData._pagination.PAGE_JUMP;
						data.jsonData._pagination.PAGE_JUMP = '1';
					}

					param.jsonData = jsonData;
				},*/
				loadFilter:function (data) {
					if(null != data && '' != data && '00' != data.BK_STATUS){
						STM.corporateBill.showErrorMsg(data, '');
						data=[];
					}
					//console.log("CMST00024loadFilter");
					console.log("A0782T023loadFilter:"+PJF.util.json2str(data));
					//currBtn=btn3时，需要全局跟踪号
					if(currBtn == "btn3"){
						if(data && data._COMMON){
							STM.corporateBill.balanceSelfNo = data._COMMON.SYS_EVT_TRACE_ID;
						}
					}
					//返回的都是已签约的，所以无需再判断
					/*if(data.RESP_MESG && data.RESP_MESG.indexOf('ST1001') > -1){//ST1001未签约自助对账
						STM.corporateBill.showAlertMsg("该账号尚未签约自助对账功能，请选择其他账号");
						data=[];
					}*/


					//curPage = data.PAGE_NO;//当前页
					//回首页，赋值不要了
					/*if(data && data._COMMON && data._COMMON.COMB){
						curPage =data._COMMON.COMB.CURR_TOTAL_PAGE;
					}*/
				/*	if(data.Record){
						if(data.Record.length){
							PJF.html.content('acctName','客户名称： ' + data.Record[0].ACCT_NAME);//主账户户名
							var ay = new Array();
							for(var i=0;i<data.Record.length;i++){
								if(data.Record[i].BILL_NO){
									ay.push(data.Record[i]);
								}
							}
							data.Record = ay;
						}
					}*/
					if(data.Bill_Record){
						if(data.Bill_Record.length){
							PJF.html.content('acctName','客户名称： ' + data.Bill_Record[0].Cst_Nm);//主账户户名
							var ay = new Array();
							for(var i=0;i<data.Bill_Record.length;i++){
								if(data.Bill_Record[i].PdAr_ID){
									ay.push(data.Bill_Record[i]);
								}
							}
							data.Bill_Record = ay;
						}
					}
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
					/*template.loadPage('subMenuPage','CPB20008');
					if(data.menu){
						template.loadPage(data.menu,data);
					}else{
						template.loadPage('entryIndex',{accNo:data.accNo});
					}*/
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
					// @critical 清空预览内容
					PJF.html.empty('preview_content');
				}
			});
			
			var preview_printBtn = new PJF.ui.linkButton({
				dom : 'preview_printBtn',
				style : 'main',
				appendStyle : 'confirm',
				name : '打印',
				onClick : function() {
					$("#HQZD_img_id").attr('height','80');
					var htmlPath = PJF.util.saveHtml("preview_content");
					console.log("自助对账htmlPath："+htmlPath);
					console.log("是否使用电子印章STM.corporateBill.ifUseChapter："+STM.corporateBill.ifUseChapter);
					PJF.stm.HDP.preparePrinter({}, function(prepareRes){
						if('1' == prepareRes.status){
							var startArgs={};
							startArgs.iTotalPaperNum=1;
							startArgs.iSlotType=3;
							if(STM.corporateBill.ifUseChapter == 1){
								startArgs.iChapterType=6;// @critical 不盖章横向打印
                                startArgs.iChapterNum=0;
                                startArgs.pchChapterPos='0';
							}else{
								startArgs.iChapterType=4;
								startArgs.iChapterNum=1;
								startArgs.pchChapterPos='240';
							}
							startArgs.printFilePath=htmlPath;
							PJF.stm.HDP.startPrintReceipt(startArgs, function(startPrintRes){
								if('1' == startPrintRes.status){
									var slcData = queryCB_grid.getSelectedRows();
									var record = new Array();
									for(var i=0;i<slcData.length;i++){
										var row = {
											'Cst_AccNo':slcData[i].Cst_AccNo,// 账号
											'PdAr_ID':slcData[i].PdAr_ID// 账单编号
										};
										record.push(row);
									}
									
									/*var param = {
										'Version':'01',// 信息格式版本
										'TxCode':'CMST00025',// 交易代码
										'chanl_cust_no':'STM',// 渠道客户号
										'SYS_EVT_TRACE_ID':PJF.otherInfo.SVC_ID,// 全局流水跟踪号
										'OPR_NO':PJF.otherInfo.devId//,// 操作员号
									};*/
									var param = {};
									param.Bill_Record = record;
									PJF.communication.cpsJsonReq({
										fwServiceId: 'simpleTransaction',
										//fwTranId: 'CMST00025-stm',A0782T025-stm
										fwTranId: 'A0782T025-HF',
										async: false, //默认同步
										jsonData: PJF.util.json2str(param),
										success: function(resp) {
											if(resp.Mnplt_StCd && resp.Mnplt_StCd == '01'){
												console.log("对账单打印登记注册成功");
											}else{
												console.log("对账单打印登记注册失败");
												return;
											}
										},
										failure: function(failData) {
										    console.log("对账单打印登记注册失败");
											return;
										}
									});
									
									document.getElementById('content_id').style.display = '';
									document.getElementById('preview_id').style.display = 'none';
									//@critical清空预览内容
									PJF.html.empty('preview_content');
									queryCB_grid.refresh();
								} else {
									STM.corporateBill.showPrintErrorMsg(startPrintRes.errorMsg+"，请退卡后呼叫工作人员处理", startPrintRes.errorCode);
								}
							});
						} else {
							STM.corporateBill.showPrintErrorMsg(prepareRes.errorMsg+"，请退卡后呼叫工作人员处理", prepareRes.errorCode);
						}
					});
				}
			});

			// 回签按钮
			if(data.btnId && 'btn3' == data.btnId){
				if(data.selectFuc && '1' == data.selectFuc){
					new PJF.ui.linkButton({
						dom : 'balanceBtn',
						style : 'main',
						appendStyle : 'confirm',
						name : '预览并打印',
						onClick : function() {
							viewAndPrint();
						}
					});
				}else if (data.selectFuc && '2' == data.selectFuc){
					new PJF.ui.linkButton({
						dom : 'balanceBtn',
						style : 'main',
						appendStyle : 'confirm',
						name : '修改',
						onClick : function() {
							modBalance('修改');
						}
					});
				}
			} else {
				new PJF.ui.linkButton({
					dom : 'balanceBtn',
					style : 'main',
					appendStyle : 'confirm',
					name : '回签',
					onClick : function() {
						modBalance('回签');
					}
				});
			}
            /**
             * @function modBalance
             * @param {String}oper 操作类型：回签、修改
             * 回签、修改
             * 1.需要至少输入一笔账单核对结果
             * 2.进行回签交易
             * 3.交易成功刷新页面
             */
			var modBalance = function(oper){
				if('' == hqData){
					STM.corporateBill.showAlertMsg("请至少输入一笔账单的核对结果，请重新输入");
					return;
				}
				
				if(hqData.indexOf('_') == '-1'){
					STM.corporateBill.showAlertMsg("请至少输入一笔账单的核对结果，请重新输入");
					return;
				}
				
				/*var hqary = hqData.split(';');
				var tmphq;
				var tmpary;
				var record = new Array();
				for(var i=0; i<hqary.length; i++){
					tmphq = hqary[i];
					if(tmphq){
						tmpary = tmphq.split('_');
						var row = {
							'ACCT_NO':tmpary[2],// 账号
							'DEP_TYPE':tmpary[1],// 账单编号
							'BILL_NO':tmpary[0],// 账单编号
							'DETL_FLAG':tmpary[3],
							'ACC_FLAG':'1',// 回签结果0 所有未回签1 相符2 不相符3 所有已回签
							'CARD_CAD':Txn_CardNo + '|' + PJF.otherInfo.devId// 设备号(账单正面图像路径)
						};
						record.push(row);
					}
				}
				
				var param = {
					'Version':'01',// 信息格式版本
					'TxCode':'CMST00026',// 交易代码
					'chanl_cust_no':'STM',// 渠道客户号
					'SYS_EVT_TRACE_ID':PJF.otherInfo.SVC_ID,// 全局流水跟踪号
					'OPR_NO':PJF.otherInfo.devId//,// 操作员号
				};
				param.Record = record;
				PJF.communication.cpsJsonReq({
					fwServiceId: 'simpleTransaction',
					fwTranId: 'CMST00026-stm',
					async: false, //默认同步
					jsonData: PJF.util.json2str(param),
					success: function(resp) {
					   	new PJF.ui.messageBox({
							content : '对账单' + oper + '成功',
							buttonConfs : [ {
								name : '确定',
								style : 'main',
								appendStyle : 'confirm',
								onClick : function() {
									queryCB_grid.refresh();
								}
							} ]
						});
					},
					failure: function(failData) {
						STM.corporateBill.showErrorMsg(failData, '对账单' + oper + '失败');
						return;
					}
				});*/
				
				// @critical 采用心跳的形式多次请求
				STM.corporateBill.loading = new PJF.ui.loading({msg:'业务正在处理中，请稍候……'});
				var hqary = hqData.split(';');
				var countAct = 0;// 执行交易个数
				var queryData = {};// 所有查询数据
				//var tmphq;
				//var tmpary;
				var errorData = '';//错误返回
				var times = hqary.length - 1;
				console.log('回签数据' + '>>>>>>>' + hqData);
				
				/*var param = {
					'Version':'01',// 信息格式版本
					'TxCode':'CMST00026',// 交易代码
					'chanl_cust_no':'STM',// 渠道客户号
					'SYS_EVT_TRACE_ID':PJF.otherInfo.SVC_ID,// 全局流水跟踪号
					'OPR_NO':PJF.otherInfo.devId//,// 操作员号
				};*/
				var param = {};
				
				for(var i = 0; i < times; i++){
					+function() {
						var tmphq = hqary[i];
						var tmpary = tmphq.split('_');
						
						/*param.Record = [{
							'ACCT_NO':tmpary[2],// 账号
							'DEP_TYPE':tmpary[1],// 账单编号
							'BILL_NO':tmpary[0],// 账单编号
							'DETL_FLAG':tmpary[3],
							'ACC_FLAG':'1',// 回签结果0 所有未回签1 相符2 不相符3 所有已回签
							'CARD_CAD':Txn_CardNo + '|' + PJF.otherInfo.devId// 设备号(账单正面图像路径)
						}];*/
						param.Acc_Record = [{
							'Cst_AccNo':tmpary[2],// 账号
							'Acc_Tp_ID':tmpary[1],// 账户类型编号
							'PdAr_ID':tmpary[0],// 账单编号
							'Parm_Nm':tmpary[3],
							'Rcncl_Rslt_Cd':'1',// 回签结果0 所有未回签1 相符2 不相符3 所有已回签
							'Eqmt_ID':Txn_CardNo + '|' + PJF.otherInfo.devId// 设备号(账单正面图像路径)
						}];
						var time_ = '第' + i + '次回签';
						console.log(time_ + '>>>>>>>' + PJF.util.json2str(param));
						
						var sendData = {
								/*Btch_Vchr_Blg_AccNo:data.accNo,
								Cst_Crdt_TpCd:'',
								TrdPCt_Crdt_No:'',
								CtcPsn:'',
								Unit_Ctc_Tel:'',
								Rgs_Opr_ID:''Acc_Record:[]*/
								Acc_Record:[{
								// 	'Acc_Tp_ID':tmpary[1],// 账户类型编号
								// 	'PdAr_ID':tmpary[0],// 账单编号
								// 	'Parm_Nm':tmpary[3],
								// 	'Rcncl_Rslt_Cd':'1',// 回签结果0 所有未回签1 相符2 不相符3 所有已回签
								'Cst_AccNo':tmpary[2],// 账号
								'Acc_Tp_ID':tmpary[1],// 账户类型编号
								'PdAr_ID':tmpary[0],// 账单编号
								'Parm_Nm':tmpary[3],
								'Rcncl_Rslt_Cd':'1',// 回签结果0 所有未回签1 相符2 不相符3 所有已回签
								'Eqmt_ID':Txn_CardNo + '|' + PJF.otherInfo.devId// 设备号(账单正面图像路径)	
							}]
						}
						PJF.communication.cpsJsonReq({
							fwServiceId: 'simpleTransaction',
							//fwTranId: 'CMST00026-stm',
							fwTranId: 'A0782T024-HF',
							async: false, //默认同步
							jsonData: PJF.util.json2str(sendData),
							success: function(resp) {
								if(resp.Mnplt_StCd && resp.Mnplt_StCd == '01' ){
									console.log(time_ + '成功！');
								}else{
									console.log(time_ + '失败！');
									errorData = resp;
								}
							},
							failure : function(responseData) {
								console.log(time_ + '失败！<br>全局跟踪号:'+responseData._COMMON.SYS_EVT_TRACE_ID
	                            		+'，错误码:'+responseData.BK_CODE+'，错误描述:'+responseData.BK_DESC);
								errorData = responseData;
							},
	                		complete: function() {
	                			countAct++;
	                        }
						});
					}();
				}
				// @critical 心跳
				var n = 0;
	        	var pig = setInterval(function() {
	        		n++;
	        		if(n > 30){
	        			clearInterval(pig);
	        			STM.corporateBill.showAlertMsg('交易超时了，请稍后再试！');
						STM.corporateBill.loading.destroy();
	 	        		return;
	        		}else{
	        			if(errorData){
	        				clearInterval(pig);
	        				STM.corporateBill.showErrorMsg(errorData, '回签过程中出错！');
							STM.corporateBill.loading.destroy();
							return;
	        			}
	        			
	        			if (countAct == times) {
	                        clearInterval(pig);
	                        STM.corporateBill.loading.destroy();
	                        new PJF.ui.errorMessageBox({
								content : '尊敬的客户，您所选择的对账单已' + oper + '成功',
								buttonConfs : [ {
									name : '确定',
									style : 'main',
									appendStyle : 'confirm',
									onClick : function() {
										hqData = '';
										queryCB_grid.refresh();
									}
								} ]
							});
	                    }
	        		}
	        	},1000);
	        	//心跳 end
			}
            /**
             * @function viewAndPrint
             * 1.选择一条进行预览并打印的回单
             * 2.不支持不同账单日的对账单合并打印
             */
			var viewAndPrint = function(){
				var slcData = queryCB_grid.getSelectedRows();
				
				if(!slcData || slcData.length < 1){
					STM.corporateBill.showAlertMsg("请选择您需要预览并打印的回签账单");
					return;
				} else {
					var date_tmp;
					var name_tmp;
					var code_tmp;
					for(var i=0;i<slcData.length;i++){
						/*if(slcData[i].BILL_DATE){
							if(date_tmp){
								if(date_tmp != slcData[i].BILL_DATE){
									STM.corporateBill.showAlertMsg("尊敬的客户，系统不支持不同账单日的账单合并打印，请选择相同账单日的账单，谢谢");
									return;
								}
							} else {
								date_tmp = slcData[i].BILL_DATE;
								name_tmp = slcData[i].ACCT_NAME;
								code_tmp = slcData[i].ACCT_NO + '-' + slcData[i].BILL_DATE + '-' + slcData[i].PdAr_ID + '-' + slcData[i].BILL_2DCODE
							}
						}*/
						if(slcData[i].Rcncl_Dt){
							if(date_tmp){
								if(date_tmp != slcData[i].Rcncl_Dt){
									STM.corporateBill.showAlertMsg("尊敬的客户，系统不支持不同账单日的账单合并打印，请选择相同账单日的账单，谢谢");
									return;
								}
							} else {
								date_tmp = slcData[i].Rcncl_Dt;
								name_tmp = slcData[i].Cst_Nm;
								code_tmp = slcData[i].Cst_AccNo + '-' + slcData[i].Rcncl_Dt + '-' + slcData[i].PdAr_ID + '-' + slcData[i].Exst_Stm_PD_Id_CD
							}
						}
					}
					//@critical 跳到common.js里面进行预览
					STM.corporateBill.previewHQZD(slcData,name_tmp,date_tmp,code_tmp);
				}
			}
		},
		destroy : function() {
		}
}

function showStcdBox(id, flg){
	
    new PJF.ui.messageBox({
        content: "请再次确认账单是否不相符",
        buttonConfs: [
            {
                style: 'main',
                name: '确认',
                onClick: function () {
                	console.log('取消时间:'+(new Date().toString()));               	
                }
            },{
                    style: 'main',
                    name: '取消',
                    onClick: function () {
                    	var tmp = id;
                    	hqData += tmp + ';';
                    	console.log("回签数据844："+hqData);
                    	$("#" + id + "_3").attr("checked",true);
                    	$("#" + id + "_4").attr("checked",false);
                    	modBalance('修改');
                }
            }
        ]
    });
	
}
/**
 * @function checkDetail
 * @param {String}id 拼接的数据信息
 * @param flg 标志位，1-新增 2-修改
 * 根据选择的回签结果，进行组装数据，进行回签
 */
function checkDetail(id, flg){
	var tmp = id;//$("#" + id + "_1").attr('name');
	console.log("回签数据tmp："+tmp);
	if('1' == flg){//新增
		if($("#" + id + "_2").is(':checked')){
			$("#" + id + "_1").removeAttr("checked");
			
			var confirm_Box = new PJF.ui.errorMessageBox({
				content : '温馨提示：尊敬的客户，请及时联系网点人员，以便查明不符原因，谢谢',
				buttonConfs : [{
					name : '继续回签',
					style : 'main',
					appendStyle : 'confirm',
					onClick : function() {
						var tmpData = {};
						// @critical 回签本页不符数据
						//jsonData.PAGE_NO = curPage;
						jsonData._pagination = {};
						jsonData._pagination.PAGE_JUMP = curPage;
						jsonData._pagination.REC_IN_PAGE = '9';//多页查询每页笔数
						baseData.jsonData = jsonData;
						baseData.btnId = currBtn;
						baseData.targetFlag = '1';
						//baseData.curPage = curPage;
						tmpData.baseData = baseData;
						tmpData.bfData = tmp;
						tmpData.Txn_CardNo = Txn_CardNo;
						
						template.loadPage("recordHF",tmpData);
					}
				},{
					name : '查清后再回签',
					style : 'main',
					onClick : function() {
						$("#" + id + "_2").removeAttr("checked");
						return;
					}
				}]
			});
		}
		
		if($("#" + id + "_1").is(':checked')){
			$("#" + id + "_2").removeAttr("checked");
			hqData += tmp + ';';
		} else {
			//$("#" + id + "_1").removeAttr("checked");
			hqData = hqData.replace(tmp + ';', '');
		}
	} else if('2' == flg){//修改
		if($("#" + id + "_1").is(':checked')){
			$("#" + id + "_2").removeAttr("checked");
			hqData += tmp + ';';
		} else {
			//$("#" + id + "_1").removeAttr("checked");
			$("#" + id + "_2").attr("disabled",false);
			$("#" + id + "_2").click();
			$("#" + id + "_2").attr("disabled",true);
			hqData = hqData.replace(tmp + ';', '');
		}
	}
	
}
/**
 * @function queryDetail
 * @param {String}info 拼接的数据信息 信息格式:日期_账号_账号类型_账户名称
 * 点击查询明细，跳转明细查询页面
 */
function queryDetail(info){//信息格式:日期_账号_账号类型_账户名称
	var data = {};
	
	var ary = info.split('_');
	var endDate = ary[0];
	var ptData = new Array();
	var czData = new Array();
	var row = {};
	row.desc = ary[1];
	row.name = ary[1] + "_" +ary[2] + "_" + ary[3];
	ptData.push(row);
	
	// @critical 查询明细界面初始化数据
	data.Txn_CardNo = Txn_CardNo;
	data.ptData = ptData;
	data.czData = czData;
	data.accountType = 0;
	data.select_account = row.name;
	data.SELECT_FLAG = '3';
	data.StDt = endDate.substring(0,6) + '01';
	data.CODt = endDate;
	data.EdDt = endDate;//余额明细1214
	data.Beg_Amt = '';
	data.CtOf_Amt = '';
	data.prevMenu = 'balanceSelfHF';
	data.targetFlag = '2';//跳转目标标志
	
	//回签本页数据
	//jsonData.PAGE_NO = curPage;
	jsonData._pagination = {};
	jsonData._pagination.PAGE_JUMP = curPage;
	baseData.jsonData = jsonData;
	baseData.btnId = currBtn;
	baseData.targetFlag = '1';
	//baseData.curPage = curPage;
	data.baseData = baseData;
	data.accNo = accNo;
	template.loadPage("queryCBDetailHF",data);
}

/**
 * @function showDetail
 * @param {String}VchID 凭证编号
 * 点击查询明细，跳转明细查询页面
 */
function showDetail(VchID){
	
	if(VchID.length && accNo.length){
		template.loadPage("queryCBDetailHF",{
			VchID:VchID,
			accNo:accNo
		});
	}

}
/**
 * @function packageData
 * @param {Object}data
 * @param {String}data.targetFlag 1.自定义界面过来的数据
 * @param {Object}data.ptData 普通账户
 * @param {Object}data.czData 财资账户
 * 页面请求数据进行封装
 */
function packageData(data){
	if(data.targetFlag && '1' == data.targetFlag){//自定义界面过来的数据
		jsonData = data.jsonData;
	} else {//初始化界面的数据
		var responseData = data.ptData;// 卡下所有的普通账户
		var responseDataCZ = data.czData;// 卡下所有的财资账户
		// 请求报文中所有的账号信息
		var record = new Array();
		//开始时间为当前时间往前92天
		var lastDate = new Date().setDate(new Date().getDate() - 92);
		var begin_date = PJF.util.formatDate(new Date(lastDate),"yyyyMMdd");
		var end_date = PJF.util.formatDate(new Date(),"yyyyMMdd");
		
		// 账户下拉框数据写入
		if(responseData && responseData.length >= 1){
			//取第一个账户数据
			/*var temp = responseData[0];
			if(temp.name){
				var ta = temp.name.split("_");
				var row = {
					'ACCT_NO':ta[0],// 账号
					'ACC_FLAG':'0',// 回签结果:0 所有未回签1 相符2 不相符3 所有已回签
					'DEP_TYPE':ta[1],// 账户类型:1 活期2 定期3 贷款
					'BEGIN_DATE':begin_date,// 开始日期
					'END_DATE':end_date,// 结束日期
					'COIN_TYPE':''// 币种
				};
				record.push(row);
			}*/
			//取所有账户数据
			for(var i = 0; i < responseData.length; i++){
				var temp = responseData[i];
				if(temp.name){
					var ta = temp.name.split("_");
					var row = {
						/*'ACCT_NO':ta[0],// 账号
						'ACC_FLAG':'0',// 回签结果:0 所有未回签1 相符2 不相符3 所有已回签
						'DEP_TYPE':'',//ta[1],// 账户类型:1 活期2 定期3 贷款
						'BEGIN_DATE':begin_date,// 开始日期
						'END_DATE':end_date,// 结束日期
						'Rcncl_Ind':ta[3],// 自组标志
						'COIN_TYPE':''// 币种*/
                        'Cst_AccNo':ta[0],// 客户账号
                        'Cst_Nm':ta[2],// 客户名称
                        'Acc_Tp_ID':'',// 账户类型:1 活期2 定期3 贷款
                        'CcyCd':''// 币种
					};
					if(ta[3] == "1"){
						record.push(row);
					}
					
				}
			}
		}
		//  @critical 账户下拉框数据写入
		if(responseDataCZ && responseDataCZ.length >= 1){
			//取第一个账户数据
			//取所有账户数据
			for(var i = 0; i < responseDataCZ.length; i++){
				var temp = responseDataCZ[i];
				if(temp.name){
					var ta = temp.name.split("_");
					var row = {
						/*'ACCT_NO':ta[0],// 账号
						'ACC_FLAG':'0',// 回签结果:0 所有未回签1 相符2 不相符3 所有已回签
						'DEP_TYPE':'',//ta[1],// 账户类型:1 活期2 定期3 贷款
						'BEGIN_DATE':begin_date,// 开始日期
						'END_DATE':end_date,// 结束日期
						'Rcncl_Ind':ta[3],// 自组标志
						'COIN_TYPE':''// 币种*/
                        'Cst_AccNo':ta[0],// 客户账号
                        'Cst_Nm':ta[2],// 客户名称
                        'Acc_Tp_ID':'',// 账户类型:1 活期2 定期3 贷款  老接口DEP_TYPE
                        'CcyCd':''// 币种
					};
					if(ta[3] == "1"){
						record.push(row);
					}
				}
			}
		}
		jsonData = {
			/*'Version':'01',// 信息格式版本
			'TxCode':'CMST00024',// 交易代码
			'chanl_cust_no':'STM',// 渠道客户号
			'SYS_EVT_TRACE_ID':PJF.otherInfo.SVC_ID,// 全局流水跟踪号
			'OPR_NO':PJF.otherInfo.devId,// 操作员号
			//'PAGE_NO':curPage,// 当前页码
			'INQUIRE_NUM':'9',// 查询条数
			'PRT_FLAG':'1'// 打印标志：2自助设备打印*/
            'Enqr_StDt':begin_date,// 查询起始日期
            'Enqr_CODt':end_date,//查询截止日期
            'Cur_Pcsg_StCd':'0',//0 所有未回签1 相符2 不相符3 所有已回签送空默认查全部
            'PdAr_ID':'',//产品合约编号  对应老接口字段：BILL_NO  对应账单编号
            'Pcs_StCd':'2'//过程状态代码 对应查询标志 1 查账单 2 查账单明细，余额，币种在后端明细表里面
		};
		
		jsonData._pagination = {};
		jsonData._pagination.PAGE_JUMP = curPage;//多页查询跳转页码
		jsonData._pagination.REC_IN_PAGE = '9';//多页查询每页笔数
		
		if(record.length){
			console.log('1115:'+record);
			jsonData.Acc_Record = record;
		}else{
			var CcyCd = '';
			if(data.targetFlag && '1' == data.targetFlag){
				if(jsonData.Acc_Record && jsonData.Acc_Record[0])
				CcyCd = jsonData.Acc_Record[0].CcyCd
			}
			
			var Acc_Tp_ID = data.accType ? data.accType : 1;
			var Cst_Nm =  data.cstNm ? data.cstNm : '';

			
			jsonData.Acc_Record = [{
				 'Cst_AccNo':accNo,
				 'Acc_Tp_ID':Acc_Tp_ID,
				 'Cst_Nm':Cst_Nm,
				 'CcyCd':CcyCd
			}];
		}
		
	}
}