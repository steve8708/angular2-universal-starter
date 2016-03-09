import { Component, Input, HostBinding, EventEmitter, Output } from 'angular2/core';
import { ROUTER_DIRECTIVES } from 'angular2/router';
import * as _ from 'lodash';

console.log('HI');

@Component({
  selector: 'search-filters',
  template: require('./search-filters.html'),
  styles: [ require('./search-filters.css') ],
  directives: [ ROUTER_DIRECTIVES ],
})

export class SearchFilters {
  @Input()
  @HostBinding('class.show')
  show = false;

  @Output()
  update = new EventEmitter();
}
