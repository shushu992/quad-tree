import { setupCounter } from './counter.ts';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
      <button id="counter" type="button"></button>
`;

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!);
