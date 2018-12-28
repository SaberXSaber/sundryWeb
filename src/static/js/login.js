/**
 * Created by admin on 2017/7/31.
 */

$(function (){
     var  logSign = utool.search.getSearch("sign")?utool.search.getSearch("sign"):utool.searchUrl.getSearch("sign");
     if(logSign){
         var data = {
             Sign:logSign
         }
         utool.ajax.ajaxRequest("POST",config.path + "signLogin",data,"json").done(function (returnData){
             returnData = JSON.parse(returnData);
             if(returnData.code==200){
                 window.location.href = "index.html";
             }else {
                 if(returnData.msg){
                     layer.alert(returnData.Msg)
                 }else{
                     layer.alert("登陆异常！")
                 }
             }
         })
     }
    //验证码
    $("#imgVerifyCode").attr("src", config.path + 'checkcode/code?r=' + (+new Date()));

    $("#imgVerifyCode").on("click", function () {

        $(this).attr("src", config.path + 'checkcode/code?r=' + (+new Date()));

    });

    $("#btn").click(loginFn)

    $(document).on("keypress", function (event) {

        if (event.keyCode == 13) {

            loginFn()

        }
    })

    function loginFn(){
        var loginName = $("#loginName").val();
        var password = $("#password").val();
        var vertity = $("#vertity").val();

        if(loginName == ""){
            layer.alert("请输入用户名");
            return;
        }

        if(password == ""){
            layer.alert("请输入密码");
            return;
        }

      /*  if(vertity == "" ){
            layer.alert("请输入验证码");
            return;
        }*/

        var data = {
            loginName:loginName,
            //loginPWD  :$.md5($.md5(loginName) + password),
            password  :password,
            // vertCode:vertity

        }
        layer.load(0, {shade: [0.1, '#FFF']});
        utool.ajax.ajaxRequest("POST",config.path + "login",data,"json").done(function (returnData){
            if(returnData.code==200){
                window.localStorage.setItem(token, returnData.data)
                window.location.href = "index.html";
            }/*else if(returnData.code == 202){
                layer.alert("验证码输入错误，请重新输入",{
                    shade: [0.1, '#FFF']
                },function (){
                    layer.closeAll()
                    $("#imgVerifyCode").attr("src", config.path + 'checkcode/code?r=' + (+new Date()));
                    $("#vertity").val("")
                    return
                })
            }*/else {
                layer.closeAll()
                if(returnData.msg){
                    layer.alert(returnData.msg,{
                        shade: [0.1, '#FFF']
                    })
                }else{
                    layer.alert("登陆异常！",{
                        shade: [0.1, '#FFF']
                    })
                }
            }
        })
    }

})



