/**
 * Created by admin on 2017/7/31.
 */

$(function (){

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

        if(vertity == "" ){
            layer.alert("请输入验证码");
            return;
        }

        var data = {
            LoginName:loginName,
            Pwd  :$.md5($.md5(loginName) + password),
            VertCode:vertity

        }

        utool.ajax.ajaxRequest("POST",config.path + "loginmethod",data,"json").done(function (returnData){
            returnData = JSON.parse(returnData);
            if(returnData.code==200){
                window.location.href = "../../index.html";
            }else if(returnData.code == 202){
                layer.alert("验证码输入错误，请重新输入",function (){
                    layer.closeAll()
                    $("#imgVerifyCode").attr("src", config.path + 'checkcode/code?r=' + (+new Date()));
                    $("#vertity").val("")
                    return
                })
            }
        })
    }
})



