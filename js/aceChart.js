/**
 * author: magicV
 * create: 2018-02-06
 */

// Global Params
var CONFIG = {
    includeWeekend: 1, //display weekend cell or not
    cellWidth: 'auto' //background cell's width
};
//use sessionStorage
var STORAGE = window.sessionStorage;

// Base Class
class Task {
    constructor(id = '', name = '', processor = '', start = '', release = '', type = '', duration = '', tag = '', status = '', parent = '', remark = '') {
        this.id = id;
        this.taskName = name; //任务名称
        this.processor = processor; //处理人
        this.startTime = new Date(start); //开始时间
        this.releaseTime = new Date(release); //发布时间
        this.taskType = type; //任务类型
        this.duration = duration; //持续时长
        this.taskTag = tag; //标签
        this.status = status; //状态
        this.parentId = parent; //父任务
        this.remark = remark; //备注信息
    }
}

class Sprint {
    constructor(id = '', name = '', start = '', end = '', status = '', dateList = []) {
        this.id = id;
        this.name = name;
        this.startTime = start;
        this.endTime = end;
        this.status = status;
        this.dateList = dateList;
    }
    //根据开始和结束时间，生成日期数组
    setDateList() {
        let dateArr = [];
        let sTime = new Date(this.startTime);
        let eTime = new Date(this.endTime);
        while (sTime.getTime() <= eTime.getTime()) {
            let temp = new Date(sTime.getTime());
            if (CONFIG.includeWeekend===0) { //是否包含周末：0不包含，1包含
                if (temp.getDay() !== 0 && temp.getDay() !== 6) {
                    dateArr.push(temp);
                }
            } else {
                dateArr.push(temp);
            }
            sTime.setDate(sTime.getDate() + 1);
        }
        this.dateList = dateArr;
    }
}

/* Public Function */
//画出页面整体框架 - 001
function initFrame(element) {
    let headStr = '<div class="row graph-header"><div class="col-sm-12" style="display: block; padding: 0px 0px 0px 20px; margin-bottom: 15px;" id="spr_div"><div class="col-sm-1 text-center" style="padding: 8px 8px 0 0;">Sprint name:</div><div class="col-sm-3 text-left sprint-info" id="spr_name"></div><div class="col-sm-1 text-center" style="padding: 8px 0 0;">Start time:</div><div class="col-sm-2 text-left sprint-info" id="spr_stime"></div><div class="col-sm-1 text-center" style="padding: 8px 0 0;">End time:</div><div class="col-sm-2 text-left sprint-info" id="spr_etime"></div><div class="col-sm-2 pull-right text-right sprint-info"><a id="viewLiteBtn" class="btn btn-warning btn-xs btn-outline" name="0"><i class="fa fa-fire"></i>Lite</a></div></div><div id="selectdiv" class="col-sm-12" style="padding: 10px 0;border-top:1px solid #cecece"><div class="col-sm-4" style="float:right;padding:0"><div class="col-sm-3" style="padding:0">Task status:</div><div class="col-sm-3" style="padding:0"><button class="btn btn-success" style="margin-top:-3px;background-color:#1c84c6;border-color:#1c84c6"></button><span>TODO</span></div><div class="col-sm-3" style="padding:0"><button class="btn btn-warning" style="margin-top:-3px;background-color:#f8ac59;border-color:#f8ac59"></button><span>DOING</span></div><div class="col-sm-3" style="padding:0"><button class="btn btn-primary" style="margin-top:-3px;background-color:#1ab394;border-color:#1ab394"></button><span>DONE</span></div></div></div></div>';
    let chartStr = '<div class="gantt_container row graph-main"><div class="gantt_grid col-sm-1 text-center" style="padding:0"><div class="gantt_grid_scale grid-scale-line-h"><div class="gantt_grid_head_cell gantt_grid_head_text">Processor</div></div><div class="gantt_grid_data" id="graphUserList"></div></div><div class="gantt_task col-sm-11 text-center" style="padding:0"><div class="gantt_task_scale"><div class="gantt_scale_line task-scale-line-h" id="graphSprintHeader" style="height:30px"></div></div><div class="gantt_data_area"><div class="gantt_task_bg" id="graphTaskContent"></div><div class="gantt_bars_area" id="graphTaskBarsArea"></div></div></div></div>';
    $(element).append(headStr+chartStr);
}

//Init chart header and sprint info. - 002
function initSprintToDom(spr) {
    spr.setDateList();
    STORAGE.setItem('sprintInfo-'+spr.id, JSON.stringify(spr));
    $('#spr_name').html('').append(sprint.name);
    $('#spr_stime').html('').append(sprint.startTime);
    $('#spr_etime').html('').append(sprint.endTime);
    var dateStr = [];
    for (let i = 0; i < spr.dateList.length; i++) {
        let date = getLocalTime(spr.dateList[i].getTime(), 'date').substr(-5);
        let divStr = '<div class="gantt_scale_cell">' + date + '</div>';
        if (spr.dateList[i].getDay() == 0 || spr.dateList[i].getDay() == 6) { //check display weekend or not
            divStr = '<div class="gantt_scale_cell bg-danger text-danger">' + date + '</div>';
        }
        dateStr.push(divStr);
    }
    //set cell width
    CONFIG.cellWidth = Number(100 / spr.dateList.length).toFixed(4);
    let htmlStr = dateStr.join('');
    $('#graphSprintHeader').append(htmlStr);
    $('.gantt_scale_cell').css('width', CONFIG.cellWidth + '%');
}

//时间戳转日期: yyyy-mm-dd hh:mm:ss
function add0(m) {
    return m < 10 ? '0' + m : m
}
function getLocalTime(nS, resType) {
    //参数：nS:时间戳；resType:{'date'返回日期/'time'返回时间}
    if (nS == null || nS == undefined) {
        return '';
    } else {
        var timestamp = nS;
        if (typeof(nS) == 'Number') {
            timestamp = parseInt(nS);
        }
        var time = new Date(timestamp);
        var year = time.getFullYear();
        var month = time.getMonth() + 1;
        var date = time.getDate();
        var hours = time.getHours();
        var minutes = time.getMinutes();
        var seconds = time.getSeconds();
        var result = year + '-' + add0(month) + '-' + add0(date) + ' ' + add0(hours) + ':' + add0(minutes) + ':' + add0(seconds);
        if (resType == 'date') {
            return result.substr(0, 10);
        } else if (resType == 'time') {
            return result;
        }
    }
}