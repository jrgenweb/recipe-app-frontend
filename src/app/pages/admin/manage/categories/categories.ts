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

  constructor() {
    this.store.loadAll();
  }

  loadMore(inf: InfiniteScroll) {
    this.store.loadNext();
    inf.done();
  }

  changeSearchString(search: string) {
    this.store.updateFilter({ search });
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
    if (category) {
      this.selectedCategory = category;
    } else {
      this.selectedCategory = undefined;
    }
    this.isOpenAddCategoryModal = true;
  }
}
