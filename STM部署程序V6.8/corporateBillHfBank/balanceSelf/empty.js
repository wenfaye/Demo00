/**
 * @file 空文件
 * @author ZhangAXiong
 * @version 1.0
 * Create On
 * * Last Updated 2021-01-19
 * 用于跳转自助对账页面
 */
function emptyHF() {
}
emptyHF.prototype = {
		init : function(data) {
			if (!data) {
				//return;
			};
			
			template.loadPage('balanceSelfHF',data);
		},
		destroy : function() {
		}
}
