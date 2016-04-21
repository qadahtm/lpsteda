function loadDataFromServer(){
	var url = "data/seattle911.json";
	$.getJSON( url, function( data ) {
		MIV.data = data;
		// console.log(data);	
		$("#dataDropDown").append("<option value=\"1\">Seattle 911 Fire Calls</option>")
	});
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