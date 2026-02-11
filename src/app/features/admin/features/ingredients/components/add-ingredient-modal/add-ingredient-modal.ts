import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  ICreateRecipeIngredient,
  IRecipeIngredient,
  IUpdateRecipeIngredient,
} from '@recipe/shared';

import { AdminIngredientStore } from '../../stores/admin-ingredient.store';

@Component({
  selector: 'app-add-ingredient-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './add-ingredient-modal.html',
  styleUrl: './add-ingredient-modal.scss',
})
export class AddIngredientModal implements OnChanges {
  @Input() ingredient?: IRecipeIngredient;
  @Input() isOpen = false;
  @Output() confirmEvt = new EventEmitter<boolean>();
  ingredientForm!: FormGroup;

  public ingredientStore = inject(AdminIngredientStore);
  constructor() {}
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
    this.confirmEvt.emit(false);
  }
  onSubmit() {
    this.ingredientForm.markAllAsTouched();
    const { name, unit } = this.ingredientForm.value;

    if (this.ingredientForm.valid) {
      //update
      if (this.ingredient) {
        const updatedIngredient: IUpdateRecipeIngredient = {
          name,
          unit,
        };

        this.ingredientStore.update(this.ingredient.id, updatedIngredient);
      } else {
        //add
        const newIngredient: ICreateRecipeIngredient = { name, unit };
        this.ingredientStore.create(newIngredient);
      }
    }
    this.ingredient = undefined;
    this.isOpen = false;
    this.confirmEvt.emit(true);
  }
}
