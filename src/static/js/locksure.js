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
                UserName:"",
                demoList:[],
                LoginName:"",
                Pwd:""
            },
            methods:{
                submit:function () {
                	if(!this.LoginName){
                		layer.msg("请输入用户名！");
                		return
					}
                    if(!this.Pwd){
                        layer.msg("请输入密码！");
                        return
                    }
                    var data = {
                        loginName:this.LoginName,
                        loginPWD  :this.Pwd,

                    }
                    utool.ajax.ajaxRequest("POST",config.path + "loginmethod",data,"json").done(function (returnData){
                        returnData = JSON.parse(returnData);
                        if(returnData.code==200){
                           if(returnData.data == 200){
                           		parent.layer.closeAll()
						   }else{
                           	   layer.alert("密码错误！");
						   }
                        }
                    })
                },
                return:function () {
                    utool.ajax.ajaxRequest('POST', config.path + 'logout', {UserId: 0}, 'json').done(function (returnedData) {
                        returnedData = JSON.parse(returnedData);
                        if (returnedData.Code == 200) {
                            parent.location.replace("../login.html");
                        } else {
                            parent.location.replace("../login.html");
                        }
                    })
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