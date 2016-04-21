var bc = {
  "width": 400,
  "height": 200,
  "padding": {"top": 10, "left": 30, "bottom": 20, "right": 10},

  "data": [
    {
      "name": "agg",
      "values": [
        // {"category":"A", "amount":28},
        // {"category":"B", "amount":55},
        // {"category":"C", "amount":43},
        // {"category":"D", "amount":91},
        // {"category":"E", "amount":81},
        // {"category":"F", "amount":53},
        // {"category":"G", "amount":19},
        // {"category":"H", "amount":87},
        {"category":"calls", "amount":0}
      ]
    }
  ],

  "signals": [
    {
      "name": "tooltip",
      "init": {},
      "streams": [
        {"type": "rect:mouseover", "expr": "datum"},
        {"type": "rect:mouseout", "expr": "{}"}
      ]
    }
  ],

  "predicates": [
    {
      "name": "tooltip", "type": "==", 
      "operands": [{"signal": "tooltip._id"}, {"arg": "id"}]
    }
  ],

  "scales": [
    { "name": "xscale", "type": "ordinal", "range": "width",
      "domain": {"data": "agg", "field": "category"} },
    { "name": "yscale", "range": "height", "nice": true,
      "domain": {"data": "agg", "field": "amount"} }
  ],

  "axes": [
    { "type": "x", "scale": "xscale" },
    { "type": "y", "scale": "yscale" }
  ],

  "marks": [
    {
      "type": "rect",
      "from": {"data":"agg"},
      "properties": {
        "enter": {
          "x": {"scale": "xscale", "field": "category"},
          "width": {"scale": "xscale", "band": true, "offset": -1},
          "y": {"scale": "yscale", "field": "amount"},
          "y2": {"scale": "yscale", "value":0}
        },
        "update": { 
          "fill": {"value": "steelblue"},
          "x": {"scale": "xscale", "field": "category"},
          "width": {"scale": "xscale", "band": true, "offset": -1},
          "y": {"scale": "yscale", "field": "amount"},
          "y2": {"scale": "yscale", "value":0}
           },
        "hover": { "fill": {"value": "red"} }
      }
    },
    {
      "type": "text",
      "properties": {
        "enter": {
          "align": {"value": "center"},
          "fill": {"value": "#333"}
        },
        "update": {
          "x": {"scale": "xscale", "signal": "tooltip.category"},
          "dx": {"scale": "xscale", "band": true, "mult": 0.5},
          "y": {"scale": "yscale", "signal": "tooltip.amount", "offset": -5},
          "text": {"signal": "tooltip.amount"},
          "fillOpacity": {
            "rule": [
              {
                "predicate": {"name": "tooltip", "id": {"value": null}},
                "value": 0
              },
              {"value": 1}
            ]
          }
        }
      }
    }
  ]
};

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