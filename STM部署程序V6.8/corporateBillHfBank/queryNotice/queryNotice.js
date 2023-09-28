/**
 * @file queryNotice
 * @author
 * @version 1.0
 * create 2020-01-25
 * Last Updated 2021-01-29
 * 查询通知
 */
function queryNotice() {

}
var previewData = {};
// 在prototype里渲染各个页面组件
queryNotice.prototype = {
	$this : this,
	init : function(data) {
        $this = this;
		if (!data) {
			data = {};
		}
        $this.initUI(data);
	},
    /**
     * @function initUI
     * @param {Object}data
     * @param {String} data.Txn_CardNo 卡号
     * @param {String} data.type 类型
     */
	initUI:function(data){
		var jsonData = {};
        jsonData.Txn_CardNo =data.Txn_CardNo;
        jsonData.Crd_TpCd = data.type;

		$this.queryNotice_grid = new PJF.ui.grid({
			dom:'queryNotice_grid',
			width:'auto',
			height:580,
			totalPath:'_COMMON.COMB.TOTAL_REC',
			//currentPath:'Cur_Pg_CD',
			//pageNumberParamName:'Cur_Pg_CD',
            pageSize:"10",
			isAppendMode: false,
			rownumbers:true,
			//singleSelect : false,
			rowsPath:'Notice_Grp',
			url: PJF.constants.DEFAULT_ACTION,
			queryParams:{
				'fwServiceId':'simpleTransaction',
				'fwTranId':'A0782T019-stm',
				'jsonData':PJF.util.json2str(jsonData)
			},
			columns :[[
				{title : "通知编号",field : "Msg_ID",align : 'center',width:140},
				{title : "分行号",field : "CCBIns_ID",align : 'center',width:140 },
				{title : "签约编号",field : "Sign_ID",align : 'center' },
				{title : "通知标题",field : "Msg_Ttl",align : 'center'},
                {
                    title : '操作&nbsp;&nbsp;',
                    field : 'opert',
                    width : 100,
                    align : 'right',
                    formatter : function(value, rowData, rowIndex) {
                        return '<a onclick="$this.openWin(\'' + rowData.Msg_Ttl
                            + '\',\'' + rowData.Msg_CntDsc+ '\');" ><img style="vertical-align:middle;height: .35rem" src="/ecpweb/page/stm/common/icon/bill_query_notice.png"/></a>';
                    }
                }
			]]
		});
		
		//上一页
		var cb_prePage = new PJF.ui.linkButton({
			dom : 'cb_prePage',
			style: 'main',
			name: '上一页',
			onClick : function() {}
		});
		//下一页
		var cb_nextPage = new PJF.ui.linkButton({
			dom : 'cb_nextPage',
			style: 'main',
			name: '下一页',
			onClick : function() {}
		});
		
		$this.queryNotice_grid.addPaginationBar(cb_prePage, cb_nextPage, "desc");
        //$this.queryNotice_grid.loadData([{Txn_Dt:"1",Cst_AccNo:"123",Ccy_Nm:"333",TxnAmt:"通知",Msg_Ttl:"区委全文权威权威",Msg_CntDsc:"为偶发为佛为佛威风威风为佛为佛为佛威风威风为佛未访问范文芳未访问而服务而非为佛我而非为服务而非为范文芳我而非为服务而非我而非威风威风威风"}]);
        // 返回按钮
        var returnBtn = new PJF.ui.linkButton({
            dom : 'returnBtn',
            style : 'main',
            name : '返回',
            onClick : function() {
                if(data.prevMenu){
                    var cardData = {};
                    cardData.Txn_CardNo = data.Txn_CardNo;
                    cardData.ptData = data.ptData;
                    cardData.czData = data.czData;
                    cardData.menu = data.menu;
                    template.loadPage(data.prevMenu,cardData);
                    //template.loadPage(data.prevMenu,data);
                } else {
                    template.loadPage('subMenuPage','CPB20008');
                }
            }
        });
	},
    /**
     * @function openWin
     * @param {String} Msg_Ttl  通知标题
     * @param {String} Msg_CntDsc 通知详情
     * 打开一个window窗口
     */
    openWin:function(Msg_Ttl,Msg_CntDsc){
        $this.noticeWin =  new PJF.ui.window({
              dom : 'noticeWin',
             width:"950",
            height:"450",
              href:"/ecpweb/page/stm/corporateBillNew/queryNotice/noticeInfo.html",
              onLoad:function(){
                  PJF.html.content("Msg_Ttl",Msg_Ttl);
                  PJF.html.content("Msg_CntDsc",Msg_CntDsc);
                  new PJF.ui.linkButton({
                      dom : 'closeWin',
                      style : 'main',
                      appendStyle : 'confirm',
                      name : '关闭',
                      onClick : function() {
                          $this.noticeWin.destroy();
                      }
                  });
              }
          });
    },
	destroy : function() {
	}
}