/**
 * Created by Administrator on 2016/7/12.
 */
config.menukey = 'BaseJs';

var BaseJs = {};

(function(){


    var ReportView = function(){
     /*   var sharesCode= utool.search.getSearch("sharesCode");
        var sharesCodes= utool.search.getSearch("sharesCodes");*/
        var sharesCodeArr= utool.search.getSearch("sharesCode").split(",");

        var index_model = new Vue({
            el : '#pageinit',
            data : {
                //Rights:resultData.Rights,
                Ydata:"",
                XData:"",
                Title:"",
                titleList:[],

            },
            methods : {

                getData: function () {
                   /* var sharesCodeArr= new Array;
                    if(sharesCode&&sharesCode!=''){
                        sharesCodeArr.push(sharesCode)
                    }*/

                    //sharesCodeArr.push(sharesCode)
                    /*sharesCodeArr.push('601088')
                    sharesCodeArr.push('000338')
                    sharesCodeArr.push('002078')*/

                    postData ={titleList:sharesCodeArr,startTime:this.startTime,endTime:this.endTime}
                    utool.ajax.ajaxRequest("POST", config.path+"/report/list", postData, "json").done(function (returnData) {
                        // returnData = JSON.parse(returnData);
                        index_model.XData = returnData.data.dateList;
                        index_model.Ydata = returnData.data.dataList
                        index_model.Title = returnData.data.titleList


                        //获取图容器 并 初始化echarts实例
                        var myChartBar = echarts.init(document.getElementById('Bar'));
                        //var myChartBar = echarts.init(document.getElementById('Bar'),'macarons');

                        //图配置

                        optionBar = {
                            title: {
                                text: '折线图堆叠'
                            },
                            tooltip: {
                                trigger: 'axis'
                            },
                            legend: {
                                data:index_model.Title
                            },
                            grid: {
                                left: '3%',
                                right: '4%',
                                bottom: '3%',
                                containLabel: true
                            },
                            toolbox: {
                                feature: {
                                    saveAsImage: {}
                                }
                            },
                            xAxis: {
                                type: 'category',
                                boundaryGap: false,
                                data: index_model.XData

                        },
                            yAxis: {
                                type: 'value'
                            },
                            series: index_model.Ydata

                        };


                        myChartBar.setOption(optionBar);

                    })
                },

                submit: function () {
                    index_model.getData();
                }





            },
            created:function (){
                var firstDay =  moment().startOf('month').format('YYYY-MM-DD');
                var lastDay = moment().endOf('month').format('YYYY-MM-DD');
                this.startTime = firstDay;
                this.endTime = lastDay;
                this.time = firstDay+' 至 '+lastDay;
                new pickerDateRange('time', {
                    autoApply: true,
                    defaultText: ' 至 ',
                    isSingleDay: false,
                    stopToday: false,
                    calendars: 2,
                    shortbtn:true,//是否显示快捷操作
                    startDate:firstDay, //默认开始时间
                    endDate: lastDay,	//默认结束时间
                    inputTrigger: 'dateRange',
                    success: function(obj) { //选择日期后的回调函数
                        index_model.startTime = obj.startDate;
                        index_model.endTime = obj.endDate;
                    },
                })
            },
            ready:function () {
                 this.getData();

            }
        });


    };

    BaseJs.ReportView=ReportView;



})()