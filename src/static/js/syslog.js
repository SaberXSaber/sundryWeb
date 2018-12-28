
config.menukey = 'BaseJs';

var BaseJs = {};

(function(){
//日志管理
var SysLogMannger = function(){

    var mmg=null;

    var cols =  [
        {
            title: '日志ID',
            name: 'logid',
            sortable:true,
            hidden:true
        },
        {
            title: '操作人',
            name: 'oName',//LoginName
            width: 10,
            renderer:function (val,item) {
                if(item.oName){
                    return val
                }else{
                    return item.loginName
                }
            }
        },
        {
            title: '操作模块',
            name: 'modellist',
            width: 10,
            renderer:function (val,item) {
                    return item.model+"==>"+item.modellist+"==>"+item.modellistfunction;
            }
        },
        {
            title: '相关参数',
            name: 'params',
            width: 10,
            renderer:function (val) {
                    return val
            }
        },
        {
            title: '备注',
            name: 'remark',
            width: 10,
            renderer:function (val) {
                return val
            }
        },
        {
            title: 'ip',
            name: 'operatorip',
            width: 10,
            renderer:function (val) {
                return val
            }
        },
        {
            title: '操作时间',
            name: 'createtime',
            width: 150,
            renderer:function (val) {
                return val
            }
        }
    ];

    var index_model = new Vue({
        el : '#pageinit',
        data : {
            page : 1,
            limit : 25,
            sortDirection:'',
            sortExpression:'',
            startTime :"",
            endTime :"",
            Remark:"",
            model:"",
            oName:""
        },
        methods : {
            //获取初始信息，并绑定列表单个编辑函数
            getData : function(){
                var data = {
                    page : this.page,
                    limit : this.limit,
                    Remark  : this.Remark ,
                    startDate :this.startTime ,
                    endDate :this.endTime ,
                    model:this.model,
                    OName:this.oName,
                    sortDirection:this.sortDirection,
                    sortExpression:this.sortExpression
                }
                mmg.load(data);
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
                this.Title = "";
                this.getData()
            }
        },
        created:function (){
            //初始化日历
            new pickerDateRange('startTime', {
                defaultText: ' 至 ',
                isSingleDay: false,
                stopToday: false,
                calendars: 2,
                shortbtn: true,//是否显示快捷操作
                startDate: "", //默认开始时间
                endDate: "",	//默认结束时间
                inputTrigger: 'dateRange',
                success: function (obj) { //选择日期后的回调函数
                    index_model.startTime = obj.startDate;
                    index_model.endTime = obj.endDate;
                }
            })
        }
    });
    mmg = $('.mmg').mmGrid({
        height: "auto",
        cols: cols,
        params: {
            page : 1,
            limit : 25,
            sortDirection:'',
            sortExpression:''
        },
        sortStatus: 'desc',
        fullWidthRows: true,
        autoLoad: false,
        showBackboard: true,
        root: 'Data',
        url:config.path+"syslog/list",
        plugins: [
            $('#pg').mmPaginator()
        ],
        limitChange: function(limit) {
            index_model.limit = limit;
            index_model.page = 1;
            index_model.getData();
        },
        pageChange: function(page) {
            index_model.page = page;
            index_model.getData();
        },
        sortChange: function(sort) {
            index_model.sortDirection = sort.sortDirection;
            index_model.sortExpression = sort.sortExpression;
            index_model.page = 1;
            index_model.getData();
        }
    });

    mmg.on('cellSelected', function(e, item, rowIndex, colIndex){
        var ele = $(e.target);
    })
    index_model.getData();
};

BaseJs.SysLogMannger=SysLogMannger;

})()