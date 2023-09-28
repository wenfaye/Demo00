/**
 * @file 对账单转STM回签以及打印
 * @author ZhangAXiong
 * @version 1.0
 * Create On 2020-09-25
 * * Last Updated 2021-01-29
 * 1.通过手机号、短信验证码进行登录进入
 * 2.查询未回签对账单进行相符/不相符回签
 * 3.对未回签对账单进行打印
 */

function unSignedBill() {
}
var currBtn = '';//@critical 当前按钮
var curPage = '1';//@critical 当前页
var jsonData = {};//@critical 请求参数
var Txn_CardNo = '';//@critical 卡号,空值，这里回签可以不送
var baseData = {};//@critical 本页原始数据
var hqData = '';
unSignedBill.prototype = {
    init : function(data) {
        data = data || {};
        baseData = data;
        Txn_CardNo = data.Txn_CardNo?data.Txn_CardNo:STM.corporateBill.Txn_CardNo;
        var slcData = [];// @critical 选中的对账单数据
        var btn1Color = 'rgb(59,157,245)';// @critical 初始化颜色
        var btn2Color = 'rgb(59,157,245)';
        if(data.btnId){
            var tmp = data.btnId + 'Color';
            eval(tmp + " = 'rgb(82,150,47)'");// @critical 选中颜色
            currBtn = data.btnId;
        }
        var btn1 = new PJF.ui.linkButton({
            dom: 'btn1',
            name: '全部未回签<br>账单查询',
            fontSize: '20',
            btnBgColor: btn1Color,
            onClick: function() {
                data.btnId = 'btn1';
                template.loadPage('unSignedBill',data);
            }
        });

        var btn2 = new PJF.ui.linkButton({
            dom: 'btn2',
            name: '全部未回签<br>账单打印',
            fontSize: '20',
            btnBgColor: btn2Color,
            onClick: function() {
                data.btnId = 'btn2';
                template.loadPage('unSignedBill',data);
            }
        });
        // @critical 封装请求参数
        packageData(data);
        var columns = [[]];
        if(data.btnId == 'btn1'){
            //未回签列表
            columns = [[
                {title : "账单编号",field : "Cptl_Stmt_ID",align : 'center',width:300},
                {title : "账号",field : "Cst_AccNo",align : 'center',width:300 },
                {title : "子账号",field : "Parm_Nm",align : 'center',width:200 },
                {title : "类型",field : "Acc_Tp_ID",align : 'center',width:80,
                    formatter : function(value, rowData) {
                        return STM.corporateBill.getDepType(value);
                    }
                },
                {title : "账单日",field : "Rcncl_Dt",align : 'center',width:120 },
                {title : "余额",field : "Rglr_PnAmt",align : 'center',width:150},
                {title : "余额核对",field : "Rcncl_Rslt_Cd",align : 'center',width:180,
                    formatter : function(value, rowData) {
                        var tmp = rowData.Cptl_Stmt_ID + '_' + rowData.Acc_Tp_ID + '_' + rowData.Cst_AccNo + '_' + rowData.Parm_Nm;
                        //已回签相符
                        if('1' == rowData.Rcncl_Rslt_Cd){
                            return '<input type="checkbox" value="1" style="height:.25rem;width:.25rem;vertical-align: middle;" checked="checked" disabled="disabled" onclick="checkDetail(\''
                                + tmp + '\',\'2\')" name="' + tmp + '" id="' + tmp
                                + '_1"/>&nbsp;相符&nbsp;<input type="checkbox" style="height:.25rem;width:.25rem;vertical-align: middle;" disabled="disabled" value="2" onclick="checkDetail(\''
                                + tmp + '\',\'2\')" id="' + tmp + '_2"/>&nbsp;不符';
                        } else if('2' == rowData.Rcncl_Rslt_Cd){
                            return '<input type="checkbox" value="1" style="height:.25rem;width:.25rem;vertical-align: middle;" onclick="checkDetail(\''
                                + tmp + '\',\'2\')" name="' + tmp + '" id="' + tmp
                                + '_1"/>&nbsp;相符&nbsp;<input type="checkbox" style="height:.25rem;width:.25rem;vertical-align: middle;" disabled="disabled" checked="checked" value="2" onclick="checkDetail(\''
                                + tmp + '\',\'2\')" id="' + tmp + '_2"/>&nbsp;不符';
                        }else{
                            return '<input type="checkbox" value="1" style="height:.25rem;width:.25rem;vertical-align: middle;" onclick="checkDetail(\''
                                + tmp + '\',\'1\')" name="' + tmp + '" id="' + tmp + '_1"/>&nbsp;相符&nbsp;' +
                                '<input type="checkbox" style="height:.25rem;width:.25rem;vertical-align: middle;" value="2" onclick="checkDetail(\''
                                + tmp + '\',\'1\')" id="' + tmp + '_2"/>&nbsp;不符';
                        }
                    }
                }
            ]];
            // @critical 回签页面隐藏预览、打印按钮
            PJF.html.getDom("previewBtn").style.display = 'none';
            PJF.html.getDom("printBtn").style.display = 'none';
            PJF.html.getDom("unPrintNum").style.display = 'none';
            var queryCB_grid = new PJF.ui.grid({
                dom:'queryCB_grid',
                width:'auto',
                height:520,
                totalPath:'_COMMON.COMB.TOTAL_REC',//多页查询总笔数
                pageSize:'10',
                isAppendMode: false,
                rownumbers:false,
                singleSelect:false,
                rowsPath:'Bill_Record',
                url:PJF.constants.DEFAULT_ACTION,
                queryParams:{
                    'fwServiceId':'simpleTransaction',
                    'fwTranId': 'A0782T027-stm',
                    'jsonData':PJF.util.json2str(jsonData)
                },
                columns:columns,
                loadFilter:function (data) {
                    if(null != data && '' != data && '00' != data.BK_STATUS){
                        if('YDCA01018001' == data.BK_CODE){
                            new PJF.ui.errorMessageBox({
                                content : '未查询到相关记录。错误码：'+data.BK_CODE+",全局跟踪号："+data._COMMON.SYS_EVT_TRACE_ID,
                                //detailMsg: '错误码：'+data.BK_CODE+",全局跟踪号："+data._COMMON.SYS_EVT_TRACE_ID,
                                buttonConfs : [ {
                                    name : '确定',
                                    style : 'main',
                                    appendStyle : 'confirm',
                                    onClick : function() {
                                    }
                                } ]
                            });
                        }else{
                            STM.corporateBill.showErrorMsg(data, '');
                        }
                        data=[];
                    }
                    console.log("交易返回结果:"+PJF.util.json2str(data));
                    if(data.Bill_Record){
                        if(data.Bill_Record.length){
                            var custName =  data.Bill_Record[0].Ar_AccNm;
                            console.log("客户名称custName："+custName);
                            PJF.html.content('acctName','客户名称： ' +custName);//主账户户名
                            var ay = new Array();
                            for(var i=0;i<data.Bill_Record.length;i++){
                                if(data.Bill_Record[i].Cptl_Stmt_ID){
                                    ay.push(data.Bill_Record[i]);
                                }
                            }
                            data.Bill_Record = ay;
                        }
                    }
                    return data;
                }
            });
        }else{
            //未回签账单打印列表
            columns = [[
                {title : "",field:"checkbox",checkbox:true,align : 'center'},
                {title : "账单编号",field : "Cptl_Stmt_ID",align : 'center'},
                {title : "账号",field : "Cst_AccNo",align : 'center'},
               /* {title : "子账号",field : "Cr_Sub_AccNo",align : 'center',width:300 },*/
                /*{title : "账单生成类型",field : "Gen_BlTp_Cd",align : 'center'},*/
                {title : "对账日期",field : "Rcncl_Dt",align : 'center'},
               /* {title : "客户编号",field : "Cst_ID",align : 'center',width:300 },*/
                {title : "打印次数",field : "Prt_Cnt",align : 'center'}
            ]];
            // @critical 打印页面隐藏回签按钮
            PJF.html.getDom("balanceBtn").style.display = 'none';
            var queryCB_grid = new PJF.ui.grid({
                dom:'queryCB_grid',
                width:'auto',
                height:520,
                totalPath:'_COMMON.COMB.TOTAL_REC',//多页查询总笔数
                pageSize:'10',
                isAppendMode: false,
                rownumbers:false,
                singleSelect:false,
                rowsPath:'Bill_Record',
                url:PJF.constants.DEFAULT_ACTION,
                queryParams:{
                    'fwServiceId':'simpleTransaction',
                    'fwTranId':'A0782T026-stm',
                    'jsonData':PJF.util.json2str(jsonData)
                },
                columns:columns,
                loadFilter:function (data) {
                    if(null != data && '' != data && '00' != data.BK_STATUS){
                        //T026交易没数据，但是状态却是交易不成功，所以判断一下
                        if('YDCA01018001' == data.BK_CODE){
                            new PJF.ui.errorMessageBox({
                                content : '未查询到相关记录。错误码：'+data.BK_CODE+",全局跟踪号："+data._COMMON.SYS_EVT_TRACE_ID,
                                //detailMsg: '错误码：'+data.BK_CODE+",全局跟踪号："+data._COMMON.SYS_EVT_TRACE_ID,
                                buttonConfs : [ {
                                    name : '确定',
                                    style : 'main',
                                    appendStyle : 'confirm',
                                    onClick : function() {
                                    }
                                } ]
                            });
                        }else{
                            STM.corporateBill.showErrorMsg(data, '');
                        }
                        data=[];
                    }
                    console.log("交易返回结果:"+PJF.util.json2str(data));
                    if(data.Bill_Record){
                        if(data.Bill_Record.length){
                            var custName =  data.Bill_Record[0].Ar_AccNm;
                            var unPrintNum = data._COMMON.COMB.TOTAL_REC;
                            console.log("客户名称custName："+custName);
                            console.log("未打印次数unPrintNum："+unPrintNum);
                            PJF.html.content('acctName','客户名称： ' +custName);//主账户户名
                            PJF.html.content('unPrintNum', '您当前有' + unPrintNum + '份对账单可打印');
                            var ay = new Array();
                            for(var i=0;i<data.Bill_Record.length;i++){
                                if(data.Bill_Record[i].Cptl_Stmt_ID){
                                    ay.push(data.Bill_Record[i]);
                                }
                            }
                            data.Bill_Record = ay;
                        }
                    }
                    return data;
                },
                onCheckRow: function(idx, row) {
                    if(!slcData.some(function(v) {return v.Cptl_Stmt_ID == row.Cptl_Stmt_ID})) {
                        slcData.push(row);
                    }
                },
                onUnCheckRow: function(idx, row) {
                    slcData = slcData.filter(function(v) {return v.Cptl_Stmt_ID != row.Cptl_Stmt_ID});
                },
                onCheckAll:function(idx, row){
                    console.log(">>>"+queryCB_grid.getAllRows());
                    console.log(">>>"+row);
                    var allRows = queryCB_grid.getAllRows();
                    allRows.forEach(function(item, i) {
                        if(!slcData.some(function(v) {return v.Cptl_Stmt_ID == item.Cptl_Stmt_ID})) {
                            slcData.push(item);
                        }
                    });
                },
                onUnCheckAll:function(idx, row){
                    var allRows = queryCB_grid.getAllRows();
                    allRows.forEach(function(item, i) {
                        slcData = slcData.filter(function(v) {return v.Cptl_Stmt_ID != item.Cptl_Stmt_ID});
                    });
                },
                onLoadSuccess: function() {
                    if(slcData.length == 0) {
                        return;
                    }
                    var allRows = queryCB_grid.getAllRows();
                    allRows.forEach(function(v, i) {
                        if(slcData.some(function(x) {return x.Cptl_Stmt_ID == v.Cptl_Stmt_ID})) {
                            queryCB_grid.checkRow(i);
                        }
                    });
                }
            });
        }

        //上一页
        var cb_prePage = new PJF.ui.linkButton({
            dom : 'cb_prePage',
            style: 'main',
            name: '上一页',
            onClick : function() {
            }
        });
        //下一页
        var cb_nextPage = new PJF.ui.linkButton({
            dom : 'cb_nextPage',
            style: 'main',
            name: '下一页',
            onClick : function() {
            }
        });

        queryCB_grid.addPaginationBar(cb_prePage, cb_nextPage, "desc");

        // 返回按钮
        var returnBtn = new PJF.ui.linkButton({
            dom : 'returnBtn',
            style : 'main',
            name : '返回',
            onClick : function() {
                template.loadPage('subMenuPage','CPB20008');
            }
        });

        // 回签按钮
        var balanceBtn = new PJF.ui.linkButton({
            dom : 'balanceBtn',
            style : 'main',
            appendStyle : 'confirm',
            name : '回签',
            onClick : function() {
                modBalance();
            }
        });

        // 预览按钮
        var balanceBtn = new PJF.ui.linkButton({
            dom : 'previewBtn',
            style : 'main',
            appendStyle : 'confirm',
            name : '预览',
            onClick : function() {
                previewBalance();
            }
        });

        // 打印按钮
        var balanceBtn = new PJF.ui.linkButton({
            dom : 'printBtn',
            style : 'main',
            appendStyle : 'confirm',
            name : '打印',
            onClick : function() {
                printBalance();
            }
        });
        /**
         * @function modBalance
         * 为回签账单进行回签
         * 1.必须输入一笔账单核对结果。
         * 2.批量进行回签
         */
        var modBalance = function(){
            if('' == hqData){
                STM.corporateBill.showAlertMsg("请至少输入一笔账单的核对结果，请重新输入");
                return;
            }
            if(hqData.indexOf('_') == '-1'){
                STM.corporateBill.showAlertMsg("请至少输入一笔账单的核对结果，请重新输入");
                return;
            }
            // @critical 采用心跳的形式多次请求
            STM.corporateBill.loading = new PJF.ui.loading({msg:'业务正在处理中，请稍候……'});
            var hqary = hqData.split(';');
            var countAct = 0;// 执行交易个数
            var errorData = '';//错误返回
            var times = hqary.length - 1;
            console.log('回签数据' + '>>>>>>>' + hqData);
            var param = {};
            for(var i = 0; i < times; i++){
                +function() {
                    var tmphq = hqary[i];
                    var tmpary = tmphq.split('_');
                    param.OP_TYPE_CD = '1';//不送或送空：走老STM回签交易逻辑 送1：回签转STM的账单
                    param.Acc_Record = [{
                        'Cst_AccNo':tmpary[2],// 账号
                        'Acc_Tp_ID':tmpary[1],// 账户类型编号
                        'PdAr_ID':tmpary[0],// 账单编号
                        'Parm_Nm':tmpary[3],
                        'Rcncl_Rslt_Cd':'1',// 回签结果0 所有未回签1 相符2 不相符3 所有已回签
                        'Eqmt_ID':Txn_CardNo + '|' + PJF.otherInfo.devId// 设备号(账单正面图像路径)
                    }];
                    var time_ = '第' + i + '次回签';
                    console.log(time_ + '>>>>>>>' + PJF.util.json2str(param));
                    PJF.communication.cpsJsonReq({
                        fwServiceId: 'simpleTransaction',
                        fwTranId: 'A0782T024-HF', //A0782T024-stm
                        async: false, //默认同步
                        jsonData: PJF.util.json2str(param),
                        success: function(resp) {
                            if(resp.Mnplt_StCd && resp.Mnplt_StCd == '01' ){
                                console.log(time_ + '成功！');
                            }else{
                                console.log(time_ + '失败！');
                                errorData = resp;
                            }
                        },
                        failure : function(responseData) {
                            console.log(time_ + '失败！<br>全局跟踪号:'+responseData._COMMON.SYS_EVT_TRACE_ID
                                +'，错误码:'+responseData.BK_CODE+'，错误描述:'+responseData.BK_DESC);
                            errorData = responseData;
                        },
                        complete: function() {
                            countAct++;
                        }
                    });
                }();
            }
            // @critical 心跳
            var n = 0;
            var pig = setInterval(function() {
                n++;
                if(n > 30){
                    clearInterval(pig);
                    STM.corporateBill.showAlertMsg('交易超时了，请稍后再试！');
                    STM.corporateBill.loading.destroy();
                    return;
                }else{
                    if(errorData){
                        clearInterval(pig);
                        STM.corporateBill.showErrorMsg(errorData, '回签过程中出错！');
                        STM.corporateBill.loading.destroy();
                        return;
                    }
                    if (countAct == times) {
                        clearInterval(pig);
                        STM.corporateBill.loading.destroy();
                        new PJF.ui.errorMessageBox({
                            content : '尊敬的客户，您所选择的对账单已回签成功',
                            buttonConfs : [{
                                name : '确定',
                                style : 'main',
                                appendStyle : 'confirm',
                                onClick : function() {
                                    hqData = '';
                                    queryCB_grid.refresh();
                                }
                            }]
                        });
                    }
                }
            },1000);
            //心跳 end
        };
        /**
         * @function previewBalance
         * @async
         * 为回签账单进行预览，列表多选，但只能预览一条账单
         */
        function previewBalance() {
            if(!slcData || slcData.length < 1){
                STM.corporateBill.showAlertMsg("请选择您需要预览的账单");
                return;
            }else if(slcData.length > 1){
                STM.corporateBill.showAlertMsg("仅可预览一份账单");
                return;
            }else{
                //选中只有一条
                // @critical 调用A0782T028下载交易进行预览
                var param = {};
                param.OP_TYPE_CD = '1';//1：预览2：打印
                param.Bill_Record = [{
                    Cptl_Stmt_ID:slcData[0].Cptl_Stmt_ID//账单编号
                }];
                console.log('预览交易请求报文：' + PJF.util.json2str(param));
                //todo 交易带附件记得xml配置is_get_file = true
                PJF.communication.cpsJsonReq({
                    fwServiceId: 'simpleTransaction',
                    fwTranId: 'A0782T028-HF',//A0782T028-stm
                    jsonData: PJF.util.json2str(param),
                    success: function(resp) {
                        //成功之后就去打开预览
                        console.log("预览交易A0782T028成功："+PJF.util.json2str(resp));
                        if(!resp._COMMON.FILE_LIST_PACK || !resp._COMMON.FILE_LIST_PACK.FILE_INFO){
                            console.log("预览交易A0782T028成功,但交易带附件无文件域，，，");
                        }else{
                            //todo 核对是否取第一个
                            var fileArray = resp._COMMON.FILE_LIST_PACK.FILE_INFO;
                            console.log("预览返回文件信息："+PJF.util.json2str(fileArray));
                            var fileName = fileArray[0].FILE_NAME;//文件名
                            var filePath = fileArray[0].FILE_PATH;//文件路径
                            var preUrl = STM.corporateBill.url + fileName;
                            var printerArgs ={
                                readButtonText : '关闭预览'
                            };
                            console.log("预览地址preUrl："+preUrl);
                            PJF.communication.OpenDocOnline(preUrl, false, printerArgs, function(){});
                        }
                    },
                    failure : function(responseData) {
                        STM.corporateBill.showErrorMsg(responseData, '预览失败');
                    }
                });
            }
        }
        /**
         * @function doBillPrintFile
         * @param{Object} data
         * @param{String} data.FILE_NAME 文件名
         * @param{String} i 下标
         * @param{String} printSuccNum 打印成功数
         * @param{String} billRecord 账单记录
         * 打印文件，A4纸竖打，左下角盖章
         */
        function doBillPrintFile(data, i, printSuccNum,billRecord) {
            var dwurl= STM.corporateBill.localUrl + data[i].FILE_NAME;
            var printNum = billRecord[i].length;
            var startArgs={};
            startArgs.iSlotType=3;//3号纸槽
            startArgs.iChapterType=4;///盖章模式 A4纸，单个章，横向盖章
            startArgs.pchChapterPos='42';//盖章位置
            startArgs.iChapterNum=printNum;//盖章个数
            startArgs.iTotalPaperNum = printNum;//打印张数
            startArgs.printFilePath=dwurl;//打印文件路径
            console.log("打印返回数据"+i+"=="+JSON.stringify(startArgs));
            // @critical 开始打印回单
            PJF.stm.HDP.startPrintReceipt(startArgs, function(startPrintRes){
                if('1' == startPrintRes.status){//打印成功
                    if(i == (data.length - 1)){//最后一次打印成功
                        printSuccNum = STM.corporateBill.ValArray.length;// 记录打印成功次数
                        /*if(STM.corporateBill.ValArray.length > 0 && printSuccNum > 0){
                            // todo 是否去登记
                            // STM.corporateBill.divideDataAndReg(printSuccNum, STM.corporateBill.ValArray);
                        }*/
                        var tmp = {
                            publicBusiness:true,//营销页面显示对公结算卡专用图片
                            //20201127 增加手机号，用于切面方法传参
                            cstmPhone:baseData.phone
                        };
                        console.log("无卡登陆打印结束参数tmp："+PJF.util.json2str(tmp));
                        template.loadPage('takeCBHF',tmp);
                        //清空数据
                        STM.corporateBill.ValArray = new Array();
                    } else {//递归调用打印
                        printSuccNum += parseInt(startPrintRes.info.printProgressData)||0;
                        doBillPrintFile(data, i+1, printSuccNum,billRecord);
                    }
                } else {
                    console.log('打印出错：' + PJF.util.json2str(startPrintRes));
                    printSuccNum += parseInt(startPrintRes.info.printProgressData)||0;
                    if(printSuccNum > 0){
                        // todo 是否去登记
                        // STM.corporateBill.divideDataAndReg(printSuccNum,STM.corporateBill.ValArray);
                        var errorMsg = '打印过程中出错，已打印' + printSuccNum
                            + '条，未打印' + (STM.corporateBill.ValArray.length - printSuccNum) + '条，请呼叫工作人员处理';
                        var fuc = function(){
                            var tmp = {
                                publicBusiness:true,//营销页面显示对公结算卡专用图片
                                //20201127 增加手机号，用于切面方法传参
                                cstmPhone:baseData.phone
                            };
                            template.loadPage('takeCBHF',tmp);
                            console.log("无卡登陆打印结束参数tmp："+PJF.util.json2str(tmp));
                            //清空数据
                            STM.corporateBill.ValArray = new Array();
                        };
                        STM.corporateBill.showPrintErrorMsgAndGetPaper(errorMsg, startPrintRes, fuc);
                    } else {
                        STM.corporateBill.showPrintErrorMsg(startPrintRes.errorMsg+"，请呼叫工作人员处理", startPrintRes.errorCode);
                    }
                }
            });
        }
        /**
         * @function doDownloadBillFile
         * @param{Object} prepareData
         * @param{String} prepareData.FILE_NAME 文件名
         * @param{String} prepareData.locUrl 本地下载地址
         * @param{String} i 下标
         * @param{String} len 选中数据的长度
         * @param{String} billRecord 账单记录
         * 下载文件
         */
        function doDownloadBillFile(prepareData, i, len,billRecord) {
            var fileName = prepareData[i].FILE_NAME;
            var fileExistUrl = STM.corporateBill.existUrl + fileName;
            var downUrl = STM.corporateBill.url + fileName;
            // @critical 判读下载文件是否存在
            if(!STM.corporateBill.isFileExist(fileExistUrl)){
                STM.corporateBill.showPrintErrorMsg('对账单文件不存在，下载失败', null);
                STM.corporateBill.loading.destroy();
                return;
            }
            // @critical 文件下载路径
            var locUrl = STM.corporateBill.localUrl + fileName;
            prepareData[i].locUrl = locUrl;
            PJF.util.simpleDownload(locUrl, downUrl, function(d){
                console.log("下载返回成功！！！" + PJF.util.json2str(d));
                if(d.success){//成功
                    if(i == (prepareData.length - 1)){//最后一次下载文件成功
                        STM.corporateBill.loading.destroy();
                        var func = function(){
                            //预热打印机
                            PJF.stm.HDP.preparePrinter({}, function(prepareRes){
                                if('1' == prepareRes.status){//预热成功
                                    doBillPrintFile(prepareData, 0, 0,billRecord);
                                } else {
                                    STM.corporateBill.showPrintErrorMsg(prepareRes.errorMsg+"，请呼叫工作人员处理", prepareRes.errorCode);
                                }
                            });
                        };
                        STM.corporateBill.confirmDeductMoneyByCB(len, 0, func);
                    } else {//递归调用下载
                        doDownloadBillFile(prepareData, i + 1, len,billRecord);
                    }
                }else{//失败
                    STM.corporateBill.loading.destroy();
                    console.log("对账单文件循环第" + (i+1) + "次下载回调失败");
                    STM.corporateBill.showPrintErrorMsg('对账单文件下载回调失败', null);
                }
            });
        }
        /**
         * @function printUnSignedBalance
         *  @param{Object} billRecord 账单编号
         * @param{String} prepareData 接收数组
         * @param{String} i 下标
         * @param{String} len 选中数据的长度
         * 发交易，获取pdf文件
         */
        function printUnSignedBalance(billRecord, prepareData, i, len) {
            var param = {};
            param.OP_TYPE_CD = '2';//1：预览2：打印
            param.Bill_Record = billRecord[i];//账单编号
            console.log('预览交易请求报文：' + PJF.util.json2str(param));
            PJF.communication.cpsJsonReq({
                fwServiceId: 'simpleTransaction',
                fwTranId: 'A0782T028-HF',
                jsonData: PJF.util.json2str(param),
                success: function(resp) {
                    console.log("打印交易A0782T028成功："+PJF.util.json2str(resp));
                    if(!resp._COMMON.FILE_LIST_PACK || !resp._COMMON.FILE_LIST_PACK.FILE_INFO){
                        console.log("打印交易A0782T028成功,但交易带附件无文件域，，，");
                    }else {
                        prepareData = prepareData.concat(resp._COMMON.FILE_LIST_PACK.FILE_INFO) ;
                        if((i + 1) < billRecord.length){
                            printUnSignedBalance(billRecord, prepareData, i + 1,len);
                        } else {
                            //下载文件到本地并打印
                            doDownloadBillFile(prepareData, 0, len,billRecord);
                        }
                    }
                },
                failure : function(responseData) {
                    STM.corporateBill.showErrorMsg(responseData, '下载对账单文件到P2出错');
                    STM.corporateBill.loading.destroy();
                }
            });
        }
        /**
         * @function printBalance
         * 未回签账单进行打印
         */
        function printBalance() {
            if(!slcData || slcData.length < 1){
                STM.corporateBill.showAlertMsg("请选择您需要打印的账单");
                return;
            }else{
                //调用A0782T028下载交易进行打印
                var prepareData = [];
                STM.corporateBill.ValArray = new Array();
                STM.corporateBill.loading = new PJF.ui.loading({msg: '业务正在处理中，请稍候……'});
                //@critical 将slcData数据组装成10条一组的数组,即一次打印十条
                var slcDataNew = [];
                var billRecord = [];
                var number = 10;
                var len = slcData.length;
                var times = (len % number == 0) ? len / number:(Math.floor(len / number))+1;
                for(var n=0; n<times; n++) {
                    if (n == (times - 1)) {
                        slcDataNew = slcData.slice(n * number, len);
                    } else {
                        slcDataNew = slcData.slice(n * number, (n + 1) * number);
                    }
                    billRecord[n] = slcDataNew;
                }
                STM.corporateBill.ValArray = STM.corporateBill.ValArray.concat(slcData);
                printUnSignedBalance(billRecord, prepareData, 0, len);
            }
        }

    },
    destroy : function() {
    }
};
/**
 * @function checkDetail
 * @param {String}id 页面dom的id
 * @param {String}flg 1.新增2.修改
 * 1.新增：相符、不相符都可选
 * 2.修改：根据后台返回的数据进行回显
 * 		1.相符，将相符勾选并且不相符不可选
 * 		2.不相符，将不相符勾选并且相符可选
 */
