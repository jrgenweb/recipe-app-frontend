import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { IngredientService } from '../../../../../shared/services/ingredient-service';
import {
  ICreateRecipeIngredient,
  IRecipeIngredient,
  IUpdateRecipeIngredient,
} from '@recipe/shared';

@Component({
  selector: 'app-add-ingredient-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './add-ingredient-modal.html',
  styleUrl: './add-ingredient-modal.scss',
})
export class AddIngredientModal implements OnChanges {
  @Input() ingredient?: IRecipeIngredient;
  @Input() isOpen = false;
  ingredientForm!: FormGroup;

  constructor(private ingredientService: IngredientService) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen) {
      // csak akkor inicializáljuk, ha megnyílik
      this.ingredientForm = new FormGroup({
        name: new FormControl(this.ingredient?.name || '', [
          Validators.required,
          Validators.min(1),
        ]),
        unit: new FormControl(this.ingredient?.unit || '', Validators.required),
      });
    }
  }
  onCancel() {
    this.ingredient = undefined;
    this.isOpen = false;
  }
  onSubmit() {
    this.ingredientForm.markAllAsTouched();
    const { name, unit } = this.ingredientForm.value;

    if (this.ingredientForm.valid) {
      //update
      this.isOpen = false;
      if (this.ingredient) {
        const updatedIngredient: IUpdateRecipeIngredient = {
          name,
          unit,
        };

        this.ingredientService
          .update(updatedIngredient, this.ingredient.id)
          .subscribe((resp) => {});
      } else {
        //add
        const newIngredient: ICreateRecipeIngredient = { name, unit };
        this.ingredientService.create(newIngredient);
      }
      this.isOpen = false;
    }
  }
}
