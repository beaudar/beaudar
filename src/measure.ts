import { ResizeMessage } from './type-declare';

let hostOrigin: string;

export const startMeasuring = (origin: string) => {
  hostOrigin = origin;
  addEventListener('resize', scheduleMeasure);
  addEventListener('load', scheduleMeasure);
};

let lastHeight = -1;

const measure = () => {
  const height = document.body.scrollHeight;
  if (height === lastHeight) {
    return;
  }
  lastHeight = height;
  const message: ResizeMessage = { type: 'resize', height };
  parent.postMessage(message, hostOrigin);
};

let lastMeasure = 0;

export const scheduleMeasure = () => {
  const now = Date.now();
  if (now - lastMeasure > 50) {
    lastMeasure = now;
    setTimeout(measure, 50);
  }
};
