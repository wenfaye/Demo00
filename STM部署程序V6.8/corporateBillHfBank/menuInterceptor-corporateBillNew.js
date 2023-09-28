/**
 * @file 账单自助的拦截文件
 * @author ZhangAXiong
 * @version 1.0
 * Last Updated 2021-01-19
 * 1.账单自助菜单的拦截
 * 2.回单卡，结算卡登陆拦截
 */
PJF.apply(PJF.stm.menuInterceptor,{
	//回单打印
    menuCPB30062CallBack: function () {
    	corporateBillLoginCheckNew('printCBDetailHF');
        template.leftTopSwitch('navBar');
         template.setNavbar(3, "回单打印", "CPB30062");
        return false;
    },
    //回单补打
    menuCPB30063CallBack: function () {
    	corporateBillLoginCheckNew('printPatchCBDetailHF');
    	
    	template.leftTopSwitch('navBar');
    	template.setNavbar(3, "回单补打", "CPB30063");
    	return false;
    },
	//明细查询
    menuCPB30064CallBack: function () {
    	corporateBillLoginCheckNew('queryCBDetailHF');
    	
    	template.leftTopSwitch('navBar');
    	template.setNavbar(3, "明细查询", "CPB30064");
    	
    	return false;
    },
    //余额查询
    menuCPB30065CallBack: function () {
    	corporateBillLoginCheckNew('CPBBalanceQueryHF');
    	
    	template.leftTopSwitch('navBar');
    	template.setNavbar(3, "余额查询", "CPB30065");
    	return false;
    },
    //扫描验证
    menuCPB30066CallBack: function () {
    	template.loadPage('CPBScanningNew');
    	
    	template.leftTopSwitch('navBar');
    	template.setNavbar(3, "扫描验证", "CPB30066");
    	return false;
    },
    //账页明细
    menuCPB30067CallBack: function () {
    	corporateBillLoginCheckNew('ledgerPageDetailListHF');
    	
    	template.leftTopSwitch('navBar');
    	template.setNavbar(3, "账页明细", "CPB30067");
    	return false;
    },
    // 支付密码校验
    menuCPB30069CallBack: function () {
    	// 结算卡已经刷卡验密
    	if(PJF.stm.util.hasInsertedCardCor() == true){
    		corporateBillLoginCheckNew('payCheckHF');
    	}else{
    		template.loadPage('payCheckHF');
    	}
    	
    	template.leftTopSwitch('navBar');
    	template.setNavbar(3, "支付密码校验", "CPB30069");
    	return false;
    },
    // 自助对账
    menuCPB30068CallBack: function () {
    	corporateBillLoginCheckNew('balanceSelfHF');
    	
    	template.leftTopSwitch('navBar');
    	template.setNavbar(3, "自助对账", "CPB30068");
    	return false;
    },
    // 查询通知
    menuCPB30075CallBack: function () {
        corporateBillLoginCheckNew('queryNotice');

        template.leftTopSwitch('navBar');
        template.setNavbar(3, "查询通知", "CPB30075");
        return false;
    },
    // 修改密码
    menuCPB30074CallBack: function () {
        corporateBillLoginCheckNew('pwdChange');

        template.leftTopSwitch('navBar');
        template.setNavbar(3, "修改密码", "CPB30074");
        return false;
    },
    // 公司业务--查询服务通知
    menuCPB20019CallBack: function () {
        corporateBillLoginCheckNew('selfServiceHints');
        template.leftTopSwitch('navBar');
        template.setNavbar(2, "查询服务通知", "CPB20019");
        return false;
    }
    /**
	 * 账单签约判断-meijian-2015-11-30
	 * 签了约返回true
	 */
	/*signJudge : function() {
		//var loading = new PJF.ui.loading({msg: '正在查询客户是否签约账单自助，请稍后...'});
		var jsonDataAush = {
			"chnl_cust_no" : STM.pubMutiServicePublic.CST_INFO.Cst_ID,
			"OPR_NO" : PJF.userInfo.userCode,
			"Cst_ID" : STM.pubMutiServicePublic.CST_INFO.Cst_ID,
			"Sign_AccNo" : STM.pubMutiServicePublic.ACCNO_RESPONSEDATA.Cst_AccNo
		};
		
		PJF.communication.cpsJsonReq({
			fwServiceId : "simpleTransaction",
			fwTranId : "CMSS00002-stm",
			maskAll : true,
			async : false,
			jsonData : PJF.util.json2str(jsonDataAush),
			success : function(responseData) {
				console.log("查询账单自助成功，返回信息：" + PJF.util.json2str(responseData));
				//loading.destroy();
				if (responseData && responseData.QryGrp && responseData.QryGrp.length > 0){
					for(var p in responseData.QryGrp){
						if(responseData.QryGrp[p].SignNo && responseData.QryGrp[p].SignNo != ''){
							STM.pubMutiServicePublic.isSignBillBuff = true; // 已经有签约账单自助
							break;
						}
					}
					console.log("账单自助合约信息：" + responseData.QryGrp);
				}
				return ;
			},
			failure : function(responseData) {
				console.log("查询账单自助失败，返回信息：" + PJF.util.json2str(responseData));
				//loading.destroy();
				if (responseData.BK_CODE) {
					
				}
			}
		});
		return true;
	},*/

 });

