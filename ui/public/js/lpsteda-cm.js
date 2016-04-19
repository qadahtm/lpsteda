function initializeCM(){
	editor = CodeMirror.fromTextArea($("#codeData").get(0), {
		value: "function myScript(){return 100;}\n",
	    mode: "javascript",
	    indentWithTabs: true,
	    smartIndent: true,
	    lineNumbers: true,
	    matchBrackets : true,
	    autofocus: true,
	    theme:"neat"
	    // extraKeys: {"Ctrl-Space": "autocomplete"},
	    // hintOptions: {tables: {
	    //   users: {name: null, score: null, birthDate: null},
	    //   countries: {name: null, population: null, size: null}
    });
   // Seattle
   var initView = {
		lat:47.673866271972656,
		lng:-122.35418701171875
	};

	// Purude
 //   var initView = {
	// 	lat:40.427759,
	// 	lng:-86.9171347
	// };


	//Leaflet

	// creating tiles

	var baseTiles = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token='+mapboxapi.accessToken, {
	    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
	    maxZoom: 18,
	    id: mapboxapi.pid,
	    accessToken: mapboxapi.accessToken
	});

	// Instantiating map
	MIV.map = L.map('outputVis', {center:[initView.lat, initView.lng], zoom:10, layers:[baseTiles]});

	// var vega = new VegaLayer(L.latLng(40.427759, -86.9171347));
	// var VegaControl = L.control();

	// VegaControl.onAdd = function (map) {
	//     this._div = L.DomUtil.create('div', 'chart'); 

	//     vg.parse.spec(bc, function(error, chart) { chart({el:".chart"}).update(); });

	//     this.update();
	//     return this._div;
	//   };

	// VegaControl.update = function (props) {

	//   };

	// VegaControl.addTo(MIV.map);

	// L.control.layers({"tiles":baseTiles}, {"charts":vega}).addTo(MIV.map);	
}