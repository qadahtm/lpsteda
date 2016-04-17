var curSpeed = 1;
var curDataSet = "";

function initDSSupport(){

	curSpeed = 1;
	curDataSet = "";

	var speed = document.getElementById("testSpeed");
	var dataSet = document.getElementById("dataDropDown");
	var startButton = document.getElementById("startButton");

}
function setData(){
	curDataSet = document.getElementById("dataDropDown").value;
}

function setSpeed(x){
	curSpeed = x;
	for (var i = 1; i < 4; i++) {
		var s = document.getElementById("speed" + i).className = "btn btn-secondary";
	}
	var s = document.getElementById("speed" + x).className = "btn btn-primary";
}

function start(){
	var progressBar = document.getElementById("timerProgress");
	var startTime = new Date().getTime();
	var i = 0;
	width = 1;
	var playTime = 40000 / curSpeed;
	var endTime = startTime + playTime;
	var id = setInterval(frame, playTime/100);
	function frame() {
	    if (width >= 100) {
	    	clearInterval(id);
	    } else {
	    	width++;
	    	plotDataPoints();
	    	progressBar.style.width = width + '%'; 
	    }
	}

	function plotDataPoints() {
		
		i++;
	}
}