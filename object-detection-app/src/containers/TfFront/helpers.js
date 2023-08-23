export const cropToCanvas = (image, canvas, ctx) => {
  const naturalWidth = image.naturalWidth;
  const naturalHeight = image.naturalHeight;

  canvas.width = image.width;
  canvas.height = image.height;

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  if (naturalWidth > naturalHeight) {
    ctx.drawImage(
      image,
      (naturalWidth - naturalHeight) / 2,
      0,
      naturalHeight,
      naturalHeight,
      0,
      0,
      ctx.canvas.width,
      ctx.canvas.height
    );
  } else {
    ctx.drawImage(
      image,
      0,
      (naturalHeight - naturalWidth) / 2,
      naturalWidth,
      naturalWidth,
      0,
      0,
      ctx.canvas.width,
      ctx.canvas.height
    );
  }
};

export const sendImageChange = (e, model) => {
  const c = document.getElementById("canvas");
  const ctx = c.getContext("2d");
  cropToCanvas(e.target, c, ctx);
  model.detect(c).then(predictions => {
    // Font options.
    const font = "16px sans-serif";
    ctx.font = font;
    ctx.textBaseline = "top";

    predictions.forEach(prediction => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      const width = prediction.bbox[2];
      const height = prediction.bbox[3];
      // Draw the bounding box.
      ctx.strokeStyle = "#00FFFF";
      ctx.lineWidth = 4;
      ctx.strokeRect(x, y, width, height);
      // Draw the label background.
      ctx.fillStyle = "#00FFFF";
      const textWidth = ctx.measureText(prediction.class).width;
      const textHeight = parseInt(font, 10); // base 10
      ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
    });

    predictions.forEach(prediction => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      // Draw the text last to ensure it's on top.
      ctx.fillStyle = "#000000";
      ctx.fillText(prediction.class, x, y);
    });
  });
};
