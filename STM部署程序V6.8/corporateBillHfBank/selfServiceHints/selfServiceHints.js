/**
 * 自助服务提示
 */
/**
 * @file selfServiceHints
 * @author ZhangAXiong
 * @version 1.0
 * create 2020-04
 * Last Updated 2021-01-29
 * 自助服务提示
 */
function selfServiceHints() {

}

selfServiceHints.prototype = {
    init:function(data){
        var $this = this;
        if (!data) {
            data = {};
        }

        var infoFlag = "";
        var custNo = "";
        //@critical 区分显示重要信息/全部信息
        if (data && data.infoFlag && data.custNo) {
            document.getElementById('tip').innerText = "重要服务提示";
            infoFlag = data.infoFlag;
            //其他菜单进去，传递客户编号
            custNo =  data.custNo;
        }else{
            //公司业务--查询服务通知进入
            //@critical 01结算卡直接取全局变量，02回单卡发T001交易改造返回客户编号
            if(data && data.type == "01"){
                custNo = PJF.stm.CUSTOM_INFO_COR.Unit_Cst_ID
            }else if(data && data.type == "02"){
                custNo = data.resData.Cst_ID
            }
        }
        console.log("》》》获取客户编号："+custNo);
        var btnName = "继续办理业务";
        if(infoFlag == 'imprt'){
            btnName = "继续办理业务";
        }else{
            btnName = "返回";
        }
        var returnBtn = new PJF.ui.linkButton({ //返回按钮
            dom:'returnBtn',
            name:btnName,
            style:'main',
            onClick:function() {
                if(infoFlag == 'imprt'){
                    if(data){
                        data.continueCb();
                    }
                }else{
                    template.loadPage('homepage');
                }

            }
        });

        $this.initUI(infoFlag,custNo);
    },
    /**
     * @function initUI
     * @param {String} infoFlag 'imprt'-重要信息
     * @param {String} custNo 客户编号
     * 根据客户编号查询客户信息
     */
    initUI  : function(infoFlag,custNo) {

        //根据客户编号查询客户消息
        sendSearchInfo(custNo);

        /**
         * @function alreadyRead
         * @async
         * @param {String}custNo 客户编号
         * @param {String}data_dt 数据日期
         * @param {String}lbl_Id 标签编号
         * @param {Object}yiYueBtn 已阅按钮对象
         * 点击已阅按钮，将此数据状态改为“已阅”，按钮置灰并不可点击
         */
        function alreadyRead(custNo,data_dt, lbl_Id,yiYueBtn) {
            var jsonData = {
                Cst_ID:custNo,
                DATA_DT:data_dt,
                Lbl_ID:lbl_Id
            };
            PJF.communication.cpsJsonReq({
                fwServiceId: 'simpleTransaction',
                fwTranId: 'A0091DM31-stm',
                /*async: false,*/
                maskAll:true,
                jsonData: PJF.util.json2str(jsonData),
                success: function(respData) {
                    console.log("A0091DM31交易发送成功，全局跟踪号："+respData._COMMON.SYS_EVT_TRACE_ID);
                    var mnplt_st= respData.Mnplt_St;
                    if("00" == mnplt_st){
                        console.log("点击已阅操作成功mnplt_st："+mnplt_st);
                        yiYueBtn.disable();//@critical 禁用按钮
                        yiYueBtn.updateBtnBackGroundColor("grey");
                    }else{
                        console.log("点击已阅操作失败mnplt_st："+mnplt_st);
                        new PJF.ui.messageBox({
                            content :"更新失败，请点击已阅重试或返回后继续办理其他业务",
                            //detailMsg : '继续办理业务或再次点击已阅',
                            buttonConfs : [
                                {
                                    bgColor: 'rgb(121,198,30)',
                                    name: '确认',
                                    width:200,
                                    height:80,
                                    onClick: function() {
                                    }
                                }
                            ]
                        });
                    }
                },
                failure: function(resp) {
                    console.log("A0091DM31交易查询失败，全局跟踪号："+resp._COMMON.SYS_EVT_TRACE_ID);
                    new PJF.ui.errorMessageBox({
                        content : "已阅交易查询失败。全局跟踪号："+resp._COMMON.SYS_EVT_TRACE_ID,
                        //detailMsg:resp.BK_DESC,
                        buttonConfs : [
                            {
                                bgColor: 'rgb(121,198,30)',
                                name: '确认',
                                width:200,
                                height:80,
                                onClick: function() {
                                    template.loadPage('homepage');
                                }
                            }
                        ]
                    });
                }
            });
        }

        /**
         * @function loadPageData
         * @param {Object} returnData 查询的数据信息
         * new list 列表展示客户信息
         * 如果infoFlag值为‘imprt’则过滤出来重要信息进行展示
         */
        function loadPageData(returnData) {
            var filterData = [];
            var infoDrawList = new PJF.ui.list({
                dom: 'infoDrawList',
                height: 650,
                data: returnData,// @critical 本地数据直接加载
                rowTpl: 'infoListTpl',
                dataFilter: function(dataList){
                    if(!dataList || dataList.length == 0){
                        document.getElementById('nodata').style.display = "block";
                    }else{
                        filterData = [].concat(dataList);
                        if(infoFlag == 'imprt'){
                            for(var i = 0;i<filterData.length;i++){
                                //@critical 第二位中A-重要，B-不重要
                                if('A' != filterData[i].Lbl_Val.substring(1,2)){
                                    filterData.splice(i,1);
                                    i--;
                                }
                            }
                        }
                        for(var j = 0;j<filterData.length;j++){
                            filterData[j].Num_Flag = j + 1;
                        }
                    }
                    return filterData;
                }
            });
            filterData.forEach(function(item,index){
                var index_Add = index + 1;
                var yiYueBtn = new PJF.ui.linkButton({
                    dom:"yiYue_"+index_Add,
                    name: "已阅",
                    /*style:'main',*/
                    onClick:function(){
                        alreadyRead(custNo,item.Data_Dt,item.Lbl_ID,yiYueBtn);
                    }
                })
            })
        }

        //客户信息查询
        /**
         * @function sendSearchInfo
         * @async
         * @param {String} custNo 客户编号
         * 客户信息查询
         * 查询条数控制50条
         */
        function sendSearchInfo(custNo) {
            var jsonData = {
                Cst_ID: custNo
            };
            PJF.communication.cpsJsonReq({
                fwServiceId: 'simpleTransaction',
                fwTranId: 'A0091DM30-stm',
                maskAll:true,
                jsonData: PJF.util.json2str(jsonData),
                success: function(respData) {
                    console.log("A0091DM30交易发送成功，全局跟踪号："+respData._COMMON.SYS_EVT_TRACE_ID);
                    var unReadNum = respData.Not_Rd_Prmpt_Num;
                    //@critical 判断客户是否有未读提示信息
                    if(unReadNum != 0){
                        //数据显示控制50条
                        var dataLength = respData.InfoGrp.length;
                        if(dataLength > 50){
                            new PJF.ui.messageBox({
                                content : "抱歉！因提示信息数量超限而无法显示。请关闭提示窗口继续其他操作，或咨询银行工作人员",
                                buttonConfs : [
                                    {
                                        bgColor: 'rgb(121,198,30)',
                                        name: '确认',
                                        width:200,
                                        height:80,
                                        onClick: function() {
                                            template.loadPage('homepage');
                                        }
                                    }
                                ]
                            });
                        }else{
                            loadPageData(respData.InfoGrp);
                        }
                    }else{
                        loadPageData(respData.InfoGrp);
                    }
                },
                failure: function(resp) {
                    console.log("A0091DM30交易查询失败，全局跟踪号："+resp._COMMON.SYS_EVT_TRACE_ID);
                    new PJF.ui.errorMessageBox({
                        content :"服务信息查询失败。全局跟踪号："+resp._COMMON.SYS_EVT_TRACE_ID,
                        //detailMsg:resp.BK_DESC,
                        buttonConfs : [
                            {
                                bgColor: 'rgb(121,198,30)',
                                name: '确认',
                                width:200,
                                height:80,
                                onClick: function() {
                                    template.loadPage('homepage');
                                }
                            }
                        ]
                    });
                }
            });
        }
    },
    destroy : function() {

    }
};
