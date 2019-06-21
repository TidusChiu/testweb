function Enemy(){
	this.imgEnemy = null;
	this.imgId = null;
	this.imgSrc = 'images/enemy_tank.png';
	this.name = null;
	this.spanName = null;
	
	this.stayX = null;
	this.stayY = null;
	this.corrX = null;
	this.corrY = null;
	
	this.deg = null;
	
	this.shield = null;
	
	this.init = function(posX, posY, deg, imgId, name){
		this.imgEnemy = document.createElement('img');
		this.imgId = imgId;
		this.imgEnemy.id = "enemy_" + this.imgId;
		this.name = name;
		var divGameWindow = document.getElementById('divGameWindow');
		divGameWindow.appendChild(this.imgEnemy);

		this.imgEnemy.src = this.imgSrc;
		this.imgEnemy.style.position = 'absolute';
		
		this.corrX = this.imgEnemy.width / 2;
		this.corrY = this.imgEnemy.height / 2;
		
		
		var span = document.createElement('span');
		span.innerHTML = name;
		span.style.position = "absolute";
		span.style.color = "#ffffff";
		span.style.fontWeight = "900";
		wt.gameWindow.appendChild(span);
		this.spanName = span;
		
		this.updatePos(posX, posY, deg);
		
		this.shield = false;
		
	}
	
	this.rotate = function(deg){
		this.deg = deg;
		this.imgEnemy.style.webkitTransform = 'rotate(' + deg + 'deg)';
	}
	
	this.updatePos = function(posX, posY, deg){
		this.stayX = posX + this.corrX;
		this.stayY = posY + this.corrY;
		
		this.rotate(deg);
		
		this.imgEnemy.style.left = (this.stayX - this.corrX) + "px";
		this.imgEnemy.style.top = (this.stayY - this.corrY) + "px";
		
		
		this.spanName.style.left = (this.stayX - this.corrX * 1.5) + "px";
		this.spanName.style.top = (this.stayY - this.corrY * 1.8) + "px";
		
	}
	
	this.getStayPos = function(){
		var pos = new Array();
		pos[0] = this.stayX;
		pos[1] = this.stayY;
		return pos;
	}
	
	this.delEnemy = function(){
		var nodes = wt.gameWindow.childNodes;
		for(var i = 0;i < nodes.length;i++){
			if(nodes[i] == this.imgEnemy){
				wt.gameWindow.removeChild(this.imgEnemy);
				gc.startSE('audioCrash');
			}
			if(nodes[i] == this.spanName){
				wt.gameWindow.removeChild(this.spanName);
			}
		}
		delete this;
		return;
	}
}
