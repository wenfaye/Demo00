/**
 * @file 扫码验证成功
 * @author ZhangAXiong
 * @version 1.0
 * Create On
 * Last Updated 2021-01-29
 * 支付校验成功后跳转页面
 */
function payCheckSuccHF(){
	
}

/**
 * 支付校验成功后跳转页面js
 * */
payCheckSuccHF.prototype = {
	init:function(data){
		// 返回
		var returnBtn = new PJF.ui.linkButton({
	        dom: 'returnBtn',
	        name : '返回',
			style: 'main',
	        onClick: function() {
	        	template.loadPage('subMenuPage','CPB20008');
	        }
		});	
	},
	destroy:function(){
		
	}
}