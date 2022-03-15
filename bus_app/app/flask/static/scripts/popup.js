const popupObj = {
  obj: document.querySelector('#popup'),
  show: 0
};
popupObj.setSize = function () {
  let num = 0;
  const radio = window.innerHeight / window.innerWidth;
  if (radio > 1) {
    num = 1;
  }
  cameraObj.zoomObjective = 17 - Math.abs(radio - 1);
  if (num) {
    this.obj.style.top = 'auto';
    this.obj.style.left = '10px';
    this.obj.style.width = 'auto';
    this.obj.style.height = `${30 * this.show}%`;
    if (cameraObj) {
      cameraObj.padding = {
        bottom: window.innerHeight * 0.3 * this.show,
        right: 0,
        left: 0,
        top: 0
      };
    }
  } else {
    this.obj.style.top = '10px';
    this.obj.style.left = 'auto';
    this.obj.style.width = `${30 * this.show}%`;
    this.obj.style.height = 'auto';
    if (cameraObj) {
      cameraObj.padding = {
        bottom: 0,
        left: 0,
        right: window.innerHeight * 0.3 * this.show,
        top: 0
      };
    }
  }
  if (!isFollowing) {
    map.easeTo({
      padding: cameraObj.padding,
      duration: 1000
    });
  }
};
popupObj.update = function () {
  this.show = 0;
  if (pointsObj.actual) {
    this.show = 1;
    this.obj.innerHTML = pointsObj.actual.content;
  }
  this.setSize();
};
window.addEventListener('resize', function () {
  popupObj.setSize();
});
