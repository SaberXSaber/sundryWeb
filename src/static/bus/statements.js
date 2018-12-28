/**
 * Created by Administrator on 2016/7/12.
 */
config.menukey = 'BaseJs';

var BaseJs = {};

(function(){

	//公司管理
    var ComMannger = function(resultData){
    	//console.info(resultData)
	    var mmg=null;

		var cols =  [
			{
				title: 'Id',
				name: 'id',
				sortable:true,
				hidden:true
			},
			{
				title: '公司名称',
				name: 'companyName',
				width: 150
			},
			{
				title: '公司缩写简称',
				name: 'abbreviation',
				width: 150
			},
			{
				title: '备注',
				name: 'remark'
			}
		];

		if(resultData.Rights.delete || resultData.Rights.update){
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
						html += "<a title='删除' class='render_a' > <span name='delete' class='glyphicon glyphicon-remove' aria-hidden='true'></span></a>"
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
				CompanyName:""
			},
			methods : {
				//获取初始信息，并绑定列表单个编辑函数
				getData : function(){
					var data = {
						page : this.page,
						limit : this.limit,
						CompanyName : this.CompanyName,
						sortDirection:this.sortDirection,
						sortExpression:this.sortExpression
					}
					mmg.load(data);
				},
				addInfo:function () {
					var _this=this;
					layer.open({
						type: 2,
						title: "添加公司信息",
						shade: 0.8,
						area: ["400px", '280px'],
						content: './comadminadd.html',
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
					this.CompanyName = "";
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
			url:config.path+"bcompany/list",
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
					area: ["400px", '280px'],
					content: './comadminadd.html?id='+item.id,
					end:function (){
						index_model.getData()
					}
				});
			}else if(ele.is('span[name="delete"]')){
				layer.confirm("确认删除此条信息?",{title:"提示"},function () {
					var reqPara = {
						Id: item.id
					};
					utool.ajax.ajaxRequest("POST", config.path + "bcompany/delete", reqPara, "json").done(function (returnData) {
						returnData = JSON.parse(returnData);
						if (returnData.Code == 200) {
							index_model.getData();
							layer.alert("删除成功", function (index) {
								layer.close(index);
							})
						} else {
							layer.alert('获取数据错误，错误原因' + returnData.Msg, {title: '错误', icon: 2});
						}

					})
				})
				e.stopPropagation()
			}
		})
		index_model.getData();
	};

	//添加/修改公司
	var ComManngerAdd=function (){

		var id= utool.search.getSearch("id");

		var add_model = new Vue({
			el : '#pageinit',
			data : {
				CompanyName:"",
				Abbreviation:"",
				Remark:"",
			},
			methods : {
				noRed:function (id){
					$("#" + id) .removeClass("err-input");
				},
				submit:function (){
					if(this.CompanyName == ""){
						$("#CompanyName").addClass("err-input");
						return
					}
					if(this.Abbreviation == ""){
						$("#Abbreviation").addClass("err-input");
						return
					}

					if(id){
						var postData = {
							Id:id,
							CompanyName:this.CompanyName,
							Abbreviation:this.Abbreviation,
							Remark:this.Remark
						}
						var url = config.path + "bcompany/update";
						var str = "修改公司成功";
					}else{
						var postData = {
							CompanyName:this.CompanyName,
							Abbreviation:this.Abbreviation,
							Remark:this.Remark
						}
						var url = config.path + "bcompany/add";
						var str = "添加公司成功";
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
				if(id && id>0){
					var data={
						Id:id
					}
					utool.ajax.ajaxRequest("POST",config.path+"bcompany/entity",data,"json").done(function (returnData){
						returnData = JSON.parse(returnData);
						if(returnData.Code==200){
							add_model.CompanyName = returnData.Data.companyName
							add_model.Abbreviation = returnData.Data.abbreviation
							add_model.Remark = returnData.Data.remark
						}

					})
				}
			}
		});
	};

	//部门管理
	var DepMannger = function(resultData){

		var mmg=null;

		var cols =  [
			{
				title: '部门Id',
				name: 'branchId',
				sortable:true,
				hidden:true
			},
			{
				title: '部门名称',
				name: 'title',
				width: 150
			},
			{
				title: '上级部门',
				name: 'parentName',
				width: 150
			},
			{
				title: '备注',
				name: 'remark'
			}
		]

		if(resultData.Rights.delete || resultData.Rights.update){
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
						html += "<a title='删除' class='render_a' > <span name='delete' class='glyphicon glyphicon-remove' aria-hidden='true'></span></a>"
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
				Title :""
			},
			methods : {
				//获取初始信息，并绑定列表单个编辑函数
				getData : function(){
					var data = {
						page : this.page,
						limit : this.limit,
						Title  : this.Title ,
						sortDirection:this.sortDirection,
						sortExpression:this.sortExpression
					}
					mmg.load(data);
				},
				addInfo:function () {
					var _this=this;
					layer.open({
						type: 2,
						title: "添加部门",
						shade: 0.8,
						area: ["400px", '280px'],
						content: './depadminadd.html',
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
					this.Title = "";
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
			url:config.path+"bbranch/list",
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
					title: "修改部门",
					shade: 0.8,
					area: ["400px", '280px'],
					content: './depadminadd.html?id='+item.branchId,
					end:function (){
						index_model.getData()
					}
				});
			}else if(ele.is('span[name="delete"]')){
				layer.confirm("确认删除此条信息?",{title:"提示"},function () {
					var reqPara = {
						BranchId : item.branchId
					};
					utool.ajax.ajaxRequest("POST", config.path + " bbranch/delete", reqPara, "json").done(function (returnData){
						returnData = JSON.parse(returnData);
						if(returnData.Code == 200){
							index_model.getData();
							layer.alert("删除成功",function (index){
								layer.close(index);
							})
						}else{
							layer.alert('获取数据错误，错误原因'+ returnData.Msg,{title : '错误',icon : 2});
						}
					})
				})
				e.stopPropagation()
			}
		})
		index_model.getData();
	};

	//添加/修改部门
	var DepManngerAdd=function (){

		var id= utool.search.getSearch("id");

		console.info(id)

		var add_model = new Vue({
			el : '#pageinit',
			data : {
				Title :"",
				ParentId:"",
				parentArr:[],
				Remark:"",
			},
			methods : {
				noRed:function (id){
					$("#" + id) .removeClass("err-input");
				},
				submit:function (){
					if(this.Title == ""){
						$("#Title").addClass("err-input");
						return
					}

					if(this.ParentId == ""){
						$("#parent_chosen>a").addClass("err-input");
						return
					}

					if(id){
						var postData = {
							BranchId :id,
							Title:this.Title,
							ParentId :this.ParentId,
							Remark:this.Remark
						}
						var url = config.path + "bbranch/update";
						var str = "修改部门成功";
					}else{
						var postData = {
							Title:this.Title,
							ParentId :this.ParentId,
							Remark:this.Remark
						}
						var url = config.path + "bbranch/add";
						var str = "添加部门成功";
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
				if(id && id>0){
					var data={
						BranchId:id
					}
					utool.ajax.ajaxRequest("POST",config.path+"bbranch/entity",data,"json").done(function (returnData){
						returnData = JSON.parse(returnData);
						if(returnData.Code==200){
							add_model.Title = returnData.Data.title;
							add_model.Remark = returnData.Data.remark;
							add_model.ParentId = returnData.Data.parentId;
							var initData = {
								page:1,
								limit:10000
							}
							utool.ajax.ajaxRequest("POST",config.path + "bbranch/list" , initData , "json").done(function (returnedData){
								returnedData = JSON.parse(returnedData);
								add_model.parentArr = returnedData.Data;
								add_model.$nextTick(function() {
									$('#parent').chosen().change(function(tar, val) {
										add_model.ParentId=val.selected;
									});
								})
							})
							add_model.$nextTick(function (){
								$('#parent').on('chosen:ready', function(e, params) {
									$("#parent").attr("value",returnData.Data.parentId)
									$('#parent').trigger('chosen:updated');//更新选项
								});
							})
						}
					})
				}else{
					var initData = {
						page:1,
						limit:10000
					}
					utool.ajax.ajaxRequest("POST",config.path + "bbranch/list" , initData , "json").done(function (returnedData){
						returnedData = JSON.parse(returnedData);
						add_model.parentArr = returnedData.Data;
						add_model.$nextTick(function() {
							$('#parent').chosen().change(function(tar, val) {
								$("#parent_chosen>a").removeClass("err-input");
								add_model.ParentId=val.selected;
							});
						})
					})
				}
			}
		});
	};

	//职务管理
	var PosMannger = function(resultData){
		var mmg=null;

		var cols =  [
			{
				title: '编号',
				name: 'Id',
				sortable:true,
				hidden:true
			},
			{
				title: '职务名称',
				name: 'title',
				width: 150
			},
			{
				title: '备注',
				name: 'remark'
			},
			{
				title: '创建时间',
				name: 'createTime',
				width: 150,
				renderer: function (val) {
					return utool.myOnlyDate.date(val, "yyyy-MM-dd HH:mm:ss");
				}
			}
		];

		if(resultData.Rights.delete || resultData.Rights.update){
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
						html += "<a title='删除' class='render_a' > <span name='delete' class='glyphicon glyphicon-remove' aria-hidden='true'></span></a>"
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
				Title :""
			},
			methods : {
				//获取初始信息，并绑定列表单个编辑函数
				getData : function(){
					var data = {
						page : this.page,
						limit : this.limit,
						Title : this.Title,
						sortDirection:this.sortDirection,
						sortExpression:this.sortExpression
					}
					mmg.load(data);
				},
				addInfo:function () {
					var _this=this;
					layer.open({
						type: 2,
						title: "添加公司信息",
						shade: 0.8,
						area: ["400px", '280px'],
						content: './postadminadd.html',
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
					this.Title = "";
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
			url:config.path+"bduty/list",
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
					title: "添加职务",
					shade: 0.8,
					area: ["400px", '280px'],
					content: './postadminadd.html?id='+item.id,
					end:function (){
						index_model.getData()
					}
				});
			}else if(ele.is('span[name="delete"]')){
				layer.confirm("确认删除此条信息?",{title:"提示"},function () {
					var reqPara = {
						Id:item.id
					};
					utool.ajax.ajaxRequest("POST", config.path + "bduty/delete", reqPara, "json").done(function (returnData){
						returnData = JSON.parse(returnData);
						if(returnData.Code == 200){
							index_model.getData();
							layer.alert("删除成功",function (index){
								layer.close(index);
							})
						}else{
							layer.alert('获取数据错误，错误原因'+ returnData.Msg,{title : '错误',icon : 2});
						}
					})
				})
				e.stopPropagation()
			}
		})

		index_model.getData();
	};

	//添加/修改职务
	var PosManngerAdd=function (){

		var id= utool.search.getSearch("id");

		var add_model = new Vue({
			el : '#pageinit',
			data : {
				Title :"",
				Remark:"",
			},
			methods : {
				noRed:function (id){
					$("#" + id) .removeClass("err-input");
				},
				submit:function (){

					if(this.Title == ""){
						$("#Title").addClass("err-input");
						return
					}

					if(id){
						var postData = {
							Id :id,
							Title:this.Title,
							Remark:this.Remark
						}
						var url = config.path + "bduty/update";
						var str = "修改职务成功";
					}else{
						var postData = {
							Title:this.Title,
							Remark:this.Remark
						}
						var url = config.path + "bduty/add";
						var str = "添加职务成功";
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
				if(id && id>0){
					var data={
						Id:id
					}
					utool.ajax.ajaxRequest("POST",config.path+"bduty/entity",data,"json").done(function (returnData){
						returnData = JSON.parse(returnData);
						if(returnData.Code==200){
							add_model.Title = returnData.Data.title;
							add_model.Remark = returnData.Data.remark;
						}
					})
				}
			}
		});
	};

	//权限管理
	var JurMannger = function(resultData){
		var mmg=null;
		var cols =  [
			{
				title: '排序',
				name:"Sort",
				width:50,
				sortable:true,
				lockWidth:true,
				renderer:function (val,item){
					return '<input type="text" name="sort_input" value="'+item.sort+'" data-value="'+item.jurisdictionId+'" style="height: 20px; width: 30px;">'
				}
			},
			{
				title: '编号',
				name: 'JurisdictionId',
				sortable:true,
				hidden:true
			},
			{
				title: '权限名称',
				name: 'name',
				width: 200
			},
			{
				title: '页面地址',
				name: 'url',
				width: 200
			},
			{
				title: '上级权限',
				name: 'parentName'
			},
			{
				title: '创建时间',
				name: 'createTime',
				width: 150,
				renderer: function (val) {
					return utool.myOnlyDate.date(val, "yyyy-MM-dd HH:mm:ss");
				}
			},
			{
				title: '状态',
				name: 'status',
				width: 60,
				lockWidth:true,
				renderer: function (val) {
					switch (val.toString()){
						case "0":
							return "正常"
							break;
						case "-1":
							return "无效"
							break;
					}
				}
			}
		]

		if(resultData.Rights.delete || resultData.Rights.update){
			cols.splice(0,0,{
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
						html += "<a title='删除' class='render_a' > <span name='delete' class='glyphicon glyphicon-remove' aria-hidden='true'></span></a>"
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
				sortDirection:'asc',
				sortExpression:'JurisdictionId',
				JurisdictionId :"",
				Name :"",
				parentId:"",
				parentArr:[],
				childrenId:"",
				childrenArr:[]
			},
			methods : {
				//获取初始信息，并绑定列表单个编辑函数
				getData : function(parentId){
					// parentId = parentId || this.parentId
					var data = {
						page : this.page,
						limit : this.limit,
						sortDirection:this.sortDirection,
						sortExpression:this.sortExpression,
						JurisdictionId : this.JurisdictionId,
						Name : this.Name,
						ParentId: this.parentId
					}
					mmg.load(data);
				},
				addInfo:function () {
					var _this=this;
					layer.open({
						type: 2,
						title: "添加权限",
						shade: 0.8,
						area: ["550px", '400px'],
						content: './juradminadd.html',
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
					this.JurisdictionId = "";
					this.Name = "";
					this.parentId = "";
					this.childrenId = "";
					index_model.$nextTick(function() {
						$('#parentDown').trigger('chosen:updated');//更新选项
						$('#parentUp').trigger('chosen:updated');//更新选项
					})
					this.getData()
				},
				sortFn:function (){
					alert(1)
				}
			},
			created:function (){
				var data = {
					page : 1,
					limit : 1000,
					sortDirection:'asc',
					sortExpression:'jurisdictionId',
					Level:1
				}

				//下拉联动
				utool.ajax.ajaxRequest("POST",config.path+"rights/list",data,"json").done(function (returnData){
					returnData = JSON.parse(returnData);
					if(returnData.Code==200){
						index_model.parentArr = returnData.Data;
						index_model.$nextTick(function() {
							$('#parentUp').chosen().change(function(tar, val) {
								index_model.parentId=val.selected;
								index_model.getData();
								var postData = {
									page : 1,
									limit : 1000,
									sortDirection:'asc',
									sortExpression:'jurisdictionId',
									ParentId:index_model.parentId
								}
								utool.ajax.ajaxRequest("POST",config.path+"rights/list",postData,"json").done(function (returnData){
									returnData = JSON.parse(returnData);
									if(returnData.Code==200){
										index_model.childrenArr = returnData.Data;
										index_model.childrenId = "";
										index_model.$nextTick(function() {
											$('#parentDown').trigger('chosen:updated');//更新选项
											$('#parentDown').chosen().change(function(tar, val) {
												index_model.childrenId=val.selected;
												index_model.parentId=val.selected;
												index_model.getData(index_model.childrenId);
											});
										})
									}
								})
							});
						})
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
			root: 'Data',
			url:config.path+"rights/list",
			params: {
				page : 1,
				limit : 25,
				sortDirection:'asc',
				sortExpression:'JurisdictionId'
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
					title: "编辑权限",
					shade: 0.8,
					area: ["550px", "400px"],
					content: './juradminadd.html?id='+item.jurisdictionId,
					end:function (){
						index_model.getData()
					}
				});
				e.stopPropagation();
			}
			else if(ele.is('span[name="delete"]')){
				layer.confirm("确认删除此条信息?",{title:"提示"},function () {
					var reqPara = {
						JurisdictionId:item.jurisdictionId
					};
					utool.ajax.ajaxRequest("POST", config.path + "rights/delete", reqPara, "json").done(function (returnData){
						returnData = JSON.parse(returnData);
						if(returnData.Code == 200){
							index_model.getData();
							layer.alert("删除成功",function (index){
								layer.close(index);
							})
						}else{
							layer.alert('获取数据错误，错误原因'+ returnData.Msg,{title : '错误',icon : 2});
						}
					})
				})
				e.stopPropagation();
			}
			else if(ele.is('input[name="sort_input"]')){
				e.stopPropagation();
			}

		}).on('loadSuccess', function (e, data) {
			$("#mmg input").keydown(function (e) {
				if(e.which == 13){
					var data = {
						JurisdictionId:$(this).attr("data-value"),
						Sort:$(this).val()
					}
					utool.ajax.ajaxRequest("POST",config.path + "rights/updatesort",data,"json").done(function (returnData){
						returnData = JSON.parse(returnData);
						if(returnData.Code==200){
							index_model.sortExpression = "Sort";
							index_model.getData();
						}
					})
				}
			})
		})
		index_model.getData();
	};

	//添加/修改权限
	var JurManngerAdd=function (){
		var id= utool.search.getSearch("id");
		var add_model = new Vue({
			el : '#pageinit',
			data : {
				Name:"",
				Url:"",
				ParentId:0,
				ParentName:"",
				Level:0,
				FunctionId:0,
				limitList:[]
			},
			methods : {
				noRed:function (id){
					$("#" + id) .removeClass("err-input");
				},
				getLimit:function (){
					if(id && this.Level == 0){
						layer.alert("无法选择上级目录");
						return
					}
					layer.open({
						type: 2,
						title: false,
						shade: 0.8,
						closeBtn:false,
						area: ["100%", '100%'],
						content: './juradminlimit.html',
						end:function (){
							if($("#ParentName").attr("data-id")){
								add_model.ParentId = $("#ParentName").attr("data-id").split("-")[0];
								add_model.Level = $("#ParentName").attr("data-id").split("-")[1];
							}
							utool.ajax.ajaxRequest("POST",config.path + "bf/list",{limit:1000},"json").done(function (returnData){
								returnData = JSON.parse(returnData);
								if(returnData.Code==200){
									add_model.limitList = returnData.Data;
									add_model.$nextTick(function (){
										$('#FunctionId').chosen().change(function(tar, val) {
											$("#FunctionId_chosen>a").removeClass("err-input");
											add_model.FunctionId=val.selected;
											add_model.Name = $("#FunctionId").find("option:selected").text();
										});
									})
								}else{
									layer.alert('获取数据错误，错误原因'+ retrunData.Msg,{title : '错误',icon : 2});
								}
							})
						}
					})
				},
				submit:function (){
					if(this.Level == 1){
						//选择一级菜单
						if(this.Name == ""){
							$("#Name").addClass("err-input");
							return
						}
					}else{
						//选择二级菜单	
						if(this.Name == ""){
							$("#FunctionId_chosen>a").addClass("err-input");
							return
						}
					}
					if(id && id>0){
						var postData ={
							Name:add_model.Name,
							Url:add_model.Url,
							ParentId:add_model.ParentId,
							Level:add_model.Level*1+1,
							JurisdictionId:id,
							FunctionId:add_model.FunctionId
						}
						var path = config.path + "rights/update";
						var message="修改权限成功";
					}else{
						var postData ={
							Name:add_model.Name,
							Url:add_model.Url,
							ParentId:add_model.ParentId,
							Level:add_model.Level*1+1,
							FunctionId:add_model.FunctionId
						}
						var path = config.path + "rights/add";
						var message="添加权限成功";
					}

					utool.ajax.ajaxRequest("POST",path,postData,"json").done(function (retrunData){
						retrunData = JSON.parse(retrunData);
						if(retrunData.Code==200){
							layer.alert(message,function (){
								var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
								parent.layer.close(index);
							});
						}else{
							layer.alert('获取数据错误，错误原因'+ retrunData.Msg,{title : '错误',icon : 2});
						}
					})
				}
			},
			created:function (){
				if(id && id>0){
					var data={
						JurisdictionId :id
					}
					utool.ajax.ajaxRequest("POST",config.path+"rights/entity",data,"json").done(function (returnData){
						returnData = JSON.parse(returnData);
						if(returnData.Code==200){
							add_model.Name = returnData.Data.name;
							add_model.Url = returnData.Data.url;
							add_model.ParentId = returnData.Data.parentId;
							add_model.FunctionId = returnData.Data.functionId;
							add_model.Level = returnData.Data.level*1-1;
							$("#ParentName").text(returnData.Data.parentName);
							if(add_model.Level==2){
								utool.ajax.ajaxRequest("POST",config.path + "bf/list",{limit:1000},"json").done(function (returnData){
									returnData = JSON.parse(returnData);
									if(returnData.Code==200){
										add_model.limitList = returnData.Data;
										add_model.$nextTick(function (){
											$('#FunctionId').chosen().change(function(tar, val) {
												add_model.FunctionId=val.selected;
												add_model.Name = $("#FunctionId").find("option:selected").text();
											});
										})
									}else{
										layer.alert('获取数据错误，错误原因'+ retrunData.Msg,{title : '错误',icon : 2});
									}
								})

								add_model.$nextTick(function (){
									$('#FunctionId').on('chosen:ready', function(e, params) {
										$("#FunctionId").attr("value",returnData.Data.functionId)
										$('#FunctionId').trigger('chosen:updated');//更新选项
									});
								})

							}
						}else{
							layer.alert('获取数据错误，错误原因'+ retrunData.Msg,{title : '错误',icon : 2});
						}
					})
				}
			}
		});
	};

	//添加/修改权限-子页面
	var JurManngerLimit=function (){
		var setting = {
			check: {
				enable: true,
				chkStyle: "radio",
				radioType: "level"
			},
			data: {
				simpleData: {
					enable: true
				}
			}
		};
		var add_model = new Vue({
			el : '#pageinit',
			data : {
				nodeId:"",
				nodeName:"",
				nodeLevel:""
			},
			methods : {
				submit:function (){
					var treeObj=$.fn.zTree.getZTreeObj("treeDemo"),
						nodes=treeObj.getCheckedNodes(true),
						v="";
					for(var i=0;i<nodes.length;i++){
						v+=nodes[i].name + ",";
						add_model.nodeId = nodes[i].id;
						add_model.nodeName = nodes[i].name;
						add_model.nodeLevel = nodes[i].level+1;
					}
					if(add_model.nodeId){
						parent.$("#ParentName").text(add_model.nodeName);
						parent.$("#ParentName").attr("data-id",add_model.nodeId + "-" + add_model.nodeLevel);
						var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
						parent.layer.close(index);
					}else{
						layer.alert("请选择上级权限")
					}
				},
				cancel:function (){
					var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
					parent.layer.close(index);
				}
			},
			created:function (){
				utool.ajax.ajaxRequest("POST",config.path + "broles/rightlists" ,{},"json").done(function (returnData){
					returnData = JSON.parse(returnData);
					if(returnData.Code==200){
						$.fn.zTree.init($("#treeDemo"), setting, returnData.Data);
					}
				})
			}
		});
	};

	//用户管理
	var UseMannger = function(resultData){
		var mmg=null;

		var cols =  [
			{
				title: '编号',
				name: 'id',
				sortable:true,
				hidden:true
			},
			{
				title: '用户名',
				name: 'oName',
				width: 60
			},
			{
				title: '登陆名',
				name: 'loginName',
				width: 80
			},
			{
				title: '公司',
				name: 'companyName',
				width: 100
			},
			{
				title: '部门',
				name: 'branchName',
				width: 100
			},
			{
				title: '职位',
				name: 'dutyName',
				width: 100
			},
			{
				title: '上级',
				name: 'parentName',
				width: 60
			},
			{
				title: '性别',
				name: 'sex',
				width: 40,
				renderer:function (val){
					return val? "男" : "女"
				}
			},
			{
				title: '属性',
				name: 'userTypeName',
				width: 60
			},
			{
				title: 'QQ',
				name: 'qQ',
				width: 100
			},
			{
				title: '电话',
				name: 'phone',
				width: 100
			},
			{
				title: '邮箱',
				name: 'email',
				width: 100
			},
			{
				title: '就职状态',
				name: 'isWork',
				width: 60,
				renderer:function (val){
					return val==1? "在职" : "离职"
				}
			},
			{
				title: '账号状态',
				name: 'status',
				width: 60,
				renderer:function (val){
					if(val == 0){
						return "正常"
					}else if(val ==-1){
						return "删除"
					}else if(val == 1){
						return "禁用"
					}
				}
			},
			{
				title: '添加时间',
				name: 'createTime',
				width: 150,
				renderer:function (val){
					return utool.myOnlyDate.date(val, "yyyy-MM-dd HH:mm:ss");
				}
			}
		];

		if(resultData.Rights.delete || resultData.Rights.update || resultData.Rights.qroles || resultData.Rights.uroles){
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

					if(resultData.Rights.qroles){
						html += "<a  title='角色管理' style='margin-left: 4px;' class='render_a' ><span class='glyphicon glyphicon-unchecked' aria-hidden='true' name='admin'></span></a>"
					}

					if(resultData.Rights.delete){
						html += "<a title='删除' style='margin: -4px;' class='render_a' > <span name='delete' class='glyphicon glyphicon-remove' aria-hidden='true'></span></a>"
					}

					if(resultData.Rights.update){
						html += "<a  title='切换角色' style='margin-left: 4px;' class='render_a' ><span class='glyphicon glyphicon-hourglass' aria-hidden='true' name='change'></span></a>"
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
				OName:"",
				LoginName:"",
				BranchId:"",
				BranchArr:[],
				ParentName:"",
				UserType:"",
				UserArr:[],
				IsWork:"",
				IsWorkArr:[
					{id:"1",name:"在职"},
					{id:"0",name:"离职"}
				],
				Status:0,
				StatusArr:[
					{id:"1",name:"禁止"},
					{id:"0",name:"启用"}
				],
			},
			methods : {
				//获取初始信息，并绑定列表单个编辑函数
				getData : function(){
					var data = {
						page : this.page,
						limit : this.limit,
						sortDirection:this.sortDirection,
						sortExpression:this.sortExpression,
						OName : this.OName,
						LoginName : this.LoginName,
						BranchId:this.BranchId,
						ParentName : this.ParentName,
						UserType:this.UserType,
						IsWork:this.IsWork,
						Status:this.Status
					}
					mmg.load(data);
				},

				addInfo:function () {
					var _this=this;
					layer.open({
						type: 2,
						title: "添加用户",
						shade: 0.8,
						area: ["760px", "530px"],
						content: './useadminadd.html',
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
					this.OName = "";
					this.LoginName = "";
					this.ParentName = "";
					this.BranchId = "";
					this.UserType = "";
					this.IsWork = "";
					this.Status = 0;
					//初始化部门
					index_model.$nextTick(function() {
						$('#parentUp').trigger('chosen:updated');//更新选项
						$('#parentDown').trigger('chosen:updated');//更新选项
						$('#IsWork').trigger('chosen:updated');//更新选项
						$('#Status').trigger('chosen:updated');//更新选项
					})
					this.getData()
				}
			},
			created:function (){
				//初始化部门下拉列表
				var initData = {
					page:1,
					limit:10000
				}
				utool.ajax.ajaxRequest("POST",config.path + "bbranch/list" , initData , "json").done(function (returnedData){
					returnedData = JSON.parse(returnedData);
					index_model.BranchArr = returnedData.Data;
					index_model.$nextTick(function() {
						$('#parentUp').chosen().change(function(tar, val) {
							index_model.BranchId=val.selected;
							index_model.getData();
						});
						$('#IsWork').chosen().change(function(tar, val) {
							index_model.IsWork=val.selected;
							index_model.getData();
						});
						$('#Status').chosen().change(function(tar, val) {
							index_model.Status=val.selected;
							index_model.getData();
						});
					})
				})

				//初始化属性下拉
				utool.ajax.ajaxRequest("POST",config.path + "buser/enumlist" , {enumType:619} , "json").done(function (returnedData){
					returnedData = JSON.parse(returnedData);
					index_model.UserArr = returnedData.Data;
					index_model.$nextTick(function() {
						$('#parentDown').chosen().change(function(tar, val) {
							index_model.UserType=val.selected;
							index_model.getData();
						});
					})
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
			root: 'Data',
			url:config.path+"buser/list",
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
					area: ["760px", "530px"],
					content: './useadminadd.html?id='+item.operatorId,
					end:function (){
						index_model.getData()
					}
				});
			}else if(ele.is('span[name="delete"]')){
				layer.confirm("确认删除此条信息?",{title:"提示"},function (){
					var reqPara = {
						OperatorId:item.operatorId
					};
					utool.ajax.ajaxRequest("POST", config.path + "buser/delete", reqPara, "json").done(function (returnData){
						returnData = JSON.parse(returnData);
						if(returnData.Code == 200){
							index_model.getData();
							layer.alert("删除成功",function (index){
								layer.close(index);
							})
						}else{
							layer.alert('获取数据错误，错误原因'+ returnData.Msg,{title : '错误',icon : 2});
						}
					})
				})
				e.stopPropagation()
			}else if(ele.is('span[name="admin"]')){
				layer.open({
					type: 2,
					title: "角色分配",
					shade: 0.8,
					area: ["700px", "530px"],
					content: './useadminlist.html?id='+item.operatorId,
					end:function (){
						index_model.getData()
					}
				});
			}
		})

		index_model.getData();
	};

	//添加/修改用户
	var UseManngerAdd=function (){

		var id= utool.search.getSearch("id");

		var add_model = new Vue({
			el : '#pageinit',
			data : {
				LoginName :"",
				Pwd:"",
				CompanyId:"",
				companyArr:[],
				IsWork:"",
				workArr:[
					{id:"1",name:"在职"},
					{id:"-1",name:"离职"}
				],
				BranchId:"",
				branchArr:[],
				DutyId:"",
				dutyArr:[],
				OName:"",
				Email:"",
				Phone:"",
				QQ:"",
				Sex:"",
				sexArr:[
					{name:"男",id:"1"},
					{name:"女",id:"-1"}
				],
				ParentId:"",
				parentArr:[],
				UserType:"",
				usersArr:[],
				Status:1,
				ProjectProofreadOperaotrId:"",
				ViewProjectUserId:"",
				Remark:""
			},
			methods : {
				noRed:function (id){
					$("#" + id) .removeClass("err-input");
				},
				getId:function (name){
					add_model[name] = $("#"+name).attr("data-id") || "";
				},
				parentFn:function (name){
					layer.open({
						type: 2,
						title: false,
						shade: 0.8,
						closeBtn:false,
						area: ["100%", "100%"],
						content: './visiblechild.html?name=' + name,
						end:function (){
							// console.info('ok')
							add_model.getId("ParentId");
							add_model.getId("ProjectProofreadOperaotrId");
							add_model.getId("ViewProjectUserId");
						}
					});
				},
				submit:function (){
					if(this.LoginName == ""){
						$("#LoginName").addClass("err-input");
						return
					}

					if(this.OName == ""){
						$("#OName").addClass("err-input");
						return
					}

					if(this.CompanyId == ""){
						$("#CompanyId_chosen>a").addClass("err-input");
						return
					}

					if(this.BranchId == ""){
						$("#BranchId_chosen>a").addClass("err-input");
						return
					}

					if(this.DutyId == ""){
						$("#DutyId_chosen>a").addClass("err-input");
						return
					}

					if(this.UserType == ""){
						$("#UserType_chosen>a").addClass("err-input");
						return
					}

					if(id){
						var postData = {
							OperatorId :id,
							LoginName:this.LoginName,
							Pwd :$.md5($.md5(this.LoginName) + this.Pwd),
							CompanyId :this.CompanyId,
							IsWork :this.IsWork==-1? 0 : 1,
							BranchId :this.BranchId,
							DutyId :this.DutyId,
							OName :this.OName,
							Email :this.Email,
							Phone :this.Phone,
							QQ :this.QQ,
							Sex :this.Sex==-1? 0 : 1,
							ParentId :this.ParentId,
							UserType :this.UserType,
							Status : this.Status? 0 : 1,
							ProjectProofreadOperaotrId :this.ProjectProofreadOperaotrId,
							ViewProjectUserId :this.ViewProjectUserId,
							Remark :this.Remark
						}
						var url = config.path + "buser/update";
						var str = "修改用户成功";
					}else{
						if(this.Pwd == ""){
							$("#Pwd").addClass("err-input");
							return
						}
						var postData = {
							LoginName:this.LoginName,
							Pwd :$.md5($.md5(this.LoginName) + this.Pwd),
							CompanyId :this.CompanyId,
							IsWork :this.IsWork,
							BranchId :this.BranchId,
							DutyId :this.DutyId,
							OName :this.OName,
							Email :this.Email,
							Phone :this.Phone,
							QQ :this.QQ,
							Sex :this.Sex,
							ParentId :this.ParentId,
							UserType :this.UserType,
							Status : this.Status? 0 : 1,
							ProjectProofreadOperaotrId :this.ProjectProofreadOperaotrId,
							ViewProjectUserId :this.ViewProjectUserId,
							Remark :this.Remark
						}
						var url = config.path + "buser/add";
						var str = "添加用户成功";
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

				if(id && id>0){
					var data={
						OperatorId:id*1
					}
					utool.ajax.ajaxRequest("POST",config.path+"buser/entity",data,"json").done(function (returnData){
						returnData = JSON.parse(returnData);
						if(returnData.Code==200){
							add_model.LoginName = returnData.Data.loginName;
							add_model.OName = returnData.Data.oName;
							add_model.Email = returnData.Data.email;
							add_model.Phone = returnData.Data.phone;
							add_model.QQ = returnData.Data.qQ;
							add_model.Remark = returnData.Data.remark;
							add_model.BranchId = returnData.Data.branchId;
							add_model.IsWork = returnData.Data.isWork==0? -1 : 1;
							add_model.Sex = returnData.Data.sex==0? -1 : 1;
							add_model.CompanyId = returnData.Data.companyId;
							add_model.DutyId = returnData.Data.dutyId;
							add_model.UserType = returnData.Data.userType;
							add_model.ParentId = returnData.Data.parentId;
							add_model.Status = returnData.Data.status==1? false : true;
							add_model.ProjectProofreadOperaotrId = returnData.Data.projectProofreadOperaotrId;
							add_model.ViewProjectUserId = returnData.Data.viewProjectUserId;
							$("#ParentId").val(returnData.Data.parentName)
							$("#ParentId").attr("data-id",returnData.Data.parentId)
							$("#ProjectProofreadOperaotrId").val(returnData.Data.projectProofreadName)
							$("#ProjectProofreadOperaotrId").attr("data-id",returnData.Data.projectProofreadOperaotrId)
							$("#ViewProjectUserId").val(returnData.Data.viewProjectName)
							$("#ViewProjectUserId").attr("data-id",returnData.Data.viewProjectUserId)
							var initData = {
								page:1,
								limit:10000
							}
							//初始化拉下列表
							//部门
							utool.ajax.ajaxRequest("POST",config.path + "bbranch/list" , initData , "json").done(function (returnedData){
								returnedData = JSON.parse(returnedData);
								add_model.branchArr = returnedData.Data;
								add_model.$nextTick(function() {

									$('#BranchId').chosen().change(function(tar, val) {
										$("#BranchId_chosen>a").removeClass("err-input");
										add_model.BranchId=val.selected;
									});

									$('#IsWork').chosen().change(function(tar, val) {
										add_model.IsWork=val.selected;
									})

									$('#Sex').chosen().change(function(tar, val) {
										add_model.Sex=val.selected;
									});
								})
							})

							//公司
							utool.ajax.ajaxRequest("POST",config.path + "bcompany/list" , initData , "json").done(function (returnedData){
								returnedData = JSON.parse(returnedData);
								add_model.companyArr = returnedData.Data;
								add_model.$nextTick(function() {
									$('#CompanyId').chosen().change(function(tar, val) {
										$("#CompanyId_chosen>a").removeClass("err-input");
										add_model.CompanyId=val.selected;
									});
								})
							})

							//职位
							utool.ajax.ajaxRequest("POST",config.path + "bduty/list" , initData , "json").done(function (returnedData){
								returnedData = JSON.parse(returnedData);
								add_model.dutyArr = returnedData.Data;
								add_model.$nextTick(function() {
									$('#DutyId').chosen().change(function(tar, val) {
										$("#DutyId_chosen>a").removeClass("err-input");
										add_model.DutyId=val.selected;
									});
								})
							})

							//属性
							utool.ajax.ajaxRequest("POST",config.path + "buser/enumlist" , {enumType:619} , "json").done(function (returnedData){
								returnedData = JSON.parse(returnedData);
								add_model.usersArr = returnedData.Data;
								add_model.$nextTick(function() {
									$('#UserType').chosen().change(function(tar, val) {
										$("#UserType_chosen>a").removeClass("err-input");
										add_model.UserType=val.selected;
									});
								})
							})
							add_model.$nextTick(function (){
								$('#BranchId').on('chosen:ready', function(e, params) {
									$("#BranchId").attr("value",returnData.Data.branchId)
									$('#BranchId').trigger('chosen:updated');//更新选项
								});
								$('#IsWork').on('chosen:ready', function(e, params) {
									$("#IsWork").attr("value",returnData.Data.isWork)
									$('#IsWork').trigger('chosen:updated');//更新选项
								});
								$('#Sex').on('chosen:ready', function(e, params) {
									$("#Sex").attr("value",returnData.Data.sex)
									$('#Sex').trigger('chosen:updated');//更新选项
								});
								$('#CompanyId').on('chosen:ready', function(e, params) {
									$("#CompanyId").attr("value",returnData.Data.companyId)
									$('#CompanyId').trigger('chosen:updated');//更新选项
								});
								$('#DutyId').on('chosen:ready', function(e, params) {
									$("#DutyId").attr("value",returnData.Data.dutyId)
									$('#DutyId').trigger('chosen:updated');//更新选项
								});
								$('#UserType').on('chosen:ready', function(e, params) {
									$("#UserType").attr("value",returnData.Data.userType)
									$('#UserType').trigger('chosen:updated');//更新选项
								});
							})
						}
					})
				}else{
					var initData = {
						page:1,
						limit:10000
					}
					//初始化拉下列表
					//部门
					utool.ajax.ajaxRequest("POST",config.path + "bbranch/list" , initData , "json").done(function (returnedData){
						returnedData = JSON.parse(returnedData);
						add_model.branchArr = returnedData.Data;
						add_model.$nextTick(function() {

							$('#BranchId').chosen().change(function(tar, val) {
								$("#BranchId_chosen>a").removeClass("err-input");
								add_model.BranchId=val.selected;
							});

							$('#IsWork').chosen().change(function(tar, val) {
								add_model.IsWork=val.selected;
							})

							$('#Sex').chosen().change(function(tar, val) {
								add_model.Sex=val.selected;
							});
						})
					})

					//公司
					utool.ajax.ajaxRequest("POST",config.path + "bcompany/list" , initData , "json").done(function (returnedData){
						returnedData = JSON.parse(returnedData);
						add_model.companyArr = returnedData.Data;
						add_model.$nextTick(function() {
							$('#CompanyId').chosen().change(function(tar, val) {
								$("#CompanyId_chosen>a").removeClass("err-input");
								add_model.CompanyId=val.selected;
							});
						})
					})

					//职位
					utool.ajax.ajaxRequest("POST",config.path + "bduty/list" , initData , "json").done(function (returnedData){
						returnedData = JSON.parse(returnedData);
						add_model.dutyArr = returnedData.Data;
						add_model.$nextTick(function() {
							$('#DutyId').chosen().change(function(tar, val) {
								$("#DutyId_chosen>a").removeClass("err-input");
								add_model.DutyId=val.selected;
							});
						})
					})

					//属性
					utool.ajax.ajaxRequest("POST",config.path + "buser/enumlist" , {enumType:619} , "json").done(function (returnedData){
						returnedData = JSON.parse(returnedData);
						add_model.usersArr = returnedData.Data;
						add_model.$nextTick(function() {
							$('#UserType').chosen().change(function(tar, val) {
								$("#UserType_chosen>a").removeClass("err-input");
								add_model.UserType=val.selected;
							});
						})
					})
				}
			}
		});
	};

	//选择用户
	var VisibleChild= function(fn){
		var mmg=null;
		var name= utool.search.getSearch("name");
		var cols =  [
			{
				title: '编号',
				name: 'operatorId',
				sortable:true,
				hidden:true
			},
			{
				title: '用户名',
				name: 'oName',
				width: 60
			},
			{
				title: '登录名',
				name: 'loginName',
				width: 60
			},
			{
				title: '公司',
				name: 'companyName',
				width: 100
			},
			{
				title: '部门',
				name: 'branchName',
				width: 100
			},
			{
				title: '职位',
				name: 'dutyName',
				width: 100
			},
			{
				title: '上级',
				name: 'parentName',
				width: 60
			}
		];
		var index_model = new Vue({
			el : '#pageinit',
			data : {
				page : 1,
				limit : 25,
				sortDirection:'',
				sortExpression:'',
				OName:"",
				LoginName:"",
				BranchId:"",
				BranchArr:[]
			},
			methods : {
				//获取初始信息，并绑定列表单个编辑函数
				getData : function(){
					var data = {
						page : this.page,
						limit : this.limit,
						sortDirection:this.sortDirection,
						sortExpression:this.sortExpression,
						OName : this.OName,
						LoginName : this.LoginName,
						BranchId:this.BranchId,
						ParentName : this.ParentName,
						UserType:this.UserType,
						IsWork:this.IsWork,
						Status:this.Status
					}
					mmg.load(data);
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
					this.OName = "";
					this.LoginName = "";
					this.BranchId = "";
					//初始化部门
					index_model.$nextTick(function() {
						$('#parentUp').trigger('chosen:updated');//更新选项
					})
					this.getData()
				},
				goBack:function (){
					var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
					parent.layer.close(index);
				}
			},
			created:function (){
				//初始化部门下拉列表
				var initData = {
					page:1,
					limit:10000
				}
				utool.ajax.ajaxRequest("POST",config.path + "bbranch/list" , initData , "json").done(function (returnedData){
					returnedData = JSON.parse(returnedData);
					index_model.BranchArr = returnedData.Data;
					index_model.$nextTick(function() {
						$('#parentUp').chosen().change(function(tar, val) {
							index_model.BranchId=val.selected;
							index_model.getData();
						});
					})
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
			root: 'Data',
			url:config.path+"buser/list",
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
			// console.info(parent.$("#"+name).val())
			// console.info('ok1')
			var strName = parent.$("#"+name).val();
			var namevalue = strName? strName+","+ item.oName : item.oName;
			parent.$("#"+name).val(namevalue);
            var dataId = parent.$("#"+name).attr("data-id");
            var nameId = dataId? dataId+","+ item.operatorId : item.operatorId;
			parent.$("#"+name).attr("data-id",nameId);
            parent.$("#"+name).attr("data-id",nameId);
			var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
			parent.layer.close(index);
			fn && fn(item)
		})

		index_model.getData();

};

	//用户角色分配
	var UseManngerList= function (){
		var id= utool.search.getSearch("id");

		var add_model = new Vue({
			el : '#pageinit',
			data : {
				listData:[]
			},
			methods : {
				submit:function (){
					var result = [];
					for(var i= 0;i<add_model.listData.length;i++){
						if(add_model.listData[i].checked == true){
							result.push({
								RolesId:add_model.listData[i].rolesId,
								OperatorId:id
							})
						}
					}

					utool.ajax.ajaxRequest("POST",config.path + "buser/updaterole",result,"json").done(function (returnData){
						returnData = JSON.parse(returnData);
						if(returnData.Code==200){
							layer.alert("修改角色成功",function (){
								var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
								parent.layer.close(index);
							});
						}else{
							layer.alert('获取数据错误，错误原因'+ returnData.Msg,{title : '错误',icon : 2});
						}
					})
				}
			},
			created:function (){
				utool.ajax.ajaxRequest("POST",config.path + "buser/urlist",{limit:1000,OperatorId:id},"json").done(function (returnData){
					returnData = JSON.parse(returnData);
					console.info(returnData)
					if(returnData.Code==200){
						add_model.listData =returnData.Data;
					}else{
						layer.alert('获取数据错误，错误原因'+ returnData.Msg,{title : '错误',icon : 2});
					}
				})
			}
		});

	}

	//角色管理
	var RolMannger = function(resultData){
		var mmg=null;

		var cols =  [

			{
				title: '角色Id',
				name: 'rolesId',
				sortable:true,
				hidden:true
			},
			{
				title: '角色名称',
				name: 'title',
				width: 150
			},

			{
				title: '备注',
				name: 'remark'
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

					if(resultData.Rights.roles){
						html += "<a  title='设置权限' style='margin-left: 4px;' class='render_a' ><span class='glyphicon glyphicon-user' aria-hidden='true' name='user'></span></a>"
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
				Title:""
			},
			methods : {
				//获取初始信息，并绑定列表单个编辑函数
				getData : function(){
					var data = {
						page : this.page,
						limit : this.limit,
						Title : this.Title,
						sortDirection:this.sortDirection,
						sortExpression:this.sortExpression
					}
					mmg.load(data);
				},
				addInfo:function () {
					var _this=this;
					layer.open({
						type: 2,
						title: "添加角色",
						shade: 0.8,
						area: ["400px", '280px'],
						content: './roladminadd.html',
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
					this.Title = "";
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
			url:config.path+"broles/list",
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
					area: ["400px", '280px'],
					content: './roladminadd.html?id='+item.rolesId,
					end:function (){
						index_model.getData()
					}
				});
			}else if(ele.is('span[name="delete"]')){
				layer.confirm("确认删除选中活动?",{title:"提示"},function (){
					var reqPara = {
						RolesId :item.rolesId
					};
					utool.ajax.ajaxRequest("POST", config.path + "broles/delete", reqPara, "json").done(function (returnData){
						returnData = JSON.parse(returnData);
						if(returnData.Code == 200){
							index_model.getData();
							layer.alert("删除成功",function (index){
								layer.close(index);
							})
						}else{
							layer.alert('获取数据错误，错误原因'+ returnData.Msg,{title : '错误',icon : 2});
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
					content: './roladminlimit.html?id='+item.rolesId ,
					end:function (){
						index_model.getData()
					}
				})
			}
		})
		index_model.getData();
	};

	//添加/修改角色
	var RolManngerAdd=function (){
		var id= utool.search.getSearch("id");
		var add_model = new Vue({
			el : '#pageinit',
			data : {
				Title :"",
				Remark:"",
			},
			methods : {
				noRed:function (id){
					$("#" + id) .removeClass("err-input");
				},
				submit:function (){
					if(this.Title == ""){
						$("#Title").addClass("err-input");
						return
					}
					if(id && id>0){
						var postData = {
							RolesId :id,
							Title:this.Title,
							Remark:this.Remark
						}
						var url = config.path + "broles/update";
						var str = "修改角色成功";
					}else{
						var postData = {
							Title:this.Title,
							Remark:this.Remark
						}
						var url = config.path + "broles/add";
						var str = "添加角色成功";
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
				if(id && id>0){
					var data={
						RolesId:id
					}
					utool.ajax.ajaxRequest("POST",config.path+"broles/entity",data,"json").done(function (returnData){
						returnData = JSON.parse(returnData);
						if(returnData.Code==200){
							add_model.Title = returnData.Data.title;
							add_model.Remark = returnData.Data.remark;
						}
					})
				}
			}
		});
	};

	//添加/修改角色权限-子页面
	var RolManngerLimit=function (){
		var id = utool.search.getSearch("id");
		var setting = {
			check: {
				enable: true
			},
			data: {
				simpleData: {
					enable: true
				}
			}
		};
		var add_model = new Vue({
			el : '#pageinit',
			data : {
				dataList:[]
			},
			methods : {
				submit:function (){
					add_model.dataList=[];
					var treeObj=$.fn.zTree.getZTreeObj("treeDemo"),
						nodes=treeObj.getCheckedNodes(true),
						v="";
					for(var i=0;i<nodes.length;i++){
						add_model.dataList.push({
							RolesId:id*1,
							JurisdictionId:nodes[i].id
						})
					}
					utool.ajax.ajaxRequest("POST",config.path + "broles/updaterole",add_model.dataList , "json").done(function (returnData){
						returnData = JSON.parse(returnData);
						if(returnData.Code==200){
							layer.alert("修改角色权限成功",function (){
								var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
								parent.layer.close(index);
							})
						}else{
							layer.alert('获取数据错误，错误原因'+ returnData.Msg,{title : '错误',icon : 2});
						}

					})
				},
				cancel:function (){
					var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
					parent.layer.close(index);
				}
			},
			created:function (){
				utool.ajax.ajaxRequest("POST",config.path + "broles/rolerightlist" ,{RolesId:id*1},"json").done(function (returnData){
					returnData = JSON.parse(returnData);
					if(returnData.Code==200){
						$.fn.zTree.init($("#treeDemo"), setting, returnData.Data);
						for(var i= 0;i<returnData.Data.length;i++){
							if(returnData.Data[i].checked == true){
								add_model.dataList.push({
									RolesId:id*1,
									JurisdictionId:returnData.Data[i].id
								})
							}
						}
					}
				})
			}
		});
	};

	BaseJs.ComMannger=ComMannger;

	BaseJs.ComManngerAdd=ComManngerAdd;

	BaseJs.DepMannger=DepMannger;

	BaseJs.DepManngerAdd=DepManngerAdd;

	BaseJs.PosMannger=PosMannger;

	BaseJs.PosManngerAdd=PosManngerAdd;

	BaseJs.JurMannger=JurMannger;

	BaseJs.JurManngerAdd=JurManngerAdd;

	BaseJs.JurManngerLimit=JurManngerLimit;

	BaseJs.UseMannger=UseMannger;

	BaseJs.UseManngerAdd=UseManngerAdd;

	BaseJs.UseManngerList=UseManngerList;

	BaseJs.RolMannger=RolMannger;

	BaseJs.RolManngerAdd=RolManngerAdd;

	BaseJs.RolManngerLimit=RolManngerLimit;

    BaseJs.VisibleChild=VisibleChild;

})()