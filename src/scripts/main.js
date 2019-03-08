// подключаем файл со сторонними стилями
import "./js/style";
import "./js/device";

// подключаем js модули

import {
	canvasPaint
} from "./js/canvas";


var canvas = document.getElementById("canvas");

document.addEventListener("DOMContentLoaded", (e) => {
	canvasPaint(canvas);
})


