/**
 * Created by Administrator on 2018/3/26.
 */

var config = {
    session: 3, // 第几期抽奖
    No:"1",
    dataPath: "resources/app/data/data.csv",
    memberPath:"resources/app/js/member_core.js",
    forkPath:"resources/app/js/excel.js",
    excelTemplatePath:"resources/app/excelFile/template/template.xlsx",//excel模板路径
    member_core_url: "resources/app/js/member_core.js",
    excel_save_as_path: "resources/app/excelFile/"
};

//var config = {
//    session: 2, // 第几期抽奖
//    No:"1",
//    dataPath: "./data/data.csv",
//    memberPath:"./js/member_core.js",
//    forkPath:"./js/excel.js",
//    excelTemplatePath:"./excelFile/template/template.xlsx",//excel模板路径
//    outputPath: "./result",
//    backupPath: "./backup", // 每次导出都会做一个备份到这个目录...
//    member_core_url: "./js/member_core.js",
//    excel_save_as_path: "./excelFile/"
//};

module.exports=config;