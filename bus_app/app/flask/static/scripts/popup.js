const popupObj = {
  obj: document.querySelector('#popup')
};
popupObj.setSize = function () {
  let num = 0;
  if (window.innerHeight > window.innerWidth) {
    num = 1;
  }
  if (num) {
    this.obj.style.top = "auto";
    this.obj.style.left = "10px";
    this.obj.style.width = 'auto';
    this.obj.style.height = '30%';
    if (map) {
      map.setPadding({
        bottom: window.innerHeight * 0.3,
        left: 0,
        right: 0,
        top: 0
      });
    }
  } else {
    this.obj.style.top = "10px";
    this.obj.style.left = "auto";
    this.obj.style.width = '30%';
    this.obj.style.height = 'auto';
    if (map) {
      map.setPadding({
        bottom: 0,
        left: 0,
        right: window.innerWidth * 0.3,
        top: 0
      });
    }
  }
}
window.addEventListener('resize', function () {
  popupObj.setSize();
});