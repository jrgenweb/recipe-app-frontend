import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';

import { AsyncPipe } from '@angular/common';

import { IRecipeIngredient } from '@recipe/shared';
import { toSignal } from '@angular/core/rxjs-interop';
import { ConfirmModal } from '../../../../components/confirm-modal/confirm-modal';
import { AddIngredientModal } from '../../../../features/admin/features/ingredients/components/add-ingredient-modal/add-ingredient-modal';
import { Spinner } from '../../../../components/spinner/spinner';
import { InfiniteScroll } from '../../../../components/infinite-scroll/infinite-scroll';
import { IngredientService } from '../../../../features/admin/features/ingredients/services/ingredient-service';

@Component({
  selector: 'app-ingredients',
  imports: [AsyncPipe, ConfirmModal, AddIngredientModal, InfiniteScroll, Spinner],
  templateUrl: './ingredients.html',
  styleUrl: './ingredients.scss',
})
export class Ingredients implements OnInit {
  isConfirmModalShow = false;
  isOpenAddIngredientModal = false;
  selectedIngredient?: IRecipeIngredient;

  public ingredientService: IngredientService = inject(IngredientService);

  searchString = signal('');
  scrollSignal = signal(false);

  ingredients = toSignal(this.ingredientService.ingredients$, { initialValue: [] });

  isShowDeleteConfirm = signal(false);

  // Computed view model
  vm = computed(() => ({
    searchString: this.searchString(),
    ingredients: this.ingredients(),
    loading: this.ingredientService.isLoading,
    hasResults: this.ingredients().length > 0,
  }));

  constructor() {}

  ngOnInit(): void {
    this.ingredientService.reset();
    this.loadNext();
  }

  private filterEffect = effect(() => {
    this.searchString();
    this.ingredientService.reset();
    this.loadNext();
  });
  // 🔥 Effect a scroll signal-re
  private scrollEffect = effect(() => {
    if (this.scrollSignal()) {
      this.loadNext();
      this.scrollSignal.set(false); // reset jelzés
    }
  });

  loadMore(inf: InfiniteScroll) {
    this.scrollSignal.set(true);
    inf.done(); // reset loading flag
  }

  loadNext() {
    this.ingredientService.loadNext(this.searchString());
  }

  changeSearchString(searchString: string) {
    this.searchString.set(searchString);
  }
  openAddIngredientModal(ingredient?: IRecipeIngredient) {
    if (ingredient) this.selectedIngredient = ingredient;
    this.isOpenAddIngredientModal = true;
  }

  onCloseAddIngredientModal() {
    this.isOpenAddIngredientModal = false;
    this.selectedIngredient = undefined;
  }

  showDeleteConfirm(ingredient: IRecipeIngredient) {
    this.selectedIngredient = ingredient;
    this.isConfirmModalShow = true;
  }
  onConfirmModal(state: boolean) {
    if (this.selectedIngredient && state) {
      this.ingredientService
        .delete(this.selectedIngredient.id)
        .subscribe({ next: () => {}, error: () => {} });
    }
    this.isConfirmModalShow = false;
  }
}
