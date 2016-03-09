import { Http } from 'angular2/http';
import { Component, NgZone } from 'angular2/core';
import { RouteParams, OnActivate, ROUTER_DIRECTIVES } from 'angular2/router';
import { ProductCell } from './../product-cell';
import { Spinner } from './../spinner/spinner';

// TODO: webpack define plugin
const SERVER = typeof self === 'undefined' && typeof window === 'undefined';

@Component({
  selector: 'product-page',
  template: require('./product-page.html'),
  styles: [ require('./product-page.css') ],
  directives: [ ProductCell, Spinner, ROUTER_DIRECTIVES ],
})

export class ProductPage implements OnActivate {
  product: any;
  relatedProducts: any[];
  images: any[];
  productObservable: any;
  loading = false;
  activateResolve: Function;
  activatePromise = new Promise(resolve => {
    this.activateResolve = resolve;
  });

  guidedSearches = [
    { text: 'Women' },
    { text: 'Men' },
    { text: 'Kids' },
    { text: 'Home' },
    { text: 'Bags' },
    { text: 'Shoes' },
    { text: 'Bridal' },
    { text: 'Denim' },
    { text: 'Accessories' },
    { text: 'Activewear' },
    { text: 'Outerwear' },
    { text: 'Swimwear' },
    { text: 'Jackets' },
    { text: 'Pants' },
    { text: 'Petites' },
    { text: 'Plus Sizes' },
    { text: 'Shorts' },
  ];

  constructor(
    private routeParams: RouteParams,
    private http: Http,
    private ngZone: NgZone
  ) {
    this.getProduct();
  }

  // TODO: 404, etc
  getProduct() {
    const productId = this.routeParams.get('id');

    this.loading = true;
    this.productObservable = this
      .http
      .get(`https://www.shopstyleqa.com/api/v2/site/product/${productId}?pid=shopstyle&limit=50&view=angular`);

    this.productObservable.subscribe((res) => {
      this.ngZone.run(() => {
        this.loading = false;
        const json = res.json();
        this.product = json.product;
        this.relatedProducts = json.relatedProducts;
        this.images = [this.product.image].concat(this.product.alternateImages || []);
        setTimeout(this.activateResolve, 2);
      });
    });
  }

  routerOnActivate() {
    return this.activatePromise;
  }
}
