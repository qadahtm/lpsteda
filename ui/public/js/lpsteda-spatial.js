// spatial functions
function initMapSupport(){
	// viewreset
	// MIV.map.addEventListener("viewreset", function(){
	// 	console.log(MIV.map.getBounds());
	// 	// update swindow tuples
	// 	for (var i = 0; i < MIV.swindow.length; i++) {
	// 		console.log(MIV.swindow[i]);
	// 	};
	// });
}

function applyBounds(d){
	var mvbounds = MIV.map.getBounds();
	// console.log(mvbounds);
	// apply spatial bounds
	if (mvbounds.contains(L.latLng(d.tup.lat,d.tup.lng))){
		d.tup.visible = true;
		// d.marker.addTo(MIV.map);
	}
	else{
		d.tup.visible = undefined;
		// m.addTo(MIV.map);
	}
	return d;
}

function updateBounds(d){
	var mvbounds = MIV.map.getBounds();
	// console.log(mvbounds);
	// apply spatial bounds
	if (mvbounds.contains(L.latLng(p.lat,p.lng))){
		if (d.tup.visible == false){
			d.marker.addTo(MIV.map);	
		}
		d.tup.visible = true;
	}
	else{
		if (d.tup.visible == true){
			MIV.map.removeLayer(d.marker);			
		}
		d.tup.visible = false;
		// m.addTo(MIV.map);
	}
	return d;
}