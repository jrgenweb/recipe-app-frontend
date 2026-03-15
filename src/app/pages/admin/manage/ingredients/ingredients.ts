import {
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';

import { AsyncPipe } from '@angular/common';

import { IRecipeIngredient } from '@recipe/shared';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
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
export class Ingredients implements OnInit, OnDestroy {
  @ViewChild('inf') inf?: InfiniteScroll;
  isConfirmModalShow = false;
  isOpenAddIngredientModal = false;
  selectedIngredient?: IRecipeIngredient;

  public ingredientStore = inject(AdminIngredientStore);

  searchString = signal('');
  scrollSignal = signal(false);

  isShowDeleteConfirm = signal(false);
  loadingSubscription$ = toObservable(this.ingredientStore.isLoading).subscribe((loading) => {
    const allLoaded = this.ingredientStore.ingredients().length >= this.ingredientStore.total();
    if (!loading && !allLoaded && this.inf && !this.inf.loading) {
      requestAnimationFrame(() => this.inf!.checkAnchor());
    }
  });
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
    this.ingredientStore.loadNext(this.searchString().toLowerCase());
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
  ngOnDestroy() {
    this.loadingSubscription$.unsubscribe();
  }
}
