var editor;
var MIV = {};
MIV.O = [];

MIV.marker = {"at":function(lat,lng){
	// console.log(lat);
	// console.log(lng);
	var iconr = L.MakiMarkers.icon({icon: "rocket", color: "#b0b", size: "m"});
	var marker = L.marker([lat,lng],{icon:iconr}).addTo(MIV.map);
	// console.log(marker);
	// MIV.O["markerAtLine"+MIV.currentLine]
	return marker;
}}

$(document).ready(function(){

	// CM
	initializeCM();

	initializeAC();

	initLPSupport();

	initDSSupport();
	
	

});

/* Examples

MIV.marker.at(40.427759, -86.9371347);
*/