/**
 * @function corporateBillLoginCheckNew
 * @param {String}menu 菜单
 * 结算卡、回单卡登录验证
 */
function corporateBillLoginCheckNew(menu){
    var cardData = {};
    cardData.menu = menu;
    var tmpData = {};

    tmpData.cardNo = null;
    //tmpData.base64 = "ODg4ODg4";//@critical 回单卡需要
    tmpData.base64 = null;//@critical 回单卡需要
    tmpData.type = null;//@critical 01-结算卡，02-回单卡
    //@critical 初始中间操作值
    STM.corporateBill.initParamBeforeOper();
    //@critical 判断机构是否是这几家，（浪潮设备）
    var orgCode = PJF.orgInfo.instLevel1BranchId;// 建行机构号
    console.log(">>>>>>机构号orgCode："+orgCode);
    var ifClude = STM.corporateBill.orgName.indexOf(orgCode);
    console.log(">>>>>>机构号orgCode六家范围："+STM.corporateBill.orgName);
    console.log(">>>>>>机构号orgCode是否在六家范围内："+ifClude);
    if(ifClude < 0){
        console.log(">>>>>>不在六家范围内。。。");
        STM.corporateBill.ifCluOrg = false;
    }else{
        console.log(">>>>>>在六家范围内。。。");
        STM.corporateBill.ifCluOrg = true;
    }

   /* var bizNextStep = function(tmpData){
        console.log("验证成功返回数据============》"+JSON.stringify(tmpData));
        if(tmpData.cardNo){
            //消息输出
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

            //处理交易
            var dealBusiness = function(data,cardNo,type){
                if(!data || !data.Reg_GRP){
                    showAlertMsg('卡未绑定账户，请到回单柜处理相关业务');
                    return;
                }
                if(data.Reg_GRP&& data.Reg_GRP.length >= 200){//超过200条数据到回单柜处理
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
                    for(var i=0; i<data.Reg_GRP.length; i++){
                        row = {};
                        console.log("该账号签约的是自助设备对账data.Reg_GRP[i].Rcncl_Ind->"+data.Reg_GRP[i].Rcncl_Ind);
                        if(4 == data.Reg_GRP[i].SgAcc_TpCd){//4-财资账户
                            flag = true;

                            row.desc = data.Reg_GRP[i].Cst_AccNo;
                            row.name = data.Reg_GRP[i].Cst_AccNo + "_" + data.Reg_GRP[i].SgAcc_TpCd + "_" + data.Reg_GRP[i].Acc_AccNm+ "_" + data.Reg_GRP[i].Rcncl_Ind;
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

                        /!**
                         * 全账号判断是否签约CMST00024判断
                         * 全部未签约拦截，部分签约继续后面的逻辑
                         *!/
                        var respData = ptData;// 卡下所有的普通账户
                        var CZrespData = czData;// 卡下所有的财资账户
                        // 请求报文中所有的账号信息
                        //var record = new Array();
                        var Acc_Record = new Array();//20200731新接口改造
                        //开始时间为当前时间往前92天
                        var lastDate = new Date().setDate(new Date().getDate() - 92);
                        var begin_date = PJF.util.formatDate(new Date(lastDate),"yyyyMMdd");
                        var end_date = PJF.util.formatDate(new Date(),"yyyyMMdd");
                        
                        // 账户下拉框数据写入
	    				if(CZrespData && CZrespData.length >= 1){
	    					//取所有签约账户数据
	    					for(var i = 0; i < CZrespData.length; i++){
	    						var temp = CZrespData[i];
	    						if(temp.name){
	    							var ta = temp.name.split("_");
	    							var row = {
	    								/!*'ACCT_NO':ta[0],// 账号
	    								'ACC_FLAG':'0',// 回签结果:0 所有未回签1 相符2 不相符3 所有已回签
	    								'DEP_TYPE':'',//ta[1],// 账户类型:1 活期2 定期3 贷款
	    								'BEGIN_DATE':begin_date,// 开始日期
	    								'END_DATE':end_date,// 结束日期
	    								'Rcncl_Ind':ta[3],// 自组标志
	    								'COIN_TYPE':''// 币种*!/
                                        'Cst_AccNo':ta[0],// 客户账号
                                        'Cst_Nm':ta[2],// 客户名称
                                        'Acc_Tp_ID':'',// 账户类型:1 活期2 定期3 贷款
                                        'CcyCd':''// 币种
	    							};
                                    if(ta[3] == "1") {
                                        Acc_Record.push(row);
                                    }
	    							console.log("CZrespData" + ta[0]);
	    						}
	    					}
	    				}
                        // 账户下拉框数据写入
                        if(respData && respData.length >= 1){
                            //取所有账户数据
                            for(var i = 0; i < respData.length; i++){
                                var temp = respData[i];
                                if(temp.name){
                                    var ta = temp.name.split("_");
                                    var row = {
                                        /!*'ACCT_NO':ta[0],// 账号
                                        'ACC_FLAG':'0',// 回签结果:0 所有未回签1 相符2 不相符3 所有已回签
                                        'DEP_TYPE':'',//ta[1],// 账户类型:1 活期2 定期3 贷款
                                        'BEGIN_DATE':begin_date,// 开始日期
                                        'END_DATE':end_date,// 结束日期
                                        'Rcncl_Ind':ta[3],// 自组标志//
                                        'COIN_TYPE':''// 币种*!/
                                        'Cst_AccNo':ta[0],// 客户账号
                                        'Cst_Nm':ta[2],// 客户名称
                                        'Acc_Tp_ID':'',// 账户类型:1 活期2 定期3 贷款
                                        'CcyCd':''// 币种
                                    };
                                    if(ta[3] == "1") {
                                        Acc_Record.push(row);
                                    }
                                }
                            }
                        }
                        //根据T001的返回，判断是否签约自助对账，所以这里就不需要再发T023的交易了
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

                       /!* var jsonData = {
                            /!*'Version':'01',// 信息格式版本
                            'TxCode':'CMST00024',// 交易代码
                            'chanl_cust_no':'STM',// 渠道客户号
                            'SYS_EVT_TRACE_ID':PJF.otherInfo.SVC_ID,// 全局流水跟踪号
                            'OPR_NO':PJF.otherInfo.devId,// 操作员号
                            //'PAGE_NO':curPage,// 当前页码
                            'INQUIRE_NUM':'8',// 查询条数
                            'PRT_FLAG':'1'// 打印标志：2自助设备打印*!/
                            'Enqr_StDt':begin_date,// 查询起始日期
                            'Enqr_CODt':end_date,//查询截止日期
                            'Cur_Pcsg_StCd':'',//当前处理状态代码 对账单状态：009003 已回签009008 未回签 送空默认查全部
                            'PdAr_ID':'',//产品合约编号  对应老接口字段：BILL_NO  对应账单编号
                            'Pcs_StCd':'1'//过程状态代码 对应查询标志1 查账单 2 查账单明细
                        };

                        jsonData._pagination = {};
                        jsonData._pagination.PAGE_JUMP = '1';//多页查询跳转页码
                        jsonData._pagination.REC_IN_PAGE = '9';//多页查询每页笔数

                        jsonData.Acc_Record = Acc_Record;

                        PJF.communication.cpsJsonReq({
                            fwServiceId: 'simpleTransaction',
                            //fwTranId: 'CMST00024-stm',
                            fwTranId: 'A0782T023-stm',
                            async: true, //默认同步
                            jsonData: PJF.util.json2str(jsonData),
                            success: function(resp) {
                                console.log("》》》》A0782T023-stm交易查询成功，全局跟踪号："+resp._COMMON.SYS_EVT_TRACE_ID);
                                if(resp.RESP_MESG && resp.RESP_MESG.indexOf('ST1001') > -1){//ST1001未签约自助对账
                                    var msgBox = new PJF.ui.errorMessageBox({
                                        content : '您尚未签约自助对账功能，请联系大堂经理',
                                        //detailMsg: msg,
                                        buttonConfs : [ {
                                            name : '确定',
                                            style : 'main',
                                            appendStyle : 'confirm',
                                            onClick : function() {
                                                //template.loadPage('subMenuPage','CPB20008');//返回菜单页面
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

                                var msgBox = new PJF.ui.errorMessageBox({
                                    //content : '自助对账校验验证失败',
                                    //detailMsg: msg,
                                    data:responseData,
                                    buttonConfs : [ {
                                        name : '确定',
                                        style : 'main',
                                        appendStyle : 'confirm',
                                        onClick : function() {
                                            //template.loadPage('subMenuPage','CPB20008');//返回菜单页面
                                        }
                                    } ]
                                });
                            }
                        })*!/
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
            };

            /!*
             * 跳转到业务界面（余额、账页）
             * data 登录入验证后的账户数据
             * cardNo 卡号
             * type 卡类型
             *!/
            var toBusinessPage = function(data,cardNo,type){
                if(!data || !data.Reg_GRP){
                    showAlertMsg('卡未绑定账户，请到回单柜处理相关业务');
                    return;
                }
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
                fwTranId : "A0782T001-stm",//STM登录验证服务
                maskAll : true,
                async : false,
                jsonData : PJF.util.json2str(json),
                success : function(responseData) {
                    console.log("对公自助账单(A0782T001)--卡可用标志：" + responseData.Avl_Ind);
                    console.log("》》交易卡卡面号:"+responseData.Txn_CardNo+"<br>回单卡卡内号/结算卡卡号："+tmpData.cardNo+"<br>全局跟踪号：" + responseData._COMMON.SYS_EVT_TRACE_ID + "<br>错误描述：" + responseData.BK_DESC);
                    if(responseData.Avl_Ind){
                        switch (parseInt(responseData.Avl_Ind)) {
                            case 0:
                                ('ledgerPageDetailListHF' == menu || 'CPBBalanceQueryHF' == menu || 'payCheckHF' == menu||'queryNotice' == menu || 'pwdChange' == menu  || 'selfServiceHints' == menu)?
                                    toBusinessPage(responseData,tmpData.cardNo,tmpData.type) : dealBusiness(responseData,tmpData.cardNo,tmpData.type);
                                break;
                            case 1:
                                //showAlertMsg('卡号不存在');
                                showAlertMsg('该卡未开通此功能，请在本机上或移步至柜台签约账单自助服务');
                                break;
                            case 2:
                                //showAlertMsg('卡已挂失');
                                showAlertMsg('该卡已挂失，请联系大堂经理');
                                break;
                            case 3:
                                //showAlertMsg('卡已注销');
                                showAlertMsg('该卡已注销，请联系大堂经理');
                                break;
                            case 4:
                                //showAlertMsg('卡已锁定');
                                showAlertMsg('该卡已锁定，请联系大堂经理');
                                break;
                            case 5:
                                //showAlertMsg('卡欠费，已锁定');
                                showAlertMsg('该卡欠费，已锁定，请联系大堂经理');
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
                                showAlertMsg('该卡超出使用范围，请联系大堂经理');
                                break;
                            case 8:
                                //showAlertMsg('密码输入错误');
                                showAlertMsg('密码输入错误');
                                break;
                            case 9:
                                //showAlertMsg('密码输入错误，并且到达上限，锁定');
                                showAlertMsg('密码输入错误，并且到达上限，该卡已锁定');
                                break;
                            default:
                                break;
                        }
                    }
                },
                failure : function(responseData) {
                    /!*var msg = '';
                     if(responseData._COMMON){
                     msg = "错误码：" + responseData.BK_CODE + "<br>全局跟踪号：" + responseData._COMMON.SYS_EVT_TRACE_ID + "<br>错误描述：" + responseData.BK_DESC;
                     } else {
                     msg = "错误码：" + responseData.BK_CODE + "<br>错误描述：" + responseData.BK_DESC;
                     }*!/
                    console.log("》》交易卡卡面号:"+responseData.Txn_CardNo+"<br>回单卡卡内号/结算卡卡号："+tmpData.cardNo+"<br>全局跟踪号：" + responseData._COMMON.SYS_EVT_TRACE_ID + "<br>错误描述：" + responseData.BK_DESC);
                    var msgBox = new PJF.ui.errorMessageBox({
                        //content : '对公自助账单登录验证失败',
                        //detailMsg: msg,
                        data:responseData,
                        buttonConfs : [ {
                            name : '确定',
                            style : 'main',
                            appendStyle : 'confirm',
                            onClick : function() {
                                //template.loadPage('subMenuPage','CPB20008');//返回菜单页面
                            }
                        } ]
                    });
                }
            });
        }
    }*/

    //结算卡、回单卡的插卡验密返回卡号
    //@critical 结算卡刷卡判断
    if(PJF.stm.util.hasInsertedCardCor() == false){
        /*var tpData={};
         tpData.pwdNextStep = function(args){
         tmpData.type = '01';
         tmpData.cardNo = PJF.stm.IC_CARD_INFO_COR.resInfo.accountNo;//结算卡卡号
         console.log("结算卡卡号：" + tmpData.cardNo);
         bizNextStep(tmpData);
         }
         template.loadPage("CPBinsertIcCard", tpData);*/
        //@critical 自助对账功能里面点击之后增加无卡登陆按钮
        if('balanceSelfHF' == menu){
            cardData.noCardLog = true;
        }else{
            cardData.noCardLog = false;
        }
        //@critical begin 新增回单卡只登陆一次逻辑
        //todo 如果回单卡号不为空，则调获取回单卡号的方法进行卡号对比，如果为空，则放行去选择结算卡还是回单卡
        //@critical 这样的话就得保证设备读回单卡的部分正常,如果该部分不工作那也会影响结算卡的使用
        if(STM.corporateBill.huiDCardNo){
            PJF.stm.EMD.getCardNum({loadingConf:{noLayer:true},timeout:3},function(result){
                //@critical 同一回单卡离开读卡器，读卡状态为0
                console.log("回单卡读卡状态："+result.status);
                if('1' == result.status){
                    var huiDCardNo = result.info.pchCardNum;
                    console.log("设备读取回单卡成功，卡号："+huiDCardNo);
                    if(huiDCardNo == STM.corporateBill.huiDCardNo){
                        console.log("是同一回单卡号");
                        if(!STM.corporateBill.initT001Param) {
                            console.log("初始T001参数为空，，，");
                            //todo 如果参数为空，继续跳转选卡页面,再次选择,因为已经走了其他流程，参数为空了(进入选卡页面又返回，同一人又来操作)
                            template.loadPage("cardTypeHF",cardData);
                        }else{
                            //@critical 回单卡再次进入，更新菜单
                            console.log("同一回单卡再次办理其他业务的初始参数值："+PJF.util.json2str(STM.corporateBill.initT001Param));
                            STM.corporateBill.initT001Param.menu = menu;
                            STM.corporateBillNew.readCardNext.bizNextStep(STM.corporateBill.initT001Param);
                        }
                    }else{
                        //@critical 不是同一回单卡号，清空上次保存的回单卡信息
                        console.log("不是同一回单卡号，需再次输密码,,,");
                        STM.corporateBill.initT001Param = null;
                        STM.corporateBill.huiDCardNo = null;
                        template.loadPage("cardTypeHF",cardData);
                    }
                } else {
                    //@critical 3秒预读之后，没有读取到那么跳转进选卡页面，如果选择的是回单卡则继续读取
                    //@critical 可以置空，说明回单卡没有读起
                    //@critical 不是同一回单卡号，没放回单卡，读出看来的是空也属于这种情况，这就要在后面继续判断
                    console.log("回单卡读卡状态不为1");
                    console.log("拦截STM.corporateBill.initT001Param:"+PJF.util.json2str(STM.corporateBill.initT001Param));
                    template.loadPage("cardTypeHF",cardData);
                }
            });
        }else{
            //@critical 回单卡号为空，清空请求参数
            console.log("回单卡号全局参数为空");
            STM.corporateBill.initT001Param = null;
            template.loadPage("cardTypeHF",cardData);
        }
       //end回单卡只登陆一次
    } else {
        tmpData.type = '01';
        tmpData.cardNo = PJF.stm.IC_CARD_INFO_COR.resInfo.accountNo;//结算卡卡号
        //bizNextStep(tmpData);
        //@critical 统一使用common下面的readCardNext.js里面的bizNextStep()方法
        tmpData.menu = menu;
        STM.corporateBillNew.readCardNext.bizNextStep(tmpData);
        //@critical 经过一次结算卡，那无论下次是结算卡还是回单卡都要进行选卡，清空回单卡号
        if(STM.corporateBill.huiDCardNo){
            STM.corporateBill.huiDCardNo = "";
        }
    }
}