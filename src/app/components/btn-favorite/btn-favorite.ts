import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-btn-favorite',
  imports: [],
  templateUrl: './btn-favorite.html',
  styleUrl: './btn-favorite.scss',
})
export class BtnFavorite {
  @Output() changeFavoriteEvt = new EventEmitter<{ state: boolean; recipeId: string }>();

  @Input() isFavorite = false;
  @Input() recipeId!: string;
  @Input() disabled = false;

  onChange() {
    if (this.disabled) return;
    this.changeFavoriteEvt.emit({ state: !this.isFavorite, recipeId: this.recipeId });
  }
}
