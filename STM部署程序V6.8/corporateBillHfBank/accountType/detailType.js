/**
 * @file  明细种类选择
 * @author ZhangAXiong
 * @version 1.0
 * Last Updated 2021-01-19
 * 明细查询菜单进入时的可选标签
 *1.全量明细、过滤明细、对账单是html打印
 * 2.对账清单是pdf打印
 */
function detailTypeHF(){

}

//在prototype里渲染各个页面组件
detailTypeHF.prototype = {
	init:function(data){
		if(!data){
			return;
		};
		data.prevMenu = 'detailTypeHF';
		// @critical 全量明细
		var qlmxBtn = new PJF.ui.linkButton({
	        dom: 'qlmxBtn',
	        style: 'metro',
	        name: '全量明细',
	        fontSize: '30',
	        width: '180',
	        height: '180',
	        iconUrl: '/ecpweb/page/stm/common/icon/bill_cz_qlmx.png',
	        textColor: 'rgb(0,102,179)',
	        onClick: function() {
	        	data.accountType = 1;//@critical 0-普通账户，1-财资账户（全量明细），2-财资账户（过滤明细），3-财资账户（对账单）
				template.loadPage(data.menu,data);
	        }
		});
		
		// @critical 过滤明细
		var glmxBtn = new PJF.ui.linkButton({
	        dom: 'glmxBtn',
	        style: 'metro',
	        name: '过滤明细',
	        fontSize: '30',
	        width: '180',
	        height: '180',
	        iconUrl: '/ecpweb/page/stm/common/icon/bill_cz_glmx.png',
	        textColor: 'rgb(0,102,179)',
	        onClick: function() {
	        	data.accountType = 2;//@critical 0-普通账户，1-财资账户（全量明细），2-财资账户（过滤明细），3-财资账户（对账单）
				template.loadPage(data.menu,data);
	        }
		});
		
		// @critical 对账单
		var dzdBtn = new PJF.ui.linkButton({
	        dom: 'dzdBtn',
	        style: 'metro',
	        name: '对账单',
	        fontSize: '30',
	        width: '180',
	        height: '180',
	        iconUrl: '/ecpweb/page/stm/common/icon/bill_cz_dzd.png',
	        textColor: 'rgb(0,102,179)',
	        onClick: function() {
	        	data.accountType = 3;//@critical 0-普通账户，1-财资账户（全量明细），2-财资账户（过滤明细），3-财资账户（对账单）
				template.loadPage(data.menu,data);
	        }
		});
		
		// @critical 对账清单
		var dzqdBtn = new PJF.ui.linkButton({
	        dom: 'dzqdBtn',
	        style: 'metro',
	        name: '对账清单',
	        fontSize: '30',
	        width: '180',
	        height: '180',
	        iconUrl: '/ecpweb/page/stm/common/icon/bill_cz_dzqd.png',
	        textColor: 'rgb(0,102,179)',
	        onClick: function() {
				template.loadPage('queryBillListDetailHF',data);
	        }
		});
		
		//返回
		var returnBtn = new PJF.ui.linkButton({
		        dom: 'returnBtn',
		        style:'main',
		        name: '返回',
		        onClick: function() {
		        	template.loadPage("accountTypeHF",data);
		        }
		});
	},
	destroy:function(){}
}