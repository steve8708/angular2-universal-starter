import { Directive } from 'angular2/core';

@Directive({
    selector: '[fadeIn]',
    host: {
      '(load)': 'addFadeClass = false',
      '[class.fade]': 'addFadeClass'
    }
})

export class FadeIn {
  private addFadeClass = true;
}
