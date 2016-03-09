import { Component, NgZone, Input } from 'angular2/core';
import { ROUTER_DIRECTIVES } from 'angular2/router';
import { Http, Headers } from 'angular2/http';
import { FadeIn } from './directives/fade-in';

declare var require: any;

@Component({
  selector: 'product-cell',
  directives: [ ROUTER_DIRECTIVES /*, FadeIn */ ],
  template: require('./product-cell.html'),
  styles: [require('./product-cell.css')]
})

export class ProductCell {
  @Input()
  product: any;
}
