import { useOnDraw } from "../../hooks/canvasHooks.js";
import { onDraw } from "./ChatUtils/canvasUtils.js";

const Canvas = ({ width, height }) => {
  const { setCanvasRef, onCanvasMouseDown } = useOnDraw(onDraw);

  return (
    <canvas
      width={width}
      height={height}
      onMouseDown={onCanvasMouseDown}
      style={canvasStyle}
      ref={setCanvasRef}></canvas>
  );
};

export default Canvas;

const canvasStyle = {
  border: "1px solid black",
  backgroundColor: "white",
};
