/**
 * @file 回单打印结束页面
 * @author ZhangAXiong
 * @version 1.0
 * * Last Updated 2021-01-18
 * 1.回单打印完成之后的结束页面
 * 2.5秒后跳转到营销页面
 */
function takeCBHF() {
}
takeCBHF.prototype = {
    init: function (data) {
        //@critical 20201127 增加公共切面
        var phone = "";
        if(data && data.cstmPhone){
            phone = data.cstmPhone;
        }
        var conf = {
            triggerExpMonTask: true, //@critical 是否触发体验监测任务
            expMonData: {   //@critical 体验监测补充数据
                Bsn_Scn_ID: 'STM020',//@critical Bsn_Scn_ID表示业务场景编号 STM020-对公账单自助
                MSG_SMS_MBLPH_NO: phone //@critical 客户手机号，有就送，没有就不送
            }
        };
        console.log("切面方法conf："+PJF.util.json2str(conf));
        console.log("》》》公共方法切入开始......");
        
        window.removeEventListener('click',window.eventHander,false);
		if(window.logoutFlag){
			$('div[id=billNavbtn]').remove();
			$('.template_navbtn').show();
			clearTimeout(window.logoutFlag);
		}
        /**
         * 交易结束前统一处理逻辑
         * @async
         * @param {object} conf 配置对象，结构:
         *   {
         *     triggerExpMonTask: true, //是否触发体验监测任务
         *     expMonData: {   //体验监测补充数据
         *       Bsn_Scn_ID: 'STM001', //Bsn_Scn_ID表示业务场景编号
         *       MSG_SMS_MBLPH_NO: '13112345678' //客户手机号，有就送，没有就不送
         *     }
         *   }
         * @param {function} callback() 回调（无参）
         */
        /*STM.common.commonFinishBusi(conf, function() {
            //@critical 在这里做后续工作
            console.log("》》》公共方法切入结束......");
            setTimeout(function(){
                //template.loadPage('homepage','');
                //@critical 切面完成之后进行回调，后续工作
                template.loadPage('isConTrading',data);
            },5000);
        });*/

        setTimeout(function(){
            //template.loadPage('homepage','');
            //@critical 切面完成之后进行回调，后续工作
            template.loadPage('isConTrading',data);
        },5000);
        
    }
};