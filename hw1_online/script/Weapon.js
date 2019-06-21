function Weapon(){
	this.wpListIdx = null;
	
	this.wpIsSetting = null; //T or F
	this.wpIsLock = null; //T or F
	
	this.wpHotKey = null;
	this.wpName = null;
	this.wpCost = null;
	this.wpCD = null;
	this.wpCDNow = null;
	
	this.wpIcon = null;
	this.wpUsedImg = null;
	
	this.wpContent = null;
	
	this.timer = null;
	this.interval = null;
	
	this.wpObject = null;
	
	this.effectTime = null;
	this.effectTimeNow = null;
	
	this.init = function(hotkey, name, cost, cooldown, icon, usedImg, effectTime, isLock, content){
		this.wpHotKey = hotkey;
		this.wpName = name;
		this.wpCost = cost;
		this.wpCD = cooldown;
		this.wpCDNow = 0;
		this.wpIcon = icon;
		this.wpUsedImg = usedImg;
		this.effectTime = effectTime;
		this.effectTimeNow = 0;
		this.wpIsLock = isLock;
		
		this.wpContent = content;
		this.interval = 50;
		
		this.wpIsSetting = true;
	}
	
	this.useWeapon = function(){
		console.log('Use weapon: ' + this.wpName);
		var successful = false;
		switch(this.wpHotKey){
			case 81:
				var missile = new Missile();
				missile.init();
				successful = true;
				break;
			case 87:
				this.wpObject = new SpeedWeapon();
				this.effectTimeNow = this.effectTime;
				this.wpObject.init(this);
				successful = true;
				break;
			case 69:
				this.wpObject = new HealWeapon();
				this.wpObject.init();
				successful = true;
				break;
			case 82:
				this.wpObject = new Shield();
				this.effectTimeNow = this.effectTime;
				this.wpObject.init(this);
				successful = true;
				break;
		}
		if(successful){
			tank.costScore(this.wpCost);
			this.wpCDNow = this.wpCD;
			this.displayCD();
			var t = this;
			this.timer = window.setInterval(function(){
				t.reduceCD();
			},this.interval);
		}
	}
	
	this.reduceCD = function(){
		var reduce = this.interval / 1000;
		if(this.wpCDNow - reduce > 0){
			this.wpCDNow -= reduce;
		}else{
			this.wpCDNow = 0;
			if(this.timer != null){
				window.clearInterval(this.timer);
			}
		}
		this.displayCD();
	}
	
	this.displayCD = function(){
		var idx = this.wpListIdx;
		var cvs = gos.cvsWeapon[idx];
		var ctx = cvs.getContext('2d');
		ctx.clearRect(0, 0, cvs.width, cvs.height);
		gos.drawWeaponIcon(cvs, idx);
	}
	
}
///////////////////////////////////////////////////////////////////////////
function Missile(){
	this.imgMissile = null;
	
	this.selfKill = null;
	this.damage = null;
	
	this.atkRange = null;
	this.reboundDst = null;
	this.reboundTimer = null;
	
	this.timer = null;
	this.interval = null;
	this.moveUnit = null;
	
	this.stayX = null;
	this.stayY = null;
	this.corrX = null;
	this.corrY = null;
	
	this.angle = null;
	
	this.moveLimit = null;
	this.moveTotal = null;
	
	
	this.init = function(){
		
		this.selfKill = false;
		this.damage = 0;
		
		this.atkRange = 16;
		this.reboundDst = 50;
		this.moveLimit = 300;
		
		this.imgMissile = document.createElement('img');
		this.imgMissile.src = gc.weaponList[0].wpUsedImg;
		this.imgMissile.width = this.atkRange;
		this.imgMissile.height = this.atkRange;
		wt.gameWindow.appendChild(this.imgMissile);
		this.imgMissile.style.position = 'absolute';
		
		this.corrX = this.imgMissile.width / 2;
		this.corrY = this.imgMissile.height / 2;
		
		var dx = wt.x - tank.stayX;
		var dy = wt.y - tank.stayY;
		
		var dst = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));
		var deg = tank.getDegree(dx, dy, dst);
		
		this.angle = deg * (Math.PI / 180);
		
		
		var startDst = tank.corrX + this.corrX;
		
		this.stayX = tank.stayX + Math.cos(this.angle) * startDst;
		this.stayY = tank.stayY + Math.sin(this.angle) * startDst;
		
		this.rotate(deg);
		
		tank.rotate(deg);
		
		this.imgMissile.style.left = (this.stayX - this.corrX) + 'px';
		this.imgMissile.style.top = (this.stayY - this.corrY) + 'px';
		
		this.interval = 30;
		this.moveUnit = 10;
		
		this.moveTotal = 0;
		
		gc.startSE('audioMissile');
		
		var t = this;
		this.timer = window.setInterval(function(){
			t.move(t.angle,t.moveLimit);
		},this.interval);
		
		connect.updateMissile(deg);
		
	}
	
	this.serverInit = function(en,deg){
		this.selfKill = true;
		this.damage = 1;
		
		this.atkRange = 16;
		this.reboundDst = 40;
		this.moveLimit = 300;
		
		this.imgMissile = document.createElement('img');
		this.imgMissile.src = gc.weaponList[0].wpUsedImg;
		this.imgMissile.width = this.atkRange;
		this.imgMissile.height = this.atkRange;
		wt.gameWindow.appendChild(this.imgMissile);
		this.imgMissile.style.position = 'absolute';
		
		this.corrX = this.imgMissile.width / 2;
		this.corrY = this.imgMissile.height / 2;
		
		this.angle = deg * (Math.PI / 180);
		
		var startDst = en.corrX + this.corrX;
		
		this.stayX = en.stayX + Math.cos(this.angle) * startDst;
		this.stayY = en.stayY + Math.sin(this.angle) * startDst;
		
		this.rotate(deg);
		
		en.rotate(deg);
		
		this.imgMissile.style.left = (this.stayX - this.corrX) + 'px';
		this.imgMissile.style.top = (this.stayY - this.corrY) + 'px';
		
		this.interval = 30;
		this.moveUnit = 10;
		
		this.moveTotal = 0;
		
		gc.startSE('audioMissile');
		
		var t = this;
		this.timer = window.setInterval(function(){
			t.move(t.angle,t.moveLimit);
		},this.interval);
		
	}
	
	this.getStayPos = function(){
		var pos = new Array();
		pos[0] = this.stayX;
		pos[1] = this.stayY;
		return pos;
	}
	
	this.rotate = function(deg){
		this.imgMissile.style.webkitTransform = 'rotate(' + deg + 'deg)';
	}
	
	this.move = function(angle,dst){
		var mu = this.moveUnit;
		var stop = false;
		
		if(dst - this.moveTotal < this.moveUnit){
			mu = dst - this.moveTotal;
			stop = true;
		}
		
		this.stayX +=  Math.cos(angle) * mu;
		this.stayY +=  Math.sin(angle) * mu;
		
		this.imgMissile.style.left = (this.stayX - this.corrX) + "px";
		this.imgMissile.style.top = (this.stayY - this.corrY) + "px";
		this.moveTotal += mu;
		
		if(this.selfKill){
			var missilePos = this.getStayPos();
			var tankPos = tank.getStayPos();
			var bothDst = Math.sqrt(Math.pow(missilePos[0] - tankPos[0],2) + Math.pow(missilePos[1] - tankPos[1],2));
			if(bothDst <= this.atkRange){
				stop = true;
				this.reboundEffect(tank);
				tank.beHit(this.damage);
			}
		}else{
			var missilePos = this.getStayPos();
			var enemyMax = enemy.length;
			for(var i = 0;i < enemyMax;i++){
				var enemyPos = enemy[i].getStayPos();
				var bothDst = Math.sqrt(Math.pow(missilePos[0] - enemyPos[0],2) + Math.pow(missilePos[1] - enemyPos[1],2));
				if(bothDst <= this.atkRange){
					gc.startSE('audioBeHit');
					stop = true;
				}
			}
		}
		
		if(stop){
			this.moveTotal = 0;
			window.clearInterval(this.timer);
			console.log('move ending');
			this.delMissile();
		}
	}
	
	this.reboundEffect = function(obj){
		gc.weaponList[0].effectTimeNow = gc.weaponList[0].effectTime;
		var t = this;
		this.reboundTimer = window.setInterval(function(){
			t.rebound(obj);
		},30);
	}
	
	this.rebound = function(obj){
		
		if(obj.timer != null){
			obj.moveTotal = 0;
			window.clearInterval(obj.timer);
		}
		
		if(gc.weaponList[0].effectTimeNow > 0){
			tank.move(this.angle, this.reboundDst, true);
			gc.weaponList[0].effectTimeNow -= 30 / 1000;
		}else{
			window.clearInterval(this.reboundTimer);
		}
	}
	
	this.delMissile = function(){
		if(this.timer != null){
			window.clearInterval(this.timer);
		}
		
		if(wt.gameWindow == this.imgMissile.parentNode){
			wt.gameWindow.removeChild(this.imgMissile);
		}
		
		if(gc.weaponList[0].wpObject != null){
			gc.weaponList[0].wpObject = null;
		}
		
		delete this;
		return;
	}
}

