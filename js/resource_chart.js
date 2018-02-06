/**
 * author: magicV
 * create: 2018-02-06
 */

// Base Class
class Task {
    constructor(name = '', processor = '', start = new Date(), end = new Date(), release = new Date(), type = '', duration = '', tag = '', remark = '') {
        this.taskName = name; //任务名称
        this.processor = processor; //处理人
        this.startTime = start; //开始时间
        this.endTime = end; //结束时间
        this.releaseTime = release; //发布时间
        this.taskType = type; //任务类型
        this.duration = duration; //持续时长
        this.taskTag = tag; //标签
        this.remark = remark; //备注信息
    }
}

/* Public Function */