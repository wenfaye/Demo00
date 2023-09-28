function entry() {
}

entry.prototype = {
		init : function(data) {
			data = data || {};
			
			var ptBtn = new PJF.ui.linkButton({
		        dom: 'entryBtn',
		        style: 'metro',
		        name: '文字',
		        fontSize: '30',
		        width: '180',
		        height: '180',
		        textColor: 'rgb(0,102,179)',
		        onClick: function() {
		        	template.loadPage('emidCardNo',{});
		        	}
		        });
		},
		destroy : function() {
		}
}