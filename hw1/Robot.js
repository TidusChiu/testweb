function Robot(){
	this.imgRobot = null;
	this.imgSrc = 'images/robot.png';
	
	this.life = null;
	this.atkRange = null;
	
	this.limX = null;
	this.limY = null;
	
	this.stayX = null;
	this.stayY = null;
	this.corrX = null;
	this.corrY = null;
	this.targetX = null;
	this.targetY = null;
	
	
	this.timer = null;
	this.interval = null;
	this.moveUnit = null;
	this.moveTotal = null;
	
	this.moveRandomMode = null; //true: random   false:target
	this.scaleMode = null; //-1: (0.9,1.1)  1: (1.1,0.9)
	
	this.timerCD = null;
	
	this.timerRand = null;
	this.randInterval = null;
	
	this.beAtkQ = null;
	
	this.init = function(){
		this.imgRobot = document.createElement('img');
		var divGameWindow = document.getElementById('divGameWindow');
		divGameWindow.appendChild(this.imgRobot);
		
		this.imgRobot.src = this.imgSrc;
		this.imgRobot.style.position = 'absolute';
		
		var limit = wt.getGameWindowLimit();
		this.limX = limit[0];
		this.limY = limit[1];
		
		this.corrX = this.imgRobot.width / 2;
		this.corrY = this.imgRobot.height / 2;
		
		var randPos = this.getRandomPos();
		this.stayX = randPos[0] + this.corrX;
		this.stayY = randPos[1] + this.corrY;
		
		this.imgRobot.style.left = (this.stayX - this.corrX) + "px";
		this.imgRobot.style.top = (this.stayY - this.corrY) + "px";
		
		this.interval = 30;
		this.moveUnit = gc.robotNormalMspd;
		this.moveTotal = 0;
		
		this.moveRandomMode = false;
		this.scaleMode = 1;
		
		this.atkRange = 25;
		
		this.randInterval = 5000;
		
		this.beAtkQ = false;
		
		var t = this;
		this.timerRand = window.setInterval(function(){
			t.changeMoveRandMode();
		},this.randInterval);
	}
	
	this.changeMoveRandMode = function(){
		this.moveRandomMode = !this.moveRandomMode;
	}
	
	this.startMove = function(){
		var t = this;
		t.timerCD = window.setInterval(function(){
			t.moveEffect();
		}, gc.robotStartUp);
		
	}
	
	this.getStayPos = function(){
		var pos = new Array();
		pos[0] = this.stayX;
		pos[1] = this.stayY;
		return pos;
	}
	
	this.searchTank = function(){
		var target = tank.getStayPos();
		this.targetX = target[0];
		this.targetY = target[1];
		
	}
	
	this.getRandomPos = function(){
		var randPos = new Array();
		randPos[0] = parseInt(Math.random() * this.limX + 1);
		randPos[1] = parseInt(Math.random() * this.limY + 1);
		return randPos;
	}
	
	this.moveEffect = function(){
		
		if(this.timerCD != null){
			window.clearInterval(this.timerCD);
		}
		
		if(this.timer != null){
			this.moveTotal = 0;
			window.clearInterval(this.timer);
		}
		
		if(this.moveRandomMode){
			var randPos = this.getRandomPos();
			this.targetX = randPos[0];
			this.targetY = randPos[1];
		}else{
			this.searchTank();
		}
		
		var dx = this.targetX - this.stayX;
		var dy = this.targetY - this.stayY;
		var dst = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));
		
		if(dx >= 0){
			this.scale(-1); //翻轉
		}else{
			this.scale(1); //回複翻轉
		}
		
		var deg = Math.acos(dx / dst) * (180 / Math.PI);
		
		if(dy < 0){
			deg *= -1;
		}
		
		console.log('robot deg:'+deg);
		
		var t = this;
		this.timer = window.setInterval(function(){
			t.move(deg,dst);
		},this.interval);
		
	}
	
	this.move = function(deg, dst){
		var angle = deg * (Math.PI / 180);
		var mu = this.moveUnit;
		var stop = false;
		
		if(dst - this.moveTotal < this.moveUnit){
			mu = dst - this.moveTotal;
			stop = true;
		}
		
		var moveX = Math.cos(angle) * mu;
		var moveY = Math.sin(angle) * mu;
		
		this.stayX +=  moveX;
		this.stayY +=  moveY;
		
		this.imgRobot.style.left = (this.stayX - this.corrX) + "px";
		this.imgRobot.style.top = (this.stayY - this.corrY) + "px";
		this.moveTotal += mu;
		
		var crashed = false;
		var tankPos = tank.getStayPos();
		var crashDst = Math.sqrt(Math.pow(tankPos[0] - this.stayX,2) + Math.pow(tankPos[1] - this.stayY,2));
		
		if(crashDst <= this.atkRange){
			stop = true;
			crashed = true;
		}
		
		var weapon = gc.weaponList[0];
		var atkQ = false;
		if(weapon.wpObject != null){
			var missilePos = weapon.wpObject.getStayPos();
			var atkQDst = Math.sqrt(Math.pow(missilePos[0] - this.stayX,2) + Math.pow(missilePos[1] - this.stayY,2));
			if(atkQDst <= weapon.wpObject.atkRange){
				stop = true;
				atkQ = true;
			}
		}
		
		
		
		if(stop){
			this.moveTotal = 0;
			window.clearInterval(this.timer);
			if(crashed || !gc.gameIsStart){
				this.delRobot();
			}else if(atkQ){
				weapon.effectTimeNow = weapon.effectTime;
				var t = this;
				var reboundAngle = gc.weaponList[0].wpObject.angle;
				console.log('rebound angle:'+reboundAngle * (180 / Math.PI));
				var reboundDst = gc.weaponList[0].wpObject.reboundDst;
				
				this.timer = window.setInterval(function(){
					t.goBack(reboundAngle,reboundDst);
				},30);
				
				weapon.wpObject.delMissile();
			}else{
				if(this.moveRandomMode){
					this.moveUnit = gc.robotCrazyMspd;
				}else{
					this.moveUnit = gc.robotNormalMspd;
				}
				this.moveEffect();
			}
		}
	}
	
	this.goBack = function(angle,dst){
		this.moveRandomMode = false;
		if(gc.weaponList[0].effectTimeNow > 0){
			
			
			var moveX = dst * Math.cos(angle);
			var moveY = dst * Math.sin(angle);
			this.stayX += moveX;
			this.stayY += moveY;
			this.imgRobot.style.left = (this.stayX - this.corrX) + "px";
			this.imgRobot.style.top = (this.stayY - this.corrY) + "px";
			gc.weaponList[0].effectTimeNow -= 30 / 1000;
		}else{
			window.clearInterval(this.timer);
			this.moveEffect();
		}
	}
	
	this.scale = function(x){
		this.imgRobot.style.webkitTransform = 'scale(' + x + ',1)';
	}
	
	this.delRobot = function(){
		if(this.timerCD != null){
			window.clearInterval(this.timerCD);
		}
		
		if(this.timer != null){
			window.clearInterval(this.timer);
		}
		
		if(this.timerRand != null){
			window.clearInterval(this.timerRand);
		}
		
		if(gc.gameIsStart){
			tank.beHit();
		}
		
		gc.robotAmount--;
		wt.gameWindow.removeChild(this.imgRobot);
		delete this;
		return;
	}
}