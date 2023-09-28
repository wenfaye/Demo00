/**
 * @file  无卡登陆校验
 * @author ZhangAXiong
 * @version 1.0
 * Create On
 * Last Updated 2021-01-19
 * 1.获取登陆手机号、验证码
 * 2.跳转对账单未回签页面unSignedBill进行对账单查询
 */
function inputAuthCode(){

}
inputAuthCode.prototype={
    //初始化插入银行卡组件
    init:function(data){
        if (!data) {
            data = {};
        }
        var authPhone = new PJF.ui.textfield({
            dom : 'authPhone',
            width : 400,
            datatype : 'mobile',
            required : true,
            validType : ['mobile'],
            invalidMessage : ['请输入正确的手机号']
        });
        var authCode = new PJF.ui.textfield({
            dom : 'authCode',
            width : 400,
            datatype : 'number',
            required : true,
            validType : ['number','length[6]'],
            invalidMessage : ['请输入正确的数字验证码','请输入正确的六位验证码']
        });
        //返回
        var returnBtn = new PJF.ui.linkButton({
            dom: 'returnBtn',
            name: '返回',
            style: 'main',
            onClick: function () {
                template.loadPage('subMenuPage', 'CPB20008');
            }
        });
        //确认
        var confirmBtn = new PJF.ui.linkButton({
            dom: 'confirmBtn',
            name: '确认',
            style: 'main',
            appendStyle: 'confirm',
            onClick: function () {
                var phone =  authPhone.getValue();
                var code = authCode.getValue();
                console.log("手机号："+phone+",验证码："+code);
                // @critical 页面如果有未通过校验的信息，那么就会拦截
                if(!PJF.html.validatedArea("searchInfo_div")){
                    STM.corporateBill.showAlertMsg("尊敬的客户，您有项目没有输入完全或格式错误。");
                    return;
                }
                // @critical 发起交易，校验验证码是否正确，正确进入未回签账单回签查询
                data.btnId = 'btn1';
                data.phone = phone;
                data.code = code;
                template.loadPage('unSignedBill', data);
            }
        });
    },
    destory:function(){
        inputPwd.destory();
    }
};