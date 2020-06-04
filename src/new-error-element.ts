
import { scheduleMeasure } from './measure';

export class NewErrorElement {
  public readonly element: HTMLElement;
  constructor(
  ) { this.element = document.createElement('div'); }

  public createMsgElement(msg: string) {
    this.element.style.textAlign = 'center';
    this.element.insertAdjacentHTML('beforeend', `<span class="flash flash-error is-error">Beaudar: ${msg}</span><br>`);
    document.body.appendChild(this.element);
    scheduleMeasure();
  }
}
