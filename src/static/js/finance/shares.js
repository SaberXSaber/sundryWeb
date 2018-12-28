/**
 * Created by Administrator on 2016/7/12.
 */
config.menukey = 'BaseJs';

var BaseJs = {};

(function(){


    var sharesView = function(){
        var mmg=null;

        var cols =  [
            {
                title: '操作',
                name: 'operation',
                lockWidth:true,
                sortable: false,
                width: 60,
                renderer:function (val,item) {
                    var html ="";
                    if(val=="" ||val== null){
                        if(item.isLock==1){
                            html += "<a title='解锁' class='render_a' ><span class='glyphicon glyphicon-lock' aria-hidden='true' name='lock'></span></a>"
                        }else{
                            html += "<a title='编辑' class='render_a' ><span class='glyphicon glyphicon-edit' aria-hidden='true' name='edit'></span></a>"
                            html += "<a title='锁定' class='render_a' ><span class='glyphicon glyphicon-lock' aria-hidden='true' name='lock'></span></a>"
                            html += "<a title='删除' class='render_a' > <span name='delete' class='glyphicon glyphicon-remove' aria-hidden='true'></span></a>"
                        }

                    }else{
                        html ="<span>"+val+"</span>";
                    }
                    return html;
                },

            },

            {
                title: 'Id',
                name: 'id',
                sortable:true,
                width: 40,

            },
            {
                title: '股票代码',
                name: 'sharesCode',
                sortable:true,
                width: 90,
            },
            {
                title: '股票名称',
                name: 'sharesName',
                width: 100,
                tips:true,
            },
            {
                title: '最新价',
                name: 'latestPrice',
                width: 60
            },
            {
                title: '涨跌幅',
                name: 'rose',
                width: 60
            },


            {
                title: '占净值',
                name: 'netWorth',
                width: 40
            },
            {
                title: '持仓占比(%)',
                name: 'ratio',
                width: 40
            },


            {
                title: '持股数(万股)',
                name: 'holdingShares',
                width: 40
            },
            {
                title: '持仓市值',
                name: 'marketValue',
                width: 40
            },
            {
                title: '基金来源',
                name: 'fundId',
                width: 50
            },
            {
                title: '获取时间',
                name: 'createTime',
                width: 60,
                renderer: function (val) {
                    if(val&&val!=""){
                        return utool.myOnlyDate.date(val, "yyyy-MM-dd");
                    }else{
                        return "-"
                    }

                }
            },

        ];

       /* cols.splice(0,0,{
            title: '操作',
            name: '',
            lockWidth:true,
            sortable: false,
            width: 60,
            renderer:function (val,item) {
                var html ="";
                if(item.isLock==1){
                    html += "<a title='解锁' class='render_a' ><span class='glyphicon glyphicon-lock' aria-hidden='true' name='lock'></span></a>"

                }else{
                    html += "<a title='编辑' class='render_a' ><span class='glyphicon glyphicon-edit' aria-hidden='true' name='edit'></span></a>"
                    html += "<a title='锁定' class='render_a' ><span class='glyphicon glyphicon-lock' aria-hidden='true' name='lock'></span></a>"
                    html += "<a title='删除' class='render_a' > <span name='delete' class='glyphicon glyphicon-remove' aria-hidden='true'></span></a>"
                }
                return html;
            },
        })*/

        var index_model = new Vue({
            el : '#pageinit',
            data : {
                //Rights:resultData.Rights,
                pageBean:{
                    page : 1,
                    limit : 25,
                    sortDirection:'',
                    sortExpression:'',
                },
                sharesName: "",
                sharesCode: "",
                beginDate: "",
                endDate: "",
            },
            methods : {
                updateBatch:function (id){
                    items = mmg.selectedRows()
                    var projectIds = new Array
                    if (items.length < 1) {
                        layer.alert('请选择指定行');
                        return
                    }
                    items.forEach(function (el) {
                        projectIds.push(el.projectId)
                    });
                    layer.open({
                        type: 2,
                        title: "批量修改",
                        shade: [0.1, '#FFF'],
                        area: ["760px", "650px"],
                        content: './projectadd.html?projectIds=' + projectIds,
                        end: function () {
                            //index_model.getData()
                        }
                    });
                },
                lockBatch:function (){
                    items = mmg.selectedRows()
                    var projectIds = new Array
                    if (items.length < 1) {
                        layer.alert('请选择指定行');
                        return
                    }
                    items.forEach(function (el) {
                        projectIds.push(el.projectId)
                    });
                    var reqPara = {
                        isLock:1,
                        listIds: projectIds,
                    }
                    utool.ajax.ajaxRequest("POST", config.path + "project/update", reqPara, "json").done(function (returnData) {
                        returnData = JSON.parse(returnData);
                        if (returnData.code == 200) {
                            index_model.getData();
                            layer.alert("锁定成功", function (index) {
                                layer.close(index);
                            })
                        } else {
                            layer.alert('获取数据错误，错误原因:' + returnData.msg, {title: '错误', icon: 2});
                        }
                    })
                },
                deleteBatch:function (){
                    items = mmg.selectedRows()
                    var projectIds = new Array
                    if (items.length < 1) {
                        layer.alert('请选择指定行');
                        return
                    }
                    items.forEach(function (el) {
                        projectIds.push(el.projectId)
                    });
                    var reqPara = {
                        listIds: projectIds,
                    }
                    utool.ajax.ajaxRequest("POST", config.path + "project/delete", reqPara, "json").done(function (returnData) {
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
                },
                exportBatch:function (){
                    items = mmg.selectedRows()
                    var projectIds = new Array
                    if (items.length < 1) {
                        layer.alert('请选择指定行');
                        return
                    }
                    items.forEach(function (el) {
                        projectIds.push(el.projectId)
                    });
                    window.open(config.path
                        + 'project/export?limit=1000000&'
                        + 'projectName=' + (this.projectName ? this.projectName : "")
                        + "&workCode=" + (this.workCode ? this.workCode : "")
                        + "&typeParent=" + (this.typeParent ? this.typeParent : "")
                        + "&typeChild=" + (this.typeChild ? this.typeChild : "")
                        + "&projectState=" + (this.projectState ? this.projectState : "")
                        + "&isLock=" + (this.isLock ? this.isLock : "")
                        + "&executeOperator=" + (this.executeOperator ? this.executeOperator : "")
                        + "&businessOperator=" + (this.businessOperator ? this.businessOperator : "")
                        + "&customerOperator=" + (this.customerOperator ? this.customerOperator : "")
                        + "&listIds=" + (projectIds ? projectIds : "")
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
                        sharesCode: this.sharesCode,
                        sharesName: this.sharesName,

                    }
                    mmg.load(data);
                },
                exportData: function () {
                    window.open(config.path
                        + 'project/export?limit=1000000&'
                        + 'sharesName=' + (this.sharesName ? this.sharesName : "")
                        + 'sharesCode=' + (this.sharesCode ? this.sharesCode : "")
                        + "&beginDate=" + (this.beginDate ? this.beginDate : "")
                        + "&endDate=" + (this.endDate ? this.endDate : ""));
                },
                addInfo:function () {
                    var _this=this;
                    layer.open({
                        type: 2,
                        title: "添加",
                        shade: 0.8,
                        area: ["760px", "650px"],
                        content: './projectadd.html',
                        end:function (){
                        }
                    });
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

                    this.sharesName = "";
                    this.sharesCode = "";
                    this.beginDate= "";
                    this.endDate= "";

                    //初始化部门
                    index_model.$nextTick(function() {
                        $('#typeParent').trigger('chosen:updated');//更新选项
                        $('#typeChild').trigger('chosen:updated');//更新选项
                        $('#projectState').trigger('chosen:updated');//更新选项
                        $('#isLock').trigger('chosen:updated');//更新选项
                        $('#executeOperator').trigger('chosen:updated');//更新选项
                        $('#businessOperator').trigger('chosen:updated');//更新选项
                        $('#customerOperator').trigger('chosen:updated');//更新选项
                    })
                    this.getData()
                },

            },
            created:function (){

                new pickerDateRange('OfflineTime', {
                    defaultText: ' 至 ',
                    isSingleDay: false,
                    stopToday: false,
                    calendars: 2,
                    shortbtn:true,//是否显示快捷操作
                    startDate:"", //默认开始时间
                    endDate: "",	//默认结束时间
                    inputTrigger: 'dateRange',
                    success: function(obj) { //选择日期后的回调函数
                        index_model.beginDate = obj.startDate;
                        index_model.endDate = obj.endDate;
                        index_model.getData()
                    }
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
            url:config.path+"shares/list",
            params: {
                pageBean:{
                    page : 1,
                    limit : 25,
                    sortDirection:'',
                    sortExpression:'',
                },
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

        index_model.getData();
    };

    BaseJs.sharesView=sharesView;


})()