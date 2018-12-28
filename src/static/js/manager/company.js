$(document).ready(function () {

    var mmg=null;

    var cols = [
        {
            title: '操作',
            name: '',
            sortable: true,
            width: 50,
            renderer:function (val) {
                return "<div style=\"height: auto; margin: 0px;padding: 0px; font-size: 16px;\">"+
               "<a  title=\"修改\" style='margin: 0px;padding: 0px; color: black' ><span class=\"glyphicon glyphicon-edit\" aria-hidden=\"true\"></span></a>"+
                    "<a title=\"删除\" style='margin: 0px;padding: 0px; color: black'  > <span name='btn_del_detail'   class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\"></span></a>"+
                    "</div>";
            }
        },
        {
            title: 'Id',
            name: 'id',
            hidden:true
        },
        {
            title: '公司名称',
            name: 'companyName',
            sortable: true,
            width: 150
        },
        {
            title: '公司缩写简称',
            name: 'abbreviation',
            sortable: true,
            width: 150
        },
        {
            title: '备注',
            name: 'remark',
            width: 1288
        }
    ];

    var mmg = $('#mmg').mmGrid({
        height : "auto"
        , cols: cols
        , url: '/bcompany/list'
        , root: 'Data'
        , method: 'POST'
        , fullWidthRows: true
        , params: {}
        , sortName: 'updateTime'
        , remoteSort: true
        , autoLoad: false
        , sortStatus: 'desc'
        , multiSelect: true //多选
        , checkCol: true //选框列
        // , fullWidthRows: true //伸展列宽自动充满表格
        , nowrap: true //内容不折行
        , plugins: [
            $('#pg').mmPaginator({limitList: [10, 20, 30, 40, 50]})
        ] //分页插件
    });

    mmg.on('cellSelected', function (e, item, rowIndex, colIndex) {
        //删除
        var ele = $(e.target);
        //禁用
        if (ele.is('span[name="btn_del_detail"]')) {
            layer.confirm("确认删除此条信息?", {title: "提示"}, function () {
                var reqPara = {
                    Id:item.id
                };
                utool.ajax.ajaxRequest("POST", config.path + "/bcompany/delete", reqPara, "json").done(function (returnedData) {
                    layer.closeAll("loading")
                    returnedData = JSON.parse(returnedData);
                    if (returnedData.Code == 200) {
                        layer.alert("删除成功", {
                            title: '提示',
                            icon: 1
                        }, function (index) {
                            layer.close(index)
                            mmgrid.load();
                        })
                    } else {
                        layer.alert(result.Msg, {
                            title: '错误',
                            icon: 2
                        });
                    }
                })
                /*$.ajax({
                    url: "/bcompany/delete",
                    type: "POST",
                    datType: 'json',
                    contentType: "application/json",
                    data: reqPara,
                    async: false,
                    success: function (result) {
                        debugger
                        if (result.Code == 200) {
                            layer.alert("删除成功", {
                                title: '提示',
                                icon: 1
                            }, function (index) {
                                layer.close(index)
                                mmgrid.load();
                            })
                        } else {
                            layer.alert(result.Msg, {
                                title: '错误',
                                icon: 2
                            });
                        }
                    }
                });*/
            });
            /*
            var dialog = jDialog.confirm('确定要删除吗？', {
                handler: function (button, dialog) {
                    $.ajax({
                        url: "/bcompany/delete",
                        type: "POST",
                        datType: "JSON",
                        contentType: "application/json",
                        data: " {Id: "+item.id+"}",
                        async: false,
                        success: function (result) {
                            debugger
                            dialog.close();
                            mmgrid.load();
                        }
                    });
                    // $.post("/bcompany/delete", {
                    //     Id: item.id
                    // }, function (result) {
                    //     debugger
                    //     dialog.close();
                    //     mmgrid.load();
                    // },'json');
                }
            }, {
                handler: function (button, dialog) {
                    dialog.close();
                }
            });
            */
            e.stopPropagation()
        }
    }).load();

    $("#btn_company_add").click(function () {
        layer.open({
            type: 2,
            title: "添加公司信息",
            shade: 0.8,
            area: ['20%', '30%'],
            content: 'indexdetail.html'
        });
    });

});