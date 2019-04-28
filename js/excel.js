/**
 * Created by ljx on 2018/3/30.
 */


var cp = require('child_process');
var config = require('./config.js');

process.on('message', function (event) {
    var Excel = require('exceljs');

    function setExcel() {
        var date = new Date();
        var destPath = config.excel_save_as_path + "体育彩票中奖名单_" + date.getFullYear() + (date.getMonth() + 1) + date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds() + ".xlsx";
        var workbook = new Excel.Workbook();//创建模板对象
        var options = {
            filename: destPath,
            useStyles: true,
            useSharedStrings: true
        };
        var WorkbookWriter = new Excel.stream.xlsx.WorkbookWriter(options);//创建写入流

        WorkbookWriter.creator = 'Me'; //style设定（无意义可不写）
        WorkbookWriter.lastModifiedBy = 'Her';
        WorkbookWriter.created = new Date(1985, 8, 30);
        WorkbookWriter.modified = new Date();
        WorkbookWriter.lastPrinted = new Date(2016, 9, 27);
        WorkbookWriter.views = [
            {
                x: 0, y: 0, width: 10000, height: 20000,
                firstSheet: 0, activeTab: 1, visibility: 'visible'
            }
        ];

        this.readFile = function () { //读取模板，传递模板和stream流
            let def = new Promise(function (res, rej) {

                workbook.xlsx.readFile(config.excelTemplatePath)
                    .then(function () {
                        // use workbook
                        res([WorkbookWriter, workbook])
                    }, function () {
                        rej()
                    });
            });
            return def;
        };
        this.setJoinerSheets = function ([WorkbookWriter,arr,workbook]) {//将模板与stream流挂钩生成新的excel
            let def = new Promise(function (res, rej) {
                Promise.all([WorkbookWriter, arr, workbook]).then(function (values) {

                    function setjoiner() {
                        var worksheet = values[2].getWorksheet('原始数据');//获取模板的样式

                        var workbookWritersheet = values[0].addWorksheet('原始数据', {
                            pageSetup: {paperSize: 9, orientation: 'landscape'}
                        });
                        workbookWritersheet.columns = [
                            {header: '123', key: 'id', width: 8.63},
                            {header: '123', key: 'NO', width: 16.63},
                            {header: '123', key: 'amount', width: 14.25},
                            {header: '123', key: 'date', width: 39}
                        ];

                        var text = worksheet.getRow(1).getCell(1).value;

                        workbookWritersheet.mergeCells('A1:D1');
                        workbookWritersheet.getCell('A1').master.value = text;
                        workbookWritersheet.getRow(1).height = 27;

                        var titles = worksheet.getRow(2).values;//获取模板中的样式
                        var fonts1 = worksheet.getRow(1).getCell(1).style;
                        var fonts2 = worksheet.getRow(2).getCell(1).style;

                        workbookWritersheet.getRow(2).values = titles;//将模板中的样式写入新的excel中
                        workbookWritersheet.getRow(1).getCell(1).style = fonts1;
                        workbookWritersheet.getRow(2).getCell(1).style = fonts2;
                        workbookWritersheet.getRow(2).getCell(2).style = fonts2;
                        workbookWritersheet.getRow(2).getCell(3).style = fonts2;
                        workbookWritersheet.getRow(2).getCell(4).style = fonts2;

                    }

                    let joiner = setjoiner();

                    function setWiner() {
                        var workReadersheet = values[2].getWorksheet('抽奖结果');//模板中读取的样式
                        var titles = workReadersheet.getRow(2).values;
                        var fonts1 = workReadersheet.getRow(1).getCell(1).style;
                        var fonts2 = workReadersheet.getRow(2).getCell(1).style;
                        var values1 = workReadersheet.getRow(26).values;
                        var fonts3 = workReadersheet.getRow(26).getCell(5).style;
                        var values2 = workReadersheet.getRow(27).values;
                        var fonts4 = workReadersheet.getRow(27).getCell(5).style;
                        var values3 = workReadersheet.getRow(28).values;
                        var fonts5 = workReadersheet.getRow(28).getCell(5).style;

                        var text = workReadersheet.getRow(1).getCell(1).value;
                        var workWinersheet = values[0].addWorksheet('抽奖结果');//写入新excel中的样式
                        workWinersheet.columns = [
                            {header: '123', key: 'id', width: 8.38},
                            {header: '123', key: 'city', width: 8.38},
                            {header: '123', key: 'NO', width: 14},
                            {header: '123', key: 'amount', width: 16.63},
                            {header: '123', key: 'date', width: 34.75}
                        ];

                        workWinersheet.mergeCells('A1:E1');
                        workWinersheet.getCell('A1').master.value = text;//将模板中的样式写入新的excel中
                        workWinersheet.getRow(1).getCell(1).style = fonts1;
                        workWinersheet.getRow(2).values = titles;
                        workWinersheet.getRow(2).getCell(1).style = fonts2;
                        workWinersheet.getRow(2).getCell(2).style = fonts2;
                        workWinersheet.getRow(2).getCell(3).style = fonts2;
                        workWinersheet.getRow(2).getCell(4).style = fonts2;
                        workWinersheet.getRow(2).getCell(5).style = fonts2;
                        workWinersheet.getRow(26).values = values1;
                        workWinersheet.getRow(26).getCell(5).style = fonts3;
                        workWinersheet.getRow(27).values = values2;
                        workWinersheet.getRow(27).getCell(5).style = fonts4;
                        workWinersheet.getRow(28).values = values3;
                        workWinersheet.getRow(28).getCell(5).style = fonts5;

                        for (let i = 0, item; item = values[1][i++];) {
                            var rowValues = [];
                            rowValues[1] = i;
                            rowValues[2] = values[1][i - 1][4];
                            rowValues[3] = values[1][i - 1][0] + values[1][i - 1][1];
                            rowValues[4] = values[1][i - 1][3];
                            rowValues[5] = values[1][i - 1][2];
                            workWinersheet.getRow(i + 2).values = rowValues;
                            workWinersheet.getRow(i + 2).alignment = {vertical: 'center', horizontal: 'center'};
                        }

                    }

                    let winer = setWiner();

                    Promise.all([joiner, winer]).then(function () {
                        values[0].commit();
                        res(destPath);
                    }, rej);
                }, rej)
            });
            return def;
        }

    }

    let newExcel = new setExcel();

    newExcel.readFile().then(function (values) {
        //console.log(new Date());//计算开始写入时间
        newExcel.setJoinerSheets([values[0], event, values[1]]).then(function (val) {
            process.send(val);
        }, function (err) {
            console.log(err, 'err2');
        });
    }, function (err) {
        console.log(err, 'err1')
    });

});

