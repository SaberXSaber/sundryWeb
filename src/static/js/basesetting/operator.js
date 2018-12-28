/**
 * Created by Administrator on 2016/7/12.
 */
config.menukey = 'BaseJs';

var BaseJs = {};

(function(){


    var OperatorList = function(){
        var mmg=null;
        var cols =  [

            {
                title: '编号',
                name: 'operatorId',
                sortable:true,
                width: 50,
            },
            {
                title: '登录名称',
                name: 'loginName',
                sortable:true,
                width: 50,
            },
            {
                title: '真实姓名',
                name: 'trueName',
                width: 60
            },
            {
                title: '角色',
                name: 'roles',
                width: 60
            },
            {
                title: '部门',
                name: 'branchName',
                width: 100
            },
            {
                title: '上级',
                name: 'parentName',
                width: 120
            },

        ];


        cols.splice(0,0,{
            title: '操作',
            name: '',
            lockWidth:true,
            sortable: false,
            width: 100,
            renderer:function () {
                var html ="";
                    html += "<a  title='权限分配' class='render_a' ><span class='glyphicon glyphicon-user' aria-hidden='true' name='right'></span></a>"
                    html += "<a  title='编辑' class='render_a' ><span class='glyphicon glyphicon-edit' aria-hidden='true' name='edit'></span></a>"
                    html += "<a title='删除' class='render_a' > <span name='delete' class='glyphicon glyphicon-remove' aria-hidden='true'></span></a>"
                return html;
            },
        })



        var index_model = new Vue({
            el : '#pageinit',
            data : {
                //Rights:resultData.Rights,
                page : 1,
                limit : 25,
                sortDirection:'',
                sortExpression:'',
                loginName:"",
                trueName:"",


            },
            methods : {
                //获取初始信息，并绑定列表单个编辑函数
                getData : function(){
                    var data = {
                        page : this.page,
                        limit : this.limit,
                        sortDirection:this.sortDirection,
                        sortExpression:this.sortExpression,
                        loginName:this.loginName,
                        trueName:this.trueName,

                    }
                    mmg.load(data);
                },

                addInfo:function () {
                    var _this=this;
                    layer.open({
                        type: 2,
                        title: "添加",
                        shade: 0.8,
                        area: ["760px", "500px"],
                        content: './operatoradd.html',
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
                    this.loginName= "";
                    this.trueName= "";


                    this.getData()
                },
            },
            created:function (){
                utool.ajax.ajaxRequest("POST", config.path + "getOperator" , {}, "json").done(function (returnData) {
                    returnData = JSON.parse(returnData);
                    if (returnData.code == 200) {
                       console.info("当前用户"+returnData.msg )
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
            url:config.path+"operator/list",
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
                    title: "添加",
                    shade: 0.8,
                    area: ["760px", "500px"],
                    content: './operatoradd.html?operatorId='+item.operatorId,
                    end:function (){
                        index_model.getData()
                    }
                });
            }else if (ele.is('span[name="delete"]')) {
                layer.confirm("确认删除此条信息?", {title: "提示"}, function () {
                    utool.ajax.ajaxRequest("POST", config.path + "operator/delete?operatorId="+item.operatorId,{}, "json").done(function (returnData) {
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
            }else if (ele.is('span[name="right"]')) {
                layer.open({
                    type: 2,
                    title: "分配权限",
                    shade: 0.8,
                    area: ["760px", "500px"],
                    content: './operatorRight.html?operatorId='+item.operatorId,
                    end:function (){
                        index_model.getData()
                    }
                });
            }
        })

        index_model.getData();
    };

    //添加/修改用户
    var OperatorAdd=function (){
        var operatorId= utool.search.getSearch("operatorId");
        var add_model = new Vue({
            el : '#pageinit',
            data : {
                operatorId:operatorId,
                parentId:'',
                parentIdArr:[],
                loginName:'',
                loginPWD:'',
                trueName:'',
                roles:'',
                branchName:'',
                remark:'',
            },
            methods : {
                noRed:function (id){
                    $("#" + id) .removeClass("err-input");
                },
                getId:function (name){
                    add_model[name] = $("#"+name).attr("data-id") || "";
                },
                submit:function (){
                    if(this.loginName == ""){
                        $("#loginName").addClass("err-input");
                        return
                    }
                    if(operatorId==null ){
                        if(this.loginPWD == ""){
                            $("#loginPWD").addClass("err-input");
                            return
                        }
                    }
                    if(this.trueName == ""){
                        $("#trueName").addClass("err-input");
                        return
                    }
                    if(this.roles == ""){
                        $("#roles").addClass("err-input");
                        return
                    }
                    if(this.branchName == ""){
                        $("#branchName").addClass("err-input");
                        return
                    }
                    if(this.parentId == ""){
                        layer.msg("请选择上级");
                        return
                    }
                    if(operatorId && operatorId>0){
                        var postData = {
                            operatorId:operatorId,
                            parentId:this.parentId,
                            loginName:this.loginName,
                            loginPWD:this.loginPWD,
                            trueName:this.trueName,
                            roles:this.roles,
                            branchName:this.branchName,
                            remark:this.remark,
                        }
                        var url = config.path + "operator/update";
                        var str = "修改成功";
                    }else{
                        var postData = {
                            operatorId:operatorId,
                            parentId:this.parentId,
                            loginName:this.loginName,
                            loginPWD:this.loginPWD,
                            trueName:this.trueName,
                            roles:this.roles,
                            branchName:this.branchName,
                            remark:this.remark,
                        }
                        var url = config.path + "operator/add";
                        var str = "添加成功";

                    }
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
                if(operatorId&&operatorId>0){
                    utool.ajax.ajaxRequest("POST", config.path + "operator/get?operatorId="+operatorId, {}, "json").done(function (returnData) {
                        returnData = JSON.parse(returnData);
                        if (returnData.code == 200) {
                            add_model.parentId= returnData.data.parentId;
                            add_model.loginName= returnData.data.loginName;
                            add_model.loginPWD= returnData.data.loginPWD;
                            add_model.trueName= returnData.data.trueName;
                            add_model.roles= returnData.data.roles;
                            add_model.branchName= returnData.data.branchName;
                            add_model.remark= returnData.data.remark;

                            utool.ajax.ajaxRequest("POST", config.path + "operator/selectlist", {page : 1, limit : 1000}, "json").done(function (returnData) {
                                returnData = JSON.parse(returnData);
                                if (returnData.code == 200) {
                                    add_model.parentIdArr = returnData.data;
                                    add_model.$nextTick(function () {
                                        $('#parentId').chosen().change(function (tar, val) {
                                            add_model.parentId = val.selected;
                                        });
                                    })
                                }
                            })
                        }
                    })
                }else{
                    utool.ajax.ajaxRequest("POST", config.path + "operator/list", {page : 1, limit : 1000}, "json").done(function (returnData) {
                        returnData = JSON.parse(returnData);
                        if (returnData.code == 200) {
                            add_model.parentIdArr = returnData.data;
                            add_model.$nextTick(function () {
                                $('#parentId').chosen().change(function (tar, val) {
                                    add_model.parentId = val.selected;
                                });
                            })
                        }
                    })
                }


            }
        });
    };


    //添加权限
    var OperatorRight=function (){
        var operatorId= utool.search.getSearch("operatorId");
        var add_model = new Vue({
            el : '#pageinit',
            data : {
                operatorId:operatorId,
                rightArr:[],
                rightIdlists:[],
            },
            methods : {

                submit:function (){

                    for(var i= 0;i<add_model.rightArr.length;i++){
                        if(add_model.rightArr[i].checked == true){
                            add_model.rightIdlists.push(add_model.rightArr[i].rightsId);
                        }
                    }
                    var postData={
                        operatorId:operatorId,
                        rightIdlists:add_model.rightIdlists,
                    }

                    var url = config.path + "operator/updateOperatorRights";
                    var str = "修改成功";
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
                utool.ajax.ajaxRequest("POST", config.path + "operator/getOperatorRight?operatorId="+operatorId, {}, "json").done(function (returnData) {
                    returnData = JSON.parse(returnData);
                    if (returnData.code == 200) {
                        add_model.rightArr = returnData.data;
                    }
                })
            }
        });
    };



    BaseJs.OperatorList=OperatorList;

    BaseJs.OperatorAdd=OperatorAdd;
    BaseJs.OperatorRight=OperatorRight;



})()