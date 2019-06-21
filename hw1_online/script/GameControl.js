function GameControl(){
	this.gameIsStart = null;
	
	this.gameStartTimer = null;
	this.gameStartCounter = null;
	
	this.scoreTimer = null;
	this.scoreInterval = null;
	this.scoreAddUnit = null;
	
	this.tankLifeMax = null;
	this.tankNormalMspd = null;
	this.tankSurviveTimer = null;
	
//	this.robotTimer = null;
//	this.robotInterval = null;
//	this.robotStartUp = null;
//	this.robotAmount = null;
//	this.robotMax = null;
//	
//	this.robotNormalMspd = null;
//	this.robotCrazyMspd = null;
	
	
	
	this.weaponList = null;
	
	
	this.init = function(){
		this.gameIsStart = false;
		
		this.gameStartCounter = 3;
		
		this.scoreInterval = 1000;
		this.scoreAddUnit = 10;
		
		this.tankLifeMax = 5;
		this.tankNormalMspd = 5;
		
//		this.robotInterval = 4000;
//		this.robotAmount = 0;
//		this.robotMax = 50;
//		this.robotStartUp = 500;
//		
//		this.robotNormalMspd = 4;
//		this.robotCrazyMspd = 10;
		
		
		this.createWeaponSystem();
	}
	
	this.gameStart = function(){
		if(connect.getStatus() == 1){
			pb.hiddenPause()
			this.gameIsStart = true;
			this.startBGM();
			
			connect.loadEnemy();
			tank.init();
			
			for(var i = 0;i < this.weaponList.length;i++){
				this.weaponList[i].displayCD();
			}
			
			var t = this;
			this.scoreTimer = window.setInterval(function(){
				tank.addScore(t.scoreAddUnit);
			},this.scoreInterval);

			this.tankSurviveTimer = window.setInterval(function(){
				tank.addSurviveTime();
			},10);

//			this.robotTimer = window.setInterval(function(){
//				t.createRobot();
//			},this.robotInterval);
		}
	}
	
	this.gameOver = function(){
		if(this.gameIsStart){
			this.gameIsStart = false;
			this.stopBGM();
			
			connect.socket.close();
//			this.robotAmount = 0;
			window.clearInterval(this.scoreTimer);
			window.clearInterval(this.robotTimer);
			window.clearInterval(this.tankSurviveTimer);
			var surTime = parseInt(tank.surviveTime * 100) / 100;
			tank.delTank();
			var max = enemy.length;
			for(var i = 0;i < max;i++){
				enemy[i].delEnemy();
			}
			enemy = new Array();
			
			//alert('You Survive : ' + surTime + ' seconds !!');
			
			for(var i = 0;i < this.weaponList.length;i++){
				window.clearInterval(this.weaponList[i].timer);
				this.weaponList[i].wpCDNow = 0;
			}
			pb.showPause();
		}
	}
	
//	this.createRobot = function(){
//		if(this.robotAmount < this.robotMax){
//			var robot = new Robot();
//			robot.init();
//			robot.startMove();
//			this.robotAmount++;
//		}
//	}

	this.startBGM = function(){
		var bgm = document.getElementById('audioGameBGM');
		if(bgm.paused){
			bgm.volume = 0.1;
			bgm.loop = true;
			bgm.play();
		}
	}
	
	this.stopBGM = function(){
		var bgm = document.getElementById('audioGameBGM');
		if(!bgm.paused){
			bgm.pause();
			bgm.currentTime = 0;
		}
	}
	
	this.startSE = function(id){
		var se = document.getElementById(id);
		if(!se.paused){
			se.pause();
		}
		se.loop = false;
		se.volume = 0.2;
		se.currentTime = 0;
		se.play();
	}
	
	this.createWeaponSystem = function(){
		this.weaponList = new Array();
		for(var i = 0;i < 4;i++){
			this.weaponList[i] = new Weapon();
			this.weaponList[i].wpListIdx = i;
		}
		
		this.weaponList[0].init(81,'訓練導彈',10,0.5,'images/missile_icon.png','images/missile.png',0.1,false,'反彈敵人一段距離');//Q
		this.weaponList[1].init(87,'加速',50,10,'images/boost_icon.jpg','images/wave.png',5,false,'提高移動速度');//W
		this.weaponList[2].init(69,'修復',320,30,'images/heal_icon.png','',0,false,'回復生命3格');//E
		this.weaponList[3].init(82,'護盾',400,20,'images/shield_icon.png','images/shield.png',3,true,'3秒無敵  撞機器人每隻+50分');//R
		
	}
	
	this.createEnemy = function(posX,posY,deg,imgId,name){
		var idx = enemy.length;
		enemy[idx] = new Enemy();
		enemy[idx].init(posX,posY,deg,imgId,name);
	}
	
	this.updateEnemyPos = function(posX,posY,deg,imgId){
		var max = enemy.length;
		for(var i = 0;i < max;i++){
			if(enemy[i].imgId == imgId){
				enemy[i].updatePos(posX, posY, deg);
				break;
			}
		}
	}
	
	this.createMissile = function(deg, imgId){
		var max = enemy.length;
		for(var i = 0;i < max;i++){
			if(enemy[i].imgId == imgId){
				var missile = new Missile();
				missile.serverInit(enemy[i], deg);
				
				break;
			}
		}
	}
	
	this.removeEnemy = function(imgId){
		var max = enemy.length;
		for(var i = 0;i < max;i++){
			if(enemy[i].imgId == imgId){
				enemy[i].imgId = 0;
				enemy[i].stayX = 9999;
				enemy[i].delEnemy();
				break;
			}
		}
	}
	
}