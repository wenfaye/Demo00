/**
 * @file 账单自助功能的登陆校验公共方法
 * @author ZhangAXiong
 * @version 1.0
 * Create on
 * Last Updated 2021-01-29
 * 1.回单卡是否有重要提示信息
 * 2.回单卡，结算卡登陆验证
 * 3.业务处理，卡号所包含的普通账户、财资账户区分
 * 4.是否签约自助对账判断
 *
 */
PJF.namespace("STM.corporateBillNew.readCardNext");
STM.corporateBillNew.readCardNext={
    /**
     * @function ifImprtInfoAsync
     * @async
     * @param {String} cst_Id 客户编号
     * @param {Object} callback 回调函数
     * 判断回单卡是否有重要信息
     */
    ifImprtInfoAsync: function (cst_Id, callback) {
        console.log("开始执行ifImprtInfoAsync方法");
        var jsonData = {
            Cst_ID: cst_Id
        };
        PJF.communication.cpsJsonReq({
            fwServiceId: 'simpleTransaction',
            fwTranId: 'A0091DM30-stm',
            /*async: false,*/
            maskAll:true,
            jsonData: PJF.util.json2str(jsonData),
            success: function(respData) {
                console.log("判断回单卡是否有重要消息的A0091DM30交易发送成功");
                console.log("A0091DM30交易查询成功，全局跟踪号："+respData._COMMON.SYS_EVT_TRACE_ID);
                callback && callback((respData.InfoGrp||[]).filter(function(currentValue){
                    return '0' == currentValue.Parm_Msg_Read_Ind && 'A' == currentValue.Lbl_Val.charAt(1);
                }).length);
            },
            failure: function(resp) {
                console.log("A0091DM30交易查询失败，全局跟踪号："+resp._COMMON.SYS_EVT_TRACE_ID);
                callback && callback("0");

            }
        });
    },
    /**
     * @function bizNextStep
     * @param {Object} tmpData
     * @param {String} tmpData.menu 菜单
     * @param {String} tmpData.cardNo 卡号
     * 调用A0782T001交易
     * STM登录验证服务
     */
    bizNextStep : function(tmpData) {
			var menu = tmpData.menu;
			var cardData = {};
	    	cardData.menu = menu;
            if(tmpData.cardNo){
        		//消息输出
                /**
                 * @function showAlertMsg
                 * @param {String}data 提示信息
                 */
        		var showAlertMsg = function(data) {
        			var msgBox = new PJF.ui.errorMessageBox({
        				content : data,
        				buttonConfs : [ {
        					name : '确定',
        					style : 'main',
        					appendStyle : 'confirm',
        					onClick : function() {
        						template.loadPage('homepage');
        					}
        				} ]
        			});
        		};
        		
        		// @critical 处理交易
                /**
                 * @function dealBusiness
                 * @param {Object}data
                 * @param {String}cardNo 卡号
                 * @param {String}type 卡类型 01-结算卡 02-回单卡
                 * 1.判断是否签约自助对账功能
                 * 2.返回的账号里面挑出普通账号跟财资账号
                 * 3.绑定的账户不能超过200个
                 */
        		var dealBusiness = function(data,cardNo,type){
                    function conDealBusiness(data,cardNo,type) {
                        if(!data || !data.Reg_GRP){
                            showAlertMsg('卡未绑定账户，请到回单柜处理相关业务');
                            return;
                        }
                        if(data.Reg_GRP.length && data.Reg_GRP.length >= 200){//超过200条数据到回单柜处理
                            showAlertMsg('卡绑定账户过多，请到回单柜处理相关业务');
                        } else {
                            if('01' == type){
                                cardData.Txn_CardNo = cardNo;
                            } else if ('02' == type){
                                cardData.Txn_CardNo = data.Txn_CardNo;
                            }

                            //cardData.resData = data;

                            var flag = false;//判断是否含有财资账户

                            var ptData = new Array();
                            var czData = new Array();
                            var row = {};
                            console.log("该账号签约的是自助设备对账data.Reg_GRP.length"+data.Reg_GRP.length);
                            for(var i=0; i<data.Reg_GRP.length; i++){
                                row = {};
                                console.log("该账号签约的是自助设备对账data.Reg_GRP[i].Rcncl_Ind->"+data.Reg_GRP[i].Rcncl_Ind);
                                //Rcncl_Ind1,表示该账号签约的是自助设备对账
                                console.log("该账号签约的是自助设备对账SgAcc_TpCd ->"+data.Reg_GRP[i].SgAcc_TpCd);
                                if("4" == data.Reg_GRP[i].SgAcc_TpCd){//4-财资账户
                                    flag = true;

                                    row.desc = data.Reg_GRP[i].Cst_AccNo;
                                    row.name = data.Reg_GRP[i].Cst_AccNo + "_" + data.Reg_GRP[i].SgAcc_TpCd + "_" + data.Reg_GRP[i].Acc_AccNm + "_" + data.Reg_GRP[i].Rcncl_Ind;
                                    czData.push(row);
                                } else {
                                    row.desc = data.Reg_GRP[i].Cst_AccNo;
                                    row.name = data.Reg_GRP[i].Cst_AccNo + "_" +data.Reg_GRP[i].SgAcc_TpCd + "_" + data.Reg_GRP[i].Acc_AccNm+ "_" + data.Reg_GRP[i].Rcncl_Ind;
                                    ptData.push(row);
                                }
                            }

                            cardData.ptData = ptData;
                            cardData.czData = czData;

                            console.log('>>>>>>回单--单位结算卡（账户信息）>>>>>>' + PJF.util.json2str(cardData));
                            if('balanceSelfHF' == menu){
                                flag = false;//跳过账户类型选择

                                /**
                                 * 全账号判断是否签约CMST00024判断
                                 * 全部未签约拦截，部分签约继续后面的逻辑
                                 */
                                console.log('>>>>>>balanceSelfHF）>>>>>>ptData' + PJF.util.json2str(ptData));
                                console.log('>>>>>>balanceSelfHF）>>>>>>czData' + PJF.util.json2str(czData));
                                var respData = ptData;// 卡下所有的普通账户
                                var CZrespData = czData;// 卡下所有的财资账户
                                // 请求报文中所有的账号信息
                                //var record = new Array();
                                var Acc_Record = new Array();//20200731新接口改造
                                // @critical 开始时间为当前时间往前92天
                                var lastDate = new Date().setDate(new Date().getDate() - 92);
                                var begin_date = PJF.util.formatDate(new Date(lastDate),"yyyyMMdd");
                                var end_date = PJF.util.formatDate(new Date(),"yyyyMMdd");


                                // 账户下拉框数据写入
                                if(CZrespData && CZrespData.length >= 1){
                                    //取所有账户数据
                                    for(var i = 0; i < CZrespData.length; i++){
                                        var temp = CZrespData[i];
                                        if(temp.name){
                                            var ta = temp.name.split("_");
                                            var row = {
                                               /* 'ACCT_NO':ta[0],// 账号
                                                'ACC_FLAG':'0',// 回签结果:0 所有未回签1 相符2 不相符3 所有已回签
                                                'DEP_TYPE':'',//ta[1],// 账户类型:1 活期2 定期3 贷款
                                                'BEGIN_DATE':begin_date,// 开始日期
                                                'END_DATE':end_date,// 结束日期
                                                'Rcncl_Ind':ta[3],// 自组标志
                                                'COIN_TYPE':''// 币种*/
                                                'Cst_AccNo':ta[0],// 客户账号
                                                'Cst_Nm':ta[2],// 客户名称
                                                'Acc_Tp_ID':'',// 账户类型:1 活期2 定期3 贷款
                                                'CcyCd':''// 币种
                                            };
                                            //record.push(row);
                                            if(ta[3] == "1") {
                                                Acc_Record.push(row);
                                            }
                                            console.log("CZrespData" + ta[0]);
                                        }
                                    }
                                }
                                // 账户下拉框数据写入
                                if(respData && respData.length >= 1){
                                    // @critical 取所有账户数据
                                    for(var i = 0; i < respData.length; i++){
                                        var temp = respData[i];
                                        if(temp.name){
                                            var ta = temp.name.split("_");
                                            var row = {
                                               /* 'ACCT_NO':ta[0],// 账号
                                                'ACC_FLAG':'0',// 回签结果:0 所有未回签1 相符2 不相符3 所有已回签
                                                'DEP_TYPE':'',//ta[1],// 账户类型:1 活期2 定期3 贷款
                                                'BEGIN_DATE':begin_date,// 开始日期
                                                'END_DATE':end_date,// 结束日期
                                                'Rcncl_Ind':ta[3],// 自组标志
                                                'COIN_TYPE':''// 币种*/
                                                'Cst_AccNo':ta[0],// 客户账号
                                                'Cst_Nm':ta[2],// 客户名称
                                                'Acc_Tp_ID':'',// 账户类型:1 活期2 定期3 贷款
                                                'CcyCd':''// 币种
                                            };
                                            //record.push(row);
                                            if(ta[3] == "1") {
                                                Acc_Record.push(row);
                                            }
                                            console.log("respData" + ta[0]);
                                        }
                                    }
                                }
                                // @critical 根据T001的返回，判断是否签约自助对账，所以这里就不需要再发T023的交易了
                                if(!Acc_Record || Acc_Record.length == 0){
                                    var msgBox = new PJF.ui.errorMessageBox({
                                        content : '您尚未签约自助对账功能，请联系大堂经理',
                                        //detailMsg: msg,
                                        buttonConfs : [ {
                                            name : '确定',
                                            style : 'main',
                                            appendStyle : 'confirm',
                                            onClick : function() {
                                                template.loadPage('subMenuPage','CPB20008');//返回菜单页面
                                            }
                                        } ]
                                    });
                                }else {
                                    console.log("已签约自助对账的账号信息："+PJF.util.json2str(Acc_Record));
                                    cardData.accountType = 0;//0-普通账户，1-财资账户（全量明细），2-财资账户（过滤明细），3-财资账户（对账单）
                                    template.loadPage(menu,cardData);
                                }

                                /* var jsonData = {
                                     'Version':'01',// 信息格式版本
                                     'TxCode':'CMST00024',// 交易代码
                                     'chanl_cust_no':'STM',// 渠道客户号
                                     'SYS_EVT_TRACE_ID':PJF.otherInfo.SVC_ID,// 全局流水跟踪号
                                     'OPR_NO':PJF.otherInfo.devId,// 操作员号
                                     //'PAGE_NO':curPage,// 当前页码
                                     'INQUIRE_NUM':'8',// 查询条数
                                     'PRT_FLAG':'1'// 打印标志：2自助设备打印
                                 };

                                 jsonData._pagination = {};
                                 jsonData._pagination.PAGE_JUMP = '1';

                                 jsonData.Record = record;
                                 console.log("CMST00024->record" + PJF.util.json2str(record));
                                 PJF.communication.cpsJsonReq({
                                     fwServiceId: 'simpleTransaction',
                                     fwTranId: 'CMST00024-stm',
                                     async: true, //默认同步
                                     jsonData: PJF.util.json2str(jsonData),
                                     success: function(resp) {
                                         console.log("CMST00024->success");
                                         console.log(resp);
                                         if(resp.RESP_MESG && resp.RESP_MESG.indexOf('ST1001') > -1){//ST1001未签约自助对账
                                             var msgBox = new PJF.ui.errorMessageBox({
                                                 content : '您尚未签约自助对账功能，请联系大堂经理',
                                                 //detailMsg: msg,
                                                 buttonConfs : [ {
                                                     name : '确定',
                                                     style : 'main',
                                                     appendStyle : 'confirm',
                                                     onClick : function() {
                                                         template.loadPage('subMenuPage','CPB20008');//返回菜单页面
                                                     }
                                                 } ]
                                             });
                                         } else {
                                             cardData.accountType = 0;//0-普通账户，1-财资账户（全量明细），2-财资账户（过滤明细），3-财资账户（对账单）
                                             template.loadPage(menu,cardData);
                                         }
                                     },
                                     failure: function(responseData) {
                                         /!*var msg = '';
                                         if(responseData._COMMON){
                                             msg = "错误码：" + responseData.BK_CODE + "<br>全局跟踪号：" + responseData._COMMON.SYS_EVT_TRACE_ID + "<br>错误描述：" + responseData.BK_DESC;
                                         } else {
                                             msg = "错误码：" + responseData.BK_CODE + "<br>错误描述：" + responseData.BK_DESC;
                                         }*!/
                                         console.log("CMST00024->record" + PJF.util.json2str(responseData));
                                         var msgBox = new PJF.ui.errorMessageBox({
                                             //content : '自助对账校验验证失败',
                                             //detailMsg: msg,
                                             data:responseData,
                                             buttonConfs : [ {
                                                 name : '确定',
                                                 style : 'main',
                                                 appendStyle : 'confirm',
                                                 onClick : function() {
                                                     template.loadPage('subMenuPage','CPB20008');//返回菜单页面
                                                 }
                                             } ]
                                         });
                                     }
                                 });*/
                            } else {
                                if(flag){
                                    template.loadPage('accountTypeHF',cardData);
                                } else {
                                    cardData.accountType = 0;//0-普通账户，1-财资账户（全量明细），2-财资账户（过滤明细），3-财资账户（对账单）
                                    if('printCBDetailHF' == menu || 'printPatchCBDetailHF' == menu){
                                        cardData.indexSelect = 0;
                                        cardData.SgAcc_TpCd = 1;
                                    }
                                    template.loadPage(menu,cardData);
                                }
                            }
                        }
                    }

                    // @critical 回单卡判断是否有重要信息提示
                    if('02' == type && menu != 'selfServiceHints'){
                        STM.corporateBillNew.readCardNext.ifImprtInfoAsync(data.Cst_ID,function (flag) {
                            console.log("查询信息标志flag："+flag);
                            if(flag > 0){
                                new PJF.ui.errorMessageBox({
                                    title: '提示信息',
                                    content:  '您有未阅读的重要服务提示',
                                    buttonConfs: [
                                        {
                                            bgColor: 'rgb(121,198,30)',
                                            name: '查看',
                                            style: 'main',
                                            appendStyle : "confirm",
                                            onClick: function () {
                                                template.loadPage('selfServiceHints', {
                                                    infoFlag:'imprt',
                                                    custNo :  data.Cst_ID,
                                                    continueCb:function () {
                                                        conDealBusiness(data,cardNo,type);
                                                    }
                                                });
                                            }
                                        },
                                        {
                                            bgColor: 'rgb(121,198,30)',
                                            name: '忽略',
                                            style: 'main',
                                            onClick: function () {
                                                conDealBusiness(data,cardNo,type);
                                            }
                                        }
                                    ]
                                });
                            }else{
                                conDealBusiness(data,cardNo,type);
                            }
                        });
                    }else{
                        console.log("继续dealBusiness方法");
                        conDealBusiness(data,cardNo,type);
                    }
        		};
        		
        		/**
                 * @function toBusinessPage
        		 * @param {Object}data 登录入验证后的账户数据
        		 * @param{String}cardNo 卡号
        		 * @param{String}type 卡类型
                 * 跳转到业务界面（余额、账页）
        		 */
        		var toBusinessPage = function(data,cardNo,type){
                    function conToBusinessPage(data,cardNo,type) {
                       /* if(!data || !data.Reg_GRP){
                            showAlertMsg('卡未绑定账户，请到回单柜处理相关业务');
                            return;
                        }*/
                        if(data.Reg_GRP && data.Reg_GRP.length && data.Reg_GRP.length >= 200){//超过200条数据到回单柜处理
                            showAlertMsg('卡绑定账户过多，请到回单柜处理相关业务');
                        } else {
                            if('01' == type){
                                cardData.Txn_CardNo = cardNo;
                            } else if ('02' == type){
                                //回单卡修改密码传的卡号应该是外设读取的卡号而不是后台返回的卡号，这两个卡号是不一样的
                                if('pwdChange' == menu){
                                    cardData.Txn_CardNo_KaNei = cardNo;
                                }
                                cardData.Txn_CardNo = data.Txn_CardNo;
                            }
                            cardData.type= type;
                            cardData.resData = data;
                            cardData.base64=tmpData.base64;
                            
                            template.loadPage(menu, cardData);
                        }
                    }

                    // @critical 回单卡判断是否有重要信息提示
                    console.log(">>>menu:"+menu);
                    if('02' == type && menu != 'selfServiceHints'){
                        STM.corporateBillNew.readCardNext.ifImprtInfoAsync(data.Cst_ID,function (flag) {
                            console.log("查询信息标志flag："+flag);
                            if(flag > 0){
                                new PJF.ui.errorMessageBox({
                                    title: '提示信息',
                                    content:  '您有未阅读的重要服务提示',
                                    buttonConfs: [
                                        {
                                            bgColor: 'rgb(121,198,30)',
                                            name: '查看',
                                            style: 'main',
                                            appendStyle : "confirm",
                                            onClick: function () {
                                                template.loadPage('selfServiceHints', {
                                                    infoFlag:'imprt',
                                                    custNo :  data.Cst_ID,
                                                    continueCb:function () {
                                                        conToBusinessPage(data,cardNo,type);
                                                    }
                                                });
                                            }
                                        },
                                        {
                                            bgColor: 'rgb(121,198,30)',
                                            name: '忽略',
                                            style: 'main',
                                            onClick: function () {
                                                conToBusinessPage(data,cardNo,type);
                                            }
                                        }
                                    ]
                                });
                            }else{
                                conToBusinessPage(data,cardNo,type);
                            }
                        });
                    }else{
                        console.log("继续conToBusinessPage方法");
                        conToBusinessPage(data,cardNo,type);
                    }
        		};
        	
        		
        		if(1){
        		var sendA07824616Obj = {
        				Btch_Vchr_Blg_AccNo:tmpData.cardNo,
        				DbCrd_MsgRp_Ecrp_Pswd:tmpData.base64
        		}
        		console.log(sendA07824616Obj);
        		PJF.communication.cpsJsonReq({
    				fwServiceId : "simpleTransaction",
    				fwTranId : "A07824616-HF",
    				maskAll : true,
    				async : false,
    				jsonData : PJF.util.json2str(sendA07824616Obj),
    				success : function(responseData) {
    					console.log("回单卡卡内号/结算卡卡号："+tmpData.cardNo+"<br>全局跟踪号：" + responseData._COMMON.SYS_EVT_TRACE_ID + "<br>错误描述：" + responseData.BK_DESC);
    					if(responseData && responseData.Mnplt_StCd){
    						if(responseData.Mnplt_StCd == '00'){
    					if(tmpData.type == '02'){
                            STM.corporateBill.huiDCardNo = tmpData.cardNo;
                            STM.corporateBill.initT001Param = {};
                            STM.corporateBill.initT001Param = tmpData;
                        }
						('ledgerPageDetailListHF' == menu || 'CPBBalanceQueryHF' == menu||'queryNotice' == menu || 'pwdChange' == menu || 'selfServiceHints' == menu)?
						toBusinessPage({},tmpData.cardNo,tmpData.type) : dealBusiness({},tmpData.cardNo,tmpData.type);
    					}
						else{
							STM.corporateBill.showAlertMsg('账号或密码错误!');
							console.log('账号或密码错误:'+ PJF.util.json2str(responseData));
						}
    					}
    				},
    				failure : function(responseData) {
                        console.log("》》交易卡卡面号:"+responseData.Txn_CardNo+"<br>回单卡卡内号/结算卡卡号："+tmpData.cardNo+"<br>全局跟踪号：" + responseData._COMMON.SYS_EVT_TRACE_ID + "<br>错误描述：" + responseData.BK_DESC);
                        //YCEA0782SE03 密码错误
                        if('YCEA0782SE03' == responseData.BK_CODE){
                            console.log("回单卡密码输入错误");
                            var bkDesc = "";
                            //转义之后使用BK_DESC_RAW字段
                            /*if(responseData && responseData.BK_DESC){
                                var a = responseData.BK_DESC.indexOf("@@");
                                var b = responseData.BK_DESC.lastIndexOf("@@");
                                console.log(a);
                                console.log(b);
                                if(a != -1 && b != -1){
                                    bkDesc = responseData.BK_DESC.substring(a+2,b);
                                }
                            }*/
                            if(responseData && responseData.BK_DESC_RAW){
                                var a = responseData.BK_DESC_RAW.indexOf("@@");
                                var b = responseData.BK_DESC_RAW.lastIndexOf("@@");
                                console.log(a);
                                console.log(b);
                                if(a != -1 && b != -1){
                                    bkDesc = responseData.BK_DESC_RAW.substring(a+2,b);
                                }
                            }
                            if(tmpData && tmpData.emidFailure&&(typeof(tmpData.emidFailure)=="function")){
                                console.log("t001密码错误返回信息："+responseData.BK_DESC);
                                tmpData.emidFailure(bkDesc);
                            }
                        }else{
                            var msgBox = new PJF.ui.errorMessageBox({
                                //content : '对公自助账单登录验证失败',
                                //detailMsg: msg,
                                data:responseData,
                                buttonConfs : [ {
                                    name : '确定',
                                    style : 'main',
                                    appendStyle : 'confirm',
                                    onClick : function() {
                                        //查询服务通知返回“公司业务”下
                                        if("selfServiceHints" == menu){
                                            template.loadPage('homepage');
                                        }else{
                                            template.loadPage('entryIndex',{
                                            	accNo:tmpData.cardNo
                                            });//返回菜单页面
                                        }
                                    }
                                } ]
                            });
                        }
    				}
        		});
        		}
        		else{
        		//11.16 CMST00001 =>A0782T001
        		var json = {};
        		json.TxCode = 'A0782T001';
        		json.OPR_NO = PJF.otherInfo.devId; // 柜员号
        		json.chanl_cust_no = '';
        		json.Txn_CardNo = tmpData.cardNo;
        		json.Crd_TpCd = tmpData.type;
        		json.Non_Fnc_Vld_CD = tmpData.base64;
        		json.CCBIns_ID = PJF.roleInfo.orgCode;
                json._pagination={'REC_IN_PAGE':'100','PAGE_JUMP':'1'};
        		PJF.communication.cpsJsonReq({
    				fwServiceId : "simpleTransaction",
    				//fwTranId : "A0782T001-stm",//STM登录验证服务
    				fwTranId : "A0782T001-HF",
    				maskAll : true,
    				async : false,
    				jsonData : PJF.util.json2str(json),
    				success : function(responseData) {
                        console.log("对公自助账单(A0782T001)--卡可用标志：" + responseData.Avl_Ind);
    					console.log("》》交易卡卡面号:"+responseData.Txn_CardNo+"<br>回单卡卡内号/结算卡卡号："+tmpData.cardNo+"<br>全局跟踪号：" + responseData._COMMON.SYS_EVT_TRACE_ID + "<br>错误描述：" + responseData.BK_DESC);
    					if(responseData.Avl_Ind){
    						switch (parseInt(responseData.Avl_Ind)) {
    						case 0:
    						    //卡可用
                                //@critical 记录回单卡卡号
                                if(tmpData.type == '02'){
                                    STM.corporateBill.huiDCardNo = tmpData.cardNo;
                                    STM.corporateBill.initT001Param = {};
                                    STM.corporateBill.initT001Param = tmpData;
                                }
    							('ledgerPageDetailListHF' == menu || 'CPBBalanceQueryHF' == menu||'queryNotice' == menu || 'pwdChange' == menu || 'selfServiceHints' == menu)?
    							toBusinessPage(responseData,tmpData.cardNo,tmpData.type) : dealBusiness(responseData,tmpData.cardNo,tmpData.type);
    							break;
    						case 1:
    							//showAlertMsg('卡号不存在');
    							showAlertMsg('该卡未开通此功能，请在本机上或移步至柜台签约账单自助服务');
    							break;
    						case 2:
    							//showAlertMsg('卡已挂失');
    							showAlertMsg('该卡状态异常，请移步柜面查询');
    							break;
    						case 3:
    							//showAlertMsg('卡已注销');
    							showAlertMsg('该卡状态异常，请移步柜面查询');
    							break;
    						case 4:
    							//showAlertMsg('卡已锁定');
    							showAlertMsg('该卡状态异常，请移步柜面查询');
    							break;
    						case 5:
    							//showAlertMsg('卡欠费，已锁定');
    							showAlertMsg('该卡状态异常，请移步柜面查询');
    							break;
    						case 6:
    							//showAlertMsg('卡欠费提示');
    							var msgBox2 = new PJF.ui.errorMessageBox({
    		        				content : '您的帐户已经欠费，请尽快到柜面补缴费用，以免影响业务使用',
    		        				buttonConfs : [ {
    		        					name : '确定',
    		        					style : 'main',
    		        					appendStyle : 'confirm',
    		        					onClick : function() {
    		        						('ledgerPageDetailListHF' == menu || 'CPBBalanceQueryHF' == menu)?
    		            					toBusinessPage(responseData,tmpData.cardNo,tmpData.type) : dealBusiness(responseData,tmpData.cardNo,tmpData.type);
    		        					}
    		        				} ]
    		        			});
    							break;
    						case 7:
    							//showAlertMsg('超出使用范围');
    							showAlertMsg('该卡状态异常，请移步柜面查询');
    							break;
    						case 8:
    							/*//showAlertMsg('密码输入错误');
    							showAlertMsg('密码错误');*/
    							//回单卡会传emidFailure方法，结算卡不会
    							if(tmpData && tmpData.emidFailure&&(typeof(tmpData.emidFailure)=="function")){
    								tmpData.emidFailure();
    							}else{
                                    showAlertMsg('密码输入错误');
                                }
    							break;
    						case 9:
    							//showAlertMsg('密码输入错误，并且到达上限，锁定');
    							showAlertMsg('该卡状态异常，请移步柜面查询');
    							break;
    						default:
    							break;
    						}
    					}
    				},
    				failure : function(responseData) {
    					/*var msg = '';
    					if(responseData._COMMON){
    						msg = "错误码：" + responseData.BK_CODE + "<br>全局跟踪号：" + responseData._COMMON.SYS_EVT_TRACE_ID + "<br>错误描述：" + responseData.BK_DESC;
    					} else {
    						msg = "错误码：" + responseData.BK_CODE + "<br>错误描述：" + responseData.BK_DESC;
    					}*/
                        console.log("》》交易卡卡面号:"+responseData.Txn_CardNo+"<br>回单卡卡内号/结算卡卡号："+tmpData.cardNo+"<br>全局跟踪号：" + responseData._COMMON.SYS_EVT_TRACE_ID + "<br>错误描述：" + responseData.BK_DESC);
                        //YCEA0782SE03 密码错误
                        if('YCEA0782SE03' == responseData.BK_CODE){
                            console.log("回单卡密码输入错误");
                            var bkDesc = "";
                            //转义之后使用BK_DESC_RAW字段
                            /*if(responseData && responseData.BK_DESC){
                                var a = responseData.BK_DESC.indexOf("@@");
                                var b = responseData.BK_DESC.lastIndexOf("@@");
                                console.log(a);
                                console.log(b);
                                if(a != -1 && b != -1){
                                    bkDesc = responseData.BK_DESC.substring(a+2,b);
                                }
                            }*/
                            if(responseData && responseData.BK_DESC_RAW){
                                var a = responseData.BK_DESC_RAW.indexOf("@@");
                                var b = responseData.BK_DESC_RAW.lastIndexOf("@@");
                                console.log(a);
                                console.log(b);
                                if(a != -1 && b != -1){
                                    bkDesc = responseData.BK_DESC_RAW.substring(a+2,b);
                                }
                            }
                            if(tmpData && tmpData.emidFailure&&(typeof(tmpData.emidFailure)=="function")){
                                console.log("t001密码错误返回信息："+responseData.BK_DESC);
                                tmpData.emidFailure(bkDesc);
                            }
                        }else{
                            var msgBox = new PJF.ui.errorMessageBox({
                                //content : '对公自助账单登录验证失败',
                                //detailMsg: msg,
                                data:responseData,
                                buttonConfs : [ {
                                    name : '确定',
                                    style : 'main',
                                    appendStyle : 'confirm',
                                    onClick : function() {
                                        //查询服务通知返回“公司业务”下
                                        if("selfServiceHints" == menu){
                                            template.loadPage('homepage');
                                        }else{
                                            template.loadPage('subMenuPage','CPB20008');//返回菜单页面
                                        }
                                    }
                                } ]
                            });
                        }
    				}
    			});
            }
        	}
    	}
}