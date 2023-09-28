/**
 * @file 余额查询结果展示
 * @author ZhangAXiong
 * @version 1.0
 * * Last Updated 2021-01-19
 *展示账户余额的详细信息
 */
function CPBBalanceResultHF() {
}

var CshEx_Cd_Obj = {
		'1':'钞',
		'2':'汇'
}
var ccyCd_Obj = {
}
var ccyCdArray_val = ["156","840","978","344","392","826","036","554","901","446","410","124","643","764","702","578","752","208","756","784","398","458","484","710","682"];
var ccyCdArray_desc = ["人民币","美元","欧元（EUR）","香港元","日元","英镑","澳大利亚元","新西兰元","新台湾元","澳门元","元（韩元）","加拿大元（加元）","俄罗斯卢布","铢（泰国铢）","新加坡元","挪威克朗","瑞典克朗","丹麦克朗","瑞士法郎","UAE迪拉姆","哈萨克斯坦坚戈","马来西亚林吉特","墨西哥比索","南非兰特","沙特里亚尔"];

for(var i in ccyCdArray_val){
	ccyCd_Obj[ccyCdArray_val[i]] = ccyCdArray_desc[i];
}

CPBBalanceResultHF.prototype = {
    init: function (data) {
    	data = data || {};
    	var param = data.param || {};
    	console.log('接收参数-->账户：' + param.accNo + '，类型：' + param.accType);
    	if(param.accNo&&param.accNo.length){
    		$('#accNoBalance').text(param.accNo);
    	}

		/*
         * 查询余额数据
         * reqData 请求参数
         * fwTranId 交易id
         * succCallBack 成功回调函数
         */
		/**
		 * @function queryBalData
		 * @param{Object}reqData 请求参数
		 * @param{String}fwTranId 交易id
		 * succCallBack 成功回调函数
		 * 查询余额数据
		 */
    	var queryBalData = function(reqData, fwTranId, succCallBack){
    		PJF.communication.cpsJsonReq({
	            fwServiceId: "simpleTransaction",
	            fwTranId: fwTranId,
	            async:true,
	            maskAll : true,
	            jsonData: PJF.util.json2str(reqData),
	            success: succCallBack,
	            failure: function(responseData){
	            	STM.corporateBill.showErrorMsg(responseData, '查询余额失败');
	            	//STM.corporateBill.debug(JSON.stringify(responseData));
	            }
			});
    	};
		/*var queryBalData = function(reqData, fwTranId, succCallBack, failCallBack){
    		PJF.communication.cpsJsonReq({
	            fwServiceId: "simpleTransaction",
	            fwTranId: fwTranId,
	            async:true,
	            maskAll : true,
	            jsonData: PJF.util.json2str(reqData),
	            success: succCallBack,
	            failure: failCallBack
			});
    	};*/
    	
    	/*var jsonData = {
    			Cst_AccNo:param.accNo,
    			SYS_TX_CODE_DATE: 'A0181S403' // #交易服务编码
    	};
    	var jsonData = {
    			Cst_AccNo:param.accNo
    	};
    	*/
    	//jsonData.Cst_AccNo = param.accNo;
    	var jsonData = {
    			//Cst_AccNo: '853547010122801355'
    			Cst_AccNo:param.accNo
    	};
    	
    	var gridData = new Array();// @critical 分页数据
    	var accType = param.accType;// @critical  账户类型
    	accType = '1';
    	var fwTranId = null;//  @critical 调用交易id
    	var accBalColumns = [[]];
    	
    	if(accType && '4' == accType){
			accBalColumns[0].push({title : '账号',field : 'Cst_AccNo',align : 'center',width : 360});
			accBalColumns[0].push({title : '币种',field : 'CcyCd',align : 'center',width : 180});
			accBalColumns[0].push({title : '钞汇鉴别',field : 'CshEx_Cd',align : 'center',width : 180});
			accBalColumns[0].push({title : '余额',field : 'bal',align : 'center',width : 220});
    		accBalColumns[0].push({title : '本级存款余额',field : 'TheLvl_Dep_Bal',align : 'center',width : 220});
        	accBalColumns[0].push({title : '上存余额',field : 'Hst_UpDep_Amt',align : 'center',width : 220});
        	accBalColumns[0].push({title : '现金池余额',field : 'Hst_CshPl_Bal',align : 'center',width : 220});
        	accBalColumns[0].push({title : '下级存放',field : 'Hst_LwrLvl_Dep_Amt',align : 'center',width : 220});
        	accBalColumns[0].push({title : '向上级借款',field : 'Hst_Supr_Lnd_Amt',align : 'center',width : 220});
        	accBalColumns[0].push({title : '下级借款',field : 'Hst_LwrLvl_Lnd_Amt',align : 'center',width : 220});
    	}else{
    		accBalColumns[0].push({title : '账号',field : 'Cst_AccNo',align : 'center'});
			accBalColumns[0].push({title : '币种',field : 'CcyCd',align : 'center',formatter : function(value, rowData, rowIndex) {
	            return ccyCd_Obj[value];
	        }});
			accBalColumns[0].push({title : '钞汇鉴别',field : 'CshEx_Cd',align : 'center',formatter : function(value, rowData, rowIndex) {
	            return CshEx_Cd_Obj[value];
	        }});
			accBalColumns[0].push({title : '余额',field : 'bal',align : 'center'});
    	}
    	
    	//if(!fwTranId) return;
    	
		// @critical 账户下余额列表grid组件
		var queryResultGrid = new PJF.ui.grid({
			dom: 'queryResultGrid',
			width:'auto',
			height: 570,
			isAppendMode: false, // 是否为追加模式 此处应该设置为false
			title: '默认表格',
			totalPath: 'total',
			singleSelect: true,
			rownumbers: false,
			isLocalPagination:true,
            rowsPath: 'rows',
			pageSize:10,
			columns: accBalColumns,//列名
			noDataMsg:'无数据'
		});
		var prePageBtn = new PJF.ui.linkButton({
			dom:"cb_prePage",
//			id:"cb_prePage",
			style: 'main',
			name:"上一页",
			onClick : function() {
			}
		});
		
		var nextPageBtn = new PJF.ui.linkButton({
			dom:"cb_nextPage",
//			id:"cb_nextPage",
			style: 'main',
			name:"下一页",
			onClick : function() {
			}
		});
		//  @critical 注册表格的上下页按钮 以及页码信息
		queryResultGrid.addPaginationBar(prePageBtn, nextPageBtn, "desc");
		
    	// 返回按钮
		var returnBtn = new PJF.ui.linkButton({
			dom : 'returnBtn',
			style : 'main',
			name : '返回',
			onClick : function() {
				//template.loadPage('CPBBalanceQueryNew', data);
				delete data.param;
				template.loadPage('entryIndex', data);
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
		
		// 查询按钮
		var searchBtn = new PJF.ui.linkButton({
			dom : 'searchBtn',
			style : 'main',
			name : '查询',
			appendStyle : 'confirm',
			onClick : function() {
				//template.loadPage('CPBBalanceQueryNew', data);
				switch(accType)
		    	{
		    	case '1' : //  @critical 普通活期
		    		/*fwTranId = 'A0181S402-PSS';
		    		jsonData.CcyCd = '156';// 币种-人民币
		    		jsonData.CshEx_Cd = '1';// 钞汇-钞
		    		
		    		queryBalData(jsonData, fwTranId, function(resData){
		    			if(resData){
		    				var row = {};
		    				row.Cst_AccNo = resData.Cst_AccNo;
		    				row.CcyCd = '人民币';
		    				row.CshEx_Cd = '钞';
		    				row.CcyCd = resData.CcyCd_DESC;
		    				row.CshEx_Cd = resData.CshEx_Cd_DESC;
		    				row.bal = resData.Dep_AcBa;
		    				gridData.push(row);
		    			}
		    		});*/
		    		fwTranId = 'A0181S403-stm';
		    		//A0181S403-stm AMT_INFO A0181S403-HF
		    		
		    		queryBalData(jsonData, fwTranId, function(resData){
		    			if(resData && resData.AMT_INFO){
		    				var cstAccNo = resData.Cst_AccNo;
		    				
		    				if(resData.Cst_AccNo_Nm && resData.Cst_AccNo_Nm.length){
			    				STM.corporateBill.Cst_AccNo_Nm = resData.Cst_AccNo_Nm;
			    				$('#Cst_AccNo_Nm').text(resData.Cst_AccNo_Nm);
			    				$('#Cst_AccNo_Nm-wrap').show();
		    				}

		    				if(!resData.TXN){
		    					resData.TXN = resData.AMT_INFO;
		    				}
		    				queryResultGrid.clearData();
		    				if(resData.TXN.length){
		    					for(var i = 0; i < resData.TXN.length; i++){
		        					var row = {};
		            				row.Cst_AccNo = cstAccNo;
		            				row.CcyCd = resData.TXN[i].CcyCd;
		            				row.CshEx_Cd = resData.TXN[i].CshEx_Cd;
		            				//row.CcyCd = resData.AMT_INFO[i].CcyCd_DESC;
		            				//row.CshEx_Cd = resData.AMT_INFO[i].CshEx_Cd_DESC;
		            				row.bal = STM.corporateBill.getJE(resData.TXN[i].Dep_AcBa);
		            				gridData.push(row);
		        				}
		    					//  @critical 加载表格数据
		    	    			queryResultGrid.loadData(gridData);
		    				}
		    			}
		    		});
		    		break;
		    	case '2' : //  @critical 普通定期
		    		fwTranId = 'A0181T701-stm';
		    		
		    		/*queryBalData(jsonData, fwTranId, function(resData){
		    			if(resData && resData.APNT_TFRDEP_GUP){
		    				for(var i = 0; i < resData.APNT_TFRDEP_GUP.length; i++){
		    					var row = {};
		        				row.Cst_AccNo = resData.APNT_TFRDEP_GUP[i].Pnp_TfrDep_AccNo;
		        				row.CcyCd = resData.APNT_TFRDEP_GUP[i].CcyCd_DESC;
		        				row.CshEx_Cd = resData.APNT_TFRDEP_GUP[i].CshEx_Cd_DESC;
		        				row.bal = resData.APNT_TFRDEP_GUP[i].Crn_TfrOut_Srpls_Amt;
		        				
		        				gridData.push(row);
		    				}
		    			}
		    		});*/
		    		queryBalData(jsonData, fwTranId, function(resData){
		    			if(resData && resData.SUM_AMT_GUP){
		    				console.log(json2str(resData));
		    				resData.SUM_AMT_GUP.length && console.log('定期金额信息组长度：' + resData.SUM_AMT_GUP.length);
		    				var cstAccNo = resData.Cst_AccNo;
		    				var validRecordNum = resData.SUM_AMT_GUP.Vld_Rcrd_Cnt;//  @critical 有效记录数
		    				validRecordNum = !validRecordNum || isNaN(validRecordNum) ? 0 : parseInt(validRecordNum);
							console.log('有效记录数：' + validRecordNum);
							var arr = resData.SUM_AMT_GUP.FMTDT701_SUM_AMT_GUP1;
							if((validRecordNum > 0) && arr && arr.length){
								for(var i = 0; i < validRecordNum; i++){
									var row = {};
		            				row.Cst_AccNo = cstAccNo;
		            				row.CcyCd = arr[i].CcyCd_DESC;
		            				row.CshEx_Cd = arr[i].CshEx_Cd_DESC;
		            				row.bal = STM.corporateBill.getJE(arr[i].Smy_Act_Bal);
		            				
		            				gridData.push(row);
								}
								//  @critical 加载表格数据
				    			queryResultGrid.loadData(gridData);
							}
		    			}
		    		});
		    		break;
		    	case '3' : //  @critical 普通贷款
		    		fwTranId = 'A02110082-stm';
		    		
		    		queryBalData(jsonData, fwTranId, function(resData){
		    			if(resData && resData.AMT_CGY_INF_GRP && resData.BASIC_GRP){
		    				resData.AMT_CGY_INF_GRP.length && console.log('贷款金额信息组长度：' + resData.AMT_CGY_INF_GRP.length);
							var row = {};
		    				row.Cst_AccNo = resData.BASIC_GRP.Cst_AccNo;
		    				row.CcyCd = resData.BASIC_GRP.CcyCd_DESC;
		    				row.CshEx_Cd = '钞';
		    				row.bal = STM.corporateBill.getJE(resData.AMT_CGY_INF_GRP.LnAcc_Bal);
		    				gridData.push(row);
		    				//  @critical 加载表格数据
		        			queryResultGrid.loadData(gridData);
		    			}
		    		});
		    		break;
		    	case '4' : // @critical  财资账户
		    		fwTranId = 'A05820112-stm';
		        	
		        	// 根据活期403交易获取账户下所有的钞汇和币种组合 A0181S403-stm
		        	queryBalData(jsonData, 'A0181S403-HF', function(resData){
		        		if(resData && resData.AMT_INFO){
		        			if(resData.AMT_INFO.length){
		        				var loading = new PJF.ui.loading({});//不依赖dom元素
		        				var countAct = 0;// @critical  执行交易个数
		        				var len = resData.AMT_INFO.length;
		        				for(var i = 0; i < len; i++){
		        					+function() {
		        						var param1 = {};
		        						param1.Cst_AccNo = param.accNo;// 账户
		        						param1.CcyCd = resData.AMT_INFO[i].CcyCd;// 币种
		        						param1.CshEx_Cd = resData.AMT_INFO[i].CshEx_Cd;// 钞汇
		        						
		        						PJF.communication.cpsJsonReq({
		        				            fwServiceId: "simpleTransaction",
		        				            fwTranId: fwTranId,
		        				            async:true,
		        				            maskAll : true,
		        				            jsonData: PJF.util.json2str(param1),
		        				            success: function(resData){
		        				            	if(resData && resData.SA_INF){
			        	        					console.log(json2str(resData));
			        	        				    resData.SA_INF.length && console.log('财资金额信息组长度：' + resData.SA_INF.length);
			        	        					var row = {};
			        	            				row.Cst_AccNo = resData.SA_INF.Cst_AccNo;
			        	            				row.CcyCd = resData.SA_INF.CcyCd_DESC;
			        	            				row.CshEx_Cd = resData.SA_INF.CshEx_Cd_DESC;
			        	            				row.bal = STM.corporateBill.getJE(resData.SA_INF.Dep_AcBa);
			        	            				row.TheLvl_Dep_Bal = STM.corporateBill.getJE(resData.TheLvl_Dep_Bal);
			        	            				row.Hst_UpDep_Amt = STM.corporateBill.getJE(resData.Hst_UpDep_Amt);
			        	            				row.Hst_CshPl_Bal = STM.corporateBill.getJE(resData.Hst_CshPl_Bal);
			        	            				row.Hst_LwrLvl_Dep_Amt = STM.corporateBill.getJE(resData.Hst_LwrLvl_Dep_Amt);
			        	            				row.Hst_Supr_Lnd_Amt = STM.corporateBill.getJE(resData.Hst_Supr_Lnd_Amt);
			        	            				row.Hst_LwrLvl_Lnd_Amt = STM.corporateBill.getJE(resData.Hst_LwrLvl_Lnd_Amt);
			        	            				
			        	            				gridData.push(row);
		        				            	}
		        				            },
		        				            failure: function(arg){
		        				            	console.log('A05820112交易失败。账号：'+param.accNo+'<br>全局跟踪号:'+arg._COMMON.SYS_EVT_TRACE_ID
				                                		+'，错误码:'+arg.BK_CODE+'，错误描述:'+arg.BK_DESC);
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
		                    		if(n > 20){
		                    			loading.destroy();
		                    			clearInterval(pig);
		                    			STM.corporateBill.showAlertMsg('交易超时了，请稍后再试！');
		 	        	        		return;
		                    		}else{
		                    			if (countAct == len) {
			                                clearInterval(pig);
			                                console.log("结果集长度：" + gridData.length);
			                                // 加载表格数据
			                    			queryResultGrid.loadData(gridData);
			                                loading.destroy();
			                            }
		                    		}
		                    	},1000);
		                    	//心跳 end
		        			}
		        		}
		        	});
		        	
		    		break;
		    	default : break;
		    	}
			}
		});
		

    },
	destroy : function() {
	}
};