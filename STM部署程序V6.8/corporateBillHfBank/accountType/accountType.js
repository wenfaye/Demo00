/**
 * @file 账户类型选择
 * @author ZhangAXiong
 * @version 1.0
 * Last Updated 2021-01-19
 * 每个账户有区分普通账户跟财资账户，这里主要用于两者的切换
 */

function accountTypeHF(){

}

//在prototype里渲染各个页面组件
accountTypeHF.prototype = {
	init:function(data){
		if(!data){
			return;
		};

		var flag = false;//@critical 判断是回单（打印、补打）功能还是明细查询功能：true是回单
		
		if('printCBDetailHF' == data.menu || 'printPatchCBDetailHF' == data.menu){
			flag = true;
			data.indexSelect = 0;
    	}
		
		// @critical 普通账户
		var ptBtn = new PJF.ui.linkButton({
	        dom: 'ptBtn',
	        style: 'metro',
	        name: '普通账户',
	        fontSize: '30',
	        width: '180',
	        height: '180',
	        iconUrl: '/ecpweb/page/stm/common/icon/bill_account_pt.png',
	        textColor: 'rgb(0,102,179)',
	        onClick: function() {
	        	if(flag){
	        		data.SgAcc_TpCd = 1;
	        	}
	        	data.accountType = 0;//@critical 0-普通账户，1-财资账户（全量明细），2-财资账户（过滤明细），3-财资账户（对账单）
	        	data.prevMenu = 'accountTypeHF';
	        	template.loadPage(data.menu, data);
	        }
		});
		
		//@critical  财资账户
		var czBtn = new PJF.ui.linkButton({
	        dom: 'czBtn',
	        style: 'metro',
	        name: '财资账户',
	        fontSize: '30',
	        width: '180',
	        height: '180',
	        iconUrl: '/ecpweb/page/stm/common/icon/bill_account_cz.png',
	        textColor: 'rgb(0,102,179)',
	        onClick: function() {
	        	if(flag){
	        		data.SgAcc_TpCd = 4;
	        		data.prevMenu = 'accountTypeHF';
	        		template.loadPage(data.menu, data);
	        	} else {
	        		template.loadPage('detailTypeHF', data);
	        	}
	        }
		});
		
		//返回
		var returnBtn = new PJF.ui.linkButton({
		        dom: 'returnBtn',
		        style:'main',
		        name: '返回',
		        onClick: function() {
		        	template.loadPage('subMenuPage','CPB20008');
		        }
		});
	},
	destroy:function(){}
}