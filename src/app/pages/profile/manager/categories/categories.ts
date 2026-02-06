import { Component, OnInit } from '@angular/core';

import { AsyncPipe } from '@angular/common';

import { AddCategoryModal } from './add-category-modal/add-category-modal';
import { ConfirmModal } from '../../../../components/confirm-modal/confirm-modal';

import { CategoryService } from '../../../../shared/services/category-service';
import { IRecipeCategory } from '@recipe/shared';
import { ToastService } from '../../../../shared/services/toast-service';

@Component({
  selector: 'app-categories',
  imports: [AsyncPipe, ConfirmModal, AddCategoryModal],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class Categories implements OnInit {
  isConfirmModalShow = false;
  isOpenAddCategoryModal = false;
  selectedCategory?: IRecipeCategory;
  constructor(
    public categoryService: CategoryService,
    private toastService: ToastService,
  ) {}
  ngOnInit(): void {
    this.categoryService.getAll();
  }

  showDeleteConfirm(category: IRecipeCategory) {
    this.selectedCategory = category;
    this.isConfirmModalShow = true;
  }
  onDeleteConfirm(state: boolean) {
    if (state && this.selectedCategory) {
      this.categoryService.delete(this.selectedCategory.id);
    }
  }
  openAddCategoryModal(category?: IRecipeCategory) {
    if (category) this.selectedCategory = category;
    this.isOpenAddCategoryModal = true;
  }
}
