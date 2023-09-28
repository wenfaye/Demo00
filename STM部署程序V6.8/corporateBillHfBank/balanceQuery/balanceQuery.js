/**
 * @file 可查询余额账户
 * @author ZhangAxiong
 * @version 1.0
 * Create On
 * * Last Updated 2021-01-19
 *展示可以查询余额的账户信息，选择操作进入详细信息
 */
function CPBBalanceQueryHF() {
}

CPBBalanceQueryHF.prototype = {
	accountsInfo : null,// @critical 存放基本验证后返回的账户信息
    init: function (data) {
    	
    	data = data || {};
    	var $this = this;
    	CPBBalanceQueryHF.prototype.accountsInfo = data;
    	/**
         * @function $this.getAccTypeNameByCode
    	 * @param {String} accTypeCode 标志代码
    	 * 根据账户类型代码获取对应的类型名称
    	 */
    	$this.getAccTypeNameByCode = function(accTypeCode){
    		switch(accTypeCode){
			case '1':
				return '活期';
				break;
			case '2':
				return '定期';
				break;
			case '3':
				return '贷款';
				break;
			case '4':
				return '财资';
				break;
			default:
				return '';
			}
    	};
    	
    	// 测试用 -start
    	/*data.resData = {};
    	data.resData.Reg_GRP = [];
    	var accTest = {};
    	accTest.Cst_AccNo = '51050147906600000026';
    	accTest.SgAcc_TpCd = '1';
    	accTest.Acc_AccNm = '测试账号-活期';
    	accTest.DpBkInNo = '1244444444';
    	var accTest5 = {};
    	accTest5.Cst_AccNo = '442501000034000000773';
    	accTest5.SgAcc_TpCd = '1';
    	accTest5.Acc_AccNm = '测试账号-活期2';
    	accTest5.DpBkInNo = '1244444444';
    	var accTest2 = {};
    	accTest2.Cst_AccNo = '51050147906600000026';
    	accTest2.SgAcc_TpCd = '2';
    	accTest2.Acc_AccNm = '测试账号-定期';
    	accTest2.DpBkInNo = '1244444444';
    	var accTest3 = {};
    	accTest3.Cst_AccNo = '51050147906600000026';
    	accTest3.SgAcc_TpCd = '3';
    	accTest3.Acc_AccNm = '测试账号-贷款';
    	accTest3.DpBkInNo = '1244444444';
    	var accTest4 = {};
    	accTest4.Cst_AccNo = '51050147906600000026';
    	accTest4.SgAcc_TpCd = '4';
    	accTest4.Acc_AccNm = '测试账号-财资';
    	accTest4.DpBkInNo = '354545455';
    	data.resData.Reg_GRP.push(accTest);
    	data.resData.Reg_GRP.push(accTest5);
    	data.resData.Reg_GRP.push(accTest2);
    	data.resData.Reg_GRP.push(accTest3);
    	data.resData.Reg_GRP.push(accTest4);*/
    	// 测试用 -end
    	
    	var normalAccs = new Array();// @critical 普通账户
    	var assetAccs = new Array();// @critical 财资账户
    	var responseData = data.resData;// @critical 卡下所有的账户
    	// @critical 分配账户数据（普通、财资）
    	if(responseData && responseData.Reg_GRP && responseData.Reg_GRP.length){
    		for(var i = 0; i < responseData.Reg_GRP.length; i++){
    			var account = {};
    			account.accNo = responseData.Reg_GRP[i].Cst_AccNo;// 账号
    			account.accName = responseData.Reg_GRP[i].Acc_AccNm;// 账户名称
    			account.accIns = responseData.Reg_GRP[i].DpBkInNo;// 开户机构
    			account.accType = responseData.Reg_GRP[i].SgAcc_TpCd;
    			if('4' == account.accType){//@critical  财资账户
    				assetAccs.push(account);
    			}else{// @critical 普通账户
    				account.accType && normalAccs.push(account);
    			}
    		}
    	}
    	
    	var hasAsset = (assetAccs.length > 0) ? true : false;// @critical 是否有财资账户
    	var titles = hasAsset ? ['普通账户', '财资账户'] : ['普通账户'];// 选项卡标题
    	var backgroundColors = hasAsset ? ['rgb(20,147,214)','rgb(20,147,214)'] : 
    		['rgb(20,147,214)'];// 选项卡标题背景色
    	var htmlDomIds = hasAsset ? ['normalAcc', 'assetAcc'] : ['normalAcc'];// html中id元素
    	var columns = [[
			{title : "账号",field : "accNo",align : 'center',width:350},
			{title : "账户类型",field : "accType",align : 'center',width:100,
				formatter : function(value, rowData, rowIndex) {
		            return $this.getAccTypeNameByCode(value);
		        }
			},
			{title : "账户名称",field : "accName",align : 'center',width:300},
			{title : "开户机构",field : "accIns",align : 'center',width:160},
			{title : "操作",field : "deal",align : 'center',width:180,
				formatter : function(value, rowData, rowIndex) {
		            return '<a onclick="CPBBalanceQueryHF.prototype.toCPBBalanceResult(\'' + rowData.accNo
	                		+ '\', \'' + rowData.accType + '\');" style="cursor:pointer;" >'
	                		+ '<img style="vertical-align:middle;height: .35rem" src="/ecpweb/page/stm/common/icon/checkBalance.png"/></a>';
		        }
			}
        ]];
    	
    	
    	var tabFlag = data.tabFlag;
    	console.log('默认选择框：' + tabFlag);
    	data.tabFlag = data.tabFlag || '普通账户';// @critical 记录所选选择框
    	var balAccTab = new PJF.ui.tab({
            dom: 'balAccTab',
            titles: titles,
            backgroundColors: backgroundColors,
            iconUrl: [],
            htmlDomIds: htmlDomIds,
			onSelect:function(index){
			    if(index == 0){// @critical 普通
			    	data.tabFlag = '普通账户';
				}else if(index == 1){// @critical 财资
					data.tabFlag = '财资账户';
				}
            },
            /**
             * @function domLoadedCallBack
             * grid表格数据展示
             * 1.本地分页
             */
            domLoadedCallBack: function(){
            	// 普通账户
            	var normalAccGrid = new PJF.ui.grid({
        			dom:'normalAccGrid',
    				width:'auto',
    				height: 570,
    				isAppendMode: false, // @critical 是否为追加模式 此处应该设置为false
    				title: '默认表格',
    				totalPath: 'total',
    				singleSelect: true,
    				rownumbers: false,
    				isLocalPagination:true,
    	            rowsPath: 'rows',
    				pageSize:10,
    				noDataMsg:'无数据',
        			columns :columns,
        			loadFilter:function (data) {
        	        }
                });
            	/*var rows = [];
        		for(var j=0;j<9;j++){
        			rows.push({
        				'1':"44201547500049412004",
        				'2':"活期",
        				'3':"深圳市XXX有限公司",
        				'4':"442000047"
        			});
        		}
        		normalAccGrid.loadData(rows);*/
            	// 普通账户上一页
        		var cb_prePage_na = new PJF.ui.linkButton({
        			dom : 'cb_prePage_na',
        			style: 'main',
        			name: '上一页',
        			onClick : function() {
        			}
        		});
        		// 普通账户下一页
        		var cb_nextPage_na = new PJF.ui.linkButton({
        			dom : 'cb_nextPage_na',
        			style: 'main',
        			name: '下一页',
        			onClick : function() {
        			}
        		});
        		// @critical 普通账户添加分页条
        		normalAccGrid.addPaginationBar(cb_prePage_na, cb_nextPage_na, "desc_na");
        		normalAccGrid.loadData(normalAccs);
        		
        		if(hasAsset){// 有财资账户
                	var assetAccGrid = new PJF.ui.grid({
                		dom:'assetAccGrid',
                		width:'auto',
        				height: 570,
        				isAppendMode: false, // 是否为追加模式 此处应该设置为false
        				title: '默认表格',
        				totalPath: 'total',
        				singleSelect: true,
        				rownumbers: false,
        				isLocalPagination:true,
        	            rowsPath: 'rows',
        				pageSize:10,
        				noDataMsg:'无数据',
                		columns :columns,
                		loadFilter:function(data){
                		}
                	});
            		
            		/*var rows2 = [];
            		for(var j=0;j<9;j++){
            			rows2.push({
            				'1':"44200047500049412004",
            				'2':"财资",
            				'3':"深圳市XXXXXX有限公司",
            				'4':"442000035"
            			});
            		}*/
            		
            		// 财资账户上一页
            		var cb_prePage_aa = new PJF.ui.linkButton({
            			dom : 'cb_prePage_aa',
            			style: 'main',
            			name: '上一页',
            			onClick : function() {
            			}
            		});
            		// 财资账户下一页
            		var cb_nextPage_aa = new PJF.ui.linkButton({
            			dom : 'cb_nextPage_aa',
            			style: 'main',
            			name: '下一页',
            			onClick : function() {
            			}
            		});
            		
            		// 财资账户添加分页条
            		assetAccGrid.addPaginationBar(cb_prePage_aa, cb_nextPage_aa, "desc_aa");
            		assetAccGrid.loadData(assetAccs);
        		}else{
        			PJF.html.getDom('assetAcc').style.display = 'none';
        		}
        		
            }
            
    	});
    	
    	if(tabFlag){// @critical 查询余额后默认选中最后选择的选择框
    		balAccTab.selectTab(tabFlag);
    	}
    	
    	// 返回按钮
		var returnBtn = new PJF.ui.linkButton({
			dom : 'returnBtn',
			style : 'main',
			name : '返回',
			onClick : function() {
				template.loadPage('subMenuPage','CPB20008');
			}
		});
    },
	/*
    * 跳转到账户余额查询结果页面
    * accNo 账户号码
    * accType 账户类型
    */
	/** @function toCPBBalanceResult
	 *  @param {String}accNo 账户号码
	 *  @param {String}accType  账户类型
	 * 跳转到账户余额查询结果页面
	 * accNo 账户号码
	 * accType 账户类型
	 */
    toCPBBalanceResult : function(accNo, accType){
    	var param = {};
    	param.accNo = accNo;
    	param.accType = accType;
    	console.log('传递参数-->账户：' + accNo + '，类型：' + accType);
    	if(this.accountsInfo){
    		this.accountsInfo.param = param;
    		template.loadPage('CPBBalanceResultHF', this.accountsInfo);
    	}
    },
	destroy : function() {
	}
};