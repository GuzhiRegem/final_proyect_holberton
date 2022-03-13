let guideObj = {}
guideObj.update = function (time) {
	document.querySelector('#guide_head').style.top = `${-43 + Math.sin(time*0.005)*1}%`;
	document.querySelector('#guide_container').style.bottom = `${2 + Math.sin(time*0.0002)}%`;
	let armRotation = 40*(Math.sin(time*0.003)+1);
	document.querySelector('#guide_right_arm').style.transform = `rotate(${-45 - armRotation}deg)`;
	document.querySelector('#guide_left_arm').style.transform = `rotate(${armRotation*0.1}deg)`;
}