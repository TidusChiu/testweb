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
	
	this.robotTimer = null;
	this.robotInterval = null;
	this.robotStartUp = null;
	this.robotAmount = null;
	this.robotMax = null;
	
	this.robotNormalMspd = null;
	this.robotCrazyMspd = null;
	
	this.weaponList = null;
	
	
	this.init = function(){
		this.gameIsStart = false;
		
		this.gameStartCounter = 3;
		
		this.scoreInterval = 1000;
		this.scoreAddUnit = 10;
		
		this.tankLifeMax = 5;
		this.tankNormalMspd = 5;
		
		this.robotInterval = 4000;
		this.robotAmount = 0;
		this.robotMax = 50;
		this.robotStartUp = 500;
		
		this.robotNormalMspd = 4;
		this.robotCrazyMspd = 10;
		
		this.createWeaponSystem();
	}
	
	this.gameStart = function(){
		pb.hiddenPause()
		this.gameIsStart = true;
		var t = this;
		tank.init();
		
		for(var i = 0;i < this.weaponList.length;i++){
			this.weaponList[i].displayCD();
		}
		
		this.scoreTimer = window.setInterval(function(){
			tank.addScore(t.scoreAddUnit);
		},this.scoreInterval);
		
		this.tankSurviveTimer = window.setInterval(function(){
			tank.addSurviveTime();
		},10);
		
		this.robotTimer = window.setInterval(function(){
			t.createRobot();
		},this.robotInterval);
	}
	
	this.gameOver = function(){
		if(this.gameIsStart){
			this.gameIsStart = false;
			this.robotAmount = 0;
			window.clearInterval(this.scoreTimer);
			window.clearInterval(this.robotTimer);
			window.clearInterval(this.tankSurviveTimer);
			var surTime = parseInt(tank.surviveTime * 100) / 100;
			alert('You Survive : ' + surTime + ' seconds !!');
			tank.delTank();
			for(var i = 0;i < this.weaponList.length;i++){
				window.clearInterval(this.weaponList[i].timer);
				this.weaponList[i].wpCDNow = 0;
			}
			pb.showPause();
		}
	}
	
	this.createRobot = function(){
		if(this.robotAmount < this.robotMax){
			var robot = new Robot();
			robot.init();
			robot.startMove();
			this.robotAmount++;
		}
	}
	
	this.createWeaponSystem = function(){
		this.weaponList = new Array();
		for(var i = 0;i < 4;i++){
			this.weaponList[i] = new Weapon();
			this.weaponList[i].wpListIdx = i;
		}
		
		this.weaponList[0].init(81,'訓練導彈',10,1.5,'images/missile_icon.png','images/missile.png',0.1,false,'反彈敵人一段距離');//Q
		this.weaponList[1].init(87,'加速',70,10,'images/boost_icon.jpg','images/wave.png',5,false,'提高移動速度');//W
		this.weaponList[2].init(69,'修復',150,12,'images/heal_icon.png','',0,false,'回復生命3格');//E
		this.weaponList[3].init(82,'護盾',400,20,'images/shield_icon.png','images/shield.png',3,false,'3秒無敵  撞機器人每隻+50分');//R
		
	}
	
	
}