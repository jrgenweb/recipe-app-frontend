import { Component, EventEmitter, HostListener, Output } from '@angular/core';

@Component({
  selector: 'app-infinite-scroll-component',
  imports: [],

  template: ``,
  styles: ``,
})
export class InfiniteScrollComponent {
  @Output() onScrollEvent = new EventEmitter<boolean>();

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event) {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.offsetHeight;

    if (scrollTop + windowHeight >= docHeight - 200) {
      this.onScrollEvent.emit(true);
    }
  }
}
