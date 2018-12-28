/**
 * Created by Administrator on 2016/7/12.
 */
config.menukey = 'BaseJs';

var BaseJs = {};

(function(){


    var RightList = function(){
        var mmg=null;
        var cols =  [

            {
                title: '编号',
                name: 'rightsId',
                sortable:true,
                width: 50,
            },
            {
                title: '权限名称',
                name: 'title',
                sortable:true,
                width: 50,
            },
            {
                title: '标识',
                name: 'verify',
                width: 60
            },
            {
                title: '添加日期',
                name: 'createTime',
                width: 60
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
                title:"",


            },
            methods : {
                //获取初始信息，并绑定列表单个编辑函数
                getData : function(){
                    var data = {
                        page : this.page,
                        limit : this.limit,
                        sortDirection:this.sortDirection,
                        sortExpression:this.sortExpression,
                        title:this.title,

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
                        content: './rightadd.html',
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
            url:config.path+"right/list",
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
                    content: './rightadd.html?rightsId='+item.rightsId,
                    end:function (){
                        index_model.getData()
                    }
                });
            }else if (ele.is('span[name="delete"]')) {
                layer.confirm("确认删除此条信息?", {title: "提示"}, function () {

                    utool.ajax.ajaxRequest("POST", config.path + "right/delete?rightsId="+item.rightsId,{}, "json").done(function (returnData) {
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
    var RightAdd=function (){

        var rightsId= utool.search.getSearch("rightsId");
        var add_model = new Vue({
            el : '#pageinit',
            data : {
                rightsId:rightsId,
                title:'',
                verify:'',
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
                    if(this.title == ""){
                        $("#title").addClass("err-input");
                        return
                    }
                    if(this.verify == ""){
                        $("#verify").addClass("err-input");
                        return
                    }


                    if(rightsId && rightsId>0){
                        var postData = {
                            rightsId:rightsId,
                            title:this.title,
                            verify:this.verify,
                            remark:this.remark,
                        }
                        var url = config.path + "right/update";
                        var str = "修改项目成功";
                    }else{
                        var postData = {
                            title:this.title,
                            verify:this.verify,
                            remark:this.remark,
                        }
                        var url = config.path + "right/add";
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
                if(rightsId&&rightsId>0){
                    utool.ajax.ajaxRequest("POST", config.path + "right/get?rightsId="+rightsId, {}, "json").done(function (returnData) {
                        returnData = JSON.parse(returnData);
                        if (returnData.code == 200) {
                            add_model.title= returnData.data.title;
                            add_model.verify= returnData.data.verify;
                            add_model.remark= returnData.data.remark;

                        }
                    })
                }

            }
        });
    };


/*
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



                   /!* utool.ajax.ajaxRequest("POST",url,obj,"json").done(function (returnData){
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
                    })*!/
                }
            },
            created:function (){


            }
        });
    };
*/

    BaseJs.RightList=RightList;

    BaseJs.RightAdd=RightAdd;
    //BaseJs.ProjecFileUpload=ProjecFileUpload;




})()