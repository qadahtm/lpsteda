function initializeAC(){



	CodeMirror.commands.autocomplete = function(cm) {

	    CodeMirror.showHint(cm, CodeMirror.hint.javascript);
	    
	};
	editor.on("keyup", function (cm, event) {
        if (!cm.state.completionActive && /*Enables keyboard navigation in autocomplete list*/
            event.keyCode != 13 &&        /*Enter - do not open autocomplete list just after item has been selected in it*/ 
            event.keyCode != 8 &&
            event.keyCode != 27 &&
            event.keyCode != 186) {
            CodeMirror.commands.autocomplete(cm, null, {completeSingle: false});
        }
    });


}

