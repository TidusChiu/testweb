var wt = new WindowTuning();
var pb = new PauseBlock();
var gc = new GameControl();
var gos = new GameOthers();

var tank = new Tank();


var scoreLabelLength = null;

window.onload = function(){
	wt.init();
	pb.init();
	gc.init();
	gos.init();
}

window.onkeydown = function(){
	if(gc.gameIsStart){
		var key = window.event.keyCode;
		for(var i = 0;i < gc.weaponList.length;i++){
			var weapon = gc.weaponList[i];
			if(key == weapon.wpHotKey && !weapon.wpIsLock){
				if(tank.score - weapon.wpCost >= 0){
					if(weapon.wpCDNow == 0){
						weapon.useWeapon();
					}else{
						console.log('CD ing...');
					}
				}else{
					console.log('Score is not enough.');
				}
			}
		}
	}
}

function test(){
	tank.addScore(500);
}