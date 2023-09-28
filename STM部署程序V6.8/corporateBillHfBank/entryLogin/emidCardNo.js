function emidCardNo() {
}
var gotoHomeFlag ;
var seconds = 120;
window.removeEventListener('click',window.eventHander,false);

emidCardNo.prototype = {
		init : function(data) {
			data = data || {};
			if(window.logoutFlag){
				clearTimeout(window.logoutFlag);
			}
			
			var valiAccountLenObj = {
					15:15,
					18:18,
					20:20,
					21:21,
					23:23
			};
			STM.corporateBill.curAccount = null;
			STM.corporateBill.Txn_CardNo = null;
			STM.corporateBill.remainCBList = null;
			STM.corporateBill.printRemainCB = false;
			STM.corporateBill.printCBCurTime = 0;
			
			delete STM.corporateBill.Cst_AccNo_Nm;
			
			window.gotoHomeHander = function (){
				clearTimeout(gotoHomeFlag);
				console.log('clickCardNo',gotoHomeFlag);
				
				gotoHomeFlag = setTimeout(function(){
					console.log(seconds + '秒未操作');
					clearTimeout(gotoHomeFlag);
					STM.corporateBill.curAccount = null;
					STM.corporateBill.Txn_CardNo = null;
					delete STM.corporateBill.Cst_AccNo_Nm;
					template.loadPage("homepage");
				},seconds*1000);
			}
			
			/*if(window.addEventListener){
				window.addEventListener('click',window.gotoHomeHander,false);
			}else if(window.attachEvent){
				window.attachEvent('onclick',window.gotoHomeHander);
			}
			gotoHomeFlag = setTimeout(function(){
				console.log(seconds + '秒未操作');
				clearTimeout(gotoHomeFlag);
				STM.corporateBill.curAccount = null;
				STM.corporateBill.Txn_CardNo = null;
				delete STM.corporateBill.Cst_AccNo_Nm;
				template.loadPage("homepage");
			},seconds*1000);*/
			
			$('body').delegate('#billNavbtn','click',function(e){
				e.stopPropagation();
				new PJF.ui.messageBox({
					title: "提示信息",
					content: '您确认退出?',
					buttonConfs: [{
						name: '确认',
						style: 'main',
						width: 200,
						height: 80,
						appendStyle : 'confirm',
						onClick: function () {
							STM.corporateBill.curAccount = null;
							STM.corporateBill.Txn_CardNo = null;
							delete STM.corporateBill.Cst_AccNo_Nm;
							$('div[id=billNavbtn]').remove();
							$('.template_navbtn').show();
							clearTimeout(gotoHomeFlag);
							if(window.logoutFlag){
								clearTimeout(window.logoutFlag);
							}
							template.loadPage("homepage");
						}
					}, {
						bgColor: 'rgb(121,198,30)',
						name: '取消',
						style: 'main',
						width: 200,
						height: 80,
						onClick: function () {
							console.log('退出时间:'+(new Date().toString()));
						}
					}]
				});
			});
			console.log(45,$('.template_navbtn').length,$('div[id=billNavbtn]').length,$('.template_navbar').length);
			$('.template_navbtn').hide();
			$('div[id=billNavbtn]').remove();
			$('.template_navbar').append('<div class="template_navbtn" id="billNavbtn"><div class="template_navbtn_home"></div></div>');
			$('.template_navbar').show();
			
			var ptBtn = new PJF.ui.linkButton({
		        dom: 'confirmBtn',
		        style : 'main',
				appendStyle : 'confirm',
		        name: '确认',
		        fontSize: '30',
		        onClick: function() {
		        	var accountVal = account.getValue();
		        	if(accountVal.length && valiAccountLenObj[accountVal.length] && (/^[0-9]+$/.test(accountVal))){
		        		clearTimeout(gotoHomeFlag);
		        		template.loadPage('emidCardPwd',{accNo:account.getValue()});
		        	}else{
		        		STM.corporateBill.showAlertMsg('请输入正确的账号!');
		        	}
		        	
		        	}
		        });
			
			// var tempBtn = new PJF.ui.linkButton({
		    //     dom: 'tempBtn',
		    //     style : 'main',
			// 	appendStyle : 'confirm',
		    //     name: '测试',
		    //     fontSize: '30',
		    //     onClick: function() {
		    //     	var accountVal = account.getValue();
		    //     	if(accountVal.length && (accountVal.length==20||accountVal.length==18||accountVal.length==15) && (/^[0-9]+$/.test(accountVal))){
		    //     		clearTimeout(gotoHomeFlag);
			// 			STM.corporateBill.curAccount = accountVal;
			// 			STM.corporateBill.Txn_CardNo = accountVal; 
		    //     		template.loadPage('entryIndex',{accNo:accountVal});
		    //     	}else{
		    //     		STM.corporateBill.showAlertMsg('请输入正确的账号!');
		    //     	}
		        	
		    //     	}
		    //     });
			
			var account = new PJF.ui.textfield({
				dom:"account", 
				width : 550,
				 height: 60,
				datatype : 'number',
				required : true,
				validType : ['number','accountRule'],
		        invalidMessage : ['请输入数字','请输入正确的账号']
					});
			

			PJF.validator.expand({
				accountRule : {
			        key : "accountRule",
			        fn : function() {
			        	var accountVal = account.getValue();
			        	if(accountVal.length){
			        		return valiAccountLenObj[accountVal.length]?true:false;
			        	}else{
			        		return false;
			        	}
			        }
			    }
			}); 
			
			window.setTimeout(function(){
				if(data.accNo){
					account.setValue(data.accNo);
				}
				$('#account').focus();
				account.focus();
			},1000);
			
		},
		destroy : function() {
			clearTimeout(gotoHomeFlag);
		}
}