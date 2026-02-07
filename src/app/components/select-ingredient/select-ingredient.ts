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
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { IngredientService } from '../../shared/services/ingredient-service';
import { IRecipeIngredient } from '@recipe/shared';
import { InfiniteScroll } from '../infinite-scroll/infinite-scroll';

@Component({
  selector: 'app-select-ingredient',
  templateUrl: './select-ingredient.html',
  styleUrl: './select-ingredient.scss',
})
export class SelectIngredient {
  @ViewChild('selectIngredientEl') selectIngredientEl!: ElementRef;
  @Output() ingredientChanged = new EventEmitter<IRecipeIngredient[]>();
  private ingredientService = inject(IngredientService);
  // 🔥 HTTP → signal (auto unsubscribe)
  ingredients = toSignal(this.ingredientService.ingredients$, { initialValue: [] });

  selectedIngredients = signal<IRecipeIngredient[]>([]);
  searchString = signal('');
  isShow = signal(false);

  constructor() {
    this.ingredientService.getAll();
  }

  viewModel = computed(() => {
    const search = this.searchString().toLowerCase();
    const selectedIds = new Set(this.selectedIngredients().map((s) => s.id));

    const ingredients = this.ingredients()
      .filter((i) => i.name.toLowerCase().includes(search) && !selectedIds.has(i.id))
      .slice(0, 8);

    return {
      ingredients,
      hasResults: ingredients.length > 0,
      hasSearch: search.length > 0,
      hasSelected: selectedIds.size > 0,
      isOpen: this.isShow() && ingredients.length > 0,
    };
  });

  loadMore(_inf: InfiniteScroll) {
    this.ingredientService.loadNext();
  }
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
