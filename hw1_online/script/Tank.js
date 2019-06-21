function Tank(){
	this.imgTank = null;
	this.imgSrc = 'images/tank.png';
	this.markImg = 'images/green_point.png';
	
	this.life = null;
	this.score = null;
	this.surviveTime = null;
	
	this.stayX = null;
	this.stayY = null;
	this.corrX = null;
	this.corrY = null;
	
	this.deg = null;
	
	this.timer = null;
	this.interval = null;
	this.moveUnit = null;
	this.moveTotal = null;
	
	this.shield = null;
	
	this.init = function(){
		this.imgTank = document.createElement('img');
		
		var divGameWindow = document.getElementById('divGameWindow');
		divGameWindow.appendChild(this.imgTank);

		this.imgTank.src = this.imgSrc;
		this.imgTank.style.position = 'absolute';
		
		this.corrX = this.imgTank.width / 2;
		this.corrY = this.imgTank.height / 2;
		
		var limitXY = wt.getGameWindowLimit();
		var randXY = this.getRandomPos(limitXY);
		
		this.stayX = randXY[0];
		this.stayY = randXY[1];
		
		this.deg = 0;
		
		this.imgTank.style.left = (this.stayX - this.corrX) + "px";
		this.imgTank.style.top = (this.stayY - this.corrY) + "px";
		
		this.interval = 30;
		this.moveUnit = gc.tankNormalMspd;
		this.moveTotal = 0;
		
		this.life = gc.tankLifeMax;
		
		this.shield = false;
		
		this.score = 0;
		this.surviveTime = 0;
		
		this.displayScore();
		this.displayLife();
		
		connect.updateTank(this.stayX - this.corrX, this.stayY - this.corrY, this.deg);
		
	}
	
	this.moveEffect = function(){
		
		if(this.timer != null){
			this.moveTotal = 0;
			window.clearInterval(this.timer);
		}
		wt.refreshPos();
		
		var dx = wt.x - this.stayX;
		var dy = wt.y - this.stayY;
		var dst = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));
		
		this.deg = this.getDegree(dx,dy,dst);
		
		var t = this;
		var angle = this.deg * (Math.PI / 180);
		this.timer = window.setInterval(function(){
			t.move(angle,dst,false);
		},this.interval);

	}
	
	this.move = function(angle,dst,otherEffect){
		
		var mu = this.moveUnit;
		
		var stop = false;
		
		if(dst - this.moveTotal < this.moveUnit){
			mu = dst - this.moveTotal;
			stop = true;
		}
		
		this.rotate(this.deg);
		
		if(otherEffect){
			mu = dst;
			stop = true;
		}
		
		this.stayX +=  Math.cos(angle) * mu;
		this.stayY +=  Math.sin(angle) * mu;
		
		this.imgTank.style.left = (this.stayX - this.corrX) + "px";
		this.imgTank.style.top = (this.stayY - this.corrY) + "px";
		this.moveTotal += mu;
		
		if(stop){
			this.moveTotal = 0;
			if(this.timer != null){
				window.clearInterval(this.timer);
			}
		}
		
		connect.updateTankPos(this.stayX - this.corrX, this.stayY - this.corrY, this.deg);
	}
	
	this.rotate = function(deg){
		
		this.imgTank.style.webkitTransform = 'rotate(' + deg + 'deg)';
		connect.updateTankPos(this.stayX - this.corrX, this.stayY - this.corrY, deg);
	}
	
	this.getDegree = function(dx,dy,dst){
		if(dst == 0){
			return 0;
		}
		
		var deg = Math.acos(dx / dst) * (180 / Math.PI);
		
		if(dy < 0){
			deg *= -1;
		}
		
		return deg;
	}
	
	this.getStayPos = function(){
		var pos = new Array();
		pos[0] = this.stayX;
		pos[1] = this.stayY;
		return pos;
	}
	
	this.getRandomPos = function(limit){
		var randPos = new Array();
		randPos[0] = parseInt(Math.random() * limit[0] + 1);
		randPos[1] = parseInt(Math.random() * limit[1] + 1);
		return randPos;
	}
	
	this.beHit = function(dmg){
		
		var gameOver = false;
		
		if(this.life <= 0){
			gameOver = true;
		}
		
		if(this.shield){
			this.addScore(gc.weaponList[3].wpObject.bonus);
		}else if(!gameOver){
			this.life -= dmg;
			gc.startSE('audioBeHit');
		}
		
		if(this.life <= 0){
			gc.startSE('audioCrash');
			gameOver = true;
		}
		
		this.displayLife();
		if(gameOver){
			gc.gameOver();
		}
	}
	
	this.heal = function(addLife){
		this.life += addLife;
		if(this.life > gc.tankLifeMax){
			this.life = gc.tankLifeMax;
		}
		this.displayLife();
	}
	
	this.speedup = function(mu){
		
		this.moveUnit += mu;
		
	}
	
	this.addScore = function(deltaSP){
		this.score += deltaSP;
		this.displayScore();
	}
	
	this.costScore = function(deltaSP){
		if(this.score - deltaSP < 0){
			return false;
		}else{
			this.score -= deltaSP;
			this.displayScore();
			return true;
		}
	}
	
	this.displayScore = function(){
		var cvs = gos.cvsScore;
		var ctx = gos.ctxScore;
		ctx.clearRect(gos.strScoreLength, 0, cvs.width - gos.strScoreLength, cvs.height);
		gos.drawScoreValue(this.score);
	}
	
	this.displayLife = function(){
		if(this.life >= 0){
			var cvs = gos.cvsLife;
			var ctx = gos.ctxLife;
			var lifeUnit = (cvs.width - gos.strLifeLength) / gc.tankLifeMax;
			var gaugeTop = lifeUnit * this.life;
			gos.drawLifeGauge();
			ctx.clearRect(gos.strLifeLength + gaugeTop, 0, cvs.width, cvs.height);
		}
	}
	
	this.delTank = function(){
		wt.gameWindow.removeChild(this.imgTank);
		delete this;
		return;
	}
	
	this.addSurviveTime = function(){
		this.surviveTime += 0.01;
	}
	
	
}
