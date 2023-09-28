/**
 * @file 扫码验证
 * @author ZhangAXiong
 * @version 1.0
 * Create On
 * Last Updated 2021-01-29
 * 扫描回单二维码，查看回单信息
 */
function payCheckHF() {

}

// 在prototype里渲染各个页面组件
payCheckHF.prototype = {
	init : function(data) {
		data = data || {};
		var that = this;
		var responseData = data.resData;// 卡下所有的账户
		
		new PJF.ui.label({
			doms:['lt1','lt2','lt3','lt4','lt5','lt6','lt7'],
			values:['账号','户名','凭证类型','签票日期','凭证号码','金额','支付密码']
		});
		
		var cardData = [];// @critical 账户下拉内容
		var isExists = true;// @critical 账号是否存在
		/*if(0 == data.accountType){
			cardData = data.ptData;
		} else {
			cardData = data.czData;
		}*/
		// 账户下拉框数据写入
    	if(responseData && responseData.Reg_GRP && responseData.Reg_GRP.length){
    		cardData.push({"name":"0","desc":""});
    		for(var i = 0; i < responseData.Reg_GRP.length; i++){
    			var temp = responseData.Reg_GRP[i];
    			if(temp.Cst_AccNo){
    				var row = {};// 用于所属计划下拉框
    				row.desc = temp.Cst_AccNo;
    				row.name = temp.Cst_AccNo + "_" + temp.SgAcc_TpCd + "_" + temp.Acc_AccNm;
    				cardData.push(row);
    			}
    		}
    	}
		
		/*账户选择下拉框*/
		var accountNo;
		if(PJF.stm.util.hasInsertedCardCor() == true && cardData.length > 1){
			document.getElementById('accountNo').style.display = '';
			document.getElementById('accountNoText').style.display = 'none';
			accountNo = new PJF.ui.select({
				dom: 'accountNo',
				data: cardData,
				width : 480,
				defaultValue : '0', 
				autoComplete : true, 
				resizeFontSize : false,
				//required: true,
				onChange: function(){
					var tmp = accountNo.getValue().split("_");
					tmp = (tmp.length == 3) ? tmp[2] : "";
					PJF.html.content('accountName',tmp);
				}
			});
    	}else{
    		document.getElementById('accountNo').style.display = 'none';
			document.getElementById('accountNoText').style.display = '';
    		accountNo = new PJF.ui.textfield({
    			dom : 'accountNoText',
    			width : 480,
    			datatype: 'card',
    			onChange : function(){
    				var acctNo = accountNo.getValue();// 账号
    				acctNo = !acctNo ? '' : acctNo.replace(/\s+/g, "");
    				if(acctNo){
    					PJF.html.content('accountName', "");
    					that.getAcctName(acctNo, function(resp) {
    		            	console.log("E0181S421查询户名成功");
    		            	isExists = true;
    		            	PJF.html.content('accountName', resp.Cst_AccNo_Nm);
    		            }, function(failData) {
    		            	console.log("E0181S421查询户名失败");
    		            	isExists = false;
    		            	that.showMsg(null, failData);
    		            });
    				}
    			}
    		});
    	}
		
		/*凭证类型*/
		var typeData = [ {
			"desc" : "",
			"name" : "0"
		}, {
			"desc" : "支票",
			"name" : "0301"
		}, {
			"desc" : "转帐支票",
			"name" : "0302"
		}, {
			"desc" : "现金支票",
			"name" : "0303"
		}, {
			"desc" : "密码支票",
			"name" : "0304"
		}, {
			"desc" : "实时通付款凭证",
			"name" : "0405"
		}, {
			"desc" : "贷记凭证",
			"name" : "0311"
		}, {
			"desc" : "信汇凭证",
			"name" : "0702"
		}, {
			"desc" : "电汇凭证",
			"name" : "0703"
		}, {
			"desc" : "本票申请书",
			"name" : "3100"
		}, {
			"desc" : "汇票申请书",
			"name" : "3200"
		}, {
			"desc" : "其它",
			"name" : "9999"
		} ];

		/*凭证类型下拉框*/
		var voucherType = new PJF.ui.select({
			dom: 'voucherType',
			data: typeData,
			width : 480,
			defaultValue : '0',
			onChange: function(){
				
			}
		}); 
		/*签票日期*/
		/*var signTime = new PJF.ui.date({
			dom : "signTime",
			startYear:"2010"
		});*/
        /*var currentYear = new Date().getFullYear();//当前年
        var currentMonth = new Date().getMonth();//当前月
        var currentDay = new Date().getDate();//当前日*/
		var currentServerDate = PJF.communication.getServerTime("yyyy/MM/dd");
		console.log("》》》服务器当前时间："+currentServerDate);
        var signTime = new PJF.ui.calendar({
            dom : "signTime",
            defaultDate:new Date(currentServerDate)
        });
		/*凭证号码*/
		var voucherNo = new PJF.ui.textfield({
			dom : 'voucherNo',
			width : 480,
			datatype: 'number'
		});
		/*凭证金额*/
		var voucherMoney = new PJF.ui.textfield({
			dom : 'voucherMoney',
			width : 380,
			datatype : 'money',
			precision : 2
		});
		/*支付密码*/
		var checkCode = new PJF.ui.textfield({
			dom : 'checkCode',
			width : 480,
			datatype: 'card',
			onChange : function(){
			}
		});
		
		// 返回按钮
		var returnBtn = new PJF.ui.linkButton({
			dom : 'returnBtn',
			style : 'main',
			name : '返回',
			onClick : function() {
				template.loadPage('subMenuPage','CPB20008');
			}
		});
		
		// 确认按钮
		var confirmBtn = new PJF.ui.linkButton({
			dom : 'confirmBtn',
			style : 'main',
			appendStyle : 'confirm',
			name : '确认',
			onClick : function() {
				// 账号
				var acctNo = (PJF.stm.util.hasInsertedCardCor() == true 
						&& cardData.length > 1)?accountNo.getText():accountNo.getValue();
				acctNo = !acctNo ? '' : acctNo.replace(/\s+/g, "");
				var vchrType = voucherType.getValue();// 凭证类型
				//var signTktDate = signTime.getValue();// 签票日期
                var signTktDate = PJF.util.formatDate(signTime.getValue(),"yyyyMMdd");// 签票日期
				var vchrNo = voucherNo.getValue();// 凭证号码
				vchrNo = !vchrNo ? '' : vchrNo.replace(/\s+/g, "");
				var vchrCash = voucherMoney.getValue();// 凭证金额
				var pwd = checkCode.getValue();// 支付密码
				pwd = !pwd ? '' : pwd.replace(/\s+/g, "");
				//var nowDate = new Date();// 当前时间
				var nowDate = new Date(currentServerDate);
				var sign_Date = new Date(signTktDate.substring(0,4),(parseInt(signTktDate.substring(4,6))-1),signTktDate.substring(6,8));
                if(!acctNo || acctNo == '0' || isExists == false){
					STM.corporateBill.showAlertMsg('请选择或输入正确的账号');
					return;
				}
				if(!vchrType || vchrType == '0'){
					STM.corporateBill.showAlertMsg('请选择凭证类型');
					return;
				}
				if(!signTktDate){
					STM.corporateBill.showAlertMsg('请输入签票日期');
					return;
					//STM.corporateBill.showAlertMsg('请输入正確的签票日期');
				}
				if(sign_Date > nowDate){
					STM.corporateBill.showAlertMsg('签票日期不能晚于当前时间!');
					return;
				}
				if(!vchrNo){
					STM.corporateBill.showAlertMsg('请输入凭证号码');
					return;
				}
				/*if(vchrNo.length < 8){
					STM.corporateBill.showAlertMsg('请输入正确的凭证号码');
					return;
				}*/
				if(!vchrCash){
					STM.corporateBill.showAlertMsg('请输入金额');
					return;
				}
				if(!pwd){
					STM.corporateBill.showAlertMsg('请输入支付密码');
					return;
				}
				if(pwd.length != 16){
					STM.corporateBill.showAlertMsg('请输入16位支付密码');
					return;
				}
				//验证支付密码
	        	var jsonData = {};
            	
            	var ZFM_REQ_INFO = {};
    			ZFM_REQ_INFO.INM_MSG_TYPE = '0600';
    			ZFM_REQ_INFO.INM_SVR_TYPE = 'ZFM';
    			ZFM_REQ_INFO.INM_PROCESS_CODE = '911001';
    			ZFM_REQ_INFO.INM_CHANNEL_ID = '';
    			ZFM_REQ_INFO.INM_ORG_TELLER_ID = PJF.otherInfo.devId;// 柜员号
    			ZFM_REQ_INFO.INM_ORG_BRANCH_ID = PJF.userInfo.orgCode;// 机构号
    			ZFM_REQ_INFO.dc_sys_f_nodeid = '102001';// 安全节点号
    			jsonData.ZFM_REQ_INFO = [ ZFM_REQ_INFO ];
            	
            	jsonData.INM_MSG_TYPE = '0600';
    			jsonData.INM_SVR_TYPE = 'ZFM';
    			jsonData.INM_PROCESS_CODE = '911001';
    			jsonData.ACCT_NO = acctNo;// 账号(送卡号)
    			jsonData.Vchr_TpCd = vchrType;// 凭证种类
    			jsonData.ZFMM_DATE = signTktDate;// 签票日期
    			jsonData.DOC_NO = vchrNo;// 凭证号码
    			jsonData.DOC_AMT = vchrCash;// 金额
    			jsonData.ZFMM = pwd;// 支付密码
            	
            	PJF.communication.cpsJsonReq({
                    jsonData: PJF.util.json2str(jsonData),
                    fwServiceId: 'simpleTransaction',
                    fwTranId: 'ZFM911001-stm',
                    maskAll: true,
                    success: function(resp) {
                    	console.log("支付验密成功");
                    	template.loadPage('payCheckSuccHF');
                    },
                    failure: function(failData) {
                    	console.log("支付验密失败");
                    	that.showMsg(null, failData);
                		return;
                    }
                });
			}
		});

	},
    /**
     * @function getAcctName
     * @async
     * @param {String} acctNo 账号
     * @param {Object}succFunc 成功回调
     * @param {Object}failFunc 失败回调
     */
	getAcctName : function(acctNo, succFunc, failFunc){
		var jsonData = {
            Cst_AccNo: acctNo,
            CcyCd: "",
            CshEx_Cd: "",
            Trm_DepSeqNo: ""
		};
		PJF.communication.cpsJsonReq({
			fwServiceId: "simpleTransaction", // 调用通用交易原子服务
            fwTranId: "E0181S421-stm", // 外呼交易码
            async: false,
            jsonData: PJF.util.json2str(jsonData), // 请求参数json数据对象
            success: succFunc,
            failure: failFunc
        });
	},
    /**
     * @function showMsg
     * @param {Object} data
     * @param {String} data.msg 提示信息
     * @param {String} data.detailMsg 详细信息
     * @param {Object} errData 错误信息
     */
	showMsg : function(data, errData){
		var msg = '';
		var detailMsg = '';
		if (data && data.msg) {
			msg = data.msg;
		}
		if (data && data.detailMsg) {
			detailMsg = data.detailMsg;
		}
		if (!errData) {
			var msgBox = new PJF.ui.errorMessageBox({
				content: msg,
				detailMsg: detailMsg,
				buttonConfs: [{
					appendStyle: 'confirm',
					style: 'main',
					name: '确定',
					onClick: function() {}
				}]
			});
		} else {
			var msgBox = new PJF.ui.errorMessageBox({
				data: errData,
				buttonConfs: [{
					appendStyle: 'confirm',
					style: 'main',
					name: '确定',
					onClick: function() {}
				}]
			
			});
		}
	},
	destroy : function() {
	}
}