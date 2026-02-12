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

  private ingredientStore = inject(IngredientStore);

  // 🔥 HTTP → signal (auto unsubscribe)
  //ingredients = toSignal(this.ingredientService.ingredients$, { initialValue: [] });

  selectedIngredients = signal<IRecipeIngredient[]>([]);
  searchString = signal('');
  isShow = signal(false);

  //searchLower = computed(() => this.searchString().toLocaleLowerCase());

  constructor() {
    this.ingredientStore.loadAll();
    effect(() => {
      //const search = this.searchLower();
      const search = this.searchString();
      this.ingredientStore.updateFilter(search);
    });
  }

  viewModel = computed(() => {
    const selectedIds = new Set(this.selectedIngredients().map((s) => s.id));
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
    this.selectedIngredients.update((list) => [...list, ingredient]);
    this.searchString.set('');
    this.isShow.set(false);
    this.emit();
  }

  onRemove(id: string) {
    this.selectedIngredients.update((list) => list.filter((i) => i.id !== id));
    this.emit();
  }

  handleBackspace() {
    if (!this.searchString() && this.selectedIngredients().length) {
      this.selectedIngredients.update((list) => list.slice(0, -1));
      this.emit();
    }
  }

  clear() {
    this.searchString.set('');
    this.selectedIngredients.set([]);
    this.emit();
  }

  private emit() {
    this.ingredientChanged.emit(this.selectedIngredients());
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.selectIngredientEl?.nativeElement?.contains(event.target)) {
      this.isShow.set(false);
    }
  }
}
