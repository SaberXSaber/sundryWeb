config.menukey = 'BaseJs';

var BaseJs = {};

(function () {
    //流程管理
    var AutoProcessMannger = function () {

        var mmg = null;

        var cols = [
            {
                title: '操作',
                name: '',
                lockWidth: true,
                width: 80,
                renderer: function (val) {
                    return "<div style=\"height: auto; margin: 0px;padding: 0px; font-size: 16px;\">" +
                        "<a  title=\"修改\" style='margin: 0px;padding: 0px; color: black' ><span class=\"glyphicon glyphicon-edit\" aria-hidden=\"true\" name='edit'></span></a>" +
                        "<a title=\"删除\" style='margin: 0px;padding: 0px; color: black'  > <span name='delete' class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\"></span></a>" +
                        "</div>";
                }
            },
            {
                title: '流程Id',
                name: 'processId',
                sortable: true,
                hidden: true
            },
            {
                title: '流程名',
                name: 'processName',
                width: 150
            },
            {
                title: '流程类型',
                name: 'processType',
                width: 150,
                renderer: function (val) {
                    if (val == 1) {
                        return "项目流程"
                    } else if (val == 2) {
                        return "金额流程"
                    } else {
                        return val
                    }
                }
            },
            {
                title: '事业部',
                name: 'enumName',
                width: 150,
                renderer: function (val) {
                    return val
                }
            },
            {
                title: '状态',
                name: 'status',
                width: 150,
                renderer: function (val) {
                    if (val == 0) {
                        return "有效"
                    } else if (val == -1) {
                        return "无效"
                    } else {
                        return val
                    }
                }
            }
        ];

        var index_model = new Vue({
            el: '#pageinit',
            data: {
                page: 1,
                limit: 25,
                sortDirection: '',
                sortExpression: '',
                ProcessName: "",
                ProcessType: 0,
                ProcessTypeLists: [],
                BdIdLists: [],
                BdId: 0
            },
            methods: {
                //获取初始信息，并绑定列表单个编辑函数
                getData: function () {
                    var data = {
                        page: this.page,
                        limit: this.limit,
                        ProcessName: this.ProcessName,
                        ProcessType: this.ProcessType,
                        BdId: this.BdId,
                        sortDirection: this.sortDirection,
                        sortExpression: this.sortExpression
                    }
                    mmg.load(data);
                },
                addInfo: function () {
                    var _this = this;
                    layer.open({
                        type: 2,
                        title: "添加流程",
                        shade: [0.1, '#FFF'],
                        area: ["70%", '100%'],
                        content: './autoprocessadd.html',
                        end: function () {
                            _this.getData()
                        }
                    });
                },
                serachInfo: function () {
                    this.page = 1;
                    this.getData()
                },
                reset: function () {
                    this.page = 1;
                    this.limit = 25;
                    this.sortDirection = "";
                    this.sortExpression = "";
                    this.Title = "";
                    this.getData()
                }
            },
            created: function () {
                utool.ajax.ajaxRequest("GET", config.path + "static/api/init.json", "", "json").done(function (returnedData) {
                    if (returnedData.success == 200) {
                        index_model.ProcessTypeLists = returnedData.result.ProcessTypeLists;
                        index_model.$nextTick(function () {
                            $("#ddlProcessType").chosen().change(function (tar, val) {
                                index_model.ProcessType = val.selected;
                                index_model.getData();
                            });
                        })
                    }
                });
                utool.ajax.ajaxRequest("POST", config.path + "buser/enumlist", {enumType: 690}, "json").done(function (returnedData) {
                    returnedData = JSON.parse(returnedData);
                    index_model.BdIdLists = returnedData.Data;
                    index_model.$nextTick(function () {
                        $('#BdId').chosen().change(function (tar, val) {
                            $("#BdId").removeClass("err-input");
                            index_model.BdId = val.selected;
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
            url: config.path + "bap/list",
            params: {
                page: 1,
                limit: 25,
                sortDirection: '',
                sortExpression: ''
            },
            plugins: [
                $('#pg').mmPaginator()
            ],
            limitChange: function (limit) {
                index_model.limit = limit;
                index_model.page = 1;
                index_model.getData();
            },
            pageChange: function (page) {
                index_model.page = page;
                index_model.getData();
            },
            sortChange: function (sort) {
                index_model.sortDirection = sort.sortStatus;
                index_model.sortExpression = sort.sortName;
                index_model.getData();
            }
        })
        mmg.on('cellSelected', function (e, item, rowIndex, colIndex) {
            var ele = $(e.target);
            if (ele.is('span[name="edit"]')) {
                layer.open({
                    type: 2,
                    title: "修改流程",
                    shade: [0.1, '#FFF'],
                    area: ["70%", '100%'],
                    content: './autoprocessadd.html?id=' + item.processId,
                    end: function () {
                        index_model.getData();
                    }
                });
            } else if (ele.is('span[name="delete"]')) {
                layer.confirm("确认删除此条信息?", {title: "提示"}, function () {
                    var reqPara = {
                        ProcessId: item.processId
                    };
                    utool.ajax.ajaxRequest("POST", config.path + " bap/delete", reqPara, "json").done(function (returnData) {
                        returnData = JSON.parse(returnData);
                        if (returnData.Code == 200) {
                            index_model.getData();
                            layer.alert("删除成功", function (index) {
                                layer.close(index);
                            })
                        } else {
                            layer.alert('删除失败，原因' + returnData.Msg, {title: '错误', icon: 2});
                        }
                    })
                })
                e.stopPropagation()
            }
        })
        index_model.getData();
    };

    //添加/修改流程
    var AutoProcessAdd = function () {

        var id = utool.search.getSearch("id");

        var add_model = new Vue({
            el: '#pageinit',
            data: {
                showrole: "",
                ProcessId: id ? id : 0,
                ProcessName: "",
                ProcessType: 1,
                ProcessTypeLists: [],
                IsAllLists: [],
                IsAll: 1,
                IsDefault: 1,
                IsDefaultLists: [],
                RolesIds: [],
                inRoleIds: [],
                StepEntry: [],
                StepName: "",
                SortId: 1,
                ParentId: "",
                data_id: [],
                statementsList: [],
                statementsListOld: [],
                stateindex: -1,
                listData: [],
                viewrole: "",
                examinerole: [],
                BdIdLists: [],
                BdId: 691,
                SucStateListsAll: [],
                SucStateAll: "",
                EnumIdLists: [],
                EnumId: "",
                ReturnState: "",
                FailState: "",
                IsSimple:2
            },
            methods: {
                editstate: function (ReturnState, FailState, IsDefault, EnumId, SucState, roleids, name, index) {
                    if ($(".custom_box") && $(".custom_box").length > 0 && $(".custom_box")[0].classList.length < 2) {
                        $(".custom_box").toggleClass("show");
                    }
                    $(".delBtn").css("display", "inline-block");
                    this.StepName = name;
                    this.stateindex = index;
                    this.examinerole = roleids;
                    this.IsDefault = IsDefault;
                    this.EnumId = EnumId;
                    this.SucStateAll = SucState;
                    this.ReturnState = ReturnState;
                    this.FailState = FailState;
                    add_model.$nextTick(function () {
                        $("#data_id").val(roleids).trigger('chosen:updated');
                        $("#IsDefault").val(IsDefault).trigger('chosen:updated');
                        if (IsDefault != 1) {
                            $("#EnumId").val(EnumId).trigger('chosen:updated');
                            $("#EnumId").trigger('chosen:updated');
                            $("#div_EnumId").show();
                            $("#div_SucState").show();
                            $("#div_FailState").show();
                            $("#div_ReturnState").show();
                            utool.ajax.ajaxRequest("POST", config.path + "buser/enumlist", {enumType: EnumId}, "json").done(function (returnedData) {
                                returnedData = JSON.parse(returnedData);
                                add_model.SucStateListsAll = returnedData.Data;
                                $("#SucState").trigger('chosen:updated');
                                $("#FailState").trigger('chosen:updated');
                                $("#ReturnState").trigger('chosen:updated');
                                add_model.$nextTick(function () {

                                    $("#SucState").val(SucState).trigger('chosen:updated');
                                    $("#ReturnState").val(ReturnState).trigger('chosen:updated');
                                    $("#FailState").val(FailState).trigger('chosen:updated');
                                    $('#SucState').chosen().change(function (tar, val) {
                                        $("#SucState").removeClass("err-input");
                                        add_model.SucStateAll = val.selected;
                                    });
                                    $('#FailState').chosen().change(function (tar, val) {
                                        $("#FailState").removeClass("err-input");
                                        add_model.FailState = val.selected;
                                    });
                                    $('#ReturnState').chosen().change(function (tar, val) {
                                        $("#ReturnState").removeClass("err-input");
                                        add_model.ReturnState = val.selected;
                                    });
                                })
                            })
                        } else {
                            $("#div_EnumId").hide();
                            $("#div_SucState").hide();
                            $("#div_FailState").hide();
                            $("#div_ReturnState").hide();
                        }
                        // setTimeout(function () {
                        //     $("#SucState").val(SucState).trigger('chosen:updated');
                        //     $("#ReturnState").val(ReturnState).trigger('chosen:updated');
                        //     $("#FailState").val(FailState).trigger('chosen:updated');
                        // },500)
                    })
                },
                hideBox: function () {
                    $(".custom_box").toggleClass("show");
                },
                //确认数据
                confirmData: function () {
                    if (this.StepName == "") {
                        $("#StepName").addClass("err-input");
                        return
                    }
                    if (!this.examinerole || this.examinerole.length == 0) {
                        layer.msg("请选择审核角色！");
                        return
                    }
                    if (this.IsDefault != 1) {
                        if (!this.EnumId || this.EnumId < 1) {
                            layer.msg("请选择状态枚举！");
                            return
                        }
                        if (!this.SucStateAll || this.SucStateAll < 1) {
                            layer.msg("请选择通过状态！");
                            return
                        }
                        if (!this.ReturnState || this.ReturnState < 1) {
                            layer.msg("请选择失败状态！");
                            return
                        }
                        if (!this.FailState || this.FailState < 1) {
                            layer.msg("请选择驳回状态！");
                            return
                        }
                    }
                    if (this.stateindex != -1) {
                        this.statementsList.splice(this.stateindex, 1, {
                            name: this.StepName,
                            RolesIds: this.examinerole,
                            IsDefault: this.IsDefault,
                            EnumId: this.EnumId,
                            SucState: this.SucStateAll,
                            ReturnState: this.ReturnState,
                            FailState: this.FailState
                        })
                    } else {
                        this.statementsList.push({
                            name: this.StepName,
                            RolesIds: this.examinerole,
                            IsDefault: this.IsDefault,
                            EnumId: this.EnumId,
                            SucState: this.SucStateAll,
                            ReturnState: this.ReturnState,
                            FailState: this.FailState
                        })
                    }
                    $(".custom_box").removeClass("show");
                    add_model.$nextTick(function () {
                        $('#elements-container div').arrangeable();
                        return
                    })

                },
                addflow: function () {
                    this.stateindex = -1;
                    if ($(".custom_box") && $(".custom_box").length > 0 && $(".custom_box")[0].classList.length < 2) {
                        $(".custom_box").toggleClass("show");
                    }
                    $(".delBtn").css("display", "none");
                    this.StepName = "";
                    add_model.$nextTick(function () {
                        $("#data_id").val([]).trigger('chosen:updated');
                        $("#IsDefault").val(1).trigger('chosen:updated');
                        $("#EnumId").val("").trigger('chosen:updated');
                        $("#SucState").val("").trigger('chosen:updated');
                        $("#ReturnState").val("").trigger('chosen:updated');
                        $("#FailState").val("").trigger('chosen:updated');
                        $("#div_EnumId").hide();
                        $("#div_SucState").hide();
                        $("#div_FailState").hide();
                        $("#div_ReturnState").hide();
                    })
                },
                noRed: function (id) {
                    $("#" + id).removeClass("err-input");
                },
                deletelment: function () {
                    this.statementsList.splice(this.stateindex, 1);
                    $(".custom_box").toggleClass("show");
                },
                submit: function () {
                    // layer.msg(add_model.IsSimple)
                    // return
                    if (this.ProcessName == "") {
                        $("#ProcessName").addClass("err-input");
                        return
                    }
                    if (this.IsAll != 1) {
                        if (!this.RolesIds || this.RolesIds == "" || this.RolesIds.length < 1) {
                            layer.msg("请选择可见角色!");
                            return
                        }
                    }
                    var postData = {
                        ProcessId: this.ProcessId,
                        ProcessName: this.ProcessName,
                        ProcessType: this.ProcessType,
                        BdId: this.BdId,
                        IsAll: this.IsAll == 2 ? 0 : this.IsAll,
                        RolesIds: this.RolesIds,
                        StepEntry: [],
                        StepEntryOld:this.statementsListOld,
                        IsSimple:this.IsSimple
                    }

                    for (var i = 0; i < this.statementsList.length; i++) {
                        postData.StepEntry.push({
                            StepName: this.statementsList[i].name,
                            SortId: i + 1,
                            RolesIds: this.statementsList[i].RolesIds,
                            IsDefault: this.statementsList[i].IsDefault,
                            EnumId: this.statementsList[i].EnumId,
                            SucState: this.statementsList[i].SucState,
                            ReturnState: this.statementsList[i].ReturnState,
                            FailState: this.statementsList[i].FailState
                        })
                    }
                    if (id) {
                        var url = config.path + "bap/update";
                        var str = "修改流程成功";
                    } else {
                        var url = config.path + "bap/add";
                        var str = "添加流程成功";
                    }
                    layer.load(0, {shade: false});
                    utool.ajax.ajaxRequest("POST", url, postData, "json").done(function (returnData) {
                        // console.info(returnData)
                        returnData = JSON.parse(returnData);
                        layer.closeAll();
                        if (returnData.Code == 200) {
                            layer.alert(str, function () {
                                layer.closeAll();
                                // var index = parent.layer.getFrameIndex(window.name);
                                parent.layer.closeAll();
                            })
                        } else {
                            layer.alert('出现错误,原因:' + returnData.Msg, {title: '错误', icon: 2});
                        }
                    })
                },
                cancel: function () {
                    layer.closeAll();
                    parent.layer.closeAll();
                }
            },
            watch: {
                IsAll: function (value, oldvalue) {
                    if (value == 2) {
                        utool.ajax.ajaxRequest("POST", config.path + "buser/urlist", {
                            limit: 1000,
                            OperatorId: id
                        }, "json").done(function (returnData) {
                            returnData = JSON.parse(returnData);
                            if (returnData.Code == 200) {
                                add_model.listData = returnData.Data;
                                add_model.$nextTick(function () {
                                    $("#test_select").val(add_model.RolesIds).trigger('chosen:updated');
                                    $("#test_select").chosen().change(function (tar, val) {
                                        add_model.viewrole = val.selected;
                                        add_model.RolesIds = $("#test_select").val();
                                    });
                                })
                            } else {
                                layer.alert('获取数据错误，错误原因' + returnData.Msg, {title: '错误', icon: 2});
                            }
                        })
                    }
                }
            },
            created: function () {
                if (id && id > 0) {
                    utool.ajax.ajaxRequest("POST", config.path + "bap/entity", {
                        limit: 1000,
                        ProcessId: id
                    }, "json").done(function (returnData) {
                        returnData = JSON.parse(returnData);
                        if (returnData.Code == 200) {
                            add_model.ProcessName = returnData.Data.processName;
                            add_model.ProcessType = returnData.Data.processType;
                            add_model.IsAll = returnData.Data.isAll == 0 ? 2 : 1;
                            add_model.IsSimple = returnData.Data.isSimple;
                            utool.ajax.ajaxRequest("GET", config.path + "static/api/init.json", "", "json").done(function (returnedData) {
                                if (returnedData.success == 200) {
                                    add_model.ProcessTypeLists = returnedData.result.ProcessTypeLists;
                                    add_model.IsAllLists = returnedData.result.IsAllLists;
                                    add_model.IsDefaultLists = returnedData.result.IsDefaultLists;
                                    add_model.$nextTick(function () {
                                        $("#ddlProcessType").trigger('chosen:updated');
                                        $("#ddlIsAll").trigger('chosen:updated');
                                        $("#IsSimple").trigger('chosen:updated');
                                        $("#ddlProcessType").chosen().change(function (tar, val) {
                                            $("#ddlProcessType_chosen > a").removeClass("err-input");
                                            add_model.ProcessType = val.selected;
                                        });
                                        $("#ddlIsAll").chosen().change(function (tar, val) {
                                            add_model.IsAll = val.selected;
                                        });
                                        $("#IsSimple").chosen().change(function (tar, val) {
                                            add_model.IsSimple = val.selected;
                                        });
                                        $("#IsDefault").chosen().change(function (tar, val) {
                                            add_model.IsDefault = val.selected;
                                            if (add_model.IsDefault == 1) {
                                                $("#div_EnumId").hide();
                                                $("#div_SucState").hide();
                                                $("#div_FailState").hide();
                                                $("#div_ReturnState").hide();
                                            } else {
                                                $("#div_EnumId").show();
                                                $("#div_SucState").show();
                                                $("#div_FailState").show();
                                                $("#div_ReturnState").show();
                                            }
                                        });
                                    })
                                }
                            });
                            add_model.BdId = returnData.Data.bdId;
                            utool.ajax.ajaxRequest("POST", config.path + "buser/enumlist", {enumType: 690}, "json").done(function (returnedData) {
                                returnedData = JSON.parse(returnedData);
                                add_model.BdIdLists = returnedData.Data;
                                add_model.$nextTick(function () {
                                    $('#BdId').chosen().change(function (tar, val) {
                                        $("#BdId").removeClass("err-input");
                                        add_model.BdId = val.selected;
                                    });
                                })
                            })
                            add_model.viewrole = returnData.Data.rolesIds;
                            add_model.RolesIds = returnData.Data.rolesIds;
                            utool.ajax.ajaxRequest("POST", config.path + "buser/urlist", {
                                limit: 1000,
                                OperatorId: 0
                            }, "json").done(function (returnData) {
                                returnData = JSON.parse(returnData);
                                if (returnData.Code == 200) {
                                    add_model.listData = returnData.Data;
                                    add_model.$nextTick(function () {
                                        $("#data_id").trigger('chosen:updated');
                                        $("#data_id").chosen().change(function (tar, val) {
                                            $("#data_id_chosen .chosen-choices").removeClass("err-input");
                                            add_model.examinerole = $("#data_id").val();
                                        });
                                    })
                                } else {
                                    layer.alert('获取数据错误，错误原因' + returnData.Msg, {title: '错误', icon: 2});
                                }
                            })
                            utool.ajax.ajaxRequest("POST", config.path + "buser/enumlist", {enumType: 1}, "json").done(function (returnedData) {
                                returnedData = JSON.parse(returnedData);
                                add_model.EnumIdLists = returnedData.Data;
                                add_model.$nextTick(function () {
                                    $('#EnumId').chosen().change(function (tar, val) {
                                        add_model.EnumId = val.selected;
                                        utool.ajax.ajaxRequest("POST", config.path + "buser/enumlist", {enumType: add_model.EnumId}, "json").done(function (returnedData) {
                                            returnedData = JSON.parse(returnedData);
                                            add_model.SucStateListsAll = returnedData.Data;
                                            $("#SucState").trigger('chosen:updated');
                                            $("#FailState").trigger('chosen:updated');
                                            $("#ReturnState").trigger('chosen:updated');
                                            add_model.$nextTick(function () {
                                                $("#SucState").trigger("chosen:updated");
                                                $("#FailState").trigger('chosen:updated');
                                                $("#ReturnState").trigger('chosen:updated');
                                                $('#SucState').chosen().change(function (tar, val) {
                                                    $("#SucState").removeClass("err-input");
                                                    add_model.SucStateAll = val.selected;
                                                });
                                                $('#FailState').chosen().change(function (tar, val) {
                                                    $("#FailState").removeClass("err-input");
                                                    add_model.FailState = val.selected;
                                                });
                                                $('#ReturnState').chosen().change(function (tar, val) {
                                                    $("#ReturnState").removeClass("err-input");
                                                    add_model.ReturnState = val.selected;
                                                });
                                            })
                                        })
                                    });
                                    $('#SucState').chosen().change(function (tar, val) {
                                        $("#SucState").removeClass("err-input");
                                        add_model.SucStateAll = val.selected;
                                    });
                                    $('#FailState').chosen().change(function (tar, val) {
                                        $("#FailState").removeClass("err-input");
                                        add_model.FailState = val.selected;
                                    });
                                    $('#ReturnState').chosen().change(function (tar, val) {
                                        $("#ReturnState").removeClass("err-input");
                                        add_model.ReturnState = val.selected;
                                    });
                                })

                            })
                            if (returnData.Data.stepEntry && returnData.Data.stepEntry.length > 0) {
                                for (var i = 0; i < returnData.Data.stepEntry.length; i++) {
                                    var data = {
                                        name: returnData.Data.stepEntry[i].stepName,
                                        RolesIds: returnData.Data.stepEntry[i].rolesIds,
                                        IsDefault: returnData.Data.stepEntry[i].isDefault,
                                        EnumId: returnData.Data.stepEntry[i].enumId,
                                        SucState: returnData.Data.stepEntry[i].sucState,
                                        ReturnState: returnData.Data.stepEntry[i].returnState,
                                        FailState: returnData.Data.stepEntry[i].failState
                                    }
                                    add_model.statementsList.push(data)
                                    add_model.statementsListOld.push(returnData.Data.stepEntry[i])
                                }
                            }
                            add_model.$nextTick(function () {
                                $('#elements-container div').arrangeable();
                                return
                            })
                        } else {
                            layer.alert('获取数据错误，错误原因' + returnData.Msg, {title: '错误', icon: 2});
                        }
                    })
                } else {
                    utool.ajax.ajaxRequest("GET", config.path + "static/api/init.json", "", "json").done(function (returnedData) {
                        if (returnedData.success == 200) {
                            add_model.ProcessTypeLists = returnedData.result.ProcessTypeLists;
                            add_model.IsAllLists = returnedData.result.IsAllLists;
                            add_model.IsDefaultLists = returnedData.result.IsDefaultLists;
                            // add_model.ProcessId = returnedData.result.ProcessId;
                            add_model.$nextTick(function () {
                                $("#ddlProcessType").chosen().change(function (tar, val) {
                                    $("#ddlProcessType_chosen > a").removeClass("err-input");
                                    add_model.ProcessType = val.selected;
                                });
                                $("#ddlIsAll").chosen().change(function (tar, val) {
                                    add_model.IsAll = val.selected;
                                });

                                $("#IsSimple").chosen().change(function (tar, val) {
                                    add_model.IsSimple = val.selected;
                                });
                                $("#IsDefault").chosen().change(function (tar, val) {
                                    add_model.IsDefault = val.selected;
                                    if (add_model.IsDefault == 1) {
                                        $("#div_EnumId").hide();
                                        $("#div_SucState").hide();
                                        $("#div_FailState").hide();
                                        $("#div_ReturnState").hide();
                                    } else {
                                        $("#div_EnumId").show();
                                        $("#div_SucState").show();
                                        $("#div_FailState").show();
                                        $("#div_ReturnState").show();
                                    }
                                });

                            })
                        }
                    });
                    utool.ajax.ajaxRequest("POST", config.path + "buser/urlist", {
                        limit: 1000,
                        OperatorId: 0
                    }, "json").done(function (returnData) {
                        returnData = JSON.parse(returnData);
                        if (returnData.Code == 200) {
                            add_model.listData = returnData.Data;
                            // console.info(add_model.listData);
                            add_model.$nextTick(function () {
                                $("#data_id").chosen().change(function (tar, val) {
                                    $("#data_id_chosen .chosen-choices").removeClass("err-input");
                                    add_model.examinerole = $("#data_id").val();
                                });
                            })
                        } else {
                            layer.alert('获取数据错误，错误原因' + returnData.Msg, {title: '错误', icon: 2});
                        }
                    })
                    utool.ajax.ajaxRequest("POST", config.path + "buser/enumlist", {enumType: 690}, "json").done(function (returnedData) {
                        returnedData = JSON.parse(returnedData);
                        add_model.BdIdLists = returnedData.Data;
                        add_model.$nextTick(function () {
                            $('#BdId').chosen().change(function (tar, val) {
                                $("#BdId").removeClass("err-input");
                                add_model.BdId = val.selected;
                            });
                        })
                    })
                    utool.ajax.ajaxRequest("POST", config.path + "buser/enumlist", {enumType: 1}, "json").done(function (returnedData) {
                        returnedData = JSON.parse(returnedData);
                        add_model.EnumIdLists = returnedData.Data;
                        add_model.$nextTick(function () {
                            $('#EnumId').chosen().change(function (tar, val) {
                                add_model.EnumId = val.selected;
                                utool.ajax.ajaxRequest("POST", config.path + "buser/enumlist", {enumType: add_model.EnumId}, "json").done(function (returnedData) {
                                    returnedData = JSON.parse(returnedData);
                                    add_model.SucStateListsAll = returnedData.Data;
                                    $("#SucState").trigger('chosen:updated');
                                    $("#FailState").trigger('chosen:updated');
                                    $("#ReturnState").trigger('chosen:updated');
                                    add_model.$nextTick(function () {
                                        $("#SucState").trigger("chosen:updated");
                                        $("#FailState").trigger('chosen:updated');
                                        $("#ReturnState").trigger('chosen:updated');
                                        $('#SucState').chosen().change(function (tar, val) {
                                            $("#SucState").removeClass("err-input");
                                            add_model.SucStateAll = val.selected;
                                        });
                                        $('#FailState').chosen().change(function (tar, val) {
                                            $("#FailState").removeClass("err-input");
                                            add_model.FailState = val.selected;
                                        });
                                        $('#ReturnState').chosen().change(function (tar, val) {
                                            $("#ReturnState").removeClass("err-input");
                                            add_model.ReturnState = val.selected;
                                        });
                                    })
                                })
                            });
                            $('#SucState').chosen().change(function (tar, val) {
                                $("#SucState").removeClass("err-input");
                                add_model.SucStateAll = val.selected;
                            });
                            $('#FailState').chosen().change(function (tar, val) {
                                $("#FailState").removeClass("err-input");
                                add_model.FailState = val.selected;
                            });
                            $('#ReturnState').chosen().change(function (tar, val) {
                                $("#ReturnState").removeClass("err-input");
                                add_model.ReturnState = val.selected;
                            });
                        })

                    })
                    setTimeout(function () {
                        if (add_model.IsDefault == 1) {
                            $("#div_EnumId").hide();
                            $("#div_SucState").hide();
                            $("#div_FailState").hide();
                            $("#div_ReturnState").hide();
                        } else {
                            $("#div_EnumId").show();
                            $("#div_SucState").show();
                            $("#div_FailState").show();
                            $("#div_ReturnState").show();
                        }
                    }, 500)
                }
            }
        });
    };


    BaseJs.AutoProcessMannger = AutoProcessMannger;
    BaseJs.AutoProcessAdd = AutoProcessAdd;


})()