function checkDetail(id, flg){
    var tmp = id;
    console.log("回签数据tmp："+tmp);
    if('1' == flg){// @critical 新增
        //不符
        if($("#" + id + "_2").is(':checked')){
            $("#" + id + "_1").removeAttr("checked");
            var confirm_Box = new PJF.ui.errorMessageBox({
                content : '温馨提示：尊敬的客户，请及时联系网点人员，以便查明不符原因，谢谢',
                buttonConfs : [{
                    name : '继续回签',
                    style : 'main',
                    appendStyle : 'confirm',
                    onClick : function() {
                        var tmpData = {};
                        //回签本页不符数据
                        jsonData._pagination = {};
                        jsonData._pagination.PAGE_JUMP = curPage;
                        jsonData._pagination.REC_IN_PAGE = '10';//多页查询每页笔数
                        baseData.jsonData = jsonData;
                        baseData.btnId = currBtn;
                        tmpData.baseData = baseData;
                        tmpData.bfData = tmp;
                        tmpData.Txn_CardNo = Txn_CardNo;
                        tmpData.pageFlg = '1';//1从unSignedBill页面跳转进去，否则从balanceSelf页面进入
                        template.loadPage("recordHF",tmpData);
                    }
                },{
                    name : '查清后再回签',
                    style : 'main',
                    onClick : function() {
                        $("#" + id + "_2").removeAttr("checked");
                        return;
                    }
                }]
            });
        }
        //相符
        if($("#" + id + "_1").is(':checked')){
            $("#" + id + "_2").removeAttr("checked");
            hqData += tmp + ';';
        } else {
            hqData = hqData.replace(tmp + ';', '');
        }
    } else if('2' == flg){// @critical 修改
        if($("#" + id + "_1").is(':checked')){
            $("#" + id + "_2").removeAttr("checked");
            hqData += tmp + ';';
        } else {
            $("#" + id + "_2").attr("disabled",false);
            $("#" + id + "_2").click();
            $("#" + id + "_2").attr("disabled",true);
            hqData = hqData.replace(tmp + ';', '');
        }
    }
}
/**
 * @function packageData
 * @param{Object} data
 * @param data.phone 第一联系人手机号
 * @param data.code 短信验证码
 * 封装请求参数，准备请求对账数据
 *
 */
function packageData(data){
   //初始化界面的数据
    //未回签账单的回签查询跟打印查询，查询条件一样
    jsonData = {
        'Cst_AccNo':'',//客户账号
        'Fst_CtcPsn_MblPh_No':data.phone,//第一联系人手机号
        'SMS_Vld_CD':data.code//短信验证码
    };
    jsonData._pagination = {};
    jsonData._pagination.PAGE_JUMP = curPage;//多页查询跳转页码
    jsonData._pagination.REC_IN_PAGE = '10';//多页查询每页笔数
}