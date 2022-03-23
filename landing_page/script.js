downloadingImage = document.querySelector("#background-map");
while (!downloadingImage.complete) { continue };
let timer001 = setTimeout(function () {
  downloadingImage.style.opacity = "100%"
  document.querySelector("#main-logo").style.opacity = "100%";
  document.querySelector("#main-logo").style.transform = "scale(1.0)";
}, 1000);
