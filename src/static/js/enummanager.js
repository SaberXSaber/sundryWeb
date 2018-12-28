/**
 * Created by Administrator on 2016/7/12.
 */
config.menukey = 'BaseJs';

var BaseJs = {};

(function(){


    //枚举设置
    var EnumMannger = function(resultData){
        var mmg=null;
        var cols =  [
            {
                title: '排序',
                name:"Sort",
                width:50,
                sortable:true,
                lockWidth:true,
                renderer:function (val,item){
                    return '<input type="text" name="sort_input" value="'+item.sort+'" data-value="'+item.enumId+'" style="height: 20px; width: 30px;">'
                }
            },
            {
                title: '枚举编号',
                name: 'enumId',
                sortable:true,
                width: 50
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
                title: '创建时间',
                name: 'createTime',
                width: 150,
                renderer: function (val) {
                    return utool.myOnlyDate.date(val, "yyyy-MM-dd HH:mm:ss");
                }
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
                enumType:"",
                EnumTypeNames:[],
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
                        enumType:$("#parentUp option:selected").val(),
                    }
                    mmg.load(data);
                },
                addInfo:function () {
                    var _this=this;
                    layer.open({
                        type: 2,
                        title: "添加枚举",
                        shade: 0.8,
                        area: ["550px", '400px'],
                        content: './enummangeradd.html',
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
                    this.enumName = "";
                    this.enumType = "";
                    index_model.$nextTick(function() {
                     /*   $('#parentDown').trigger('chosen:updated');//更新选项*/
                        console.info(  $('#parentUp').trigger('chosen:updated'))
                        $('#parentUp').trigger('chosen:updated');//更新选项
                        $('#ParentId').trigger('chosen:updated');//更新选项
                    })
                    this.getData()
                },
                sortFn:function (){
                    alert(1)
                }
            },

            created:function (){
                //初始化枚举类型下拉列表
                var initData = {
                    page:1,
                    limit:10000
                }
                utool.ajax.ajaxRequest("POST",config.path + "benummanager/plist" , initData , "json").done(function (returnedData){
                    returnedData = JSON.parse(returnedData);
                    index_model.EnumTypeNames = returnedData.Data;
                    index_model.$nextTick(function() {
                        $('#parentUp').chosen().change(function(tar, val) {
                            index_model.enumT=val.selected;
                            index_model.getData();
                        });
                    })
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
            url:config.path+"benummanager/list",
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
                    title: "编辑枚举",
                    shade: 0.8,
                    area: ["550px", "400px"],
                    content: './enummangeradd.html?enumId='+item.enumId,
                    end:function (){
                        index_model.getData()
                    }
                });
                e.stopPropagation();
            }
            else if(ele.is('span[name="delete"]')){
                layer.confirm("确认删除此条信息?",{title:"提示"},function () {
                    var reqPara = {
                        enumId:item.enumId
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
                        enumId:$(this).attr("data-value"),
                        Sort:$(this).val()
                    }
                    utool.ajax.ajaxRequest("POST",config.path + "benummanager/updatesort",data,"json").done(function (returnData){
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

    //添加/修改
    var EnumManngerAdd=function (){
        var enumId= utool.search.getSearch("enumId");
        console.info("enumId:"+enumId)
        var add_model = new Vue({
            el : '#pageinit',
            data : {
                EnumId:enumId,
                isshow:true,
                enumType:"",
                EnumTypeNames:[],
                enumName :"",
                parent:"",
                ParentId:"",
                IsDisabled:enumId && enumId.length && enumId > 0
            },
            watch: {
                 inputdata: function(val) {
                 if(this.inputdata ==1){
                 this.$set('isshow',true)
                 }else{
                 this.$set('isshow',false)
                 }
                 }
            },
            methods : {
                noRed:function (enumId){
                    $("#" + enumId) .removeClass("err-input");
                },
                submit:function (){
                    /*if(this.enumType == ""){
                        $("#enumType").addClass("err-input");
                        return
                    }
                    if(this.enumName == ""){
                        $("#enumName").addClass("err-enumName");
                        return
                    }*/

                    if(enumId){
                        var enumTypevalues = $("#parent option:selected").val();
                        if(!enumTypevalues){
                            enumTypevalues = this.parent
                        }
                        var postData = {
                            enumId :enumId,
                            //enumType:$("input:radio[name='b']:checked").val(),
                            enumType:enumTypevalues,
                            enumName :this.enumName
                        }
                        var url = config.path + "benummanager/update";
                        var str = "修改枚举成功";
                    }else{
                        var enumTypevalues = $("#parent option:selected").val();
                        if(!enumTypevalues){
                            enumTypevalues = 1
                        }
                        var postData = {
                            //enumType:$("input:radio[name='b']:checked").val(),
                            enumType:enumTypevalues,
                            enumName :this.enumName
                        }
                        var url = config.path + "benummanager/add";
                        var str = "添加枚举成功";
                    }
                    layer.load(0, {shade: false});
                    utool.ajax.ajaxRequest("POST",url,postData,"json").done(function (returnData){
                        returnData = JSON.parse(returnData);
                        layer.closeAll()
                        if(returnData.Code==200){
                            layer.alert(str,function (){
                                parent.layer.closeAll();
                            })
                        }else{
                            layer.alert('获取数据错误，错误原因'+ returnData.Msg,{title : '错误',icon : 2});
                        }
                    })
                }
            },
            created:function (){
                if(enumId && enumId>0){
                    var data={
                        enumId:enumId
                    }

                    $("#option2")[0].disabled = true;
                    $("#option1")[0].disabled = true;
                    utool.ajax.ajaxRequest("POST",config.path+"benummanager/entity",data,"json").done(function (returnData){
                        returnData = JSON.parse(returnData);
                        if(returnData.Code==200){
                            add_model.enumName = returnData.Data.enumName;
                            add_model.parent = returnData.Data.enumType;
                            add_model.ParentId = returnData.Data.enumType;
                            if(add_model.parent ==1){
                                add_model.isshow = false
                                $("#option2")[0].checked = true;
                                $("#option1")[0].checked = false;

                            }else{
                                add_model.isshow = true
                                $("#option2")[0].checked = false;
                                $("#option1")[0].checked = true;
                            }
                            var initData = {
                                page:1,
                                limit:10000,
                                PageId:89
                            }
                            utool.ajax.ajaxRequest("POST",config.path + "benummanager/plist" , initData , "json").done(function (returnedData){
                                returnedData = JSON.parse(returnedData);
                                add_model.EnumTypeNames = returnedData.Data;
                                add_model.$nextTick(function() {
                                    $('#parent').trigger('chosen:updated');//更新选项
                                    $('#parent').chosen().change(function(tar, val) {
                                        add_model.enumT=val.selected;
                                    });
                                })
                            })
                            add_model.$nextTick(function (){
                                $('#parent').on('chosen:ready', function(e, params) {
                                    $("#parent").attr("value",returnData.Data.enumType)
                                    $('#parent').trigger('chosen:updated');//更新选项
                                });
                            })
                        }
                    })
                }else{
                    $("#option2")[0].disabled = false;
                    $("#option1")[0].disabled = false;
                    var initData = {
                        page:1,
                        limit:10000
                    }
                    utool.ajax.ajaxRequest("POST",config.path + "benummanager/plist" , initData , "json").done(function (returnedData){
                        returnedData = JSON.parse(returnedData);
                        add_model.EnumTypeNames = returnedData.Data;
                        add_model.$nextTick(function() {
                            $("#option1")[0].checked = true;
                            $('#parent').chosen().change(function(tar, val) {
                                add_model.enumT=val.selected;
                            });
                        })
                    })
                }
            }
        });
    };





    BaseJs.EnumMannger=EnumMannger;

    BaseJs.EnumManngerAdd=EnumManngerAdd;



})()