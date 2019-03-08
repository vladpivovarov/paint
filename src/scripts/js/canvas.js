


function canvasPaint(canvasBlock) {

	//-- Общие настройки холста --//
	var c = canvasBlock;
	c.width = window.innerWidth;
	c.height = window.innerHeight;
	var lineWidth = 12;
	var color = "red";
	var ctx = c.getContext("2d");
	var clears = document.querySelector(".clear");
	var saveBtn = document.querySelector(".save");
	var textBtn = document.querySelector(".modal__place");
	var textInput = document.querySelector(".modal__input");
	var fontFamily = "Verdana";
	var text = "";
	var textX = 100;
	var textY = 100;
	ctx.font = `${lineWidth}px ${fontFamily}`;
	var textSpan;


	// -- Проверим есть ли тачскрин -- //
	function is_touch_device() {
  	return 'ontouchstart' in window;
	}

	pcPaint();
	touchPaint();



	// -- Выполнится если нет тачскрина -- //
	function pcPaint() {
		console.log("pc");
		c.addEventListener("mousedown", e => {
			ctx.beginPath();
			ctx.fillStyle = color;
			ctx.strokeStyle = color;
			ctx.lineWidth = lineWidth*2;


			function mousemoveFunc(e) {
				ctx.lineTo(e.clientX, e.clientY);
				ctx.stroke();
				ctx.beginPath();
				ctx.arc(e.clientX, e.clientY, lineWidth, 0, Math.PI*2);
				
				ctx.fill();
				ctx.beginPath();
				ctx.moveTo(e.clientX, e.clientY);
			}

			function mouseupFunc(e) {
				c.removeEventListener("mousemove", mousemoveFunc);
				c.removeEventListener("mouseup", mouseupFunc);
			}

			c.addEventListener("mousemove", mousemoveFunc);
			c.addEventListener("mouseup", mouseupFunc);
		})
	}


	// -- Выполнится если есть тачскрин -- //
	function touchPaint() {
		console.log("touch");
		var lastCoords = {};

		document.addEventListener("touchstart", (e) => {
			// e.preventDefault();
			for(var i = 0; i < e.changedTouches.length; i++) {
				var touch = e.changedTouches[i];
				lastCoords[touch.identifier] = {x: touch.pageX, y: touch.pageY}
			}
		})

		document.addEventListener("touchmove", (e) => {
			// e.preventDefault();
			for(var i = 0; i < e.changedTouches.length; i++) {
				var touch = e.changedTouches[i];

				ctx.fillStyle = color;
				ctx.strokeStyle = color;
				ctx.lineWidth = lineWidth*2;

				ctx.lineTo(touch.pageX, touch.pageY);
				ctx.stroke();
				ctx.beginPath();
				ctx.arc(touch.pageX, touch.pageY, lineWidth, 0, Math.PI*2);
				
				ctx.fill();
				ctx.beginPath();
				ctx.moveTo(lastCoords[touch.identifier].x, lastCoords[touch.identifier].y);

				lastCoords[touch.identifier] = {x: touch.pageX, y: touch.pageY};

			}
		})

		document.addEventListener("touchend", touchCancel);

		function touchCancel(e) {
			for(var i = 0; i < e.changedTouches.length; i++) {
				var touch = e.changedTouches[i];
				delete lastCoords[touch.identifier];
			}
			ctx.beginPath();
		}
	}



	//-- Очищает холст --//
	function clear() {
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, c.width, c.height);
		ctx.beginPath();
		ctx.fillStyle = color;
		ctx.strokeStyle = color;
	}


	//-- Выбор цвета --//
	clears.addEventListener("click", clear);
	var colorsEl = document.querySelectorAll(".cls");
	for(let i = 0; i < colorsEl.length; i++) {
		colorsEl[i].addEventListener("click", (e) => {
			color = e.target.getAttribute("color");
			for(let i = 0; i < colorsEl.length; i++) {
				colorsEl[i].style.border = "1px solid gray"
			}
			e.target.style.border = "2px dashed white"
		})
	}

	//-- Выбор величины линии --//
	var nmr = document.querySelectorAll(".nmr");
	for(let i = 0; i < nmr.length; i++) {
		nmr[i].addEventListener("click", (e) => {
			lineWidth = e.target.textContent;
			for(let i = 0; i < nmr.length; i++) {
				nmr[i].style.border = "1px solid gray"
			}
			e.target.style.border = "2px dashed white"
		})
	}


	//-- Модальное окно --//
	var btn = document.querySelector(".settings");
	var modal = document.querySelector(".modal");
	var btnClose = document.querySelector(".modal__btn-close");

	btn.addEventListener("click", (e) => {
		e.stopPropagation();
		modal.classList.add("modal_active");
	}, true)

	btnClose.addEventListener("click", (e) => {
		modal.classList.remove("modal_active");
	})

	document.addEventListener("click", function (e) {
			if(document.querySelector(".modal_active") && e.target != btn) {
				var sizes = modal.getBoundingClientRect();
				var elTop = sizes.top;
				var elLeft = sizes.left;
				var elRight = sizes.right;
				var elBottom = sizes.bottom;
				var clickPosition;

	      if( (e.clientX < elLeft || e.clientX > elRight) || (e.clientY < elTop || e.clientY > elBottom)) {
	        modal.classList.remove("modal_active");
	      }
			}
	});


	//-- Сохранение картинки --//
	function download(){
		var link = document.createElement('a');
		link.download = 'mypicture.png';
		link.href = c.toDataURL("image/png").replace("image/png", "image/octet-stream");
		link.click();
	}

	saveBtn.addEventListener("click", (e) => {
		download();
	})

	//-- Добавление блока с текстом на страницу --//
	textBtn.addEventListener("click", (e) => {
		text = textInput.value;

		textSpan = document.createElement("span");
		var textOk = document.createElement("span");
		var textCancel = document.createElement("span");
		var iconCancel = document.createElement("i");
		var iconOk = document.createElement("i");

		textSpan.classList.add("text-canvas");
		textSpan.textContent = text;
		textSpan.style.fontSize = lineWidth + "px";
		textSpan.style.color = color;

		textSpan.appendChild(textOk);
		textOk.classList.add("text-ok");
		textOk.classList.add("text-icon");

		textSpan.appendChild(textCancel);
		textCancel.classList.add("text-cancel");
		textCancel.classList.add("text-icon");

		textCancel.appendChild(iconCancel);
		iconCancel.classList.add("fa");
		iconCancel.classList.add("fa-times");

		textOk.appendChild(iconOk);
		iconOk.classList.add("fa");
		iconOk.classList.add("fa-check");

		document.body.appendChild(textSpan);

		//-- Удаление текстового блока --//
		textCancel.addEventListener("click", (e) => {
			e.stopPropagation();
			e.target.closest(".text-canvas").remove();
		}, true);


		//-- Размещение текста в canvas --//
		textOk.addEventListener("click", (e) => {
			e.stopPropagation();
			ctx.fillStyle = color;
			ctx.font = `${lineWidth}px ${fontFamily}`;
			ctx.textAlign = "center";
			ctx.textBaseline="middle";
			ctx.fillText(text, textSpan.offsetLeft + textSpan.offsetWidth/2, textSpan.offsetTop + textSpan.offsetHeight/2);
			textCancel.click();
		}, true);


		//-- Добавление драг&дроп для блока --//
		textSpan.addEventListener("mousedown", (e) => {
			e.preventDefault();
			function cancelDrag() {
				document.removeEventListener("mouseup", cancelDrag);
				document.removeEventListener("mousemove", mousemoveDrag);
			}

			function mousemoveDrag(e) {
				e.preventDefault();
				textSpan.style.left = e.pageX - textSpan.offsetWidth  / 2 + 'px';
    		textSpan.style.top  = e.pageY - textSpan.offsetHeight / 2 + 'px';
			}

			document.addEventListener("mousemove", mousemoveDrag);
			document.addEventListener("mouseup", cancelDrag);
		});



	})


	//-- Добавление драг&дроп для блока (тачпад)--//
		document.addEventListener("touchstart", (e) => {
			if(textSpan) {
				if(e.target == textSpan) {

					function cancelDrag() {
						document.removeEventListener("touchend", cancelDrag);
						document.removeEventListener("touchmove", touchDrag);
					}

					function touchDrag(e) {
						textSpan.style.left = e.changedTouches[0].pageX - textSpan.offsetWidth  / 2 + 'px';
		    		textSpan.style.top  = e.changedTouches[0].pageY - textSpan.offsetHeight / 2 + 'px';
					}

					document.addEventListener("mousemove", touchDrag);
					document.addEventListener("touchend", cancelDrag);
				}else return;
			}
		});

			



}














export {
	canvasPaint
}