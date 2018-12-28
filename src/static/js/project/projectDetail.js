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
                title: '操作',
                name: 'operation',
                lockWidth:true,
                sortable: false,
                width: 60,
                renderer:function (val) {
                    var html =""
                    if(val=="" ||val== null){
                        html += "<a title='编辑' class='render_a' ><span class='glyphicon glyphicon-edit' aria-hidden='true' name='edit'></span></a>"
                        html += "<a title='删除' class='render_a' > <span name='delete' class='glyphicon glyphicon-remove' aria-hidden='true'></span></a>"
                    }else{
                        html ="<span>"+val+"</span>";
                    }
                    return html;

                },
            },

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
                title: '链接ID',
                name: 'linkNo',
                width: 80
            },
            {
                title: 'PV',
                name: 'pv',
                width: 50
            },
            {
                title: 'UV',
                name: 'uv',
                width: 50
            },


            {
                title: 'IP',
                name: 'ip',
                width: 50
            },
            {
                title: 'CPA',
                name: 'cpa',
                width: 50
            },
            {
                title: 'CPC',
                name: 'cpc',
                width: 50
            },
            {
                title: 'CPL',
                name: 'cpl',
                width: 50
            },
            {
                title: '订单数',
                name: 'orderCount',
                width: 50
            },
            {
                title: '销售额',
                name: 'saleMoney',
                width: 60,
            },
            {
                title: '单价',
                name: 'prices',
                width: 50
            },
            {
                title: '收入',
                name: 'income',
                width: 50
            },
            {
                title: '统计佣金',
                name: 'totalCommission',
                width: 50
            },

            {
                title: '出库率',
                name: 'ckl',
                width: 50,
                renderer: function (val) {
                    if(val&&val!=""){
                        return (val*100).toString() +'%';
                    }else{
                        return '-';
                    }
                }
            },
            {
                title: '预估佣金',
                name: 'estimateCommission',
                width: 50
            },

            /*{
                title: '锁定',
                name: 'isLock',
                width: 60,
                renderer: function (val) {
                    return val==0?'正常':'锁定';
                }
            },*/
            {
                title: '录入人',
                name: 'createOperator',
                width: 50
            },
            {
                title: '录入时间',
                name: 'createTime',
                width: 70,
                renderer: function (val) {
                    return utool.myOnlyDate.date(val, "yyyy-MM-dd");
                }
            },


        ];

       /* cols.splice(0,0,{
            title: '操作',
            name: 'cz',
            lockWidth:true,
            sortable: false,
            width: 60,
            renderer:function () {
                var html ="";
                html += "<a title='编辑' class='render_a' ><span class='glyphicon glyphicon-edit' aria-hidden='true' name='edit'></span></a>"
                html += "<a title='删除' class='render_a' > <span name='delete' class='glyphicon glyphicon-remove' aria-hidden='true'></span></a>"
                return html;
            },
        })*/



        var index_model = new Vue({
            el : '#pageinit',
            data : {
                //Rights:resultData.Rights,
                page : 1,
                limit : 25,
                sortDirection:'',
                sortExpression:'',

                projectName: "",
                workCode: "",
                linkNo:"",
                typeParent: "",
                typeChild: "",
                projectState: "",
                isLock: "",
                executeOperator: "",
                businessOperator: "",
                customerOperator: "",
                createOperator:"",
                beginDate:"",
                endDate:"",
                startTime:"",
                endTime:"",
                offlineTime:"",
                executeOperatorArr: [],
                businessOperatorArr: [],
                customerOperatorArr: [],
                typeParentArr: [],
                typeChildArr: [],
                createOperatorArr: [],
            },
            methods : {
                deleteBatch:function (){
                    items = mmg.selectedRows()
                    var itemIds = new Array
                    if (items.length < 1) {
                        layer.alert('请选择指定行');
                        return
                    }
                    items.forEach(function (el) {
                        itemIds.push(el.itemId)
                    });
                    var reqPara = {
                        listIds: itemIds,
                    }
                    layer.confirm("确认删除此条信息?", {title: "提示"}, function () {
                        utool.ajax.ajaxRequest("POST", config.path + "projectDetail/delete", reqPara, "json").done(function (returnData) {
                            returnData = JSON.parse(returnData);
                            if (returnData.code == 200) {
                                index_model.getData();
                                layer.alert("删除成功", function (index) {
                                    layer.close(index);
                                })
                            } else {
                                layer.alert('获取数据错误，错误原因:' + returnData.msg, {title: '错误', icon: 2});
                            }
                        })
                    })

                },
                exportBatch:function (){
                    items = mmg.selectedRows()
                    var itemIds = new Array
                    if (items.length < 1) {
                        layer.alert('请选择指定行');
                        return
                    }
                    items.forEach(function (el) {
                        itemIds.push(el.itemId)
                    });
                    window.open(config.path
                        + 'projectDetail/export?limit=1000000&'
                        + 'projectName=' + (this.projectName ? this.projectName : "")
                        + '&linkNo=' + (this.linkNo ? this.linkNo : "")
                        + "&workCode=" + (this.workCode ? this.workCode : "")
                        + "&typeParent=" + (this.typeParent ? this.typeParent : "")
                        + "&typeChild=" + (this.typeChild ? this.typeChild : "")
                        + "&projectState=" + (this.projectState ? this.projectState : "")
                        + "&isLock=" + (this.isLock ? this.isLock : "")
                        + "&executeOperator=" + (this.executeOperator ? this.executeOperator : "")
                        + "&businessOperator=" + (this.businessOperator ? this.businessOperator : "")
                        + "&customerOperator=" + (this.customerOperator ? this.customerOperator : "")
                        + "&createOperator=" + (this.createOperator ? this.createOperator : "")
                        + "&listIds=" + (itemIds ? itemIds : "")
                        + "&startTime=" + (this.startTime ? this.startTime : "")
                        + "&endTime=" + (this.endTime ? this.endTime : "")
                        + "&beginDate=" + (this.beginDate ? this.beginDate : "")
                        + "&endDate=" + (this.endDate ? this.endDate : ""));
                },
                //获取初始信息，并绑定列表单个编辑函数
                getData : function(){
                    var data = {
                        page : this.page,
                        limit : this.limit,
                        sortDirection:this.sortDirection,
                        sortExpression:this.sortExpression,
                        linkNo: this.linkNo,
                        projectName: this.projectName,
                        workCode: this.workCode,
                        typeParent: this.typeParent,
                        typeChild: this.typeChild,
                        projectState: this.projectState,
                        isLock: this.isLock,
                        executeOperator: this.executeOperator,
                        businessOperator: this.businessOperator,
                        customerOperator: this.customerOperator,
                        beginDate:this.beginDate,
                        endDate:this.endDate,
                        createOperator:this.createOperator,
                        startTime:this.startTime,
                        endTime:this.endTime,
                    }
                    mmg.load(data);
                },
                exportData: function () {
                    window.open(config.path
                        + 'projectDetail/export?limit=1000000&'
                        + 'projectName=' + (this.projectName ? this.projectName : "")
                        + '&linkNo=' + (this.linkNo ? this.linkNo : "")
                        + "&workCode=" + (this.workCode ? this.workCode : "")
                        + "&typeParent=" + (this.typeParent ? this.typeParent : "")
                        + "&typeChild=" + (this.typeChild ? this.typeChild : "")
                        + "&projectState=" + (this.projectState ? this.projectState : "")
                        + "&isLock=" + (this.isLock ? this.isLock : "")
                        + "&executeOperator=" + (this.executeOperator ? this.executeOperator : "")
                        + "&businessOperator=" + (this.businessOperator ? this.businessOperator : "")
                        + "&customerOperator=" + (this.customerOperator ? this.customerOperator : "")
                        + "&createOperator=" + (this.createOperator ? this.createOperator : "")
                        + "&startTime=" + (this.startTime ? this.startTime : "")
                        + "&endTime=" + (this.endTime ? this.endTime : "")
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
                    this.linkNo= "";
                    this.projectName = "";
                    this.workCode = "";
                    this.typeParent = "";
                    this.typeChild = "";
                    this.projectState = "";
                    this.isLock = "";
                    this.executeOperator = "";
                    this.businessOperator = "";
                    this.customerOperator = "";
                    this.beginDate= "";
                    this.endDate= "";
                    this.createOperator= "";
                    this.startTime= "";
                    this.endTime= "";

                    //初始化部门
                    index_model.$nextTick(function() {
                        $('#typeParent').trigger('chosen:updated');//更新选项
                        $('#typeChild').trigger('chosen:updated');//更新选项
                        $('#projectState').trigger('chosen:updated');//更新选项
                        $('#isLock').trigger('chosen:updated');//更新选项
                        $('#executeOperator').trigger('chosen:updated');//更新选项
                        $('#businessOperator').trigger('chosen:updated');//更新选项
                        $('#customerOperator').trigger('chosen:updated');//更新选项
                        $('#createOperator').trigger('chosen:updated');//更新选项
                    })
                    this.getData()
                },
                chose: function (parentName) {
                    utool.ajax.ajaxRequest("POST", config.path + "project/selectType?parentName=" + parentName, {}, "json").done(function (returnedData) {
                        returnedData = JSON.parse(returnedData);
                        index_model.typeChildArr = returnedData.data;
                        index_model.$nextTick(function () {
                            $('#typeChild').trigger('chosen:updated');//更新选项
                            $('#typeChild').chosen().change(function (tar, val) {
                                index_model.typeChild = val.selected;
                                $('#typeChild').trigger('chosen:updated');//更新选项
                            });
                        })
                    })
                },
                format:function(fmt,date)  {
                    var o = {
                        "M+" : date.getMonth()+1,                 //月份
                        "d+" : date.getDate(),                    //日
                        "h+" : date.getHours(),                   //小时
                        "m+" : date.getMinutes(),                 //分
                        "s+" : date.getSeconds(),                 //秒
                        "q+" : Math.floor((date.getMonth()+3)/3), //季度
                        "S"  : date.getMilliseconds()             //毫秒
                    };
                    if(/(y+)/.test(fmt))
                        fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
                    for(var k in o)
                        if(new RegExp("("+ k +")").test(fmt))
                            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
                    return fmt;
                }
            },
            created:function (){
                //var date = new Date(), y = date.getFullYear(), m = date.getMonth();
                //var firstDay = this.format("yyyy-MM-dd",new Date(y, m, 1));
                //var lastDay = this.format("yyyy-MM-dd",new Date(y, m + 1, 0));
                var firstDay =  moment().startOf('month').format('YYYY-MM-DD');
                var lastDay = moment().endOf('month').format('YYYY-MM-DD');
                this.beginDate = firstDay;
                this.endDate = lastDay;
                this.offlineTime = firstDay+' 至 '+lastDay;
                new pickerDateRange('offlineTime', {
                    autoApply: true,
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
                    },
                })
                new pickerDateRange('time', {
                    defaultText: ' 至 ',
                    isSingleDay: false,
                    stopToday: false,
                    calendars: 2,
                    shortbtn:true,//是否显示快捷操作
                    startDate:'', //默认开始时间
                    endDate: '',	//默认结束时间
                    inputTrigger: 'dateRange',
                    success: function(obj) { //选择日期后的回调函数
                        index_model.startTime = obj.startDate;
                        index_model.endTime = obj.endDate;
                        index_model.getData()
                    }
                })

                /*laydate.render({
                    elem: '#offlineTime', //需显示日期的元素选择器
                    event: 'click', //触发事件
                    format: 'yyyy-MM-dd', //日期格式
                    value: firstDay+' 至 '+lastDay,
                    range:'至',
                    isclear: true, //是否显示清空
                    issure: true, //是否显示确认
                    //festival: true, //是否显示节日
                    min: '1900-01-01 00:00:00', //最小日期
                    max: '2099-12-31 23:59:59', //最大日期
                    fixed: false, //是否固定在可视区域
                    zIndex: 99999999, //css z-index
                    done: function(value, date, endDate){//选择好日期的回调
                        index_model.beginDate = date.year+"-"+date.month+"-"+date.date;
                        index_model.endDate = endDate.year+"-"+endDate.month+"-"+endDate.date;
                        index_model.getData()
                    }
                });


                laydate.render({
                    elem: '#time', //需显示日期的元素选择器
                    event: 'click', //触发事件
                    format: 'yyyy-MM-dd', //日期格式
                    value: firstDay+" "+"~"+" "+lastDay,
                    range:"~",
                    isclear: true, //是否显示清空
                    issure: true, //是否显示确认
                    //festival: true, //是否显示节日
                    min: '1900-01-01 00:00:00', //最小日期
                    max: '2099-12-31 23:59:59', //最大日期
                    fixed: false, //是否固定在可视区域
                    zIndex: 99999999, //css z-index
                    done: function(value, date, endDate){//选择好日期的回调
                        console.log(date.year+"-"+date.month+"-"+date.date)
                        index_model.startTime = date.year+"-"+date.month+"-"+date.date;
                        index_model.endTime = endDate.year+"-"+endDate.month+"-"+endDate.date;

                    }
                 });*/

                utool.ajax.ajaxRequest("POST", config.path + "operator/list", {page : 1, limit : 1000}, "json").done(function (returnData) {
                    returnData = JSON.parse(returnData);
                    if (returnData.code == 200) {
                        index_model.executeOperatorArr = returnData.data;
                        index_model.businessOperatorArr = returnData.data;
                        index_model.customerOperatorArr = returnData.data;
                        index_model.createOperatorArr = returnData.data;
                        index_model.$nextTick(function () {
                            $('#executeOperator').chosen().change(function (tar, val) {
                                index_model.executeOperator = val.selected;
                            });
                            $('#businessOperator').chosen().change(function (tar, val) {
                                index_model.businessOperator = val.selected;
                            });
                            $('#customerOperator').chosen().change(function (tar, val) {
                                index_model.customerOperator = val.selected;
                            });
                            $('#createOperator').chosen().change(function (tar, val) {
                                index_model.createOperator = val.selected;
                            });
                        })
                    }

                })



                utool.ajax.ajaxRequest("POST", config.path + "project/selectType?parentName=" , {}, "json").done(function (returnData) {
                    returnData = JSON.parse(returnData);
                    if (returnData.code == 200) {
                        index_model.typeParentArr = returnData.data;
                        index_model.$nextTick(function () {
                            $('#typeParent').chosen().change(function (tar, val) {
                                index_model.typeParent = val.selected;
                                index_model.chose(val.selected);
                            });
                        })
                    }
                    index_model.chose(-1);

                })
            }
        });

        mmg = $('.mmg').mmGrid({
            height: "auto",
            cols: cols,
            sortStatus: 'asc',
            checkCol: true,
            multiSelect: true,
            fullWidthRows: true,
            autoLoad: false,
            showBackboard: true,
            method: 'post',
            root: 'data',
            url:config.path+"projectDetail/list",
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
            },
        })

        mmg.on('cellSelected', function(e, item, rowIndex, colIndex){
            var ele = $(e.target);
            if(ele.is('span[name="edit"]')){
                layer.open({
                    type: 2,
                    title: "修改",
                    shade: 0.8,
                    area: ["760px", "600px"],
                    content: './projectDetailEdit.html?itemId='+item.itemId,
                    end:function (){
                        index_model.getData()
                    }
                });
            }else if (ele.is('span[name="delete"]')) {
                layer.confirm("确认删除此条信息?", {title: "提示"}, function () {

                    utool.ajax.ajaxRequest("POST", config.path + "projectDetail/delete",{itemId:item.itemId}, "json").done(function (returnData) {
                        returnData = JSON.parse(returnData);
                        if (returnData.code == 200) {
                            index_model.getData();
                            layer.alert("删除成功", function (index) {
                                layer.close(index);
                            })
                        } else {
                            layer.alert('获取数据错误，错误原因' + returnData.msg, {title: '错误', icon: 2});
                        }

                    })
                })
                e.stopPropagation()
            }
        })

        mmg.on('loadSuccess', function(e, item){
            var data = {
                linkNo: index_model.linkNo,
                projectName: index_model.projectName,
                workCode: index_model.workCode,
                typeParent: index_model.typeParent,
                typeChild: index_model.typeChild,
                projectState: index_model.projectState,
                isLock: index_model.isLock,
                executeOperator: index_model.executeOperator,
                businessOperator: index_model.businessOperator,
                customerOperator: index_model.customerOperator,
                beginDate:index_model.beginDate,
                endDate:index_model.endDate,
                createOperator:index_model.createOperator,
                startTime:index_model.startTime,
                endTime:index_model.endTime,
            }
            utool.ajax.ajaxRequest("POST", config.path + "projectDetail/sum",data, "json").done(function (returnData) {
                returnData = JSON.parse(returnData);
                if (returnData.code == 200) {
                    var itemData = {
                        operation : '汇总',
                        workCode : '-',
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
                        ckl: '',
                        createOperator: '-',
                        createTime: '',
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

    //添加/修改用户
    var ProjectViewAdd=function (){

        var itemId= utool.search.getSearch("itemId");
        var add_model = new Vue({
            el : '#pageinit',
            data : {
                itemId:itemId,
                projectName:'',
                workCode:'',
                currentDate:'',
                linkNo:'',
                pv:0,
                uv:0,
                ip:0,
                cpa:0,
                cpc:0,
                cpl:0,
                orderCount:0,
                saleMoney:0,
                prices:0,
                income:0,
                totalCommission:0,
                ckl:0,
                estimateCommission:0,
                createOperator:'',
                createTime:'',

            },
            methods : {

                noRed:function (id){
                    $("#" + id) .removeClass("err-input");
                },
                getId:function (name){
                    add_model[name] = $("#"+name).attr("data-id") || "";
                },
                submit:function (){
                    /*if(this.linkNo == ""){
                        $("#linkNo").addClass("err-input");
                        return
                    }*/
                    if(this.pv < 0){
                        $("#pv").addClass("err-input");
                        return
                    }
                    if(this.pv < 0){
                        $("#uv").addClass("err-input");
                        return
                    }
                    if(this.pv < 0){
                        $("#ip").addClass("err-input");
                        return
                    }

                    if(this.pv < 0){
                        $("#cpa").addClass("err-input");
                        return
                    }
                    if(this.cpc < 0){
                        $("#cpc").addClass("err-input");
                        return
                    }
                    if(this.cpl < 0){
                        $("#cpl").addClass("err-input");
                        return
                    }
                    if(this.orderCount < 0){
                        $("#orderCount").addClass("err-input");
                        return
                    }

                    if(this.saleMoney < 0){
                        $("#saleMoney").addClass("err-input");
                        return
                    }if(this.prices< 0){
                        $("#prices").addClass("err-input");
                        return
                    }if(this.income < 0){
                        $("#income").addClass("err-input");
                        return
                    }if(this.totalCommission < 0){
                        $("#totalCommission").addClass("err-input");
                        return
                    }if(this.ckl < 0){
                        $("#ckl").addClass("err-input");
                        return
                    }
                    if(this.estimateCommission < 0){
                        $("#estimateCommission").addClass("err-input");
                        return
                    }

                    var postData = {
                        itemId:itemId,
                        linkNo:this.linkNo,
                        pv:this.pv,
                        uv:this.uv,
                        ip:this.ip,
                        cpa:this.cpa,
                        cpc:this.cpc,
                        cpl:this.cpl,
                        orderCount:this.orderCount,
                        saleMoney:this.saleMoney,
                        prices:this.prices,
                        income:this.income,
                        totalCommission:this.totalCommission,
                        ckl:this.ckl,
                        estimateCommission:this.estimateCommission,
                    }
                    var url = config.path + "projectDetail/update";
                    var str = "修改项目成功";

                    layer.load(0, {shade: false});
                    utool.ajax.ajaxRequest("POST",url,postData,"json").done(function (returnData){
                        returnData = JSON.parse(returnData);
                        layer.closeAll()
                        if(returnData.code==200){
                            layer.alert(str,function (){
                                parent.layer.closeAll();
                            })
                            parent.location.reload();
                        }else{
                            layer.alert('获取数据错误，错误原因'+ returnData.msg,{title : '错误',icon : 2});
                        }
                    })
                },
                cancel:function(){
                    parent.layer.closeAll();
                }
            },
            created:function (){

                if(itemId && itemId>0){
                    utool.ajax.ajaxRequest("POST", config.path + "projectDetail/get?itemId="+itemId, {}, "json").done(function (returnData) {
                        returnData = JSON.parse(returnData);
                        if (returnData.code == 200) {
                            add_model.projectName=returnData.data.projectName;
                            add_model.workCode=returnData.data.workCode;
                            add_model.currentDate=returnData.data.currentDate;
                            add_model.linkNo=returnData.data.linkNo;
                            add_model.pv=returnData.data.pv;
                            add_model.uv=returnData.data.uv;
                            add_model.ip=returnData.data.ip;
                            add_model.cpa=returnData.data.cpa;
                            add_model.cpc=returnData.data.cpc;
                            add_model.cpl=returnData.data.cpl;
                            add_model.orderCount=returnData.data.orderCount;
                            add_model.saleMoney=returnData.data.saleMoney;
                            add_model.prices=returnData.data.prices;
                            add_model.income=returnData.data.income;
                            add_model.totalCommission=returnData.data.totalCommission;
                            add_model.ckl=returnData.data.ckl;
                            add_model.estimateCommission=returnData.data.estimateCommission;
                            add_model.createOperator=returnData.data.createOperator;
                            add_model.createTime=returnData.data.createTime;
                        }
                    })

                }
            }
        });
    };
    BaseJs.ProjectView=ProjectView;
    BaseJs.ProjectViewAdd=ProjectViewAdd;




})()