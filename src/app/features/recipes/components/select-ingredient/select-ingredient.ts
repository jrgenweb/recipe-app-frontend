import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
  ViewChild,
  signal,
  computed,
  inject,
  effect,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { IRecipeIngredient } from '@recipe/shared';

import { InfiniteScroll } from '../../../../components/infinite-scroll/infinite-scroll';
import { IngredientStore } from '../../../ingredients/stores/ingredient.store';

@Component({
  selector: 'app-select-ingredient',
  templateUrl: './select-ingredient.html',
  styleUrl: './select-ingredient.scss',
})
export class SelectIngredient {
  @ViewChild('selectIngredientEl') selectIngredientEl!: ElementRef;
  @Output() ingredientChanged = new EventEmitter<IRecipeIngredient[]>();

  public ingredientStore = inject(IngredientStore);

  // 🔥 HTTP → signal (auto unsubscribe)
  //ingredients = toSignal(this.ingredientService.ingredients$, { initialValue: [] });

  searchString = signal('');

  isShow = signal(false);

  constructor() {
    effect(() => {
      const search = this.searchString();

      this.ingredientStore.updateFilter(search);
    });
  }

  viewModel = computed(() => {
    const selectedIds = new Set(this.ingredientStore.selectedIngredients().map((s) => s.id));
    const ingredients = this.ingredientStore.ingredients();

    return {
      ingredients,
      hasResults: ingredients.length > 0,
      hasSearch: this.searchString().length > 0,
      hasSelected: selectedIds.size > 0,
      isOpen: this.isShow() && ingredients.length > 0,
    };
  });
  /* 
  loadMore(_inf: InfiniteScroll) {
    this.ingredientService.loadNext();
  } */
  onAdd(ingredient: IRecipeIngredient) {
    this.ingredientStore.addSelected(ingredient);
    this.searchString.set('');
    this.isShow.set(false);
    this.emit();
  }

  onRemove(id: string) {
    this.ingredientStore.removeSelected(id);
    this.emit();
  }

  handleBackspace() {
    if (!this.searchString() && this.ingredientStore.selectedIngredients().length) {
      this.ingredientStore.removeSelected(
        this.ingredientStore.selectedIngredients()[
          this.ingredientStore.selectedIngredients().length - 1
        ].id,
      );
      this.emit();
    }
  }

  clear() {
    this.searchString.set('');
    this.ingredientStore.resetSelected();
    this.emit();
  }

  private emit() {
    this.ingredientChanged.emit(this.ingredientStore.selectedIngredients());
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.selectIngredientEl?.nativeElement?.contains(event.target)) {
      this.isShow.set(false);
    }
  }
}
