import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-rating-modal',
  imports: [],
  templateUrl: './rating-modal.html',
  styleUrl: './rating-modal.scss',
})
export class RatingModal implements OnInit, OnChanges {
  @Input() disabled = false;
  @Input() avgRate: number = 0;
  @Input() recipeId!: string;
  @Input() isModalOpen = false;
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

  openModal(): void {
    if (!this.disabled) {
      this.isModalOpen = true;
    }
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.hover = 0;
  }

  setRating(rate: number): void {
    this.changeRateEvt.emit({ recipeId: this.recipeId, rate: rate });
    this.closeModal();
  }

  onHover(star: number): void {
    this.hover = star;
  }

  onLeave(): void {
    this.hover = 0;
  }
}
