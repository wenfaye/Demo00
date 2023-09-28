function identifyingCode() {
}

identifyingCode.prototype = {
		init : function(data) {
			data = data || {};
			
			//dom会和后端对接后，替换
	        var Txn_Dt = new PJF.ui.date({
	            dom : 'Txn_Dt',
	            required : true,
	            startYear:"2010"
	        });
	        
	        var SMS_Vld_CD = new PJF.ui.textfield({
	            dom : 'SMS_Vld_CD',
	            width : 400,
	            datatype : 'number',
	            required : true,
	            validType : ['length[12]'],
	            invalidMessage : ['请输入正确的十二位验证码']
	        });
	        /**
	         *  validType : ['number','length[12]'],
	            invalidMessage : ['请输入正确的数字验证码','请输入正确的十二位验证码']
	         * */
	        //返回
	        var returnBtn = new PJF.ui.linkButton({
	            dom: 'returnBtn',
	            name: '返回',
	            style: 'main',
	            onClick: function () {
	            	template.loadPage('entryIndex', {
	            		accNo : data.accNo
					});
	               /* 
	                template.loadPage('subMenuPage', 'CPB20008');
	            	template.loadPage('validatorCBIndex', {
						accNo:data.accNo
					});
	            	*/
	            }
	        });
	        //确认
	        var confirmBtn = new PJF.ui.linkButton({
	            dom: 'confirmBtn',
	            name: '确认',
	            style: 'main',
	            appendStyle: 'confirm',
	            onClick: function () {
	            	if(!PJF.html.validatedArea("identifyingInfo")){
	                    STM.corporateBill.showAlertMsg("尊敬的客户，您有项目没有输入完全或格式错误。");
	                }else{
	            	var reqData = {
	            			Pcs_StCd: '1',
	            			Fdbk_Chnl_ID: '1',
	            			Txn_Dt:Txn_Dt.getValue(),
	            			SMS_Vld_CD:SMS_Vld_CD.getValue()
	            	}
	            	PJF.communication.cpsJsonReq({
	    	            fwServiceId: "simpleTransaction",
	    	            fwTranId: 'A07824612-HF',
	    	            async:true,
	    	            maskAll : true,
	    	            jsonData: PJF.util.json2str(reqData),
	    	            success: function(resData){
	    	            	 STM.corporateBill.showAlertMsg("查询回单验证成功。");
	    	            },
	    	            failure: function(responseData){
	    	            	STM.corporateBill.showErrorMsg(responseData, '查询回单验证失败');
	    	            }
	    			});
	            }
	               /* var phone =  Txn_Dt.getValue();
	                var code = Txn_Dt.getValue();
	                console.log("手机号："+phone+",验证码："+code);
	                // @critical 页面如果有未通过校验的信息，那么就会拦截
	                if(!PJF.html.validatedArea("identifyingInfo")){
	                    STM.corporateBill.showAlertMsg("尊敬的客户，您有项目没有输入完全或格式错误。");
	                }else{
	                	var param = {}
	                }
	                // @critical 发起交易，校验验证码是否正确，正确进入未回签账单回签查询
	                data.btnId = 'btn1';
	                data.phone = phone;
	                data.code = code;
	                template.loadPage('unSignedBill', data);*/
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
			
			var printServiceTime = STM.corporateBill.printServiceTime||PJF.communication.getServerTime("yyyy-MM-dd HH:mm:ss");
			//console.log('printServiceTime:'+PJF.util.formatDate(new Date(printServiceTime),"yyyyMMdd"));
			var printServiceDate = PJF.util.formatDate(new Date(printServiceTime),"yyyyMMdd")
			Txn_Dt.setValue(printServiceDate);
			
		},
		destroy : function() {
		}
}