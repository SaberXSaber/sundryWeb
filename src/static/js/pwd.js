/**
 * Created by Administrator on 2016/7/12.
 */
config.menukey = 'BaseJs';

var BaseJs = {};

(function(){
	//锁屏处理
	var locksureManage=function (){

        var index_module = new Vue({
            el:"#pageinit",
            data:{
                OldPwd:"",
                NewPwd:"",
                Pwd:""
            },
            methods:{
                submit:function () {
                	/*if(!this.OldPwd){
                		layer.msg("请输入原密码！");
                		return
					}*/
                    if(!this.NewPwd){
                        layer.msg("请输入新密码！");
                        return
                    }
                    if(!this.Pwd){
                        layer.msg("请输入确认密码！");
                        return
                    }
                    if(this.NewPwd != this.Pwd){
                        layer.msg("密码数据不一致！");
                        return
                    }

                    var  newPwd =index_module.Pwd
                    utool.ajax.ajaxRequest('POST', config.path + 'updatePwd', {loginPWD: newPwd}, 'json').done(function (returnedData) {
                        returnedData = JSON.parse(returnedData);
                        if (returnedData.code == 200) {
                            layer.alert("修改成功！");
                            parent.layer.closeAll();
                        } else {
                            layer.alert("修改失败！");
                        }
                    })

                    /*utool.ajax.ajaxRequest("POST",config.path + "getlogin",{Pwd:""},"json").done(function (returnData){
                        returnData = JSON.parse(returnData);
                        if(returnData.code==200){debugger
                            var loginName = returnData.LogName;
                            var LogPwd = returnData.LogPwd
                            var lastPwd = $.md5($.md5(loginName) + index_module.OldPwd)
                            if(lastPwd != LogPwd){
                                layer.msg("原密码有误！");
                                return
                            }else{
                                var  newPwd =index_module.Pwd
                                utool.ajax.ajaxRequest('POST', config.path + 'updatePwd', {Pwd: newPwd}, 'json').done(function (returnedData) {
                                    returnedData = JSON.parse(returnedData);
                                    if (returnedData.code == 200) {
                                        layer.alert("修改成功！");
                                        parent.layer.closeAll();
                                    } else {
                                        layer.alert("修改失败！");
                                    }
                                })
                            }
                        }else{
                            layer.msg("有异常！")
                        }
                    })*/
                },
                return:function () {
                   parent.layer.closeAll()
                }
            },
            created:function (){
                setTimeout(function () {
                    index_module.LoginName = ""
                    index_module.Pwd = ""
                },1000)
            }
        })
	};

	BaseJs.locksureManage=locksureManage;

})()