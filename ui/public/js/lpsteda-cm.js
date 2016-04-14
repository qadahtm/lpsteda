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

   var initView = {
		lat:40.427759,
		lng:-86.9171347
	};
	//Leaflet

	// adding tiles
	MIV.map = L.map('outputVis').setView([initView.lat, initView.lng], 13);

	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token='+mapboxapi.accessToken, {
	    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
	    maxZoom: 18,
	    id: mapboxapi.pid,
	    accessToken: mapboxapi.accessToken
	}).addTo(MIV.map);
}