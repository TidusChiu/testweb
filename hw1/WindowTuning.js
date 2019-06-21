function WindowTuning(){
	this.mainWindow = null;
	this.gameWindow = null;
	this.gameHeader = null;
	this.gameFooter = null;
	
	this.tuneX = 0;
	this.tuneY = 0;
	
	this.x = null;
	this.y = null;
	
	this.init = function(){
		this.mainWindow = document.getElementById('divMainWindow');
		this.gameWindow = document.getElementById('divGameWindow');
		this.gameHeader = document.getElementById('divGameHeader');
		this.gameFooter = document.getElementById('divGameFooter');
		
		this.tuneX = parseInt(this.mainWindow.style.left);
		this.tuneY = parseInt(this.mainWindow.style.top) + parseInt(this.gameHeader.style.height);
	}
	
	this.refreshPos = function(){
		var e = window.event;
		var cx = e.clientX;
		var cy = e.clientY;
		this.x = cx - this.tuneX;
		this.y = cy - this.tuneY;
	}
	
	this.getGameWindowLimit = function(){
		var limit = new Array();
		limit[0] = parseInt(this.mainWindow.style.width);
		limit[1] = parseInt(this.gameWindow.style.height);
		return limit;
	}

}