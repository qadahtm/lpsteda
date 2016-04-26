vg.parse.spec(bc, function(error, chart) { 
    MIV.vgvis = chart({el:"#vis"});
    MIV.vgvis.update();
  });

// var VegaLayer = L.Class.extend({

//     initialize: function (latlng) {
//         // save position of the layer or any options from the constructor
//         this._latlng = latlng;
        
//     },

//     setSpecs: function(vspec){
//       this._vspec = vspec;        
//     },

//     onAdd: function (map) {
//         this._map = map;

//         // create a DOM element and put it into one of the map panes
//         this._el = L.DomUtil.create('div', 'chart-layer leaflet-zoom-hide');
//         // console.log(this._el);

//         var bounds = map.getPixelBounds();
//         console.log(bounds);
//         var porigin = map.getPixelOrigin();
//         console.log(porigin);

//         map.getPanes().overlayPane.appendChild(this._el);

//         console.log($('.chart-layer')[0]);

//         vg.parse.spec(bc, function(error, chart) { chart({el:".chart-layer"}).update(); });

//         // add a viewreset event listener for updating layer's position, do the latter
//         map.on('viewreset', this._reset, this);
//         this._reset();
//     },

//     onRemove: function (map) {
//         // remove layer's DOM elements and listeners
//         map.getPanes().overlayPane.removeChild(this._el);
//         map.off('viewreset', this._reset, this);
//     },

//     _reset: function () {
//         // update layer's position
//         var pos1 = this._map.latLngToLayerPoint(this._latlng);
//         var morigin = this._map.getPixelOrigin();
//         console.log(morigin);
//         console.log(pos);
        
//         var pos = L.point(pos1.x-60, pos1.y-30);
//         L.DomUtil.setPosition(this._el, pos);
//     }
// });