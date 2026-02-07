import { Component, computed, effect, inject, signal } from '@angular/core';

import { AsyncPipe } from '@angular/common';

import { IRecipeCategory } from '@recipe/shared';
import { ConfirmModal } from '../../../components/confirm-modal/confirm-modal';
import { AddCategoryModal } from './add-category-modal/add-category-modal';
import { CategoryService } from '../../../shared/services/category-service';

import { toSignal } from '@angular/core/rxjs-interop';
import { InfiniteScroll } from '../../../components/infinite-scroll/infinite-scroll';
import { Spinner } from '../../../components/spinner/spinner';

@Component({
  selector: 'app-categories',
  imports: [AsyncPipe, ConfirmModal, AddCategoryModal, InfiniteScroll, Spinner],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class Categories {
  isConfirmModalShow = false;
  isOpenAddCategoryModal = false;
  selectedCategory?: IRecipeCategory;
  public categoryService: CategoryService = inject(CategoryService);

  categories = toSignal(this.categoryService.categories$, { initialValue: [] });

  isShowDeleteConfirm = signal(false);
  searchString = signal('');
  scrollSignal = signal(false);

  // Computed view model
  vm = computed(() => ({
    searchString: this.searchString(),
    categories: this.categories(),
    loading: this.categoryService.isLoading,
    hasResults: this.categories().length > 0,
  }));
  private filterEffect = effect(() => {
    this.searchString();
    this.categoryService.reset();
    this.loadNext();
  });

  constructor() {}

  loadMore(inf: InfiniteScroll) {
    this.loadNext(inf);
    inf.done();
  }
  loadNext(inf?: InfiniteScroll) {
    this.categoryService.loadNext(this.searchString());
    if (!this.categoryService.isLoading) {
      inf?.done();
    }
  }
  changeSearchString(searchString: string) {
    this.searchString.set(searchString);
  }
  showDeleteConfirm(category: IRecipeCategory) {
    this.selectedCategory = category;
    this.isConfirmModalShow = true;
  }
  onDeleteConfirm(state: boolean) {
    if (state && this.selectedCategory) {
      this.categoryService.delete(this.selectedCategory.id);
    }
    this.isConfirmModalShow = false;
  }
  openAddCategoryModal(category?: IRecipeCategory) {
    if (category) this.selectedCategory = category;
    this.isOpenAddCategoryModal = true;
  }
}
