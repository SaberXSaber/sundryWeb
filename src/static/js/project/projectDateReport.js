/**
 * Created by Administrator on 2016/7/12.
 */
config.menukey = 'BaseJs';

var BaseJs = {};

(function(){

    var ProjectView = function(){
        var mmg=null;
        var cols =  [
            {
                title: '工作号',
                name: 'workCode',
                sortable:true,
                width: 90,
            },
            {
                title: '项目名称',
                name: 'projectName',
                width: 100,
                tips:true,
            },
            {
                title: '数据日期',
                name: 'currentDate',
                width: 60
            },

            {
                title: 'PV',
                name: 'pv',
                width: 60
            },
            {
                title: 'UV',
                name: 'uv',
                width: 60
            },

            {
                title: 'IP',
                name: 'ip',
                width: 60
            },
            {
                title: 'CPA',
                name: 'cpa',
                width: 60
            },

            {
                title: 'CPC',
                name: 'cpc',
                width: 60
            },
            {
                title: 'CPL',
                name: 'cpl',
                width: 60
            },
            {
                title: '订单数',
                name: 'orderCount',
                width: 60
            },
            {
                title: '销售额',
                name: 'saleMoney',
                width: 60
            },
            {
                title: '单价',
                name: 'prices',
                width: 60
            },
            {
                title: '收入',
                name: 'income',
                width: 60
            },
            {
                title: '统计佣金',
                name: 'totalCommission',
                width: 60
            },
            {
                title: '出库率',
                name: 'ckl',
                width: 60
            },
            {
                title: '预估佣金',
                name: 'estimateCommission',
                width: 60
            },

            {
                title: '录入人',
                name: 'createOperator',
                width: 60
            },
        ];
        var index_model = new Vue({
            el : '#pageinit',
            data : {
                page : 1,
                limit : 25,
                sortDirection:'',
                sortExpression:'',
                projectName: "",
                workCode: "",
                createOperator:"",
                beginDate:"",
                createOperatorArr: [],
                OfflineTime:""
            },
            methods : {
                //获取初始信息，并绑定列表单个编辑函数
                getData : function(){
                    var data = {
                        page : this.page,
                        limit : this.limit,
                        sortDirection:this.sortDirection,
                        sortExpression:this.sortExpression,
                        projectName: this.projectName,
                        workCode: this.workCode,
                        beginDate:this.beginDate,
                        endDate:this.endDate,
                        createOperator:this.createOperator,
                    }
                    mmg.load(data);
                },
                exportData: function () {
                    window.open(config.path
                        + 'projectDateReport/export?limit=1000000&'
                        + 'projectName=' + (this.projectName ? this.projectName : "")
                        + "&workCode=" + (this.workCode ? this.workCode : "")
                        + "&createOperator=" + (this.createOperator ? this.createOperator : "")
                        + "&beginDate=" + (this.beginDate ? this.beginDate : "")
                        + "&endDate=" + (this.endDate ? this.endDate : ""));
                },
                serachInfo:function (){
                    this.page=1;
                    this.getData()
                },
                reset:function (){
                    this.page = 1;
                    this.limit = 25;
                    this.sortDirection = "";
                    this.sortExpression = "";
                    this.projectName = "";
                    this.workCode = "";
                    this.beginDate= "";
                    this.endDate= "";
                    this.createOperator= "";
                    index_model.$nextTick(function() {
                        $('#createOperator').trigger('chosen:updated');//更新选项
                    })
                    this.getData()
                },

            },
            created:function (){
                var firstDay =  moment().startOf('month').format('YYYY-MM-DD');
                var lastDay = moment().endOf('month').format('YYYY-MM-DD');
                this.beginDate = firstDay;
                this.endDate = lastDay;
                this.OfflineTime = firstDay+' 至 '+lastDay;
                new pickerDateRange('OfflineTime', {
                    defaultText: ' 至 ',
                    isSingleDay: false,
                    stopToday: false,
                    calendars: 2,
                    shortbtn:true,//是否显示快捷操作
                    startDate:firstDay, //默认开始时间
                    endDate: lastDay,	//默认结束时间
                    inputTrigger: 'dateRange',
                    success: function(obj) { //选择日期后的回调函数
                        index_model.beginDate = obj.startDate;
                        index_model.endDate = obj.endDate;
                        index_model.getData()
                    }
                })


                utool.ajax.ajaxRequest("POST", config.path + "operator/list", {page : 1, limit : 1000}, "json").done(function (returnData) {
                    returnData = JSON.parse(returnData);
                    if (returnData.code == 200) {
                        index_model.createOperatorArr = returnData.data;
                        index_model.$nextTick(function () {
                            $('#createOperator').chosen().change(function (tar, val) {
                                index_model.createOperator = val.selected;
                            });
                        })
                    }

                })
            }
        });

        mmg = $('.mmg').mmGrid({
            height: "auto",
            cols: cols,
            sortStatus: 'asc',
            multiSelect: true,
            checkCol: false,
            fullWidthRows: true,
            autoLoad: false,
            showBackboard: true,
            method: 'post',
            root: 'data',
            url:config.path+"projectDateReport/list",
            params: {
                page : 1,
                limit : 25,
                sortDirection:'',
                sortExpression:''
            },
            plugins: [
                $('#pg').mmPaginator()
            ],
            limitChange:function(limit){
                index_model.limit = limit;
                index_model.page = 1;
                index_model.getData();
            },
            pageChange:function(page){
                index_model.page=page;
                index_model.getData();
            },
            sortChange:function(sort){
                index_model.sortDirection=sort.sortStatus;
                index_model.sortExpression=sort.sortName;
                index_model.getData();
            }
        })

        mmg.on('cellSelected', function(e, item, rowIndex, colIndex){
            var ele = $(e.target);
        })
        mmg.on('loadSuccess', function(e, item){
            var data = {
                projectName: index_model.projectName,
                workCode: index_model.workCode,
                createOperator: index_model.createOperator,
                beginDate:index_model.beginDate,
                endDate:index_model.endDate,
            }
            utool.ajax.ajaxRequest("POST", config.path + "projectDateReport/sum",data, "json").done(function (returnData) {
                returnData = JSON.parse(returnData);
                if (returnData.code == 200) {
                    var itemData = {
                        workCode : '汇总',
                        projectName: '-',
                        currentDate: '-',
                        linkNo: '-',
                        pv: returnData.data.pvSum,
                        uv: returnData.data.uvSum,
                        ip: returnData.data.ipSum,
                        cpa: returnData.data.cpaSum,
                        cpc: returnData.data.cpcSum,
                        cpl: returnData.data.cplSum,
                        orderCount: returnData.data.orderCountSum,
                        prices: '-',
                        income: returnData.data.incomeSum,
                        ckl: returnData.data.cklSum,
                        createOperator: '-',
                        createTime: '-',
                        saleMoney: returnData.data.saleMoneySum,
                        totalCommission: returnData.data.totalCommissionSum,
                        estimateCommission: returnData.data.estimateCommissionSum,
                    }
                    mmg.addRow(itemData, 0);
                } else {
                    layer.alert('获取数据错误，错误原因' + returnData.msg, {title: '错误', icon: 2});
                }
            })
        })
        index_model.getData();
    };

    BaseJs.ProjectView=ProjectView;

})()