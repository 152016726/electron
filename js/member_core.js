let fs = require("fs");
let iconv = require('iconv-lite');
iconv.skipDecodeWarning = true;

let data_all = false; // 所有参与抽奖的名单
let data_win_his = false; // 获取历史获奖名单
let data_can_draw = false; // 符合抽奖条件名单
let data_win_now = []; // 记录当期抽到奖的人
let area_draw = []; // 中过奖的区 [区号1, 区号2, ...]
let side_can_not_draw = []; // 所有中过奖的id
let session = false; // 记录这是第几期抽奖
let config = require("./config.js");
let Q = require("q");


function DataManager() {
    let _this = this;

    this.getAllDataFail = function (method_name) {
        process.send({
            method: method_name,
            result: "fail"
        });
    };

    // data 存在时代表本期抽到中奖的人
    function DrawRemark(area, side, data){
        area_draw.push(area);
        side_can_not_draw.push(side);
        data && data_win_now.push(data);
    }

    /*
        说明: 获取所有参加抽奖的人员名单
    */
    this.getAllData = function () {
        let def = new Promise(function (resolve, reject) {
            fs.readFile(config.dataPath, 'binary', function (err, _data) {
                if (err) {
                    reject();
                } else {
                    let data = iconv.decode(_data, 'GBK');
                    let arr = data.toString().split("\r\n");
                    let result = [];
                    for (let i = 1; i < arr.length; i++) {
                        if(arr[i] !== "") {
                            let buffer = arr[i].split(",");
                            let _arr = [];
                            _arr.push(buffer[1].substring(0, 5)); // 区编号
                            _arr.push(buffer[1].substring(5, buffer[1].length)); // 售货机编号
                            buffer[2] = buffer[2].length >
                            _arr.push(buffer[2]); // 日期
                            _arr.push(buffer[3]); // 金额
                            _arr.push(buffer[0]); // 区名字
                            result.push(_arr);
                        }
                    }
                    resolve(result);
                }
            });
        });
        return def;
    };

    /*
        说明: 随机返回原始数据中的某些行
        data: 原始数据 (array)
        lines: 返回多少行数据 (int)
    */
    this.readRandomPartOfData = function (data, lines) {
        if (!!lines === false || lines === data.length) {
            return data;
        }
        let length = data.length;
        let step = Math.floor(length / lines);
        let result = [];
        for (let i = 1; i <= lines; i++) {
            let item;
            if (i == lines) {
                item = Math.floor((step * (i - 1)) + ((step + (length % lines)) * Math.random()));
            } else {
                item = Math.floor((step * (i - 1)) + (step * Math.random()));
            }
            result.push(data[item]);
        }
        return result;
    };

    /*
        说明: 开始抽奖
     */
    this.startDraw = function(){
        if(data_can_draw.length == 0){
            return false;
        }
        let index = Math.floor(Math.random() * data_can_draw.length);
        DrawRemark(data_can_draw[index][0], data_can_draw[index][0] + data_can_draw[index][1], data_can_draw[index]);
        return data_can_draw[index];
    };

    /*
        说明: 找出符合抽奖条件的名单
     */
    this.whoCanDraw = function(){
        // 更新一次
        data_can_draw = data_can_draw.filter(function(can_draw_val){
            let flag2 = area_draw.findIndex(function(area_val){
                return area_val == can_draw_val[0];
            });
            return flag2 == -1;
        });
    };

    function init() {
        let def = new Promise(function(resolve, reject){
            let def_all = _this.getAllData(); // 获取全部参与抽奖的人员名单
            Promise.all([def_all]).then(function(values){
                data_all = values[0];
                data_can_draw = data_all;
                resolve();
            }, reject);
        });
        return def;
    }

    this.init_def = init();
}

let dm = new DataManager();

process.on('message', function(msg){
    switch(msg.method){
        /*
            说明: 随机返回原始数据中的某些行(平均分布)
            lines: 返回多少行数据 (int)
        */
        case "readData": {
                dm.init_def.then(function(){
                    process.send({
                        method: "readData",
                        result: dm.readRandomPartOfData(data_all, msg.lines)
                    });
                }, function(){
                    dm.getAllDataFail("readData");
                });
            break;
        }
        /*
            说明: 抽奖
            参数: times: 抽奖次数
        */
        case "draw": {
            let result = [];
            for(let i = 0; i < msg.times; i++){
                dm.whoCanDraw();
                let r = dm.startDraw();
                if(!!r) {
                    //console.log(area_draw);
                    result.push(r);
                }else if(result.length === 0){
                    dm.getAllDataFail("draw");
                }
            }
            process.send({
                method: "draw",
                result: result
            });
            break;
        }
        default: {

        }
    }
});






























