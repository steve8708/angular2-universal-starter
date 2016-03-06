import { Component, NgZone } from 'angular2/core';
import { NgIf } from 'angular2/common';
import { Http, Headers } from 'angular2/http';
import { ProductCell } from './product-cell';

declare var require: any;
declare var zone;

@Component({
  selector: 'preboot-page',
  directives: [ProductCell],
  template: require('./home.html'),
  styles: [require('./home.css')]
})

export class Home {
  name = 'World';
  messagePreboot = '';
  messageLazyLoading = '';
  products: any[];
  productsObservable = this.http
     .get('http://www.shopstyleqa.com/api/v2/products?pid=shopstyle&limit=100', {});

  constructor(private http: Http, private ngZone: NgZone) {
    setTimeout(() => this.name = 'Angular', 1000);
    this.productsObservable.subscribe(res => {
      ngZone.run(() => {
        this.products = res.json().products;
      });
    });
  }

  routerOnActivate() {
    return new Promise(resolve => {
      this.productsObservable.subscribe(() => setTimeout(resolve, 100));
    });
  }

  onCheckPreboot() {
    console.log('Check preboot');
    this.messagePreboot = 'Preboot is working';
  }

  onCheckLazyLoading() {
    require.ensure([], () => {
      const greeter = require('./greeter.ts');
      this.messageLazyLoading = greeter.greet();
    });
  }
}
