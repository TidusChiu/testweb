var div = null;
var timer = null;

var hourHand = null;
var minuteHand = null;
var secondHand = null;

function count(){
    var date = new Date();
    var hh = date.getHours();
    var mm = date.getMinutes();
    var ss = date.getSeconds();
    var ms = date.getMilliseconds();
    
    var hourDeg = ( ( hh % 12 ) + mm / 60 ) * 30;
    var minuteDeg = ( mm + ss / 60 ) * 6;
    var secondDeg = ( ss + ms / 1000 ) * 6;
    
    hourHand.style.webkitTransform = "rotate(" + hourDeg + "deg)";
    minuteHand.style.webkitTransform = "rotate(" + minuteDeg + "deg)";
    secondHand.style.webkitTransform = "rotate(" + secondDeg + "deg)";
    
    if(hh < 10){
        hh = "0" + hh;
    }
    if(mm < 10){
        mm = "0" + mm;
    }
    if(ss < 10){
        ss = "0" + ss;
    }
    div.innerHTML = hh + ":" + mm + ":" + ss;
}

function start_count(){
    count();
    timer = window.setInterval(count, 10);
}

function stop_count(){
    window.clearInterval(timer);
}

window.onload = function(){
    div = document.getElementById('div_counter');
    hourHand = document.getElementById('hour_hand');
    minuteHand = document.getElementById('minute_hand');
    secondHand = document.getElementById('second_hand');
}