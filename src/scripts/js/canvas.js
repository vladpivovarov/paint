


function canvasPaint(canvasBlock) {



	var c = canvasBlock;
	c.width = window.innerWidth;
	c.height = window.innerHeight;
	var lineWidth = 5;
	var color = "red";
	var ctx = c.getContext("2d");
	var clears = document.querySelector(".clear");

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


	function clear() {
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, c.width, c.height);
		ctx.beginPath();
		ctx.fillStyle = color;
		ctx.strokeStyle = color;
	}

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



	var btn = document.querySelector(".settings");
	var modal = document.querySelector(".modal");
	var btnClose = document.querySelector(".modal__btn-close");

	btn.addEventListener("click", (e) => {
		modal.classList.add("modal_active");
	})

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




}














export {
	canvasPaint
}