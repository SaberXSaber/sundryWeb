/**
 * Created by Administrator on 2016/7/12.
 */
config.menukey = 'BaseJs';

var BaseJs = {};

(function(){
    //部门管理
    var PptMannger = function(resultData){

        var mmg=null;

        var cols =  [
            {
                title: '类型ID',
                name: 'projectTypeId',
                sortable:true,
                hidden:true
            },
            {
                title: '类型名称',
                name: 'title',
                sortable:true
            },
            {
                title: '上级类型',
                name: 'parentName',
                width: 150
            },
            {
                title: '上级类型路径',
                name: 'parentPath',
                width: 150
            },
            {
                title: '备注',
                name: 'remark'
            },
            {
                title: '状态',
                name: 'status',
                renderer:function (val) {
                    if(val == 0){
                        return "默认"
                    }else{
                        return ""
                    }
                }
            },
            {
                title: '创建时间',
                name: 'createTime'
            }
        ]

        if(resultData.Rights.delete || resultData.Rights.update){
            cols.splice(1,0,{
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

                    if(resultData.Rights.delete){
                        html += "<a title='删除' class='render_a' > <span name='delete' class='glyphicon glyphicon-remove' aria-hidden='true'></span></a>"
                    }
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
                sortDirection:'',
                sortExpression:'',
                Title :"",
                ParentNames:[],
                ParentId:0
            },
            methods : {
                //获取初始信息，并绑定列表单个编辑函数
                getData : function(){
                    var data = {
                        page : this.page,
                        limit : this.limit,
                        Title  : this.Title ,
                        ParentId : this.ParentId,
                        sortDirection:this.sortDirection,
                        sortExpression:this.sortExpression
                    }
                    mmg.load(data);
                },
                addInfo:function () {
                    var _this=this;
                    layer.open({
                        type: 2,
                        title: "添加项目类型",
                        shade: 0.8,
                        area: ["400px", '280px'],
                        content: './depadminadd.html',
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
                    this.Title = "";
                    this.getData()
                }
            },
            created:function (){
                //初始化部门下拉列表
                var initData = {
                    page:1,
                    limit:10000
                }
                utool.ajax.ajaxRequest("POST",config.path + "ppt/plist" , initData , "json").done(function (returnedData){
                    returnedData = JSON.parse(returnedData);
                    index_model.ParentNames = returnedData.Data;
                    index_model.$nextTick(function() {
                        $('#parentUp').chosen().change(function(tar, val) {
                            index_model.ParentId=val.selected;
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
            url:config.path+"ppt/list",
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
            if(ele.is('span[name="edit"]')){
                layer.open({
                    type: 2,
                    title: "修改项目类型",
                    shade: 0.8,
                    area: ["400px", '280px'],
                    content: './depadminadd.html?id='+item.branchId,
                    end:function (){
                        index_model.getData()
                    }
                });
            }else if(ele.is('span[name="delete"]')){
                layer.confirm("确认删除此条信息?",{title:"提示"},function () {
                    var reqPara = {
                        ProjectTypeId : item.projectTypeId
                    };
                    utool.ajax.ajaxRequest("POST", config.path + " ppt/delete", reqPara, "json").done(function (returnData){
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
                e.stopPropagation()
            }
        })
        index_model.getData();
    };

    //添加/修改部门
    var DepManngerAdd=function (){

        var id= utool.search.getSearch("id");

        console.info(id)

        var add_model = new Vue({
            el : '#pageinit',
            data : {
                Title :"",
                ParentId:"",
                parentArr:[],
                Remark:"",
            },
            methods : {
                noRed:function (id){
                    $("#" + id) .removeClass("err-input");
                },
                submit:function (){
                    if(this.Title == ""){
                        $("#Title").addClass("err-input");
                        return
                    }

                    if(this.ParentId == ""){
                        $("#parent_chosen>a").addClass("err-input");
                        return
                    }

                    if(id){
                        var postData = {
                            BranchId :id,
                            Title:this.Title,
                            ParentId :this.ParentId,
                            Remark:this.Remark
                        }
                        var url = config.path + "bbranch/update";
                        var str = "修改部门成功";
                    }else{
                        var postData = {
                            Title:this.Title,
                            ParentId :this.ParentId,
                            Remark:this.Remark
                        }
                        var url = config.path + "bbranch/add";
                        var str = "添加部门成功";
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
                if(id && id>0){
                    var data={
                        BranchId:id
                    }
                    utool.ajax.ajaxRequest("POST",config.path+"bbranch/entity",data,"json").done(function (returnData){
                        returnData = JSON.parse(returnData);
                        if(returnData.Code==200){
                            add_model.Title = returnData.Data.title;
                            add_model.Remark = returnData.Data.remark;
                            add_model.ParentId = returnData.Data.parentId;
                            var initData = {
                                page:1,
                                limit:10000
                            }
                            utool.ajax.ajaxRequest("POST",config.path + "bbranch/list" , initData , "json").done(function (returnedData){
                                returnedData = JSON.parse(returnedData);
                                add_model.parentArr = returnedData.Data;
                                add_model.$nextTick(function() {
                                    $('#parent').chosen().change(function(tar, val) {
                                        add_model.ParentId=val.selected;
                                    });
                                })
                            })
                            add_model.$nextTick(function (){
                                $('#parent').on('chosen:ready', function(e, params) {
                                    $("#parent").attr("value",returnData.Data.parentId)
                                    $('#parent').trigger('chosen:updated');//更新选项
                                });
                            })
                        }
                    })
                }else{
                    var initData = {
                        page:1,
                        limit:10000
                    }
                    utool.ajax.ajaxRequest("POST",config.path + "bbranch/list" , initData , "json").done(function (returnedData){
                        returnedData = JSON.parse(returnedData);
                        add_model.parentArr = returnedData.Data;
                        add_model.$nextTick(function() {
                            $('#parent').chosen().change(function(tar, val) {
                                $("#parent_chosen>a").removeClass("err-input");
                                add_model.ParentId=val.selected;
                            });
                        })
                    })
                }
            }
        });
    };

    BaseJs.PptMannger=PptMannger;

    BaseJs.DepManngerAdd=DepManngerAdd;

})()