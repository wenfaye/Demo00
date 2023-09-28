function login() {
}

login.prototype = {
		init : function(data) {
			data = data || {};
			
			var AcctNo1 = new PJF.ui.textfield({dom:"AcctNo1",required:true});

			//密码
			var pass=new PJF.ui.password({
				dom:'pass'
				/*labelText: '密码：',
				textWidth:"188px",
				textBt : '验密',
				readOnly:true,
				textRequired:true,
				//disabled:true,
				times:'1',
				textOnBlur:function(){},
				successful : function(result){
					
			    },
			    failure : function(result){
				    return ;
			    }*/
			});
			
		},
		
		destroy : function() {
		}
}