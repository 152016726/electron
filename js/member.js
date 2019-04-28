/**
 * Created by Administrator on 2018/4/20.
 */

var childProcess = require('child_process');
var core = childProcess.fork(config.member_core_url);
//var core = childProcess.fork('./js/member_core.js');

module.exports = {
    /*
     说明: 随机返回原始数据中的某些行(平均分布)
     lines: 返回多少行数据 (int)
     */
    readData: function (lines) {
        let def = new Promise(function (resolve, reject) {
            core.send({
                method: "readData",
                lines: lines
            });
            core.once("message", (msg) => {
                if(msg.method === "readData" && msg.result !== "fail"){
                    resolve(msg.result);
                }else{
                    reject();
                }
            });
        });
        return def;
    },
    /*
     说明: 抽奖
     参数: times: 抽奖次数
     */
    draw: function(times){
        let def = new Promise(function (resolve, reject) {
            core.send({
                method: "draw",
                times: times
            });
            core.once("message", (msg) => {
                if(msg.method === "draw" && msg.result !== "fail"){
                    resolve(msg.result);
                }else{
                    reject();
                }
            });
        });
        return def;
    },
    /*
     说明: 导出数据到txt, 现在已经放弃了啦~~~
     */
    exportData: function(){}
};