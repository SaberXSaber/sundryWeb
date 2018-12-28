/**
 * Created by Administrator on 2016/7/12.
 */
config.menukey = 'BaseJs';

var BaseJs = {};

(function(){


    //枚举设置
    var BColumnMannger = function(resultData){
        var mmg=null;

        var cols =  [
            {
                title: '角色编号',
                name: 'roleId',
                sortable:true,
                hidden:true
            },
            {
                title: '角色名称',
                name: 'roleName',
                width: 150
            },
            {
                title: '表名',
                name: 'tableId',
                width: 150,
                renderer:function (val){
                    return val==1? "项目表" : "金额表"
                }

            },
            {
                title: '列名',
                name: 'columnNames'
            }
        ];

        if(resultData.Rights.delete || resultData.Rights.update || resultData.Rights.roles){
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
                        html += "<a title='删除' style='margin: -4px;' class='render_a' > <span name='delete' class='glyphicon glyphicon-remove' aria-hidden='true'></span></a>"
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
                roleName:""
            },
            methods : {
                //获取初始信息，并绑定列表单个编辑函数
                getData : function(){
                    var data = {
                        page : this.page,
                        limit : this.limit,
                        roleName : this.roleName,
                        sortDirection:this.sortDirection,
                        sortExpression:this.sortExpression
                    }
                    mmg.load(data);
                },
                addInfo:function () {
                    var _this=this;
                    layer.open({
                        type: 2,
                        title: "添加管理列",
                        shade: 0.8,
                        area: ["480px", '600px'],
                        content: './bcolumnroleadd.html',
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
                    this.roleName = "";
                    this.getData()
                }
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
            url:config.path+"bcolumrole/list",
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
                    title: "修改",
                    shade: 0.8,
                    area: ["480px", '600px'],
                    content: './bcolumnroleadd.html?roleId='+item.roleId+"&tableId="+item.tableId,
                    end:function (){
                        index_model.getData()
                    }
                });
            }else if(ele.is('span[name="delete"]')){
                layer.confirm("确认删除选中活动?",{title:"提示"},function (){
                    var reqPara = {
                        roleId :item.roleId,
                        tableId :item.tableId,
                    };
                    utool.ajax.ajaxRequest("POST", config.path + "bcolumrole/delete", reqPara, "json").done(function (returnData){
                        returnData = JSON.parse(returnData);
                        if(returnData.Code == 200){
                            index_model.getData();
                            layer.alert("删除成功",function (index){
                                layer.close(index);
                            })
                        }else{
                            layer.alert('删除数据错误，错误原因'+ returnData.Msg,{title : '错误',icon : 2});
                        }
                    })
                })
                e.stopPropagation()

            }else if(ele.is('span[name="user"]')){
                layer.open({
                    type: 2,
                    title: "设置角色权限",
                    shade: 0.8,
                    area: ["550px", "400px"],
                    content: './roladminlimit.html?roleId='+item.roleId+"&tableId="+item.tableId ,
                    end:function (){
                        index_model.getData()
                    }
                })
            }
        })
        index_model.getData();
    };

    //添加/修改角色
    var BColumnAdd=function (){
        var roleId= utool.search.getSearch("roleId");
        var tableId= utool.search.getSearch("tableId");

        var add_model = new Vue({
            el : '#pageinit',
            data : {
                isShow:true,
                tableId:"",
                roleId:"",
                bcolumnId:[],
                lroles:[],
                listColum:[],
                listColum1:[],
                listColum2:[],
                styleObject: false,
            },
            watch: {
                tableIdSelect: function(val) {
                    if(val == 1){
                        this.listColum = this.listColum1
                    }else if(val == 2){
                        this.listColum = this.listColum2
                    }
                }
            },
            methods : {
                noRed:function (roleId){
                    $("#" + roleId) .removeClass("err-input");
                },
                asd:function(){
                    var bcolumnIds = []
                    //this.post.forEach(function(item,index){
                    //    if(item.checked){
                    //        bcolumnId=item.value+","
                    //    }
                    //})
                    //return bcolumnId
                    if(add_model.listColum && add_model.listColum.length > 0){
                        for(var i =0;i<add_model.listColum.length;i++){
                            if(add_model.listColum[i].checked) {
                                bcolumnIds.push(add_model.listColum[i].columnId)
                            }
                        }
                    }
                    return bcolumnIds
                },
                submit:function (){
                    if(this.roleName == ""){
                        $("#roleName").addClass("err-input");
                        return
                    }
                    if(roleId && roleId>0){
                        var postData = {
                            roleId :roleId,
                            listColumIds:this.asd(),
                            tableId:tableId
                        }
                        var url = config.path + "bcolumrole/update";
                        var str = "修改成功";
                    }else{
                        var postData = {
                            roleId:$("#role option:selected").val(),
                            tableId:this.tableId,
                            listColumIds:this.asd()
                        }
                        var url = config.path + "bcolumrole/add";
                        var str = "添加成功";
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
                //add_model.sels = this.data.sels;
                var data={}
                utool.ajax.ajaxRequest("POST",config.path+"bcolumrole/select",data,"json").done(function (returnData){
                    returnData = JSON.parse(returnData);
                    if(returnData.Code==200){
                        add_model.roleId = returnData.Data.roleId;
                        add_model.tableId = returnData.Data.tableId;
                        add_model.lroles = returnData.Data.lroles;
                        //add_model.listColum = returnData.Data.list1;
                        add_model.listColum1 = returnData.Data.list1;
                        add_model.listColum2 = returnData.Data.list2;
                        add_model.$nextTick(function() {
                            $('#role').chosen().change(function(tar, val) {
                                add_model.rolesId=val.selected;
                            });
                        })
                        if(roleId && roleId>0){
                            console.info("roleId:"+roleId)
                            console.info("tableId:"+tableId)
                            //$("#tableIdSelect").get(0).selectedIndex = 1;
                            if(tableId ==1){
                                add_model.listColum = add_model.listColum1
                            }else{
                                add_model.listColum = add_model.listColum2
                            }
                            console.info(add_model.listColum)
                        }
                    }
                })
                if(roleId && roleId>0){
                    this.$set('isShow',false)
                    $("#tableIdSelect").get(0).selectedIndex = 1;
                    this.$set('styleObject',true)
                }
            }
        });
    };


    BaseJs.BColumnMannger=BColumnMannger;

    BaseJs.BColumnAdd=BColumnAdd;



})()