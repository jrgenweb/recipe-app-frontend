import { Component, OnInit } from '@angular/core';

import { AsyncPipe } from '@angular/common';
import { AddIngredientModal } from './add-ingredient-modal/add-ingredient-modal';
import { ConfirmModal } from '../../../../components/confirm-modal/confirm-modal';

import { IngredientService } from '../../../../shared/services/ingredient-service';
import { IRecipeIngredient } from '@recipe/shared';

@Component({
  selector: 'app-ingredients',
  imports: [AsyncPipe, ConfirmModal, AddIngredientModal],
  templateUrl: './ingredients.html',
  styleUrl: './ingredients.scss',
})
export class Ingredients implements OnInit {
  isConfirmModalShow = false;
  isOpenAddIngredientModal = false;
  selectedIngredient?: IRecipeIngredient;

  constructor(public ingredientService: IngredientService) {}
  ngOnInit(): void {
    this.ingredientService.getAll();
  }
  openAddIngredientModal(ingredient?: IRecipeIngredient) {
    if (ingredient) this.selectedIngredient = ingredient;
    this.isOpenAddIngredientModal = true;
  }

  onDelete(id: string) {
    this.ingredientService.delete(id).subscribe({ next: () => {}, error: (err) => {} });
  }

  showDeleteConfirm(ingredient: IRecipeIngredient) {
    this.selectedIngredient = ingredient;
    this.isConfirmModalShow = true;
  }
  onConfirmModal(state: boolean) {
    if (this.selectedIngredient && state) {
      this.onDelete(this.selectedIngredient.id);
    }
  }
}
