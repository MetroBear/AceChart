/**
 * author: magicV
 * create: 2018-02-06
 */

// Global Params
var CONFIG = {
    includeWeekend: 0, //display weekend cell or not
    cellWidth: 'auto' //background cell's width
};
//use sessionStorage
var STORAGE = window.sessionStorage;

// Base Class
class Task {
    constructor(id = '', name = '', processor = '', start = '', release = '', type = '', duration = '', tag = '', remark = '') {
        this.taskName = name; //任务名称
        this.processor = processor; //处理人
        this.startTime = new Date(start); //开始时间
        this.releaseTime = new Date(release); //发布时间
        this.taskType = type; //任务类型
        this.duration = duration; //持续时长
        this.taskTag = tag; //标签
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
            switch (globalVal.includeWeekend) { //是否包含周末：0不包含，1包含
                case 0:
                    if (temp.getDay() !== 0 && temp.getDay() !== 6) {
                        dateArr.push(temp);
                    }
                    break;
                default:
                    dateArr.push(temp);
                    break;
            }
            sTime.setDate(sTime.getDate() + 1);
        }
        this.dateList = dateArr;
    }
}

/* Public Function */

//Init chart header and sprint info.
var initSprintToDom = function (spr) {
    $('#sprName').html('').append(sprint.sprintName);
    $('#sprStartTime').html('').append(sprint.startTime);
    $('#sprEndTime').html('').append(sprint.endTime);
    $('#bug_chart_btn').attr('name', sprint.sprintId);
    var dateStr = [];
    for (let i = 0; i < spr.sprintDateArr.length; i++) {
        let date = getLocalTime(spr.sprintDateArr[i].getTime(), 'date').substr(-5);
        let divStr = '<div class="gantt_scale_cell">' + date + '</div>';
        if (spr.sprintDateArr[i].getDay() == 0 || spr.sprintDateArr[i].getDay() == 6) { //check display weekend or not
            divStr = '<div class="gantt_scale_cell bg-danger text-danger">' + date + '</div>';
        }
        dateStr.push(divStr);
    }
    //设置单元格宽度
    globalVal.contentDivWidth = Number(100 / spr.sprintDateArr.length).toFixed(4);
    let htmlStr = dateStr.join('');
    $('#graphSprintHeader').append(htmlStr);
    $('.gantt_scale_cell').css('width', globalVal.contentDivWidth + '%');
}