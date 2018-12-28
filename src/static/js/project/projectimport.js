/**
 * Created by Administrator on 2016/7/12.
 */
config.menukey = 'BaseJs';

var BaseJs = {};

(function(){

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
                   var url=config.path + "projectimport/readproject";
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

    BaseJs.ProjecFileUpload=ProjecFileUpload;




})()