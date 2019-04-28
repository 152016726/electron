setTimeout(function () {
    /**
     * Created by DDT on 2018/3/26.
     */
    var drawCanvas = require('../modules/drawCanvas');
    var data_manger = require("../js/member.js");
    var excel = require("../js/excel.js");
    var fs = require("fs");
    var path = require('path');
    var cmd = require('node-cmd');
    var speed = drawCanvas.speed;
    var createHTML = drawCanvas.createHTML;
    var lottery = drawCanvas.lottery;
    var canvas = document.createElement('canvas');
    var flag = true;
    var lottolist = [];
    canvas.id = 'myCanvas';
    canvas.width = 550;
    canvas.height = 550;
    canvas.style.borderRadius = '50%';
    document.getElementById('main').appendChild(canvas);

    new Vue({
        el: '#tools',
        data: {
            excelfilePath: '',
            selected: 1,//中奖人数
            str: '',//同阶段累计多次抽奖的中奖名单
            running: false,//是否开始抽奖
            pointFlag:true,
            nums: [1, 2, 3, 4, 5, 6],//可选中奖人数
            isShowSetNum: false,//是否显示设置人数界面
            isDoing: true,//
            isLoading: false,//正在加载
            TotalWinList: [],//同阶段累计获奖者名单
            luckyman: '',//单次中奖的获奖者
            isShowtips: false,//显示另存为提示
            isErrors: false,//错误提示
            isShowlottery: false,
            screenWidth: document.body.clientWidth
        },
        ready: function () {
            canvas.innerHTML = createHTML();
            TagCanvas.Start('myCanvas', '', {
                textColour: null,
                initial: speed(),
                dragControl: 1,
                textHeight: 14
            });
        },
        methods: {
            reset: function () {
                if(confirm('请确认是否需要打印')){
                    $('#result').show();
                }else{
                    window.close();
                }
            },
            toggle: function () {
                var _this = this;
                if (_this.running) {
                    /*中奖人员计算方法*/
                    //_this.running = true;
                    if(_this.pointFlag){
                        _this.pointFlag=false;
                        data_manger.draw(_this.selected).then(function (val) {
                            for (var i = 0; i < val.length; i++) {
                                _this.TotalWinList.push(val[i]);
                            }

                            /*中奖人员渲染在页面*/
                            var word = '';
                            for (var i = 0; i < val.length; i++) {
                                var text = '<li><div class="city">' + val[i][4] + '</div><div class="num">' + val[i][0] + val[i][1] + '</div><div class="time">' + val[i][2] + '</div><div class="amount">' + val[i][3] + '</div></li>';
                                _this.str += text;
                            }
                            for (var i = 0; i < val.length; i++) {
                                var text = '<span>' + val[i][4] + '&nbsp;' + '&nbsp;' + val[i][0] + val[i][1] + '&nbsp;' + '&nbsp;' + val[i][2] + '&nbsp;' + '&nbsp;' + '￥' + val[i][3] + '</span>';
                                word += text;
                            }
                            _this.isShowlottery = true;
                            TagCanvas.Reload('myCanvas');
                            $('.mask').show();
                            _this.running = false;
                            _this.pointFlag=true;
                            _this.luckyman = word;
                            TagCanvas.SetSpeed('myCanvas', speed());
                            $('#result .excelcontent').html(_this.str);

                        }, function () {
                            _this.isErrors = true;
                            console.log("error");
                        });
                    }
                } else {
                    _this.running = true;
                    _this.isShowSetNum = false;
                    _this.isShowlottery = false;
                    $('#result').hide();
                    $('.mask').hide();
                    TagCanvas.SetSpeed('myCanvas', [5, 1]);
                }

            },
            jump: function () {
                this.isShowlottery = false;
                $('#result').show();
            },
            print: function () {
                if (confirm('是否确认要打印？')) {
                    var _this = this;
                    if (_this.isDoing) {
                        _this.isLoading = true;
                        _this.isDoing = false;

                        var cp = require('child_process');
                        var n = cp.fork(config.forkPath);//相对于打包环境之后的绝对路径

                        n.on('message', function (m) {
                            _this.excelfilePath = m;//相对于打包环境中的路径当前为resource/app/excelfile/体育彩票...js需要跳至resource的临文件夹excelfile/体育彩票...js中去
                            _this.isLoading = false;
                            _this.isDoing = true;
                            _this.isShowtips = true;
                        });
                        n.send(_this.TotalWinList);
                    }
                }

            },
            closeTips: function () {
                let src = path.join(__dirname);
                src = src.substring(0, src.length - 19);
                let file_path = this.excelfilePath.split(/\/|\\/g);
                for(let i = 0; i < file_path.length - 1; i++){
                    src = src + file_path[i] + "/";
                }
                cmd.run('start ' + src);
                flag = false;
                this.isShowtips = false;
            },
            close: function () {
                $('#result').hide();
                $('.mask').hide();

            },
            IsSetNum: function () {
                this.isShowSetNum = !this.isShowSetNum;
            },
            setNum: function (val) {
                this.selected = val ? val : 1;
            }
        },
        created: function () {
            $(".beforeloading").hide();
        },
        mounted: function () {
            const that = this;
            window.onresize = () => {
                return (() => {
                    window.screenWidth = document.body.clientWidth;
                    that.screenWidth = window.screenWidth;
                })()
            }
        },
        watch: {
            screenWidth(val) {
                this.screenWidth = val
            }
        }
    });
}, 1000)