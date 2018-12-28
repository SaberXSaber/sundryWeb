/**
 * Created by Administrator on 2016/7/12.
 */
config.menukey = 'BaseJs';

var BaseJs = {};

(function(){


    var rankView = function(){
        var mmg=null;

        var cols =  [
            /*{
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

            },*/

            /*{
                title: 'Id',
                name: 'id',
                sortable:true,
                width: 40,

            },*/
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
                title: '购买数',
                name: 'buyNum',
                width: 60
            },
            {
                title: '涨跌幅',
                name: 'totalRatio',
                width: 60
            },
            {
                title: '走势图',
                name: 'totalRatio',
                width: 60,
                renderer:function (val,item) {
                    var html ="";
                    html += "<a title='走势图' class='render_a' ><span class='fa fa-line-chart' aria-hidden='true' name='report'></span></a>"
                    return html;
                },
            },
           /* {
                title: '购买此股票基金',
                name: 'totalRatio',
                width: 60
            },*/

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
            },
            methods : {
                //获取初始信息，并绑定列表单个编辑函数
                getData : function(){
                    var data = {
                        pageBean:{
                            page :  this.page,
                            limit : this.limit,
                            sortDirection:this.sortDirection,
                            sortExpression:this.sortExpression,
                        },
                        sharesName: this.sharesName,
                        sharesCode: this.sharesCode,
                    }
                    mmg.load(data);
                },
                exportData: function () {
                    window.open(config.path
                        + 'shares/exportReport?limit=1000000&'
                        + 'sharesName=' + (this.sharesName ? this.sharesName : "")
                        + "&sharesCode=" + (this.sharesCode ? this.sharesCode : ""));
                },
                addInfo:function () {
                    var _this=this;
                    layer.open({
                        type: 2,
                        title: "添加",
                        shade: 0.8,
                        area: ["90%", "80%"],
                        content: './fundadd.html',
                        end:function (){
                        }
                    });
                },
                batchchart:function (){
                    items = mmg.selectedRows()
                    var sharesCodes = new Array
                    if (items.length < 1) {
                        layer.alert('请选择指定行');
                        return
                    }
                    items.forEach(function (el) {
                        sharesCodes.push(el.sharesCode)
                    });
                    layer.open({
                        type: 2,
                        title: "排行走势图",
                        shade: [0.1, '#FFF'],
                        area: ["90%", "90%"],
                        content: './report.html?sharesCode='+sharesCodes,
                        end: function () {
                            //index_model.getData()
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
                    this.getData()
                },

            },
            created:function (){
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
            url:config.path+"shares/sharesAnalysisdatalist",
            params: {
                pageBean:{
                    page : 1,
                    limit : 25,
                    sortDirection:'',
                    sortExpression:'',
                }

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
            if(ele.is('span[name="report"]')){
                layer.open({
                    type: 2,
                    title: "排行走势图",
                    shade: 0.8,
                    area: ["90%", "90%"],
                    content: './report.html?sharesCode='+item.sharesCode,
                    end:function (){
                        index_model.getData()
                    }
                });
            }
        })
        index_model.getData();
    };

    BaseJs.rankView=rankView;



})()