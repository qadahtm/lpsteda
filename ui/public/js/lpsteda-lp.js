MIV.categorize = function(catArr){
	catArr.push("Uncategorized");
	MIV.cats = catArr;
};

function loadDataFromServer(){
	var url = "data/seattle911.json";
	var i = 0;
	$.getJSON( url, function( data ) {
		var di = 0;
		MIV.sdata[di] = data;
		// console.log(data);	<li><a href="#">Action</a></li>
		$("#dataDropDown").append("<li value=\"0\"><a id='s911calls' href=\"#\">Seattle 911 Calls</a></li>");
		$('#s911calls').click(function(){
			$('#selectedDS').html("Seattle 911 Calls Dataset");
			// console.log(di);
			setData(di);
			$('#scontrol').removeClass('hidden');
		});
	});

	var url2 = "data/seattle911ir.json";
	$.getJSON( url2, function( data ) {
		var di = 1;
		MIV.sdata[di] = data;
		$("#dataDropDown").append("<li value=\"1\"><a id='s911callsir' href=\"#\">Seattle 911 Incidents</a></li>");
		$('#s911callsir').click(function(){
			$('#selectedDS').html("Seattle 911 Incidents Dataset");			
			// console.log(di);
			setData(di);		
			$('#scontrol').removeClass('hidden');				
		});
	});

	// Twitter stream
	var di = 2;
	$("#dataDropDown").append("<li value=\"0\"><a id='livetwitter' href=\"#\">Live Twitter Stream</a></li>");
	$('#livetwitter').click(function(){
		$('#selectedDS').html("Live Twitter Stream");
		setData(di);
		$('#scontrol').removeClass('hidden');
	});
}

function compileAndRun(){
	var cm = editor;
	var lpos = 0;

	for (var i = 0; i < cm.doc.lineCount(); i++) {
		var s = cm.doc.getLine(i);
		var lpos = i;
		// console.log(s);
		if (MIV.O[lpos] == undefined){
			// console.log("new at "+lpos);
			var obj =  window.eval(s); // evaluate globally
			MIV.O[lpos] = {text:s, obj:obj};	
			// console.log(obj);
		}
		if (MIV.O[lpos].text !== s){
			// modified code
			// console.log("modifed at "+lpos);
			if (MIV.O[lpos].obj){
				// remove old					
				MIV.map.removeLayer(MIV.O[lpos].obj);
				// console.log("going to eval:"+s);
				var obj =  window.eval(s); // evaluate globally
				MIV.O[lpos] = {text:s, obj:obj};		
			}
			else {
				// console.log("old object is not valid");
				var obj =  window.eval(s); // evaluate globally
				MIV.O[lpos] = {text:s, obj:obj};							
			}
		}
		else {
			// same code
			// console.log("same at "+lpos);
		}

	};	
}

function initLPSupport(){

	editor.on("change", function(cm,o){
		var lpos = o.from.line;
		MIV.currentLine = lpos;
		console.log(o);
			
		try{
			// evaluate the changed line in the code

			var s = cm.doc.getLine(lpos);
			// what if there multiple statements in a line
			// console.log("line "+lpos+" is "+s);
			if (MIV.O[lpos] == undefined){
				// console.log("new at "+lpos);
				var obj =  window.eval(s); // evaluate globally
				MIV.O[lpos] = {text:s, obj:obj};	
				// console.log(obj);
			}
			if (MIV.O[lpos].text !== s){
				// modified code
				// console.log("modifed at "+lpos);
				if (MIV.O[lpos].obj){
					// remove old					
					MIV.map.removeLayer(MIV.O[lpos].obj);
					// console.log("going to eval:"+s);
					var obj =  window.eval(s); // evaluate globally
					MIV.O[lpos] = {text:s, obj:obj};		
				}
				else {
					// console.log("old object is not valid");
					var obj =  window.eval(s); // evaluate globally
					MIV.O[lpos] = {text:s, obj:obj};							
				}
			}
			else {
				// same code
				// console.log("same at "+lpos);
			}
			
		}
		catch(e){
			// ignore errors
			// TBD: may want to be selective when handling errors
			// TBD may want to show errors to user. No we should not.  
			console.log(e);
		}
	});
}