function initDSSupport(){

	curSpeed = 1;
	curDataSet = "";

}
function setData(di){
	// var di = $("#dataDropDown").attr("value");
	// console.log("set data to "+di);
	MIV.di = di;
	curDataSet = MIV.sdata[di];
	// clear stream window content 
	var eswindow = MIV.swindow;
	MIV.swindow = [];
	while(eswindow.length > 0){
		var edi = eswindow.pop();
		MIV.map.removeLayer(edi.marker);
	}

	MIV.vgvis.data("rawstream").remove(function(d){
		return true;
	});

	if (di == 2) // twitter
	{
		MIV.map.fitBounds(usa_bounds);
	}
	else {
		MIV.map.setView(seattleCenter,10);
	}
	
	MIV.cats = MIV.defCats;
	compileAndRun();
	MIV.vgvis.update();
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


function processTuple(p){
	p.cat = assignCat(p);
	p.tid = ti;
	// console.log(p);
	var cat = assignCat(p); // update category
	var catc = getCatColor(cat);
	var iconName = getIconName();
	var iconr = L.MakiMarkers.icon({icon: iconName, color: catc, size: "m"});
	var m = L.marker([p.lat,p.lng],{icon:iconr}).addTo(MIV.map);
	var mtext = p.text;
	var mpopup = m.bindPopup(mtext);

	var dataitem = {};
	dataitem.marker = m;
	dataitem.popup = mpopup;
	dataitem.ti = ti;
	dataitem.tup = p;

	dataitem = applyBounds(dataitem);
	// console.log(dataitem);
	if (MIV.swindow.length == MIV.swSize){
		var edi = MIV.swindow.shift();
		// console.log("remove"+edi);	
		// Updata map state
		MIV.map.removeLayer(edi.marker);
	}
	MIV.swindow.push(dataitem);

	// remove expired data 
	while (MIV.swindow.length > MIV.swSize){
		var edi = MIV.swindow.shift();
		// extups.push(edi);
		MIV.map.removeLayer(edi.marker);
	}


	// update vegavis
	updateVGVis();
	ti++;
}
function getTuple(){
	// var p = MIV.data[ti];
	var p;
	var validtup = false;
	if (MIV.di == 2){
		// twitter stream
		var url = "twitterstream";
		$.getJSON( url, function( data ) {
			if (data.valid){
				// console.log(data);
				processTuple(data);					
			}			
		});

	}
	else{
		p = curDataSet[ti];
		processTuple(p);		
	}	
}

function assignCat(p){
	var rescat = null; 
	for (var i = 0; i < MIV.cats.length; i++) {
		var re = new RegExp(MIV.cats[i]);
		if (re.test(p.text)){
			// console.log(p);
			rescat = MIV.cats[i];
			break;
		}
	};

	if (rescat == null){
		rescat = MIV.defCat
	}
	return rescat;
}

function getIconName(){
	var res = "emergency-telephone";
	if (MIV.di == 2){
		// for twitter stream use special icon
		res = "post"
	} 
	return res;
}
function updateVGVis(){
	

	// Testing
	//MIV.categorize(["Aid","Medic"]); 
	// MIV.categorize(["Aid"]); 

	// remove expired data 
	// TODO: implement a more efficient method
	// Currently, remove all previous data and reinsert from window. 

	//remove expireed tuples
	// remove all for now
	MIV.vgvis.data("rawstream").remove(function(d){
		return true;
	});

	// re-insert from current window
	for (var i = 0; i < MIV.swindow.length; i++) {
		var d = MIV.swindow[i];
		d.tup.cat = assignCat(d.tup); // update category
		d.tup.catc = getCatColor(d.tup.cat);
		var iconName = getIconName();

		var nicon = L.MakiMarkers.icon({icon: iconName, color: d.tup.catc, size: "m"});
		d.marker.setIcon(nicon);
		d = applyBounds(d);
	 	// console.log(d);

		// if (testing){
		// 	d.tup.visible = true;
		// 	testing = false;
		// }
		// else{
		// 	d.tup.visible = undefined;
		// 	testing = true;
		// }
		// console.log(d);
		MIV.vgvis.data("rawstream").insert([d.tup]);
	};

	MIV.vgvis.update();
}

function startStream(){
	if (streamStarted == false){
		clearInterval(id);
		streamStarted = true;
		
		// var rate = Math.floor(MIV.data.length/100)
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