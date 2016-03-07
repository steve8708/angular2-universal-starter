import { Http } from 'angular2/http';
import { Component } from 'angular2/core';
import { ROUTER_DIRECTIVES, Router, Location, RouteParams } from 'angular2/router';
import { FORM_DIRECTIVES } from 'angular2/common';

const SERVER = typeof self === 'undefined' && typeof window === 'undefined';

@Component({
  selector: 'header',
  directives: [ ROUTER_DIRECTIVES, FORM_DIRECTIVES ],
  template: require('./header.html'),
  styles: [ require('./header.css') ],
})

export class Header {
  clientLoaded = !SERVER;
  searchBarText = '';

  constructor(private router: Router) {
    // TODO: keep search text in bar
  }

  search(text = this.searchBarText) {
    this.router.navigate(['Home', { fts: text }]);
  }
}
