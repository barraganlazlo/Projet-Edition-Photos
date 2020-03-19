function loadImage(src) {
  let img = new Image();
  img.onload = DrawInContext;
  img.onerror = () => {
    console.error("error loading image : " + src)
  };
  img.src = src;
  keyPoints = [];
  return img;
}

function getImageData(ctx, img) {
  let w = img.width;
  let h = img.height;
  drawImage(ctx, img);
  return ctx.getImageData(0, 0, w, h);
}