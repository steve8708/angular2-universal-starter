import { Component, Input } from 'angular2/core';

@Component({
  selector: 'spinner',
  template: require('./spinner.html'),
  styles: [ require('./spinner.css') ],
})

export class Spinner {
  @Input()
  fixed = false;

  @Input()
  relative = false;

  @Input()
  static = false;

  @Input()
  fill = false;

  @Input()
  inline = false;

  @Input()
  center = true;

  @Input()
  size = '60px';
}
