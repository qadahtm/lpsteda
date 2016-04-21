function initDSSupport(){

	curSpeed = 1;
	curDataSet = "";

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
	if (streamStarted) {
		// restart stream
		startStream();
	}
}

function setSize(x){
	MIV.swSize = x;
	var sizes = [50,100,200];
	for (var i = 0; i < sizes.length; i++) {
		var y = sizes[i];
		$('#size'+y).removeClass("btn-secondary");
		$('#size'+y).removeClass("btn-primary");

	}
	for (var i = 0; i < sizes.length; i++) {		
		if(sizes[i] == x){
			$('#size'+x).addClass("btn-primary");
		}
		else {
			$('#size'+x).addClass("btn-secondary");			
		}
	};
}
var ti = 0;
function getTuple(){
	var p = MIV.data[ti];

	var m = MIV.marker.at(p.lat,p.lng);
	var dataitem = {};
	dataitem.marker = m;
	dataitem.ti = ti;
	// console.log(dataitem);
	if (MIV.swindow.length == MIV.swSize){
		var edi = MIV.swindow.shift();
		// console.log("remove"+edi);	
		// Updata map state
		MIV.map.removeLayer(edi.marker);
	}
	MIV.swindow.push(dataitem);
	// update vegavis
	updateVGVis();

	setTimeout(function(){
		while (MIV.swindow.length > MIV.swSize){
			var edi = MIV.swindow.shift();
			// console.log("remove"+edi);	
			// Updata map state
			MIV.map.removeLayer(edi.marker);
			// need to update VIS state. to rmove data
			updateVGVis();

			
		}
	},10);

	// console.log(p);
	ti++;
}

function updateVGVis(){
	MIV.vgvis.data("agg").update(function(d){
		// console.log("where: "+$.toJSON(d));
		if (d.category == "calls") return true;
		else return false;
	}, "amount",
	function(d){
		console.log(d);
		// console.log("modify: "+$.toJSON(d));
		
		return MIV.swindow.length;
	});
	MIV.vgvis.update();
}

function startStream(){
	if (streamStarted == false){
		clearInterval(id);
		streamStarted = true;
		
		var rate = Math.floor(MIV.data.length/100)
		// console.log("rate = "+ rate);

		// progress bar
		var progressBar = document.getElementById("timerProgress");
		var startTime = new Date().getTime();
		var i = 0;
		var width = 0;
		// var playTime = 40000 / curSpeed;
		// id = setInterval(frame, playTime/100);
		var ctimeout = 1000 / curSpeed;
		id = setTimeout(frame,ctimeout);

		function frame() {
		    if (width >= 100) {
		    	// clearInterval(id);
		    	width = 0;
		    } else {
		    	width++;

		    	getTuple();

		    	plotDataPoints();
		    	progressBar.style.width = width + '%'; 
		    }

		    var ctimeout = 1000 / curSpeed;
			id = setTimeout(frame,ctimeout);
		}

		function plotDataPoints() {

			i++;
		}

	}	
}


function stopStream(){
	clearInterval(id);
	streamStarted = false;
}