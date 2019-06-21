function PauseBlock(){
	this.opacity = null;
	this.defaultOpacity = null;
	this.timer = null;
	this.interval = null;
	this.divPause = null;
	
	this.init = function(){
		this.divPause = document.getElementById('divGamePause');
		this.defaultOpacity = 0.7;
		this.interval = 30;
		
		this.divPause.style.opacity = this.defaultOpacity;
	}
	
	this.showPause = function(){
		var t = this;
		if(this.divPause.style.opacity == 0){
			this.divPause.style.visibility = 'visible';
			this.timer = window.setInterval(function(){
				t.pauseEffect(1);
			},this.interval);
		}
	}

	this.hiddenPause = function(){
		var t = this;
		if(this.divPause.style.opacity == this.defaultOpacity){
			this.timer = window.setInterval(function(){
				t.pauseEffect(-1);
			},this.interval);
		}
	}

	this.pauseEffect = function(base){
		this.opacity = this.divPause.style.opacity * 100;
		this.opacity += 10 * base;
		this.divPause.style.opacity = this.opacity / 100;
		
		if(this.divPause.style.opacity >= this.defaultOpacity){ //Pause Game
			
			window.clearInterval(this.timer);
			
		}else if(this.divPause.style.opacity <= 0){ //Start Game
			
			this.divPause.style.visibility = 'hidden';
			window.clearInterval(this.timer);
		}
	}
	
}