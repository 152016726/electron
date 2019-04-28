/**
 * Created by DDT on 2018/3/26.
 */
var choosed = JSON.parse(localStorage.getItem('choosed')) || {};
var member = JSON.parse(localStorage.getItem('OEM')) || {};
var speed = function() {
    return [0.1 * Math.random() + 0.01, -(0.1 * Math.random() + 0.01)];
};
var getKey = function(item) {
    return item[0] + '-' + item[1];
};
var createHTML = function() {
    var html = ['<ul>'];
    member.forEach(function(item, index) {
        item.index = index;
        var key = getKey(item);
        var color = choosed[key] ? 'yellow' : 'white';
        //var colorList=['hotpink','skyblue'];colorList[ Math.round(Math.random()*1)]
        html.push('<li><a href="#" style="color: ' +color+ ';">' + item[0] + item[1] + '</a></li>');
    });
    html.push('</ul>');
    return html.join('');
};
var lottery = function(canvas, count) {
    var total = member.length;
    var ret = [];
    var list = canvas.getElementsByTagName('a');
    var color = '#' + ('00000' + Math.floor(Math.random() * 0xffffff)).slice(-6);
    //var color = 'yellow';
    for (var i = 0; i < count; i++) {
        do {
            var id = Math.ceil(Math.random() * total);
            if (member[id]) {
                var key = member[id][0] + '-' + member[id][1];
            }
        } while (choosed[key]);
        choosed[key] = 1;
        ret.push(member[id][0] + '-' + member[id][1]);
        list[id].style.color = color;
    }
    localStorage.setItem('choosed', JSON.stringify(choosed));
    return { "winner": ret };
};

module.exports = {
    speed: speed,
    createHTML: createHTML,
    lottery: lottery
};