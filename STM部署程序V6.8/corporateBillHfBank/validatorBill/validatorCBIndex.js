function validatorCBIndex() {
}

validatorCBIndex.prototype = {
		init : function(data) {
			data = data || {};
			

			var identifyingCodeBtn = new PJF.ui.linkButton({
		        dom: 'identifyingCodeBtn',
		        style: 'metro',
		        name: '输入验证',
		        fontSize: '30',
		        width: '180',
		        height: '180',
		        textColor: 'rgb(0,102,179)',
		        onClick: function() {
		        	template.loadPage('identifyingCode',{accNo:data.accNo});
		        	}
		        });
			
			var scanningBtn = new PJF.ui.linkButton({
		        dom: 'scanningBtn',
		        style: 'metro',
		        name: '扫码验证',
		        fontSize: '30',
		        width: '180',
		        height: '180',
		        textColor: 'rgb(0,102,179)',
		        onClick: function() {
		        	template.loadPage('CPBScanningHF',{accNo:data.accNo});
		        	}
		        });

			//返回
	        var returnBtn = new PJF.ui.linkButton({
	            dom: 'backBtn',
	            name: '返回',
	            style: 'main',
	            onClick: function () {
	                template.loadPage('entryIndex', {
						accNo:data.accNo
					});
	            }
	        });
		},
		destroy : function() {
		}
}