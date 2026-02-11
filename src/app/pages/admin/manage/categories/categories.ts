import { Component, computed, effect, inject, signal } from '@angular/core';

import { AsyncPipe } from '@angular/common';

import { IRecipeCategory } from '@recipe/shared';

import { ConfirmModal } from '../../../../components/confirm-modal/confirm-modal';
import { AddCategoryModal } from '../../../../features/admin/features/categories/components/add-category-modal/add-category-modal';
import { InfiniteScroll } from '../../../../components/infinite-scroll/infinite-scroll';
import { Spinner } from '../../../../components/spinner/spinner';

import { AdminCategoryStore } from '../../../../features/admin/features/categories/stores/admin-category.store';

@Component({
  selector: 'app-categories',
  imports: [ConfirmModal, AddCategoryModal, InfiniteScroll, Spinner],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class Categories {
  isConfirmModalShow = false;
  isOpenAddCategoryModal = false;
  selectedCategory?: IRecipeCategory;
  public store: AdminCategoryStore = inject(AdminCategoryStore);

  isShowDeleteConfirm = signal(false);
  searchString = signal('');
  scrollSignal = signal(false);

  // Computed view model

  private changeFilter() {
    this.searchString();
    this.store.reset();
    this.store.loadAll(this.searchString());
  }

  constructor() {
    this.changeFilter();
  }
  /* 
  loadMore(inf: InfiniteScroll) {
    this.loadNext(inf);
    inf.done();
  }
  loadNext(inf?: InfiniteScroll) {
    this.categoryService.loadNext(this.searchString());
    if (!this.categoryService.isLoading) {
      inf?.done();
    }
  } */
  changeSearchString(searchString: string) {
    this.searchString.set(searchString);
    this.changeFilter();
  }
  showDeleteConfirm(category: IRecipeCategory) {
    this.selectedCategory = category;
    this.isConfirmModalShow = true;
  }
  onDeleteConfirm(state: boolean) {
    if (state && this.selectedCategory) {
      this.store.delete(this.selectedCategory.id);
    }
    this.isConfirmModalShow = false;
  }
  openAddCategoryModal(category?: IRecipeCategory) {
    if (category) this.selectedCategory = category;
    this.isOpenAddCategoryModal = true;
  }
}
