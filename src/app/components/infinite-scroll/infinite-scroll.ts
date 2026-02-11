import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-infinite-scroll',
  imports: [],

  template: '<div #anchor style="height: 1px;"></div>',
  styles: '',
})
export class InfiniteScroll implements AfterViewInit, OnDestroy {
  @ViewChild('anchor') anchor!: ElementRef;

  @Output() loadMore = new EventEmitter<InfiniteScroll>();

  private observer!: IntersectionObserver;
  private loading = false;

  ngAfterViewInit() {
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !this.loading) {
          this.loading = true;
          this.loadMore.emit(this);
        }
      },
      {
        root: null,
        rootMargin: '200px', // előbb triggerel
        threshold: 0,
      },
    );

    this.observer.observe(this.anchor.nativeElement);
    requestAnimationFrame(() => {
      const rect = this.anchor.nativeElement.getBoundingClientRect();
      if (rect.top < window.innerHeight + 200) {
        this.loading = true;
        this.loadMore.emit(this);
      }
    });
  }

  done() {
    // parent hívja amikor kész a load
    this.loading = false;
  }

  ngOnDestroy() {
    this.observer.disconnect();
  }
}

// Ha már a képernyőn van az anchor, azonnal triggereljünk
