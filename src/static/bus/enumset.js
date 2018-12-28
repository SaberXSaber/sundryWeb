/**
 * Created by Administrator on 2016/7/12.
 */
config.menukey = 'BaseJs';

var BaseJs = {};

(function(){


    //枚举设置
    var JurMannger = function(resultData){
        var mmg=null;
        var cols =  [
            {
                title: '枚举编号',
                name: 'enumId',
                sortable:true,
                hidden:true
            },
            {
                title: '枚举名称',
                name: 'enumName',
                width: 60
            },
            {
                title: '枚举类型',
                name: 'enumTypeName',
                width: 80
            },
            {
                title: '扩展字段1',
                name: 'extendedField1',
                width: 100
            },
            {
                title: '扩展字段2',
                name: 'extendedField2',
                width: 100
            }
        ]

        if(/*resultData.Rights.delete ||*/ resultData.Rights.update){
            cols.splice(0,0,{
                title: '操作',
                name: '',
                lockWidth:true,
                sortable: false,
                width: 80,
                renderer:function () {
                    var html ="";
                    if(resultData.Rights.update){
                        html += "<a  title='修改' class='render_a' ><span class='glyphicon glyphicon-edit' aria-hidden='true' name='edit'></span></a>"
                    }

                   /* if(resultData.Rights.delete){
                        html += "<a title='删除' class='render_a' > <span name='delete' class='glyphicon glyphicon-remove' aria-hidden='true'></span></a>"
                    }*/
                    return html;
                },
            })
        }

        var index_model = new Vue({
            el : '#pageinit',
            data : {
                Rights:resultData.Rights,
                page : 1,
                limit : 25,
                sortDirection:'asc',
                sortExpression:'enumId',
                enumId :"",
                enumName :"",
                enumTypeId:"",
                parentArr:[],
                childrenId:"",
                childrenArr:[]
            },
            methods : {
                //获取初始信息，并绑定列表单个编辑函数
                getData : function(parentId){
                    // parentId = parentId || this.parentId
                    var data = {
                        page : this.page,
                        limit : this.limit,
                        sortDirection:this.sortDirection,
                        sortExpression:this.sortExpression,

                        enumId : this.enumId,
                        enumName : this.enumName,
                        enumTypeId: this.enumTypeId
                    }
                    mmg.load(data);
                },
                addInfo:function () {
                    var _this=this;
                    layer.open({
                        type: 2,
                        title: "添加权限",
                        shade: 0.8,
                        area: ["550px", '400px'],
                        content: './juradminadd.html',
                        end:function (){
                            _this.getData()
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
                    this.enumId = "";
                    this.Name = "";
                    this.parentId = "";
                    this.childrenId = "";
                    index_model.$nextTick(function() {
                        $('#parentDown').trigger('chosen:updated');//更新选项
                        $('#parentUp').trigger('chosen:updated');//更新选项
                    })
                    this.getData()
                },
                sortFn:function (){
                    alert(1)
                }
            },
            created:function (){
                var data = {
                    page : 1,
                    limit : 1000,
                    sortDirection:'asc',
                    sortExpression:'jurisdictionId',
                    Level:1
                }

                //下拉联动
                utool.ajax.ajaxRequest("POST",config.path+"benumset/list",data,"json").done(function (returnData){
                    returnData = JSON.parse(returnData);
                    if(returnData.Code==200){
                        index_model.parentArr = returnData.Data;
                        index_model.$nextTick(function() {
                            $('#parentUp').chosen().change(function(tar, val) {
                                index_model.parentId=val.selected;
                                index_model.getData();
                                var postData = {
                                    page : 1,
                                    limit : 1000,
                                    sortDirection:'asc',
                                    sortExpression:'jurisdictionId',
                                    ParentId:index_model.parentId
                                }
                                utool.ajax.ajaxRequest("POST",config.path+"benumset/list",postData,"json").done(function (returnData){
                                    returnData = JSON.parse(returnData);
                                    if(returnData.Code==200){
                                        index_model.childrenArr = returnData.Data;
                                        index_model.childrenId = "";
                                        index_model.$nextTick(function() {
                                            $('#parentDown').trigger('chosen:updated');//更新选项
                                            $('#parentDown').chosen().change(function(tar, val) {
                                                index_model.childrenId=val.selected;
                                                index_model.parentId=val.selected;
                                                index_model.getData(index_model.childrenId);
                                            });
                                        })
                                    }
                                })
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
            root: 'Data',
            url:config.path+"benumset/list",
            params: {
                page : 1,
                limit : 25,
                sortDirection:'asc',
                sortExpression:'enumId'
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
            if(ele.is('span[name="edit"]')){
                layer.open({
                    type: 2,
                    title: "编辑权限",
                    shade: 0.8,
                    area: ["550px", "400px"],
                    content: './juradminadd.html?id='+item.jurisdictionId,
                    end:function (){
                        index_model.getData()
                    }
                });
                e.stopPropagation();
            }
            else if(ele.is('span[name="delete"]')){
                layer.confirm("确认删除此条信息?",{title:"提示"},function () {
                    var reqPara = {
                        JurisdictionId:item.jurisdictionId
                    };
                    utool.ajax.ajaxRequest("POST", config.path + "benumset/delete", reqPara, "json").done(function (returnData){
                        returnData = JSON.parse(returnData);
                        if(returnData.Code == 200){
                            index_model.getData();
                            layer.alert("删除成功",function (index){
                                layer.close(index);
                            })
                        }else{
                            layer.alert('获取数据错误，错误原因'+ returnData.Msg,{title : '错误',icon : 2});
                        }
                    })
                })
                e.stopPropagation();
            }
            else if(ele.is('input[name="sort_input"]')){
                e.stopPropagation();
            }

        }).on('loadSuccess', function (e, data) {
            $("#mmg input").keydown(function (e) {
                if(e.which == 13){
                    var data = {
                        JurisdictionId:$(this).attr("data-value"),
                        Sort:$(this).val()
                    }
                    utool.ajax.ajaxRequest("POST",config.path + "benumset/updatesort",data,"json").done(function (returnData){
                        returnData = JSON.parse(returnData);
                        if(returnData.Code==200){
                            index_model.sortExpression = "Sort";
                            index_model.getData();
                        }
                    })
                }
            })
        })
        index_model.getData();
    };

    //添加/修改权限
    var JurManngerAdd=function (){
        var id= utool.search.getSearch("id");
        var add_model = new Vue({
            el : '#pageinit',
            data : {
                Name:"",
                Url:"",
                ParentId:0,
                ParentName:"",
                Level:0,
                FunctionId:0,
                limitList:[]
            },
            methods : {
                noRed:function (id){
                    $("#" + id) .removeClass("err-input");
                },
                getLimit:function (){
                    if(id && this.Level == 0){
                        layer.alert("无法选择上级目录");
                        return
                    }
                    layer.open({
                        type: 2,
                        title: false,
                        shade: 0.8,
                        closeBtn:false,
                        area: ["100%", '100%'],
                        content: './juradminlimit.html',
                        end:function (){
                            if($("#ParentName").attr("data-id")){
                                add_model.ParentId = $("#ParentName").attr("data-id").split("-")[0];
                                add_model.Level = $("#ParentName").attr("data-id").split("-")[1];
                            }
                            utool.ajax.ajaxRequest("POST",config.path + "bf/list",{limit:1000},"json").done(function (returnData){
                                returnData = JSON.parse(returnData);
                                if(returnData.Code==200){
                                    add_model.limitList = returnData.Data;
                                    add_model.$nextTick(function (){
                                        $('#FunctionId').chosen().change(function(tar, val) {
                                            $("#FunctionId_chosen>a").removeClass("err-input");
                                            add_model.FunctionId=val.selected;
                                            add_model.Name = $("#FunctionId").find("option:selected").text();
                                        });
                                    })
                                }else{
                                    layer.alert('获取数据错误，错误原因'+ retrunData.Msg,{title : '错误',icon : 2});
                                }
                            })
                        }
                    })
                },
                submit:function (){
                    if(this.Level == 1){
                        //选择一级菜单
                        if(this.Name == ""){
                            $("#Name").addClass("err-input");
                            return
                        }
                    }else{
                        //选择二级菜单
                        if(this.Name == ""){
                            $("#FunctionId_chosen>a").addClass("err-input");
                            return
                        }
                    }
                    if(id && id>0){
                        var postData ={
                            Name:add_model.Name,
                            Url:add_model.Url,
                            ParentId:add_model.ParentId,
                            Level:add_model.Level*1+1,
                            JurisdictionId:id,
                            FunctionId:add_model.FunctionId
                        }
                        var path = config.path + "benumset/update";
                        var message="修改权限成功";
                    }else{
                        var postData ={
                            Name:add_model.Name,
                            Url:add_model.Url,
                            ParentId:add_model.ParentId,
                            Level:add_model.Level*1+1,
                            FunctionId:add_model.FunctionId
                        }
                        var path = config.path + "benumset/add";
                        var message="添加权限成功";
                    }

                    utool.ajax.ajaxRequest("POST",path,postData,"json").done(function (retrunData){
                        retrunData = JSON.parse(retrunData);
                        if(retrunData.Code==200){
                            layer.alert(message,function (){
                                var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
                                parent.layer.close(index);
                            });
                        }else{
                            layer.alert('获取数据错误，错误原因'+ retrunData.Msg,{title : '错误',icon : 2});
                        }
                    })
                }
            },
            created:function (){
                if(id && id>0){
                    var data={
                        JurisdictionId :id
                    }
                    utool.ajax.ajaxRequest("POST",config.path+"benumset/entity",data,"json").done(function (returnData){
                        returnData = JSON.parse(returnData);
                        if(returnData.Code==200){
                            add_model.Name = returnData.Data.name;
                            add_model.Url = returnData.Data.url;
                            add_model.ParentId = returnData.Data.parentId;
                            add_model.FunctionId = returnData.Data.functionId;
                            add_model.Level = returnData.Data.level*1-1;
                            $("#ParentName").text(returnData.Data.parentName);
                            if(add_model.Level==2){
                                utool.ajax.ajaxRequest("POST",config.path + "bf/list",{limit:1000},"json").done(function (returnData){
                                    returnData = JSON.parse(returnData);
                                    if(returnData.Code==200){
                                        add_model.limitList = returnData.Data;
                                        add_model.$nextTick(function (){
                                            $('#FunctionId').chosen().change(function(tar, val) {
                                                add_model.FunctionId=val.selected;
                                                add_model.Name = $("#FunctionId").find("option:selected").text();
                                            });
                                        })
                                    }else{
                                        layer.alert('获取数据错误，错误原因'+ retrunData.Msg,{title : '错误',icon : 2});
                                    }
                                })

                                add_model.$nextTick(function (){
                                    $('#FunctionId').on('chosen:ready', function(e, params) {
                                        $("#FunctionId").attr("value",returnData.Data.functionId)
                                        $('#FunctionId').trigger('chosen:updated');//更新选项
                                    });
                                })

                            }
                        }else{
                            layer.alert('获取数据错误，错误原因'+ retrunData.Msg,{title : '错误',icon : 2});
                        }
                    })
                }
            }
        });
    };

    //添加/修改权限-子页面
    var JurManngerLimit=function (){
        var setting = {
            check: {
                enable: true,
                chkStyle: "radio",
                radioType: "level"
            },
            data: {
                simpleData: {
                    enable: true
                }
            }
        };
        var add_model = new Vue({
            el : '#pageinit',
            data : {
                nodeId:"",
                nodeName:"",
                nodeLevel:""
            },
            methods : {
                submit:function (){
                    var treeObj=$.fn.zTree.getZTreeObj("treeDemo"),
                        nodes=treeObj.getCheckedNodes(true),
                        v="";
                    for(var i=0;i<nodes.length;i++){
                        v+=nodes[i].name + ",";
                        add_model.nodeId = nodes[i].id;
                        add_model.nodeName = nodes[i].name;
                        add_model.nodeLevel = nodes[i].level+1;
                    }
                    if(add_model.nodeId){
                        parent.$("#ParentName").text(add_model.nodeName);
                        parent.$("#ParentName").attr("data-id",add_model.nodeId + "-" + add_model.nodeLevel);
                        var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
                        parent.layer.close(index);
                    }else{
                        layer.alert("请选择上级权限")
                    }
                },
                cancel:function (){
                    var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
                    parent.layer.close(index);
                }
            },
            created:function (){
                utool.ajax.ajaxRequest("POST",config.path + "broles/rightlists" ,{},"json").done(function (returnData){
                    returnData = JSON.parse(returnData);
                    if(returnData.Code==200){
                        $.fn.zTree.init($("#treeDemo"), setting, returnData.Data);
                    }
                })
            }
        });
    };




    BaseJs.JurMannger=JurMannger;

    BaseJs.JurManngerAdd=JurManngerAdd;

    BaseJs.JurManngerLimit=JurManngerLimit;


})()