function HealWeapon(){
	
	this.healUnit = null;
	
	this.init = function(){
		
		this.healUnit = 3;
		tank.heal(this.healUnit);
		gc.startSE('audioHealing');
	}
	
}

function SpeedWeapon(){
	
	this.speedUpRate = null;
	this.acc = null;
	this.timer = null;
	this.wp = null;
	
	this.init = function(wp){
	
		this.wp = wp;
		
		this.speedUpRate = 70;
		this.acc = tank.moveUnit * (this.speedUpRate / 100);
		
		tank.speedup(this.acc);
		
		gc.startSE('audioBoostOn');
		
		var t = this;
		this.timer = window.setInterval(function(){
			t.spdUpTiming();
		},30);
		
	}
	
	this.spdUpTiming = function(){
		if(this.wp.effectTimeNow > 0){
			this.wp.effectTimeNow -= 30 / 1000;
		}else{
			window.clearInterval(this.timer);
			var down = this.acc * -1;
			tank.speedup(down);
			this.acc = 0;
			gc.startSE('audioBoostOff');
		}
	}
	
}

function Shield(){
	
	this.imgShield = null;
	this.cvs = null;
	this.ctx = null;
	
	this.wp = null;
	this.timer = null;
	
	this.stayX = null;
	this.stayY = null;
	this.corrX = null;
	this.corrY = null;
	
	this.bonus = null;
	
	this.init = function(wp){

		this.cvs = document.createElement('canvas');
		this.ctx = this.cvs.getContext('2d');
		
		
		var width = tank.imgTank.width * 2;
		this.cvs.width = width;
		this.cvs.height = width;
		wt.gameWindow.appendChild(this.cvs);
		this.cvs.style.position = 'absolute';
		
		this.corrX = this.cvs.width / 2;
		this.corrY = this.cvs.height / 2;
		
		
		this.ctx.fillStyle = '#ff7799';
		this.ctx.globalAlpha = 0.5;
		this.ctx.beginPath();
		this.ctx.arc(this.corrX, this.corrY, width / 2, 0 * Math.PI, 2 * Math.PI);
		this.ctx.fill();
		
		this.wp = wp;
		this.bonus = 50;
		
		tank.shield = true;
		
		this.shieldEffect();
		
		var t = this;
		this.timer = window.setInterval(function(){
			t.shieldTiming();
		},30);
		
	}
	
	this.setShieldPos = function(){
		var pos = tank.getStayPos();
		this.stayX = pos[0];
		this.stayY = pos[1];
		
	}
	
	this.rotate = function(){
		
	}
	
	this.shieldEffect = function(){
		this.setShieldPos();
		this.cvs.style.left = (this.stayX - this.corrX) + 'px';
		this.cvs.style.top = (this.stayY - this.corrY) + 'px';
	}
	
	this.shieldTiming = function(){
		if(this.wp.effectTimeNow > 0){
			this.wp.effectTimeNow -= 30 / 1000;
			this.shieldEffect();
		}else{
			window.clearInterval(this.timer);
			this.shieldEnd();
			tank.shield = false;
		}
	}
	
	this.shieldEnd = function(){
		wt.gameWindow.removeChild(this.cvs);
		delete this;
		return;
	}
	
}