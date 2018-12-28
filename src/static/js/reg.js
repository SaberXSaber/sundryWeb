/**
 * Created by admin on 2017/7/31.
 */

config.menukey = 'BaseJs';

var BaseJs = {};

$(function (){

    //用户注册
    var regManager=function (){

        var id= utool.search.getSearch("id");

        var add_model = new Vue({
            el : '#pageinit',
            data : {
                LoginName :"",
                Pwd:"",
                PwdSure:"",
                ParentId:"",
                ParentNames:[],
                OName:"",
                Email:"",
                Phone:"",
                QQ:"",
                Sex:"",
                sexArr:[
                    {name:"男",id:"1"},
                    {name:"女",id:"-1"}
                ]
            },
            methods : {
                noRed:function (id){
                    $("#" + id) .removeClass("err-input");
                },
                getId:function (name){
                    add_model[name] = $("#"+name).attr("data-id") || "";
                },
                submit:function (){debugger
                    if(!this.LoginName){
                        // $("#LoginName").attr("style","border-color: red;");
                        layer.msg("请输入登陆名！");
                        return
                    }

                    if(!this.Pwd){
                        // $("#Pwd").attr("style","border-color: red;");
                        layer.msg("请输入密码！");
                        return
                    }
                    if(!this.PwdSure){
                        // $("#PwdSure").attr("style","border-color: red;");
                        layer.msg("请确认密码！");
                        return
                    }
                    if(this.PwdSure != this.Pwd){
                        layer.msg("密码输入不一致！");
                        return
                    }
                    if(!this.ParentId){
                        // $("#ParentId>a").attr("style","border-color: red;");
                        layer.msg("请选择上级！");
                        return
                    }

                    if(!this.OName){
                        // $("#OName").attr("style","border-color: red;");
                        layer.msg("请输入姓名！");
                        return
                    }

                    if(!this.Email){
                        // $("#Email").attr("style","border-color: red;");
                        layer.msg("请输入邮箱！");
                        return
                    }

                    if(!this.Phone){
                        // $("#Phone").attr("style","border-color: red;");
                        layer.msg("请输入电话！");
                        return
                    }

                    if(!this.QQ){
                        // $("#QQ").attr("style","border-color: red;");
                        layer.msg("请输入QQ！");
                        return
                    }
                    if(!this.Sex){
                        // $("#Sex>a").attr("style","border-color: red;");
                        layer.msg("请选择性别！");
                        return
                    }




                    var postData = {
                        LoginName :this.LoginName,
                        Pwd:$.md5($.md5(this.LoginName) + this.Pwd),
                        PwdSure:this.PwdSure,
                        ParentId:this.ParentId,
                        OName:this.OName,
                        Email:this.Email,
                        Phone:this.Phone,
                        QQ:this.QQ,
                        Sex:this.Sex
                        }
                    var url = config.path + "buser/reg";
                    var str = "注册成功";
                    layer.load(0, {shade: false});
                    utool.ajax.ajaxRequest("POST",url,postData,"json").done(function (returnData){
                        returnData = JSON.parse(returnData);
                        layer.closeAll()
                        if(returnData.Code==200){
                            layer.alert(str,function (){
                                parent.layer.closeAll();
                                window.location.href = "login.html"
                            })
                        }else{
                            layer.alert('注册失败,'+ returnData.Msg,{title : '错误',icon : 2});
                        }
                    })
                }
            },
            created:function (){
                var initData = {
                    page:1,
                    limit:10000,
                    PageId:1212
                }
                utool.ajax.ajaxRequest("POST",config.path+"buser/list",initData,"json").done(function (returnData){
                    returnData = JSON.parse(returnData);
                    if(returnData.Code==200){
                        add_model.ParentNames = returnData.Data;
                        //初始化拉下列表
                        add_model.$nextTick(function (){
                            $('#Sex').chosen().change(function(tar, val) {
                                add_model.Sex=val.selected;
                            });
                            $('#ParentId').chosen().change(function(tar, val) {
                                add_model.ParentId=val.selected;
                            });
                        })
                    }
                })
            }
        });
    };

    BaseJs.regManager=regManager;
})



