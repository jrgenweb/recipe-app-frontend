import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-rating',
  imports: [],
  templateUrl: './rating.html',
  styleUrl: './rating.scss',
})
export class Rating implements OnInit, OnChanges {
  @Input() disabled = false;
  @Input() avgRate: number = 0;
  @Input() recipeId!: string;
  @Output() changeRateEvt = new EventEmitter<{ recipeId: string; rate: number }>();
  maxRating = 5;
  stars: number[] = [];
  hover = 0;
  current!: number;

  ngOnInit(): void {
    for (let i = 1; i <= 5; i++) {
      this.stars.push(i);
    }
    this.current = Math.floor(this.avgRate);
  }
  ngOnChanges(): void {
    this.current = Math.floor(this.avgRate);
  }

  get displayRating(): number {
    if (this.disabled) {
      return this.current; // disablednél nincs hover
    }
    return this.hover || this.current;
  }
  setRating(rate: number) {
    this.changeRateEvt.emit({ recipeId: this.recipeId, rate: rate });
  }
  onHover(star: number) {
    this.hover = star;
  }
  onLeave() {
    this.hover = 0;
  }
}
