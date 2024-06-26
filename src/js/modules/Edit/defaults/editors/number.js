import maskInput from '../../inputMask.js';

//input element with type of number
export default function (cell, onRendered, success, cancel, editorParams) {
	var cellValue = cell.getValue(),
	vertNav = editorParams.verticalNavigation || "editor",
	input = document.createElement("input");
	
	// input.setAttribute("type", "number");

	// if(typeof editorParams.max != "undefined"){
	// 	input.setAttribute("max", editorParams.max);
	// }

	// if(typeof editorParams.min != "undefined"){
	// 	input.setAttribute("min", editorParams.min);
	// }

	// if(typeof editorParams.step != "undefined"){
	// 	input.setAttribute("step", editorParams.step);
	// }

	//create and style input
	input.style.padding = "4px";
	input.style.width = "100%";
	input.style.boxSizing = "border-box";

	if (editorParams.elementAttributes && typeof editorParams.elementAttributes == "object") {
		for (let key in editorParams.elementAttributes) {
			if (key.charAt(0) == "+") {
				key = key.slice(1);
				input.setAttribute(key, input.getAttribute(key) + editorParams.elementAttributes["+" + key]);
			} else {
				input.setAttribute(key, editorParams.elementAttributes[key]);
			}
		}
	}

	input.value = cellValue || null;
	input.select()

	var blurFunc = function (e) {
		onChange();
	};

	onRendered(function (keyboardValue) {
		if (cell.getType() === "cell") {
			//submit new value on blur
			input.removeEventListener("blur", blurFunc);

			input.focus({ preventScroll: true });
			input.style.height = "100%";

			//submit new value on blur
			input.addEventListener("blur", blurFunc);
			if (keyboardValue) {
				if (!isNaN(keyboardValue) && keyboardValue !== "") {
					keyboardValue = Number(keyboardValue);
				}
				input.value = keyboardValue;
			}
			if (editorParams.selectContents) {
				input.select();
			}
		}
	});

	function onChange() {
		// var value = input.value;

		// if (!isNaN(value) && value !== "") {
		// 	value = Number(value);
		// }

		// if (value !== cellValue) {
		// 	if (success(value)) {
		// 		cellValue = value; //persist value if successfully validated incase editor is used as header filter
		// 	}
		// } else {
		// 	cancel();
		// }
		console.log('cellValue', cellValue)
		if(((cellValue === null || typeof cellValue === "undefined") && input.value !== "") || input.value !== cellValue){
			console.log('input.value', input.value)
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
	input.addEventListener("keydown", function (e) {
		switch (e.keyCode) {
			case 39:
				if (input.value === undefined || input.value === null || !input.value.length || input.selectionStart === input.value.toString().length) {
					e.preventDefault();
					onChange(e);
				}
				break;
			case 37:
				if (input.selectionStart === 0) {
					e.preventDefault();
					onChange(e);
				}
				break;
			case 13:
				// case 9:
				onChange();
				break;

			case 27:
				cancel();
				break;

			case 38: //up arrow
			case 40: //down arrow
				// if (vertNav == "editor") {
				// 	e.stopImmediatePropagation();
				// 	e.stopPropagation();
				// }
				e.preventDefault();
				onChange(e);
				break;
			case 35:
			case 36:
				e.stopPropagation();
				break;
		}
	});
	input.addEventListener('keyup', function () {
		// var integer_regexp = (/[^0-9]|^0+(?!$)/g);
		if (this.value === '') {
			return this.value = null
		}
		if (this.value === undefined || this.value === null) {
			return
		}
		var float_regexp = (/[^0-9\.]|^\.+(?!$)|^0+(?=[0-9]+)|\.(?=\.|.+\.)/g);
		if (float_regexp.test(this.value)) {
			this.value = this.value.replace(float_regexp, '');
		}
	});

	if (editorParams.mask) {
		maskInput(input, editorParams);
	}

	return input;
}