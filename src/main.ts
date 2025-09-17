const threshold_size = 80;
const threshold_count = 10;

const number_of_points = 800;
const size_of_canvas = 400;

const canvas = document.getElementsByTagName('canvas')[0] as HTMLCanvasElement;
canvas.width = size_of_canvas;
canvas.height = size_of_canvas;

canvas.style.width = `${ size_of_canvas }px`;
canvas.style.height = `${ size_of_canvas }px`;

const ctx = canvas.getContext('2d');
const points: Point[] = [];

// generate random points
for (let i = 0; i < number_of_points; i++) {
  const x = Math.floor(Math.random() * size_of_canvas);
  const y = Math.floor(Math.random() * size_of_canvas);
  points.push({ x: x, y: y });
}

const arr: QuadNode[] = [
  // root node
  {
    x: 0,
    y: 0,
    size: size_of_canvas,
  }
];

function isPointInQuad(point: Point, quad: QuadNode): boolean {
  return point.x >= quad.x
    && point.x <= quad.x + quad.size
    && point.y >= quad.y
    && point.y <= quad.y + quad.size;
}

function calculateCentroid(points: Point[]): Point {
  const sum = points.reduce(
    (acc, point) => ({ x: acc.x + point.x, y: acc.y + point.y }),
    { x: 0, y: 0 }
  );
  return {
    x: sum.x / points.length,
    y: sum.y / points.length,
  };
}

while (arr.length > 0) {
  const node = arr.pop()!;
  const inQuad = points.filter(point => isPointInQuad(point, node));

  if (inQuad.length < threshold_count) {
    for (const point of inQuad) {
      drawPoint(point, 1);
    }
    continue;
  }

  if (node.size > threshold_size) {
    arr.push({ x: node.x, y: node.y, size: node.size / 2 });
    arr.push({ x: node.x + node.size / 2, y: node.y, size: node.size / 2 });
    arr.push({ x: node.x, y: node.y + node.size / 2, size: node.size / 2 });
    arr.push({ x: node.x + node.size / 2, y: node.y + node.size / 2, size: node.size / 2 });
    continue;
  }

  drawArea(node);
  for (const point of inQuad) {
    drawPoint(point, 0.1);
  }

  const centroid = calculateCentroid(inQuad);
  drawCentroid(centroid, inQuad.length.toString());
}

function drawPoint(point: Point, opacity: number): void {
  if (ctx === null) {
    throw new Error('Could not get 2d context');
  }

  ctx.fillStyle = `rgba(0, 0, 0, ${ opacity })`;
  ctx.beginPath();
  ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
}

function drawArea(node: QuadNode): void {
  if (ctx === null) {
    throw new Error('Could not get 2d context');
  }

  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);

  ctx.fillStyle = `rgba(${ r }, ${ g }, ${ b }, 0.2)`;
  ctx.beginPath();
  ctx.rect(node.x, node.y, node.size, node.size);
  ctx.fill();
  ctx.closePath();
}

function drawCentroid(point: Point, text: string): void {
  if (ctx === null) {
    throw new Error('Could not get 2d context');
  }

  ctx.fillStyle = 'rgba(255, 0, 0, 1)';
  ctx.font = '12px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, point.x, point.y);
}
