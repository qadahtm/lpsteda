var editor;
var MIV = {};
MIV.O = [];
MIV.swindow = [];
MIV.swSize = 50;
MIV.defCat = 'Uncategorized';
MIV.defCats = [MIV.defCat];
MIV.cats = MIV.defCats;
MIV.sdata = [];

// Stream control vars
var curSpeed = 1;
var streamStarted = false;
var id;
var catColors8 = ['#556270', '#FF6B6B', '#4ECDC4', '#C7F464', '#C44D58', '#ECD078', '#542437', '#6A4A3C'];
var catColorRandom27 = randomColor({luminosity: 'light',count: 27});
var catColors = catColors8;

function getCatColor(cat){
	return catColors[MIV.cats.indexOf(cat)];
}


// Vega
var bc = {
  "width": 400,
  "height": 200,
  "padding": {"top": 30, "left": 30, "bottom": 20, "right": 10},
  "data": [
    {
      "name": "rawstream",
       "transform": [
        {"type": "facet", "groupby":["cat", "catc"], 
        "summarize": [{"field": "visible", "ops": ["valid"]},
        			  {"field": "inumber", "ops": ["count"]}]}
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
      "domain": {"data": "rawstream", "field": "cat"} },
    { "name": "yscale", "range": "height", "nice": true,
      "domain": {"data": "rawstream", "field": "valid_visible"} }
  ],

  "axes": [
    { "type": "x", "scale": "xscale" },
    { "type": "y", "scale": "yscale" }
  ],

  "marks": [
    {
      "type": "rect",
      "from": {"data":"rawstream"//,
      	// "transform": [
	      //   {"type": "facet", "groupby":["cat"], 
	      //   "summarize": [{"field": "callType", "ops": ["valid"]},
	      //   			  {"field": "inumber", "ops": ["count"]}]}
      	// ]	
  	  },
      "properties": {
        "enter": {
          "fill": {"field": "catc"},
          "x": {"scale": "xscale", "field": "cat"},
          "width": {"scale": "xscale", "band": true, "offset": -1},
          "y": {"scale": "yscale", "field": "valid_visible"},
          "y2": {"scale": "yscale", "value":0}
        },
        "update": { 
          "fill": {"field": "catc"},
          "x": {"scale": "xscale", "field": "cat"},
          "width": {"scale": "xscale", "band": true, "offset": -1},
          "y": {"scale": "yscale", "field": "valid_visible"},
          "y2": {"scale": "yscale", "value":0}
           }//,
        // "hover": { "fill": {"value": "red"} }
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
          "x": {"scale": "xscale", "signal": "tooltip.cat"},
          "dx": {"scale": "xscale", "band": true, "mult": 0.5},
          "y": {"scale": "yscale", "signal": "tooltip.valid_visible", "offset": -5},
          "text": {"signal": "tooltip.valid_visible"},
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

// sample data item 

// address: "2211 Alaskan Way"
// callType: "4RED - 2 + 1 + 1"
// datatime: "04/08/2016 08:33:00 PM +0000"
// inumber: "F160039445"
// lat: 47.61083984375
// lng: -122.34774017333984
// rlat: 47.61083984375
// rlng: -122.34774017333984