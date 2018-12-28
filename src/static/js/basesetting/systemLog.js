/**
 * Created by Administrator on 2016/7/12.
 */
config.menukey = 'BaseJs';

var BaseJs = {};

(function(){


    var SystemLogList = function(){
        var mmg=null;
        var cols =  [

            {
                title: '操作人',
                name: 'operator',
                sortable:true,
                width: 50,
            },
            {
                title: '操作类型',
                name: 'operatorType',
                sortable:true,
                width: 50,
                renderer: function (val) {
                    switch(val) {
                        case 0:return '删除';break;
                        case 1:return '新增';break;
                        case 2:return '编辑';break;
                        case 3:return '锁定';break;
                        case 4:return '导入';break;
                        case 5:return '解锁';break;
                        case 6:return '分配权限';break;
                        default :return '';break;

                    }

                }
            },
            {
                title: '操作内容',
                name: 'operatorContent',
                width: 200
            },
            {
                title: '操作日期',
                name: 'operatorTime',
                width: 60
            },

        ];



        var index_model = new Vue({
            el : '#pageinit',
            data : {
                //Rights:resultData.Rights,
                page : 1,
                limit : 25,
                sortDirection:'',
                sortExpression:'',
                operator:"",
                operatorContent:"",

            },
            methods : {
                //获取初始信息，并绑定列表单个编辑函数
                getData : function(){
                    var data = {
                        page : this.page,
                        limit : this.limit,
                        sortDirection:this.sortDirection,
                        sortExpression:this.sortExpression,
                        operator:this.operator,
                        operatorContent:this.operatorContent,

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
                    this.title= "";
                    this.operator= "";
                    this.operatorContent= "";
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
            url:config.path+"systemlog/list",
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
                    title: "添加公司信息",
                    shade: 0.8,
                    area: ["760px", "500px"],
                    content: './projectadd.html?infoId='+item.infoId+"&curState="+item.curState,
                    end:function (){
                        index_model.getData()
                    }
                });
            }else if (ele.is('span[name="delete"]')) {
                layer.confirm("确认删除此条信息?", {title: "提示"}, function () {

                    utool.ajax.ajaxRequest("POST", config.path + "projectview/delete?infoId="+item.infoId,{}, "json").done(function (returnData) {
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

        index_model.getData();
    };

    //添加/修改用户
    var ProjectViewAdd=function (){

        var infoId= utool.search.getSearch("infoId");
        var curState= decodeURI(utool.search.getSearch("curState"));
        var add_model = new Vue({
            el : '#pageinit',
            data : {
                InfoId:infoId,
                ProjectName:'',
                ProjectCode:'',
                InfoType:'',
                ProjectType:'',
                ProjectType2:'',
                Price:'',
                IsShow:'',
                State:'',
                Remark:'',
                CurState:curState,
                DataCycle:'',
                PayMoneyCycle:'',
                AdvertisingRequirements:'',
                ProjectSource:'',

                ProjectTypeArr:[],
                ProjectTypeOneArr:[],
            },
            methods : {
                chose: function (parentName) {
                    utool.ajax.ajaxRequest("POST", config.path + "projectview/projectTypeStr?parentName=" + parentName, {}, "json").done(function (returnedData) {
                        returnedData = JSON.parse(returnedData);
                        $('#ProjectType2').trigger('chosen:updated');//更新选项
                        add_model.ProjectTypeArr = returnedData.data;
                        add_model.$nextTick(function () {
                            $('#ProjectType2').trigger('chosen:updated');//更新选项
                            $('#ProjectType2').chosen().change(function (tar, val) {
                                add_model.ProjectType2 = val.selected;
                                //$('#ProjectType2').trigger('chosen:updated');//更新选项
                            });
                        })
                    })
                },
                noRed:function (id){
                    $("#" + id) .removeClass("err-input");
                },
                getId:function (name){
                    add_model[name] = $("#"+name).attr("data-id") || "";
                },
                onMouseOut:function(val){
                    var pco = this.ProjectCode;
                    if(pco != null &&pco !=''&& (add_model.InfoId==''||add_model.InfoId==null)){
                        //$('#ProjectType').trigger('chosen:updated');//更新选项
                        //$('#ProjectType2').trigger('chosen:updated');//更新选项
                        utool.ajax.ajaxRequest("POST", config.path + "projectApply/getprojectbyprojectcode?projectCode=" + pco, {}, "json").done(function (returnData) {
                            returnData = JSON.parse(returnData);
                            if (returnData.code == 200) {

                                if(returnData.data == null||returnData.data == ''){
                                    layer.alert('项目不存在',{title : '错误',icon : 2});
                                    return
                                }
                                add_model.ProjectName=returnData.data.projectName;
                                add_model.InfoType=returnData.data.infoType;
                                add_model.Price=returnData.data.projectPrices;
                                add_model.chose(add_model.ProjectType);
                                add_model.ProjectType=returnData.data.projectType;
                                add_model.ProjectType2=returnData.data.projectType2;

                                add_model.DataCycle=returnData.data.dataCycle;
                                add_model.PayMoneyCycle=returnData.data.payMoneyCycle;
                                add_model.AdvertisingRequirements=returnData.data.advertisingRequirements;
                                add_model.ProjectSource=returnData.data.projectSource;

                                console.info( "add_model.ProjectType："+add_model.ProjectType)
                                console.info( "add_model.ProjectType2："+add_model.ProjectType2)
                                var parentName = ''
                                utool.ajax.ajaxRequest("POST", config.path + "projectview/projectTypeStr?parentName=" + parentName, {}, "json").done(function (returnData) {
                                    returnData = JSON.parse(returnData);
                                    $('#ProjectType').trigger('chosen:updated');//更新选项
                                    if (returnData.code == 200) {
                                        add_model.ProjectTypeOneArr = returnData.data;
                                        add_model.$nextTick(function () {
                                            $('#ProjectType').chosen().change(function (tar, val) {
                                                add_model.ProjectType = val.selected;
                                                add_model.chose(val.selected);
                                            });
                                        })
                                    }
                                    add_model.chose(add_model.ProjectType);
                                })
                            }
                        })
                    }
                },
                submit:function (){
                    if(this.ProjectCode == ""){
                        $("#ProjectCode").addClass("err-input");
                        return
                    }
                    if(this.InfoType == ""){
                        $("#InfoType").addClass("err-input");
                        return
                    }
                    if(this.ProjectName == ""){
                        $("#ProjectName").addClass("err-input");
                        return
                    }
                    if(this.Price == ""){
                        $("#Price").addClass("err-input");
                        return
                    }

                    if(this.DataCycle == ""){
                        $("#DataCycle").addClass("err-input");
                        return
                    }
                    if(this.PayMoneyCycle == ""){
                        $("#PayMoneyCycle").addClass("err-input");
                        return
                    }
                    if(this.AdvertisingRequirements == ""){
                        $("#AdvertisingRequirements").addClass("err-input");
                        return
                    }
                    if(this.ProjectSource == ""){
                        $("#ProjectSource").addClass("err-input");
                        return
                    }

                    if(this.ProjectType == ""){
                        layer.msg("请选择项目类型1");
                        return
                    }

                    if(this.ProjectType2 == ""){
                        layer.msg("请选择项目类型2");
                        return
                    }

                    if(this.IsShow == null){
                        console.info(this.IsShow == null)
                        return
                    }

                    if(infoId && infoId>0){
                        var postData = {
                            InfoId:infoId,
                            ProjectName:this.ProjectName,
                            ProjectCode:this.ProjectCode,
                            InfoType:this.InfoType,
                            ProjectType:this.ProjectType,
                            ProjectType2:this.ProjectType2,
                            Price:this.Price,
                            IsShow:this.IsShow,
                            State:this.State,
                            Remark:this.Remark,

                            DataCycle:this.DataCycle,
                            PayMoneyCycle:this.PayMoneyCycle,
                            AdvertisingRequirements:this.AdvertisingRequirements,
                            ProjectSource:this.ProjectSource,
                        }
                        var url = config.path + "projectview/update";
                        var str = "修改项目成功";
                    }else{
                        var postData = {
                            ProjectName:this.ProjectName,
                            ProjectCode:this.ProjectCode,
                            InfoType:this.InfoType,
                            ProjectType:this.ProjectType,
                            ProjectType2:this.ProjectType2,
                            Price:this.Price,
                            IsShow:this.IsShow,
                            State:this.State,
                            Remark:this.Remark,

                            DataCycle:this.DataCycle,
                            PayMoneyCycle:this.PayMoneyCycle,
                            AdvertisingRequirements:this.AdvertisingRequirements,
                            ProjectSource:this.ProjectSource,
                        }
                        var url = config.path + "projectview/add";
                        var str = "添加项目成功";

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

                if(infoId && infoId>0){

                    utool.ajax.ajaxRequest("POST", config.path + "projectview/get?infoId="+infoId, {}, "json").done(function (returnData) {
                        returnData = JSON.parse(returnData);
                        if (returnData.code == 200) {
                            add_model.ProjectName=returnData.data.projectName;
                            add_model.ProjectCode=returnData.data.projectCode;
                            add_model.InfoType=returnData.data.infoType;
                            add_model.ProjectType=returnData.data.projectType;
                            add_model.ProjectType2=returnData.data.projectType2;
                            add_model.Price=returnData.data.price;
                            add_model.IsShow=returnData.data.isShow;
                            add_model.State=returnData.data.state;
                            add_model.Remark=returnData.data.remark;

                            add_model.DataCycle=returnData.data.dataCycle;
                            add_model.PayMoneyCycle=returnData.data.payMoneyCycle;
                            add_model.AdvertisingRequirements=returnData.data.advertisingRequirements;
                            add_model.ProjectSource=returnData.data.projectSource;

                            var parentName = ''
                            utool.ajax.ajaxRequest("POST", config.path + "projectview/projectTypeStr?parentName=" + parentName, {}, "json").done(function (returnData) {
                                returnData = JSON.parse(returnData);
                                if (returnData.code == 200) {
                                    add_model.ProjectTypeOneArr = returnData.data;
                                    add_model.$nextTick(function () {
                                        $('#ProjectType').chosen().change(function (tar, val) {
                                            add_model.ProjectType = val.selected;
                                            add_model.chose(val.selected);
                                        });
                                    })
                                }
                                add_model.chose(add_model.ProjectType);
                            })
                        }
                    })

                }else{
                    var parentName = ''
                    utool.ajax.ajaxRequest("POST", config.path + "projectview/projectTypeStr?parentName=" + parentName, {}, "json").done(function (returnData) {
                        returnData = JSON.parse(returnData);
                        if (returnData.code == 200) {
                            add_model.ProjectTypeOneArr = returnData.data;
                            add_model.$nextTick(function () {
                                $('#ProjectType').chosen().change(function (tar, val) {
                                    add_model.ProjectType = val.selected;
                                    add_model.chose(val.selected);
                                });
                            })
                        }
                        add_model.chose(-1);

                    })


                }
            }
        });
    };


    var ProjecFileUpload=function (){
        var add_model = new Vue({
            el : '#pageinit',
            data : {

            },
            methods : {
                onFileChange:function(e) {
                    var files = e.target.files || e.dataTransfer.files;
                    if (!files.length)
                        return;
                    this.createImage(files);
                },
                createImage:function(file) {
                    if(typeof FileReader==='undefined'){
                        alert('您的浏览器不支持上传，请升级您的浏览器');
                        return false;
                    }
                    var image = new Image();
                    var vm = this;
                    var leng=file.length;
                    for(var i=0;i<leng;i++){
                        var reader = new FileReader();
                        reader.readAsDataURL(file[i]);
                        reader.onload =function(e){
                            //vm.images.push(e.target.result);
                            vm.image = e.target.result;
                        };
                    }
                },
                submit:function (event){
                   var url=config.path + "projectview/readproject";
                    var obj = {};
                    obj.images=this.images

                    var formData = new FormData(event.target);



                   /* utool.ajax.ajaxRequest("POST",url,obj,"json").done(function (returnData){
                        returnData = JSON.parse(returnData);
                        layer.closeAll()
                        if(returnData.code==200){
                            layer.alert(str,function (){
                                parent.layer.closeAll();
                            })
                            parent.location.reload();
                        }else{
                            layer.alert('上传失败'+ returnData.Msg,{title : '错误',icon : 2});
                        }
                    })*/
                }
            },
            created:function (){


            }
        });
    };

    BaseJs.SystemLogList=SystemLogList;

    BaseJs.ProjectViewAdd=ProjectViewAdd;
    BaseJs.ProjecFileUpload=ProjecFileUpload;




})()