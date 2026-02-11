import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';

import { AsyncPipe } from '@angular/common';

import { IRecipeIngredient } from '@recipe/shared';
import { toSignal } from '@angular/core/rxjs-interop';
import { ConfirmModal } from '../../../../components/confirm-modal/confirm-modal';
import { AddIngredientModal } from '../../../../features/admin/features/ingredients/components/add-ingredient-modal/add-ingredient-modal';
import { Spinner } from '../../../../components/spinner/spinner';
import { InfiniteScroll } from '../../../../components/infinite-scroll/infinite-scroll';

import { AdminIngredientStore } from '../../../../features/admin/features/ingredients/stores/admin-ingredient.store';

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

  public ingredientStore = inject(AdminIngredientStore);

  searchString = signal('');
  scrollSignal = signal(false);

  isShowDeleteConfirm = signal(false);

  // Computed view model
  vm = computed(() => ({
    searchString: this.searchString(),
    ingredients: this.ingredientStore.ingredients(),
    loading: this.ingredientStore.isLoading(),
    hasResults: this.ingredientStore.ingredients().length > 0,
  }));

  constructor() {}

  ngOnInit(): void {
    this.ingredientStore.loadAll();
  }

  private filterEffect = effect(() => {
    this.searchString();
    this.ingredientStore.reset();
    this.ingredientStore.loadAll(this.searchString());
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
    this.ingredientStore.loadNext(this.searchString());
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
      this.ingredientStore.delete(this.selectedIngredient.id);
    }
    this.isConfirmModalShow = false;
  }
}
