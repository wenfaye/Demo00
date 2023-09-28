function queryCBDetailHF() {

}
var accNo = '';

// 在prototype里渲染各个页面组件
queryCBDetailHF.prototype = {
	init : function(data) {
		/*if (!data) {
			return;
		}*/
		data = data || {};
		accNo = data.accNo?data.accNo:STM.corporateBill.curAccount;
		
		/** 币种类别*/
    	var ccyCdArray = [];
    	var ccyCdArray_val = ["156","840","978","344","392","826","036","554","901","446","410","124","643","764","702","578","752","208","756","784","398","458","484","710","682"];
    	var ccyCdArray_desc = ["人民币","美元","欧元（EUR）","香港元","日元","英镑","澳大利亚元","新西兰元","新台湾元","澳门元","元（韩元）","加拿大元（加元）","俄罗斯卢布","铢（泰国铢）","新加坡元","挪威克朗","瑞典克朗","丹麦克朗","瑞士法郎","UAE迪拉姆","哈萨克斯坦坚戈","马来西亚林吉特","墨西哥比索","南非兰特","沙特里亚尔"];
    	for(var i = 0;i < ccyCdArray_val.length-1;i++){
    		var ccyCdArrays = {};
    		ccyCdArrays.name = ccyCdArray_val[i];
    		ccyCdArrays.desc = ccyCdArray_desc[i];
    		ccyCdArray.push(ccyCdArrays);
    	}
    	
    	
		var serverDate = PJF.communication.getServerTime();
		var cardData = [];
		
		data.accountType = 0;
		if(0 == data.accountType){
			cardData = data.ptData;
		} else {
			cardData = data.czData;
		}
		
		if(data.accNo){
			$('#accountNo').text(data.accNo);
		}else if(data.select_account&&data.select_account.length){
			accNo = data.select_account;
			$('#accountNo').text(data.select_account);
		}
		
		/*
		var accountNo = new PJF.ui.select({
			dom: 'accountNo',
			data: cardData,
			width : 480,
			onChange: function(){
				tmp = accountNo.getValue().split("_");
				tpCd = tmp[1];
				/*if(2 ==tpCd){
					document.getElementById('Trm_DepSeqNo_ID').style.display = 'block';
				}else{
					document.getElementById('Trm_DepSeqNo_ID').style.display = 'none';
				}*/

				/*if(2 == tpCd||3 == tpCd||4 == tpCd){//对账单没有发生额这个查询条件(修改成只有活期有发生额)
					document.getElementById('moneyId').style.display = 'none';
				}else{
					document.getElementById('moneyId').style.display = 'block';
				}
				if(2 == tpCd||3 == tpCd){//定期与贷款没有币种和钞汇鉴别
					document.getElementById('CcyCd_ID').style.display = 'none';
				}else{
					document.getElementById('CcyCd_ID').style.display = 'block';
				}
				//通过交易获取币别
				getCcyCdVals(tmp);
			}
		}); */
		
		var CshEx_Cd_Data = [{'name':'','desc':'请选择'},{'name':'1','desc':'钞'},{'name':'2','desc':'汇'}];
		var CshEx_Cd = new PJF.ui.select({
			dom: 'CshEx_Cd',
			data: CshEx_Cd_Data,
			onChange: function(){
			}
		}); 
		var begin_date = "";
		var end_date = "";
		var selectTime = new PJF.ui.checkbox({
			dom : 'selectTime',
			singleSelect : true,
			data : [ {
				desc : '本月',
				value : '1'
			}, {
				desc : '上月',
				value : '2'
			}, {
				desc : '自定义',
				value : '3'
			} ],
			type : "horizontal",
			onClick : function() {
				if (1 == selectTime.getValue()) {
					begin_date = serverDate.substr(0,6) + '01';
					end_date = serverDate;
				} else if (2 == selectTime.getValue()) {
					var nowYear = serverDate.substr(0,4);
					var nowMonth = serverDate.substr(4,2) -1;
					var lastMonth = nowMonth - 1;
					var lastMonthStartDate = new Date(nowYear, lastMonth, 1);
					var nowMonthStartDate = new Date(nowYear, nowMonth, 1);
					var lastDays = (nowMonthStartDate - lastMonthStartDate)/(1000 * 60 * 60 * 24);
					
					begin_date = PJF.util.formatDate(lastMonthStartDate,"yyyyMMdd");
					end_date = PJF.util.formatDate(lastMonthStartDate,"yyyyMM") + '' + lastDays;
				}

				if (3 == selectTime.getValue()) {
					document.getElementById('timeId').style.display = '';
				} else {
					document.getElementById('timeId').style.display = 'none';
				}
			}
		});
		
		
		var currentYear = new Date().getFullYear();//当前年
		var currentMonth = new Date().getMonth();//当前月
		var currentDay = new Date().getDate();//当前日
		var startTime = new PJF.ui.calendar({
            dom : "startTime",
            defaultDate:new Date(serverDate.substr(0,4), serverDate.substr(4,2)-1, serverDate.substr(6,2))
        });
        var endTime = new PJF.ui.calendar({
            dom : "endTime",
            defaultDate:new Date(serverDate.substr(0,4), serverDate.substr(4,2)-1, serverDate.substr(6,2))
        });

		var minNo = new PJF.ui.textfield({
			dom : 'minNo',
			width : 180,
			datatype : 'money'
		});

		var maxNo = new PJF.ui.textfield({
			dom : 'maxNo',
			width : 180,
			datatype : 'money'
		});

		/*var Trm_DepSeqNo =  new PJF.ui.textfield({
			dom : 'Trm_DepSeqNo',
			width : 180,
			datatype : 'number'
		});*/
		
		// 结果页面返回初始化查询页面
		if(null != data && '' != data && data.select_account){
			$('#accountNo').text(data.select_account);
			//accountNo.setValue(data.select_account);
			selectTime.setValue(data.SELECT_FLAG);
			if(3 == data.SELECT_FLAG){
				document.getElementById('timeId').style.display = '';
				
				startTime.setValue(new Date(data.StDt.substr(0,4), data.StDt.substr(4,2)-1, data.StDt.substr(6,2)));
				endTime.setValue(new Date(data.EdDt.substr(0,4), data.EdDt.substr(4,2)-1, data.EdDt.substr(6,2)));
			} else {
				begin_date = data.StDt;
				end_date = data.EdDt;
			}
		} else {
			selectTime.setValue('1');
			//第一次进页面初始化本月
			begin_date = serverDate.substr(0,6) + '01';
			end_date = serverDate;
		}
		/*var tmp = accountNo.getValue().split("_");
		var tpCd = tmp[1];*/
		var tmp = [accNo,'1']
		var tpCd = tmp[1];
		//var ccyCdData = [{name:'156',desc:'CNY人民币元'}];

		var CcyCd = new PJF.ui.select({
			dom : 'CcyCd',
			data: [],
			onChange: function(){
				if ('156' == CcyCd.getValue()) {
					// 币别为人民币,钞汇鉴别不可输
					CshEx_Cd.setValue('1', false);
					CshEx_Cd.disabled();
				} else {
					CshEx_Cd.enable();
				}
			}
		});
		/**
		 * 数组去重
		 */
		function unique(arr){
		    var res = [];
		    var obj = {};
		    for(var i=0; i<arr.length; i++){
		       if( !obj[arr[i].name] ){
		            obj[arr[i].name] = 1;
		            res.push(arr[i]);
		        }
		    } 
		 return res;
		}
		/**
		 * 根据交易获取比别（活期，贷款，其余都默认）
		 */
		var getCcyCdVals = function(tmp){
			CshEx_Cd.enable();
			CcyCd.enable();
			if('2'==tmp[1]){//定期
				var jsonData = {}
				jsonData.Cst_AccNo = tmp[0];
				PJF.communication.cpsJsonReq({
				    fwServiceId: 'simpleTransaction',
				    fwTranId: 'A0181T701-stm',
				    async: true, //默认同步
				    jsonData: PJF.util.json2str(jsonData),
				    success: function(resp) {
				    	var CcyCdarrs = [];
				    	if(resp && resp.SUM_AMT_GUP && resp.SUM_AMT_GUP.FMTDT701_SUM_AMT_GUP1){
				    		if(resp.SUM_AMT_GUP.FMTDT701_SUM_AMT_GUP1.length < 1 || "" == resp.SUM_AMT_GUP.FMTDT701_SUM_AMT_GUP1[0].CcyCd){
				    			CcyCd.setData(ccyCdArray);
				    			CcyCd.setValue(ccyCdArray[0].name);
				    		}else{
				    			
				    			for(var i = 0;i<resp.SUM_AMT_GUP.FMTDT701_SUM_AMT_GUP1.length;i++){
				    				if("" != resp.SUM_AMT_GUP.FMTDT701_SUM_AMT_GUP1[i].CcyCd){
				    					var CcyCdarr = {};
				    					CcyCdarr.name = resp.SUM_AMT_GUP.FMTDT701_SUM_AMT_GUP1[i].CcyCd;
				    					CcyCdarr.desc = resp.SUM_AMT_GUP.FMTDT701_SUM_AMT_GUP1[i].CcyCd_DESC;
				    					CcyCdarrs.push(CcyCdarr);
				    				}
				    			}
				    			var CcyCdarrs_unique = unique(CcyCdarrs);
		    					CcyCd.setData(CcyCdarrs_unique);  
		    					CcyCd.setValue(CcyCdarrs_unique[0].name);
				    		}
				    	}
				    	
				    },
				    failure: function(responseData) {
				    	CcyCd.setData(ccyCdArray); 
				    	CcyCd.setValue(ccyCdArray[0].name);
				    }
				});
			}
			
			//币别反显
			else if('1'==tmp[1]){//活期
				var jsonData = {}
				jsonData.Cst_AccNo = tmp[0];
				PJF.communication.cpsJsonReq({
				    fwServiceId: 'simpleTransaction',
				    fwTranId: 'A0181S401-stm-dal',
				    //fwTranId: 'A0181S401-HF',
				    async: true, //默认同步
				    jsonData: PJF.util.json2str(jsonData),
				    success: function(resp) {
				    	if(resp){
				    		
				    		//如果为单币种 反显币别与钞汇 并不可编辑
				    		if(resp.MCcy_Acc_Ind == '0'){
				    			var CcyCdarrs = [];
				    			var CcyCdarr = {};
				    			var CcyCd_DESC = '';
				    			
				    			ccyCdArray.forEach(function(item,i){
				    				if(item.name == resp.CcyCd ){
				    					CcyCd_DESC = item.desc;
				    				}
				    			});
				    			
		    					CcyCdarr.name = resp.CcyCd;
		    					CcyCdarr.desc = CcyCd_DESC;
		    					CcyCdarrs.push(CcyCdarr);
		    					CcyCd.setData(CcyCdarrs);  
		    					CcyCd.setValue(CcyCdarrs[0].name);
		    					
		    					CshEx_Cd.setValue(resp.CshEx_Cd);
		    					CshEx_Cd.disabled();
		    					CcyCd.disabled();
							}else{
								CcyCd.setData(ccyCdArray);
				    			CcyCd.setValue(ccyCdArray[0].name);
				    		}
				    	}
			    		if(data.CcyCd && data.CcyCd.length){
			    			CcyCd.setValue(data.CcyCd);
			    		}
				    },
				    failure: function(responseData) {
				    	CcyCd.setData(ccyCdArray); 
				    	CcyCd.setValue(ccyCdArray[0].name);
			    		if(data.CcyCd && data.CcyCd.length){
			    			CcyCd.setValue(data.CcyCd);
			    		}
				    }
				});
			
				
			}
			else if('3'==tmp[1]){//贷款
				CcyCd.setData(ccyCdArray); 
		    	CcyCd.setValue(ccyCdArray[0].name);
				/*var ccyCddata = [];
				var jsonData = {}
				jsonData.Cst_AccNo = tmp[0];
				PJF.communication.cpsJsonReq({
				    fwServiceId: 'simpleTransaction',
				    fwTranId: 'A02110081-stm',
				    async: true, //默认同步
				    jsonData: PJF.util.json2str(jsonData),
				    success: function(resp) {
				    	if(resp && resp.BASIC_GRP){
				    		if("" == resp.BASIC_GRP.CcyCd){
				    			CcyCd.setData(ccyCdArray);
				    			CcyCd.setValue(ccyCdArray[0].name);
				    		}else{
				    			var CcyCdarrs = [];
				    			var CcyCdarr = {};
		    					CcyCdarr.name = resp.BASIC_GRP.CcyCd;
		    					CcyCdarr.desc = resp.BASIC_GRP.CcyCd_DESC;
		    					CcyCdarrs.push(CcyCdarr);
		    					CcyCd.setData(CcyCdarrs);  
		    					CcyCd.setValue(CcyCdarrs[0].name);
				    		}
				    	}
				    	console.debug(resp);	
				    	
				    },
				    failure: function(responseData) {
				    	CcyCd.setData(ccyCdArray); 
				    	CcyCd.setValue(ccyCdArray[0].name);
				    }
				});*/
			}else{
				CcyCd.setData(ccyCdArray);
				CcyCd.setValue(ccyCdArray[0].name);
			}
		}
		//根据交易获取比别
		getCcyCdVals(tmp);
		/*if(2 ==tpCd){
			document.getElementById('Trm_DepSeqNo_ID').style.display = 'block';
		}else{
			document.getElementById('Trm_DepSeqNo_ID').style.display = 'none';
		}*/

		if(2 == tpCd||3 == tpCd||4 == tpCd){//对账单没有发生额这个查询条件(修改成只有活期有发生额)
			document.getElementById('moneyId').style.display = 'none';
		}else{
			document.getElementById('moneyId').style.display = 'block';
		}
		
		if(2 == tpCd||3 == tpCd){//定期与贷款没有币种和钞汇鉴别
			document.getElementById('CcyCd_ID').style.display = 'none';
		}else{
			document.getElementById('CcyCd_ID').style.display = 'block';
		}

		// 返回按钮
		var returnBtn = new PJF.ui.linkButton({
			dom : 'returnBtn',
			style : 'main',
			name : '返回',
			onClick : function() {
				/*
				if(data.prevMenu){
					var cardData = {};
					cardData.Txn_CardNo = data.Txn_CardNo;
					cardData.ptData = data.ptData;
					cardData.czData = data.czData;
					cardData.menu = data.menu;
					cardData.accNo = accNo;
					//返回自助对账
					if(data.targetFlag && '2' == data.targetFlag){
						cardData = data.baseData;
					}
					template.loadPage(data.prevMenu,cardData);
				} else {
					//template.loadPage('subMenuPage','CPB20008');
					template.loadPage('balanceSelfHF',{
						accNo:accNo
					});
				}*/
				template.loadPage('entryIndex',{
					accNo:accNo
				});
			}
		});

		
		
		//请设置查询条件，点击确认查询
		PJF.communication.player.PlaySoundByUrl("app/corporateBill/01.wav");
		
		// 确认按钮
		var confirmBtn = new PJF.ui.linkButton({
			dom : 'confirmBtn',
			style : 'main',
			appendStyle : 'confirm',
			name : '确认',
			onClick : function() {
				begin_date = 3 == selectTime.getValue() ? startTime.getValue()
						: begin_date;
				end_date = 3 == selectTime.getValue() ? endTime.getValue() : end_date;

				if(3 == selectTime.getValue()){
					var nowTime = serverDate;
					var nowDate = new Date(nowTime.substr(0,4), nowTime.substr(4,2)-1, nowTime.substr(6,2));
					//获取开始时间
					var startDate = begin_date;
					
					//获取结束时间
					var endDate = end_date;
					
					
					if(endDate < startDate){
						STM.corporateBill.showAlertMsg('结束时间必须晚于开始时间!');
						return;
					}
					if(((endDate - startDate)/(1000 * 60 * 60 * 24)) > 92){
						STM.corporateBill.showAlertMsg('查询时间必须在92天内!');
						return;
					}
					var lastDate = new Date(end_date);
					lastDate.setFullYear(lastDate.getFullYear()-1);
					if(startDate < lastDate){
						STM.corporateBill.showAlertMsg('查询时间必须在一年内!');
						return;
					}
					if(startDate > nowDate){
						STM.corporateBill.showAlertMsg('查询开始时间不能晚于当前时间!');
						return;
					}
					if(endDate > nowDate){
						STM.corporateBill.showAlertMsg('查询结束时间不能晚于当前时间!');
						return;
					}
					begin_date = PJF.util.formatDate(begin_date,"yyyyMMdd");
					end_date = PJF.util.formatDate(end_date,"yyyyMMdd");
				}
				if(!('2' == tmp[1]) && '' == CcyCd.getValue()){
					STM.corporateBill.showAlertMsg('币别不能为空');
					return;
				}
				/*if('2' == tmp[1] && '' == Trm_DepSeqNo.getValue()){
					STM.corporateBill.showAlertMsg('定期笔号不能为空');
					return;
				}*/
				if(('1' == tmp[1] || '4' == tmp[1]) && '' == CshEx_Cd.getValue()){
					STM.corporateBill.showAlertMsg('钞汇鉴别不能为空');
					return;
				}
				if(minNo.getValue() && maxNo.getValue() && (parseFloat(minNo.getValue()) > parseFloat(maxNo.getValue()))){
					STM.corporateBill.showAlertMsg('发生额最小值不能大于最大值');
					return;
				}
				
				var jsonData = {};
				jsonData.select_account = accNo;
				jsonData.Cst_AccNo = accNo;
				//jsonData.select_account = accountNo.getValue();
				//var tmp = accountNo.getValue().split("_");
				//jsonData.Cst_AccNo = tmp[0];
				//jsonData.TpCd = tmp[1];//账户类型：1-普通活期；2-普通定期；3-普通贷款；4-财资账户
				//jsonData.Acc_AccNm = tmp[2];//账户名称
				jsonData.Acc_AccNm = STM.corporateBill.Cst_AccNo_Nm;
				jsonData.TpCd = 1;
				jsonData.accountType = data.accountType;//0-普通账户，1-财资账户（全量明细），2-财资账户（过滤明细），3-财资账户（对账单）
				jsonData.SELECT_FLAG = selectTime.getValue();
				jsonData.Txn_CardNo = data.Txn_CardNo;
				jsonData.CCBIns_ID = PJF.roleInfo.orgCode;
				jsonData.ptData = data.ptData;
				jsonData.czData = data.czData;
				jsonData.prevMenu = data.prevMenu;
				jsonData.menu = data.menu;
				if('1'==tmp[1]){//S405交易请求
					jsonData.CcyCd=CcyCd.getValue();
					jsonData.CcyCd_DESC=CcyCd.getText();
					jsonData.CshEx_Cd=CshEx_Cd.getValue();
					jsonData.StDt = begin_date;
					jsonData.EdDt = end_date ;//不能查询当天
					jsonData.Strt_Amt= minNo.getValue();
					jsonData.End_Amt = maxNo.getValue();
				}
				else if('2'==tmp[1]){//A0181T703交易请求
					//jsonData.Trm_DepSeqNo=Trm_DepSeqNo.getValue();
					jsonData.Enqr_Dtl_TpCd='5';
					jsonData.StDt = begin_date;
					jsonData.EdDt = end_date;
					jsonData.Cst_Enqr_Shldng_Ind='';
				}
				else if('3'==tmp[1]){//A02111050交易请求
					jsonData.Enqr_StDt = begin_date;
					jsonData.Enqr_CODt = end_date;
					jsonData.Ln_TxnAmt_TpCd= '';
					jsonData.StDt = begin_date;
					jsonData.EdDt = end_date;
				}
				else if('4'==tmp[1] ){
					if( '1'==data.accountType){//A05820113交易请求
						jsonData.CcyCd=CcyCd.getValue();
						jsonData.CcyCd_DESC=CcyCd.getText();
						jsonData.CshEx_Cd=CshEx_Cd.getValue();
						jsonData.StDt = begin_date;
						jsonData.EdDt = end_date;
						jsonData.Dep_TxnAmt='';
						jsonData.CshPl_Acc_Dtl_SN = '';
					}
					if( '2'==data.accountType){//A05820114交易请求
						jsonData.CcyCd=CcyCd.getValue();
						jsonData.CcyCd_DESC=CcyCd.getText();
						jsonData.CshEx_Cd=CshEx_Cd.getValue();
						jsonData.StDt = begin_date;
						jsonData.EdDt = end_date;
					}
					if( '3'==data.accountType){//S405交易请求
						jsonData.CcyCd=CcyCd.getValue();
						jsonData.CcyCd_DESC=CcyCd.getText();
						jsonData.CshEx_Cd=CshEx_Cd.getValue();
						jsonData.StDt = begin_date;
						jsonData.EdDt = end_date;
						jsonData.Strt_Amt= minNo.getValue();
						jsonData.End_Amt = maxNo.getValue();
					}
				}
				//自助对账跳转过来
				if(data.targetFlag){
					jsonData.targetFlag = data.targetFlag;
					jsonData.baseData = data.baseData;
				}

				//放到第二个界面去做请求交易
				template.loadPage("queryCBResultHF",jsonData);
			}
		});

	},
	destroy : function() {
	}
}