import maskInput from '../../inputMask.js';

//input element
export default function(cell, onRendered, success, cancel, editorParams){
	//create and style input
	var cellValue = cell.getValue(),
	input = document.createElement("input");

	input.setAttribute("type", editorParams.search ? "search" : "text");

	input.style.padding = "4px";
	input.style.width = "100%";
	input.style.boxSizing = "border-box";

	if(editorParams.elementAttributes && typeof editorParams.elementAttributes == "object"){
		for (let key in editorParams.elementAttributes){
			if(key.charAt(0) == "+"){
				key = key.slice(1);
				input.setAttribute(key, input.getAttribute(key) + editorParams.elementAttributes["+" + key]);
			}else{
				input.setAttribute(key, editorParams.elementAttributes[key]);
			}
		}
	}

	input.value = typeof cellValue !== "undefined" ? cellValue : "";

	onRendered(function(keyboardValue){
		if(cell.getType() === "cell"){
			input.focus({preventScroll: true});
			input.style.height = "100%";
			if (keyboardValue) {
				input.value = keyboardValue
			}
			if(editorParams.selectContents){
				input.select();
			}
		}
	});

	function onChange(e){
		if(((cellValue === null || typeof cellValue === "undefined") && input.value !== "") || input.value !== cellValue){
			if(success(input.value)){
				cellValue = input.value; //persist value if successfully validated incase editor is used as header filter
			}
		}else{
			cancel();
		}
	}

	//submit new value on blur or change
	input.addEventListener("change", onChange);
	input.addEventListener("blur", onChange);

	//submit new value on enter
	input.addEventListener("keydown", function(e){
		console.log('e.keyCode', e.keyCode)
		switch(e.keyCode){
			// case 9:
				case 39:
					if (!input.value || input.selectionStart === input.value.length) {
						e.preventDefault()
						onChange(e)
					}
					break
				case 37:
					if (input.selectionStart === 0) {
						e.preventDefault()
						onChange(e)
					}
					break
			case 13:
				onChange(e);
				break;

			case 27:
				cancel();
				break;

			case 35:
			case 36:
				e.stopPropagation();
				break;
		}
	});

	if(editorParams.mask){
		maskInput(input, editorParams);
	}

	return input;
}