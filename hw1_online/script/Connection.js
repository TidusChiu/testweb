function Connection(){
	
	this.socket = null;
	this.status = null;
	this.delimit = null;
	
	this.init = function(){
		
		var ip = document.getElementById('serverUrl').value;
		var port = "9999";
		var url = "ws://" + ip + ":" + port;
		this.socket = new WebSocket(url);
		this.status = 0;
		
		this.delimit = "%delimit%";
		
		var t = this;
		var s = this.socket;
		
		
		this.socket.onopen = function(){
			t.status = 1;
			console.log("Connect to server");
			var playerName = document.getElementById('inputPlayerName').value;
			t.updatePlayerName(playerName);
			gc.gameStart();
		}
		
		this.socket.onmessage = function(msg){
			var command = t.doDelimit(msg.data);
			switch(command[0]){
				case "server_create_enemy":
					var posX = parseFloat(command[1]);
					var posY = parseFloat(command[2]);
					var deg = parseFloat(command[3]);
					var imgId = command[4];
					var enemyName = command[5];
					
					gc.createEnemy(posX, posY, deg, imgId, enemyName);
					break;
					
				case "server_update_enemy_pos":
					var posX = parseFloat(command[1]);
					var posY = parseFloat(command[2]);
					var deg = parseFloat(command[3]);
					var imgId = command[4];
					gc.updateEnemyPos(posX, posY, deg, imgId);
					break;
					
				case "server_create_missile":
					var deg = parseFloat(command[1]);
					var imgId = command[2];
					gc.createMissile(deg, imgId);
					break;
				
				case "server_remove_enemy":
					console.log('remove ' + imgId);
					var imgId = command[1];
					gc.removeEnemy(imgId);
					break;
				
				default:
					console.log(command[0]);
					break;
			}
		}
		
		this.socket.onclose = function(e){
			t.status = 0;
			gc.gameOver();
			
			console.log("Disconnected." + e);
		}
	}
	
	
	
	this.getStatus = function(){
		return this.status;
	}
	
	this.doDelimit = function(msg){
		var command = msg.split(this.delimit);
		return command;
	}
	
	this.composeDelimit = function(command){
		var msg = '';
		for(var i = 0;i < command.length;i++){
			msg += command[i];
			if(i + 1 < command.length){
				msg += this.delimit;
			}
		}
		return msg;
	}
	
	this.updatePlayerName = function(name){
		var command = new Array();
		command[0] = "client_update_player_name";
		command[1] = name;
		
		var msg = this.composeDelimit(command);
		this.socket.send(msg);
	}
	
	this.loadEnemy = function(){
		var command = new Array();
		command[0] = "client_load_enemy";
		
		var msg = this.composeDelimit(command);
		this.socket.send(msg);
	}
	
	this.updateTank = function(posX, posY, deg){
		var command = new Array();
		command[0] = "client_create_tank";
		command[1] = posX;
		command[2] = posY;
		command[3] = deg;
		
		var msg = this.composeDelimit(command);
		this.socket.send(msg);
	}
	
	this.updateTankPos = function(x,y,deg){
		var command = new Array();
		command[0] = "client_update_tank_pos";
		command[1] = x;
		command[2] = y;
		command[3] = deg;
		
		var msg = this.composeDelimit(command);
		this.socket.send(msg);
	}
	
	this.updateMissile = function(deg){
		var command = new Array();
		command[0] = "client_create_missile";
		command[1] = deg;
		
		var msg = this.composeDelimit(command);
		this.socket.send(msg);
	}
}