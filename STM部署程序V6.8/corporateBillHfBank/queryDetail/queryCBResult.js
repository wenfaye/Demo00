function queryCBResultHF() {

}

// 在prototype里渲染各个页面组件
queryCBResultHF.prototype = {
	init : function(data) {
		if (!data) {
			return;
		};
		
		STM.corporateBill.Txn_CardNo = data.Txn_CardNo;
		PJF.html.content('acctNo',data.Cst_AccNo);//主账户账号
		PJF.html.content('acctName',data.Acc_AccNm);//主账户户名
		
		if(data.Acc_AccNm && data.Acc_AccNm.length){
			$('#acctName-container').css('visibility','visible');
		}else{
			$('#acctName-container').css('visibility','hidden');
		}
		
		var fwTranId = '';
		var columns = [[]];
		//var Tot_Pg_Num = 0;
		var A0181T703_printDta={};
		
		if(data.select_account&&data.select_account.length){
			$('#acctName-container').show();
		}
		
		data.TpCd = 1;//只使用普通活期
		if(1 == data.TpCd){//普通活期
			//fwTranId = 'CMST00005-stm';
            //data.TxCode = 'CMST00005';
            //fwTranId = 'A0181S405-stm-query';
            fwTranId = 'A0181S405-HF';
            data.TxCode = 'A0181S405';
			columns = [[
				{title : "交易日期",field : "Txn_Dt",align : 'center',width:140},
				{title : "凭证种类",field : "Bill_CtCd_DESC",align : 'center',width:180,formatter : function(value,rowData) {
					switch(value){
					case '0301':
						return '业务处理手续费';
					case '0405':
						return '扫描业务汇划费';
					default:
						return '';
					}
				} 
				},
				{title : "凭证号码",field : "Bill_No",align : 'center',width:140 },
				{title : "摘要",field : "Smy_Cd_DESC",align : 'center',width:120 },
				{title : "借方发生额",field : "Dep_DHAmt",align : 'center',width:150 },
				{title : "贷方发生额",field : "Dep_Cr_HpnAm",align : 'center',width:150 },
				{title : "借贷",field : "DbtCrDrcCd",align : 'center',width:80,
					formatter : function(value,rowData) {
						if(rowData.Dep_DHAmt - rowData.Dep_Cr_HpnAm > 0){
							return '借';
						} else if(rowData.Dep_DHAmt - rowData.Dep_Cr_HpnAm < 0){
							return '贷';
						}
					}
				},
				{title : "余额",field : "Dep_AcBa",align : 'center',width:180},
				{title : "对方账户",field : "Cntrprt_Txn_AccNo",align : 'center',width:300},
				{title : "对方户名",field : "Cntrprt_Txn_AccNo_Nm",align : 'center',width:300},
				{title : "交易流水号",field : "Ovrlsttn_EV_Trck_No",align : 'center',width:300}
			]];
			
//			if(STM.corporateBill.Cst_AccNo_Nm && STM.corporateBill.Cst_AccNo_Nm.length){
//				data.Acc_AccNm = STM.corporateBill.Cst_AccNo_Nm;
//			}else{
				var sendA0181S403Obj = {
		    			//Cst_AccNo: '801110010122700127'
		    			Cst_AccNo: data.Cst_AccNo
		    	};
				
				PJF.communication.cpsJsonReq({
		            fwServiceId: "simpleTransaction",
		            fwTranId: 'A0181S403-stm',//A0181S403-HF
		            async:true,
		            maskAll : true,
		            jsonData: PJF.util.json2str(sendA0181S403Obj),
		            success: function(resData){
		            	if(resData.Cst_AccNo_Nm && resData.Cst_AccNo_Nm.length){
		    				STM.corporateBill.Cst_AccNo_Nm = resData.Cst_AccNo_Nm;
		    				data.Acc_AccNm = resData.Cst_AccNo_Nm;
		    				//STM.corporateBill.debug(data.Acc_AccNm);
	    				}
		            },
		            failure: function(responseData){
		            	STM.corporateBill.showErrorMsg(responseData, 'error');
		            	//STM.corporateBill.debug(JSON.stringify(responseData));
		            }
				});
			//}
			
		} else if (2 == data.TpCd){//普通定期
			fwTranId = 'A0181T703-stm-query';
			data.TxCode = 'A0181T703';
			columns = [[
				{title : "交易日期",field : "Txn_Dt",align : 'center',width:140},
				{title : "交易金额",field : "Dep_TxnAmt",align : 'center',width:150 },
				{title : "存期",field : "Dep_Trm_Cd_DESC",align : 'center',width:120 },
				{title : "借贷",field : "DbtCrDrcCd",align : 'center',width:80,
					formatter : function(value) {
						if(1 == value){
							return '借';
						} else if(2 == value){
							return '贷';
						}
					}
				},
				{title : "摘要",field : "Smy_Cd_DESC",align : 'center',width:120 },
				{title : "册号",field : "Trm_DepSeqNo",align : 'center',width:120 },
				{title : "笔号",field : "Trm_DepSeqNo_Copy",align : 'center',width:80 },
				{title : "币种",field : "CcyCd_DESC",align : 'center',width:120},
				{title : "钞汇鉴别",field : "CshEx_Cd",align : 'center',width:120,
					formatter : function(value) {
						if(1 == value){
							return '钞';
						} else if(2 == value){
							return '汇';
						}
					}
				},
				{title : "交易流水号",field : "Cmpt_TrcNo",align : 'center',width:300}
			]];
		} else if (3 == data.TpCd){//普通贷款
			fwTranId = 'A02111050-stm-query';
			data.TxCode = 'A02111050';
			columns = [[
				{title : "交易日期",field : "Txn_Dt",align : 'center',width:140},
				{title : "交易代码",field : "Loan_Txn_CgyCd_DESC",align : 'center',width:150 },
				{title : "本金/利息标志",field : "Ln_TxnAmt_Sbdvsn_TpCd",align : 'center',width:180,
					formatter : function(value) {
						if('006' == value){
							return '本金';
						} else{
							return '利息';
						}
					}
				},
				{title : "借方发生额",field : "J_Mdf_Amt",align : 'center',width:150 },
				{title : "贷方发生额",field : "D_Mdf_Amt",align : 'center',width:150},
				{title : "贷款余额",field : "AfMd_Pnp_Bal",align : 'center',width:180},
				{title : "收息金额",field : "AfMd_Coll_Int_Bal",align : 'center',width:150},
				{title : "交易流水号",field : "Cmpt_TrcNo",align : 'center',width:300}
			]];
		} else if (4 == data.TpCd){//财资账户
			if(1 == data.accountType){//全量明细
				fwTranId = 'A05820113-stm-query';
				data.TxCode = 'A05820113';
				columns = [[
		            {title : "交易日期",field : "Txn_Dt",align : 'center',width:140},
		            {title : "摘要",field : "Smy_Cd_DESC",align : 'center',width:120 },
		            {title : "币种",field : "CcyCd_DESC",align : 'center',width:120},
		            {title : "借方发生额",field : "Dbt_Txn_HpnAm",align : 'center',width:150 },
		            {title : "贷方发生额",field : "Cr_Txn_HpnAm",align : 'center',width:150 },
		            {title : "账户余额",field : "Dep_AcBa",align : 'center',width:180},
		            {title : "对方账户",field : "Cntrprt_Txn_AccNo",align : 'center',width:300},
		            {title : "对方户名",field : "Cntrprt_Txn_AccNo_Nm",align : 'center',width:300},
		            {title : "交易流水号",field : "Cmpt_TrcNo",align : 'center',width:300},
		            {title : "本级上存",field : "Hst_UpDep_Amt",align : 'center',width:150},
		            {title : "本级内透",field : "Hst_LwrLvl_Dep_Amt",align : 'center',width:150},
		            {title : "下级上存",field : "Hst_Supr_Lnd_Amt",align : 'center',width:150},
		            {title : "下级内透",field : "Hst_LwrLvl_Lnd_Amt",align : 'center',width:150},
		            {title : "内部存款积数",field : "Hst_Inr_Dep_Acm",align : 'center',width:150},
		            {title : "内部透支积数",field : "Hst_Inr_Od_Acm",align : 'center',width:150},
		            {title : "内部协议存款积数",field : "Fst_Lvl_Agrmt_Acm",align : 'center',width:150}
	            ]];
			} else if (2 == data.accountType){//过滤明细
				fwTranId = 'A05820114-stm-query';
				data.TxCode = 'A05820114';
				columns = [[
					{title : "交易日期",field : "Txn_Dt",align : 'center',width:140},
					{title : "摘要",field : "Smy_Cd_DESC",align : 'center',width:120 },
					//{title : "币种",field : "CcyCd",align : 'center',width:120},
					{title : "借方发生额",field : "Dbt_Txn_HpnAm",align : 'center',width:150 },
					{title : "贷方发生额",field : "Cr_Txn_HpnAm",align : 'center',width:150 },
					{title : "账户余额",field : "Dep_AcBa",align : 'center',width:180},
					{title : "对方账户",field : "Cntrprt_Txn_AccNo",align : 'center',width:300},
					{title : "对方户名",field : "Cntrprt_Txn_AccNo_Nm",align : 'center',width:300},
					{title : "交易流水号",field : "Cmpt_TrcNo",align : 'center',width:300},
					{title : "本级上存",field : "Hst_UpDep_Amt",align : 'center',width:150},
					{title : "本级内透",field : "Hst_LwrLvl_Dep_Amt",align : 'center',width:150},
					{title : "下级上存",field : "Hst_Supr_Lnd_Amt",align : 'center',width:150},
					{title : "下级内透",field : "Hst_LwrLvl_Lnd_Amt",align : 'center',width:150},
					{title : "内部存款积数",field : "Hst_Inr_Dep_Acm",align : 'center',width:150},
					{title : "内部透支积数",field : "Hst_Inr_Od_Acm",align : 'center',width:150},
					{title : "内部协议存款积数",field : "Fst_Lvl_Agrmt_Acm",align : 'center',width:150}
	            ]];
			} else if (3 == data.accountType){//对账单
				//fwTranId = 'A0181S405-stm-query';
				fwTranId = 'A0181S405-HF';
				data.TxCode = 'A0181S405';
				columns = [[
		            {title : "交易日期",field : "Txn_Dt",align : 'center',width:140},
		            {title : "摘要",field : "Smy_Cd_DESC",align : 'center',width:120 },
		            /*{title : "币种",field : "CcyCd",align : 'center',width:120},*/
		            {title : "借方发生额",field : "Dep_DHAmt",align : 'center',width:150 },
		            {title : "贷方发生额",field : "Dep_Cr_HpnAm",align : 'center',width:150 },
		            {title : "余额",field : "Dep_AcBa",align : 'center',width:180},
		            {title : "积数",field : "Dep_Acm",align : 'center',width:150},
		            {title : "起息日期",field : "ValDt",align : 'center',width:140},
					{title : "交易流水号",field : "Cmpt_TrcNo",align : 'center',width:300},
	            ]];
			}
		}
		
		data.OPR_NO = PJF.otherInfo.devId, // 柜员号
		data.chanl_cust_no = '';

		var groupName = '';
		if(data.TpCd==1) {
			groupName='TXN';
		}
		else if(data.TpCd==2){
			groupName='WK_DETAIL';
		}
		else if(data.TpCd==3){
			groupName='INFO_GRUP';
		}else if(data.TpCd==4){
			if( data.accountType==3){
				groupName='TXN';
			}
			else{
				groupName='FS_TX_GRP';
			}
		}


		data.Cst_AccNo = data.Cst_AccNo;
		data.select_account = data.Cst_AccNo;
				
		//data.Cst_AccNo = '801110010122700127';
		//data.select_account = '801110010122700127';
		//STM.corporateBill.debug(PJF.util.json2str(data));
		var queryCB_grid = new PJF.ui.grid({
			dom:'queryCB_grid',
			/*width:'auto',
			 *height:570,
			 **/
			width:970,
			height:570,
			//totalPath:'Dtl_Tdnum',
			//currentPath:'Cur_Pg_CD',
			//pageSize:'30',
			//pageNumberParamName:'Cur_Pg_CD',
            reqType: 'P6',
			sendPath:'CCBS_Info',
			isAppendMode: false,
			rownumbers:false,
			rowsPath:groupName,
			url:PJF.constants.DEFAULT_ACTION,
			queryParams:{
				'fwServiceId':'simpleTransaction',
				'fwTranId':fwTranId,
				'jsonData':PJF.util.json2str(data)
			},
			columns:columns,
			loadFilter:function (resData) {
				if(null != resData && '' != resData && '00' != resData.BK_STATUS){
					STM.corporateBill.showErrorMsg(resData, '');
					return null;
				}
				if(resData.Vld_Rcrd_Cnt==0){
					if(data.TpCd==1){
						resData.TXN=[];
					}
					else if(data.TpCd==2){
						resData.WK_DETAIL=[];
					}else if(data.TpCd==3){
						resData.INFO_GRUP=[];
					}else if(data.TpCd==4){
						if( data.accountType==3){
							resData.TXN=[];
						}else{
							resData.FS_TX_GRP=[];
						}
					}
				}
				else{
					if(data.TpCd==1) {
						resData.TXN = resData.TXN.slice(0, resData.Vld_Rcrd_Cnt);
						/**
						 * 备注是空  and 摘要代码 != ‘0100’
						 * 才用摘要代码的翻译
						 * 否则用备注
						 */
						for(var i=0; i < resData.TXN.length; i++){
							if(!('' == resData.TXN[i].Txn_Rmrk.trim() && '0100' != resData.TXN[i].Smy_Cd)){
								resData.TXN[i].Smy_Cd_DESC = resData.TXN[i].Txn_Rmrk;
							}
						}
					}
					else if(data.TpCd==2){
						resData.WK_DETAIL = resData.WK_DETAIL.slice(0, resData.Vld_Rcrd_Cnt );
						A0181T703_printDta.Dep_Trm_Cd_DESC = resData.Dep_Trm_Cd_DESC;
						A0181T703_printDta.Trm_DepSeqNo = resData.Trm_DepSeqNo;
						A0181T703_printDta.CcyCd_DESC = resData.CcyCd_DESC;
						if(1 == resData.CshEx_Cd){
							A0181T703_printDta.CshEx_Cd_DESC = '钞';
						}else{
							A0181T703_printDta.CshEx_Cd_DESC = '汇';
						}
						data.A0181T703_printDta = A0181T703_printDta;
						for(var i=0;i<resData.WK_DETAIL.length;i++){
							resData.WK_DETAIL[i].CcyCd = resData.CcyCd;
							resData.WK_DETAIL[i].CcyCd_DESC = resData.CcyCd_DESC;
							resData.WK_DETAIL[i].CshEx_Cd = resData.CshEx_Cd;
							resData.WK_DETAIL[i].CshEx_Cd_DESC = resData.CshEx_Cd_DESC;
							resData.WK_DETAIL[i].Trm_DepSeqNo_Copy = resData.Trm_DepSeqNo;
							resData.WK_DETAIL[i].Trm_DepSeqNo_Copy_DESC = resData.Trm_DepSeqNo_DESC;
							resData.WK_DETAIL[i].Trm_DepSeqNo = resData.Trm_DepSeqNo;
							resData.WK_DETAIL[i].Trm_DepSeqNo_DESC = resData.Trm_DepSeqNo_DESC;
							resData.WK_DETAIL[i].Dep_Trm_Cd = resData.Dep_Trm_Cd;
							resData.WK_DETAIL[i].Dep_Trm_Cd_DESC = resData.Dep_Trm_Cd_DESC;
						}
						/**
						 * 备注是空  and 摘要代码 != ‘0100’
						 * 才用摘要代码的翻译
						 * 否则用备注
						 */
						for(var i=0; i < resData.WK_DETAIL.length; i++){
							if(!('' == resData.WK_DETAIL[i].Txn_Rmrk.trim() && '0100' != resData.WK_DETAIL[i].Smy_Cd)){
								resData.WK_DETAIL[i].Smy_Cd_DESC = resData.WK_DETAIL[i].Txn_Rmrk;
							}
						}
					}else if(data.TpCd==3){
						resData.INFO_GRUP = resData.INFO_GRUP.slice(0, resData.Vld_Rcrd_Cnt );
						for(var i=0;i<resData.INFO_GRUP.length;i++){
							if("1010" == resData.INFO_GRUP[i].CorpLnTxn_Sbdvsn_TpCd){
								resData.INFO_GRUP[i].D_Mdf_Amt = resData.INFO_GRUP[i].Mdf_Amt;
							}else{
								resData.INFO_GRUP[i].J_Mdf_Amt = resData.INFO_GRUP[i].Mdf_Amt;
							}
						}
					}else if(data.TpCd==4){
						if( data.accountType==3){
							resData.TXN = resData.TXN.slice(0, resData.Vld_Rcrd_Cnt);
							/**
							 * 备注是空  and 摘要代码 != ‘0100’
							 * 才用摘要代码的翻译
							 * 否则用备注
							 */
							for(var i=0; i < resData.TXN.length; i++){
								if(!('' == resData.TXN[i].Txn_Rmrk.trim() && '0100' != resData.TXN[i].Smy_Cd)){
									resData.TXN[i].Smy_Cd_DESC = resData.TXN[i].Txn_Rmrk;
								}
							}
						}else{
							resData.FS_TX_GRP = resData.FS_TX_GRP.slice(0, resData.Vld_Rcrd_Cnt );
							for(var i=0;i<resData.FS_TX_GRP.length;i++){
								resData.FS_TX_GRP[i].CcyCd = resData.CcyCd;
								resData.FS_TX_GRP[i].CcyCd_DESC = resData.CcyCd_DESC;
								/**
								 * 备注是空  and 摘要代码 != ‘0100’
								 * 才用摘要代码的翻译
								 * 否则用备注
								 */
								if(!('' == resData.FS_TX_GRP[i].Txn_Rmrk.trim() && '0100' != resData.FS_TX_GRP[i].Smy_Cd)){
									resData.FS_TX_GRP[i].Smy_Cd_DESC = resData.FS_TX_GRP[i].Txn_Rmrk;
								}

							}
						}

					}
				}
				//Tot_Pg_Num = data.Tot_Pg_Num;//总页数
                //Tot_Pg_Num =parseInt(data.Cur_Dtl_Max_SN/10) +1;
				return resData;
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
		
		queryCB_grid.addPaginationBar(cb_prePage, cb_nextPage);//, "desc"
		
		// 返回按钮
		var returnBtn = new PJF.ui.linkButton({
			dom : 'returnBtn',
			style : 'main',
			name : '返回',
			onClick : function() {
				//template.loadPage("queryCBDetailHF",data);
				template.loadPage("entryIndex",{
					accNo:data.Cst_AccNo
				});
			}
		});

		var conditionBtn = new PJF.ui.linkButton({
			dom : 'conditionBtn',
			style : 'main',
			appendStyle : 'confirm',
			name : '自定义查询',
			onClick : function() {
				template.loadPage("queryCBDetailHF",{
					accNo:data.Cst_AccNo
				});
			}
		});
		
		// 打印按钮
		var printBtn = new PJF.ui.linkButton({
			dom : 'printBtn',
			style : 'main',
			appendStyle : 'confirm',
			name : '打印',
			onClick : function() {
                var conf = createReqData();
				console.log(JSON.stringify(conf,null,"\t"));
                console.log('分页请求参数++++++++++++++++++++++++++++++++++++' + PJF.util.json2str(conf.jsonData));
                
                var orgCode = PJF.orgInfo.instLevel1BranchId;// 一级分行号
                console.log(">>>>>>机构号orgCode："+orgCode);
                var ifClude = STM.corporateBill.orgName.indexOf(orgCode);
                console.log(">>>>>>机构号orgCode六家范围："+STM.corporateBill.orgName);
                console.log(">>>>>>机构号orgCode是否在六家范围内："+ifClude);
                var printPages = 300;
                var printPageVals = 3000;
                if(ifClude < 0){
                    console.log(">>>>>>不在六家范围内。。。");
                    printPages = 300;
                    printPageVals = 3000;
                }else{
                    console.log(">>>>>>在六家范围内。。。");
                    printPages = 300;
                    printPageVals = 3000;
                }
                STM.corporateBill.cpsJsonReqP6AllData(printPages, printPageVals, conf.jsonData.transaction_id, conf.jsonData,function (respData) {
                	 console.log('line450',PJF.util.json2str(conf.jsonData));
                	//respData.allRows = respData.TXN;
                    STM.corporateBill.printHtmlDataByTxCode_queryCBResultNew(respData,data);
                })
			}
		});
		
		//退出按钮
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

        //创建公共请求报文对象
       var  createReqData =function(){
            var dataNew = {};
            var jsonData = data;
		   var locCreateFileConf ={};
            //test---------begin
		   if(1 == data.TpCd){//普通活期
			   jsonData.transaction_id = "A0181S405-HF";
			   //jsonData.transaction_id = "A0181S405-stm";
			   jsonData.reportID = "STM_A0181S405-report";
			   jsonData.printId = "STM_A0181S405_ptytd";
               jsonData.reqConfig = {
                   rowsPath:'TXN',
                   vrcPath : 'Vld_Rcrd_Cnt'
               };
			   locCreateFileConf = {
					verticalPrint:false,//false为横打,
				   gridConf:{showRowNumber:false,showRowDivider:false},
				   defaultFontSize : 10,//字体大小
				   width: 1070,//page的宽度
				   height :740, //page的高度
				   fixedColumnWidth:{"交易日期":60,"凭证种类" : 58, "凭证号码": 120,"摘要":68,"借方发生额": 58,"贷方发生额":58,"借贷": 38,"余额":88,"对方账户":120,"对方户名":120,"交易流水号":120},
				   //fixNums : [4,5],//需要处理千分位的列
				   pageRenderCallBack: function(column){
					   if(column == "借方发生额"||column == "贷方发生额"||column == "余额") {
						   return '{text-align: right;}';
					   }
				   },
				   sealCfg: {
					   VchID:"MXDY0STMZHC200010000000000000001",
					   //CALLOUT_TXN_CD: 'A0181S405-stm', // 交易码
					   CALLOUT_TXN_CD: 'A0181S405-HF',
//				Vchr_Grp: [{
//					Ovrlsttn_Trck_No ,// 全局跟踪号
//					Clmn_Opt_Dsc: ,// 校验栏位 （可选）
//				}],
//				callback: ,//生成html成功后的回调方法
					   sealLeft: '603px',//印章横坐标，默认0px
					   sealTop: '5px'//印章纵坐标，默认0px
				   }
			   };
		   }
		   else if (2 == data.TpCd) {//普通定期
			   jsonData.transaction_id = "A0181T703-stm";
			   jsonData.reportID = "STM_A0181T703-report";
			   jsonData.printId = "STM_A0181T703_ptytd";
               jsonData.reqConfig = {
                   rowsPath:'WK_DETAIL',
                   vrcPath : 'Vld_Rcrd_Cnt'
               };
			   locCreateFileConf={
				   gridConf:{showRowNumber:false,showRowDivider:false},
				   defaultFontSize : 10,//字体大小
				   width: 1070,//page的宽度
				   height :740, //page的高度
				   fixedColumnWidth:{"日期":60,"交易金额" : 78, "存期": 58,"借贷":38,"摘要": 58,"册号":58,"币种": 58,"钞汇鉴别":58,"交易流水号":120},
				   //fixNums : [4,5],//需要处理千分位的列
				   pageRenderCallBack: function(column){
					   if(column == "交易金额") {
						   return '{text-align: right;}';
					   }
				   },
				   sealCfg: {
					   VchID:"MXDY0STMZHC200010000000000000001",
					   CALLOUT_TXN_CD: 'A0181T703-stm', // 交易码
//				Vchr_Grp: [{
//					Ovrlsttn_Trck_No ,// 全局跟踪号
//					Clmn_Opt_Dsc: ,// 校验栏位 （可选）
//				}],
//				callback: ,//生成html成功后的回调方法
					   sealLeft: '603px',//印章横坐标，默认0px
					   sealTop: '5px'//印章纵坐标，默认0px
				   }
			   };
		   }
		   else if (3 == data.TpCd) {//普通贷款
			   jsonData.transaction_id = "A02111050-stm";
			   jsonData.reportID = "STM_A02111050-report";
			   jsonData.printId = "STM_A02111050_ptytd";
               jsonData.reqConfig = {
                   rowsPath:'INFO_GRUP',
                   vrcPath : 'Vld_Rcrd_Cnt'
               };
			   locCreateFileConf={//还没写
				   gridConf:{showRowNumber:false,showRowDivider:false},
				   defaultFontSize : 10,//字体大小
				   width: 1070,//page的宽度
				   height :740, //page的高度
				   fixedColumnWidth:{"交易日期":60,"交易代码" : 58, "本金/利息标志": 38,"借方发生额":58,"贷方发生额": 58,"贷款余额":78,"收息金额": 58,"交易流水号":120},
				   //fixNums : [4,5],//需要处理千分位的列
				   pageRenderCallBack: function(column){
					   if(column == "借方发生额"||column == "贷方发生额"||column == "贷款余额"||column == "收息金额") {
						   return '{text-align: right;}';
					   }
				   },
				   sealCfg: {
					   VchID:"MXDY0STMZHC200010000000000000001",
					   CALLOUT_TXN_CD: 'A02111050-stm', // 交易码
//				Vchr_Grp: [{
//					Ovrlsttn_Trck_No ,// 全局跟踪号
//					Clmn_Opt_Dsc: ,// 校验栏位 （可选）
//				}],
//				callback: ,//生成html成功后的回调方法
					   sealLeft: '603px',//印章横坐标，默认0px
					   sealTop: '5px'//印章纵坐标，默认0px
				   }
			   };
		   }
		   else if (4 == data.TpCd) {//财资账户
			   if (1 == data.accountType) {//全量明细
				   jsonData.transaction_id = "A05820113-stm";
				   jsonData.reportID = "STM_A05820113-report";
				   jsonData.printId = "STM_A05820113_ptytd";
                   jsonData.reqConfig = {
                       rowsPath:'FS_TX_GRP',
                       vrcPath : 'Vld_Rcrd_Cnt'
                   };
				   locCreateFileConf={//还没写
					   gridConf:{showRowNumber:false,showRowDivider:false},
					   defaultFontSize : 10,//字体大小
					   verticalPrint:false,//横打
					   width: 1070,//page的宽度
					   height :740, //page的高度
					   fixedColumnWidth:{"交易日期":60,"摘要" : 68, "币种": 38,"借方发生额":58,"贷方发生额": 58,"账户余额":88,"对方账户": 120,"对方户名":120,"交易流水号":120,"本级上存":58,"本级内透":58,"下级上存":58,"下级内透":58,"内部存款积数":58,"内部透支积数":58,"内部协议存款积数":58},
					   //fixNums : [4,5],//需要处理千分位的列
					   pageRenderCallBack: function(column){
						   if(column == "借方发生额"||column == "贷方发生额"||column == "贷款余额"||column == "收息金额") {
							   return '{text-align: right;}';
						   }
					   },
					   sealCfg: {
						   VchID:"MXDY0STMZHC200010000000000000001",
						   CALLOUT_TXN_CD: 'A05820113-stm', // 交易码
//				Vchr_Grp: [{
//					Ovrlsttn_Trck_No ,// 全局跟踪号
//					Clmn_Opt_Dsc: ,// 校验栏位 （可选）
//				}],
//				callback: ,//生成html成功后的回调方法
						   sealLeft: '603px',//印章横坐标，默认0px
						   sealTop: '5px'//印章纵坐标，默认0px
					   }
				   };
			   }
			   else if (2 == data.accountType) {//过滤明细
				   jsonData.transaction_id = "A05820114-stm";
				   jsonData.reportID = "STM_A05820114-report";
				   jsonData.printId = "STM_A05820114_ptytd";
                   jsonData.reqConfig = {
                       rowsPath:'FS_TX_GRP',
                       vrcPath : 'Vld_Rcrd_Cnt'
                   };
				   locCreateFileConf={//还没写
					   gridConf:{showRowNumber:false,showRowDivider:false},
					   defaultFontSize : 10,//字体大小
					   width: 1070,//page的宽度
					   height :740, //page的高度
					   fixedColumnWidth:{"交易日期":60,"摘要" : 68, "币种": 38,"借方发生额":58,"贷方发生额": 58,"账户余额":88,"对方账户": 120,"对方户名":120,"交易流水号":120,"本级上存":58,"本级内透":58,"下级上存":58,"下级内透":58,"内部存款积数":58,"内部透支积数":58,"内部协议存款积数":58},
					   //fixNums : [4,5],//需要处理千分位的列
					   pageRenderCallBack: function(column){
						   if(column == "借方发生额"||column == "贷方发生额"||column == "账户余额") {
							   return '{text-align: right;}';
						   }
					   },
					   sealCfg: {
						   VchID:"MXDY0STMZHC200010000000000000001",
						   CALLOUT_TXN_CD: 'A05820114-stm', // 交易码
//				Vchr_Grp: [{
//					Ovrlsttn_Trck_No ,// 全局跟踪号
//					Clmn_Opt_Dsc: ,// 校验栏位 （可选）
//				}],
//				callback: ,//生成html成功后的回调方法
						   sealLeft: '603px',//印章横坐标，默认0px
						   sealTop: '5px'//印章纵坐标，默认0px
					   }
				   };
			   }
			   else if (3 == data.accountType) {//对账单
				   jsonData.transaction_id = "A0181S405-stm";
				   jsonData.reportID = "STM_A0181S405-report2";
				   jsonData.printId = "STM_A0181S405_ptytd2";
                   jsonData.reqConfig = {
                       rowsPath:'TXN',
                       vrcPath : 'Vld_Rcrd_Cnt'
                   };
				   locCreateFileConf={//还没写
					   gridConf:{showRowNumber:false,showRowDivider:false},
					   defaultFontSize : 10,//字体大小
					   width: 1070,//page的宽度
					   height :740, //page的高度
					   fixedColumnWidth:{"交易日期":60,"摘要" : 68, "借方发生额":58,"贷方发生额": 58,"余额":88,"起息日期": 58,"交易流水号":120},
					   //fixNums : [4,5],//需要处理千分位的列
					   pageRenderCallBack: function(column){
						   if(column == "借方发生额"||column == "贷方发生额"||column == "余额") {
							   return '{text-align: right;}';
						   }
					   },
					   sealCfg: {
						   VchID:"MXDY0STMZHC200010000000000000001",
						   CALLOUT_TXN_CD: 'A0181S405-stm', // 交易码
//				Vchr_Grp: [{
//					Ovrlsttn_Trck_No ,// 全局跟踪号
//					Clmn_Opt_Dsc: ,// 校验栏位 （可选）
//				}],
//				callback: ,//生成html成功后的回调方法
						   sealLeft: '603px',//印章横坐标，默认0px
						   sealTop: '5px'//印章纵坐标，默认0px
					   }
				   };
			   }
		   }
            //test ---------end
            dataNew.jsonData = jsonData;
            //标志
            dataNew.queryCBResult_printMeta_config = true;
            //dataNew.printMeta = {};
            //首页行数
            //dataNew.printMeta.firstPageNum = '30';
            //其他页行数
            //dataNew.printMeta.otherPageNum = '30';
            //底部附加区域
           // dataNew.printMeta.endAttach = [	{"des":"客户须知","key":"","style":"","value":'<br>1．此账单以客户在建行的实际交易为依据，由客户通过建行网点柜台或自助设备打印，手写或自行打印无效。'+
            //	'<br>2．此账单加盖“中国建设银行业务专用章”，除明细账单外均打印二维码，可通过建行自助设备或手机银行扫描二维码校验真伪。'+
            //	'<br>3．账单遗失可补制，并打印补打次数，请勿重复记账。<br>'}
            //];
            dataNew.locCreateFileConf = locCreateFileConf;
            //横打
            dataNew._locPrintConf = {
        			'iChapterType' : 131076
            };
            //强制本地打印
            dataNew.locPrint = true;
            if(PJF.otherInfo.isSelfBank){
                dataNew.tipAbove = '请取回您的回执，凭回执中的二维码到实物区具有打印设备的智慧柜员机“打印业务-查询打印-扫码打印”菜单下进行打印，如需帮助请咨询工作人员';
            }else{
                dataNew.tipAbove = '温馨提示：您可持本凭条上的二维码到有打印设备的智慧柜员机上点击“个人业务-综合查询与打印-扫码打印”打印您需要的凭证,或者咨询工作人员';
            }

            return dataNew;
        }

	},
	destroy : function() {
	}
}