import { Component, ElementRef, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { IRecipeImage } from '@recipe/shared';

@Component({
  selector: 'app-recipe-gallery',
  imports: [],
  templateUrl: './recipe-gallery.html',
  styleUrl: './recipe-gallery.scss',
})
export class RecipeGallery implements OnInit {
  ngOnInit(): void {}
  @Input() items!: IRecipeImage[];
  @Input() title!: string;

  @ViewChildren('thumb')
  thumbs!: QueryList<ElementRef>;
  activeIndex = 0;

  prev() {
    if (this.activeIndex > 0) {
      this.activeIndex--;
      setTimeout(() => this.scrollToActive());
    }
  }

  next() {
    if (this.activeIndex < this.items.length - 1) {
      this.activeIndex++;
      setTimeout(() => this.scrollToActive());
    }
  }

  setActive(index: number) {
    this.activeIndex = index;
    setTimeout(() => this.scrollToActive());
  }

  private scrollToActive() {
    const el = this.thumbs.get(this.activeIndex);
    el?.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }
}
