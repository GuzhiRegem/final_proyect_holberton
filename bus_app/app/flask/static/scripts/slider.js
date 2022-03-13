let sliderObj = {
	obj: document.querySelector('#slider_container ul'),
	container: document.querySelector('#slider_container'),
	scroll: 0,
	nodes: document.querySelectorAll('#slider_container ul li'),
	nodeIdx: 0
};
sliderObj.update = function (time) {
	console.log(sliderObj.nodes)
};
sliderObj.add = function (obj) {
	obj.style.opacity = '100%';
	sliderObj.obj.appendChild(obj);
	sliderObj.nodes = document.querySelectorAll('#slider_container ul li');
};
sliderObj.remove = function (obj) {
	obj.style.width = '0px';
	obj.style.opacity = '0%';
	obj.style.margin = 'auto 0px';
	obj.timeout = setTimeout(function () {
		sliderObj.obj.removeChild(obj);
		sliderObj.nodes = document.querySelectorAll('#slider_container ul li');
	}, 200);
};