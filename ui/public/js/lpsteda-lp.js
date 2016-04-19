function initLPSupport(){

	editor.on("change", function(cm,o){
		var lpos = o.from.line;
		MIV.currentLine = lpos;
		var lh = cm.doc.getLine(lpos);
		// var sb = $()
		console.log(lh);	
		try{
			// evaluate each line in the code
			// cm.doc.eachLine(function(lh){
				
				
			// });

			var s = lh.text;
			// what if there multiple statements in a line
			console.log("line "+lpos+" is "+s);
			if (MIV.O[lpos] == undefined){
				console.log("new at "+lpos);
				var obj =  window.eval(s); // evaluate globally
				MIV.O[lpos] = {text:s, obj:obj};	
				console.log(obj);
			}
			if (MIV.O[lpos].text !== s){
				// modified code
				console.log("modifed at "+lpos);
				if (MIV.O[lpos].obj){
					// remove old					
					MIV.map.removeLayer(MIV.O[lpos].obj);
					console.log("going to eval:"+s);
					var obj =  window.eval(s); // evaluate globally
					console.log("obj is :"+obj);
					console.log(obj);
					MIV.O[lpos] = {text:s, obj:obj};		
				}
				else {
					console.log("old object is not valid");
					var obj =  window.eval(s); // evaluate globally
					MIV.O[lpos] = {text:s, obj:obj};							
				}
			}
			else {
				// same code
				console.log("same at "+lpos);
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