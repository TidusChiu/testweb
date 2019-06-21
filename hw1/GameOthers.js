function GameOthers(){
	
	this.cvsStart = null;
	this.ctxStart = null;
	
	this.cvsScore = null;
	this.ctxScore = null;
	this.strScoreSize = null;
	this.strScoreLength = null;
	
	
	this.cvsLife = null;
	this.ctxLife = null;
	this.strLifeSize = null;
	this.strLifeLength = null;
	
	this.cvsWeaponInfo = null;
	this.ctxWeaponInfo = null;
	
	this.cvsWeapon = null;
	this.ctxWeapon = null;
	
	this.init = function(){
		
		this.strScoreSize = 40;
		this.strLifeSize = 40;
		
		this.createMenu();
		this.createHeader();
		this.createFooter();
	}
	
	this.createMenu = function(){
		this.cvsStart = document.createElement('canvas');
		this.cvsStart.id = 'cvsStart';
		this.cvsStart.width = '100';
		this.cvsStart.height = '50';
		this.cvsStart.style.border = '2px solid red';
		this.cvsStart.setAttribute('onclick', 'gc.gameStart()');
		this.cvsStart.setAttribute('onmouseover', "gos.scale(this,1.2)");
		this.cvsStart.setAttribute('onmouseout', "gos.scale(this,1)");
		pb.divPause.appendChild(this.cvsStart);
		this.cvsStart.style.position = 'absolute';

		var cvsLeft = parseInt(wt.mainWindow.style.width) / 2 - this.cvsStart.width / 2;
		var cvsTop = parseInt(wt.mainWindow.style.height) / 2 - this.cvsStart.height / 2;
		this.cvsStart.style.left = cvsLeft + 'px';
		this.cvsStart.style.top = cvsTop + 'px';

		this.ctxStart = this.cvsStart.getContext('2d');
		this.ctxStart.font = '20px Arial';
		this.ctxStart.fillStyle = 'red';
		var fillX = this.cvsStart.width / 3;
		var fillY = this.cvsStart.height * 2 / 3;
		this.ctxStart.fillText('Start',fillX,fillY);
		this.ctxStart.save();
		
	}

	this.createHeader = function(){
		this.cvsScore = document.createElement('canvas');
		this.cvsScore.id = 'cvsScore';
		this.cvsScore.width = parseInt(wt.mainWindow.style.width) * 0.5;
		this.cvsScore.height = parseInt(wt.gameHeader.style.height) - 1;
		wt.gameHeader.appendChild(this.cvsScore);
		this.cvsScore.style.position = 'relative';

		this.ctxScore = this.cvsScore.getContext('2d');
		this.ctxScore.font = this.strScoreSize + 'px Arial';
		this.ctxScore.textAlign = 'start';
		var str = 'Score:';
		this.strScoreLength = this.ctxScore.measureText(str).width;
		var gstyle = this.ctxScore.createLinearGradient(0, 0, this.strScoreLength, 0);
		gstyle.addColorStop(0, '#ff0000');
		gstyle.addColorStop(1, '#00ff00');
		this.ctxScore.fillStyle = gstyle;
		this.ctxScore.fillText(str,0,this.cvsScore.height - 1);
		
		this.drawScoreValue(0);
		
		//
		this.cvsLife = document.createElement('canvas');
		this.cvsLife.id = 'cvsLife';
		this.cvsLife.width = parseInt(wt.mainWindow.style.width) * 0.5;
		this.cvsLife.height = parseInt(wt.gameHeader.style.height) - 1;
		wt.gameHeader.appendChild(this.cvsLife);
		this.cvsLife.style.position = 'relative';
		
		this.ctxLife = this.cvsLife.getContext('2d');
		this.ctxLife.font = this.strLifeSize + 'px Arial';
		this.ctxLife.textAlign = 'start';
		str = 'Life:';
		this.ctxLife.fillText(str,0,this.cvsLife.height - 1);
		this.strLifeLength = this.ctxLife.measureText(str).width;
		
		this.drawLifeGauge();
		
	}
	
	this.drawScoreValue = function(v){
		this.ctxScore.fillStyle = 'black';
		this.ctxScore.fillText(v,this.strScoreLength,this.cvsScore.height - 1);
	}
	
	this.drawLifeGauge = function(){
		var lifeGaugeStyle = this.ctxLife.createLinearGradient(this.strLifeLength, 0,this.cvsLife.width, 0);
		lifeGaugeStyle.addColorStop(0, '#ff0000');
		lifeGaugeStyle.addColorStop(0.25, '#ffff00');
		lifeGaugeStyle.addColorStop(1,'#00aa00');
		this.ctxLife.fillStyle = lifeGaugeStyle;
		this.ctxLife.fillRect(this.strLifeLength,this.cvsLife.height - this.strLifeSize,this.cvsLife.width,this.cvsLife.height - 1);
	}
	
	this.createFooter = function(){
		this.cvsWeaponInfo = document.getElementById('cvsWeaponInfo');
		this.cvsWeaponInfo.width = parseInt(wt.mainWindow.style.width) * 0.5;
		this.cvsWeaponInfo.height = parseInt(wt.gameFooter.style.height);
		this.cvsWeaponInfo.style.position = 'absolute';
		this.cvsWeaponInfo.style.right = '0px';
		this.cvsWeaponInfo.style.top = '0px';
		this.ctxWeaponInfo = this.cvsWeaponInfo.getContext('2d');
		
		this.cvsWeapon = new Array();
		this.ctxWeapon = new Array();
		for(var i = 0;i < gc.weaponList.length;i++){
			var cvs = document.createElement('canvas');
			var ctx = cvs.getContext('2d');
			cvs.width = 30;
			cvs.height = 30;
			cvs.style.marginTop = 10 + 'px';
			cvs.style.marginLeft = 20 + 'px';
			cvs.style.border = '2px outset #0000ff';
			cvs.setAttribute('onmouseover', 'gos.showWeaponInfo('+ i +')');
			cvs.setAttribute('onmouseout', 'gos.hideWeaponInfo()');
			wt.gameFooter.appendChild(cvs);
			ctx.save();
			
			console.log('Ready to draw icon');
			this.drawWeaponIcon(cvs,i);
			
			this.cvsWeapon[i] = cvs;
			this.ctxWeapon[i] = ctx;
		}
	}
	
	this.drawWeaponIcon = function(cvs,i){
		var ctx = cvs.getContext('2d');
		var imgWeapon = new Image();
		var weapon = gc.weaponList[i];
		if(weapon.wpIcon == ''){
			weapon.wpIcon = 'images/no_icon.png';
		}
		imgWeapon.src = weapon.wpIcon;
		
		ctx.restore();
		
		ctx.drawImage(imgWeapon,0,0,cvs.width,cvs.height);
		
		if(weapon.wpIsLock){
			var lock = new Image();
			lock.src = 'images/lock_icon.png';
			ctx.drawImage(lock,0,0,cvs.width,cvs.height);
		}
		
		ctx.save();
		
		var centerPoint = cvs.width / 2;
		var r = centerPoint * Math.sqrt(2);
		var loadingCD = -0.5 + 2 * (weapon.wpCD - weapon.wpCDNow) / weapon.wpCD;
		
		if(loadingCD != 0){
			ctx.fillStyle = 'blue';
			ctx.globalAlpha = 0.8;
			ctx.beginPath();
			ctx.moveTo(centerPoint,centerPoint - r);
			ctx.lineTo(centerPoint,centerPoint)
			ctx.arc(centerPoint, centerPoint, r, loadingCD * Math.PI, 1.5 * Math.PI);
			ctx.fill();
		}
		console.log('Draw completed');
	}
	
	this.showWeaponInfo = function(idx){
		var cvs = this.cvsWeaponInfo;
		var ctx = this.ctxWeaponInfo;
		var name = '[' + gc.weaponList[idx].wpName + ']';
		var info = name + 'Cost:' + gc.weaponList[idx].wpCost + '  CD:' + gc.weaponList[idx].wpCD + '(' + gc.weaponList[idx].wpContent + ')';
		ctx.font = '15px Arial';
		ctx.fillStyle = '#000000';
		ctx.fillText(info,0,cvs.height - 10);
	}
	
	this.hideWeaponInfo = function(){
		var cvs = this.cvsWeaponInfo;
		var ctx = this.ctxWeaponInfo;
		ctx.clearRect(0,0,cvs.width,cvs.height);
	}
	
	this.scale = function(c,x){
		c.style.webkitTransform = 'scale(' + x + ',' + x + ')';
	}
	
}