import { Component, NgZone, Input } from 'angular2/core';
import { NgIf } from 'angular2/common';
import { Http, Headers } from 'angular2/http';

declare var require: any;

@Component({
  selector: 'product-cell',
  template: require('./product-cell.html'),
  styles: [require('./product-cell.css')]
})

export class ProductCell {
  @Input()
  product: any;

  constructor() {

  }
}
