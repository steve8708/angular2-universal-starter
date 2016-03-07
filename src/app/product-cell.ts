import { Component, NgZone, Input } from 'angular2/core';
import { ROUTER_DIRECTIVES } from 'angular2/router';
import { Http, Headers } from 'angular2/http';

declare var require: any;

@Component({
  selector: 'product-cell',
  directives: [ ROUTER_DIRECTIVES ],
  template: require('./product-cell.html'),
  styles: [require('./product-cell.css')]
})

export class ProductCell {
  @Input()
  product: any;

  constructor() {

  }

  onClick() {

  }
}
