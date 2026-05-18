import { useEffect, useRef } from 'react';
import type { RoboflowPrediction } from '../types/roboflow';

interface AnnotatedImageProps {
  imageFile: File | null;
  predictions: RoboflowPrediction[];
  newPredictions?: RoboflowPrediction[];
  originalWidth?: number;
  originalHeight?: number;
}

const CANVAS_W = 800;
const CANVAS_H = 500;

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawBox(
  ctx: CanvasRenderingContext2D,
  pred: RoboflowPrediction,
  color: string,
  scaleX: number,
  scaleY: number,
) {
  const bx = (pred.x - pred.width / 2) * scaleX;
  const by = (pred.y - pred.height / 2) * scaleY;
  const bw = pred.width * scaleX;
  const bh = pred.height * scaleY;

  // Soft fill
  ctx.fillStyle = color + '22';
  ctx.fillRect(bx, by, bw, bh);

  // Border
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.strokeRect(bx, by, bw, bh);

  // Corner accents — 10px L-shapes, 3px stroke
  const cs = 10;
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;

  // Top-left
  ctx.beginPath();
  ctx.moveTo(bx, by + cs);
  ctx.lineTo(bx, by);
  ctx.lineTo(bx + cs, by);
  ctx.stroke();
  // Top-right
  ctx.beginPath();
  ctx.moveTo(bx + bw - cs, by);
  ctx.lineTo(bx + bw, by);
  ctx.lineTo(bx + bw, by + cs);
  ctx.stroke();
  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(bx + bw, by + bh - cs);
  ctx.lineTo(bx + bw, by + bh);
  ctx.lineTo(bx + bw - cs, by + bh);
  ctx.stroke();
  // Bottom-left
  ctx.beginPath();
  ctx.moveTo(bx + cs, by + bh);
  ctx.lineTo(bx, by + bh);
  ctx.lineTo(bx, by + bh - cs);
  ctx.stroke();

  // Label pill
  const confPct = `${Math.round(pred.confidence * 100)}%`;
  const txt = `${pred.class}  ${confPct}`;
  ctx.font = '600 11px "DM Sans", sans-serif';
  const tw = ctx.measureText(txt).width;
  const ph = 20;
  const pv = 6;
  const pr = 4;
  const lx = bx;
  const ly = by - ph - 4;

  if (ly >= 0) {
    ctx.fillStyle = color;
    roundRect(ctx, lx, ly, tw + ph, ph + pv, pr);
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.fillText(txt, lx + ph / 2, ly + ph - 3);
  }
}

export default function AnnotatedImage({
  imageFile,
  predictions,
  newPredictions = [],
  originalWidth = CANVAS_W,
  originalHeight = CANVAS_H,
}: AnnotatedImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scaleX = CANVAS_W / originalWidth;
    const scaleY = CANVAS_H / originalHeight;

    const paint = () => {
      predictions.forEach(p => drawBox(ctx, p, '#3b82f6', scaleX, scaleY));
      newPredictions.forEach(p => drawBox(ctx, p, '#f43f5e', scaleX, scaleY));
    };

    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, CANVAS_W, CANVAS_H);
        paint();
        URL.revokeObjectURL(url);
      };
      img.src = url;
    } else {
      // Demo placeholder background
      const grad = ctx.createLinearGradient(0, 0, CANVAS_W, CANVAS_H);
      grad.addColorStop(0, '#141b2e');
      grad.addColorStop(1, '#0d1220');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      ctx.font = '500 14px "DM Sans", sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      ctx.textAlign = 'center';
      ctx.fillText(
        'Sample visualization — upload a photo for real results',
        CANVAS_W / 2,
        CANVAS_H / 2 - 10,
      );
      ctx.textAlign = 'left';

      paint();
    }
  }, [imageFile, predictions, newPredictions, originalWidth, originalHeight]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  );
}
